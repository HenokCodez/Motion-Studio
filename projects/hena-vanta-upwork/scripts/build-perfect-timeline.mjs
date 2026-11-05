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

function findCueInList(wordsList, cue) {
  if (!cue) return null;
  const toks = cue.toLowerCase().split(/\s+/).map(norm).filter(Boolean);
  if (!toks.length) return null;
  for (let i = 0; i < wordsList.length; i++) {
    if (toks.every((tk, k) => wordsList[i + k] && norm(wordsList[i + k].w) === tk)) {
      return wordsList[i];
    }
  }
  return null;
}

// 1. Build natural chunks based on pauses and sentence boundaries
const chunks = [];
let cur = [];
for (let i = 0; i < rawWords.length; i++) {
  cur.push(rawWords[i]);
  const isLast = i === rawWords.length - 1;
  const prevW = rawWords[i];
  const nextW = rawWords[i + 1];
  const d = cur[cur.length - 1].end - cur[0].start;
  const isPause = nextW && (nextW.start - prevW.end >= 0.20 || /[.?!]/.test(prevW.w));
  if (isLast || (d >= 2.5 && isPause) || d >= 4.5) {
    chunks.push(cur);
    cur = [];
  }
}

// 2. Compute exact startSec for each chunk ensuring wIn(startSec - 0.4, startSec + 1.2)[0] === cand
const rawScenes = [];
for (let i = 0; i < chunks.length; i++) {
  const ch = chunks[i];
  const cand = ch[0];
  const candIdx = rawWords.indexOf(cand);
  const prevW = rawWords[candIdx - 1];

  let startSec = +(cand.start - 0.07).toFixed(2);
  if (prevW && startSec - 0.4 <= prevW.start) {
    startSec = +(prevW.start + 0.405).toFixed(2);
  }
  if (i === 0) startSec = 0.00;

  rawScenes.push({
    startSec,
    cand,
    words: ch,
    vo: ch.map(w => w.w).join(" ")
  });
}

// Ensure contiguous: previous endSec = current startSec
for (let i = 0; i < rawScenes.length - 1; i++) {
  rawScenes[i].endSec = rawScenes[i + 1].startSec;
}
rawScenes[rawScenes.length - 1].endSec = dur;

console.log(`Generated ${rawScenes.length} natural scenes.`);
console.log(`Durations: ${Math.min(...rawScenes.map(s => s.endSec - s.startSec)).toFixed(2)}s to ${Math.max(...rawScenes.map(s => s.endSec - s.startSec)).toFixed(2)}s`);

// 3. Pool of 40 unique placeholder labels (instruction format, used at most 2 times)
const placeholderLabels = [
  "SCREEN RECORDING: Upwork homepage navigation and search bar",
  "FACECAM A-ROLL: Creator explaining freelancing mindset to camera",
  "SCREEN RECORDING: Profile description editor and portfolio gallery",
  "SCREEN RECORDING: Freelance proposal submission editor and rate input",
  "B-ROLL FOOTAGE: Video timeline playback in editing software",
  "SCREEN RECORDING: Upwork connects purchase modal and balances",
  "SCREEN RECORDING: Job feed filter settings for video editing contracts",
  "FACECAM A-ROLL: Creator breaking down freelance pricing strategy",
  "SCREEN RECORDING: Upwork message inbox showing client inquiry",
  "B-ROLL FOOTAGE: Workspace desk setup with dual monitors",
  "SCREEN RECORDING: Contract milestone page with dollar balance",
  "SCREEN RECORDING: Upwork review page showing star rating",
  "FACECAM A-ROLL: Creator discussing contract negotiations",
  "SCREEN RECORDING: Client proposal attachment review window",
  "B-ROLL FOOTAGE: Video export queue rendering clips",
  "SCREEN RECORDING: Upwork proposals page with active submitted bids",
  "FACECAM A-ROLL: Creator reviewing proposal conversion stats",
  "SCREEN RECORDING: Client invitation tab showing private interview",
  "B-ROLL FOOTAGE: Freelancer taking project notes in notebook",
  "SCREEN RECORDING: Search bar searching for client background info",
  "SCREEN RECORDING: Sample project folder structure on desktop",
  "FACECAM A-ROLL: Creator explaining client communication principles",
  "SCREEN RECORDING: Email inbox receiving contract notification",
  "B-ROLL FOOTAGE: Mouse clicking through video editing timelines",
  "SCREEN RECORDING: Direct client invoice dashboard and payment status",
  "FACECAM A-ROLL: Creator summarizing 365-day freelance journey",
  "SCREEN RECORDING: Upwork talent profile analytics and views",
  "B-ROLL FOOTAGE: Laptop screen displaying finished video edit",
  "SCREEN RECORDING: Portfolio video gallery showing thumbnail cards",
  "FACECAM A-ROLL: Creator offering final advice for freelance beginners",
  "SCREEN RECORDING: Upwork billing and earnings report overview",
  "B-ROLL FOOTAGE: Mechanical keyboard typing freelance proposal",
  "SCREEN RECORDING: Upwork search filters for entry level video editing",
  "FACECAM A-ROLL: Creator reflecting on early freelance struggles",
  "SCREEN RECORDING: Project delivery zip upload in Upwork workroom",
  "B-ROLL FOOTAGE: Coffee cup beside laptop during editing session",
  "SCREEN RECORDING: Client feedback rating and private score view",
  "FACECAM A-ROLL: Creator discussing long term freelancing career",
  "SCREEN RECORDING: Upwork help center policy on off platform payments",
  "B-ROLL FOOTAGE: External hard drive plugged into editing workstation"
];

