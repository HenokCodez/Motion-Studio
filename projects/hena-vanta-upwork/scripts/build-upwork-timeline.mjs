import fs from "node:fs";
import path from "node:path";

const scriptPath = "D:/Youtube/Hena Vanta/Project FIle/Videos/1. I tried Upwork for 365 days...is it worth it/AI/script.txt";
const outTimelinePath = "d:/Automations/motion-studio/projects/hena-vanta-upwork/src/timeline.json";
const outRawPath = "d:/Automations/motion-studio/projects/hena-vanta-upwork/timeline.raw.json";

const rawContent = fs.readFileSync(scriptPath, "utf8").replace(/^\uFEFF/, "");
const lines = rawContent.split(/\r?\n/).filter((l) => l.trim().length > 0);

const parseTime = (h, m, s) => parseInt(h, 10) * 3600 + parseInt(m, 10) * 60 + parseFloat(s);

const parsedLines = [];
for (const line of lines) {
  const m = line.match(/\[(\d{2}):(\d{2}):(\d{2}\.\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}\.\d{3})\]\s*(.*)/);
  if (!m) continue;
  const startSec = +parseTime(m[1], m[2], m[3]).toFixed(3);
  const endSec = +parseTime(m[4], m[5], m[6]).toFixed(3);
  const text = m[7].trim();
  parsedLines.push({ startSec, endSec, text });
}

console.log(`Parsed ${parsedLines.length} timestamped lines.`);

// Build words for timeline.raw.json
const rawWords = [];
for (const pl of parsedLines) {
  const tokens = pl.text.split(/\s+/).filter(Boolean);
  const n = tokens.length;
  tokens.forEach((t, i) => {
    const wStart = +(pl.startSec + (pl.endSec - pl.startSec) * (i / n)).toFixed(3);
    const wEnd = +(pl.startSec + (pl.endSec - pl.startSec) * ((i + 1) / n)).toFixed(3);
    rawWords.push({ w: t, start: wStart, end: wEnd, matched: true });
  });
}

const rawObj = {
  engine: "pre-transcribed-whisper",
  voiceover: "vo_norm.wav",
  voDuration: 904.056,
  confidence: 1.0,
  words: rawWords,
  unmatched: []
};
fs.writeFileSync(outRawPath, JSON.stringify(rawObj, null, 2));
console.log(`Wrote ${rawWords.length} words to ${outRawPath}`);

// Keyword scoring to pick 1-2 red emphasis words
const STOPWORDS = new Set([
  "a","an","the","and","or","but","if","so","then","at","by","for","from","in","into","of","off","on","onto",
  "out","over","to","up","with","as","is","am","are","was","were","be","been","being","have","has","had","do",
  "does","did","will","would","shall","should","can","could","may","might","must","i","me","my","myself","we",
  "our","ours","you","your","he","him","his","she","her","it","its","they","them","their","this","that","these",
  "those","what","which","who","whom","whose","when","where","why","how","all","any","both","each","few","more",
  "most","other","some","such","no","nor","not","only","own","same","so","than","too","very","just","because",
  "there","here","about","also","really","actually","basically","honestly","something","everything","thing","things"
]);

const KEYWORDS = [
  "hardest","wrong","clients","smooth","journey","mistakes","optimization","portfolio","learning",
  "video editing","sample projects","hired","saturated","cheaper","developers","invitations",
  "silent","local client","premiere pro","after effects","laptop","$2,000","first job","work history",
  "credibility","silent period","true crime","$20","connects","$15","quality","confident","value",
  "$90 client","deadline","revisions","patient","communication","expectations","professional",
  "$5,000","hireable","$150","fake clients","upwork"
];

const pickRedWords = (text) => {
  const clean = text.replace(/[^a-zA-Z0-9$ ]/g, " ").toLowerCase();
  const tokens = clean.split(/\s+/).filter((w) => w && !STOPWORDS.has(w) && w.length > 2);
  
  // Check exact keyword matches first
  const scored = [];
  for (const kw of KEYWORDS) {
    if (clean.includes(kw)) {
      scored.push(kw);
      if (scored.length === 2) break;
    }
  }
  if (scored.length < 2 && tokens.length > 0) {
    for (const t of tokens) {
      if (!scored.includes(t)) {
        scored.push(t);
        if (scored.length === 2) break;
      }
    }
  }
  return scored.slice(0, 2);
};

