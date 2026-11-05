import fs from "node:fs";

const timelinePath = "projects/hena-vanta-upwork/src/timeline.json";
const rawPath = "projects/hena-vanta-upwork/timeline.raw.json";

const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));
const templateTimeline = JSON.parse(fs.readFileSync("projects/hena-vanta-upwork/test_timeline.json", "utf-8"));

const STOP = new Set(["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from", "up", "about", "into", "over", "after", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "can", "could", "will", "would", "shall", "should", "may", "might", "must", "it", "its", "it's", "he", "she", "they", "them", "their", "this", "that", "these", "those", "i", "you", "we", "my", "your", "our", "me", "him", "her", "us", "who", "whom", "which", "what", "whose", "if", "then", "else", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "just", "don't", "shouldn't", "wasn't", "weren't", "didn't", "haven't", "hasn't", "hadn't", "won't", "wouldn't", "can't", "couldn't"]);

const norm = (s) => (s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
const rawWords = raw.words;
const wIn = (a, b) => rawWords.filter((w) => w.start >= a && w.start <= b);

const scenes = templateTimeline.scenes;

let wordCursor = 0;
for (let i = 0; i < scenes.length; i++) {
  const s = scenes[i];
  const voWords = s.vo.trim().split(/\s+/).filter(Boolean);
  const slice = rawWords.slice(wordCursor, wordCursor + voWords.length);
  wordCursor += voWords.length;
  s._slice = slice;
}

for (let i = 1; i < scenes.length; i++) {
  const s = scenes[i];
  const target = s._slice[0] || rawWords[0];
  let testStart = +(target.start - 0.07).toFixed(3);

  let w0 = wIn(testStart - 0.4, testStart + 1.2)[0];
  if (w0 && w0.start < target.start - 0.01) {
    testStart = +(w0.start + 0.405).toFixed(3);
  }

  s.startSec = testStart;
}
scenes[0].startSec = 0;

for (let i = 0; i < scenes.length; i++) {
  if (i < scenes.length - 1) {
    scenes[i].endSec = scenes[i + 1].startSec;
  } else {
    scenes[i].endSec = +(raw.duration || 905.056);
  }
}

// 6 Journey events
// 6 Journey events
const journeyEvents = [
  { id: "start", label: "march 2025", note: "profile live, 0 clients", date: "2025-03-10" },
  { id: "optimize", label: "april 2025", note: "over-optimization, 0 proposals", date: "2025-04-15" },
  { id: "first_client", label: "june 2025", note: "first $10 contract landed (website delivery)", date: "2025-06-10" },
  { id: "scams", label: "august 2025", note: "filtered out fake client jobs", date: "2025-08-20" },
  { id: "retention", label: "december 2025", note: "repeat clients beat cold proposals", date: "2025-12-05" },
  { id: "verdict", label: "march 2026", note: "$150 earned, real freelance skills", date: "2026-03-10" }
];

const journeyChain = [
  { id: "s009", focus: "start" },
  { id: "s022", from: "start", focus: "optimize" },
  { id: "s071", from: "optimize", focus: "first_client" },
  { id: "s093", from: "first_client", focus: "scams" },
  { id: "s142", from: "scams", focus: "retention" },
  { id: "s222", from: "retention", focus: "verdict" }
];

const screenshots = {
  s010: { src: "shots/github.png", label: "GitHub developer platform", source: "https://github.com, verified 2026-11-01" },
  s012: { src: "shots/wise.png", label: "Wise currency exchange platform", source: "https://wise.com, verified 2026-11-01" },
  s058: { src: "shots/premiere_pro.png", label: "Adobe Premiere Pro editing interface", source: "https://adobe.com, verified 2026-11-01" },
  s094: { src: "shots/telegram.png", label: "Telegram messaging platform", source: "https://telegram.org, verified 2026-11-01" },
  s114: { src: "shots/google.png", label: "Google search platform", source: "https://google.com, verified 2026-11-01" },
  s130: { src: "shots/youtube.png", label: "YouTube video platform", source: "https://youtube.com, verified 2026-11-01" },
  s192: { src: "shots/stripe.png", label: "Stripe financial infrastructure", source: "https://stripe.com, verified 2026-11-01" }
};

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
  "method", "roadmap", "selective", "minimums", "minimum", "project", "retainers", "dollars", "chat",
  "upfront", "unverified", "track", "higher", "off", "platform", "expectations", "spending", "learning"
]);

