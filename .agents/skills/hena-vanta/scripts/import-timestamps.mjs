#!/usr/bin/env node
// Import the user's SUPPLIED time-stamped script (authoritative timing). Usage:
//   node import-timestamps.mjs --find <folder>                      # list candidate timing files next to the voiceover
//   node import-timestamps.mjs <file> <out timeline.raw.json> [--vo-duration 904.5]
// Supports: .srt, .vtt, .json (words[] | segments[] with words | [{start,end,text}]), and text lines "mm:ss text", "[00:12] text", "00:12 - text", "0:01:23.5 text".
// Cue-level timing is spread over the cue's words by character weight; word-level timing is kept exactly. Output raw.source = "supplied:<file>".
import fs from "node:fs";
import path from "node:path";
import { norm, probeDuration, writeJson } from "./lib.mjs";

/** Same-sounding words with different spellings that both occur (e.g. "Kinects" x4 vs "connects" x4) = probable recognition error. */
export const skeleton = (w) => w.toLowerCase().replace(/[^a-z]/g, "").replace(/ph/g, "f").replace(/[ckq]/g, "k").replace(/[aeiouyhw]/g, "").replace(/(.)\1+/g, "$1");
export const lintWords = (list, keep = []) => {
  const c = new Map(); for (const raw of list) { const w = raw.toLowerCase().replace(/[^a-z']/g, ""); if (w.length >= 5) c.set(w, (c.get(w) ?? 0) + 1); }
  const g = new Map(); for (const [w, n] of c) { const k = skeleton(w); if (k.length >= 4) (g.get(k) ?? g.set(k, []).get(k)).push({ w, n }); }
  const keepSet = new Set(keep.map((x) => [...x].map((y) => y.toLowerCase()).sort().join("|")));
  const groups = [...g.values()].filter((v) => v.length > 1 && v.some((x) => x.n >= 2)); const unresolved = groups.filter((v) => !keepSet.has(v.map((x) => x.w).sort().join("|")));
  return { groups, unresolved };
};
export const toSec = (s) => { const m = String(s).trim().replace(",", ".").match(/^(?:(\d+):)?(\d{1,2}):(\d{2}(?:\.\d+)?)$|^(\d{1,2}):(\d{2}(?:\.\d+)?)$|^(\d+(?:\.\d+)?)$/); if (!m) return NaN; if (m[3] !== undefined) return (+(m[1] ?? 0)) * 3600 + +m[2] * 60 + +m[3]; if (m[4] !== undefined) return +m[4] * 60 + +m[5]; return +m[6]; };
const spread = (text, a, b) => { const ws = text.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean); const wt = ws.map((w) => Math.max(1, w.length)); const tot = wt.reduce((x, y) => x + y, 0); let t = a; return ws.map((w, i) => { const d = ((b - a) * wt[i]) / tot; const o = { w, start: +t.toFixed(3), end: +(t + d * 0.92).toFixed(3), cs: +a.toFixed(3), ce: +b.toFixed(3) }; t += d; return o; }); };
export const parseCues = (txt) => { // srt / vtt
  const cues = []; const blocks = txt.replace(/\r/g, "").split(/\n\s*\n/);
  for (const b of blocks) { const lines = b.split("\n").filter(Boolean); const i = lines.findIndex((l) => l.includes("-->")); if (i < 0) continue; const [a, c] = lines[i].split("-->").map((x) => x.trim().split(/\s+/)[0]); cues.push({ start: toSec(a), end: toSec(c), text: lines.slice(i + 1).join(" ") }); }
  return cues;
};
export const parseLines = (txt) => { // "mm:ss text"
  const rows = []; for (const l of txt.replace(/\r/g, "").split("\n")) { const m = l.match(/^\s*\[?\(?((?:\d+:)?\d{1,2}:\d{2}(?:[.,]\d+)?)\]?\)?\s*[-–—:]?\s*(.+)$/); if (m && !isNaN(toSec(m[1]))) rows.push({ start: toSec(m[1]), text: m[2].trim() }); }
  return rows.map((r, i) => ({ ...r, end: rows[i + 1] ? rows[i + 1].start : r.start + Math.max(1.5, r.text.length * 0.07) }));
};
export const parseBracketCues = (txt) => { // [00:00:00.000 --> 00:00:05.080]  text   (one cue per line, whisper.cpp style)
  const cues = []; for (const l of txt.split("\n")) { const m = l.match(/^\s*\[\s*([\d:.,]+)\s*-->\s*([\d:.,]+)\s*\]\s*(.*)$/); if (m && m[3].trim()) cues.push({ start: toSec(m[1]), end: toSec(m[2]), text: m[3].trim() }); }
  return cues;
};
export const importFile = (file) => {
  const txt = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "").replace(/\r/g, ""); const ext = path.extname(file).toLowerCase();
  let words = [];
  if (ext === ".json") {
    const j = JSON.parse(txt); const segs = j.segments ?? (Array.isArray(j) ? j : null);
    if (j.words) words = j.words.map((x) => ({ w: x.w ?? x.word ?? x.text, start: +x.start, end: +x.end }));
    else if (segs) for (const s of segs) { if (s.words?.length) s.words.forEach((x) => words.push({ w: (x.w ?? x.word ?? x.text).trim(), start: +x.start, end: +x.end })); else words.push(...spread(s.text ?? s.t ?? "", +s.start, +s.end)); }
  } else if (/^\s*\[\s*[\d:.,]+\s*-->/m.test(txt)) parseBracketCues(txt).forEach((c) => words.push(...spread(c.text, c.start, c.end)));
  else if (ext === ".srt" || ext === ".vtt" || /-->/.test(txt)) parseCues(txt).forEach((c) => words.push(...spread(c.text, c.start, c.end)));
  else parseLines(txt).forEach((c) => words.push(...spread(c.text, c.start, c.end)));
  return words.filter((w) => w.w && !Number.isNaN(w.start));
};
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"))) {
  const a = process.argv.slice(2);
  if (a[0] === "--find") {
    const dir = a[1]; const c = fs.readdirSync(dir).filter((f) => /\.(srt|vtt)$/i.test(f) || /(timestamp|timecode|transcript|subtitle|caption|script).*\.(txt|json)$/i.test(f) || (/\.(txt|json)$/i.test(f) && /(\d{1,2}:\d{2}|"start"\s*:)/.test(fs.readFileSync(path.join(dir, f), "utf8").slice(0, 4000))));
    console.log(c.length ? c.map((f) => path.join(dir, f)).join("\n") : "NO timing file found next to the voiceover (then, and only then, derive timing with transcribe.mjs)"); process.exit(0);
  }
  const [file, out] = a; if (!file || !out) { console.error("usage: import-timestamps.mjs <file> <out.json> [--vo-duration s] | --find <folder>"); process.exit(2); }
  let words = importFile(file).sort((x, y) => x.start - y.start);
  // glossary: fix speech-recognition errors BEFORE anything uses the words (timing is untouched). glossary.json: {"map":{"kinects":"connects"},"keep":[["sample","simple"]]}
  const gi = a.indexOf("--glossary"); const gpath = gi >= 0 ? a[gi + 1] : path.join(path.dirname(path.resolve(file)), "glossary.json");
  const gl = fs.existsSync(gpath) ? JSON.parse(fs.readFileSync(gpath, "utf8").replace(/^\uFEFF/, "")) : { map: {}, keep: [] };
  const corrections = [];
  words = words.map((w) => { const bare = w.w.replace(/[^A-Za-z']/g, ""); const fix = gl.map?.[bare.toLowerCase()]; if (!fix) return w; const cased = bare[0] === bare[0].toUpperCase() ? fix[0].toUpperCase() + fix.slice(1) : fix; corrections.push(`${bare}->${cased}`); return { ...w, w: w.w.replace(bare, cased) }; });
  const lint = lintWords(words.map((w) => w.w), gl.keep ?? []);
  if (words.length < 5) { console.error("could not read timestamps from", file); process.exit(3); }
  const vi = a.indexOf("--vo-duration"); const voDuration = vi >= 0 ? +a[vi + 1] : words.at(-1).end;
  writeJson(out, { source: "supplied:" + path.basename(file), voDuration, words, corrections, lint });
  if (corrections.length) console.log(`glossary applied ${corrections.length}x: ${[...new Set(corrections)].join(", ")}`);
  if (lint.unresolved.length) console.log("UNRESOLVED SPELLING VARIANTS (likely speech-recognition errors; decide, add to glossary.json map or keep, re-import):\n" + lint.unresolved.map((g) => "  " + g.map((x) => `${x.w}x${x.n}`).join(" / ")).join("\n"));
  console.log(`imported ${words.length} words from ${path.basename(file)} (${words[0].start.toFixed(2)}s -> ${words.at(-1).end.toFixed(2)}s)`);
}
