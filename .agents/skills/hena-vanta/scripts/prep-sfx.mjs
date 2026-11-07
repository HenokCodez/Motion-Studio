#!/usr/bin/env node
// Usage: node prep-sfx.mjs <sfxDir> <outDir>   -> converts every SFX to 48k stereo wav, 5ms fade-in/20ms fade-out, peak -6 dBFS, + manifest
import fs from "node:fs";
import path from "node:path";
import { need, run, writeJson, probeDuration } from "./lib.mjs";

const [src, out] = process.argv.slice(2);
if (!src || !out) { console.error("usage: prep-sfx.mjs <sfxDir> <outDir>"); process.exit(2); }
need("ffmpeg"); need("ffprobe");
fs.mkdirSync(out, { recursive: true });

const RULES = [
  ["comedic", /(record.?scratch|vine|meme|bruh|vineboom|airhorn)/i],
  ["hit", /(hit|impact|thud|boom|slam|punch)/i],
  ["error", /(error|buzz|fail|wrong|denied|incorrect)/i],
  ["ding", /(ding|chime|notif|success|bell|correct|coin)/i],
  ["swoosh", /(swoosh|whoosh|swipe|slide|swish|transition)/i],
  ["ui", /(pop|click|tick|ui|tap|bubble|blip)/i],
];
export const categorize = (relPath) => { for (const [c, re] of RULES) if (re.test(relPath)) return c; return "other"; };

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk(src).filter((f) => /\.(wav|mp3|ogg|flac|m4a|aiff?)$/i.test(f));
if (!files.length) { console.error("No audio files found in " + src); process.exit(3); }

const manifest = [];
for (const f of files) {
  const rel = path.relative(src, f);
  const dur = probeDuration(f);
  const cat = categorize(rel);
  if (dur > 3) { manifest.push({ file: rel, skipped: "longer than 3 s" }); continue; }
  const name = rel.replace(/[\\/ ]+/g, "_").replace(/\.[^.]+$/, "") + ".wav";
  const tmp = path.join(out, "_tmp.wav");
  // 1) trim leading silence, fades, resample
  const fadeOutStart = Math.max(0, dur - 0.02).toFixed(3);
  let r = run("ffmpeg", ["-v", "error", "-y", "-i", f, "-af", `silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.02,afade=t=in:d=0.005,afade=t=out:st=${fadeOutStart}:d=0.02`, "-ar", "48000", "-ac", "2", tmp]);
  if (r.status !== 0) { manifest.push({ file: rel, skipped: r.stderr.slice(0, 200) }); continue; }
  // 2) measure peak
  r = run("ffmpeg", ["-hide_banner", "-i", tmp, "-af", "volumedetect", "-f", "null", "-"]);
  const m = /max_volume:\s*(-?[\d.]+) dB/.exec(r.stderr);
  const peakBefore = m ? parseFloat(m[1]) : 0;
  const gain = -6 - peakBefore;
  // 3) apply gain to land at -6 dBFS peak
  r = run("ffmpeg", ["-v", "error", "-y", "-i", tmp, "-af", `volume=${gain.toFixed(3)}dB`, "-c:a", "pcm_s16le", path.join(out, name)]);
  manifest.push({ file: rel, prepped: name, category: cat, durationSec: +dur.toFixed(3), peakBeforeDb: peakBefore, gainAppliedDb: +gain.toFixed(2), peakAfterDb: -6 });
}
fs.rmSync(path.join(out, "_tmp.wav"), { force: true });
writeJson(path.join(out, "sfx-manifest.json"), manifest);
console.log(`prepped ${manifest.filter((x) => x.prepped).length}/${files.length} files -> ${out}`);
