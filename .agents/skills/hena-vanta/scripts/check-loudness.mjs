#!/usr/bin/env node
// Usage: node check-loudness.mjs <video-or-audio> [targetLufs=-14] [tolerance=1] [tpCeiling=-1]
import { need, run } from "./lib.mjs";
const [file, target = "-14", tol = "1", tp = "-1"] = process.argv.slice(2);
if (!file) { console.error("usage: check-loudness.mjs <file> [targetLufs] [tol] [tpCeiling]"); process.exit(2); }
need("ffmpeg");
const r = run("ffmpeg", ["-nostats", "-i", file, "-af", "ebur128=peak=true", "-vn", "-f", "null", "-"]);
const sum = r.stderr.slice(r.stderr.lastIndexOf("Summary:"));
const I = parseFloat(/I:\s+(-?[\d.]+) LUFS/.exec(sum)?.[1]);
const LRA = parseFloat(/LRA:\s+(-?[\d.]+) LU/.exec(sum)?.[1]);
const TP = parseFloat(/Peak:\s+(-?[\d.]+) dBFS/.exec(sum)?.[1]);
const okI = Math.abs(I - +target) <= +tol, okTP = TP <= +tp;
console.log(JSON.stringify({ integratedLufs: I, loudnessRangeLu: LRA, truePeakDbtp: TP, loudnessOk: okI, truePeakOk: okTP }, null, 2));
process.exit(okI && okTP ? 0 : 1);