// Available prepped SFX
const SFX_UI = ["click.wav", "click_1.wav", "click_2.wav", "click_3.wav", "click_4.wav", "pop.wav"];
const SFX_HIT = ["impact_1.wav", "impact_2.wav", "punch.wav"];
const SFX_SWOOSH = ["swish_1.wav", "whoosh.wav"];
const SFX_OTHER = ["glitch_1.wav", "subtone_1.wav", "sweepdown_1.wav"];

let uiIdx = 0, hitIdx = 0, swooshIdx = 0;
let lastSfxSec = -99;

const tryAddSfx = (scene, category, atSec, videoDur) => {
  if (atSec - lastSfxSec < 7.0 || atSec < 0.5 || atSec > videoDur - 1.0) return;
  let file = "";
  if (category === "ui") file = SFX_UI[uiIdx++ % SFX_UI.length];
  else if (category === "hit") file = SFX_HIT[hitIdx++ % SFX_HIT.length];
  else if (category === "swoosh") file = SFX_SWOOSH[swooshIdx++ % SFX_SWOOSH.length];
  else file = SFX_UI[uiIdx++ % SFX_UI.length];

  if (!scene.sfx) scene.sfx = [];
  scene.sfx.push({
    file,
    category,
    atSec: +atSec.toFixed(3),
    extraDuckDb: -3
  });
  lastSfxSec = atSec;
};

// Chapters definitions
const CHAPTERS = [
  { index: 9, title: "PART 1: THE BEGINNING & EARLY MISTAKES", redWord: "MISTAKES", ph: "Screen recording: Upwork registration & profile creation" },
  { index: 48, title: "PART 2: THE NICHE PIVOT & SOFTWARE SATURATION", redWord: "SATURATION", ph: "Screen recording: Software engineering vs video editing job search" },
  { index: 76, title: "PART 3: THE FIRST CONTRACT & WORK HISTORY", redWord: "HISTORY", ph: "Document: The first $10 web dev contract delivery" },
  { index: 110, title: "PART 4: BUYING CONNECTS & REAL STRATEGY", redWord: "STRATEGY", ph: "Screen recording: Purchasing $15 connects pack on Upwork" },
  { index: 125, title: "PART 5: THE $90 CLIENT & CORE LESSONS", redWord: "LESSONS", ph: "UI Screenshot: $90 YouTube editing contract & client requirements" },
  { index: 219, title: "PART 6: WHAT I WOULD DO DIFFERENTLY & VERDICT", redWord: "VERDICT", ph: "Summary card: Realistic Upwork freelancing roadmap" },
];

const chapterMap = new Map();
for (const ch of CHAPTERS) chapterMap.set(ch.index, ch);

// Specific punchy lines that deserve L1 (Centre caption, 60px)
const PUNCHY_INDICES = new Set([
  4,   // Boy was I wrong.
  23,  // But I made a lot of mistakes at the beginning.
  24,  // First mistake I made was basically doing too much optimization and not enough actual work.
  36,  // And I did this for a long time.
  40,  // Kinects.
  46,  // Because eventually I realized that just optimizing your profile and waiting isn't enough.
  59,  // Meanwhile, my software engineering profile was basically dead silent.
  80,  // But they didn't.
  84,  // Your first job isn't just about getting your first review.
  94,  // Then came the long silent period.
  110, // And this is where my actual Upwork journey started.
  125, // And that's how I eventually got my $90 client.
  136, // And this is where I learned my first big lesson about clients.
  140, // But sometimes the client doesn't want your improvement.
  146, // The second thing I learned is to be patient with revisions.
  160, // And the third thing is communication.
  172, // Not every client is a good client.
  198, // You can't really fool most clients.
  258, // You need to actually become good enough to be hireable.
  261  // That's basically my Upwork journey.
]);

