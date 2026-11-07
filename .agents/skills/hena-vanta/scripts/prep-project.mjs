#!/usr/bin/env node
// Usage: node prep-project.mjs <projectDir> <voiceover> <backgroundFile> [sfxDir]
// Copies assets into <projectDir>/public, normalises the VO stem, probes the background, patches timeline meta.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { need, run, probeDuration, readJson, writeJson } from "./lib.mjs";

const [proj, vo, bg, sfxDir] = process.argv.slice(2);
if (!proj || !vo || !bg) { console.error("usage: prep-project.mjs <projectDir> <voiceover> <backgroundFile> [sfxDir]"); process.exit(2); }
need("ffmpeg"); need("ffprobe");
const pub = path.join(proj, "public"); fs.mkdirSync(pub, { recursive: true });

// VO: highpass 70 Hz + loudnorm to -15 LUFS / TP -2 (leaves headroom for SFX to reach the -14 LUFS master)
const voOut = path.join(pub, "vo_norm.wav");
let r = run("ffmpeg", ["-v", "error", "-y", "-i", vo, "-af", "highpass=f=70,loudnorm=I=-15:TP=-2:LRA=7", "-ar", "48000", "-ac", "2", voOut]);
if (r.status !== 0) throw new Error(r.stderr);

const isVideo = /\.(mp4|mov|webm|mkv)$/i.test(bg);
const bgName = "bg" + path.extname(bg).toLowerCase();
fs.copyFileSync(bg, path.join(pub, bgName));
const bgDur = isVideo ? probeDuration(bg) : 0;

if (sfxDir) {
  const prep = path.join(path.dirname(fileURLToPath(import.meta.url)), "prep-sfx.mjs");
  r = run("node", [prep, sfxDir, path.join(pub, "sfx")], { stdio: "inherit" });
}

const tlPath = path.join(proj, "src", "timeline.json");
const tl = readJson(tlPath);
tl.meta.voiceover = "vo_norm.wav"; tl.meta.background = bgName; tl.meta.backgroundIsVideo = isVideo;
tl.meta.backgroundDurationSec = bgDur || undefined;
tl.meta.durationSec = +(probeDuration(voOut) + 0.5).toFixed(3);
writeJson(tlPath, tl);
console.log("project prepped:", { vo: voOut, bg: bgName, bgDurationSec: bgDur, durationSec: tl.meta.durationSec });
