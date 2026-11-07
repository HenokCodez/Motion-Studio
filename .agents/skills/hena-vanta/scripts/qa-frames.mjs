#!/usr/bin/env node
// Hena Vanta pre-render QA (v4). Run from the Remotion project dir:
//   node <skill>/scripts/qa-frames.mjs [--folder <dir containing voiceover + supplied timestamps>] [--no-render]
// Writes qa/report.json, qa/REPORT.md (paste its summary into your final report) and qa/f*.png stills. Exit 1 on ANY failure.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
const req = createRequire(path.join(process.cwd(), "package.json"));
const args = process.argv.slice(2); const opt = (k, d) => { const i = args.indexOf("--" + k); return i >= 0 ? args[i + 1] : d; };
const proj = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const tlPath = fs.existsSync(path.join(proj, "src", "timeline.v6.json"))
  ? path.join(proj, "src", "timeline.v6.json")
  : path.join(proj, "src", "timeline.json");
const tl = readJson(tlPath);
const { fps, width: W, height: H } = tl.meta; const dur = tl.meta.durationSec;
const report = { checks: [], failures: 0, stills: [] };
const check = (name, ok, detail = "") => { report.checks.push({ name, ok: !!ok, detail }); if (!ok) report.failures++; };
const finish = () => {
  fs.mkdirSync(path.join(proj, "qa"), { recursive: true });
  fs.writeFileSync(path.join(proj, "qa", "report.json"), JSON.stringify(report, null, 2));
  const bad = report.checks.filter((c) => !c.ok);
  const md = [`# QA REPORT (${new Date().toISOString()})`, `checks: ${report.checks.length - bad.length}/${report.checks.length} passed, ${bad.length} FAILED`, "", ...bad.map((c) => `- FAIL ${c.name} :: ${c.detail}`), "", `stills rendered: ${report.stills.length}`, "STILLS YOU MUST LOOK AT (then write qa/review.json, see references/07): " + report.stills.map((s) => s.file).join(", ")].join("\n");
  fs.writeFileSync(path.join(proj, "qa", "REPORT.md"), md);
  console.log(`checks: ${report.checks.length - bad.length}/${report.checks.length} passed`); bad.slice(0, 80).forEach((c) => console.log(" FAIL", c.name, "::", c.detail));
  console.log("Wrote qa/REPORT.md. A failing QA means NO RENDER.");
  process.exit(bad.length ? 1 : 0);
};
process.on("unhandledRejection", (e) => { check("render: unhandled error (Chrome missing? run `npx remotion browser ensure`)", false, String(e).slice(0, 300)); finish(); });

// ---------- helpers
const plain = (t = "") => t.replace(/\*\*|__|\^\^|~~/g, "");
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9']/g, "");
const words = (t) => plain(t).toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean);
const STOP = new Set("a an the and or but so to of in on at for with is are was were be been it its this that these those i you he she we they me my your our their as by from not no yes do does did just then than too very can could would should will".split(" "));
const longestRun = (a, b) => { let best = 0; const m = new Map(); b.forEach((w, j) => { if (!m.has(w)) m.set(w, []); m.get(w).push(j); }); for (let i = 0; i < a.length; i++) for (const j of m.get(a[i]) ?? []) { let k = 0; while (i + k < a.length && j + k < b.length && a[i + k] === b[j + k]) k++; best = Math.max(best, k); } return best; };
const NUM = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const wordNumbers = (t) => { const out = []; let cur = null, total = 0; const flush = () => { if (cur !== null || total) out.push(String(total + (cur ?? 0))); cur = null; total = 0; }; for (const x of t.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean)) { if (x in NUM) cur = (cur ?? 0) + NUM[x]; else if (x === "hundred" && cur !== null) cur *= 100; else if (x === "thousand" && cur !== null) { total += cur * 1000; cur = null; } else if (x === "million" && cur !== null) { total += cur * 1e6; cur = null; } else if (x !== "and") flush(); } flush(); return out; };
const digitsOf = (t) => (t.match(/\d[\d,.]*/g) ?? []).map((x) => x.replace(/,/g, "").replace(/\.$/, ""));
const scenes = tl.scenes; const J = tl.journey || tl.meta?.journey;

