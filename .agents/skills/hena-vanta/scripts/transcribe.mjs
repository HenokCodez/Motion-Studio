#!/usr/bin/env node
// Usage: node transcribe.mjs <voiceover> <script.txt> <out/timeline.raw.json> [model]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { alignWords, need, probeDuration, run, writeJson, readJson } from "./lib.mjs";

const [voice, scriptPath, outPath, model = "small.en"] = process.argv.slice(2);
if (!voice || !scriptPath || !outPath) { console.error("usage: transcribe.mjs <voiceover> <script.txt> <out.json> [model]"); process.exit(2); }
need("ffprobe");
// The user supplies a time-stamped script next to the voiceover. It is AUTHORITATIVE: import it instead of re-deriving timing.
import { spawnSync } from "node:child_process";
const folder = path.dirname(path.resolve(voice));
const found = spawnSync("node", [path.join(path.dirname(fileURLToPath(import.meta.url)), "import-timestamps.mjs"), "--find", folder], { encoding: "utf8" }).stdout.trim();
if (found && !found.startsWith("NO timing") && !process.argv.includes("--force-whisper")) { console.error("A supplied timing file exists next to the voiceover:\n" + found + "\nUse: node import-timestamps.mjs <file> " + outPath + "   (then check-timing.mjs). Re-run with --force-whisper ONLY if the user says the file is wrong."); process.exit(4); }
const here = path.dirname(fileURLToPath(import.meta.url));
const tmp = outPath + ".whisper.json";

let usedEngine = null;
const py = run(process.platform === "win32" ? "python" : "python3", [path.join(here, "whisper_words.py"), voice, tmp, model]);
if (py.status === 0) usedEngine = "faster-whisper";
else if (process.env.WHISPER_CPP) {
  console.error("whisper.cpp path not implemented in this helper; convert its JSON to {duration,words:[{w,start,end}]} at " + tmp);
}
if (!usedEngine && !fs.existsSync(tmp)) {
  console.error("No transcription engine available.\n" + (py.stderr || "") + "\nInstall one:  pip install faster-whisper   (then re-run). Do NOT fake timestamps.");
  process.exit(3);
}
const whisper = readJson(tmp);
const raw = fs.readFileSync(scriptPath, "utf8");
// Script tokens: strip bracket markers like [card: ...] and markdown markers, keep words
const clean = raw.replace(/\[[^\]]*\]/g, " ").replace(/\*\*/g, "").replace(/__/g, "").replace(/^#\s*/gm, "").replace(/^-\s+/gm, "");
const tokens = clean.split(/\s+/).filter(Boolean);
const aligned = alignWords(tokens, whisper.words);
const matched = aligned.filter((t) => t.matched).length;
const confidence = matched / Math.max(1, tokens.length);
writeJson(outPath, { engine: usedEngine, voiceover: voice, voDuration: probeDuration(voice), confidence: +confidence.toFixed(4), words: aligned, unmatched: aligned.filter((t) => !t.matched).map((t) => t.w) });
console.log(`aligned ${matched}/${tokens.length} words, confidence ${(confidence * 100).toFixed(1)}%`);
if (confidence < 0.9) console.log("LOW CONFIDENCE (<90%): ask the user whether the voiceover differs from the script. Unmatched:", aligned.filter((t) => !t.matched).map((t) => t.w).join(" "));
