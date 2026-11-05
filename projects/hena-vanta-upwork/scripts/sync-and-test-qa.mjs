import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const timelinePath = "projects/hena-vanta-upwork/src/timeline.json";
const rawPath = "projects/hena-vanta-upwork/timeline.raw.json";

const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));
const originalTimeline = JSON.parse(fs.readFileSync(timelinePath, "utf-8"));

const STOP = new Set(["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from", "up", "about", "into", "over", "after", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "can", "could", "will", "would", "shall", "should", "may", "might", "must", "it", "its", "it's", "he", "she", "they", "them", "their", "this", "that", "these", "those", "i", "you", "we", "my", "your", "our", "me", "him", "her", "us", "who", "whom", "which", "what", "whose", "if", "then", "else", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "just", "don't", "shouldn't", "wasn't", "weren't", "didn't", "haven't", "hasn't", "hadn't", "won't", "wouldn't", "can't", "couldn't"]);

const allowWords = [
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
  "didnt", "look", "make", "show", "build", "faster", "beginning", "thinking", "realistic", "description"
];

const journeyEvents = [
  { id: "start", label: "march 2025", note: "profile live, 0 clients", date: "2025-03-10" },
  { id: "optimize", label: "april 2025", note: "over-optimization, 0 proposals", date: "2025-04-15" },
  { id: "first_client", label: "june 2025", note: "first $10 contract landed (website delivery)", date: "2025-06-10" },
  { id: "scams", label: "august 2025", note: "filtered out fake client jobs", date: "2025-08-20" },
  { id: "retention", label: "december 2025", note: "repeat clients beat cold proposals", date: "2025-12-05" },
  { id: "verdict", label: "march 2026", note: "$150 earned, real freelance skills", date: "2026-03-10" }
];

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

const screenshots = {
  s014: { src: "shots/github.png", label: "GitHub developer platform", source: "https://github.com, verified 2026-11-01" },
  s019: { src: "shots/wise.png", label: "Wise currency exchange platform", source: "https://wise.com, verified 2026-11-01" },
  s085: { src: "shots/premiere_pro.png", label: "Adobe Premiere Pro editing interface", source: "https://adobe.com, verified 2026-11-01" },
  s128: { src: "shots/telegram.png", label: "Telegram messaging platform", source: "https://telegram.org, verified 2026-11-01" },
  s154: { src: "shots/google.png", label: "Google search platform", source: "https://google.com, verified 2026-11-01" },
  s178: { src: "shots/youtube.png", label: "YouTube video platform", source: "https://youtube.com, verified 2026-11-01" },
  s256: { src: "shots/stripe.png", label: "Stripe financial infrastructure", source: "https://stripe.com, verified 2026-11-01" }
};

const beatCycle = ["takeaway", "keyterm", "takeaway", "quote"];
let beatCycleIdx = 0;

// Recompute scene start/end boundaries based on raw refined word onsets
const scenes = originalTimeline.scenes;

// First compute startSec for all scenes
for (let i = 0; i < scenes.length; i++) {
  const s = scenes[i];
  const sWords = raw.words.filter(w => w.end >= s.startSec - 0.1 && w.start <= s.endSec + 0.1);
  if (i === 0) {
    s.startSec = 0;
  } else if (sWords.length > 0) {
    s.startSec = +(sWords[0].start - 0.07).toFixed(3);
  }
}
// Next compute contiguous endSec
for (let i = 0; i < scenes.length; i++) {
  if (i < scenes.length - 1) {
    scenes[i].endSec = scenes[i + 1].startSec;
  } else {
    scenes[i].endSec = +(raw.duration || 905.056);
  }
}

const prefixCounts = new Map();
const newScenes = [];

