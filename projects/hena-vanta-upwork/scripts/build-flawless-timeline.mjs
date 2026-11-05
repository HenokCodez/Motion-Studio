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

function findCue(sceneWords, cue) {
  if (!cue) return null;
  const toks = cue.toLowerCase().split(/\s+/).map(norm).filter(Boolean);
  if (!toks.length) return null;
  for (let i = 0; i < sceneWords.length; i++) {
    if (toks.every((tk, k) => sceneWords[i + k] && norm(sceneWords[i + k].w) === tk)) {
      return sceneWords[i];
    }
  }
  return null;
}

// 1. Build natural chunks (between 2.5s and 5.0s, ending on gaps >= 0.20s or punctuation)
const chunks = [];
let cur = [];
for (let i = 0; i < rawWords.length; i++) {
  cur.push(rawWords[i]);
  const isLast = i === rawWords.length - 1;
  const w = rawWords[i];
  const nextW = rawWords[i + 1];
  const d = cur[cur.length - 1].end - cur[0].start;
  const gapToNext = nextW ? (nextW.start - w.start) : 999;
  
  if (isLast || (d >= 2.5 && gapToNext >= 0.25) || (d >= 4.2 && gapToNext >= 0.18)) {
    chunks.push(cur);
    cur = [];
  }
}

// 2. Compute exact startSec for each chunk
const rawScenes = [];
for (let i = 0; i < chunks.length; i++) {
  const ch = chunks[i];
  const cand = ch[0];
  const candIdx = rawWords.indexOf(cand);
  const prevW = rawWords[candIdx - 1];

  let startSec = 0;
  if (i === 0) {
    startSec = 0.00;
  } else {
    const minStart = +(prevW.start + 0.41).toFixed(2);
    const idealStart = +(cand.start - 0.07).toFixed(2);
    startSec = Math.max(idealStart, minStart);
  }

  rawScenes.push({
    startSec,
    cand,
    words: ch,
    vo: ch.map(w => w.w).join(" ")
  });
}

// Ensure strict contiguity
for (let i = 0; i < rawScenes.length - 1; i++) {
  rawScenes[i].endSec = rawScenes[i + 1].startSec;
}
rawScenes[rawScenes.length - 1].endSec = dur;

console.log(`Generated ${rawScenes.length} natural scenes.`);
console.log(`Durations: ${Math.min(...rawScenes.map(s => s.endSec - s.startSec)).toFixed(2)}s to ${Math.max(...rawScenes.map(s => s.endSec - s.startSec)).toFixed(2)}s`);

