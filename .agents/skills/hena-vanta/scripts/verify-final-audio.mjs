#!/usr/bin/env node
// Re-transcribe the FINAL video and diff it against the voiceover, to prove no SFX masked a word (rule borrowed from the editor-v1 skill).
// Usage: node verify-final-audio.mjs <final.mp4> <voiceover> [model=small.en]
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { alignWords, readJson, run } from "./lib.mjs";
const [fin, vo, model = "small.en"] = process.argv.slice(2);
if (!fin || !vo) { console.error("usage: verify-final-audio.mjs <final.mp4> <voiceover> [model]"); process.exit(2); }
const here = path.dirname(fileURLToPath(import.meta.url)); const py = process.platform === "win32" ? "python" : "python3";
const tx = (file, tag) => { const o = path.join(os.tmpdir(), `hv_${tag}_${Date.now()}.json`); const r = run(py, [path.join(here, "whisper_words.py"), file, o, model]); if (r.status !== 0) { console.error(r.stderr); process.exit(3); } return readJson(o).words; };
const a = tx(vo, "vo"), b = tx(fin, "final");
const al = alignWords(a.map((w) => w.w), b);
const miss = al.filter((x) => !x.matched);
const ratio = 1 - miss.length / Math.max(1, a.length);
console.log(`voiceover words ${a.length}, recovered in final ${a.length - miss.length} (${(ratio * 100).toFixed(2)}%)`);
if (miss.length) console.log("MASKED/LOST (check what plays at these times):", miss.slice(0, 40).map((m) => `${m.w}@${m.start}`).join(" "));
process.exit(ratio >= 0.98 ? 0 : 1);
