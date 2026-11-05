import fs from "node:fs";

const timelinePath = "projects/hena-vanta-upwork/src/timeline.json";
const timeline = JSON.parse(fs.readFileSync(timelinePath, "utf-8"));

// 45 bare scenes distributed every 7th scene where there is no image or special layout
let bareCount = 0;
const beatCycle = ["takeaway", "keyterm", "takeaway", "quote"];
let beatCycleIdx = 0;

for (let i = 0; i < timeline.scenes.length; i++) {
  const s = timeline.scenes[i];

  if (s.id === "s043" || s.id === "s164" || s.id === "s218" || s.id === "s256" || s.id === "s268" || s.journey) {
    continue;
  }

  // Every 7th scene becomes a clean B-roll footage plate
  if (i % 7 === 0 && !s.image && !s.stack?.media && (s.endSec - s.startSec) <= 4.0) {
    s.layout = "BARE";
    s.beat = "bare";
    delete s.stack;
    bareCount++;
  } else {
    s.layout = "STACK";
    s.beat = beatCycle[beatCycleIdx % beatCycle.length];
    beatCycleIdx++;

    if (!s.stack) s.stack = {};
    if (!s.stack.category) s.stack.category = {};
    if (s.beat === "takeaway") s.stack.category.text = "TAKEAWAY";
    else if (s.beat === "keyterm") s.stack.category.text = "CORE CONCEPT";
    else if (s.beat === "quote") s.stack.category.text = "REFLECTION";
    else s.stack.category.text = "PRINCIPLE";
  }
}

// Compute bare stats
let bareSec = 0;
let totalSec = 0;
let maxBareRun = 0;
let currBareRun = 0;

let prevKey = "";
let sameRun = 0;
let maxSameRun = 0;

for (const s of timeline.scenes) {
  const dur = s.endSec - s.startSec;
  totalSec += dur;
  if (s.layout === "BARE") {
    bareSec += dur;
    currBareRun += dur;
    if (currBareRun > maxBareRun) maxBareRun = currBareRun;
  } else {
    currBareRun = 0;
  }

  const hasMedia = !!(s.image || (s.stack && s.stack.media));
  const key = `${s.layout}|${s.beat}|${hasMedia}`;
  if (key === prevKey) {
    sameRun++;
  } else {
    sameRun = 1;
    prevKey = key;
  }
  if (sameRun > maxSameRun) maxSameRun = sameRun;
}

fs.writeFileSync(timelinePath, JSON.stringify(timeline, null, 2), "utf-8");

console.log(`Total duration: ${totalSec.toFixed(2)}s`);
console.log(`Bare scenes: ${bareCount}`);
console.log(`Bare duration: ${bareSec.toFixed(2)}s (${(bareSec/totalSec*100).toFixed(1)}%) (Target <= 25%)`);
console.log(`Max bare run: ${maxBareRun.toFixed(2)}s (Target <= 6.0s)`);
console.log(`Max identical composition run: ${maxSameRun} (Target <= 3)`);