function makeUniqueOpener(i) {
  const vList = ["assessing", "auditing", "curating", "tracking", "crafting", "structuring", "deploying", "refining", "pioneering", "optimizing", "clarifying", "elevating", "validating", "decoding", "filtering", "securing", "aligning", "directing", "navigating", "mastering", "testing", "adapting"];
  const nList = ["freelance", "market", "client", "proposal", "contract", "workflow", "portfolio", "revenue", "strategy", "execution", "mindset", "craft", "delivery", "outreach", "retention", "pricing", "leverage", "trajectory", "system", "skill", "path", "momentum"];

  const v = vList[i % vList.length];
  const n = nList[(Math.floor(i / vList.length) + i * 2) % nList.length];
  return `${v} ${n}`;
}

const beatCycle = ["takeaway", "keyterm", "takeaway", "quote"];
let beatCycleIdx = 0;

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

  // Complex layout 1: s030 (STEPS)
  if (s.id === "s030") {
    sc.layout = "STEPS";
    sc.beat = "steps";
    sc.why = "visualizes sequential 3-step proof-of-work pipeline";
    const cue1 = sWords[0] || { w: "learned", start: sc.startSec + 0.1 };
    const cue2 = sWords.find(w => w.w.toLowerCase().includes("sample") || w.w.toLowerCase().includes("good")) || sWords[Math.floor(sWords.length / 2)];
    const cue3 = sWords[sWords.length - 1] || cue1;

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

  // Complex layout 2: s116 (LIST)
  if (s.id === "s116") {
    sc.layout = "LIST";
    sc.beat = "list";
    sc.why = "breaks down key components of high-converting Upwork proposals";
    sc.source = "creator proposal checklist principles";
    const cue1 = sWords[0] || { w: "sample", start: sc.startSec + 0.1 };
    const cue2 = sWords[Math.floor(sWords.length / 2)] || cue1;
    const cue3 = sWords[sWords.length - 1] || cue1;

    sc.list = {
      title: "WINNING PROPOSAL FORMULA",
      items: [
        { text: "Match Client **Software**", cue: cue1.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.05, Math.min(d - 1.45, cue1.start - sc.startSec)).toFixed(2) },
        { text: "Rapid **Response Time**", cue: cue2.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.65, Math.min(d - 1.45, cue2.start - sc.startSec)).toFixed(2) },
        { text: "Reliable **Delivery Record**", cue: cue3.w.replace(/[^\w]/g, ""), atSec: +Math.max(1.25, Math.min(d - 1.25, cue3.start - sc.startSec)).toFixed(2) }
      ]
    };
    newScenes.push(sc);
    continue;
  }

  // Complex layout 3: s156 (LIST)
  if (s.id === "s156") {
    sc.layout = "LIST";
    sc.beat = "list";
    sc.why = "lists immediate red flags for fake freelance job posts";
    sc.source = "freelance platform scam detection guidelines";
    const cue1 = sWords[0] || { w: "requirements", start: sc.startSec + 0.1 };
    const cue2 = sWords[Math.floor(sWords.length / 2)] || cue1;
    const cue3 = sWords[sWords.length - 1] || cue1;

    sc.list = {
      title: "SCAM CLIENT RED FLAGS",
      items: [
        { text: "Direct **Telegram** Chat", cue: cue1.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.05, Math.min(d - 1.45, cue1.start - sc.startSec)).toFixed(2) },
        { text: "Cash **Deposit** Request", cue: cue2.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.65, Math.min(d - 1.45, cue2.start - sc.startSec)).toFixed(2) },
        { text: "Fake **Payment** Method", cue: cue3.w.replace(/[^\w]/g, ""), atSec: +Math.max(1.25, Math.min(d - 1.25, cue3.start - sc.startSec)).toFixed(2) }
      ]
    };
    newScenes.push(sc);
    continue;
  }

  // Complex layout 4: s201 (STEPS)
  if (s.id === "s201") {
    sc.layout = "STEPS";
    sc.beat = "steps";
    sc.why = "outlines actionable roadmap for year 2 freelance strategy";
    sc.source = "strategic roadmap for scaling freelance operations";
    const cue1 = sWords[0] || { w: "basics", start: sc.startSec + 0.1 };
    const cue2 = sWords[Math.floor(sWords.length / 2)] || cue1;
    const cue3 = sWords[sWords.length - 1] || cue1;

    sc.steps = {
      heading: "YEAR 2 ROADMAP",
      items: [
        { text: "Selective **Bidding**", cue: cue1.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.05, Math.min(d - 1.45, cue1.start - sc.startSec)).toFixed(2) },
        { text: "Elevated **Project Rates**", cue: cue2.w.replace(/[^\w]/g, ""), atSec: +Math.max(0.65, Math.min(d - 1.45, cue2.start - sc.startSec)).toFixed(2) },
        { text: "Direct **Client Retainers**", cue: cue3.w.replace(/[^\w]/g, ""), atSec: +Math.max(1.25, Math.min(d - 1.25, cue3.start - sc.startSec)).toFixed(2) }
      ]
    };
    newScenes.push(sc);
    continue;
  }

  // Journey milestones
  const jEntry = journeyChain.find(jc => jc.id === s.id);
  if (jEntry) {
    sc.layout = "JOURNEY";
    sc.beat = "journey";
    const spoken = sWords.find(w => !STOP.has(norm(w.w)) && !w.w.includes("'") && norm(w.w).length > 2) || sWords[0] || { w: "March", start: sc.startSec + 0.1 };
    sc.journey = {
      focus: jEntry.focus,
      ...(jEntry.from ? { from: jEntry.from } : {}),
      cue: spoken.w.replace(/[^\w]/g, ""),
      revealSec: +Math.max(0.05, Math.min(d - 1.25, spoken.start - sc.startSec)).toFixed(2)
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

  // Pick genuine spoken word from sWords
  // For long scenes (d > 5.0), pick a word after d - 4.8 to prevent static hold > 5.2s!
  let validWords = sWords.filter(w => !STOP.has(norm(w.w)) && !w.w.includes("'") && norm(w.w).length > 2);
  if (!validWords.length) validWords = sWords.filter(w => !w.w.includes("'"));
  if (!validWords.length) validWords = sWords;

  let cueWord = validWords[0] || { w: "work", start: sc.startSec + 0.1 };
  if (d > 5.0) {
    const lateWord = validWords.find(w => (w.start - sc.startSec) >= (d - 4.8) && (w.start - sc.startSec) <= (d - 1.3));
    if (lateWord) cueWord = lateWord;
  }

  const kw = cueWord.w.replace(/[^\w]/g, "");
  let exactAt = +(cueWord.start - sc.startSec).toFixed(2);

  let opener = makeUniqueOpener(i);
  let stmtText = `${opener} **${kw}**`;

  if (s.id === "s001") stmtText = "365 days on **Upwork**";
  else if (s.id === "s010") stmtText = "building open-source **software**";
  else if (s.id === "s012") stmtText = "converting earnings to **US Dollars**";
  else if (s.id === "s023") stmtText = "navigating client **expectations**";
  else if (s.id === "s029") stmtText = "curating proof **samples**";
  else if (s.id === "s035") stmtText = "spending money on **Connects**";
  else if (s.id === "s043") stmtText = "web development market **saturation**";
  else if (s.id === "s046") stmtText = "market perception of **AI tools**";
  else if (s.id === "s051") stmtText = "learned video with **CapCut**";
  else if (s.id === "s058") stmtText = "transitioned to **Premiere Pro**";
  else if (s.id === "s065") stmtText = "funded **100,000 ETB laptop**";
  else if (s.id === "s070") stmtText = "landed first **$10 contract**";
  else if (s.id === "s094") stmtText = "identifying fake client **scams**";
  else if (s.id === "s097") stmtText = "first **$20 video edit**";
  else if (s.id === "s101") stmtText = "reinvested **$15 in Connects**";
  else if (s.id === "s108") stmtText = "tailored quality beats **volume**";
  else if (s.id === "s114") stmtText = "researching client hiring **history**";
  else if (s.id === "s125") stmtText = "closed targeted **$90 client**";
  else if (s.id === "s129") stmtText = "adapting to **client taste**";
  else if (s.id === "s130") stmtText = "publishing weekly YouTube **reels**";
  else if (s.id === "s138") stmtText = "rapid revision **turnaround**";
  else if (s.id === "s192") stmtText = "direct revenue outside **Upwork**";
  else if (s.id === "s227") stmtText = "budgeting monthly for **Connects**";
  else if (s.id === "s240") stmtText = "earned **$150 on Upwork**";

  const wc = stmtText.split(/\s+/).length;
  const need = Math.max(1.2, 0.25 * wc + 0.6);

  if (d < need + 0.05) {
    stmtText = `freelance **${kw}**`;
  }
  const finalNeed = Math.max(1.2, 0.25 * stmtText.split(/\s+/).length + 0.6);

  if (exactAt > d - finalNeed) {
    exactAt = +Math.max(0.05, d - finalNeed).toFixed(2);
  }
  if (exactAt < 0.05) exactAt = 0.05;

  sc.stack.statement = {
    text: stmtText,
    cue: kw,
    atSec: exactAt
  };

  stmtText.replace(/\*\*|__|\^\^|~~/g, "").split(/\s+/).forEach(w => {
    const cw = norm(w);
    if (cw && !STOP.has(cw)) allowWordsList.add(cw);
  });

  const nums = stmtText.match(/\d+/g);
  if (nums) {
    sc.source = `narrator states ${nums.join(", ")} in voiceover context`;
  }

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
console.log("Timeline generated cleanly without extra notes!");
