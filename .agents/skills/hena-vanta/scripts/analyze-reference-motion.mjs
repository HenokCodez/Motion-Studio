#!/usr/bin/env node
// Usage: node analyze-reference-motion.mjs <video.mp4> [--out qa-motion] [--thr 0.02] [--max 40]
// Finds every moment where the picture changes, separates hard cuts from short animations, and writes filmstrips
// (every frame around each animation) so you can LOOK at the real motion instead of guessing from stills.
import fs from "node:fs";
import path from "node:path";
import { need, run, probeDuration, writeJson } from "./lib.mjs";

const args = process.argv.slice(2); const video = args[0];
const opt = (k, d) => { const i = args.indexOf("--" + k); return i >= 0 ? args[i + 1] : d; };
if (!video) { console.error("usage: analyze-reference-motion.mjs <video> [--out dir] [--thr 0.02] [--max 40]"); process.exit(2); }
need("ffmpeg"); need("ffprobe");
const out = opt("out", "qa-motion"), thr = +opt("thr", 0.02), maxEv = +opt("max", 40);
fs.mkdirSync(out, { recursive: true });
const fr = run("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate", "-of", "default=nw=1:nk=1", video]).stdout.trim().split("/");
const fps = +fr[0] / +(fr[1] || 1);
const W = 192, H = 108;
const r = run("ffmpeg", ["-v", "error", "-i", video, "-vf", `scale=${W}:${H},format=gray`, "-f", "rawvideo", "-"], { encoding: "buffer" });
const buf = r.stdout; const n = Math.floor(buf.length / (W * H));
const diffs = new Float32Array(n);
for (let i = 1; i < n; i++) { let s = 0; const a = i * W * H, b = (i - 1) * W * H; for (let k = 0; k < W * H; k++) s += Math.abs(buf[a + k] - buf[b + k]); diffs[i] = s / (W * H); }
// events: runs of frames with diff > thr (gap tolerance 2 frames)
const events = []; let s = -1, l = -1;
for (let i = 1; i < n; i++) { if (diffs[i] > thr) { if (s < 0) s = i; l = i; } else if (s >= 0 && i - l > 2) { events.push([s, l]); s = -1; } }
if (s >= 0) events.push([s, l]);
const rows = events.map(([a, b]) => { let peak = 0; for (let i = a; i <= b; i++) peak = Math.max(peak, diffs[i]); const len = b - a + 1; return { startSec: +(a / fps).toFixed(3), frames: len, peakDiff: +peak.toFixed(2), kind: len <= 2 && peak > 8 ? "hard-cut" : len >= 4 && peak < 8 ? "animation-or-source-motion" : "change" }; });
const anim = rows.filter((e) => e.kind === "animation-or-source-motion");
writeJson(path.join(out, "events.json"), { fps, frames: n, hardCuts: rows.filter((e) => e.kind === "hard-cut").length, animations: anim.length, events: rows });
console.log(`fps ${fps}, ${n} frames, hard cuts ${rows.filter((e) => e.kind === "hard-cut").length}, animation-like events ${anim.length}`);
// filmstrips for the first maxEv animation-like events (every frame, 5x4 tiles)
anim.slice(0, maxEv).forEach((e, k) => {
  const t0 = Math.max(0, e.startSec - 2 / fps), dur = Math.min(2.5, (e.frames + 4) / fps);
  run("ffmpeg", ["-v", "error", "-y", "-ss", String(t0), "-t", String(dur), "-i", video, "-vf", `select='not(mod(n,${Math.max(1, Math.round(e.frames / 18))}))',scale=320:-1,drawtext=text='%{pts\\:hms}':x=4:y=4:fontsize=14:fontcolor=red:box=1:boxcolor=white@0.8,tile=5x4`, "-frames:v", "1", "-q:v", "3", path.join(out, `event_${String(k + 1).padStart(2, "0")}_${e.startSec}s.jpg`)]);
});
console.log(`wrote ${out}/events.json and ${Math.min(anim.length, maxEv)} filmstrips. OPEN THEM and compare with references/10-motion-catalog.md.`);