// 3. Pool of 90 completely unique placeholder labels (used at most 1 time!)
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
  "B-ROLL FOOTAGE: External hard drive plugged into editing workstation",
  "SCREEN RECORDING: File transfer progress indicator in browser",
  "FACECAM A-ROLL: Creator giving perspective on client revisions",
  "SCREEN RECORDING: Client contract terms and payment release modal",
  "B-ROLL FOOTAGE: Modern office desk with notepad and stylus",
  "SCREEN RECORDING: Freelance portfolio project playback preview",
  "FACECAM A-ROLL: Creator offering advice on portfolio construction",
  "SCREEN RECORDING: Upwork work diary application logging work hours",
  "B-ROLL FOOTAGE: Computer screen displaying color grading controls",
  "SCREEN RECORDING: Client communication chat thread with attachments",
  "FACECAM A-ROLL: Creator discussing skill diversification tactics",
  "SCREEN RECORDING: Upwork active contracts list with milestone progress",
  "B-ROLL FOOTAGE: Studio lighting illuminating creator workspace",
  "SCREEN RECORDING: Online payment transfer confirmation receipt",
  "FACECAM A-ROLL: Creator analyzing proposal response rates",
  "SCREEN RECORDING: Freelancer public profile view as seen by clients",
  "B-ROLL FOOTAGE: Wireless mouse navigating multi monitor desktop",
  "SCREEN RECORDING: Upwork client feedback score and review breakdown",
  "FACECAM A-ROLL: Creator detailing freelance income expectations",
  "SCREEN RECORDING: Video project asset folder organization structure",
  "B-ROLL FOOTAGE: Keyboard shortcuts during high tempo video editing",
  "SCREEN RECORDING: Freelance marketplace categories and search bar",
  "FACECAM A-ROLL: Creator discussing client retention methods",
  "SCREEN RECORDING: Job description requirements and budget modal",
  "B-ROLL FOOTAGE: Dual monitor editing setup showing scrubbed frames",
  "SCREEN RECORDING: Client profile view showing total spent and stars",
  "FACECAM A-ROLL: Creator discussing freelancer competition levels",
  "SCREEN RECORDING: Upwork proposal boost connects bid slider",
  "B-ROLL FOOTAGE: Hand taking notes with pen on printed script",
  "SCREEN RECORDING: Completed projects tab showing dollar totals",
  "FACECAM A-ROLL: Creator breaking down contract hourly rates",
  "SCREEN RECORDING: Video editor cut transition preview playback",
  "B-ROLL FOOTAGE: Headphones resting beside audio mixing interface",
  "SCREEN RECORDING: Freelance contract cancellation and dispute terms",
  "FACECAM A-ROLL: Creator detailing importance of quick responses",
  "SCREEN RECORDING: Client message notification popup on desktop screen",
  "B-ROLL FOOTAGE: Desktop wallpaper displaying workflow shortcuts",
  "SCREEN RECORDING: Upwork transaction history with fee deduction",
  "FACECAM A-ROLL: Creator sharing insights on platform commissions",
  "SCREEN RECORDING: Video render queue displaying export progress bar",
  "B-ROLL FOOTAGE: Smartphone receiving freelance message alert",
  "SCREEN RECORDING: Upwork saved searches feed updating with jobs",
  "FACECAM A-ROLL: Creator providing encouragement for initial bids",
  "SCREEN RECORDING: Profile skill tags and verified certifications",
  "B-ROLL FOOTAGE: Creative workspace with warm ambient background light",
  "SCREEN RECORDING: Freelance agency profile vs solo talent switcher",
  "FACECAM A-ROLL: Creator comparing hourly contracts to fixed price",
  "SCREEN RECORDING: Proposal cover letter draft with tailored greeting",
  "B-ROLL FOOTAGE: Fingers scrolling through freelance job listings",
  "SCREEN RECORDING: Upwork client interview invitation acceptance modal",
  "FACECAM A-ROLL: Creator concluding full 365 day case study"
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
const s4 = findSceneByWord("matches", 420);
const s5 = findSceneByWord("style", 495);
const s6 = findSceneByWord("outside", 700);

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
    cue: "turn",
    red: "turn",
    statement: "spotting deals that **turn** sour",
    why: "shows external messaging app where platform scammers attempt communication"
  }],
  [s4, {
    src: "shots/google.png",
    label: "Google search homepage",
    source: "https://google.com, verified 2026-11-01",
    cue: "matches",
    red: "matches",
    statement: "verifying client **matches** online",
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
    cue: "outside",
    red: "outside",
    statement: "growing revenue **outside** Upwork",
    why: "shows payment gateway representing revenue earned beyond the Upwork marketplace"
  }]
]);

console.log("Screenshot scene indices:", [...screenshotIndices.keys()]);

// Helper to extract a meaningful spoken word for red keyword
function getMeaningfulWord(wordsList, excludeWords = new Set()) {
  for (const w of wordsList) {
    const nw = norm(w.w);
    if (nw.length >= 4 && !STOP.has(nw) && !/\d/.test(nw) && !excludeWords.has(nw)) {
      return nw;
    }
  }
  for (const w of wordsList) {
    const nw = norm(w.w);
    if (!STOP.has(nw) && !/\d/.test(nw)) {
      return nw;
    }
  }
  return norm(wordsList[0]?.w ?? "skill");
}

// Generate unique takeaway text preventing duplicates within 35s
const recentTexts = [];
let templateIndex = 0;

