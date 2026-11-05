import fs from "node:fs";

const timelinePath = "projects/hena-vanta-upwork/src/timeline.json";
const rawPath = "projects/hena-vanta-upwork/timeline.raw.json";

const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));
const timeline = JSON.parse(fs.readFileSync(timelinePath, "utf-8"));
const rawWords = raw.words;

const scenes = timeline.scenes;

// Add missing vocabulary words to meta.allowWords
const extraAllow = [
  "reliable", "record", "cash", "deposit", "request", "unverified", "elevated", "higher",
  "track", "off", "platform", "expectations", "spending", "learning", "differently"
];
timeline.meta.allowWords = [...new Set([...timeline.meta.allowWords, ...extraAllow])];

// Helper to find exact cue word in scene
function findWord(s, preferred = "") {
  const windowWords = rawWords.filter(w => w.start >= s.startSec - 0.1 && w.end <= s.endSec + 0.1);
  if (preferred) {
    const pClean = preferred.toLowerCase().replace(/[^a-z0-9]/g, "");
    const match = windowWords.find(w => w.w.toLowerCase().replace(/[^a-z0-9]/g, "") === pClean);
    if (match) return match;
  }
  return windowWords[0];
}

// 1. Fix scene starts for the flagged scenes
const startFixes = {
  s051: 212.91,
  s070: 287.61,
  s120: 479.87,
  s137: 538.61,
  s227: 837.29
};

for (const [id, start] of Object.entries(startFixes)) {
  const sc = scenes.find(s => s.id === id);
  if (sc) {
    const idx = scenes.indexOf(sc);
    sc.startSec = start;
    if (idx > 0) scenes[idx - 1].endSec = start;
  }
}

