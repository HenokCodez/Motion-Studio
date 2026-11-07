#!/usr/bin/env node
// Prove the supplied timestamps match the actual voiceover audio (guards against a stale/offset script).
// Usage: node check-timing.mjs <timeline.raw.json> <voiceover> [model=small.en]   (needs faster-whisper)
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { alignWords, readJson, run } from "./lib.mjs";
const [rawPath, vo, model = "small.en"] = process.argv.slice(2);
if (!rawPath || !vo) { console.error("usage: check-timing.mjs <raw.json> <voiceover> [model]"); process.exit(2); }
const here = path.dirname(fileURLToPath(import.meta.url)); const out = path.join(os.tmpdir(), `hv_chk_${Date.now()}.json`);
const r = run(process.platform === "win32" ? "python" : "python3", [path.join(here, "whisper_words.py"), vo, out, model]); if (r.status !== 0) { console.error(r.stderr); process.exit(3); }
const heard = readJson(out).words, given = readJson(rawPath).words;
const al = alignWords(given.map((w) => w.w), heard); const diffs = [];
al.forEach((a, i) => { if (a.matched) diffs.push(given[i].start - a.start); });
diffs.sort((x, y) => x - y); const med = diffs[Math.floor(diffs.length / 2)] ?? NaN; const p95 = diffs.map(Math.abs).sort((x, y) => x - y)[Math.floor(diffs.length * 0.95)] ?? NaN;
console.log(`matched ${diffs.length}/${given.length} words; median offset ${med.toFixed(2)} s; 95th percentile |offset| ${p95.toFixed(2)} s`);
const ok = diffs.length / given.length > 0.8 && Math.abs(med) <= 0.25 && p95 <= 0.6;
console.log(ok ? "TIMING OK" : "TIMING MISMATCH: the supplied timestamps do not line up with this audio (wrong take? offset? tell the user)."); process.exit(ok ? 0 : 1);
