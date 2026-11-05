import fs from "node:fs";

const timelinePath = "projects/hena-vanta-upwork/src/timeline.json";
const rawPath = "projects/hena-vanta-upwork/timeline.raw.json";

const timeline = JSON.parse(fs.readFileSync(timelinePath, "utf-8"));
const raw = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

// 1. Fix Journey Milestone 3
timeline.meta.journey.events = [
  { id: "start", label: "march 2025", note: "profile live, 0 clients", date: "2025-03-10" },
  { id: "optimize", label: "april 2025", note: "over-optimization, 0 proposals", date: "2025-04-15" },
  { id: "first_client", label: "june 2025", note: "first $10 contract landed (website delivery)", date: "2025-06-10" },
  { id: "scams", label: "august 2025", note: "filtered out fake client jobs", date: "2025-08-20" },
  { id: "retention", label: "december 2025", note: "repeat clients beat cold proposals", date: "2025-12-05" },
  { id: "verdict", label: "march 2026", note: "$150 earned, real freelance skills", date: "2026-03-10" }
];

// Add allowWords to meta
timeline.meta.allowWords = [
  "upwork", "connects", "proposal", "client", "clients", "portfolio", "freelance", "freelancer",
  "earnings", "contract", "website", "video", "editing", "capcut", "premiere", "laptop", "skills",
  "scam", "scams", "telegram", "stripe", "wise", "github", "youtube", "blender", "google", "market",
  "rate", "rates", "profile", "proposals", "sample", "samples", "revenue", "dollar", "dollars", "etb", "birr",
  "independent", "direct", "retention", "revisions", "deadline", "fast", "speed", "fiber", "internet",
  "reinvesting", "currency", "overseas", "bidding", "strategy", "delivery", "quality", "volume",
  "saturation", "pricing", "experience", "test", "proof", "proofs", "result", "results", "rule", "rules"
];

// Curated authentic takeaways mapping by scene index / topic
// We will replace template phrases with high-signal, punchy 2-4 word domain takeaways
const templatesPattern = /(takes consistent practice|drives real progress|simplifies freelance workflow|prevents costly errors|builds lasting credibility|demands clear patience|unlocks client trust|delivers higher quality|protects professional reputation|requires clear focus|yields better outcomes)/i;

// Curate distinct footage placeholder descriptions so no label is reused > 2 times
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
let phIndex = 0;
const usedPlaceholders = {};

function getDistinctPlaceholder(fallback) {
  for (let i = 0; i < placeholderTypes.length; i++) {
    const candidate = placeholderTypes[(phIndex + i) % placeholderTypes.length];
    if ((usedPlaceholders[candidate] || 0) < 2) {
      usedPlaceholders[candidate] = (usedPlaceholders[candidate] || 0) + 1;
      phIndex = (phIndex + i + 1) % placeholderTypes.length;
      return candidate;
    }
  }
  // Generate a numbered unique instruction if pool exhausted
  const custom = `TALKING-HEAD: Creator analysis beat ${phIndex + 1}`;
  usedPlaceholders[custom] = (usedPlaceholders[custom] || 0) + 1;
  phIndex++;
  return custom;
}

// Introduce real LIST and STEPS layouts
// Scene s043-s045: 3-step process for getting started
// Scene s164-s167: Winning proposal checklist LIST
// Scene s218-s223: Red flags / scam criteria LIST
// Scene s256-s258: Compare card (Stripe / outside vs Upwork)
// Scene s268-s272: Strategic roadmap STEPS

const scenes = timeline.scenes;

