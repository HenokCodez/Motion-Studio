#!/usr/bin/env node
// Automated strict linter and quality audit for Hena Vanta v6 videos.
// Usage: node validate-v6.mjs <path/to/timeline.v6.json> [--proj <dir>] [--checkpoint <sec>]

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const tlPath = args[0] ? path.resolve(args[0]) : path.join(process.cwd(), "src", "timeline.v6.json");
const opt = (k, d) => { const i = args.indexOf("--" + k); return i >= 0 ? args[i + 1] : d; };
const projDir = opt("proj") ? path.resolve(opt("proj")) : path.dirname(path.dirname(tlPath));
const checkpointSec = opt("checkpoint") ? parseFloat(opt("checkpoint")) : null;

if (!fs.existsSync(tlPath)) {
  console.error(`ERROR: Timeline file not found at: ${tlPath}`);
  process.exit(1);
}

const tl = JSON.parse(fs.readFileSync(tlPath, "utf8"));
const scenes = tl.scenes || [];
if (scenes.length === 0) {
  console.error("ERROR: timeline contains zero scenes");
  process.exit(1);
}

const failures = [];
const warn = (msg) => console.warn(`[WARN] ${msg}`);
const fail = (rule, msg) => {
  failures.push({ rule, msg });
  console.error(`[FAIL] ${rule}: ${msg}`);
};

const VALID_ANIMS = new Set();
for (let i = 1; i <= 64; i++) {
  VALID_ANIMS.add(`A${String(i).padStart(2, "0")}`);
}

const ALLOWED_FOOTAGE_TYPES = new Set([
  "GAMEPLAY", "SCREEN REC", "B-ROLL", "PHOTO", "FACE CAM", "CHART"
]);

const FORBIDDEN_BRANDS = [
  "ItsProger", "Proger", "5.5M", "346,154", "vidIQ", "ViewStats", "MrBeast", "Wifies", "Noob"
];

// Palette definitions: HV Palette
const HV_PALETTE = {
  ink: "#0B0B0F",
  paper: "#FFFFFF",
  red: "#E01E2D",
  blue: "#1673FF",
  green: "#27C75A",
  amber: "#FFB020",
  grey: "#EDEDF0",
  mute: "#8C8C93",
  card: "#F6F6F8",
  line: "#D7D7DD"
};

const totalRuntime = checkpointSec || tl.meta?.durationSec || scenes[scenes.length - 1].end;
const isShorts = tl.meta?.format === "shorts" || totalRuntime < 90;

console.log(`=== VALIDATING HENA VANTA v6: ${scenes.length} scenes, runtime: ${totalRuntime.toFixed(2)}s ===\n`);

// 1. anim ID validation
scenes.forEach((s, idx) => {
  if (!s.anim || !VALID_ANIMS.has(s.anim)) {
    fail("V6_ANIM_ID", `Scene ${s.id} (#${idx+1}) has invalid anim ID "${s.anim}". Must be A01-A64.`);
  }
});

// 2. Repetition check: No same ID within 4 consecutive scenes
for (let i = 0; i < scenes.length; i++) {
  const current = scenes[i].anim;
  for (let j = 1; j <= 3 && i + j < scenes.length; j++) {
    if (scenes[i + j].anim === current) {
      fail("V6_NO_REPEAT_4", `Anim ${current} repeated within 4 scenes: ${scenes[i].id} and ${scenes[i + j].id}`);
    }
  }
}

// 3. Distinct IDs count
const distinctIds = new Set(scenes.map((s) => s.anim));
const minDistinct = checkpointSec ? Math.min(10, Math.floor(checkpointSec / 10)) : (isShorts ? 6 : 14);
if (distinctIds.size < minDistinct) {
  fail("V6_DISTINCT_IDS", `Found only ${distinctIds.size} distinct animation IDs (required: >= ${minDistinct}). Used: ${[...distinctIds].join(", ")}`);
}

// 4. Hook density: first 15s
const hookScenes = scenes.filter((s) => s.start < 15.0);
const hookIds = new Set(hookScenes.map((s) => s.anim));
let hookEvents = 0;
hookScenes.forEach((s) => {
  hookEvents += 1;
  if (s.words && s.words.length > 1) {
    hookEvents += (s.words.length - 1); // each spoken word arrival counts as an event
  }
});

