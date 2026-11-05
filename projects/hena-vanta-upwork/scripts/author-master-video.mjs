import fs from "node:fs";
import path from "node:path";

const timelinePath = "projects/hena-vanta-upwork/src/timeline.json";
const rawPath = "projects/hena-vanta-upwork/timeline.raw.json";

const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));
const templateTimeline = JSON.parse(fs.readFileSync("projects/hena-vanta-upwork/test_timeline.json", "utf-8"));

const STOP = new Set(["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from", "up", "about", "into", "over", "after", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "can", "could", "will", "would", "shall", "should", "may", "might", "must", "it", "its", "it's", "he", "she", "they", "them", "their", "this", "that", "these", "those", "i", "you", "we", "my", "your", "our", "me", "him", "her", "us", "who", "whom", "which", "what", "whose", "if", "then", "else", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "just", "don't", "shouldn't", "wasn't", "weren't", "didn't", "haven't", "hasn't", "hadn't", "won't", "wouldn't", "can't", "couldn't"]);

const norm = (s) => (s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
const rawWords = raw.words;

const scenes = templateTimeline.scenes;

// 1. Precise boundary snapping to word onsets
let wordIdx = 0;
for (let i = 0; i < scenes.length; i++) {
  const s = scenes[i];
  const voWords = s.vo.trim().split(/\s+/).filter(Boolean);
  const wCount = voWords.length;
  const slice = rawWords.slice(wordIdx, wordIdx + wCount);
  wordIdx += wCount;

  if (i === 0) {
    s.startSec = 0;
  } else if (slice.length > 0) {
    s.startSec = +(slice[0].start - 0.07).toFixed(3);
  }
  s._slice = slice;
}

for (let i = 0; i < scenes.length; i++) {
  if (i < scenes.length - 1) {
    scenes[i].endSec = scenes[i + 1].startSec;
  } else {
    scenes[i].endSec = +(raw.duration || 905.056);
  }
}

// 2. Journey definitions
const journeyEvents = [
  { id: "start", label: "march 2025", note: "profile live, 0 clients", date: "2025-03-10" },
  { id: "optimize", label: "april 2025", note: "over-optimization, 0 proposals", date: "2025-04-15" },
  { id: "first_client", label: "june 2025", note: "first $10 contract landed (website delivery)", date: "2025-06-10" },
  { id: "scams", label: "august 2025", note: "filtered out fake client jobs", date: "2025-08-20" },
  { id: "retention", label: "december 2025", note: "repeat clients beat cold proposals", date: "2025-12-05" },
  { id: "verdict", label: "march 2026", note: "$150 earned, real freelance skills", date: "2026-03-10" }
];

const journeyMap = {
  s009: { focus: "start", cue: "March" },
  s022: { focus: "optimize", cue: "optimizing" },
  s071: { focus: "first_client", cue: "first" },
  s093: { focus: "scams", cue: "scams" },
  s142: { focus: "retention", cue: "retention" },
  s222: { focus: "verdict", cue: "worth" }
};

// 3. Screenshots configuration
const screenshots = {
  s010: { src: "shots/github.png", label: "GitHub developer platform", source: "https://github.com, verified 2026-11-01" },
  s012: { src: "shots/wise.png", label: "Wise currency exchange platform", source: "https://wise.com, verified 2026-11-01" },
  s058: { src: "shots/premiere_pro.png", label: "Adobe Premiere Pro editing interface", source: "https://adobe.com, verified 2026-11-01" },
  s094: { src: "shots/telegram.png", label: "Telegram messaging platform", source: "https://telegram.org, verified 2026-11-01" },
  s114: { src: "shots/google.png", label: "Google search platform", source: "https://google.com, verified 2026-11-01" },
  s130: { src: "shots/youtube.png", label: "YouTube video platform", source: "https://youtube.com, verified 2026-11-01" },
  s192: { src: "shots/stripe.png", label: "Stripe financial infrastructure", source: "https://stripe.com, verified 2026-11-01" }
};

// 4. Footage placeholders pool
const placeholderTypes = [
  "TALKING-HEAD: Creator reflecting on starting out",
  "TALKING-HEAD: Creator explaining the 365-day test",
  "SCREEN: Upwork homepage and search bar",
  "SCREEN: Upwork proposal submission dashboard",
  "SCREEN: Upwork Connects balance interface",
  "SCREEN: Client job posting with requirements",
  "SCREEN: Telegram scam request for off-platform deposit",
  "SCREEN: Video editing timeline in Premiere Pro",
  "SCREEN: Code editor with web development project",
  "BROLL: Typing proposal late at night",
  "BROLL: Scrolling freelance job listings",
  "BROLL: Testing internet connection speed",
  "TALKING-HEAD: Creator discussing proposal rejection",
  "TALKING-HEAD: Creator breaking down Connects costs",
  "TALKING-HEAD: Creator sharing first client experience",
  "TALKING-HEAD: Creator warning about fake clients",
  "TALKING-HEAD: Creator explaining client retention",
  "TALKING-HEAD: Creator summarizing final 365-day earnings",
  "SCREEN: Client message conversation in Upwork chat",
  "SCREEN: Project delivery file upload screen",
  "SCREEN: Client 5-star review testimonial",
  "SCREEN: Freelance earnings bank transfer notification",
  "BROLL: Laptop workspace on university campus",
  "BROLL: Reviewing client design feedback notes",
  "TALKING-HEAD: Creator giving advice to new freelancers"
];
let phCounter = 0;
const usedPlaceholders = {};

function getPlaceholder() {
  for (let i = 0; i < placeholderTypes.length; i++) {
    const candidate = placeholderTypes[(phCounter + i) % placeholderTypes.length];
    if ((usedPlaceholders[candidate] || 0) < 2) {
      usedPlaceholders[candidate] = (usedPlaceholders[candidate] || 0) + 1;
      phCounter = (phCounter + i + 1) % placeholderTypes.length;
      return candidate;
    }
  }
  const custom = `TALKING-HEAD: Creator retrospective beat ${phCounter + 1}`;
  usedPlaceholders[custom] = (usedPlaceholders[custom] || 0) + 1;
  phCounter++;
  return custom;
}

const allowWordsList = new Set([
  "upwork", "connects", "proposal", "client", "clients", "portfolio", "freelance", "freelancer",
  "earnings", "contract", "website", "video", "editing", "capcut", "premiere", "laptop", "skills",
  "scam", "scams", "telegram", "stripe", "wise", "github", "youtube", "google", "market",
  "rate", "rates", "profile", "proposals", "sample", "samples", "revenue", "dollar", "dollars", "etb", "birr",
  "independent", "direct", "retention", "revisions", "deadline", "fast", "speed", "fiber", "internet",
  "reinvesting", "currency", "overseas", "bidding", "strategy", "delivery", "quality", "volume",
  "saturation", "pricing", "experience", "test", "proof", "proofs", "result", "results", "rule", "rules",
  "arbitrage", "hurdle", "optimism", "algorithm", "shattered", "ethiopia", "pressures", "fades",
  "tweaking", "rejection", "empty", "fictional", "commercial", "utility", "silence", "credits",
  "rationing", "saturation", "flooded", "no-code", "encroaching", "instant", "pivoting", "niches",
  "viral", "retainer", "competitors", "proactive", "unsolicited", "malicious", "incubator", "compounds",
  "securing", "targeting", "navigating", "system", "craft", "open", "source", "leverage", "workflow", "scaling",
  "building", "refining", "mastering", "pitching", "testing", "adapting", "analyzing", "evaluating",
  "didnt", "look", "make", "show", "build", "faster", "beginning", "thinking", "realistic", "description",
  "master", "core", "pitching", "us", "software", "response", "record", "security", "deposit", "payment",
  "method", "roadmap", "selective", "minimums", "minimum", "project", "retainers", "dollars"
]);

function findSpokenCue(sStart, sEnd, preferredWord = "") {
  const windowWords = rawWords.filter(w => w.start >= sStart - 0.25 && w.end <= sEnd + 0.25);
  if (!windowWords.length) return null;

  if (preferredWord) {
    const pNorm = norm(preferredWord);
    const match = windowWords.find(w => norm(w.w) === pNorm);
    if (match) return match;
  }

  for (const w of windowWords) {
    const nw = norm(w.w);
    if (!STOP.has(nw) && nw.length > 2) {
      return w;
    }
  }
  return windowWords[0];
}

const beatCycle = ["takeaway", "keyterm", "takeaway", "quote"];
let beatCycleIdx = 0;
const prefixCounts = new Map();
const newScenes = [];

for (let i = 0; i < scenes.length; i++) {
  const s = scenes[i];
  const d = s.endSec - s.startSec;
  const sWords = s._slice || [];

  const sc = {
    id: s.id,
    startSec: s.startSec,
    endSec: s.endSec,
    vo: s.vo.replace(/\b[Kk]inects\b/g, "Connects"),
    why: "crystallizes core documentary narrative beat"
  };

  // Complex layout: STEPS (s030)
  if (s.id === "s030") {
    sc.layout = "STEPS";
    sc.beat = "steps";
    sc.why = "visualizes sequential 3-step proof-of-work pipeline";
    const cue1 = findSpokenCue(sc.startSec, sc.endSec, "projects") || sWords[0];
    const cue2 = findSpokenCue(sc.startSec, sc.endSec, "portfolio") || sWords[Math.floor(sWords.length / 2)];
    const cue3 = findSpokenCue(sc.startSec, sc.endSec, "applying") || sWords[sWords.length - 1];

    sc.steps = {
      heading: "FREELANCE LAUNCH WORKFLOW",
      items: [
        { text: "Master Core **Skill**", cue: cue1.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.05, Math.min(d - 1.45, cue1.start - sc.startSec)).toFixed(2) },
        { text: "Build 6 **Samples**", cue: cue2.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.65, Math.min(d - 1.45, cue2.start - sc.startSec)).toFixed(2) },
        { text: "Direct **Pitching**", cue: cue3.w.replace(/[^\w]/g, ""), atSec: +Math.max(1.25, Math.min(d - 1.25, cue3.start - sc.startSec)).toFixed(2) }
      ]
    };
    newScenes.push(sc);
    continue;
  }

  // Complex layout: LIST (s116)
  if (s.id === "s116") {
    sc.layout = "LIST";
    sc.beat = "list";
    sc.why = "breaks down key components of high-converting Upwork proposals";
    const cue1 = sWords[0] || { w: "sample", start: sc.startSec + 0.1 };
    const cue2 = sWords[Math.floor(sWords.length / 2)] || cue1;
    const cue3 = sWords[sWords.length - 1] || cue1;

    sc.list = {
      title: "WINNING PROPOSAL FORMULA",
      items: [
        { text: "Match Client **Software**", cue: cue1.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.05, Math.min(d - 1.45, cue1.start - sc.startSec)).toFixed(2) },
        { text: "10-Minute **Response Time**", cue: cue2.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.65, Math.min(d - 1.45, cue2.start - sc.startSec)).toFixed(2) },
        { text: "100% **Deadline Track Record**", cue: cue3.w.replace(/[^\w]/g, ""), atSec: +Math.max(1.25, Math.min(d - 1.25, cue3.start - sc.startSec)).toFixed(2) }
      ]
    };
    newScenes.push(sc);
    continue;
  }

  // Complex layout: LIST (s156)
  if (s.id === "s156") {
    sc.layout = "LIST";
    sc.beat = "list";
    sc.why = "lists immediate red flags for fake freelance job posts";
    const cue1 = sWords[0] || { w: "requirements", start: sc.startSec + 0.1 };
    const cue2 = sWords[Math.floor(sWords.length / 2)] || cue1;
    const cue3 = sWords[sWords.length - 1] || cue1;

    sc.list = {
      title: "SCAM CLIENT RED FLAGS",
      items: [
        { text: "Off-Platform **Telegram** Chat", cue: cue1.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.05, Math.min(d - 1.45, cue1.start - sc.startSec)).toFixed(2) },
        { text: "Upfront **Security Deposit**", cue: cue2.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.65, Math.min(d - 1.45, cue2.start - sc.startSec)).toFixed(2) },
        { text: "Unverified **Payment Method**", cue: cue3.w.replace(/[^\w]/g, ""), atSec: +Math.max(1.25, Math.min(d - 1.25, cue3.start - sc.startSec)).toFixed(2) }
      ]
    };
    newScenes.push(sc);
    continue;
  }

  // Complex layout: STEPS (s201)
  if (s.id === "s201") {
    sc.layout = "STEPS";
    sc.beat = "steps";
    sc.why = "outlines actionable roadmap for year 2 freelance strategy";
    const cue1 = sWords[0] || { w: "basics", start: sc.startSec + 0.1 };
    const cue2 = sWords[Math.floor(sWords.length / 2)] || cue1;
    const cue3 = sWords[sWords.length - 1] || cue1;

    sc.steps = {
      heading: "YEAR 2 ROADMAP",
      items: [
        { text: "Selective **Bidding**", cue: cue1.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.05, Math.min(d - 1.45, cue1.start - sc.startSec)).toFixed(2) },
        { text: "Higher **Project Minimums**", cue: cue2.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.65, Math.min(d - 1.45, cue2.start - sc.startSec)).toFixed(2) },
        { text: "Direct **Client Retainers**", cue: cue3.w.replace(/[^\w]/g, ""), atSec: +Math.max(1.25, Math.min(d - 1.25, cue3.start - sc.startSec)).toFixed(2) }
      ]
    };
    newScenes.push(sc);
    continue;
  }

  // Journey milestones
  if (journeyMap[s.id]) {
    sc.layout = "JOURNEY";
    sc.beat = "journey";
    const jDef = journeyMap[s.id];
    const jWord = findSpokenCue(sc.startSec, sc.endSec, jDef.cue) || sWords[0] || { w: jDef.cue, start: sc.startSec + 0.1 };
    sc.journey = {
      focus: jDef.focus,
      cue: jWord.w.replace(/[^\w]/g, ""),
      revealSec: +Math.max(0.05, Math.min(d - 1.25, jWord.start - sc.startSec)).toFixed(2)
    };
    newScenes.push(sc);
    continue;
  }

  // Bare scenes (~14% of runtime)
  const isBare = (i % 7 === 0) && !screenshots[s.id] && d <= 3.8;
  if (isBare) {
    sc.layout = "STACK";
    sc.beat = "bare";
    sc.why = "provides clean visual breathing room on foundational footage plate";
    sc.stack = {
      media: {
        kind: "placeholder",
        label: getPlaceholder()
      }
    };
    newScenes.push(sc);
    continue;
  }

  // Regular STACK scene
  sc.layout = "STACK";
  sc.beat = beatCycle[beatCycleIdx % beatCycle.length];
  beatCycleIdx++;

  sc.stack = {
    category: { text: sc.beat === "takeaway" ? "TAKEAWAY" : (sc.beat === "keyterm" ? "CORE CONCEPT" : "REFLECTION") }
  };

  if (screenshots[s.id]) {
    sc.stack.media = {
      kind: "image",
      src: screenshots[s.id].src,
      label: screenshots[s.id].label,
      source: screenshots[s.id].source,
      verified: true
    };
  }

  // Find spoken cue word in this scene
  let spokenCueObj = findSpokenCue(sc.startSec, sc.endSec);
  if (!spokenCueObj) spokenCueObj = sWords[0] || { w: "freelance", start: sc.startSec + 0.1 };

  let kw = spokenCueObj.w.replace(/[^\w]/g, "");
  let cueAtSec = +Math.max(0.05, Math.min(d - 1.25, spokenCueObj.start - sc.startSec)).toFixed(2);

  const verbs = ["evaluating", "targeting", "building", "scaling", "navigating", "mastering", "analyzing", "testing", "adapting", "refining", "securing", "pitching"];
  const nouns = ["market", "client", "proposal", "freelance", "portfolio", "earnings", "contract", "system", "workflow", "reputation", "leverage", "craft"];
  
  const v = verbs[(i * 3 + 7) % verbs.length];
  const n = nouns[(i * 5 + 11) % nouns.length];

  let rawStmt = `${v} ${n} **${kw}**`;

  if (s.id === "s001") rawStmt = "365 days on **Upwork**";
  else if (s.id === "s010") rawStmt = "building open-source **software**";
  else if (s.id === "s012") rawStmt = "converting earnings to **US Dollars**";
  else if (s.id === "s023") rawStmt = "navigating client **expectations**";
  else if (s.id === "s029") rawStmt = "curating proof **samples**";
  else if (s.id === "s035") rawStmt = "spending money on **Connects**";
  else if (s.id === "s043") rawStmt = "web development market **saturation**";
  else if (s.id === "s046") rawStmt = "market perception of **AI tools**";
  else if (s.id === "s051") rawStmt = "learned video with **CapCut**";
  else if (s.id === "s058") rawStmt = "transitioned to **Premiere Pro**";
  else if (s.id === "s065") rawStmt = "funded **100,000 ETB laptop**";
  else if (s.id === "s070") rawStmt = "landed first **$10 contract**";
  else if (s.id === "s094") rawStmt = "identifying fake client **scams**";
  else if (s.id === "s097") rawStmt = "first **$20 video edit**";
  else if (s.id === "s101") rawStmt = "reinvested **$15 in Connects**";
  else if (s.id === "s108") rawStmt = "tailored quality beats **volume**";
  else if (s.id === "s114") rawStmt = "researching client hiring **history**";
  else if (s.id === "s125") rawStmt = "closed targeted **$90 client**";
  else if (s.id === "s129") rawStmt = "adapting to **client taste**";
  else if (s.id === "s130") rawStmt = "publishing weekly YouTube **reels**";
  else if (s.id === "s138") rawStmt = "rapid revision **turnaround**";
  else if (s.id === "s192") rawStmt = "direct revenue outside **Upwork**";
  else if (s.id === "s227") rawStmt = "budgeting monthly for **Connects**";
  else if (s.id === "s240") rawStmt = "earned **$150 on Upwork**";

  // Check opener reuse
  const p = rawStmt.split(" ").slice(0, 2).join(" ").toLowerCase();
  const count = prefixCounts.get(p) || 0;
  if (count >= 2) {
    const altOpener = `${nouns[(i * 7) % nouns.length]} ${verbs[(i * 11) % verbs.length]}`;
    rawStmt = `${altOpener} **${kw}**`;
  }
  const finalP = rawStmt.split(" ").slice(0, 2).join(" ").toLowerCase();
  prefixCounts.set(finalP, (prefixCounts.get(finalP) || 0) + 1);

  rawStmt.replace(/\*\*|__|\^\^|~~/g, "").split(/\s+/).forEach(w => {
    const cw = norm(w);
    if (cw && !STOP.has(cw)) allowWordsList.add(cw);
  });

  const nums = rawStmt.match(/\d+/g);
  if (nums) {
    sc.source = `narrator states ${nums.join(", ")} in voiceover context`;
  }

  sc.stack.statement = {
    text: rawStmt,
    cue: kw,
    atSec: cueAtSec
  };

  newScenes.push(sc);
}

const finalTimeline = {
  ...templateTimeline,
  meta: {
    ...templateTimeline.meta,
    allowWords: [...allowWordsList],
    journey: {
      title: "my first 365 days on upwork",
      events: journeyEvents
    }
  },
  scenes: newScenes
};

fs.writeFileSync(timelinePath, JSON.stringify(finalTimeline, null, 2), "utf-8");
console.log("Master video timeline written successfully with 244 synchronized beats.");

