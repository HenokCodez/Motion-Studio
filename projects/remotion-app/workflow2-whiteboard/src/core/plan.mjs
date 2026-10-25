import { CANVAS, RULES, TIMING } from './tokens.mjs';
import { layoutScene } from './layout.mjs';
import { alignScenes, cueTime, AlignError } from './align.mjs';

export { AlignError };

const HIGHLIGHT_AFTER = 0.7;   // a highlight never appears sooner than this after the thing it highlights
const HIGHLIGHT_LEAD = 0.15;   // highlights land almost exactly on their word
const FILLABLE = new Set(['bigtitle', 'stat', 'text', 'node', 'icard', 'panel', 'chip']);

// Camera is STILL by default. It moves only to zoom into a highlight on a lone screenshot
// where on-page text is too small to read. Never to "follow" the newest node.
function zoomFor(m) {
  const W = CANVAS.w, H = CANVAS.h;
  const s = Math.min(1.8, 0.55 * W / m.w, 0.55 * H / m.h);
  if (s < 1.25) return null;
  const cx0 = m.x + m.w / 2, cy0 = m.y + m.h / 2, vw = W / s, vh = H / s;
  return { s, cx: Math.min(Math.max(cx0, vw / 2), W - vw / 2), cy: Math.min(Math.max(cy0, vh / 2), H - vh / 2) };
}

// READING ORDER. Things always appear in the order the eye reads them:
//   stat: icon -> value -> label -> note (top to bottom)      title: icon+title -> subtitle -> tag -> chips -> command
//   compare: A -> B (+ "vs" together with B)                  everything else: left to right, then top to bottom
const TITLE_ORDER = { hero: 0, bigtitle: 1, text: 3, tag: 3.5, chip: 4, terminal: 5 };
function rank(it, scene) {
  if (it.kind === 'caption') return [99, 0, 0];
  switch (scene.type) {
    case 'stat': return [0, it.y, it.x];
    case 'title': return [TITLE_ORDER[it.kind] ?? 6, it.x, it.y];
    case 'compare': return [it.id === 'panel-a' ? 0 : 1, it.y, it.x];
    default: return [it.col ?? Math.round(it.x / 80), it.y, it.x];
  }
}
const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

