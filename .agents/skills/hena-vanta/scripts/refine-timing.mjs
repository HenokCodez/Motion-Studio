#!/usr/bin/env node
// Turn cue-level timing (words spread evenly inside each supplied sentence) into REAL word onsets from the audio,
// while keeping the supplied sentence boundaries authoritative (a refined word can never leave its cue's [start,end]).
// Usage: node refine-timing.mjs <timeline.raw.json> <voiceover> [model=small.en]     (needs faster-whisper)
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { alignWords, readJson, run, writeJson } from "./lib.mjs";

export const refine = (given, heard) => {
  const al = alignWords(given.map((w) => w.w), heard); let moved = 0, matched = 0; const shifts = [];
  const out = given.map((g, i) => {
    const a = al[i]; if (!a.matched) return g; matched++;
    const lo = g.cs ?? g.start, hi = g.ce ?? g.end; const s = Math.min(hi - 0.05, Math.max(lo, a.start)); const e = Math.max(s + 0.05, Math.min(hi, a.end));
    shifts.push(s - g.start); if (Math.abs(s - g.start) > 0.03) moved++; return { ...g, start: +s.toFixed(3), end: +e.toFixed(3) };
  });
  // interpolate unmatched words between their refined neighbours (inside the cue)
  for (let i = 0; i < out.length; i++) if (!al[i].matched) { let p = i - 1, n = i + 1; while (p >= 0 && !al[p].matched && out[p].cs === out[i].cs) p--; while (n < out.length && !al[n].matched && out[n].cs === out[i].cs) n++; if (p >= 0 && n < out.length && out[p].cs === out[i].cs && out[n].cs === out[i].cs) { const f = (i - p) / (n - p); out[i] = { ...out[i], start: +(out[p].start + (out[n].start - out[p].start) * f).toFixed(3) }; } }
  const abs = shifts.map(Math.abs).sort((x, y) => x - y);
  return { words: out, stats: { matched, total: given.length, moved, medianShift: abs[Math.floor(abs.length / 2)] ?? 0, p95Shift: abs[Math.floor(abs.length * 0.95)] ?? 0 } };
};
const self = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (self) {
  const [rawPath, vo, model = "small.en"] = process.argv.slice(2); if (!rawPath || !vo) { console.error("usage: refine-timing.mjs <raw.json> <voiceover> [model]"); process.exit(2); }
  const here = path.dirname(fileURLToPath(import.meta.url)); const tmp = path.join(os.tmpdir(), `hv_ref_${Date.now()}.json`);
  const r = run(process.platform === "win32" ? "python" : "python3", [path.join(here, "whisper_words.py"), vo, tmp, model]); if (r.status !== 0) { console.error("faster-whisper failed:\n" + r.stderr + "\nInstall: pip install faster-whisper"); process.exit(3); }
  const raw = readJson(rawPath); const { words, stats } = refine(raw.words, readJson(tmp).words);
  if (stats.matched / stats.total < 0.85) { console.error(`only ${stats.matched}/${stats.total} words matched the audio: the supplied script does not match this voiceover. NOT refined.`); process.exit(4); }
  writeJson(rawPath, { ...raw, words, refined: true, refineStats: stats });
  console.log(`refined ${stats.moved} of ${stats.total} word onsets (median shift ${stats.medianShift.toFixed(2)} s, 95th pct ${stats.p95Shift.toFixed(2)} s). Sentence boundaries untouched.`);
}
