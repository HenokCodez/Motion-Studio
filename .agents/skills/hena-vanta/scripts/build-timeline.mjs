#!/usr/bin/env node
// FIRST PASS: timed beats from the script + the supplied/aligned timestamps. Puts NO spoken sentence on screen.
// Usage: node build-timeline.mjs <timeline.raw.json> <script.txt> <src/timeline.json> [--format long|shorts] [--fps 30] [--journey journey.json] [--sfx public/sfx/sfx-manifest.json]
// Markers (inside [ ] on a script line): [shot: url] [photo: query] [text: my **term**] [note: ...] [stat: ${n}|0|5000|label] [list: a | b | c] [steps: a | b | c]
//   [journey: eventId] [chapter: PART 2: **BRANDING**] [footage: SCREEN RECORDING: what to show] [blank]
// Each element is timed to its spoken word (cue). SFX ONLY on image cards and chapter cards.
import fs from "node:fs";
import { norm, readJson, writeJson } from "./lib.mjs";
const args = process.argv.slice(2); const [rawPath, scriptPath, outPath] = args; const opt = (k, d) => { const i = args.indexOf("--" + k); return i >= 0 ? args[i + 1] : d; };
const format = opt("format", "long"), fps = +opt("fps", format === "shorts" ? 60 : 30);
const sfxM = opt("sfx") && fs.existsSync(opt("sfx")) ? readJson(opt("sfx")).filter((m) => m.prepped) : [];
const raw = readJson(rawPath); const journey = opt("journey") ? readJson(opt("journey")) : undefined;
const LEAD = 2 / fps, MIN = 1.2, MAXW = 22, MAXS = 9;
const slug = (s) => s.replace(/https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase().slice(0, 40);
const lines = fs.readFileSync(scriptPath, "utf8").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
let cursor = 0, scenes = [];
for (const line of lines) {
  const markers = [...line.matchAll(/\[([a-z]+)(?::|\s*->)?\s*([^\]]*)\]/gi)].map((m) => ({ kind: m[1].toLowerCase(), arg: m[2].trim() }));
  const spoken = line.replace(/\[[^\]]*\]/g, "").replace(/\*\*|__|\^\^|~~/g, "").replace(/^#\s*/, "").replace(/^[-*]\s+/, "").trim();
  const ws = spoken.split(/\s+/).filter(Boolean); if (!ws.length) continue;
  const slice = raw.words.slice(cursor, cursor + ws.length); cursor += ws.length; if (!slice.length) continue;
  let buf = [], idx = [], parts = [];
  ws.forEach((w, i) => { buf.push(w); idx.push(i); const long = buf.length >= MAXW || slice[i].end - slice[idx[0]].start > MAXS; if (long || i === ws.length - 1) { parts.push({ w: buf, a: idx[0], b: i }); buf = []; idx = []; } });
  parts.forEach((p, pi) => scenes.push({ vo: p.w.join(" "), words: slice.slice(p.a, p.b + 1), start: slice[p.a].start, end: slice[p.b].end, markers: pi === 0 ? markers : [] }));
}
for (let i = 0; i < scenes.length; i++) scenes[i].endSec = i < scenes.length - 1 ? scenes[i + 1].start - LEAD : scenes[i].end + 0.4;
scenes.forEach((s) => (s.startSec = Math.max(0, s.start - LEAD)));
scenes = scenes.reduce((acc, s) => { const p = acc.at(-1); if (p && s.endSec - s.startSec < MIN && !s.markers.length && !p.markers.length) { p.vo += " " + s.vo; p.words.push(...s.words); p.endSec = s.endSec; } else acc.push(s); return acc; }, []);
if (scenes.length) scenes.at(-1).endSec = +(raw.voDuration + 0.5).toFixed(3);
// cue helpers
const rel = (sc, word) => { const k = norm(word); const w = sc.words.find((x) => norm(x.w) === k) ?? sc.words[0]; return { cue: w.w.replace(/[^\w']/g, ""), atSec: +Math.max(0, w.start - 0.1 - sc.startSec).toFixed(2) }; };
const firstSig = (t) => t.replace(/\*\*|__|\^\^|~~/g, "").split(/\s+/).find((w) => norm(w).length > 2) ?? t;
let last = -9, rot = 0; const pick = (c) => { const m = sfxM.filter((x) => x.category === c); return m.length ? m[rot++ % m.length].prepped : null; };
const addSfx = (arr, cat, at) => { if (at - last < 1.2 || at < 0.3) return; const f = pick(cat); if (f) { arr.push({ file: f, category: cat, atSec: +at.toFixed(3) }); last = at; } };
let lastJ = null;
const out = scenes.map((s, i) => {
  const id = "s" + String(i + 1).padStart(3, "0");
  const sc = { id, startSec: +s.startSec.toFixed(3), endSec: +s.endSec.toFixed(3), layout: "STACK", beat: "none", vo: s.vo,
    stack: { media: { kind: "placeholder", label: "FOOTAGE: REPLACE-ME describe exactly what clip to place here", aspect: "16:9", cue: s.words[0].w.replace(/[^\w']/g, "") } } };
  for (const m of s.markers) {
    const st = sc.stack;
    if (m.kind === "footage") st.media.label = m.arg;
    if (m.kind === "shot" || m.kind === "photo") { const dir = m.kind === "shot" ? "shots" : "photos"; sc.beat = "screenshot"; sc.source = m.arg; sc.why = "narrator names a real page/person: show the real thing"; st.media = { kind: "image", label: m.arg, src: `${dir}/${slug(m.arg)}.${m.kind === "shot" ? "png" : "jpg"}`, aspect: "16:9", source: m.arg + " (not captured yet)", verified: false, cue: s.words[0].w.replace(/[^\w']/g, "") }; addSfx((sc.sfx ??= []), "ui", sc.startSec + 0.0); }
    if (m.kind === "text") { sc.beat = "keyterm"; sc.why = "author-supplied key term"; st.statement = { text: m.arg, ...rel(s, firstSig(m.arg)) }; delete st.media; }
    if (m.kind === "note") { st.note = { text: m.arg, ...rel(s, firstSig(m.arg)) }; sc.why ??= "author-supplied note"; }
    if (m.kind === "stat") { const [template, from, to, label] = m.arg.split("|").map((x) => x.trim()); sc.beat = "stat"; sc.why = "number as a count-up"; delete st.media; st.stat = { template, from: +from, to: +to, label, ...rel(s, firstSig(label ?? template)) }; }
    if (m.kind === "list" || m.kind === "steps") {
      const items = m.arg.split("|").map((x) => x.trim()).filter(Boolean); let wi = 0;
      const timed = items.map((t, k) => { const key = norm(firstSig(t)); let f = -1; for (let q = wi; q < s.words.length; q++) if (norm(s.words[q].w) === key) { f = q; break; } if (f >= 0) wi = f + 1; const w = f >= 0 ? s.words[f] : s.words[Math.min(s.words.length - 1, k * Math.floor(s.words.length / items.length))]; return { text: t, atSec: +Math.max(0.2, w.start - 0.1 - sc.startSec).toFixed(2), cue: w.w.replace(/[^\w']/g, "") }; });
      sc.why = m.kind === "list" ? "enumeration shown one item at a time" : "process in order, step by step"; delete sc.stack;
      if (m.kind === "list") { sc.layout = "LIST"; sc.beat = "list"; sc.list = { items: timed }; } else { sc.layout = "STEPS"; sc.beat = "steps"; sc.steps = { items: timed }; }
    }
    if (m.kind === "journey") { sc.layout = "JOURNEY"; sc.beat = "journey"; sc.why = "the story moves on along the single master timeline"; delete sc.stack; const ev = journey?.events.find((e) => e.id === m.arg); const w = ev ? rel(s, firstSig(ev.label)) : rel(s, s.words[0].w); sc.journey = { focus: m.arg, ...(lastJ ? { from: lastJ } : {}), cue: w.cue, revealSec: Math.max(0.4, w.atSec) }; lastJ = m.arg; }
    if (m.kind === "chapter") { sc.beat = "chapter"; sc.why = "chapter marker"; st.media = { kind: "placeholder", label: "CLIP: vertical clip that opens this chapter", aspect: "9:16", cue: s.words[0].w.replace(/[^\w']/g, "") }; st.statement = { text: m.arg, size: "m", ...rel(s, firstSig(m.arg)) }; addSfx((sc.sfx ??= []), "ding", sc.startSec); }
    if (m.kind === "blank") { delete st.media; sc.beat = "none"; }
  }
  if (sc.sfx && !sc.sfx.length) delete sc.sfx;
  return sc;
});
const dur = +(raw.voDuration + 0.5).toFixed(3);
writeJson(outPath, { meta: { fps, width: 1920, height: 1080, durationSec: dur, background: "bg.mp4", backgroundIsVideo: true, voiceover: "vo_norm.wav", textMode: "light", timingFile: "timeline.raw.json", ...(journey ? { journey } : {}) }, scenes: out });
console.log(`${out.length} beats, ${dur}s, timing source: ${raw.source ?? "unknown"}. NEXT: Visual Director pass (references/09). No text was written automatically.`);