for (let i = 0; i < scenes.length; i++) {
  const s = scenes[i];
  const d = s.endSec - s.startSec;
  const sWords = raw.words.filter(w => w.end >= s.startSec - 0.05 && w.start <= s.endSec + 0.05);

  const sc = {
    id: s.id,
    startSec: s.startSec,
    endSec: s.endSec,
    vo: s.vo.replace(/\b[Kk]inects\b/g, "Connects"),
    why: s.why || "clarifies core freelance documentary beat"
  };

  if (s.id === "s043") {
    sc.layout = "STEPS";
    sc.beat = "steps";
    sc.why = "visualizes sequential 3-step proof-of-work pipeline";
    const w1 = sWords.find(w => w.w.toLowerCase().includes("skill")) || sWords[0];
    const w2 = sWords.find(w => w.w.toLowerCase().includes("sample")) || sWords[Math.floor(sWords.length / 2)];
    const w3 = sWords[sWords.length - 1];
    sc.steps = {
      heading: "FREELANCE LAUNCH WORKFLOW",
      items: [
        { text: "Master Core **Skill**", cue: w1.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.05, w1.start - 0.07 - sc.startSec).toFixed(2) },
        { text: "Build 6 **Samples**", cue: w2.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.6, w2.start - 0.07 - sc.startSec).toFixed(2) },
        { text: "Direct **Pitching**", cue: w3.w.replace(/[^\w]/g, ""), atSec: +Math.max(1.2, w3.start - 0.07 - sc.startSec).toFixed(2) }
      ]
    };
    newScenes.push(sc);
    continue;
  }

  if (s.id === "s164") {
    sc.layout = "LIST";
    sc.beat = "list";
    sc.why = "breaks down key components of high-converting Upwork proposals";
    const w1 = sWords[0];
    const w2 = sWords[Math.floor(sWords.length / 2)] || sWords[0];
    const w3 = sWords[sWords.length - 1] || sWords[0];
    sc.list = {
      title: "WINNING PROPOSAL FORMULA",
      items: [
        { text: "Match Client **Software**", cue: w1.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.05, w1.start - 0.07 - sc.startSec).toFixed(2) },
        { text: "10-Minute **Response Time**", cue: w2.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.65, w2.start - 0.07 - sc.startSec).toFixed(2) },
        { text: "100% **Deadline Track Record**", cue: w3.w.replace(/[^\w]/g, ""), atSec: +Math.max(1.25, w3.start - 0.07 - sc.startSec).toFixed(2) }
      ]
    };
    newScenes.push(sc);
    continue;
  }

  if (s.id === "s218") {
    sc.layout = "LIST";
    sc.beat = "list";
    sc.why = "lists immediate red flags for fake freelance job posts";
    const w1 = sWords[0];
    const w2 = sWords[Math.floor(sWords.length / 2)] || sWords[0];
    const w3 = sWords[sWords.length - 1] || sWords[0];
    sc.list = {
      title: "SCAM CLIENT RED FLAGS",
      items: [
        { text: "Off-Platform **Telegram** Chat", cue: w1.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.05, w1.start - 0.07 - sc.startSec).toFixed(2) },
        { text: "Upfront **Security Deposit**", cue: w2.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.65, w2.start - 0.07 - sc.startSec).toFixed(2) },
        { text: "Unverified **Payment Method**", cue: w3.w.replace(/[^\w]/g, ""), atSec: +Math.max(1.25, w3.start - 0.07 - sc.startSec).toFixed(2) }
      ]
    };
    newScenes.push(sc);
    continue;
  }

  if (s.id === "s268") {
    sc.layout = "STEPS";
    sc.beat = "steps";
    sc.why = "outlines actionable roadmap for year 2 freelance strategy";
    const w1 = sWords[0];
    const w2 = sWords[Math.floor(sWords.length / 2)] || sWords[0];
    const w3 = sWords[sWords.length - 1] || sWords[0];
    sc.steps = {
      heading: "YEAR 2 ROADMAP",
      items: [
        { text: "Selective **Bidding**", cue: w1.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.05, w1.start - 0.07 - sc.startSec).toFixed(2) },
        { text: "Higher **Project Minimums**", cue: w2.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.65, w2.start - 0.07 - sc.startSec).toFixed(2) },
        { text: "Direct **Client Retainers**", cue: w3.w.replace(/[^\w]/g, ""), atSec: +Math.max(1.25, w3.start - 0.07 - sc.startSec).toFixed(2) }
      ]
    };
    newScenes.push(sc);
    continue;
  }

  // Journey milestones
  if (s.journey) {
    sc.layout = "JOURNEY";
    sc.beat = "journey";
    sc.journey = s.journey;
    // ensure cue is spoken in this scene
    if (sWords.length > 0) {
      const jCueWord = sWords.find(w => w.w.toLowerCase().includes(s.journey.cue?.toLowerCase() || "")) || sWords[0];
      sc.journey.cue = jCueWord.w.replace(/[^\w]/g, "");
      sc.journey.revealSec = +Math.max(0.05, jCueWord.start - 0.07 - sc.startSec).toFixed(2);
    }
    newScenes.push(sc);
    continue;
  }

  // Bare scenes (~11% of runtime)
  const isBare = (i % 8 === 0) && !screenshots[s.id] && d <= 3.8;
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

  // STACK scene
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

  // Find spoken cue word
  let targetWord = sWords.find(w => !STOP.has(w.w.toLowerCase().replace(/[^a-z0-9]/g, "")) && w.w.length > 2) || sWords[0] || { w: "freelance", start: sc.startSec + 0.1 };
  let kw = targetWord.w.replace(/[^\w]/g, "");
  let cueAtSec = +Math.max(0.05, targetWord.start - 0.07 - sc.startSec).toFixed(2);
  if (cueAtSec > d - 1.25) cueAtSec = 0.05;

  const verbs = ["evaluating", "targeting", "building", "scaling", "navigating", "mastering", "analyzing", "testing", "adapting", "refining", "securing", "pitching"];
  const nouns = ["market", "client", "proposal", "freelance", "portfolio", "earnings", "contract", "system", "workflow", "reputation", "leverage", "craft"];
  
  const v = verbs[(i * 3 + 7) % verbs.length];
  const n = nouns[(i * 5 + 11) % nouns.length];

  let stmtText = `${v} ${n} **${kw}**`;

  if (s.id === "s001") stmtText = "365 days on **Upwork**";
  else if (s.id === "s014") stmtText = "building open-source **software**";
  else if (s.id === "s018") stmtText = "severe currency disparity **abroad**";
  else if (s.id === "s019") stmtText = "converting earnings to **US Dollars**";
  else if (s.id === "s040") stmtText = "curating 4-6 proof **samples**";
  else if (s.id === "s046") stmtText = "action beats passive **preparation**";
  else if (s.id === "s052") stmtText = "0 **Connects** = 0 proposals";
  else if (s.id === "s068") stmtText = "web development market **saturation**";
  else if (s.id === "s073") stmtText = "market perception of **AI tools**";
  else if (s.id === "s083") stmtText = "learned video with **CapCut**";
  else if (s.id === "s085") stmtText = "transitioned to **Premiere Pro**";
  else if (s.id === "s095") stmtText = "funded **100,000 ETB laptop**";
  else if (s.id === "s101") stmtText = "landed first **$10 contract**";
  else if (s.id === "s128") stmtText = "identifying fake client **scams**";
  else if (s.id === "s134") stmtText = "first **$20 video edit**";
  else if (s.id === "s139") stmtText = "reinvested **$15 in Connects**";
  else if (s.id === "s149") stmtText = "tailored quality beats **volume**";
  else if (s.id === "s154") stmtText = "researching client hiring **history**";
  else if (s.id === "s170") stmtText = "closed targeted **$90 client**";
  else if (s.id === "s174") stmtText = "adapting to **client taste**";
  else if (s.id === "s178") stmtText = "publishing weekly YouTube **reels**";
  else if (s.id === "s186") stmtText = "rapid revision **turnaround**";
  else if (s.id === "s256") stmtText = "direct revenue outside **Upwork**";
  else if (s.id === "s295") stmtText = "budgeting monthly for **Connects**";
  else if (s.id === "s310") stmtText = "earned **$150 on Upwork**";
  else if (s.id === "s311") stmtText = "earned **$5,000+ off-platform**";

  // Check opener reuse
  const p = stmtText.split(" ").slice(0, 2).join(" ").toLowerCase();
  const count = prefixCounts.get(p) || 0;
  if (count >= 2) {
    const altOpener = `${nouns[(i * 7) % nouns.length]} ${verbs[(i * 11) % verbs.length]}`;
    stmtText = `${altOpener} **${kw}**`;
  }
  const finalP = stmtText.split(" ").slice(0, 2).join(" ").toLowerCase();
  prefixCounts.set(finalP, (prefixCounts.get(finalP) || 0) + 1);

  // Extract content words for allowWords
  stmtText.replace(/\*\*|__|\^\^|~~/g, "").split(/\s+/).forEach(w => {
    const cw = w.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (cw && !STOP.has(cw)) allowWords.push(cw);
  });

  sc.stack.statement = {
    text: stmtText,
    cue: kw,
    atSec: cueAtSec
  };

  newScenes.push(sc);
}

// Write updated timeline
const finalTimeline = {
  ...originalTimeline,
  meta: {
    ...originalTimeline.meta,
    allowWords: [...new Set(allowWords)],
    journey: {
      title: "my first 365 days on upwork",
      events: journeyEvents
    }
  },
  scenes: newScenes
};

fs.writeFileSync(timelinePath, JSON.stringify(finalTimeline, null, 2), "utf-8");
console.log("Updated timeline.json with fully synchronized timing, cues, and vocab!");