export function planScene(scene, { start, dur, words, dims, root, mascot, logoInfo }) {
  const lay = layoutScene(scene, { dims, root, mascot, logoInfo });
  const items = lay.items, issues = [];
  const byId = Object.fromEntries(items.map(i => [i.id, i]));
  const groupTarget = (it) => it.groupWith || (it.kind === 'label' && it.parent) || null;

  // ---- 1. when is each cue word spoken (scene-local, exact token match) ----
  for (const it of items) {
    it.cueAt = null;
    if (words && it.cue) {
      const r = cueTime(it.cue, words);
      if (r.t === null) issues.push({ level: 'error', code: 'E_CUE', msg: `cue "${it.cue}" for "${it.id}" is never spoken in this scene's narration. Use a word that is actually said here (see the transcript).` });
      else {
        it.cueAt = r.t - start - (it.kind === 'mark' ? HIGHLIGHT_LEAD : TIMING.lead);
        if (r.count > 1) issues.push({ level: 'warn', code: 'W_CUE_AMBIGUOUS', msg: `cue "${it.cue}" is spoken ${r.count}x in this scene; using the first. Write "${it.cue}#2" for the second.` });
      }
    }
  }

  // ---- 2. reveal in READING ORDER; cues only retime, they never reorder ----
  const primary = items.filter(i => i.kind !== 'mark' && i.kind !== 'header' && !groupTarget(i)).sort((a, b) => cmp(rank(a, scene), rank(b, scene)));
  let prevAt = -Infinity, prevCue = null, prevId = null;
  primary.forEach((it, k) => {
    const want = it.cueAt;
    let at = k === 0 ? TIMING.openAt : (want !== null ? want : prevAt + 0.8);   // the first thing is ALWAYS on screen almost immediately
    if (want !== null && prevCue !== null && want < prevCue - 0.05)
      issues.push({ level: 'error', code: 'E_ORDER', msg: `"${it.id}" is spoken BEFORE "${prevId}" but sits after it on screen (left-to-right / top-to-bottom). Reorder the items in beats.json so reading order = speaking order. Never animate right-to-left.` });
    at = Math.max(at, prevAt + TIMING.step);
    it.at = at; it.cued = want !== null;
    if (want !== null) { prevCue = want; prevId = it.id; }
    prevAt = at;
  });

  // ---- 3. tail guard: the last thing must stay on screen long enough to be seen ----
  const n = primary.length, limit = dur - TIMING.minTail;
  if (n && limit < TIMING.openAt + TIMING.step * (n - 1))
    issues.push({ level: 'error', code: 'E_DENSE', msg: `${n} items cannot fit in a ${dur.toFixed(1)}s scene (each needs ${TIMING.step}s, last one needs ${TIMING.minTail}s on screen). Split the narration or remove items.` });
  for (let k = n - 1; k >= 0; k--) {
    const maxAt = limit - TIMING.step * (n - 1 - k), it = primary[k];
    if (it.at > maxAt) {
      const early = it.at - Math.max(maxAt, TIMING.openAt);
      if (it.cued && early > 0.6) issues.push({ level: 'warn', code: 'W_EARLY', msg: `"${it.id}" is shown ${early.toFixed(1)}s before its spoken word so it stays visible ${TIMING.minTail}s before the scene ends. Cue an earlier word or shorten the scene's last sentence.` });
      it.at = Math.max(maxAt, TIMING.openAt + TIMING.step * k);
    }
  }
  for (let k = 1; k < n; k++) primary[k].at = Math.max(primary[k].at, primary[k - 1].at + TIMING.step);

  // ---- 4. things that travel with another thing (header, labels, 'vs', timeline dates) ----
  const first = primary[0]?.at ?? TIMING.openAt;
  for (const it of items) {
    if (it.kind === 'header') it.at = first;
    else if (groupTarget(it)) it.at = byId[groupTarget(it)]?.at ?? first;
    it.cued = it.cued ?? false;
  }

  // ---- 5. highlights: always AFTER their screenshot; the screenshot is pulled earlier if it can be ----
  for (const shot of items.filter(i => i.kind === 'shot')) {
    const marks = items.filter(i => i.parent === shot.id && i.kind === 'mark').sort((a, b) => (a.cueAt ?? 1e9) - (b.cueAt ?? 1e9));
    const firstCue = marks.find(m => m.cueAt !== null)?.cueAt;
    if (firstCue !== undefined) {
      const idx = primary.indexOf(shot), floor = idx <= 0 ? TIMING.openAt : primary[idx - 1].at + TIMING.step;
      shot.at = Math.min(shot.at, Math.max(floor, firstCue - HIGHLIGHT_AFTER));
      items.filter(i => groupTarget(i) === shot.id).forEach(l => { l.at = shot.at; });
    }
    marks.forEach((m, j) => {
      const wanted = m.cueAt !== null ? m.cueAt : shot.at + HIGHLIGHT_AFTER + 0.9 * (j + 1);
      m.at = Math.max(wanted, shot.at + HIGHLIGHT_AFTER);
      m.cued = m.cueAt !== null;
      m.at = Math.min(m.at, Math.max(shot.at + HIGHLIGHT_AFTER, dur - 1.0));
    });
  }

  // ---- 6. camera: still, with at most 2 deliberate zooms into highlights on a lone screenshot ----
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

  // ---- 7. events. Quiet stretches get a VISIBLE hand-drawn emphasis (underline, then marker). Never an invisible tick. ----
  const events = items.map(i => ({ t: i.at, type: 'reveal', item: i.id }));
  camera.slice(1).forEach(k => events.push({ t: k.t, type: 'camera' }));
  events.sort((a, b) => a.t - b.t);
  const stamps = [0, ...events.map(e => e.t), dur], fills = [], used = {};
  for (let i = 1; i < stamps.length; i++) {
    let t = stamps[i - 1];
    while (stamps[i] - t > TIMING.fillGap + 0.1) {
      t += TIMING.fillGap;
      const cands = items.filter(c => FILLABLE.has(c.kind) && c.id !== 'vs' && c.at <= t - 0.3).sort((a, b) => b.at - a.at);
      const focus = cands.find(c => (used[c.id] || 0) < 2);
      if (!focus) break;
      fills.push({ t, type: (used[focus.id] || 0) === 0 ? 'underline' : 'marker', item: focus.id });
      used[focus.id] = (used[focus.id] || 0) + 1;
    }
  }
  return {
    id: scene.id, type: scene.type, start, dur, narration: scene.narration || '', ...lay, camera,
    events: [...events, ...fills].sort((a, b) => a.t - b.t), pulsesInserted: fills.length, issues,
  };
}

export function planVideo(beats, { words = null, dims = {}, root = '.', draft = false, logoInfo = {} } = {}) {
  const mascot = !!beats.meta?.mascot;
  let plans = [], alignInfo = null;
  if (words) {
    alignInfo = alignScenes(beats.scenes, words);
    plans = beats.scenes.map((sc, i) => planScene(sc, { start: alignInfo.scenes[i].start, dur: alignInfo.scenes[i].dur, words: alignInfo.scenes[i].words, dims, root, mascot, logoInfo }));
  } else if (draft) {
    let t = 0;
    plans = beats.scenes.map(sc => {
      if (!sc.dur) throw new AlignError(`draft mode needs "dur" on scene "${sc.id}"`);
      const p = planScene(sc, { start: t, dur: sc.dur, words: null, dims, root, mascot, logoInfo }); t += sc.dur; return p;
    });
  } else throw new AlignError('words.json (voiceover word timestamps) is required. It is what makes visuals land on the spoken words. Use --draft only for layout work without audio.');
  const totalSec = plans.length ? plans[plans.length - 1].start + plans[plans.length - 1].dur : 0;
  return {
    meta: { ...beats.meta, fps: CANVAS.fps, width: CANVAS.w, height: CANVAS.h, totalSec, totalFrames: Math.round(totalSec * CANVAS.fps), draft: !words },
    align: alignInfo ? { coverage: alignInfo.coverage, issues: alignInfo.issues, scores: alignInfo.scenes.map(s => ({ id: s.id, score: +s.score.toFixed(2), start: +s.start.toFixed(2), dur: s.dur })) } : null,
    scenes: plans,
  };
}
