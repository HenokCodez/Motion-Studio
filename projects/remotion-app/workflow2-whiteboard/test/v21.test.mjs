// v2.1 guardrails from the frame-by-frame review of a real render. Run: node test/v21.test.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { planVideo } from '../src/core/plan.mjs';
import { lintPlan } from '../src/core/lint.mjs';
import { TIMING } from '../src/core/tokens.mjs';
import { logoDarkness } from '../src/core/logos.mjs';
let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => { cond ? pass++ : fail++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? '   ' + extra : ''}`); };
const beats = () => JSON.parse(fs.readFileSync(new URL('../beats.example.json', import.meta.url)));
const words = JSON.parse(fs.readFileSync(new URL('../words.example.json', import.meta.url)));
const lint = (p) => lintPlan(p, { allowMissing: true });
const prim = (sc) => sc.items.filter(i => !['mark', 'header'].includes(i.kind) && !i.groupWith && !(i.kind === 'label' && i.parent));
const P = planVideo(beats(), { words });

// ---- DEAD AIR (32% of the reviewed video was empty canvas while the narrator talked) ----
ok('every scene shows its first item within 0.3s, even if the cue word comes seconds later', P.scenes.every(sc => Math.min(...prim(sc).map(i => i.at)) <= 0.3));
{
  const b = beats(); b.scenes[1].cards[0].cue = 'drone';                      // first card's cue is the LAST word of the sentence
  const sc = planVideo(b, { words }).scenes[1];
  ok('a late cue on the first item does not leave the screen empty', Math.min(...prim(sc).map(i => i.at)) <= 0.3);
}
ok('dead-air lint fires if a scene opens late', (() => { const p = planVideo(beats(), { words }); p.scenes[1].items.forEach(i => { i.at += 2; }); return lint(p).errors.some(e => /DEAD AIR/.test(e)); })());

// ---- LAST ITEM MUST BE SEEN (19 of 31 scenes showed it for < 1 s) ----
ok(`last item stays on screen >= ${TIMING.minTail}s in every scene`, P.scenes.every(sc => sc.dur - Math.max(...prim(sc).map(i => i.at)) >= TIMING.minTail - 0.02));
{
  const b = beats(); b.scenes[1].cards = ['desktop', 'phone', 'drone', 'server', 'cloud'].map((ic, i) => ({ id: 'q' + i, icon: ic, label: ic, cue: 'drone' }));   // 5 cards, ALL cued on the last word
  const sc = planVideo(b, { words }).scenes[1];
  ok('cues piled on the last word are pulled earlier, not left invisible', sc.dur - Math.max(...prim(sc).map(i => i.at)) >= TIMING.minTail - 0.02);
  ok('...and a big early-display shift is reported to the author', sc.issues.some(i => i.code === 'W_EARLY'));
}
{
  const b = beats(); const sc0 = b.scenes[1];                                  // 2.6s of speech cannot hold 5 items
  b.scenes[1] = { ...sc0, narration: 'It works on your desktop.', cards: ['desktop', 'phone', 'drone', 'server', 'cloud'].map((ic, i) => ({ id: 'z' + i, icon: ic, label: ic })) };
  b.scenes.splice(2, 1);
  let errs = []; try { errs = lint(planVideo(b, { words: words.filter(() => true) })).errors; } catch (e) { errs = [e.message]; }
  ok('too many items for the available speech time is refused', errs.some(e => /cannot fit|not covered|belong to a scene/.test(e)));
}

// ---- LEFT-TO-RIGHT / READING ORDER (items popped in right-to-left or middle-first) ----
const at = (sc, id) => sc.items.find(i => i.id === id).at;
ok('iconrow: strictly left to right', (() => { const sc = P.scenes.find(s => s.id === 's2-devices'); return at(sc, 'd1') < at(sc, 'd2') && at(sc, 'd2') < at(sc, 'd3'); })());
ok('flow: parent before children, children top to bottom', (() => { const sc = P.scenes.find(s => s.id === 's4-replace'); return at(sc, 'suite') < at(sc, 'ps') && at(sc, 'ps') < at(sc, 'pr') && at(sc, 'pr') < at(sc, 'ae'); })());
ok('compare: left panel, then right panel, and "vs" lands WITH the right panel (never alone)', (() => { const sc = P.scenes.find(s => s.id === 's6-compare'); return at(sc, 'panel-a') < at(sc, 'panel-b') && at(sc, 'vs') === at(sc, 'panel-b'); })());
ok('stat: value, then label, then note (text never before the headline)', (() => { const sc = P.scenes.find(s => s.id === 's3-toll'); return at(sc, 'hero') === at(sc, 'value') && at(sc, 'value') < at(sc, 'label') && at(sc, 'label') < at(sc, 'note'); })());
ok('title: title, subtitle, then the extras', (() => { const sc = P.scenes.find(s => s.id === 's1-title'); return at(sc, 'hero') === at(sc, 'title') && at(sc, 'title') < at(sc, 'subtitle') && at(sc, 'subtitle') < at(sc, 'tag'); })());
{
  const b = beats(); b.scenes[6].cards.reverse();                             // laptop/AI/drone order that contradicts the sentence
  const errs = lint(planVideo(b, { words })).errors;
  ok('speaking order that contradicts reading order is a lint ERROR with a fix hint', errs.some(e => /spoken BEFORE/.test(e) && /Reorder/.test(e)));
}
ok('timeline date appears WITH its node', (() => { const b = beats(); b.scenes[3] = { id: 'tl', type: 'timeline', narration: b.scenes[3].narration, points: [{ id: 't1', label: 'One suite', date: '2024', cue: 'suite' }, { id: 't2', label: 'Photoshop', date: '2025', cue: 'Photoshop' }] }; const sc = planVideo(b, { words }).scenes[3]; return at(sc, 't1-date') === at(sc, 't1') && at(sc, 't2-date') === at(sc, 't2'); })());

// ---- NO CHARACTER ----
ok('no mascot slot unless meta.mascot is set', P.scenes.every(s => s.mascot === null));
{ const b = beats(); b.meta.mascot = ['point']; ok('mascot is opt-in only', planVideo(b, { words }).scenes.some(s => s.mascot)); }

// ---- NO COUNT-UP, NO INVISIBLE PACING ----
ok('stat values never count up (no 0 Dev + AI, 64% Fit, 1 Options)', P.scenes.every(s => s.items.every(i => !('countTo' in i) || i.countTo == null)));
ok('quiet stretches get a VISIBLE underline/marker, never an invisible tick', P.scenes.every(s => s.events.every(e => ['reveal', 'camera', 'underline', 'marker'].includes(e.type))) && P.scenes.some(s => s.events.some(e => e.type === 'underline')));
ok('no stretch longer than 3.2s without a visible event', P.scenes.every(sc => { const t = [0, ...sc.events.map(e => e.t), sc.dur].sort((a, b) => a - b); return t.every((x, i) => i === 0 || x - t[i - 1] <= TIMING.maxGap); }));

// ---- DARK LOGOS (Photoshop/Premiere/GitHub were nearly invisible) ----
{
  let sharp = null; try { const { createRequire } = await import('node:module'); sharp = createRequire(import.meta.url)('sharp'); } catch {}
  if (sharp) {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), 'logo-'));
    fs.writeFileSync(path.join(d, 'dark.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="#001e36"/><text x="3" y="17" font-size="14" fill="#31a8ff">Ps</text></svg>');
    fs.writeFileSync(path.join(d, 'light.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FF6B35"/></svg>');
    ok('dark logo detected (gets a light plate)', (await logoDarkness(path.join(d, 'dark.svg'), sharp)).dark === true);
    ok('bright logo is left alone', (await logoDarkness(path.join(d, 'light.svg'), sharp)).dark === false);
  } else console.log('SKIP  logo darkness tests (sharp not installed)');
  const p = planVideo(beats(), { words, logoInfo: { blender: { dark: true } } });
  ok('logo plate flag reaches the plan', p.scenes.some(s => s.items.some(i => i.logo === 'blender' && i.logoDark === true)));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