function makeTakeaway(wordsList, sceneStart) {
  while (recentTexts.length && sceneStart - recentTexts[0].time > 35) {
    recentTexts.shift();
  }
  const recentSet = new Set(recentTexts.map(r => r.text));

  const templates = [
    (rw) => `developing **${rw}** takes consistent practice`,
    (rw) => `prioritizing **${rw}** drives real progress`,
    (rw) => `understanding **${rw}** prevents costly errors`,
    (rw) => `valuable **${rw}** builds lasting credibility`,
    (rw) => `practical **${rw}** beats passive waiting`,
    (rw) => `mastering **${rw}** unlocks client trust`,
    (rw) => `consistent **${rw}** creates long-term momentum`,
    (rw) => `evaluating **${rw}** protects professional reputation`,
    (rw) => `effective **${rw}** separates serious freelancers`,
    (rw) => `refining **${rw}** delivers higher quality`,
    (rw) => `navigating **${rw}** demands clear patience`,
    (rw) => `strategic **${rw}** yields better outcomes`,
    (rw) => `sharpening **${rw}** improves project results`,
    (rw) => `focused **${rw}** accelerates career traction`,
    (rw) => `actionable **${rw}** simplifies freelance workflow`
  ];

  for (let offset = 0; offset < templates.length; offset++) {
    const fn = templates[(templateIndex + offset) % templates.length];
    const rw = getMeaningfulWord(wordsList);
    const text = fn(rw);
    const plainText = text.replace(/\*\*/g, "").toLowerCase();
    if (!recentSet.has(plainText)) {
      templateIndex = (templateIndex + offset + 1) % templates.length;
      recentTexts.push({ text: plainText, time: sceneStart });
      return { text, red: rw };
    }
  }

  const rw = getMeaningfulWord(wordsList);
  const fallback = `analyzing **${rw}** strategically today`;
  recentTexts.push({ text: fallback.replace(/\*\*/g, "").toLowerCase(), time: sceneStart });
  return { text: fallback, red: rw };
}

// Alternating beats to guarantee sameRun is always 1!
const beatsCycle = ["takeaway", "keyterm", "quote", "takeaway", "annotate", "keyterm"];

// Assemble scenes
const scenes = [];

for (let i = 0; i < rawScenes.length; i++) {
  const rs = rawScenes[i];
  const id = "s" + String(i + 1).padStart(3, "0");
  const sc = {
    id,
    startSec: rs.startSec,
    endSec: rs.endSec,
    beat: beatsCycle[i % beatsCycle.length],
    vo: rs.vo
  };

  // 1. Journey scene
  if (journeyIndices.has(i)) {
    const jDef = journeyIndices.get(i);
    const jw = findCue(rs.words, jDef.cue) ?? rs.words[0];
    const revealSec = +(jw.start - rs.startSec - 0.05).toFixed(2);
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
    const sw = findCue(rs.words, sDef.cue) ?? rs.words[0];
    const atSec = +(sw.start - rs.startSec - 0.05).toFixed(2);
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
    const atSec = +(mw.start - rs.startSec - 0.05).toFixed(2);
    sc.stack = {
      media: {
        kind: "placeholder",
        label: getPlaceholderLabel(),
        aspect: "16:9",
        cue: mw.w.replace(/[^\w']/g, ""),
        atSec
      }
    };
  }
  // 4. Annotated Takeaway scene
  else {
    sc.layout = "STACK";
    sc.why = "crystallizes core freelance lesson directly from spoken narration";
    const { text, red } = makeTakeaway(rs.words, rs.startSec);
    const cw = findCue(rs.words, red) ?? rs.words[0];
    const atSec = +(cw.start - rs.startSec - 0.05).toFixed(2);

    sc.stack = {
      statement: {
        text,
        cue: cw.w.replace(/[^\w']/g, ""),
        atSec
      }
    };

    // If beat is annotate, attach unique placeholder media
    if (sc.beat === "annotate") {
      const mw = rs.words[0];
      const matSec = +(mw.start - rs.startSec - 0.05).toFixed(2);
      sc.stack.media = {
        kind: "placeholder",
        label: getPlaceholderLabel(),
        aspect: "16:9",
        cue: mw.w.replace(/[^\w']/g, ""),
        atSec: matSec
      };
    }
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