// Contextual footage / card placeholder descriptions across the video
const getPlaceholderDesc = (idx, text) => {
  if (idx < 10) return "Screen recording: Upwork homepage & searching for first client";
  if (idx < 25) return "Screen recording: Upwork profile overview (Title, rate & bio settings)";
  if (idx < 35) return "Screen recording: Upwork portfolio section with sample projects";
  if (idx < 48) return "UI Screenshot: Upwork connects balance & proposal submission page";
  if (idx < 60) return "UI Screenshot: Low-budget software engineering postings ($30-$50 full stack)";
  if (idx < 70) return "Workflow B-roll: CapCut to Premiere Pro & After Effects editing timeline";
  if (idx < 76) return "Hardware B-roll: Laptop setup purchased with video editing earnings";
  if (idx < 85) return "Document: Delivery of the first $10 web dev contract";
  if (idx < 95) return "Screen recording: Upwork public profile work history tab";
  if (idx < 105) return "Screen recording: Upwork proposal history & inbox invitations";
  if (idx < 110) return "Invoice: $20 true crime video edit contract";
  if (idx < 118) return "Screen recording: Upwork connects store & buying connects";
  if (idx < 125) return "Screen recording: Strategic job search with filters for video editing";
  if (idx < 135) return "Document: The $90 YouTube video job posting and reference link";
  if (idx < 145) return "Document: The winning proposal text submitted for the $90 client";
  if (idx < 155) return "UI Chat: Client requesting minor revisions in Upwork messenger";
  if (idx < 170) return "Workflow: Premiere Pro timeline revisions & project file handover";
  if (idx < 185) return "UI Chat: Difficult client asking for 8-minute edit for $30";
  if (idx < 200) return "UI Comparison: Bad sample projects vs 6 high-craft portfolio samples";
  if (idx < 215) return "Financial summary: Total earnings outside Upwork ($5,000+) vs Upwork";
  if (idx < 235) return "Roadmap: 3-4 months learning skill before creating freelancing profile";
  if (idx < 250) return "Screen recording: Upwork active contracts & positive client reviews";
  return "Summary: Final verdict & call to action to comment Upwork";
};

// Build scenes
const videoDur = 904.556;
const scenes = [];

for (let i = 0; i < parsedLines.length; i++) {
  const pl = parsedLines[i];
  const id = "s" + String(i + 1).padStart(3, "0");
  const nextPl = parsedLines[i + 1];
  const startSec = pl.startSec;
  // If last scene, end at videoDur
  const endSec = nextPl ? nextPl.startSec : videoDur;
  
  const ch = chapterMap.get(i);
  const isPunchy = PUNCHY_INDICES.has(i);

  let layout = "L11"; // default workhorse
  let phLabel = getPlaceholderDesc(i, pl.text);
  let placeholders = [];
  let redWords = pickRedWords(pl.text);

  if (ch) {
    layout = "L12";
    placeholders = [{ kind: "phone", label: ch.ph, aspect: "9:16" }];
    tryAddSfx({ sfx: [] }, "swoosh", startSec, videoDur);
  } else if (isPunchy) {
    layout = "L1";
    tryAddSfx({ sfx: [] }, "hit", startSec, videoDur);
  } else if (i % 6 === 0) {
    // Occasional L3 card for documents / screenshots
    layout = "L3";
    placeholders = [{ kind: "card", label: phLabel, aspect: "16:9" }];
    tryAddSfx({ sfx: [] }, "ui", startSec, videoDur);
  } else {
    // Workhorse L11 footage inset
    layout = "L11";
    placeholders = [{ kind: "footage", label: phLabel, aspect: "16:9" }];
    if (i % 4 === 0) {
      tryAddSfx({ sfx: [] }, "ui", startSec, videoDur);
    }
  }

  const sceneObj = {
    id,
    startSec: +startSec.toFixed(3),
    endSec: +endSec.toFixed(3),
    layout,
    text: pl.text,
    red: redWords,
  };

  if (placeholders.length > 0) {
    sceneObj.placeholders = placeholders;
  }

  // Attach SFX if any
  if (lastSfxSec === startSec) {
    // Was added in tryAddSfx
    const sfxFile = SFX_UI[uiIdx % SFX_UI.length];
    sceneObj.sfx = [{
      file: ch ? "swish_1.wav" : (isPunchy ? "impact_1.wav" : (SFX_UI[(uiIdx++) % SFX_UI.length])),
      category: ch ? "swoosh" : (isPunchy ? "hit" : "ui"),
      atSec: +startSec.toFixed(3),
      extraDuckDb: -3
    }];
  }

  // For L12 chapter card, caption should be the chapter title
  if (ch) {
    sceneObj.caption = ch.title;
    sceneObj.red = [ch.redWord];
    delete sceneObj.text;
  }

  scenes.push(sceneObj);
}

const finalTimeline = {
  meta: {
    fps: 30,
    width: 1920,
    height: 1080,
    durationSec: videoDur,
    background: "bg.mp4",
    backgroundIsVideo: true,
    backgroundDurationSec: 39.833,
    voiceover: "vo_norm.wav",
    textMode: "dark",
    arrowDraw: false
  },
  scenes
};

fs.writeFileSync(outTimelinePath, JSON.stringify(finalTimeline, null, 2));
console.log(`Successfully generated timeline with ${scenes.length} scenes to ${outTimelinePath}`);
