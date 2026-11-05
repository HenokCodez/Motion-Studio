import fs from "node:fs";
import path from "node:path";

const scriptPath = "D:/Youtube/Hena Vanta/Project FIle/Videos/1. I tried Upwork for 365 days...is it worth it/AI/script.txt";
const outTimelinePath = "d:/Automations/motion-studio/projects/hena-vanta-upwork/src/timeline.json";
const manifestPath = "d:/Automations/motion-studio/projects/hena-vanta-upwork/public/sfx/sfx-manifest.json";

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

console.log(`Parsed ${parsedLines.length} lines.`);

// Narrative beat definitions for Visual Director pass:
// We define the key moments where text/diagrams/takeaways/stats add genuine explanatory value.
// Between these explainer moments, footage / screen-recording placeholders carry the video (beat: "none").

const BEAT_SPECS = [
  // 0:00 - 0:31 Intro & Myth
  { start: 0, end: 6.44, beat: "none", layout: "L11", placeholder: "Screen recording: Upwork search and homepage" },
  {
    start: 6.44, end: 15.24, beat: "takeaway", layout: "L1", enter: "tiltWipe",
    text: "1-2 clients = easy **ride**?",
    why: "crystallizes the false expectation before debunking it",
    arrows: [{ asset: "red-cross", x: 960, y: 540, w: 260, atSec: 2.5 }],
    sfx: [{ file: "impact_1.wav", category: "hit", atSec: 2.5 }]
  },
  {
    start: 15.24, end: 24.98, beat: "keyterm", layout: "L1", enter: "tiltWipe",
    text: "my upwork **journey**",
    why: "anchors the thesis and main topic of the video",
    sfx: [{ file: "swish_1.wav", category: "swoosh", atSec: 0.2 }]
  },
  {
    start: 24.98, end: 31.40, beat: "none", layout: "L11",
    placeholder: "Facecam A-roll or Upwork dashboard overview"
  },

  // 0:31 - 1:22 Starting Out: March 10, 2025
  {
    start: 31.40, end: 35.16, beat: "stat", layout: "L1", enter: "tiltWipe",
    text: "march 10, 2025: day **one**",
    why: "highlights the exact starting date of the one-year journey",
    sfx: [{ file: "click_1.wav", category: "ui", atSec: 0.15 }]
  },
  {
    start: 35.16, end: 42.16, beat: "takeaway", layout: "L11",
    placeholder: "Footage: university campus or software coding in VS Code",
    caption: "*2nd year software engineering student",
    why: "clarifies the creator's background when entering freelancing"
  },
  {
    start: 42.16, end: 103.60, beat: "none", layout: "L11",
    placeholder: "Footage: Addis Ababa city B-roll, freelancing desk setup, currency exchange"
  },
  {
    start: 103.60, end: 113.24, beat: "stat", layout: "L1", enter: "tiltWipe",
    text: "target: first **client** in 3 months",
    why: "quantifies the initial expected timeline to land clients",
    sfx: [{ file: "click_2.wav", category: "ui", atSec: 0.2 }]
  },
  {
    start: 113.24, end: 122.56, beat: "none", layout: "L11",
    placeholder: "Screen recording: browsing Upwork jobs without applying"
  },

  // 1:22 - 2:40 Mistake #1: Over-optimizing
  {
    start: 122.56, end: 131.84, beat: "keyterm", layout: "L1", enter: "tiltWipe",
    text: "mistake #1: **over-optimizing**",
    why: "introduces the first major failure beat",
    arrows: [{ asset: "arrow-curl-up", x: 740, y: 620, w: 220, atSec: 0.4 }],
    sfx: [{ file: "punch.wav", category: "hit", atSec: 0.15 }]
  },
  {
    start: 131.84, end: 156.84, beat: "none", layout: "L11",
    placeholder: "Screen recording: endlessly tweaking profile title, bio and description"
  },
  {
    start: 156.84, end: 196.84, beat: "takeaway", layout: "L11",
    placeholder: "Screen recording: cluttered portfolio with random low-effort clips",
    caption: "*needed 6 solid sample projects, not 50 random clips",
    why: "distills the core lesson on portfolio quality over sheer clutter"
  },
  {
    start: 196.84, end: 212.84, beat: "steps", layout: "STEPS",
    steps: {
      heading: "Ideal Starter Sequence",
      items: [
        { title: "Step 1", text: "master the core skill", atSec: 0.4 },
        { title: "Step 2", text: "build 6 polished samples", atSec: 3.5 },
        { title: "Step 3", text: "minimalist profile", atSec: 7.2 },
        { title: "Step 4", text: "send targeted proposals", atSec: 11.0 }
      ],
      zoomOutAtSec: 13.5
    },
    why: "visually contrasts the mistake with the clean step-by-step procedure",
    sfx: [{ file: "click_3.wav", category: "ui", atSec: 0.4 }, { file: "click_4.wav", category: "ui", atSec: 3.5 }]
  },
  {
    start: 212.84, end: 240.24, beat: "none", layout: "L11",
    placeholder: "Screen recording: changing categories and empty invitation inbox"
  },

  // 2:40 - 3:50 Switching Niches: Software Eng -> Video Editing
  {
    start: 240.24, end: 253.60, beat: "keyterm", layout: "L1", enter: "tiltWipe",
    text: "the **pivot**: dev to editing",
    why: "signals the major turning point from software development to video",
    sfx: [{ file: "swish_1.wav", category: "swoosh", atSec: 0.2 }]
  },
  {
    start: 253.60, end: 267.80, beat: "stat", layout: "L1", enter: "tiltWipe",
    text: "$2,000 laptop: funded by **editing**",
    why: "proves market validation through local editing income",
    sfx: [{ file: "impact_2.wav", category: "hit", atSec: 0.2 }]
  },
  {
    start: 267.80, end: 277.60, beat: "none", layout: "L11",
    placeholder: "Screen recording: updating profile skills to Premiere Pro & After Effects"
  },

  // 3:50 - 4:40 Mistake #2: Wrong First Contract
  {
    start: 277.60, end: 289.60, beat: "keyterm", layout: "L1", enter: "tiltWipe",
    text: "mistake #2: **wrong first job**",
    why: "names the second big mistake of accepting an unrelated contract",
    sfx: [{ file: "subboom_1.wav", category: "hit", atSec: 0.15 }]
  },
  {
    start: 289.60, end: 310.00, beat: "takeaway", layout: "L11",
    placeholder: "Screen recording: Upwork completed contract page ($10 web development)",
    caption: "*your first job sets permanent work history on your profile",
    why: "explains why taking an off-niche job creates permanent profile friction"
  },
  {
    start: 310.00, end: 353.68, beat: "none", layout: "L11",
    placeholder: "Footage: editing on laptop, working with local clients, quiet Upwork profile"
  },

  // 4:40 - 5:50 First Video Job & Connects Strategy
  {
    start: 353.68, end: 368.92, beat: "keyterm", layout: "L1", enter: "tiltWipe",
    text: "the silent **period**",
    why: "marks the transitional phase before active applications began",
    sfx: [{ file: "subtone_1.wav", category: "other", atSec: 0.2 }]
  },
  {
    start: 368.92, end: 385.00, beat: "stat", layout: "L1", enter: "tiltWipe",
    text: "$20: first video **contract**",
    why: "highlights the true crime editing job that proved the new niche",
    sfx: [{ file: "click_1.wav", category: "ui", atSec: 0.2 }]
  },
  {
    start: 385.00, end: 403.30, beat: "stat", layout: "L1", enter: "tiltWipe",
    text: "$15 spent: unlocking **connects**",
    why: "emphasizes the turning point from passive waiting to active applications",
    sfx: [{ file: "clicktrain_1.wav", category: "ui", atSec: 0.2 }]
  },
  {
    start: 403.30, end: 423.80, beat: "takeaway", layout: "L11",
    placeholder: "Screen recording: filtering Upwork job feed by budget and client history",
    caption: "*quality applications > burning connects on generic spam",
    why: "distills the strategic lesson on selective bidding"
  },
  {
    start: 423.80, end: 450.00, beat: "none", layout: "L11",
    placeholder: "Screen recording: typing a concise, custom proposal addressing client needs"
  },

  // 5:50 - 7:30 Client Communication & Retention Rules
  {
    start: 450.00, end: 462.00, beat: "keyterm", layout: "L1", enter: "tiltWipe",
    text: "client **communication**",
    why: "introduces the section on client management and avoiding revision traps",
    sfx: [{ file: "swish_1.wav", category: "swoosh", atSec: 0.2 }]
  },
  {
    start: 462.00, end: 510.00, beat: "none", layout: "L11",
    placeholder: "Screen recording: Upwork messaging chat with client discussing draft feedback"
  },
  {
    start: 510.00, end: 535.00, beat: "takeaway", layout: "L11",
    placeholder: "Screen recording: making minor cut adjustments in Adobe Premiere Pro timeline",
    caption: "*accommodate reasonable tweaks -> protect long-term rapport",
    why: "advises on flexibility versus rigid nickel-and-diming"
  },
  {
    start: 535.00, end: 571.50, beat: "none", layout: "L11",
    placeholder: "Footage: project folders organized cleanly with audio, b-roll and exports"
  },
  {
    start: 571.50, end: 587.00, beat: "takeaway", layout: "L1", enter: "tiltWipe",
    text: "unclear feedback? ask **specific questions**",
    why: "saves hours of wasted re-renders by enforcing proactive communication",
    arrows: [{ asset: "arrow-right-swoosh", x: 800, y: 600, w: 240, atSec: 0.3 }],
    sfx: [{ file: "click_2.wav", category: "ui", atSec: 0.2 }]
  },
  {
    start: 587.00, end: 630.00, beat: "none", layout: "L11",
    placeholder: "Screen recording: exporting final video and client 5-star review submission"
  },

  // 7:30 - 9:30 Portfolio Proof vs Fake Guru Claims
  {
    start: 630.00, end: 645.00, beat: "keyterm", layout: "L1", enter: "tiltWipe",
    text: "portfolio **transparency**",
    why: "addresses the importance of honest skills without fake posturing",
    sfx: [{ file: "swish_1.wav", category: "swoosh", atSec: 0.2 }]
  },
  {
    start: 645.00, end: 703.90, beat: "none", layout: "L11",
    placeholder: "Screen recording: portfolio case studies with before/after video samples"
  },
  {
    start: 703.90, end: 719.70, beat: "takeaway", layout: "L11",
    placeholder: "Screen recording: editing original personal spec projects",
    caption: "*no clients yet? build custom spec projects to prove capability",
    why: "actionable solution for beginners lacking initial client testimonials"
  },
  {
    start: 719.70, end: 736.90, beat: "compare", layout: "L7",
    columns: [
      { heading: "Outside Upwork", bullets: ["> $5,000 made", "local direct clients", "steady ongoing work"] },
      { heading: "On Upwork", bullets: ["~$150 made", "steep competition", "foundation for growth"] }
    ],
    why: "visually contrasts realistic earnings on vs outside the platform",
    sfx: [{ file: "click_1.wav", category: "ui", atSec: 0.2 }]
  },
  {
    start: 736.90, end: 790.00, beat: "none", layout: "L11",
    placeholder: "Footage: working on video timeline, color grading, sound design"
  },

  // 9:30 - 12:00 Timeline of the Year & Platform Realities
  {
    start: 790.00, end: 815.00, beat: "timeline", layout: "TIMELINE",
    timeline: {
      heading: "The 365-Day Progression",
      events: [
        { label: "March", note: "day 1 ($10 dev job)", atSec: 0.5 },
        { label: "June", note: "pivoted to video editing", atSec: 4.8 },
        { label: "September", note: "first video contract ($20)", atSec: 9.5 },
        { label: "Year-End", note: "consistent local clientele", atSec: 14.5 }
      ],
      zoomOutAtSec: 18.0
    },
    why: "diagrams the full 365-day trajectory chronologically with camera zooms",
    sfx: [{ file: "click_3.wav", category: "ui", atSec: 0.5 }, { file: "click_4.wav", category: "ui", atSec: 4.8 }]
  },
  {
    start: 815.00, end: 850.20, beat: "none", layout: "L11",
    placeholder: "Screen recording: Upwork fee breakdown and net earnings calculation"
  },

  // 12:00 - 15:04 Final Takeaways & Outro
  {
    start: 850.20, end: 867.80, beat: "takeaway", layout: "L11",
    placeholder: "Footage: sitting at desk reflecting, laptop screen glowing",
    caption: "*freelancing requires patience + honest self-critique",
    why: "sets the honest tone for the concluding summary"
  },
  {
    start: 867.80, end: 880.80, beat: "takeaway", layout: "L1", enter: "tiltWipe",
    text: "don't just look hireable: become **hireable**",
    why: "the core philosophical punchline of the entire video",
    sfx: [{ file: "impact_1.wav", category: "hit", atSec: 0.2 }]
  },
  {
    start: 880.80, end: 904.50, beat: "none", layout: "L11",
    placeholder: "Facecam outro or subscribe card with links to portfolio and next videos"
  }
];

