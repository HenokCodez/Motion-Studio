#!/usr/bin/env node
// Measure an EXISTING render against the supplied transcript (use before revising a project).
// Usage: node audit-video.mjs <video.mp4> <script.txt | timeline.raw.json> [--out audit] [--step 1.5] [--from 0] [--to 99999]
// Needs ffmpeg + tesseract. Reports: text events (OCR), unknown/typo words, caption-likeness, early/late timing vs the spoken words,
// reading time, repeated openers, text coverage, longest stretch with no text, transcript spelling variants.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { importFile, lintWords } from "./import-timestamps.mjs";
import { need, norm, readJson, writeJson } from "./lib.mjs";

const a = process.argv.slice(2); const [video, tx] = a; const opt = (k, d) => { const i = a.indexOf("--" + k); return i >= 0 ? a[i + 1] : d; };
if (!video || !tx) { console.error("usage: audit-video.mjs <video> <script.txt|raw.json> [--out dir] [--step 1.5] [--from s] [--to s]"); process.exit(2); }
need("ffmpeg"); const tess = spawnSync("tesseract", ["--version"]); if (tess.error) { console.error("tesseract not found: install it (OCR is required for the audit)"); process.exit(3); }
const out = opt("out", "audit"), step = +opt("step", 1.5), t0 = +opt("from", 0), t1 = +opt("to", 99999); fs.mkdirSync(path.join(out, "f"), { recursive: true });
const words = tx.endsWith(".json") ? readJson(tx).words : importFile(tx);
const STOP = new Set("a an the and or but so to of in on at for with is are was were be been it its this that these those i you he she we they me my your our their as by from not no do does did just then than too very can could would should will".split(" "));
const toks = (t) => t.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean);
const vocab = new Set(words.flatMap((w) => toks(w.w)));
// sample frames
const dur = Math.min(t1, +spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", video], { encoding: "utf8" }).stdout);
spawnSync("ffmpeg", ["-v", "error", "-y", "-ss", String(t0), "-t", String(dur - t0), "-i", video, "-vf", `fps=1/${step},scale=1280:-1`, "-q:v", "4", path.join(out, "f", "f_%05d.jpg")]);
const files = fs.readdirSync(path.join(out, "f")).filter((f) => f.endsWith(".jpg")).sort();
const events = []; let cur = null; let ocrCalls = 0;
for (let i = 0; i < files.length; i++) {
  const r = spawnSync("tesseract", [path.join(out, "f", files[i]), "stdout", "--psm", "11"], { encoding: "utf8", timeout: 60000 }); ocrCalls++;
  // drop the placeholder box furniture line by line (FOOTAGE HERE, "Footage: ..." / "TYPE: ..." labels, scene ids, timecodes) so only the channel text is audited
  const FURN = /(footage here|screenshot here|phone clip here|art \/ figure here|^\s*footage:|^\s*[A-Z][A-Z \/-]{2,22}:\s|^\s*s\d{3}\s*$|\d+:\d+(:\d+)?\s*-\s*\d+:\d+|\(\d+(\.\d)? s\)|16:9|9:16)/i;
  const text = (r.stdout ?? "").split("\n").map((l) => l.trim()).filter((l) => l && !FURN.test(l)).join(" ").replace(/\s+/g, " ").split(" ").filter((w) => /[A-Za-z0-9]{2,}/.test(w)).join(" ");
  const n = toks(text).join(" "); const t = t0 + i * step;
  if (cur && n && (n === cur.n || (cur.n.includes(n) && n.split(" ").length >= 2) || n.includes(cur.n))) { cur.end = t + step; if (n.length > cur.n.length) { cur.n = n; cur.text = text; } }
  else { if (cur) events.push(cur); cur = n.split(" ").length >= 2 || /\d/.test(n) ? { n, text, start: t, end: t + step } : null; }
}
if (cur) events.push(cur);
const win = (s, e) => words.filter((w) => w.start >= s - 1.5 && w.start <= e + 1.5);
const lcRun = (A, B) => { let best = 0; for (let i = 0; i < A.length; i++) for (let j = 0; j < B.length; j++) { let k = 0; while (i + k < A.length && j + k < B.length && A[i + k] === B[j + k]) k++; best = Math.max(best, k); } return best; };
const rows = []; const openers = new Map(); const unknown = [];
for (const e of events) {
  const tw = e.n.split(" "); const spoken = toks(win(e.start - 6, e.end + 2).map((w) => w.w).join(" ")); const near = toks(win(e.start, e.end).map((w) => w.w).join(" "));
  const run = lcRun(tw, near); const overlap = tw.filter((w) => near.includes(w)).length / tw.length;
  const bad = tw.filter((w) => w.length >= 4 && !/^\d/.test(w) && !vocab.has(w) && !STOP.has(w) && !vocab.has(w.replace(/(ing|ed|es|s|ly)$/, "")));
  // timing: when is the first content word of this text spoken (search around the event)
  const key = tw.find((w) => !STOP.has(w) && w.length > 3); const cand = words.filter((w) => toks(w.w).includes(key) && w.start >= e.start - 8 && w.start <= e.end + 3).sort((x, y) => Math.abs(x.start - e.start) - Math.abs(y.start - e.start))[0];
  const offset = cand ? +(e.start - cand.start).toFixed(2) : null; const need = Math.max(1.2, 0.25 * tw.length + 0.6); const shown = +(e.end - e.start).toFixed(1);
  const op = tw.slice(0, 2).join(" "); openers.set(op, (openers.get(op) ?? 0) + 1); if (bad.length) unknown.push({ at: +e.start.toFixed(1), text: e.text, words: bad });
  rows.push({ start: +e.start.toFixed(1), end: +e.end.toFixed(1), text: e.text, words: tw.length, copiedRun: run, overlapPct: Math.round(overlap * 100), notInTranscript: bad, keyWord: key, spokenAt: cand ? +cand.start.toFixed(1) : null, offsetSec: offset, shownSec: shown, needSec: +need.toFixed(1), tooShort: shown + 0.05 < need });
}
const textSec = rows.reduce((s, r) => s + (r.end - r.start), 0); let gap = 0, longestGap = 0, gapAt = 0, prevEnd = t0;
for (const r of rows) { if (r.start - prevEnd > longestGap) { longestGap = r.start - prevEnd; gapAt = prevEnd; } prevEnd = r.end; } if (dur - prevEnd > longestGap) { longestGap = dur - prevEnd; gapAt = prevEnd; }
const lint = lintWords(words.map((w) => w.w), []);
const rep = [...openers].filter(([, n]) => n >= 3).sort((x, y) => y[1] - x[1]);
const summary = { analysedSec: +(dur - t0).toFixed(0), ocrFrames: ocrCalls, textEvents: rows.length, textCoveragePct: Math.round((100 * textSec) / (dur - t0)), longestNoTextSec: +longestGap.toFixed(1), longestNoTextAt: +gapAt.toFixed(1),
  captionLike: rows.filter((r) => r.copiedRun >= 4 || (r.words >= 4 && r.overlapPct > 60)).length, tooShort: rows.filter((r) => r.tooShort).length, late: rows.filter((r) => r.offsetSec !== null && r.offsetSec > 0.6).length, early: rows.filter((r) => r.offsetSec !== null && r.offsetSec < -0.5).length,
  unknownWordEvents: unknown.length, transcriptSpellingVariants: lint.unresolved.map((g) => g.map((x) => `${x.w}x${x.n}`).join("/")), repeatedOpeners: rep.map(([k, n]) => `"${k}" x${n}`) };
writeJson(path.join(out, "audit.json"), { summary, rows, unknown });
const md = ["# AUDIT " + path.basename(video), "```json", JSON.stringify(summary, null, 1), "```", "## Worst problems", ...rows.filter((r) => r.copiedRun >= 4 || r.tooShort || (r.offsetSec !== null && (r.offsetSec > 0.6 || r.offsetSec < -0.5)) || r.notInTranscript.length).slice(0, 60).map((r) => `- ${r.start}s "${r.text}" run=${r.copiedRun} overlap=${r.overlapPct}% offset=${r.offsetSec}s shown=${r.shownSec}s(need ${r.needSec}) unknown=[${r.notInTranscript}]`)].join("\n");
fs.writeFileSync(path.join(out, "AUDIT.md"), md); console.log(JSON.stringify(summary, null, 1)); console.log("wrote " + path.join(out, "AUDIT.md"));
