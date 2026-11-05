import fs from "node:fs";

const timelinePath = "projects/hena-vanta-upwork/src/timeline.json";
const rawPath = "projects/hena-vanta-upwork/timeline.raw.json";

const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));
const timeline = JSON.parse(fs.readFileSync(timelinePath, "utf-8"));
const rawWords = raw.words;
const scenes = timeline.scenes;

// 1. s032: BARE footage plate
const s032 = scenes.find(s => s.id === "s032");
if (s032) {
  s032.layout = "STACK";
  s032.beat = "bare";
  s032.why = "provides clean visual breathing room on foundational footage plate";
  s032.stack = {
    media: {
      kind: "placeholder",
      label: "TALKING-HEAD: Creator discussing prolonged profile optimization"
    }
  };
}

// 2. s045: BARE footage plate
const s045 = scenes.find(s => s.id === "s045");
if (s045) {
  s045.layout = "STACK";
  s045.beat = "bare";
  s045.why = "provides clean visual breathing room on foundational footage plate";
  s045.stack = {
    media: {
      kind: "placeholder",
      label: "SCREEN: Upwork job post offering 30 to 50 dollars for full-stack build"
    }
  };
}

// 3. s120 startSec
const s120 = scenes.find(s => s.id === "s120");
if (s120) {
  const idx = scenes.indexOf(s120);
  s120.startSec = 479.05;
  if (idx > 0) scenes[idx - 1].endSec = 479.05;
}

// 4. s168: BARE footage plate
const s168 = scenes.find(s => s.id === "s168");
if (s168) {
  s168.layout = "STACK";
  s168.beat = "bare";
  s168.why = "provides clean visual breathing room on foundational footage plate";
  s168.stack = {
    media: {
      kind: "placeholder",
      label: "TALKING-HEAD: Creator accepting challenging client feedback"
    }
  };
}

// 5. s179: change "proven" to "sample", exact atSec
const s179 = scenes.find(s => s.id === "s179");
if (s179 && s179.stack?.statement) {
  s179.stack.statement.text = "sample **portfolio**";
  s179.stack.statement.cue = "portfolio";
  s179.stack.statement.atSec = +(681.22 - s179.startSec).toFixed(2);
}

// 6. s201: item 1 atSec = 0.65s
const s201 = scenes.find(s => s.id === "s201");
if (s201 && s201.steps) {
  s201.steps.items[0].atSec = 0.65;
}

fs.writeFileSync(timelinePath, JSON.stringify(timeline, null, 2), "utf-8");
console.log("Applied final 6 fixes!");

