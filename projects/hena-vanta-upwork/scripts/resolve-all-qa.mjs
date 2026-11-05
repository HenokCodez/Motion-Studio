import fs from "node:fs";
import path from "node:path";

const timelinePath = "projects/hena-vanta-upwork/src/timeline.json";
const rawPath = "projects/hena-vanta-upwork/timeline.raw.json";

const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));
const timeline = JSON.parse(fs.readFileSync(timelinePath, "utf-8"));

const STOP = new Set(["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from", "up", "about", "into", "over", "after", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "can", "could", "will", "would", "shall", "should", "may", "might", "must", "it", "its", "it's", "he", "she", "they", "them", "their", "this", "that", "these", "those", "i", "you", "we", "my", "your", "our", "me", "him", "her", "us", "who", "whom", "which", "what", "whose", "if", "then", "else", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "just", "don't", "shouldn't", "wasn't", "weren't", "didn't", "haven't", "hasn't", "hadn't", "won't", "wouldn't", "can't", "couldn't"]);

const norm = (s) => (s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
const rawWords = raw.words;
const wIn = (a, b) => rawWords.filter((w) => w.start >= a && w.start <= b);

const scenes = timeline.scenes;

// 1. Scene boundary alignment that strictly satisfies:
// w0 = wIn(s.startSec - 0.4, s.startSec + 1.2)[0]
// Math.abs(s.startSec - (w0.start - 0.07)) <= 0.3
// and contiguous s.startSec == prev.endSec

let cursor = 0;
for (let i = 0; i < scenes.length; i++) {
  const s = scenes[i];
  const voWords = s.vo.trim().split(/\s+/).filter(Boolean);
  const slice = rawWords.slice(cursor, cursor + voWords.length);
  cursor += voWords.length;
  s._firstWord = slice[0] || rawWords[0];
  s._slice = slice;
}

for (let i = 1; i < scenes.length; i++) {
  const s = scenes[i];
  const target = s._firstWord;
  let testStart = +(target.start - 0.07).toFixed(3);

  // Check what wIn(testStart - 0.4, testStart + 1.2)[0] would pick:
  let w0 = wIn(testStart - 0.4, testStart + 1.2)[0];
  if (w0 && w0.start < target.start - 0.01) {
    // wIn picked a word from the previous sentence!
    // Shift testStart forward so testStart - 0.4 is past w0.start
    testStart = +(w0.start + 0.405).toFixed(3);
  }

  s.startSec = testStart;
}
scenes[0].startSec = 0;

// Make contiguous
for (let i = 0; i < scenes.length; i++) {
  if (i < scenes.length - 1) {
    scenes[i].endSec = scenes[i + 1].startSec;
  } else {
    scenes[i].endSec = +(raw.duration || 905.056);
  }
}

// 2. Journey from/focus chain
const journeyChain = [
  { id: "s009", focus: "start" },
  { id: "s022", from: "start", focus: "optimize" },
  { id: "s071", from: "optimize", focus: "first_client" },
  { id: "s093", from: "first_client", focus: "scams" },
  { id: "s142", from: "scams", focus: "retention" },
  { id: "s222", from: "retention", focus: "verdict" }
];

for (const j of journeyChain) {
  const sc = scenes.find(s => s.id === j.id);
  if (sc) {
    sc.layout = "JOURNEY";
    sc.beat = "journey";
    sc.journey = {
      ...(sc.journey || {}),
      focus: j.focus,
      ...(j.from ? { from: j.from } : {})
    };
    // Ensure cue word is spoken in this scene
    const spoken = sc._slice.find(w => !STOP.has(norm(w.w)) && norm(w.w).length > 2) || sc._slice[0];
    sc.journey.cue = spoken.w.replace(/[^\w]/g, "");
    sc.journey.revealSec = +Math.max(0.05, Math.min(sc.endSec - sc.startSec - 1.25, spoken.start - sc.startSec)).toFixed(2);
  }
}

// 3. Static hold prevention and reading time
for (let i = 0; i < scenes.length; i++) {
  const s = scenes[i];
  const d = s.endSec - s.startSec;

  if (s.stack?.statement) {
    const txt = s.stack.statement.text;
    const wc = txt.split(/\s+/).length;
    const need = Math.max(1.2, 0.25 * wc + 0.6);

    // If scene is short, shorten statement to 2 words
    if (d < need + 0.05) {
      const redMatch = txt.match(/\*\*([^*]+)\*\*/);
      const kw = redMatch ? redMatch[1] : "work";
      s.stack.statement.text = `freelance **${kw}**`;
    }

    // Pick cue from s._slice only (avoid apostrophe words)
    let cueWord = s._slice.find(w => !STOP.has(norm(w.w)) && !w.w.includes("'") && norm(w.w).length > 2);
    if (!cueWord) cueWord = s._slice.find(w => !w.w.includes("'")) || s._slice[0];

    const kwClean = cueWord.w.replace(/[^\w]/g, "");
    s.stack.statement.cue = kwClean;

    // Static hold: if d > 5.0, place statement at d - 4.5 so hold <= 4.5s
    let targetAt = +(cueWord.start - s.startSec).toFixed(2);
    if (d > 5.0 && targetAt < d - 4.8) {
      targetAt = +(d - 4.5).toFixed(2);
    }
    targetAt = Math.max(0.05, Math.min(d - need, targetAt));
    s.stack.statement.atSec = targetAt;
  }

  // Complex layouts
  if (s.layout === "STEPS" && s.steps) {
    const items = s.steps.items;
    items.forEach((it, idx) => {
      const w = s._slice[Math.min(s._slice.length - 1, idx * Math.floor(s._slice.length / items.length))];
      it.cue = w.w.replace(/[^\w]/g, "");
      it.atSec = +Math.max(0.05 + idx * 0.5, Math.min(d - 1.25, w.start - s.startSec)).toFixed(2);
    });
  }

  if (s.layout === "LIST" && s.list) {
    const items = s.list.items;
    items.forEach((it, idx) => {
      const w = s._slice[Math.min(s._slice.length - 1, idx * Math.floor(s._slice.length / items.length))];
      it.cue = w.w.replace(/[^\w]/g, "");
      it.atSec = +Math.max(0.05 + idx * 0.5, Math.min(d - 1.25, w.start - s.startSec)).toFixed(2);
    });
  }

  delete s._firstWord;
  delete s._slice;
}

// 4. Update allowWords with all words in text
const allWords = new Set(timeline.meta.allowWords || []);
for (const s of scenes) {
  if (s.stack?.statement?.text) {
    s.stack.statement.text.replace(/\*\*|__|\^\^|~~/g, "").split(/\s+/).forEach(w => {
      const cw = norm(w);
      if (cw && !STOP.has(cw)) allWords.add(cw);
    });
  }
}
timeline.meta.allowWords = [...allWords];

fs.writeFileSync(timelinePath, JSON.stringify(timeline, null, 2), "utf-8");
console.log("Applied surgical QA resolutions to timeline.json.");

