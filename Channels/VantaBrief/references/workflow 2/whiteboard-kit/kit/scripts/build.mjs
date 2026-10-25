#!/usr/bin/env node
// beats.json (+ optional words.json) -> plan.json, then lint. Exit 1 on any error.
//   node scripts/build.mjs [--beats beats.json] [--words words.json] [--allow-missing]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { planVideo } from '../src/core/plan.mjs';
import { lintPlan } from '../src/core/lint.mjs';
import { LayoutError } from '../src/core/layout.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const root = process.cwd();
const beatsPath = arg('--beats', 'beats.json'), wordsPath = arg('--words', 'words.json');
const allowMissing = process.argv.includes('--allow-missing');

const beats = JSON.parse(fs.readFileSync(beatsPath, 'utf8'));
const words = fs.existsSync(wordsPath) ? JSON.parse(fs.readFileSync(wordsPath, 'utf8')) : null;
if (!words) console.log(`note: no ${wordsPath}, items will be spread evenly (cue words ignored)`);

// real screenshot dimensions when sharp + file exist
const dims = {};
let sharp = null; try { sharp = createRequire(import.meta.url)('sharp'); } catch {}
for (const sc of beats.scenes) for (const s of sc.shots || []) {
  const f = path.join(root, s.asset);
  if (sharp && fs.existsSync(f)) { const m = await sharp(f).metadata(); dims[s.asset] = { w: m.width, h: m.height }; }
}

let plan;
try { plan = planVideo(beats, { words, dims }); }
catch (e) {
  if (e instanceof LayoutError) { console.error(`\nLAYOUT ERROR: ${e.message}\n-> Fix beats.json (shorter labels / fewer nodes / split the scene). Do NOT edit src/core.`); process.exit(1); }
  throw e;
}
fs.writeFileSync('plan.json', JSON.stringify(plan, null, 1));
fs.mkdirSync('public', { recursive: true });
if (fs.existsSync('assets')) fs.cpSync('assets', 'public/assets', { recursive: true });

const { errors, warns } = lintPlan(plan, { root, allowMissing });
console.log(`\n${plan.scenes.length} scenes, ${plan.meta.totalSec.toFixed(1)}s, ${plan.meta.totalFrames} frames`);
warns.forEach(w => console.log('  warn ', w));
errors.forEach(e => console.log('  ERROR', e));
if (errors.length) { console.error(`\n${errors.length} error(s). Fix beats.json and re-run.`); process.exit(1); }
console.log('\nLINT PASSED -> plan.json written');
