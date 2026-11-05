#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const proj = fs.existsSync("timeline.raw.json")
  ? path.resolve(".")
  : path.resolve("projects/hena-vanta-upwork");

const raw = JSON.parse(fs.readFileSync(path.join(proj, "timeline.raw.json"), "utf8"));
const journey = JSON.parse(fs.readFileSync(path.join(proj, "journey.json"), "utf8"));
const sfxManifest = JSON.parse(fs.readFileSync(path.join(proj, "public/sfx/sfx-manifest.json"), "utf8"));

const fps = 30;
const dur = +(raw.voDuration + 0.5).toFixed(3);
const rawWords = raw.words;

const STOP = new Set("a an the and or but so to of in on at for with is are was were be been it its this that these those i you he she we they me my your our their as by from not no yes do does did just then than too very can could would should will".split(" "));

const norm = (w) => w.toLowerCase().replace(/[^a-z0-9']/g, "");

function findCueInWindow(win, cue) {
  if (!cue) return null;
  const toks = cue.toLowerCase().split(/\s+/).map(norm).filter(Boolean);
  if (!toks.length) return null;
  for (let i = 0; i < win.length; i++) {
    if (toks.every((tk, k) => win[i + k] && norm(win[i + k].w) === tk)) {
      return win[i];
    }
  }
  return null;
}

// Extract meaningful non-stop word from scene words for red keyword
function pickRedWord(sceneWords, fallback) {
  for (const w of sceneWords) {
    const nw = norm(w.w);
    if (nw.length >= 4 && !STOP.has(nw)) {
      return nw;
    }
  }
  return fallback;
}

// Build scene chunks from raw words
const rawScenes = [];
let cur = [];
for (let i = 0; i < rawWords.length; i++) {
  cur.push(rawWords[i]);
  const start = cur[0].start;
  const end = rawWords[i].end;
  const d = end - start;
  const isPunct = /[.?!,]/.test(rawWords[i].w);
  const isLast = i === rawWords.length - 1;
  // Break chunk if duration >= 2.8s at punctuation, or duration >= 4.3s, or isLast
  if (isLast || (d >= 2.8 && isPunct) || d >= 4.4) {
    rawScenes.push({
      startSec: Math.max(0, +(cur[0].start - 0.07).toFixed(2)),
      rawStart: cur[0].start,
      endSec: +rawWords[i].end.toFixed(2),
      dur: +(end - start).toFixed(2),
      vo: cur.map(w => w.w).join(" "),
      words: cur.slice()
    });
    cur = [];
  }
}

// Adjust scenes to be strictly contiguous
for (let i = 0; i < rawScenes.length - 1; i++) {
  rawScenes[i].endSec = rawScenes[i + 1].startSec;
}
rawScenes[rawScenes.length - 1].endSec = dur;

console.log(`Partitioned ${rawWords.length} words into ${rawScenes.length} consecutive scenes.`);
console.log(`Duration range: ${Math.min(...rawScenes.map(s => s.endSec - s.startSec)).toFixed(2)}s to ${Math.max(...rawScenes.map(s => s.endSec - s.startSec)).toFixed(2)}s`);

// Write out the clean timeline
fs.writeFileSync("raw_scenes_debug.json", JSON.stringify(rawScenes, null, 2));

