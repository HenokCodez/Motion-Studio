import fs from 'node:fs';
import path from 'node:path';
import { SAFE, FONT, RULES, CANVAS } from './tokens.mjs';
import { suggestIcons } from './icons.mjs';

const SPACED = new Set(['node', 'panel', 'shot', 'chip', 'terminal', 'bigtitle', 'icard']);
const hit = (a, b, g) => a.x < b.x + b.w + g && a.x + a.w > b.x - g && a.y < b.y + b.h + g && a.y + a.h > b.y - g;

export function lintPlan(plan, { root = '.', allowMissing = false, allowDraft = false } = {}) {
  const errors = [], warns = [], missing = [];
  const E = (s, m) => errors.push(`[${s}] ${m}`);
  const W = (s, m) => warns.push(`[${s}] ${m}`);

  // ---- global: timing comes from the transcript, and the whole voiceover must be illustrated ----
  if (plan.meta.draft && !allowDraft) E('plan', 'DRAFT timing: no words.json, so nothing is synced to the voiceover. Provide words.json (or pass --draft knowingly).');
  if (plan.align) {
    plan.align.issues.forEach(m => E('align', m));
    if (plan.align.coverage < 0.97) E('align', `only ${(plan.align.coverage * 100).toFixed(0)}% of the spoken words belong to a scene (need 97%+). Add scenes for the uncovered narration.`);
  }

  // ---- global: a video made of text boxes is a slideshow. Most scenes must carry a real visual. ----
  const hasVisual = (sc) => sc.items.some(i => i.icon || i.logo || i.asset);
  const visual = plan.scenes.filter(hasVisual).length, ratio = visual / Math.max(1, plan.scenes.length);
  if (ratio < 0.6) E('visuals', `only ${visual} of ${plan.scenes.length} scenes (${Math.round(ratio * 100)}%) contain an icon, logo or screenshot. Need 60%+. Text-only scenes make a slideshow: add icon:"..." (node scripts/find-icon.mjs <word>), logos, or screenshots.`);
  plan.scenes.filter(sc => !hasVisual(sc)).length > 2 && W('visuals', `text-only scenes: ${plan.scenes.filter(sc => !hasVisual(sc)).map(s => s.id).join(', ')}`);

  for (const sc of plan.scenes) {
    const S = sc.id;
    (sc.issues || []).forEach(i => (i.level === 'error' ? E : W)(S, i.msg));
    // highlights must come AFTER the thing they highlight, and the camera must stay calm
    const byId = Object.fromEntries(sc.items.map(i => [i.id, i]));
    for (const m of sc.items.filter(i => i.kind === 'mark')) {
      const par = byId[m.parent];
      if (!par) E(S, `highlight "${m.id}" has no parent screenshot`);
      else if (m.at < par.at + 0.6 - 1e-6) E(S, `highlight "${m.id}" appears at ${m.at.toFixed(2)}s, before its screenshot is established (${par.at.toFixed(2)}s)`);
      if (m.manual) W(S, `highlight "${m.id}" uses guessed {x,y,w,h}. Prefer {text:"..."} so its position is measured from the real page.`);
    }
    const zooms = sc.camera.filter(k => k.s > 1.001 && k.target);
    if (zooms.length > 2) E(S, `${zooms.length} camera zooms in one scene (max 2). Zoom is only for reading small on-screenshot text.`);
    for (const k of sc.camera) if (k.s > 1.001 && !k.target) E(S, `camera zoom at ${k.t.toFixed(2)}s has no highlight target. The camera must stay still unless it is zooming into a highlight.`);
    for (const it of sc.items) if (it.icon && !it.iconData) E(S, `icon "${it.icon}" not found in assets/icons. Similar: ${suggestIcons(it.icon, root).join(', ') || '(none)'}. Run "node scripts/find-icon.mjs <word>".`);
    if (plan.align && sc.items.some(i => !i.cued && !['mark'].includes(i.kind))) {
      const un = sc.items.filter(i => !i.cued && !['mark', 'label'].includes(i.kind)).map(i => i.id);
      if (un.length) W(S, `no cue word for: ${un.join(', ')}. They appear after the previous item rather than on a spoken word.`);
    }
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
      if (it.size && ['node', 'label', 'panel', 'chip', 'header', 'caption', 'date', 'tag', 'icard'].includes(it.kind) && it.size < FONT.labelFloor)
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