// Map spoken VO lines to each beat duration
const scenes = BEAT_SPECS.map((b, i) => {
  const id = "s" + String(i + 1).padStart(3, "0");
  const matchingLines = parsedLines.filter(
    (pl) => pl.startSec < b.end && pl.endSec > b.start
  );
  const vo = matchingLines.map((pl) => pl.text).join(" ") || "Narration continues...";
  
  const sc = {
    id,
    startSec: +b.start.toFixed(3),
    endSec: +b.end.toFixed(3),
    layout: b.layout,
    beat: b.beat,
    vo
  };

  if (b.why) sc.why = b.why;
  if (b.enter) sc.enter = b.enter;
  if (b.text) sc.text = b.text;
  if (b.caption) sc.caption = b.caption;
  if (b.steps) sc.steps = b.steps;
  if (b.timeline) sc.timeline = b.timeline;
  if (b.columns) sc.columns = b.columns;
  if (b.arrows) sc.arrows = b.arrows;
  if (b.sfx) {
    sc.sfx = b.sfx.map((s) => ({
      ...s,
      atSec: +(b.start + s.atSec).toFixed(3)
    }));
  }

  if (b.placeholder) {
    sc.placeholders = [{ kind: "footage", label: b.placeholder, aspect: "16:9" }];
  }

  return sc;
});

const timelineObj = {
  meta: {
    fps: 30,
    width: 1920,
    height: 1080,
    durationSec: 904.5,
    background: "bg.mp4",
    backgroundIsVideo: true,
    voiceover: "vo_norm.wav",
    textMode: "light"
  },
  scenes
};

fs.writeFileSync(outTimelinePath, JSON.stringify(timelineObj, null, 2));
console.log(`Successfully generated timeline with ${scenes.length} scenes to ${outTimelinePath}`);
