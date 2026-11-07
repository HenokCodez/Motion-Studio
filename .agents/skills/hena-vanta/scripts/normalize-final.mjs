#!/usr/bin/env node
// Two-pass loudness normalisation of the FINAL mix to -14 LUFS (+/-0.5), true peak <= -1.5 dBTP, video stream copied.
// Usage: node normalize-final.mjs <in.mp4> <out.mp4> [-14]
import { need, run } from "./lib.mjs";
const [inp, out, tgt = "-14"] = process.argv.slice(2); if (!inp || !out) { console.error("usage: normalize-final.mjs <in> <out> [targetLufs]"); process.exit(2); }
need("ffmpeg");
const p1 = run("ffmpeg", ["-nostats", "-i", inp, "-af", `loudnorm=I=${tgt}:TP=-1.5:LRA=7:print_format=json`, "-vn", "-f", "null", "-"]);
const j = JSON.parse(p1.stderr.slice(p1.stderr.lastIndexOf("{"), p1.stderr.lastIndexOf("}") + 1));
const af = `loudnorm=I=${tgt}:TP=-1.5:LRA=7:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true`;
const p2 = run("ffmpeg", ["-v", "error", "-y", "-i", inp, "-c:v", "copy", "-af", af, "-ar", "48000", "-c:a", "aac", "-b:a", "320k", out]);
if (p2.status !== 0) { console.error(p2.stderr); process.exit(3); }
console.log(`measured ${j.input_i} LUFS / TP ${j.input_tp} -> normalised to ${tgt} LUFS: ${out}`);