// ---------- timing source: the supplied time-stamped script is authoritative
const rawPath = path.join(proj, tl.meta.timingFile ?? "timeline.raw.json");
let raw = null;
if (!fs.existsSync(rawPath)) check("timing: raw timing file exists (import the supplied time-stamped script)", false, rawPath); else { raw = readJson(rawPath); check("timing: raw timing file loaded", Array.isArray(raw.words) && raw.words.length > 0); }
const folder = opt("folder");
if (folder && fs.existsSync(folder)) {
  const cands = fs.readdirSync(folder).filter((f) => /\.(srt|vtt)$/i.test(f) || /(timestamp|timecode|transcript|subtitle).*\.(txt|json)$/i.test(f));
  if (cands.length) check("timing: supplied timestamp file was USED (not re-derived by speech recognition)", String(raw?.source ?? "").startsWith("supplied"), `found ${cands.join(", ")}; raw.source = ${raw?.source}`);
}
if (raw) {
  check("timing: word onsets are refined from the audio (run refine-timing.mjs) - cue-level timing is off by up to ~0.3 s", raw.refined === true || args.includes("--allow-cue-timing"), `refined=${raw.refined}`);
  check("transcript spelling: no unresolved variants (e.g. Kinects vs connects). Fix in glossary.json and re-import", (raw.lint?.unresolved?.length ?? 0) === 0, (raw.lint?.unresolved ?? []).map((g) => g.map((x) => `${x.w}x${x.n}`).join("/")).join("; "));
}
const rawWords = raw?.words ?? [];
const VOCAB = new Set(rawWords.flatMap((w) => words(w.w))); const ALLOW = new Set((tl.meta.allowWords ?? []).map((x) => x.toLowerCase()));
const wIn = (a, b) => rawWords.filter((w) => w.start >= a && w.start <= b);
const findCue = (sc, cue) => {
  if (!cue) return null; const toks = cue.toLowerCase().split(/\s+/).map(norm).filter(Boolean); if (!toks.length) return null;
  const win = wIn(sc.startSec - 0.3, sc.endSec + 0.3);
  for (let i = 0; i < win.length; i++) if (toks.every((tk, k) => win[i + k] && norm(win[i + k].w) === tk)) return win[i].start; return null;
};

// ---------- collect elements
const elsOf = (s) => {
  const e = []; const st = s.stack ?? {};
  const add = (kind, el, extra = {}) => el && e.push({ kind, text: el.text ?? "", atSec: el.atSec ?? 0, cue: el.cue, ...extra });
  add("headline", st.headline); add("statement", st.statement); add("note", st.note); add("itemsTitle", st.itemsTitle);
  (st.items ?? []).forEach((i) => add("item", i)); if (st.stat) { add("stat", { text: st.stat.label ?? "", atSec: st.stat.atSec, cue: st.stat.cue }, { stat: st.stat }); }
  const gr = st.graphic; if (gr) { if (gr.kind === "blocks") gr.items.forEach((i) => e.push({ kind: "graphic", text: "", atSec: i.atSec, cue: i.cue })); if (gr.kind === "progress") e.push({ kind: "graphic", text: "", atSec: gr.atSec, cue: gr.cue }); if (gr.kind === "compare") { e.push({ kind: "graphicText", text: gr.before.text, atSec: gr.before.atSec, cue: gr.before.cue }); e.push({ kind: "graphicText", text: gr.after.text, atSec: gr.after.atSec, cue: gr.after.cue }); } }
  if (st.media) e.push({ kind: "media", text: "", atSec: st.media.atSec ?? 0, cue: st.media.cue, media: st.media });
  if (s.list) { add("itemsTitle", s.list.title); s.list.items.forEach((i) => add("item", i)); }
  if (s.steps) { add("itemsTitle", s.steps.heading); s.steps.items.forEach((i) => add("step", i)); }
  if (s.journey && J) { const ev = J.events.find((x) => x.id === s.journey.focus); if (ev) e.push({ kind: "journey", text: `${ev.label} ${ev.note}`, atSec: s.journey.revealSec ?? 0.8, cue: s.journey.cue }); }
  return e;
};
const textOnly = (s) => elsOf(s).filter((x) => x.kind !== "media" && x.kind !== "journey" && x.kind !== "graphic");

// ---------- checks
function extractPropsText(obj) {
  const texts = [];
  if (!obj || typeof obj !== 'object') return texts;
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string' && !/^(#|rgba?|shots\/|http|\.\/)/.test(v) && k !== 'color' && k !== 'tone' && k !== 'mode') {
      texts.push(v);
    } else if (Array.isArray(v)) {
      v.forEach((item) => {
        if (typeof item === 'string') texts.push(item);
        else if (typeof item === 'object') texts.push(...extractPropsText(item));
      });
    } else if (typeof v === 'object') {
      texts.push(...extractPropsText(v));
    }
  }
  return texts;
}