// 2. Fix specific cues & atSec
for (let i = 0; i < scenes.length; i++) {
  const s = scenes[i];
  const d = s.endSec - s.startSec;

  if (s.id === "s030" && s.steps) {
    // s030: learning skill -> sample -> applying
    const w1 = findWord(s, "skill") || findWord(s);
    const w2 = findWord(s, "sample") || findWord(s);
    const w3 = findWord(s, "applying") || findWord(s);
    s.steps.items[0].cue = w1.w.replace(/[^\w]/g, "");
    s.steps.items[0].atSec = +Math.max(0.05, w1.start - s.startSec).toFixed(2);
    s.steps.items[1].cue = w2.w.replace(/[^\w]/g, "");
    s.steps.items[1].atSec = +Math.max(0.65, w2.start - s.startSec).toFixed(2);
    s.steps.items[2].cue = w3.w.replace(/[^\w]/g, "");
    s.steps.items[2].atSec = +Math.max(1.25, Math.min(d - 1.25, w3.start - s.startSec)).toFixed(2);
  }

  if (s.id === "s032" && s.stack?.statement) {
    const w = findWord(s, "long") || findWord(s);
    s.stack.statement.cue = w.w.replace(/[^\w]/g, "");
    s.stack.statement.atSec = +Math.max(0.05, Math.min(d - 1.25, w.start - s.startSec)).toFixed(2);
  }

  if (s.id === "s045" && s.stack?.statement) {
    const w = findWord(s, "dollars") || findWord(s);
    s.stack.statement.cue = w.w.replace(/[^\w]/g, "");
    s.stack.statement.atSec = +Math.max(0.05, Math.min(d - 1.25, w.start - s.startSec)).toFixed(2);
  }

  if (s.id === "s070" && s.stack?.statement) {
    const w = findWord(s, "things") || findWord(s);
    s.stack.statement.cue = w.w.replace(/[^\w]/g, "");
    s.stack.statement.atSec = +Math.max(0.05, Math.min(d - 1.25, w.start - s.startSec)).toFixed(2);
  }

  if (s.id === "s111" && s.stack?.statement) {
    s.stack.statement.text = "freelance **work**";
    s.stack.statement.atSec = 0.05;
    const w = findWord(s);
    s.stack.statement.cue = w.w.replace(/[^\w]/g, "");
  }

  if (s.id === "s116" && s.list) {
    const words = rawWords.filter(w => w.start >= s.startSec - 0.05 && w.end <= s.endSec + 0.05);
    const w1 = words[0] || { w: "skills", start: s.startSec + 0.1 };
    const w2 = words[Math.floor(words.length / 2)] || w1;
    const w3 = words[words.length - 1] || w1;
    s.list.items[0].cue = w1.w.replace(/[^\w]/g, "");
    s.list.items[0].atSec = +Math.max(0.05, w1.start - s.startSec).toFixed(2);
    s.list.items[1].cue = w2.w.replace(/[^\w]/g, "");
    s.list.items[1].atSec = +Math.max(s.list.items[0].atSec + 0.55, w2.start - s.startSec).toFixed(2);
    s.list.items[2].cue = w3.w.replace(/[^\w]/g, "");
    s.list.items[2].atSec = +Math.max(s.list.items[1].atSec + 0.55, Math.min(d - 1.25, w3.start - s.startSec)).toFixed(2);
  }

  if (s.id === "s156" && s.list) {
    const words = rawWords.filter(w => w.start >= s.startSec - 0.05 && w.end <= s.endSec + 0.05);
    const w1 = words[0] || { w: "scam", start: s.startSec + 0.1 };
    const w2 = words[Math.floor(words.length / 2)] || w1;
    const w3 = words[words.length - 1] || w1;
    s.list.items = [
      { text: "Fake **Telegram** Chat", cue: w1.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.05, w1.start - s.startSec).toFixed(2) },
      { text: "Direct **Deposit** Scam", cue: w2.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.65, w2.start - s.startSec).toFixed(2) },
      { text: "Bypassing **Payment**", cue: w3.w.replace(/[^\w]/g, ""), atSec: +Math.max(1.25, Math.min(d - 1.25, w3.start - s.startSec)).toFixed(2) }
    ];
  }

  if (s.id === "s168" && s.stack?.statement) {
    const w = findWord(s, "accept") || findWord(s);
    s.stack.statement.cue = w.w.replace(/[^\w]/g, "");
    s.stack.statement.atSec = +Math.max(0.05, Math.min(d - 1.25, w.start - s.startSec)).toFixed(2);
  }

  if (s.id === "s179" && s.stack?.statement) {
    const w = findWord(s, "portfolio") || findWord(s);
    s.stack.statement.cue = w.w.replace(/[^\w]/g, "");
    s.stack.statement.atSec = +Math.max(0.05, Math.min(d - 1.25, w.start - s.startSec)).toFixed(2);
  }

  if (s.id === "s201" && s.steps) {
    const words = rawWords.filter(w => w.start >= s.startSec - 0.05 && w.end <= s.endSec + 0.05);
    const w1 = words[0] || { w: "basics", start: s.startSec + 0.1 };
    const w2 = words[Math.floor(words.length / 2)] || w1;
    const w3 = words[words.length - 1] || w1;
    s.steps.items[0].cue = w1.w.replace(/[^\w]/g, "");
    s.steps.items[0].atSec = +Math.max(0.05, w1.start - s.startSec).toFixed(2);
    s.steps.items[1].cue = w2.w.replace(/[^\w]/g, "");
    s.steps.items[1].atSec = +Math.max(s.steps.items[0].atSec + 0.55, w2.start - s.startSec).toFixed(2);
    s.steps.items[2].cue = w3.w.replace(/[^\w]/g, "");
    s.steps.items[2].atSec = +Math.max(s.steps.items[1].atSec + 0.55, Math.min(d - 1.25, w3.start - s.startSec)).toFixed(2);
  }

  if (s.id === "s227" && s.stack?.statement) {
    const w = findWord(s, "portfolio") || findWord(s);
    s.stack.statement.cue = w.w.replace(/[^\w]/g, "");
    s.stack.statement.atSec = +Math.max(0.05, Math.min(d - 1.25, w.start - s.startSec)).toFixed(2);
  }
}

fs.writeFileSync(timelinePath, JSON.stringify(timeline, null, 2), "utf-8");
console.log("Fixed final 25 items!");

