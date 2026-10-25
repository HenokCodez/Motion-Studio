#!/usr/bin/env node
// beats.json + words.json -> plan.json, then lint. Exit 1 on any error.
//   node scripts/build.mjs [--beats beats.json] [--words words.json] [--allow-missing] [--draft]
// Scene start/duration come from aligning each scene's "narration" to words.json. Authored durations are ignored.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { planVideo, AlignError } from '../src/core/plan.mjs';
import { lintPlan } from '../src/core/lint.mjs';
import { LayoutError } from '../src/core/layout.mjs';
import { collectLogoInfo } from '../src/core/logos.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const root = process.cwd();
const beatsPath = arg('--beats', 'beats.json'), wordsPath = arg('--words', 'words.json');
const allowMissing = process.argv.includes('--allow-missing'), draft = process.argv.includes('--draft');

if (!fs.existsSync(beatsPath)) { console.error(`No ${beatsPath} here (cwd: ${root}).\nFirst run?  copy beats.example.json beats.json  and  copy words.example.json words.json  to try the example,\nor write your own beats.json (see AGENT.md).`); process.exit(1); }
const beats = JSON.parse(fs.readFileSync(beatsPath, 'utf8'));
const words = !draft && fs.existsSync(wordsPath) ? JSON.parse(fs.readFileSync(wordsPath, 'utf8')) : null;

// real screenshot size (sharp) + measured highlight boxes (assets/shots/<name>.boxes.json from "npm run assets")
const dims = {};
let sharp = null; try { sharp = createRequire(import.meta.url)('sharp'); } catch {}
for (const sc of beats.scenes) for (const s of sc.shots || []) {
  const f = path.join(root, s.asset);
  const side = f + '.boxes.json';
  if (fs.existsSync(f)) {
    let d = {};
    if (sharp) { const m = await sharp(f).metadata(); d = { w: m.width, h: m.height }; }
    else if (fs.existsSync(side)) d = { ...JSON.parse(fs.readFileSync(side, 'utf8')).size };
    if (fs.existsSync(side)) { const j = JSON.parse(fs.readFileSync(side, 'utf8')); d.boxes = j.boxes; if (!d.w && j.size) { d.w = j.size.w; d.h = j.size.h; } }
    if (d.w) dims[s.asset] = d;
  }
}

// logo contrast: a logo whose visible pixels are mostly dark (GitHub, Notion, Ps/Pr/Ae tiles) disappears on the dark canvas.
// Those get a light plate behind them in the renderer.
const logoNames = new Set(); (function walk(o) { if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { if (/^(logo|titleLogo|labelLogo)$/.test(k) && typeof v === 'string') logoNames.add(v); else walk(v); } })(beats);
const logoInfo = await collectLogoInfo(logoNames, root, sharp);
const darkLogos = Object.entries(logoInfo).filter(([, v]) => v.dark).map(([k]) => k);
if (darkLogos.length) console.log(`dark logos (will get a light plate): ${darkLogos.join(', ')}`);

let plan;
try { plan = planVideo(beats, { words, dims, root, draft, logoInfo }); }
catch (e) {
  if (e instanceof LayoutError || e instanceof AlignError) {
    console.error(`\n${e instanceof AlignError ? 'TIMING' : 'LAYOUT'} ERROR: ${e.message}\n-> Fix beats.json (content only). Do NOT edit src/core.`);
    process.exit(1);
  }
  throw e;
}
fs.writeFileSync('plan.json', JSON.stringify(plan, null, 1));
if (fs.existsSync('assets')) {
  fs.cpSync('assets', 'public/assets', { recursive: true });
  const parentPublic = path.resolve(root, '../public');
  if (fs.existsSync(parentPublic)) {
    fs.cpSync('assets', path.join(parentPublic, 'assets'), { recursive: true });
  }
}

const { errors, warns } = lintPlan(plan, { root, allowMissing, allowDraft: draft });
console.log(`\n${plan.scenes.length} scenes, ${plan.meta.totalSec.toFixed(1)}s, ${plan.meta.totalFrames} frames${plan.meta.draft ? '  (DRAFT timing)' : ''}`);
if (plan.align) {
  console.log(`voiceover coverage ${(plan.align.coverage * 100).toFixed(0)}%   scene timing (from transcript):`);
  plan.align.scores.forEach(s => console.log(`  ${s.id.padEnd(22)} start ${String(s.start).padStart(7)}s  dur ${String(s.dur.toFixed(1)).padStart(5)}s  narration match ${Math.round(s.score * 100)}%`));
}
warns.forEach(w => console.log('  warn ', w));
errors.forEach(e => console.log('  ERROR', e));
if (errors.length) { console.error(`\n${errors.length} error(s). Fix beats.json and re-run.`); process.exit(1); }
console.log('\nLINT PASSED -> plan.json written');