for (let i = 0; i < scenes.length; i++) {
  const s = scenes[i];

  // Fix footage placeholders
  if (s.beat === "bare" || s.layout === "BARE" || s.placeholder) {
    if (!s.placeholder || s.placeholder.includes("Clean B-roll") || s.placeholder.includes("*(Clean")) {
      s.placeholder = getDistinctPlaceholder(s.why);
    } else {
      if ((usedPlaceholders[s.placeholder] || 0) >= 2) {
        s.placeholder = getDistinctPlaceholder(s.why);
      } else {
        usedPlaceholders[s.placeholder] = (usedPlaceholders[s.placeholder] || 0) + 1;
      }
    }
  }

  // Normalize glossary leaks
  if (s.vo) s.vo = s.vo.replace(/\b[Kk]inects\b/g, "Connects");
  if (s.why) s.why = s.why.replace(/\b[Kk]inects\b/g, "Connects");

  // Fix STACK statements
  if (s.stack && s.stack.statement && s.stack.statement.text) {
    let txt = s.stack.statement.text;
    txt = txt.replace(/\b[Kk]inects\b/g, "Connects");

    // Replace boilerplate template sentences
    if (templatesPattern.test(txt)) {
      // Extract operative words from narration or fallback to specific takeaway
      const voWords = (s.vo || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(w => w.length > 2);
      
      // Select genuine domain nouns/verbs
      let kw = s.stack.statement.cue || "freelance";
      if (["wasn't", "don't", "can't", "i've", "what", "there", "more", "while", "because", "that's", "didn't", "isn't", "about", "couldn't"].includes(kw.toLowerCase())) {
        // pick better keyword from voWords
        const candidates = voWords.filter(w => !["and", "the", "that", "this", "was", "for", "with", "from", "have", "been", "they", "were", "what", "when", "there"].includes(w));
        kw = candidates[candidates.length - 1] || "skills";
      }

      // Generate punchy 2-4 word takeaway
      let newTakeaway = "";
      if (s.id === "s001") newTakeaway = "365 days on **Upwork**";
      else if (s.id === "s018") newTakeaway = "currency disparity **abroad**";
      else if (s.id === "s040") newTakeaway = "curate 4-6 top **samples**";
      else if (s.id === "s046") newTakeaway = "optimizing before **applying**";
      else if (s.id === "s052") newTakeaway = "0 **Connects** = 0 proposals";
      else if (s.id === "s068") newTakeaway = "high **market saturation**";
      else if (s.id === "s073") newTakeaway = "market perception of **AI tools**";
      else if (s.id === "s083") newTakeaway = "learned video with **CapCut**";
      else if (s.id === "s095") newTakeaway = "**100,000 ETB** laptop earned";
      else if (s.id === "s101") newTakeaway = "first **$10** website client";
      else if (s.id === "s134") newTakeaway = "first **$20** video edit";
      else if (s.id === "s139") newTakeaway = "reinvested **$15** in Connects";
      else if (s.id === "s149") newTakeaway = "tailored quality beats **volume**";
      else if (s.id === "s170") newTakeaway = "first targeted **$90** client";
      else if (s.id === "s174") newTakeaway = "adapting to **client taste**";
      else if (s.id === "s186") newTakeaway = "fast turnarounds on **revisions**";
      else if (s.id === "s256") newTakeaway = "direct **independent revenue** outside Upwork";
      else if (s.id === "s295") newTakeaway = "budgeting monthly for **Connects**";
      else if (s.id === "s310") newTakeaway = "final platform total **$150**";
      else {
        // Construct concise 2-3 word phrase around kw
        newTakeaway = `mastering freelance **${kw}**`;
      }

      s.stack.statement.text = newTakeaway;
      s.stack.statement.cue = kw;
    }

    // Ensure red highlight exists
    if (!s.stack.statement.text.includes("**")) {
      const words = s.stack.statement.text.split(" ");
      if (words.length > 0) {
        words[words.length - 1] = `**${words[words.length - 1]}**`;
        s.stack.statement.text = words.join(" ");
      }
    }
  }

  // Ensure category tags are clean and short
  if (s.stack && s.stack.category) {
    if (s.stack.category.text.length > 25) {
      s.stack.category.text = s.stack.category.text.split(" ")[0].toUpperCase();
    }
  }
}

// Introduce LIST, STEPS, and COMPARE layouts
// 1. Scene s043: STEPS (Getting Started Process)
if (scenes[42]) {
  scenes[42].layout = "STEPS";
  scenes[42].beat = "steps";
  scenes[42].why = "visualizes sequential 3-step proof-of-work pipeline";
  scenes[42].steps = {
    title: "FREELANCE LAUNCH WORKFLOW",
    steps: [
      { text: "1. Master Core **Skill**", cue: "skill", atSec: scenes[42].startSec + 0.1 },
      { text: "2. Build 6 **Samples**", cue: "samples", atSec: scenes[42].startSec + 0.9 },
      { text: "3. Direct **Pitching**", cue: "direct", atSec: scenes[42].startSec + 1.8 }
    ]
  };
}

// 2. Scene s164: LIST (Winning Proposal Formula)
if (scenes[163]) {
  scenes[163].layout = "LIST";
  scenes[163].beat = "list";
  scenes[163].why = "breaks down key components of high-converting Upwork proposals";
  scenes[163].list = {
    heading: "WINNING PROPOSAL FORMULA",
    items: [
      { text: "• Match Client **Software**", cue: "software", atSec: scenes[163].startSec + 0.1 },
      { text: "• 10-Minute **Response Time**", cue: "fast", atSec: scenes[163].startSec + 0.8 },
      { text: "• 100% **Deadline Track Record**", cue: "deadline", atSec: scenes[163].startSec + 1.6 }
    ]
  };
}

// 3. Scene s218: LIST (Client Scam Red Flags)
if (scenes[217]) {
  scenes[217].layout = "LIST";
  scenes[217].beat = "list";
  scenes[217].why = "lists immediate red flags for fake freelance job posts";
  scenes[217].list = {
    heading: "SCAM CLIENT RED FLAGS",
    items: [
      { text: "• Off-Platform **Telegram** Chat", cue: "telegram", atSec: scenes[217].startSec + 0.1 },
      { text: "• Upfront **Security Deposit**", cue: "deposit", atSec: scenes[217].startSec + 0.8 },
      { text: "• Unverified **Payment Method**", cue: "unverified", atSec: scenes[217].startSec + 1.6 }
    ]
  };
}

// 4. Scene s256: COMPARE Graphic ($5,000 Independent vs $150 Upwork)
if (scenes[255]) {
  scenes[255].layout = "STACK";
  scenes[255].beat = "takeaway";
  scenes[255].why = "contrasts off-platform independent client income against Upwork platform total";
  scenes[255].stack = {
    category: { text: "REVENUE BREAKDOWN" },
    statement: { text: "independent clients beat **platform total**", cue: "outside", atSec: scenes[255].startSec + 0.1 },
    graphic: "compare",
    meta: { text: "DIRECT: $5,000+ vs UPWORK: $150" }
  };
}

// 5. Scene s268: STEPS (What I'd Do Differently)
if (scenes[267]) {
  scenes[267].layout = "STEPS";
  scenes[267].beat = "steps";
  scenes[267].why = "outlines actionable roadmap for year 2 freelance strategy";
  scenes[267].steps = {
    title: "YEAR 2 ROADMAP",
    steps: [
      { text: "1. Selective **Bidding**", cue: "selective", atSec: scenes[267].startSec + 0.1 },
      { text: "2. Higher **Project Minimums**", cue: "rates", atSec: scenes[267].startSec + 0.9 },
      { text: "3. Direct **Client Retainers**", cue: "retainer", atSec: scenes[267].startSec + 1.8 }
    ]
  };
}

fs.writeFileSync(timelinePath, JSON.stringify(timeline, null, 2), "utf-8");
console.log("Updated timeline.json successfully with all EGM fixes.");

