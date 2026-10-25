import { CANVAS, RULES } from './tokens.mjs';
import { layoutScene } from './layout.mjs';

const norm = s => String(s).toLowerCase().replace(/[^a-z0-9$%.]/g, '');

// Find when a cue word is spoken. words = [{w,start,end}] in absolute seconds.
function cueTime(cue, words, from, to) {
  if (!cue || !words?.length) return null;
  const toks = String(cue).split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (w.start < from - 0.05 || w.start > to) continue;
    if (toks.every((t, k) => words[i + k] && norm(words[i + k].w).startsWith(t))) return w.start;
  }
  return null;
}

// Camera: snappy punch-ins on the newest thing, clamped so the viewport never leaves the canvas.
function cameraFor(target, items, isZoom) {
  const W = CANVAS.w, H = CANVAS.h;
  const cx0 = target.x + target.w / 2, cy0 = target.y + target.h / 2;
  let s = isZoom
    ? Math.max(1, Math.min(2.2, 0.62 * W / target.w, 0.62 * H / target.h))
    : 1.1;
  const clampC = (c, size, full) => Math.min(Math.max(c, size / 2), full - size / 2);
  for (let guard = 0; guard < 40; guard++) {
    const vw = W / s, vh = H / s;
    const cx = clampC(cx0, vw, W), cy = clampC(cy0, vh, H), pad = isZoom ? 20 : 48;
    const inside = target.x >= cx - vw / 2 + pad && target.x + target.w <= cx + vw / 2 - pad &&
                   target.y >= cy - vh / 2 + pad && target.y + target.h <= cy + vh / 2 - pad;
    if (inside || s <= 1) return { s: Math.max(1, s), cx, cy };
    s *= 0.96;
  }
  return { s: 1, cx: W / 2, cy: H / 2 };
}

export function planScene(scene, { words, start, dims }) {
  const dur = scene.dur;
  const lay = layoutScene(scene, dims);
  const end = start + dur;

  // ---- reveal times: cue word if available, else evenly spread ----
  const reveal = lay.items.filter(i => i.kind !== 'mark' || i.cue || true);
  const n = reveal.length;
  reveal.forEach((it, idx) => {
    const t = cueTime(it.cue, words, start, end);
    it.at = t !== null ? Math.max(0.2, t - start - 0.06)
                       : 0.3 + (idx / Math.max(1, n)) * Math.min(dur * 0.75, dur - 1.0);
    it.cued = t !== null;
  });
  // keep layout order for un-cued items, enforce min spacing so nothing pops simultaneously
  const sorted = [...reveal].sort((a, b) => a.at - b.at);
  for (let i = 1; i < sorted.length; i++) if (sorted[i].at - sorted[i - 1].at < 0.22) sorted[i].at = sorted[i - 1].at + 0.22;
  const lastAt = sorted.length ? sorted[sorted.length - 1].at : 0;
  if (lastAt > dur - 0.4) {
    const k = (dur - 0.6) / lastAt;
    sorted.forEach(i => { i.at = Math.max(0.15, i.at * k); });
  }

  // ---- camera keyframes (one per reveal of something that deserves focus) ----
  const camera = [{ t: 0, s: 1, cx: CANVAS.w / 2, cy: CANVAS.h / 2 }];
  for (const it of sorted) {
    if (it.kind === 'header' || it.kind === 'caption' || it.kind === 'date') continue;
    const isZoom = !!it.zoomTarget;
    if (!isZoom && sorted.indexOf(it) === 0) continue;
    const c = cameraFor(it, lay.items, isZoom);
    camera.push({ t: Math.max(0, it.at - 0.05), ...c, ease: 'expo' });
  }
  // pull back to full frame near the end so the viewer sees the whole picture
  if (camera.length > 2 && dur - lastAt > 1.2) camera.push({ t: Math.min(dur - 0.9, lastAt + 1.4), s: 1, cx: CANVAS.w / 2, cy: CANVAS.h / 2, ease: 'expo' });

  // ---- events (every visual change) + pulses to guarantee pacing ----
  const events = sorted.map(i => ({ t: i.at, type: 'reveal', item: i.id }));
  camera.slice(1).forEach(k => events.push({ t: k.t, type: 'camera' }));
  events.sort((a, b) => a.t - b.t);
  const marks = [0, ...events.map(e => e.t), dur];
  const pulses = [];
  const focusId = sorted.filter(i => i.kind !== 'header').slice(-1)[0]?.id;
  for (let i = 1; i < marks.length; i++) {
    let gap = marks[i] - marks[i - 1], t = marks[i - 1];
    while (gap > RULES.targetGapSec && focusId) { t += RULES.targetGapSec; pulses.push({ t, type: 'pulse', item: focusId }); gap -= RULES.targetGapSec; }
  }
  const allEvents = [...events, ...pulses].sort((a, b) => a.t - b.t);

  return { id: scene.id, type: scene.type, start, dur, narration: scene.narration || '', ...lay, camera, events: allEvents, pulsesInserted: pulses.length };
}

export function planVideo(beats, { words, dims }) {
  let t = 0;
  const scenes = beats.scenes.map(sc => {
    const start = sc.start ?? t;
    const p = planScene(sc, { words, start, dims });
    t = start + sc.dur;
    return p;
  });
  return { meta: { ...beats.meta, fps: CANVAS.fps, width: CANVAS.w, height: CANVAS.h, totalSec: t, totalFrames: Math.round(t * CANVAS.fps) }, scenes };
}
