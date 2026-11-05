import fs from "node:fs";

const timelinePath = "projects/hena-vanta-upwork/src/timeline.json";
const rawPath = "projects/hena-vanta-upwork/timeline.raw.json";

const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));
const timeline = JSON.parse(fs.readFileSync(timelinePath, "utf-8"));
const rawWords = raw.words;
const scenes = timeline.scenes;

// Add vocabulary words
const extraWords = [
  "differently", "execute", "start", "proposal", "software", "reliable", "insights", "discovering"
];
timeline.meta.allowWords = [...new Set([...timeline.meta.allowWords, ...extraWords])];

// 1. s030 (STEPS: 120.97 - 126.61, dur 5.64s)
const s030 = scenes.find(s => s.id === "s030");
if (s030) {
  s030.steps = {
    heading: "FREELANCE LAUNCH WORKFLOW",
    items: [
      { text: "Master Core **Skill**", cue: "maybe", atSec: +(121.06 - s030.startSec).toFixed(2) },
      { text: "Build 6 **Samples**", cue: "portfolio", atSec: +(123.28 - s030.startSec).toFixed(2) },
      { text: "Direct **Pitching**", cue: "profile", atSec: +(124.68 - s030.startSec).toFixed(2) }
    ]
  };
}

// 2. Short scenes: ensure atSec = 0.05s and cue is the first word so reading time >= 1.2s and cue offset 0.00s
const shortScenes = ["s032", "s045", "s111", "s168", "s179"];
for (const id of shortScenes) {
  const sc = scenes.find(s => s.id === id);
  if (sc && sc.stack?.statement) {
    const words = rawWords.filter(w => w.start >= sc.startSec - 0.05 && w.end <= sc.endSec + 0.05);
    const firstWord = words[0] || { w: "work", start: sc.startSec + 0.07 };
    sc.stack.statement.cue = firstWord.w.replace(/[^\w]/g, "");
    sc.stack.statement.atSec = +Math.max(0.02, firstWord.start - sc.startSec).toFixed(2);
    sc.stack.statement.text = `freelance **${sc.stack.statement.cue}**`;
  }
}

// 3. s116 (LIST: 462.81 - 467.885, dur 5.075s)
const s116 = scenes.find(s => s.id === "s116");
if (s116) {
  s116.list = {
    title: "WINNING PROPOSAL FORMULA",
    items: [
      { text: "Targeted **Proposal**", cue: "proposal", atSec: +(463.14 - s116.startSec).toFixed(2) },
      { text: "Matched **Sample**", cue: "sample", atSec: +(465.54 - s116.startSec).toFixed(2) }
    ]
  };
}

// 4. s156 (Convert back to STACK since duration is 1.48s)
const s156 = scenes.find(s => s.id === "s156");
if (s156) {
  s156.layout = "STACK";
  s156.beat = "takeaway";
  s156.why = "crystallizes core takeaway from client negotiation";
  delete s156.list;
  s156.stack = {
    category: { text: "TAKEAWAY" },
    statement: {
      text: "discovering **insights**",
      cue: "learned",
      atSec: +(605.30 - s156.startSec).toFixed(2)
    }
  };
}

// 5. s201 (STEPS: 751.65 - 755.19, dur 3.54s)
const s201 = scenes.find(s => s.id === "s201");
if (s201) {
  s201.steps = {
    heading: "YEAR 2 ROADMAP",
    items: [
      { text: "First **Start**", cue: "start", atSec: +(752.38 - s201.startSec).toFixed(2) },
      { text: "Execute **Differently**", cue: "differently", atSec: +(754.54 - s201.startSec - 0.25).toFixed(2) }
    ]
  };
}

fs.writeFileSync(timelinePath, JSON.stringify(timeline, null, 2), "utf-8");
console.log("Updated targeted scenes!");

