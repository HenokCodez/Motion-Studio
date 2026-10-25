import fs from 'node:fs';
import path from 'node:path';
import { SAFE, FONT, RULES, CANVAS } from './tokens.mjs';

const SPACED = new Set(['node', 'panel', 'shot', 'chip', 'terminal', 'bigtitle']);
const hit = (a, b, g) => a.x < b.x + b.w + g && a.x + a.w > b.x - g && a.y < b.y + b.h + g && a.y + a.h > b.y - g;

export function lintPlan(plan, { root = '.', allowMissing = false } = {}) {
  const errors = [], warns = [], missing = [];
  const E = (s, m) => errors.push(`[${s}] ${m}`);
  const W = (s, m) => warns.push(`[${s}] ${m}`);

  for (const sc of plan.scenes) {
    const S = sc.id;
    if (sc.dur > RULES.maxSceneSec) E(S, `scene is ${sc.dur}s (max ${RULES.maxSceneSec}s). Split it into two beats.`);
    const real = sc.items.filter(i => i.kind !== 'mark');
    if (real.length > RULES.maxItemsPerScene + 2) E(S, `${real.length} items on one screen (max ${RULES.maxItemsPerScene}). One idea per beat.`);

    for (const it of sc.items) {
      // 1. inside safe area (marks live inside their screenshot, which is checked itself)
      if (it.kind !== 'mark') {
        const eps = 1;
        if (it.x < SAFE.x - eps || it.y < SAFE.y - eps || it.x + it.w > SAFE.x + SAFE.w + eps || it.y + it.h > SAFE.y + SAFE.h + eps)
          E(S, `"${it.id}" leaves the safe area (x=${Math.round(it.x)} y=${Math.round(it.y)} w=${Math.round(it.w)} h=${Math.round(it.h)})`);
      }
      // 2. font floors
      if (it.size && it.size < FONT.min) E(S, `"${it.id}" font ${it.size}px < ${FONT.min}px`);
      if (it.size && ['node', 'label', 'panel', 'chip', 'header', 'caption', 'date', 'tag'].includes(it.kind) && it.size < FONT.labelFloor)
        E(S, `"${it.id}" label font ${it.size}px < ${FONT.labelFloor}px`);
      // 3. label length
      (it.lines || []).forEach(l => {
        const words = String(l).trim().split(/\s+/).length;
        if (it.kind === 'node' && words > RULES.maxWordsPerLabel) W(S, `"${it.id}" label has ${words} words (aim <= ${RULES.maxWordsPerLabel})`);
      });
      // 4. assets
      if (it.logo) chk(`assets/logos/${it.logo}`, ['.svg', '.png']) || missing.push(`logo:${it.logo}`);
      if (it.asset) chk(it.asset, ['']) || missing.push(`shot:${it.asset}`);
      if (it.assumedDims && !allowMissing) W(S, `"${it.id}" screenshot size unknown (asset missing), using 1600x900 placeholder`);
    }

    // 5. overlaps
    for (let i = 0; i < sc.items.length; i++) for (let j = i + 1; j < sc.items.length; j++) {
      const a = sc.items[i], b = sc.items[j];
      if (a.within === b.id || b.within === a.id || (a.within && a.within === b.within)) continue;
      if (hit(a, b, 0)) E(S, `"${a.id}" overlaps "${b.id}"`);
      else if (hit(a, b, RULES.minGap) && SPACED.has(a.kind) && SPACED.has(b.kind)) W(S, `"${a.id}" and "${b.id}" closer than ${RULES.minGap}px`);
    }
    if (sc.mascot) for (const it of sc.items) if (hit(sc.mascot, it, 0) && it.kind !== 'mark') E(S, `mascot overlaps "${it.id}"`);

    // 6. pacing
    const ts = [0, ...sc.events.map(e => e.t), sc.dur].sort((a, b) => a - b);
    for (let i = 1; i < ts.length; i++) if (ts[i] - ts[i - 1] > RULES.maxGapSec) E(S, `${(ts[i] - ts[i - 1]).toFixed(1)}s with no visual event at t=${ts[i - 1].toFixed(1)}s`);
    if (sc.pulsesInserted > 2) W(S, `${sc.pulsesInserted} filler pulses needed. Scene is too sparse for its length: add items/highlights or shorten it.`);

    // 7. camera must keep every revealed item (non-zoom) mostly on screen
    for (const k of sc.camera) {
      if (k.s < 1 || k.s > 2.3) E(S, `camera scale ${k.s.toFixed(2)} out of range`);
      const vw = CANVAS.w / k.s, vh = CANVAS.h / k.s;
      if (k.cx - vw / 2 < -0.5 || k.cy - vh / 2 < -0.5 || k.cx + vw / 2 > CANVAS.w + 0.5 || k.cy + vh / 2 > CANVAS.h + 0.5) E(S, `camera viewport leaves the canvas at t=${k.t.toFixed(2)}s`);
    }
  }
  function chk(rel, exts) {
    return exts.some(e => fs.existsSync(path.join(root, rel + e)));
  }
  const uniqMissing = [...new Set(missing)];
  if (uniqMissing.length && !allowMissing) errors.push(`[assets] missing: ${uniqMissing.join(', ')}  -> supply them or run "npm run assets"`);
  else if (uniqMissing.length) warns.push(`[assets] missing (allowed): ${uniqMissing.join(', ')}`);
  return { errors, warns, missing: uniqMissing };
}
