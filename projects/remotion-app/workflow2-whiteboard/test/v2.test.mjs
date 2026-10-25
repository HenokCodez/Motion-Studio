// v2 guardrails: voiceover sync, highlight order, calm camera, diagrams. Run: node test/v2.test.mjs
import fs from 'node:fs';
import { planVideo, AlignError } from '../src/core/plan.mjs';
import { lintPlan } from '../src/core/lint.mjs';
import { LayoutError } from '../src/core/layout.mjs';
let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => { cond ? pass++ : fail++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? '   ' + extra : ''}`); };
const beats = () => JSON.parse(fs.readFileSync(new URL('../beats.example.json', import.meta.url)));
const words = JSON.parse(fs.readFileSync(new URL('../words.example.json', import.meta.url)));
const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const lint = (p) => lintPlan(p, { allowMissing: true });
const thr = (fn, C) => { try { fn(); return null; } catch (e) { return e instanceof C ? e : undefined; } };

// ---------- TIMING ----------
{
  const b = beats(); b.scenes.forEach((s, i) => { s.dur = [3, 30, 1, 25, 2, 40, 5, 9][i]; });         // wildly wrong authored durations
  const good = planVideo(beats(), { words }), wrong = planVideo(b, { words });
  ok('authored "dur" is ignored: wrong guesses change nothing', JSON.stringify(good.scenes.map(s => [s.start, s.dur])) === JSON.stringify(wrong.scenes.map(s => [s.start, s.dur])));
  // every scene must start where its first word is spoken (within the 0.15s lead)
  let worst = 0;
  for (const sc of good.scenes) {
    const first = norm(sc.narration.split(/\s+/)[0]);
    const w = words.find(w => norm(w.w) === first && Math.abs(w.start - sc.start) < 1.2);
    if (w) worst = Math.max(worst, sc.start === 0 ? 0 : Math.abs(w.start - (sc.start + 0.15)));   // scene 1 starts at video t=0 by design
  }
  ok('every scene starts at its first spoken word', worst < 0.05, `worst offset ${worst.toFixed(3)}s`);
  // every cued item appears 0.12s before its word (exact-token match inside the scene's own words)
  let n = 0, bad = 0;
  for (const sc of good.scenes) for (const it of sc.items) if (it.cued && !it.parent) {
    const cue = norm(it.cue.split('#')[0].split(' ')[0]);
    const cand = words.filter(w => norm(w.w) === cue && w.start >= sc.start - 0.2 && w.start <= sc.start + sc.dur);
    n++;
    const exact = cand.some(w => Math.abs(w.start - (sc.start + it.at) - 0.12) < 0.02 || it.at <= 0.051);
    // the ONLY allowed deviation: a screenshot pulled EARLIER so it precedes its highlight. Never later than its word.
    const early = it.kind === 'shot' && cand.some(w => sc.start + it.at < w.start - 0.12);
    if (!exact && !early) bad++;
  }
  ok('cued items land 0.12s before their spoken word', n > 15 && bad === 0, `${n} items checked, ${bad} off`);
  ok('voiceover fully covered', good.align.coverage > 0.99 && good.align.issues.length === 0);
}
{ // narration that is not in the voiceover is rejected with the transcript text in the message
  const b = beats(); b.scenes[2].narration = 'Completely different sentence that nobody ever says out loud here';
  const e = thr(() => planVideo(b, { words }), AlignError);
  ok('rejects narration that does not match the voiceover', e instanceof AlignError && /VERBATIM/.test(e.message), e ? '' : 'no error');
}
{ // a cue word that is not spoken in that scene is an ERROR (v1 silently fell back to even spacing)
  const b = beats(); b.scenes[1].cards[0].cue = 'spaceship';
  const p = planVideo(b, { words });
  ok('cue word not spoken in scene -> lint error', lint(p).errors.some(e => /spaceship/.test(e)));
}
{ // uncovered narration
  const b = beats(); b.scenes.splice(3, 2);   // drop two scenes -> ~25 spoken words have no visual
  const p = planVideo(b, { words });
  ok('uncovered voiceover is an error', lint(p).errors.some(e => /not covered|belong to a scene/.test(e)));
}
{ // no words.json and not draft
  ok('no words.json without --draft is refused', thr(() => planVideo(beats(), { words: null }), AlignError) instanceof AlignError);
}

// ---------- HIGHLIGHTS ----------
{
  const p = planVideo(beats(), { words, dims: {} });
  const sc = p.scenes.find(s => s.id === 's5-proof');
  const shot = sc.items.find(i => i.kind === 'shot'), mark = sc.items.find(i => i.kind === 'mark');
  ok('highlight starts >=0.6s AFTER its screenshot (cue order was reversed in the beats)', mark.at - shot.at >= 0.6 - 1e-6, `${(mark.at - shot.at).toFixed(2)}s gap`);
  const p2 = planVideo(beats(), { words, dims: {} });
  p2.scenes.find(s => s.id === 's5-proof').items.find(i => i.kind === 'mark').at = 0.1;       // corrupt the plan
  ok('lint catches a highlight that precedes its screenshot', lint(p2).errors.some(e => /before its screenshot/.test(e)));
  const b = beats(); b.scenes[4].shots[0].highlights = [{ x: 0.1, y: 0.1, w: 0.2, h: 0.1, cue: 'free' }];
  ok('guessed {x,y,w,h} highlight is flagged as unverified', lint(planVideo(b, { words })).warns.some(w => /guessed/.test(w)));
  const b2 = beats();
  const e = thr(() => planVideo(b2, { words, dims: { 'assets/shots/blender.png': { w: 1600, h: 900, boxes: {} } } }), LayoutError);
  ok('text highlight not found on the real page -> refused (no guessing)', e instanceof LayoutError && /no recorded position/.test(e.message));
  const p3 = planVideo(b2, { words, dims: { 'assets/shots/blender.png': { w: 1600, h: 900, boxes: { 'Blender 5.3 Beta': { x: 0.3, y: 0.4, w: 0.25, h: 0.06 } } } } });
  const m3 = p3.scenes.find(s => s.id === 's5-proof').items.find(i => i.kind === 'mark'), sh3 = p3.scenes.find(s => s.id === 's5-proof').items.find(i => i.kind === 'shot');
  ok('text highlight is placed from the measured on-page box', Math.abs(m3.x - (sh3.x + sh3.inset.l + 0.3 * (sh3.w - sh3.inset.l - sh3.inset.r) - 8)) < 1);   // -8 = highlight padding
}

// ---------- CAMERA ----------
{
  const p = planVideo(beats(), { words, dims: {} });
  const still = p.scenes.filter(s => s.type !== 'shot').every(s => s.camera.length === 1);
  ok('camera is completely still on every non-screenshot scene', still);
  const zoomScene = p.scenes.find(s => s.id === 's5-proof');
  ok('screenshot scene zooms at most twice, only onto a highlight', zoomScene.camera.filter(k => k.s > 1.001).every(k => k.target) && zoomScene.camera.filter(k => k.s > 1.001).length <= 2);
  const b = beats(); b.scenes[4].shots.push({ id: 'dv', asset: 'assets/shots/davinci.png', label: 'DaVinci' });
  const p2 = planVideo(b, { words, dims: {} });
  ok('two screenshots side by side -> no zoom', p2.scenes[4].camera.length === 1);
  const p3 = planVideo(beats(), { words, dims: {} }); p3.scenes[0].camera.push({ t: 1, s: 1.4, cx: 960, cy: 540 });
  ok('lint rejects a zoom that has no highlight target', lint(p3).errors.some(e => /no highlight target/.test(e)));
}

// ---------- DIAGRAMS ----------
{
  const p = planVideo(beats(), { words });
  const row = p.scenes.find(s => s.id === 's2-devices');
  ok('device row has real icon data for desktop, phone and drone', row.items.length === 3 && row.items.every(i => i.iconData && i.iconData.paths.length > 0));
  const b = beats(); b.scenes[1].cards[2].icon = 'quadrocopter-9000';
  const e = lint(planVideo(b, { words })).errors.find(e => /not found in assets\/icons/.test(e));
  ok('unknown icon is a lint error', !!e);
  const b2 = beats(); b2.scenes[1].cards[2].icon = 'quadcopter';
  ok('synonyms resolve (quadcopter -> drone)', lint(planVideo(b2, { words })).errors.length === 0);
  const b3 = beats(); b3.scenes[1].cards = b3.scenes[1].cards.concat([1, 2, 3].map(i => ({ id: 'x' + i, icon: 'drone', label: 'x' + i })));
  ok('iconrow with 6 cards is refused', thr(() => planVideo(b3, { words }), LayoutError) instanceof LayoutError);
}

// ---------- TEXT-ONLY VIDEOS ARE REFUSED ----------
{
  const good = planVideo(beats(), { words, dims: {} });
  ok('example (all scenes illustrated) has no visual-ratio error', !lint(good).errors.some(e => /icon, logo or screenshot/.test(e)));
  const textOnly = planVideo(beats(), { words, dims: {} });
  for (const sc of textOnly.scenes) for (const it of sc.items) { delete it.icon; delete it.iconData; delete it.logo; delete it.asset; }   // strip every visual
  ok('a video with no icons/logos/screenshots is refused', lint(textOnly).errors.some(e => /icon, logo or screenshot/.test(e)));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
