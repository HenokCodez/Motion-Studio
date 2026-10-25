import { CANVAS, RULES } from './tokens.mjs';
import { layoutScene } from './layout.mjs';
import { alignScenes, cueTime, AlignError } from './align.mjs';

export { AlignError };

const LEAD = 0.12;           // a visual lands slightly BEFORE its spoken word
const HIGHLIGHT_AFTER = 0.7; // a highlight never appears sooner than this after the thing it highlights
const MIN_SPACING = 0.22;

// Camera is STILL by default. It moves only to zoom into a highlight on a lone screenshot
// where on-page text is too small to read. Never to "follow" the newest node.
function zoomFor(m) {
  const W = CANVAS.w, H = CANVAS.h;
  const s = Math.min(1.8, 0.55 * W / m.w, 0.55 * H / m.h);
  if (s < 1.25) return null;
  const cx0 = m.x + m.w / 2, cy0 = m.y + m.h / 2, vw = W / s, vh = H / s;
  return { s, cx: Math.min(Math.max(cx0, vw / 2), W - vw / 2), cy: Math.min(Math.max(cy0, vh / 2), H - vh / 2) };
}

export function planScene(scene, { start, dur, words, dims, root }) {
  const lay = layoutScene(scene, { dims, root });
  const items = lay.items, issues = [];

  // ---- 1. reveal time from the spoken cue word (scene-local, exact token match) ----
  let prev = 0.1;
  for (const it of items) {
    let t = null;
    if (words && it.cue) {
      const r = cueTime(it.cue, words);
      if (r.t === null) issues.push({ level: 'error', code: 'E_CUE', msg: `cue "${it.cue}" for "${it.id}" is never spoken in this scene's narration. Use a word that is actually said here (see the transcript).` });
      else { t = r.t; if (r.count > 1) issues.push({ level: 'warn', code: 'W_CUE_AMBIGUOUS', msg: `cue "${it.cue}" is spoken ${r.count}x in this scene; using the first. Write "${it.cue}#2" for the second.` }); }
    }
    if (t !== null) { it.at = Math.max(0.05, t - start - LEAD); it.cued = true; }
    else { it.at = Math.min(prev + 0.6, Math.max(0.1, dur - 0.8)); it.cued = false; }   // uncued: just after the previous item
    prev = it.at;
  }

  // ---- 2. min spacing between items (children keep their own ordering rules below) ----
  const order = [...items].sort((a, b) => a.at - b.at);
  for (let i = 1; i < order.length; i++) if (order[i].at - order[i - 1].at < MIN_SPACING && !order[i].parent) order[i].at = order[i - 1].at + MIN_SPACING;

  // ---- 3. parent-before-child: the visual ALWAYS appears first, the highlight lands after it ----
  for (const shot of items.filter(i => i.kind === 'shot')) {
    const kids = items.filter(i => i.parent === shot.id);
    const marks = kids.filter(k => k.kind === 'mark'), labels = kids.filter(k => k.kind === 'label');
    const cuedMarks = marks.filter(m => m.cued);
    if (cuedMarks.length) {                       // pull the screenshot EARLIER so it is on screen before the first highlight
      const earliest = Math.min(...cuedMarks.map(m => m.at));
      shot.at = Math.min(shot.at, Math.max(0.05, earliest - HIGHLIGHT_AFTER));
    }
    labels.forEach(l => { l.at = shot.at; });
    marks.sort((a, b) => a.at - b.at).forEach((m, j) => {
      if (!m.cued) m.at = shot.at + HIGHLIGHT_AFTER + 0.9 * (j + 1);
      m.at = Math.max(m.at, shot.at + HIGHLIGHT_AFTER);
    });
  }

  // ---- 4. camera: still, with at most 2 deliberate zooms into highlights on a lone screenshot ----
  const camera = [{ t: 0, s: 1, cx: CANVAS.w / 2, cy: CANVAS.h / 2 }];
  const shotsN = items.filter(i => i.kind === 'shot').length;
  const marks = items.filter(i => i.kind === 'mark').sort((a, b) => a.at - b.at);
  if (scene.zoom !== false && shotsN === 1) {
    let zooms = 0;
    marks.forEach((m, idx) => {
      if (zooms >= 2) return;
      const z = zoomFor(m); if (!z) return;
      const nextAt = marks[idx + 1]?.at ?? Infinity;
      const hold = Math.max(1.4, Math.min(2.6, nextAt - m.at - 0.1));
      if (m.at + hold > dur - 0.4) return;
      camera.push({ t: Math.max(0, m.at - 0.05), ...z, ease: 'expo', target: m.id });
      camera.push({ t: m.at + hold, s: 1, cx: CANVAS.w / 2, cy: CANVAS.h / 2, ease: 'expo' });
      zooms++;
    });
  }

  // ---- 5. events + calm filler (a stroke emphasis, never a scale jump) so nothing sits dead > 2s ----
  const events = items.map(i => ({ t: i.at, type: 'reveal', item: i.id }));
  camera.slice(1).forEach(k => events.push({ t: k.t, type: 'camera' }));
  events.sort((a, b) => a.t - b.t);
  const marksT = [0, ...events.map(e => e.t), dur], pulses = [];
  const focus = [...items].filter(i => !['header', 'mark', 'label', 'caption', 'date'].includes(i.kind)).sort((a, b) => a.at - b.at).slice(-1)[0];
  for (let i = 1; i < marksT.length && focus; i++) {
    let gap = marksT[i] - marksT[i - 1], t = marksT[i - 1];
    while (gap > RULES.targetGapSec) { t += RULES.targetGapSec; pulses.push({ t, type: 'pulse', item: focus.id }); gap -= RULES.targetGapSec; }
  }
  return { id: scene.id, type: scene.type, start, dur, narration: scene.narration || '', ...lay, camera, events: [...events, ...pulses].sort((a, b) => a.t - b.t), pulsesInserted: pulses.length, issues };
}

export function planVideo(beats, { words = null, dims = {}, root = '.', draft = false } = {}) {
  let plans = [], alignInfo = null;
  if (words) {
    alignInfo = alignScenes(beats.scenes, words);
    plans = beats.scenes.map((sc, i) => planScene(sc, { start: alignInfo.scenes[i].start, dur: alignInfo.scenes[i].dur, words: alignInfo.scenes[i].words, dims, root }));
  } else if (draft) {
    let t = 0;
    plans = beats.scenes.map(sc => {
      if (!sc.dur) throw new AlignError(`draft mode needs "dur" on scene "${sc.id}"`);
      const p = planScene(sc, { start: t, dur: sc.dur, words: null, dims, root }); t += sc.dur; return p;
    });
  } else throw new AlignError('words.json (voiceover word timestamps) is required. It is what makes visuals land on the spoken words. Use --draft only for layout work without audio.');
  const totalSec = plans.length ? plans[plans.length - 1].start + plans[plans.length - 1].dur : 0;
  return {
    meta: { ...beats.meta, fps: CANVAS.fps, width: CANVAS.w, height: CANVAS.h, totalSec, totalFrames: Math.round(totalSec * CANVAS.fps), draft: !words },
    align: alignInfo ? { coverage: alignInfo.coverage, issues: alignInfo.issues, scores: alignInfo.scenes.map(s => ({ id: s.id, score: +s.score.toFixed(2), start: +s.start.toFixed(2), dur: s.dur })) } : null,
    scenes: plans,
  };
}