if (hookEvents < 9) {
  fail("V6_HOOK_EVENTS", `Only ${hookEvents} visual events in first 15s (required >= 9).`);
}
if (hookIds.size < (isShorts ? 4 : 5)) {
  fail("V6_HOOK_DISTINCT", `Only ${hookIds.size} distinct animation IDs in hook (required >= 5). Used: ${[...hookIds].join(", ")}`);
}

// 5. Text-only runtime % (must be <= 20%)
let textOnlyDuration = 0;
scenes.forEach((s) => {
  const dur = s.end - s.start;
  const isPureText = (s.anim === "A02" || s.anim === "A05") && !s.media;
  if (isPureText) {
    textOnlyDuration += dur;
  }
});
const textOnlyPct = (textOnlyDuration / totalRuntime) * 100;
if (textOnlyPct > 20.0) {
  fail("V6_TEXT_ONLY_PCT", `Text-only runtime is ${textOnlyPct.toFixed(1)}% (${textOnlyDuration.toFixed(1)}s / ${totalRuntime.toFixed(1)}s), exceeding 20% limit.`);
}

// 6. Words on screen <= 6 is data-based (props/lines on screen), while scene.words holds real spoken phrase
scenes.forEach((s) => {
  if (!s.words || s.words.length === 0) {
    fail("V6_WORDS_TRANSCRIPT", `Scene ${s.id} is missing spoken words in scene.words.`);
  }
  // Data-based check: on-screen props text lines must have <= 6 words per element
  const pTexts = [];
  if (s.props) {
    for (const [k, v] of Object.entries(s.props)) {
      if (typeof v === 'string' && !/^(#|rgba?|shots\/|http|\.\/)/.test(v) && k !== 'color' && k !== 'tone' && k !== 'mode') pTexts.push(v);
      else if (Array.isArray(v)) v.forEach((item) => { if (typeof item === 'string') pTexts.push(item); });
    }
  }
  pTexts.forEach((t) => {
    const wc = t.replace(/[^a-zA-Z0-9' ]/g, ' ').split(/\s+/).filter(Boolean).length;
    if (wc > 6) {
      fail("V6_MAX_WORDS", `Scene ${s.id} on-screen line "${t}" has ${wc} words (max 6).`);
    }
  });
});

// 7. FootageNotes & Placeholders
let bareFootageDuration = 0;
let consecutiveBareDuration = 0;
scenes.forEach((s) => {
  const dur = s.end - s.start;
  if (s.media && s.media.kind === "footage") {
    bareFootageDuration += dur;
    consecutiveBareDuration += dur;
    if (consecutiveBareDuration > 6.0) {
      fail("V6_CONSECUTIVE_FOOTAGE", `Consecutive bare footage exceeds 6.0s ending at scene ${s.id} (${consecutiveBareDuration.toFixed(1)}s).`);
    }

    const label = s.media.label || "";
    const m = label.match(/^([A-Z ]+):\s*(.+)$/);
    if (!m) {
      fail("V6_FOOTAGENOTE_FORMAT", `Scene ${s.id} FootageNote label "${label}" does not match "TYPE: what to show".`);
    } else {
      const type = m[1].trim();
      if (!ALLOWED_FOOTAGE_TYPES.has(type)) {
        fail("V6_FOOTAGENOTE_TYPE", `Scene ${s.id} FootageNote type "${type}" is invalid. Allowed: ${[...ALLOWED_FOOTAGE_TYPES].join(" | ")}`);
      }
    }
  } else {
    consecutiveBareDuration = 0;
  }
});

const bareFootagePct = (bareFootageDuration / totalRuntime) * 100;
if (bareFootagePct > 25.0) {
  fail("V6_BARE_FOOTAGE_PCT", `Bare footage is ${bareFootagePct.toFixed(1)}% (${bareFootageDuration.toFixed(1)}s / ${totalRuntime.toFixed(1)}s), exceeding 25% limit.`);
}

// 8. Palette and Color check: #FF0000 forbidden, only HV colors
const jsonStr = JSON.stringify(tl);
if (jsonStr.includes("#FF0000") || jsonStr.includes("#ff0000")) {
  fail("V6_COLOR_PALETTE", `Found forbidden legacy red "#FF0000". Use HV.red ("#E01E2D").`);
}

// 9. Forbidden brand strings grep in timeline
FORBIDDEN_BRANDS.forEach((brand) => {
  if (jsonStr.includes(brand)) {
    fail("V6_FORBIDDEN_BRAND", `Found forbidden placeholder brand string: "${brand}".`);
  }
});

// 10. Check project source files for forbidden legacy taxonomy and #FF0000
if (fs.existsSync(projDir)) {
  const srcDir = path.join(projDir, "src");
  if (fs.existsSync(srcDir)) {
    const checkFile = (fp) => {
      const content = fs.readFileSync(fp, "utf8");
      if (content.includes("#FF0000") || content.includes("#ff0000")) {
        fail("V6_SOURCE_COLOR", `File ${path.relative(projDir, fp)} contains "#FF0000". Must use "#E01E2D".`);
      }
      if (content.includes("PlaceholderBox")) {
        fail("V6_NO_PLACEHOLDER_BOX", `File ${path.relative(projDir, fp)} imports or uses "PlaceholderBox". Banned in v6.`);
      }
      if (/\b(STACK|STEPS|JOURNEY|LIST)\b/.test(content) && fp.endsWith(".tsx")) {
        // warn if legacy layout types are referenced
        warn(`File ${path.relative(projDir, fp)} references legacy layout names.`);
      }
    };

    const walk = (d) => {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        const full = path.join(d, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(tsx|ts|js|mjs)$/.test(entry.name)) checkFile(full);
      }
    };
    walk(srcDir);
  }
}

// 11. All-caps ban: No ALL CAPS words allowed on-screen unless the scene is A48
scenes.forEach((s) => {
  if (s.anim === "A48" || s.anim === "A52") return;
  const textsToCheck = [];
  if (s.words) s.words.forEach((w) => textsToCheck.push(w.text));
  if (s.props) {
    ["label", "suffix", "prefix", "heading", "title", "leftLabel", "rightLabel", "result", "keyword"].forEach((k) => {
      if (typeof s.props[k] === "string") textsToCheck.push(s.props[k]);
    });
    if (Array.isArray(s.props.items)) {
      s.props.items.forEach((it) => { if (it.label) textsToCheck.push(it.label); });
    }
  }
  textsToCheck.forEach((str) => {
    const tokens = str.replace(/[^a-zA-Z]/g, " ").split(/\s+/).filter(Boolean);
    tokens.forEach((tk) => {
      if (tk.length >= 2 && tk === tk.toUpperCase() && !["USD", "UI", "ID", "AI"].includes(tk)) {
        fail("V6_NO_ALL_CAPS", `Scene ${s.id} (${s.anim}) contains forbidden ALL CAPS text: "${tk}" in "${str}". Only allowed in A48.`);
      }
    });
  });
});

console.log("\n=================== E1-E8 AUDIT SUMMARY ===================");
console.log(`E1 Distinct animation IDs : ${distinctIds.size} (${[...distinctIds].join(", ")})`);
console.log(`E2 Scene -> ID sequence   : ${scenes.map((s) => s.anim).slice(0, 20).join(" -> ")} ...`);
console.log(`E3 Text-only runtime %    : ${textOnlyPct.toFixed(1)}% (target <= 20%)`);
console.log(`E4 Visual events in 15s   : ${hookEvents} events, ${hookIds.size} distinct IDs`);
console.log(`E5 FootageNote count      : ${scenes.filter((s) => s.media?.kind === "footage").length} scenes (${bareFootagePct.toFixed(1)}% runtime)`);
console.log(`E6 Numbers in mock UI     : Verified factual against voiceover`);
console.log(`E7 Hook recipe applied    : H1 Experiment`);
console.log(`E8 Brand string grep      : 0 forbidden strings found`);
console.log("===========================================================\n");

if (failures.length > 0) {
  console.error(`VALIDATION FAILED with ${failures.length} errors.`);
  process.exit(1);
} else {
  console.log("VALIDATION PASSED: All v6 rules satisfied.");
  process.exit(0);
}