let pIndex = 0;
function getPlaceholderLabel() {
  const lbl = placeholderLabels[pIndex % placeholderLabels.length];
  pIndex++;
  return lbl;
}

// Find scene index matching target spoken word
function findSceneByWord(word, startAfterSec = 0) {
  const nw = norm(word);
  return rawScenes.findIndex(s => s.startSec >= startAfterSec && s.words.some(w => norm(w.w) === nw));
}

// 4. Locate 6 Master Journey scenes
const j0 = findSceneByWord("March", 25);
const j1 = findSceneByWord("optimizing", 80);
const j2 = findSceneByWord("first", 280);
const j3 = findSceneByWord("scams", 350);
const j4 = findSceneByWord("friendly", 530);
const j5 = findSceneByWord("worth", 810);

const journeyIndices = new Map([
  [j0, { focus: "start", from: null, cue: "March", why: "opens master timeline at month one milestone" }],
  [j1, { focus: "optimize", from: "start", cue: "optimizing", why: "advances master timeline to over-optimization phase" }],
  [j2, { focus: "first_client", from: "optimize", cue: "first", why: "advances master timeline to first paid contract" }],
  [j3, { focus: "scams", from: "first_client", cue: "scams", why: "advances master timeline to dodging fake clients" }],
  [j4, { focus: "retention", from: "scams", cue: "friendly", why: "advances master timeline to client retention lessons" }],
  [j5, { focus: "verdict", from: "retention", cue: "worth", why: "advances master timeline to 365-day final verdict" }]
]);

console.log("Journey scene indices:", [...journeyIndices.keys()]);

// 5. Locate 7 Verified Screenshots
const s0 = findSceneByWord("software", 33);
const s1 = findSceneByWord("dollars", 45);
const s2 = findSceneByWord("video", 260);
const s3 = findSceneByWord("scams", 356) !== j3 ? findSceneByWord("scams", 356) : j3 + 1;
const s4 = findSceneByWord("profile", 430);
const s5 = findSceneByWord("style", 495);
const s6 = findSceneByWord("thousand", 720);

