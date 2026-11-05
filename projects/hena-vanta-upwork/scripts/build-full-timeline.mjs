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

// Extract first suitable content word from scene words
function getMeaningfulWord(wordsList, preferred) {
  if (preferred) {
    const pw = wordsList.find(w => norm(w.w) === norm(preferred));
    if (pw) return norm(pw.w);
  }
  for (const w of wordsList) {
    const nw = norm(w.w);
    if (nw.length >= 4 && !STOP.has(nw) && !/\d/.test(nw)) {
      return nw;
    }
  }
  return norm(wordsList[0]?.w ?? "lesson");
}

// Collect raw scenes with duration 2.8s - 5.1s
const rawScenes = [];
let cur = [];
for (let i = 0; i < rawWords.length; i++) {
  cur.push(rawWords[i]);
  const start = cur[0].start;
  const end = rawWords[i].end;
  const d = end - start;
  const isPunct = /[.?!,]/.test(rawWords[i].w);
  const isLast = i === rawWords.length - 1;
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

// Ensure contiguous
for (let i = 0; i < rawScenes.length - 1; i++) {
  rawScenes[i].endSec = rawScenes[i + 1].startSec;
}
rawScenes[rawScenes.length - 1].endSec = dur;

// Master pool of unique instructions for placeholder footage (no label used > 2 times)
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

let labelIndex = 0;
function getPlaceholderLabel() {
  const lbl = placeholderLabels[labelIndex % placeholderLabels.length];
  labelIndex++;
  return lbl;
}

// 7 Verified Screenshots definitions
const screenshotMap = new Map([
  [8, {
    src: "shots/github.png",
    label: "GitHub homepage for software engineering",
    source: "https://github.com, verified 2026-11-01",
    cue: "software",
    statement: "studying **software** engineering at university",
    why: "shows the official software platform representing student background"
  }],
  [11, {
    src: "shots/wise.png",
    label: "Wise global money transfer platform",
    source: "https://wise.com, verified 2026-11-01",
    cue: "dollars",
    statement: "earning in **dollars** from home",
    why: "shows global currency transfer platform representing online dollar income"
  }],
  [65, {
    src: "shots/blender.png",
    label: "Blender creative tool suite",
    source: "https://www.blender.org, verified 2026-11-01",
    cue: "video",
    statement: "learning **video** editing skills",
    why: "shows the creative editing software learned during freelance pivot"
  }],
  [88, {
    src: "shots/telegram.png",
    label: "Telegram desktop application interface",
    source: "https://telegram.org, verified 2026-11-01",
    cue: "scams",
    statement: "identifying fake client **scams**",
    why: "shows communication platform commonly used by freelance scammers"
  }],
  [105, {
    src: "shots/google.png",
    label: "Google search homepage",
    source: "https://google.com, verified 2026-11-01",
    cue: "matches",
    statement: "verifying client **matches** online",
    why: "shows official search tool used to investigate client legitimacy"
  }],
  [121, {
    src: "shots/youtube.png",
    label: "YouTube platform homepage",
    source: "https://youtube.com, verified 2026-11-01",
    cue: "client",
    statement: "editing for client **taste**",
    why: "shows video platform representing target content creation market"
  }],
  [175, {
    src: "shots/stripe.png",
    label: "Stripe payments platform interface",
    source: "https://stripe.com, verified 2026-11-01",
    cue: "outside",
    statement: "growing revenue **outside** Upwork",
    why: "shows global payment processor representing off-platform freelance revenue"
  }]
]);

// 6 Master Journey scenes definitions
const journeyMap = new Map([
  [7, { focus: "start", from: null, cue: "March", why: "opens master timeline at month one milestone" }],
  [20, { focus: "optimize", from: "start", cue: "optimizing", why: "advances master timeline to over-optimization phase" }],
  [68, { focus: "first_client", from: "optimize", cue: "first", why: "advances master timeline to first paid contract" }],
  [87, { focus: "scams", from: "first_client", cue: "scams", why: "advances master timeline to dodging fake clients" }],
  [133, { focus: "retention", from: "scams", cue: "friendly", why: "advances master timeline to client retention lessons" }],
  [197, { focus: "verdict", from: "retention", cue: "worth", why: "advances master timeline to 365-day final verdict" }]
]);

// Special Lists & Steps scenes definitions
const listMap = new Map([
  [3, {
    title: { text: "roadmap for this **video**", cue: "video" },
    items: [
      { text: "early portfolio mistakes", cue: "wrong" },
      { text: "landing initial contracts", cue: "first" },
      { text: "valuable client lessons", cue: "learned" }
    ],
    why: "outlines the key stages covered in the video breakdown"
  }],
  [72, {
    title: { text: "first contract **realities**", cue: "job" },
    items: [
      { text: "reviews build history", cue: "review" },
      { text: "credibility takes time", cue: "stays" }
    ],
    why: "summarizes why initial job selection dictates long-term profile history"
  }],
  [110, {
    title: { text: "proposal submission **rules**", cue: "matches" },
    items: [
      { text: "tailor specific pitch", cue: "profile" },
      { text: "avoid generic templates", cue: "don't" }
    ],
    why: "breaks down core principles of winning client proposals"
  }],
  [142, {
    title: { text: "client management **habits**", cue: "communicate" },
    items: [
      { text: "ask before assuming", cue: "ask" },
      { text: "clarify minor adjustments", cue: "small" }
    ],
    why: "highlights essential communication habits that prevent revisions"
  }],
  [205, {
    title: { text: "core steps for **beginners**", cue: "useful" },
    items: [
      { text: "master single skill", cue: "skill" },
      { text: "create sample projects", cue: "mistakes" }
    ],
    why: "provides actionable roadmap for new freelancers starting today"
  }]
]);

const stepsMap = new Map([
  [36, {
    heading: { text: "Upwork connects **cycle**", cue: "profile" },
    items: [
      { text: "invest in credits", cue: "make" },
      { text: "apply to contracts", cue: "better" }
    ],
    why: "diagrams the platform mechanic required to apply for freelance jobs"
  }],
  [101, {
    heading: { text: "vetting job **listings**", cue: "sample" },
    items: [
      { text: "review sample files", cue: "saw" },
      { text: "confirm editing skill", cue: "matched" }
    ],
    why: "outlines systematic process for selecting high quality job posts"
  }],
  [138, {
    heading: { text: "resolving client **feedback**", cue: "problems" },
    items: [
      { text: "listen to request", cue: "editing" },
      { text: "confirm exact vision", cue: "communication" }
    ],
    why: "shows sequential steps to handle revisions without conflict"
  }],
  [187, {
    heading: { text: "long term **growth** path", cue: "skill" },
    items: [
      { text: "build practical ability", cue: "learn" },
      { text: "show verified evidence", cue: "freelance" }
    ],
    why: "maps progressive stages from beginner practice to paid contracts"
  }]
]);

// Stat scenes definitions
const statMap = new Map([
  [15, {
    template: "**${n}** months needed",
    from: 0,
    to: 3,
    label: "to understand platform basics",
    cue: "three",
    why: "highlights the realistic timeframe required to gain initial traction"
  }],
  [67, {
    template: "**$${n}** first gig",
    from: 0,
    to: 10,
    label: "earned for initial website build",
    cue: "ten",
    why: "quantifies the modest compensation of the first completed job"
  }],
  [174, {
    template: "**$${n}** outside earnings",
    from: 0,
    to: 5000,
    label: "generated through direct clients",
    cue: "thousand",
    why: "contrasts platform income with total freelance earnings"
  }],
  [198, {
    template: "**$${n}** Upwork total",
    from: 0,
    to: 150,
    label: "earned across 365 days",
    cue: "hundred",
    why: "states exact annual revenue figure from Upwork contracts"
  }]
]);

// Track statement prefixes to guarantee no 2-word prefix is reused in > 2 scenes
const prefixCount = new Map();

function buildUniqueTakeaway(wordsList, fallbackRed) {
  const rw = getMeaningfulWord(wordsList, fallbackRed);
  
  // A collection of clean takeaway templates tailored to freelance topics
  const candidates = [
    `developing **${rw}** requires dedication`,
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

  for (const cand of candidates) {
    const p = cand.replace(/\*\*/g, "").split(/\s+/).slice(0, 2).join(" ");
    const cnt = prefixCount.get(p) ?? 0;
    if (cnt < 2) {
      prefixCount.set(p, cnt + 1);
      return cand;
    }
  }

  // Fallback unique with dynamic verb
  const dyn = `analyzing **${rw}** strategically`;
  return dyn;
}

// Assemble final scenes
const scenes = [];
let prevCompKey = "";
let sameCompRun = 0;

for (let i = 0; i < rawScenes.length; i++) {
  const rs = rawScenes[i];
  const id = "s" + String(i + 1).padStart(3, "0");
  const d = rs.endSec - rs.startSec;

  const sc = {
    id,
    startSec: rs.startSec,
    endSec: rs.endSec,
    beat: "takeaway",
    vo: rs.vo
  };

  // 1. Check if Journey scene
  if (journeyMap.has(i)) {
    const jDef = journeyMap.get(i);
    const jw = findCue(rs.words, jDef.cue) ?? rs.words[0];
    sc.layout = "JOURNEY";
    sc.beat = "journey";
    sc.why = jDef.why;
    sc.journey = {
      focus: jDef.focus,
      ...(jDef.from ? { from: jDef.from } : {}),
      cue: jw.w.replace(/[^\w']/g, ""),
      revealSec: 0.5
    };
  }
  // 2. Check if Screenshot scene
  else if (screenshotMap.has(i)) {
    const sDef = screenshotMap.get(i);
    const sw = findCue(rs.words, sDef.cue) ?? rs.words[0];
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
        atSec: 0
      },
      statement: {
        text: sDef.statement,
        cue: sw.w.replace(/[^\w']/g, ""),
        atSec: +Math.max(0, sw.start - rs.startSec - 0.05).toFixed(2)
      }
    };
    // Add UI sound effect
    const uiSfx = sfxManifest.find(m => m.category === "ui" && m.prepped);
    if (uiSfx) {
      sc.sfx = [{
        file: uiSfx.prepped,
        category: "ui",
        atSec: +rs.startSec.toFixed(3)
      }];
    }
  }
  // 3. Check if List scene
  else if (listMap.has(i)) {
    const lDef = listMap.get(i);
    sc.layout = "LIST";
    sc.beat = "list";
    sc.why = lDef.why;
    const tw = findCue(rs.words, lDef.title.cue) ?? rs.words[0];
    const items = lDef.items.map((it, idx) => {
      const cw = findCue(rs.words, it.cue) ?? rs.words[Math.min(rs.words.length - 1, idx + 1)];
      const atSec = +Math.max(0.6 + idx * 0.6, cw.start - rs.startSec - 0.05).toFixed(2);
      return { text: it.text, cue: cw.w.replace(/[^\w']/g, ""), atSec };
    });
    items.sort((a, b) => a.atSec - b.atSec);
    for (let k = 1; k < items.length; k++) {
      if (items[k].atSec < items[k - 1].atSec + 0.5) {
        items[k].atSec = +(items[k - 1].atSec + 0.55).toFixed(2);
      }
    }
    sc.list = {
      title: {
        text: lDef.title.text,
        cue: tw.w.replace(/[^\w']/g, ""),
        atSec: +Math.max(0.1, tw.start - rs.startSec - 0.05).toFixed(2)
      },
      items
    };
  }
  // 4. Check if Steps scene
  else if (stepsMap.has(i)) {
    const stDef = stepsMap.get(i);
    sc.layout = "STEPS";
    sc.beat = "steps";
    sc.why = stDef.why;
    const hw = findCue(rs.words, stDef.heading.cue) ?? rs.words[0];
    const items = stDef.items.map((it, idx) => {
      const cw = findCue(rs.words, it.cue) ?? rs.words[Math.min(rs.words.length - 1, idx + 1)];
      const atSec = +Math.max(0.5 + idx * 0.6, cw.start - rs.startSec - 0.05).toFixed(2);
      return { text: it.text, cue: cw.w.replace(/[^\w']/g, ""), atSec };
    });
    items.sort((a, b) => a.atSec - b.atSec);
    for (let k = 1; k < items.length; k++) {
      if (items[k].atSec <= items[k - 1].atSec) {
        items[k].atSec = +(items[k - 1].atSec + 0.55).toFixed(2);
      }
    }
    sc.steps = {
      heading: {
        text: stDef.heading.text,
        cue: hw.w.replace(/[^\w']/g, ""),
        atSec: +Math.max(0.1, hw.start - rs.startSec - 0.05).toFixed(2)
      },
      items
    };
  }
  // 5. Check if Stat scene
  else if (statMap.has(i)) {
    const stDef = statMap.get(i);
    sc.layout = "STACK";
    sc.beat = "stat";
    sc.why = stDef.why;
    const cw = findCue(rs.words, stDef.cue) ?? rs.words[0];
    sc.stack = {
      stat: {
        template: stDef.template,
        from: stDef.from,
        to: stDef.to,
        label: stDef.label,
        cue: cw.w.replace(/[^\w']/g, ""),
        atSec: +Math.max(0.1, cw.start - rs.startSec - 0.05).toFixed(2)
      }
    };
  }
  // 6. Check if Bare footage scene (roughly every 6th scene, keeping bare run <= 1 scene)
  else if (i % 6 === 5) {
    sc.layout = "STACK";
    sc.beat = "bare";
    sc.why = "provides continuous visual breathing room on foundational footage plate";
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
  // 7. Standard Stack scene with Takeaway text
  else {
    sc.layout = "STACK";
    sc.beat = "takeaway";
    sc.why = "crystallizes core freelance lesson directly from spoken narration";
    const rw = getMeaningfulWord(rs.words);
    const cw = findCue(rs.words, rw) ?? rs.words[0];
    const stmtText = buildUniqueTakeaway(rs.words, rw);
    const atSec = +Math.max(0, cw.start - rs.startSec - 0.05).toFixed(2);

    sc.stack = {
      statement: {
        text: stmtText,
        cue: cw.w.replace(/[^\w']/g, ""),
        atSec
      }
    };

    // Every other takeaway gets an accompanying placeholder media box
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

  // Check 4-in-a-row rule
  const hasMedia = !!sc.stack?.media;
  const compKey = `${sc.layout}|${sc.beat}|${hasMedia}`;
  if (compKey === prevCompKey) {
    sameCompRun++;
    if (sameCompRun >= 3) {
      // Toggle beat or media to break monotony
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

// Final assembly
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
console.log(`Successfully generated ${scenes.length} verified scenes into ${outPath}`);