const BANNED = [/focus on the/i, /distilled takeaway/i, /from the voiceover/i, /\b(todo|tbd|lorem|fill me|footage here|screenshot here|placeholder)\b/i, /\.\.\.\s*$/];
const CLAIMS = /\b(verified|guaranteed|proven|official|certified|biggest|best|only|never|always|secret|ultimate|perfect|number one|#1)\b/i;
const ERRPAGE = /(access denied|you have been blocked|sorry, you have been|captcha|verify you are human|are you a robot|just a moment|enable javascript|don'?t have permission|forbidden|unusual traffic|cloudflare|attention required|checking your browser|accept all cookies|cookie settings|page not found|error 40\d)/i;
const SFX_OK = new Set(["ui", "ding", "error"]);

const isV6 = tl.meta?.version === "v6" || scenes.every((s) => !!s.anim);
if (isV6) {
  check("scenes exist", scenes.length > 0 && dur > 0);
  const VALID_ANIMS = new Set();
  for (let i = 1; i <= 64; i++) VALID_ANIMS.add(`A${String(i).padStart(2, "0")}`);
  let bareSec = 0, bareRun = 0, annotSec = 0;
  const seenText = [];
  scenes.forEach((s, si) => {
    const sStart = s.start ?? s.startSec ?? 0;
    const sEnd = s.end ?? s.endSec ?? 0;
    const d = sEnd - sStart;
    check(`${s.id} anim ID valid (A01-A64)`, VALID_ANIMS.has(s.anim), s.anim);
    check(`${s.id} min length 0.8 s`, d >= 0.8 - 1 / fps, d.toFixed(2));
    if (si > 0) {
      const prevEnd = scenes[si - 1].end ?? scenes[si - 1].endSec ?? 0;
      check(`${s.id} contiguous with previous`, Math.abs(sStart - prevEnd) <= 1.5 / fps, `${prevEnd} -> ${sStart}`);
    }
    check(`${s.id} has why (what it adds beyond the audio)`, !!s.why && s.why.length > 8, s.why);
    check(`${s.id} has idea`, !!s.idea && s.idea.length > 5, s.idea);
    const isFootage = s.anim === "A52" || s.media?.kind === "footage";
    if (isFootage) {
      bareSec += d; bareRun += d;
      check(`${s.id} bare footage run <= 6 s`, bareRun <= 6.01, `${bareRun.toFixed(1)} s in a row`);
    } else {
      annotSec += d; bareRun = 0;
    }
    check(`${s.id} scene.words holds real spoken phrase`, Array.isArray(s.words) && (isFootage || s.words.length > 0), `count: ${s.words ? s.words.length : 0}`);
    const pTexts = extractPropsText(s.props);
    pTexts.forEach((t) => {
      const wc = words(t).length;
      if (wc > 0 && !/^(#|rgba?|shots\/)/.test(t)) {
        check(`${s.id} on-screen line "${plain(t)}" <= 6 words`, wc <= 6, `${wc}: ${plain(t)}`);
      }
    });
    const vo = (s.words ?? []).map((w) => w.text).join(" ");
    const allDisplayText = [...pTexts, vo].join(" ");
    BANNED.forEach((re) => check(`${s.id} no banned/template text (${re})`, !re.test(allDisplayText), allDisplayText));
    const mc = allDisplayText.match(CLAIMS);
    if (mc) {
      check(`${s.id} claim word "${mc[0]}" was said (or sourced)`, vo.toLowerCase().includes(mc[0].toLowerCase()) || !!s.source, "never embellish: no 'verified/official/best...' unless said");
    }
    const redWords = (s.words ?? []).filter((w) => w.color && /#e01e2d/i.test(w.color));
    const propReds = [...allDisplayText.matchAll(/\*\*([^*]+)\*\*/g)].map((m) => m[1]);
    const totalReds = redWords.length + propReds.length;
    check(`${s.id} 0-2 red keywords per line`, totalReds <= 2, `reds: ${totalReds}`);
    check(`${s.id} red keyword uses brand red #E01E2D (never #FF0000)`, !/#ff0000/i.test(JSON.stringify(s)));
    if (s.media?.kind === "screenshot" || s.media?.file) {
      const f = path.join(proj, "public", s.media.file);
      check(`${s.id} screenshot file exists`, fs.existsSync(f), s.media.file);
      check(`${s.id} screenshot honestly labelled`, !/personal proof|account proof|private proof/i.test(s.props?.footnote || "") && !/\bproof\b/i.test(s.idea || ""), s.props?.footnote || s.idea);
    }
    if (allDisplayText.length > 6) {
      seenText.push({ t: plain(allDisplayText).toLowerCase(), at: sStart, id: s.id });
    }
  });
  seenText.forEach((a, i) => seenText.slice(i + 1).forEach((b) => {
    if (a.t === b.t && Math.abs(a.at - b.at) < 30 && a.t.length > 6) check(`duplicate text within 30 s: "${a.t}" (${a.id}, ${b.id})`, false);
  }));
  check("bare footage <= 25% of runtime", bareSec / dur <= 0.25, `${((100 * bareSec) / dur).toFixed(0)}%`);
  check("annotated >= 75% of runtime", annotSec / dur >= 0.75, `${((100 * annotSec) / dur).toFixed(0)}%`);
  const imgs = scenes.filter((s) => s.media?.kind === "screenshot" || s.media?.file).length;
  check("real screenshots/images: >= 1 per 2 min", dur < 90 || imgs >= Math.floor(dur / 120), `${imgs} images`);
  if (J) {
    check("journey: master timeline has >= 3 events each with label + note", J.events && J.events.length >= 3 && J.events.every((e) => e.label && e.note));
  }
} else {

const BANNED = [/focus on the/i, /distilled takeaway/i, /from the voiceover/i, /\b(todo|tbd|lorem|fill me|footage here|screenshot here|placeholder)\b/i, /\.\.\.\s*$/];
const CLAIMS = /\b(verified|guaranteed|proven|official|certified|biggest|best|only|never|always|secret|ultimate|perfect|number one|#1)\b/i;
const ERRPAGE = /(access denied|you have been blocked|sorry, you have been|captcha|verify you are human|are you a robot|just a moment|enable javascript|don'?t have permission|forbidden|unusual traffic|cloudflare|attention required|checking your browser|accept all cookies|cookie settings|page not found|error 40\d)/i;
const SFX_OK = new Set(["ui", "ding", "error"]);
const LAYOUTS = new Set(["STACK", "JOURNEY", "STEPS", "LIST"]);
const capsFor = { headline: 6, statement: 9, note: 12, item: 5, step: 5, itemsTitle: 7 };
check("scenes exist", scenes.length > 0 && dur > 0);
let bareSec = 0, bareRun = 0, annotSec = 0, lastJ = -1, lastJScene = null; const prefix = new Map(); const seenText = [];
let prevKey = "", sameRun = 0;
scenes.forEach((s, si) => {
  const d = s.endSec - s.startSec; const els = elsOf(s); const txt = textOnly(s); const allText = txt.map((x) => x.text).join(" ");
  check(`${s.id} layout is one of STACK/JOURNEY/STEPS/LIST`, LAYOUTS.has(s.layout), s.layout);
  ["arrows", "free", "marks", "placeholders", "enter", "redAt"].forEach((f) => check(`${s.id} has no removed field "${f}" (v4: no arrows/marks/free layout/colour hits)`, s[f] === undefined));
  check(`${s.id} min length 0.8 s`, d >= 0.8 - 1 / fps, d.toFixed(2));
  if (si > 0) check(`${s.id} contiguous with previous`, Math.abs(s.startSec - scenes[si - 1].endSec) <= 1.5 / fps, `${scenes[si - 1].endSec} -> ${s.startSec}`);
  check(`${s.id} has beat + vo`, !!s.beat && !!s.vo);
  const hasMedia = !!s.stack?.media; const annotated = txt.length > 0 || !!s.stack?.graphic || els.some((x) => x.kind === "journey") || s.stack?.media?.kind === "image";
  if (annotated) { annotSec += d; bareRun = 0; } else { bareSec += d; bareRun += d; check(`${s.id} bare footage run <= 6 s`, bareRun <= 6.01, `${bareRun.toFixed(1)} s in a row`); }
  if (annotated && s.layout !== "JOURNEY" || (txt.length > 0)) check(`${s.id} has why (what it adds beyond the audio)`, !!s.why && s.why.length > 8);
  // variety
  const key = `${s.layout}|${s.beat}|${hasMedia}`; sameRun = key === prevKey ? sameRun + 1 : 1; prevKey = key; check(`${s.id} not 4+ identical compositions in a row`, sameRun <= 3, `run ${sameRun}`);
  // text rules
  txt.forEach((x) => {
    BANNED.forEach((re) => check(`${s.id} no banned/template text (${re})`, !re.test(x.text), x.text));
    const wc = words(x.text).length; if (capsFor[x.kind]) check(`${s.id} ${x.kind} <= ${capsFor[x.kind]} words`, wc <= capsFor[x.kind], `${wc}: ${plain(x.text)}`);
    const reds = [...x.text.matchAll(/\*\*([^*]+)\*\*/g)].map((m) => m[1]);
    check(`${s.id} 0-2 red keywords per line`, reds.length <= 2, reds.join("|"));
    reds.filter((r) => !/[{}$]/.test(r)).forEach((r) => { const ws = words(r); const content = ws.filter((w) => !STOP.has(w)); check(`${s.id} red keyword "${r}" is a meaningful word (not filler)`, content.length > 0 || /\d/.test(r), r); const vo = words(s.vo); check(`${s.id} red keyword "${r}" comes from the story (said, or a word you listed in meta.allowWords)`, ws.every((w) => vo.includes(w) || VOCAB.has(w) || ALLOW.has(w) || /\d/.test(w) || wordNumbers(s.vo).includes(w)) || !!s.source, r); });
    const near = [scenes[si - 1]?.vo, s.vo, scenes[si + 1]?.vo].join(" ");
    const mc = x.text.match(CLAIMS); if (mc) check(`${s.id} claim word "${mc[0]}" was said (or sourced)`, near.toLowerCase().includes(mc[0].toLowerCase()) || !!s.source, "never embellish: no 'verified/official/best...' unless said");
  });
  if (txt.length && s.beat !== "quote") {
    const tw = words(allText), vw = words(s.vo); const run = longestRun(tw, vw); const overlap = tw.filter((w) => vw.includes(w)).length / Math.max(1, tw.length); const diag = ["LIST", "STEPS"].includes(s.layout);
    check(`${s.id} text is not a caption of the voiceover (copied run < 4 words, overlap <= 60% for 4+ words)`, run < (diag ? 6 : 4) && (diag || !(tw.length >= 4 && overlap > 0.6)), `copied run ${run}, overlap ${(overlap * 100).toFixed(0)}%`);
  }
  txt.filter((x) => x.kind === "statement" || x.kind === "headline").forEach((x) => { const ws = words(x.text); const head = ws[0], tail = ws.at(-1); const content = ws.filter((w) => !STOP.has(w));
    check(`${s.id} "${plain(x.text)}" reads as a complete phrase (no dangling start/end, >= 2 content words unless a key term/number)`, !(["and", "but", "so", "because", "or", "then"].includes(head) || STOP.has(tail)) && (content.length >= 2 || s.beat === "keyterm" || s.beat === "stat" || /\d/.test(x.text)), plain(x.text)); });
  // vocabulary: every word shown must have been spoken (transcript), be a function word/number, or be deliberately allowed in meta.allowWords
  if (rawWords.length) txt.forEach((x) => words(x.text).forEach((w) => { if (/^\d/.test(w) || STOP.has(w) || ALLOW.has(w)) return; const stem = (t) => t.replace(/(ing|ed|es|s|ly)$/, ""); const ok = VOCAB.has(w) || [...VOCAB].some((v) => stem(v) === stem(w)); check(`${s.id} word "${w}" appears in the transcript (or is listed in meta.allowWords)`, ok, `"${plain(x.text)}": typo or invention? if it is a real word you chose, add it to meta.allowWords`); }));
  // reading time: an element stays up from its cue to the end of the scene
  txt.forEach((x) => { const need = Math.max(1.2, 0.25 * words(x.text).length + 0.6); const shown = d - (x.atSec ?? 0); check(`${s.id} ${x.kind} stays on screen long enough to read (${need.toFixed(1)} s)`, shown >= need - 0.05 || x.kind === "stat", `${shown.toFixed(1)} s`); });
  if (txt.length) { const near = [voOf(si - 1), s.vo, voOf(si + 1)].join(" "); const spoken = new Set([...digitsOf(near), ...wordNumbers(near)]); const nums = [...digitsOf(allText), ...(s.stack?.stat ? [String(s.stack.stat.to)] : [])]; nums.forEach((n) => check(`${s.id} number "${n}" was spoken (or sourced)`, spoken.has(n) || near.toLowerCase().includes(n) || !!s.source, "never invent figures")); }
  // template reuse + duplicates
  const st = s.stack?.statement?.text; if (st) { const p = words(st).slice(0, 2).join(" "); prefix.set(p, (prefix.get(p) ?? 0) + 1); }
  seenText.push(...txt.map((x) => ({ t: plain(x.text).toLowerCase(), at: s.startSec + x.atSec, id: s.id })));
  // media
  const m = s.stack?.media;
  if (m?.kind === "placeholder") { check(`${s.id} footage label is an instruction ("TYPE: what to show")`, /^[A-Z][A-Z \/-]{2,22}: .{8,}/.test(m.label), m.label); check(`${s.id} footage label is specific (not REPLACE-ME)`, !/REPLACE-ME/i.test(m.label), m.label); check(`${s.id} footage label is not spoken words / truncated`, !/\.\.\./.test(m.label) && longestRun(words(m.label), words(s.vo)) < 4, m.label); }
  if (m?.kind === "image") {
    const f = path.join(proj, "public", m.src); check(`${s.id} image file exists`, fs.existsSync(f), m.src); check(`${s.id} image has source + licence/date`, !!m.source && m.source.length > 8); check(`${s.id} image was viewed and verified by the agent`, m.verified === true);
    if (fs.existsSync(f)) { const t = spawnSync("tesseract", [f, "stdout", "--psm", "11"], { encoding: "utf8", timeout: 60000 }); if (t.status === 0) check(`${s.id} image is not an error/blocked/consent page (OCR)`, !ERRPAGE.test(t.stdout), (t.stdout.match(ERRPAGE) ?? [""])[0]); else report.checks.push({ name: `${s.id} OCR unavailable (install tesseract); you MUST view the image`, ok: true, detail: "warning" }); }
  }
  // cues vs the supplied timestamps
  if (raw) {
    const w0 = wIn(s.startSec - 0.4, s.startSec + 1.2)[0]; if (w0) check(`${s.id} starts on the first spoken word (supplied timestamps)`, Math.abs(s.startSec - (w0.start - 0.07)) <= 0.3, `scene ${s.startSec.toFixed(2)} vs word ${w0.start.toFixed(2)}`);
    els.forEach((x) => {
      if (!x.cue && (x.atSec ?? 0) > 0.05) { check(`${s.id} ${x.kind} has a cue (the spoken word it is tied to)`, false, `atSec ${x.atSec}`); return; }
      if (!x.cue) return; const cs = findCue(s, x.cue);
      if (cs === null) { check(`${s.id} ${x.kind} cue "${x.cue}" is found in the supplied timestamps`, false, "word not spoken in this scene"); return; }
      const appear = s.startSec + (x.atSec ?? 0); check(`${s.id} ${x.kind} appears on its cue "${x.cue}" (-0.35..+0.15 s)`, appear >= cs - 0.35 && appear <= cs + 0.15, `appears ${appear.toFixed(2)} s, cue spoken ${cs.toFixed(2)} s (${(appear - cs).toFixed(2)})`);
    });
  }
  // static hold
  if (annotated) { const ev = [0, ...els.map((x) => x.atSec ?? 0), ...(s.stack?.media?.kind === "image" && s.stack.media.zoom ? [s.stack.media.zoom.atSec] : [])].filter((x) => x < d).sort((a, b) => a - b); check(`${s.id} no static hold > 5 s`, d - ev.at(-1) <= 5.2, `${(d - ev.at(-1)).toFixed(1)} s since last change`); }
  // layouts specifics
  if (s.stack?.graphic) { const gr = s.stack.graphic; check(`${s.id} graphic excludes a media box`, !s.stack.media); check(`${s.id} graphic kind valid`, ["blocks", "progress", "compare"].includes(gr.kind)); if (gr.kind === "blocks") check(`${s.id} blocks 2-8 ascending`, gr.items.length >= 2 && gr.items.length <= 8 && gr.items.every((x, i) => i === 0 || x.atSec > gr.items[i - 1].atSec)); if (gr.kind === "progress") check(`${s.id} check mark only when the bar reaches 100`, !gr.check || gr.to >= 100); }
  if (s.layout === "STEPS") { const it = s.steps?.items ?? []; check(`${s.id} steps 2-5 ascending`, it.length >= 2 && it.length <= 5 && it.every((x, i) => x.atSec < d && (i === 0 || x.atSec > it[i - 1].atSec))); }
  if (s.layout === "LIST") { const it = s.list?.items ?? []; check(`${s.id} list 2-6 items, ascending, one at a time`, it.length >= 2 && it.length <= 6 && it.every((x, i) => i === 0 || x.atSec >= it[i - 1].atSec + 0.5)); }
  if (s.layout === "JOURNEY") {
    const j = s.journey; const idx = J?.events.findIndex((e) => e.id === j?.focus) ?? -1;
    check(`${s.id} journey focus is an event of the master timeline`, idx >= 0, j?.focus);
    check(`${s.id} journey moves forward by at most ONE event per scene (no reveal-all)`, idx <= lastJ + 1, `index ${idx} after ${lastJ}`);
    check(`${s.id} journey never jumps backwards`, idx >= lastJ, `index ${idx} after ${lastJ}`);
    if (lastJScene === null) { check(`${s.id} first journey scene starts at the first event with no "from"`, idx === 0 && !j.from); } else check(`${s.id} journey "from" = previous journey scene focus (continuity)`, j.from === lastJScene.journey.focus || (idx === lastJ && !j.from) , `from ${j.from} vs ${lastJScene.journey.focus}`);
    lastJ = Math.max(lastJ, idx); lastJScene = s;
  }
  // sfx
  (s.sfx ?? []).forEach((c) => { const ok = SFX_OK.has(c.category) && ((m?.kind === "image" && Math.abs(c.atSec - (s.startSec + (m.atSec ?? 0))) <= 0.12) || (s.beat === "chapter" && Math.abs(c.atSec - s.startSec) <= 0.12)); check(`${s.id} SFX only on image/screenshot card or chapter card (never text) @${c.atSec}`, ok, "user rule: no sound effects on text"); });
});
function voOf(i) { return scenes[i]?.vo ?? ""; }
const labels = new Map(); scenes.forEach((s) => { const l = s.stack?.media?.kind === "placeholder" ? s.stack.media.label : null; if (l) labels.set(l, (labels.get(l) ?? 0) + 1); }); labels.forEach((n, l) => check(`footage label used in <= 2 scenes ("${l.slice(0, 40)}")`, n <= 2, `${n} scenes`));
prefix.forEach((n, p) => check(`no template reuse: statements starting "${p}" in <= 2 scenes`, n <= 2 || p === "", `${n} scenes`));
seenText.forEach((a, i) => seenText.slice(i + 1).forEach((b) => { if (a.t === b.t && Math.abs(a.at - b.at) < 30 && a.t.length > 6) check(`duplicate text within 30 s: "${a.t}" (${a.id}, ${b.id})`, false); }));
if (J) { check("journey: master timeline has >= 3 events each with label + note", J.events.length >= 3 && J.events.every((e) => e.label && e.note)); const used = new Set(scenes.filter((s) => s.layout === "JOURNEY").map((s) => s.journey.focus)); if (scenes.some((s) => s.layout === "JOURNEY")) check("journey: every event of the master timeline gets its own scene (progressive reveal)", J.events.every((e) => used.has(e.id)), `missing ${J.events.filter((e) => !used.has(e.id)).map((e) => e.id).join(",")}`); }
check("bare footage <= 25% of runtime", bareSec / dur <= 0.25, `${((100 * bareSec) / dur).toFixed(0)}%`);
check("annotated >= 75% of runtime", annotSec / dur >= 0.75, `${((100 * annotSec) / dur).toFixed(0)}%`);
const imgs = scenes.filter((s) => s.stack?.media?.kind === "image").length; check("real screenshots/images: >= 1 per 2 min", dur < 90 || imgs >= Math.floor(dur / 120), `${imgs} images`);
}
const cues = isV6
  ? scenes.filter((s) => s.sfx).map((s) => ({ atSec: typeof s.sfx === "object" ? s.sfx.atSec : (s.start ?? s.startSec ?? 0), category: typeof s.sfx === "object" ? s.sfx.category : s.sfx })).sort((a, b) => a.atSec - b.atSec)
  : scenes.flatMap((s) => s.sfx ?? []).sort((a, b) => a.atSec - b.atSec);
cues.forEach((c, i) => i && check(`sfx spacing >= 1.2 s @${c.atSec}`, c.atSec - cues[i - 1].atSec >= 1.2));
check("no music referenced", !/music|bgm/i.test(JSON.stringify(tl)));
check("voiceover + background files exist", fs.existsSync(path.join(proj, "public", tl.meta.voiceover)) && fs.existsSync(path.join(proj, "public", tl.meta.background)));

// ---------- stills (browser). Skipped with --no-render
if (args.includes("--no-render")) finish();
const outDir = path.join(proj, "qa");
if (args.includes("--clean")) {
  for (const f of fs.existsSync(outDir) ? fs.readdirSync(outDir) : []) if (/^(f|bg_).*\.png$|^sheet_/.test(f)) fs.rmSync(path.join(outDir, f));
}
fs.mkdirSync(outDir, { recursive: true });
let serveUrl, comp = null;
try { const { bundle } = req("@remotion/bundler"); serveUrl = await bundle({ entryPoint: path.join(proj, "src", "index.ts"), publicDir: path.join(proj, "public") }); } catch (e) { check("render: bundle", false, String(e).slice(0, 300)); }
const { renderStill, selectComposition } = req("@remotion/renderer"); const { PNG } = req("pngjs");
if (serveUrl) { try { comp = await selectComposition({ serveUrl, id: "HenaVanta", inputProps: { timeline: tl } }); } catch (e) { check("render: open composition (Chrome Headless Shell needed: run `npx remotion browser ensure`)", false, String(e).slice(0, 300)); } }
if (serveUrl && comp) {
  const want = new Set([0, comp.durationInFrames - 1]); const F = (s) => Math.round(s * fps);
  if (isV6) {
    scenes.forEach((s) => {
      const a = F(s.start ?? s.startSec ?? 0), b = Math.max(a, F(s.end ?? s.endSec ?? 0) - 1);
      want.add(a + F(0.2));
      want.add(Math.floor((a + b) / 2));
      if (s.words && s.words.length > 0) {
        s.words.slice(0, 3).forEach((w) => {
          if (w.time !== undefined) want.add(F(w.time));
        });
      }
    });
  } else {
  scenes.forEach((s, idx) => {
    const sample = s.layout !== "STACK" || s.beat === "screenshot" || !!s.stack?.media?.src || !!s.journey || (idx % 25 === 0);
    if (!sample) return;
    const a = F(s.startSec), b = Math.max(a, F(s.endSec) - 1); [a + F(0.15), Math.floor((a + b) / 2)].forEach((f) => want.add(f));
    elsOf(s).forEach((x) => [0.15, 0.45].forEach((q) => { const f = a + F((x.atSec ?? 0) + q); if (f <= b) want.add(f); }));
    if (s.layout === "JOURNEY") [0.4, 1.0].forEach((q) => want.add(Math.min(b, a + F(q))));
  });
  }
  const frames = [...want].filter((f) => f >= 0 && f < comp.durationInFrames).sort((x, y) => x - y);
  const lum = (r, g, b) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  let lights = [];
  const commonBg = path.join(outDir, "bg_common.png");
  if (!fs.existsSync(commonBg)) {
    try { await renderStill({ composition: comp, serveUrl, output: commonBg, frame: 0, inputProps: { timeline: tl, qaMode: "bgOnly" } }); } catch (e) { check("render common bg", false, String(e).slice(0, 200)); }
  }
  const B = fs.existsSync(commonBg) ? PNG.sync.read(fs.readFileSync(commonBg)) : null;
  for (const f of frames) {
    const withText = path.join(outDir, `f${String(f).padStart(6, "0")}.png`);
    if (!fs.existsSync(withText)) {
      try { await renderStill({ composition: comp, serveUrl, output: withText, frame: f, inputProps: { timeline: tl } }); } catch (e) { check(`render frame ${f}`, false, String(e).slice(0, 200)); continue; }
    }
    if (!B) continue;
    const A = PNG.sync.read(fs.readFileSync(withText)); let x0 = W, y0 = H, x1 = -1, y1 = -1, n = 0, bl = 0, bn = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * 4; const d = Math.abs(A.data[i] - B.data[i]) + Math.abs(A.data[i + 1] - B.data[i + 1]) + Math.abs(A.data[i + 2] - B.data[i + 2]); if (d > 60) { n++; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } if (y % 8 === 0 && x % 8 === 0) { bl += lum(B.data[i], B.data[i + 1], B.data[i + 2]); bn++; } }
    const sc = scenes.find((s) => f >= F(s.start ?? s.startSec ?? 0) && f < F(s.end ?? s.endSec ?? 0)); lights.push(bl / Math.max(1, bn));
    report.stills.push({ file: path.basename(withText), frame: f, scene: sc?.id, box: n ? [x0, y0, x1, y1] : null });
    if (sc && n) { check(`f${f} ${sc.id} content inside safe area`, x0 >= W * 0.04 && x1 <= W * 0.96 && y0 >= H * 0.03 && y1 <= H * 0.97, `box ${x0},${y0},${x1},${y1}`); const cx = (x0 + x1) / 2; check(`f${f} ${sc.id} content is horizontally centred (+-4%)`, Math.abs(cx - W / 2) <= W * 0.04, `centre ${(100 * cx / W).toFixed(1)}%`); }
  }
  const avg = lights.reduce((a, b) => a + b, 0) / Math.max(1, lights.length); check("background is light (black text on white grid)", avg > 0.6 || tl.meta.textMode === "dark", `mean luminance ${avg.toFixed(2)}`);
}
finish();