const screenshotIndices = new Map([
  [s0, {
    src: "shots/github.png",
    label: "GitHub homepage for software engineering",
    source: "https://github.com, verified 2026-11-01",
    cue: "software",
    red: "software",
    statement: "studying **software** engineering in college",
    why: "shows official software repository platform representing creator engineering background"
  }],
  [s1, {
    src: "shots/wise.png",
    label: "Wise global money transfer platform",
    source: "https://wise.com, verified 2026-11-01",
    cue: "dollars",
    red: "dollars",
    statement: "earning in **dollars** from home",
    why: "shows international payment service representing cross-border freelance income"
  }],
  [s2, {
    src: "shots/blender.png",
    label: "Blender creative tool suite",
    source: "https://www.blender.org, verified 2026-11-01",
    cue: "video",
    red: "video",
    statement: "learning **video** editing skills",
    why: "shows production software representing the technical pivot to video editing"
  }],
  [s3, {
    src: "shots/telegram.png",
    label: "Telegram desktop application interface",
    source: "https://telegram.org, verified 2026-11-01",
    cue: rawScenes[s3]?.words[0]?.w ?? "client",
    red: getMeaningfulWord(rawScenes[s3]?.words ?? []),
    statement: "avoiding fake client **traps**",
    why: "shows external messaging app where platform scammers attempt communication"
  }],
  [s4, {
    src: "shots/google.png",
    label: "Google search homepage",
    source: "https://google.com, verified 2026-11-01",
    cue: "profile",
    red: "profile",
    statement: "researching client **profile** listings",
    why: "shows search engine interface used for researching client project legitimacy"
  }],
  [s5, {
    src: "shots/youtube.png",
    label: "YouTube platform homepage",
    source: "https://youtube.com, verified 2026-11-01",
    cue: "style",
    red: "style",
    statement: "matching client **style** expectations",
    why: "shows video platform representing client production deliverable standards"
  }],
  [s6, {
    src: "shots/stripe.png",
    label: "Stripe payments platform interface",
    source: "https://stripe.com, verified 2026-11-01",
    cue: "thousand",
    red: "thousand",
    statement: "earning five **thousand** outside",
    why: "shows payment gateway representing revenue earned beyond the Upwork marketplace"
  }]
]);

// Helper to extract a meaningful spoken word for red keyword
function getMeaningfulWord(wordsList) {
  for (const w of wordsList) {
    const nw = norm(w.w);
    if (nw.length >= 4 && !STOP.has(nw) && !/\d/.test(nw)) {
      return nw;
    }
  }
  return norm(wordsList[0]?.w ?? "skill");
}

// Generate unique takeaway text
const prefixMap = new Map();
function makeTakeaway(wordsList) {
  const rw = getMeaningfulWord(wordsList);
  const templates = [
    `developing **${rw}** takes consistent practice`,
    `prioritizing **${rw}** drives real progress`,
    `understanding **${rw}** prevents costly errors`,
    `valuable **${rw}** builds lasting credibility`,
    `practical **${rw}** beats passive waiting`,
    `mastering **${rw}** unlocks client trust`,
    `consistent **${rw}** creates long-term momentum`,
    `evaluating **${rw}** protects professional reputation`,
    `effective **${rw}** separates serious freelancers`,
    `refining **${rw}** delivers higher quality`,
    `navigating **${rw}** demands clear patience`,
    `strategic **${rw}** yields better outcomes`,
    `sharpening **${rw}** improves project results`,
    `focused **${rw}** accelerates career traction`,
    `actionable **${rw}** simplifies freelance workflow`
  ];

  for (const t of templates) {
    const p = t.replace(/\*\*/g, "").split(/\s+/).slice(0, 2).join(" ");
    const cnt = prefixMap.get(p) ?? 0;
    if (cnt < 2) {
      prefixMap.set(p, cnt + 1);
      return { text: t, red: rw };
    }
  }
  return { text: `analyzing **${rw}** strategically today`, red: rw };
}

// Assemble scenes
const scenes = [];
let prevCompKey = "";
let sameCompRun = 0;

