import fs from "node:fs";

const timelinePath = "projects/hena-vanta-upwork/src/timeline.json";
const rawPath = "projects/hena-vanta-upwork/timeline.raw.json";

const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));
const timeline = JSON.parse(fs.readFileSync(timelinePath, "utf-8"));
const rawWords = raw.words;
const scenes = timeline.scenes;

// Add vocabulary
timeline.meta.allowWords = [...new Set([...timeline.meta.allowWords, "extended", "fifty", "acceptance", "proven"])];

// 1. s032
const s032 = scenes.find(s => s.id === "s032");
if (s032) {
  s032.stack.statement = {
    text: "extended **time**",
    cue: "time",
    atSec: 0.05
  };
}

// 2. s045
const s045 = scenes.find(s => s.id === "s045");
if (s045) {
  s045.stack.statement = {
    text: "fifty **dollars**",
    cue: "dollars",
    atSec: 0.05
  };
}

// 3. s051
const s051 = scenes.find(s => s.id === "s051");
if (s051) {
  s051.stack.statement.atSec = 0.40;
}

// 4. s111 (make bare footage plate)
const s111 = scenes.find(s => s.id === "s111");
if (s111) {
  s111.layout = "STACK";
  s111.beat = "bare";
  s111.why = "provides clean visual breathing room on foundational footage plate";
  s111.stack = {
    media: {
      kind: "placeholder",
      label: "TALKING-HEAD: Creator explaining proposal details"
    }
  };
}

// 5. s120 startSec
const s120 = scenes.find(s => s.id === "s120");
if (s120) {
  const idx = scenes.indexOf(s120);
  s120.startSec = 479.49;
  if (idx > 0) scenes[idx - 1].endSec = 479.49;
}

// 6. s156 (make bare footage plate)
const s156 = scenes.find(s => s.id === "s156");
if (s156) {
  s156.layout = "STACK";
  s156.beat = "bare";
  s156.why = "provides clean visual breathing room on foundational footage plate";
  s156.stack = {
    media: {
      kind: "placeholder",
      label: "TALKING-HEAD: Creator reflecting on freelance lessons"
    }
  };
}

// 7. s168
const s168 = scenes.find(s => s.id === "s168");
if (s168) {
  s168.stack.statement = {
    text: "client **acceptance**",
    cue: "accept",
    atSec: 0.05
  };
}

// 8. s179
const s179 = scenes.find(s => s.id === "s179");
if (s179) {
  s179.stack.statement = {
    text: "proven **portfolio**",
    cue: "portfolio",
    atSec: 0.05
  };
}

// 9. s201
const s201 = scenes.find(s => s.id === "s201");
if (s201 && s201.steps) {
  s201.steps.items = [
    { text: "First **Start**", cue: "start", atSec: 0.35 },
    { text: "Execute **Differently**", cue: "things", atSec: 2.00 }
  ];
}

fs.writeFileSync(timelinePath, JSON.stringify(timeline, null, 2), "utf-8");
console.log("Applied final 9 fixes!");