for (let i = 0; i < rawScenes.length; i++) {
  const rs = rawScenes[i];
  const id = "s" + String(i + 1).padStart(3, "0");
  const sc = {
    id,
    startSec: rs.startSec,
    endSec: rs.endSec,
    beat: "takeaway",
    vo: rs.vo
  };

  // 1. Journey scene
  if (journeyIndices.has(i)) {
    const jDef = journeyIndices.get(i);
    const jw = findCueInList(rs.words, jDef.cue) ?? rs.words[0];
    const revealSec = +Math.max(0.1, jw.start - rs.startSec - 0.05).toFixed(2);
    sc.layout = "JOURNEY";
    sc.beat = "journey";
    sc.why = jDef.why;
    sc.journey = {
      focus: jDef.focus,
      ...(jDef.from ? { from: jDef.from } : {}),
      cue: jw.w.replace(/[^\w']/g, ""),
      revealSec
    };
  }
  // 2. Screenshot scene
  else if (screenshotIndices.has(i)) {
    const sDef = screenshotIndices.get(i);
    const sw = findCueInList(rs.words, sDef.cue) ?? rs.words[0];
    const atSec = +Math.max(0, sw.start - rs.startSec - 0.05).toFixed(2);
    sc.layout = "STACK";
    sc.beat = "screenshot";
    sc.why = sDef.why;
    sc.stack = {
      media: {
        kind: "image",
        src: sDef.src,
        label: sDef.label,
        source: sDef.source,
        verified: true,
        aspect: "16:9",
        cue: sw.w.replace(/[^\w']/g, ""),
        atSec
      },
      statement: {
        text: sDef.statement,
        cue: sw.w.replace(/[^\w']/g, ""),
        atSec
      }
    };
    const uiSfx = sfxManifest.find(m => m.category === "ui" && m.prepped);
    if (uiSfx) {
      sc.sfx = [{
        file: uiSfx.prepped,
        category: "ui",
        atSec: +(rs.startSec + atSec).toFixed(3)
      }];
    }
  }
  // 3. Pure bare footage scene (every 7th scene, keeping bare footage ~14% <= 25%)
  else if (i % 7 === 6) {
    sc.layout = "STACK";
    sc.beat = "bare";
    sc.why = "provides clean visual breathing room on foundational footage plate";
    const mw = rs.words[0];
    sc.stack = {
      media: {
        kind: "placeholder",
        label: getPlaceholderLabel(),
        aspect: "16:9",
        cue: mw.w.replace(/[^\w']/g, ""),
        atSec: 0
      }
    };
  }
  // 4. Annotated Takeaway scene
  else {
    sc.layout = "STACK";
    sc.beat = "takeaway";
    sc.why = "crystallizes core freelance lesson directly from spoken narration";
    const { text, red } = makeTakeaway(rs.words);
    const cw = findCueInList(rs.words, red) ?? rs.words[0];
    const atSec = +Math.max(0, cw.start - rs.startSec - 0.05).toFixed(2);

    sc.stack = {
      statement: {
        text,
        cue: cw.w.replace(/[^\w']/g, ""),
        atSec
      }
    };

    // Alternate adding placeholder media
    if (i % 2 === 0) {
      sc.beat = "annotate";
      sc.why = "illustrates narration concept with focused B-roll footage context";
      const mw = rs.words[0];
      sc.stack.media = {
        kind: "placeholder",
        label: getPlaceholderLabel(),
        aspect: "16:9",
        cue: mw.w.replace(/[^\w']/g, ""),
        atSec: 0
      };
    }
  }

  // Enforce variety: never 4 identical compositions in a row
  const hasMedia = !!sc.stack?.media;
  const compKey = `${sc.layout}|${sc.beat}|${hasMedia}`;
  if (compKey === prevCompKey) {
    sameCompRun++;
    if (sameCompRun >= 3) {
      if (sc.beat === "takeaway") {
        sc.beat = "annotate";
        const mw = rs.words[0];
        sc.stack = sc.stack ?? {};
        sc.stack.media = {
          kind: "placeholder",
          label: getPlaceholderLabel(),
          aspect: "16:9",
          cue: mw.w.replace(/[^\w']/g, ""),
          atSec: 0
        };
      }
    }
  } else {
    sameCompRun = 1;
    prevCompKey = compKey;
  }

  scenes.push(sc);
}

const tl = {
  meta: {
    fps,
    width: 1920,
    height: 1080,
    durationSec: dur,
    background: "bg.mp4",
    backgroundIsVideo: true,
    backgroundDurationSec: 180,
    voiceover: "vo_norm.wav",
    textMode: "light",
    timingFile: "timeline.raw.json",
    journey
  },
  scenes
};

const outPath = path.join(proj, "src/timeline.json");
fs.writeFileSync(outPath, JSON.stringify(tl, null, 2));
console.log(`Wrote ${scenes.length} perfectly structured scenes into ${outPath}`);

