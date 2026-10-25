import { SAFE, FONT, MASCOT, RULES } from './tokens.mjs';
import { loadIcon } from './icons.mjs';

export class LayoutError extends Error {}

// Conservative text-width model (handwriting ~0.5em/char, mono ~0.6em/char).
// Over-estimates slightly on purpose: a box that is a bit roomy beats text that clips.
// Real per-character widths come from font-metrics.json (scripts/measure-font.mjs, measured in a real browser from YOUR fonts).
// Without it, a conservative guess is used and the preview's render-based overflow check is the safety net.
import fs from 'node:fs';
import path from 'node:path';
let METRICS;
function metrics() {
  if (METRICS !== undefined) return METRICS;
  try { METRICS = JSON.parse(fs.readFileSync(process.env.W2_METRICS || path.join(process.cwd(), 'font-metrics.json'), 'utf8')); } catch { METRICS = null; }
  return METRICS;
}
export const cw = (s, size, mono = false, bold = false) => {
  const m = metrics()?.[mono ? 'mono' : bold ? 'sans' : 'hand'];
  if (!m) return String(s).length * size * (mono ? 0.6 : bold ? 0.74 : 0.5);
  let w = 0; for (const ch of String(s)) w += m.chars[ch] ?? m.avg;
  return w * m.kern * size * 1.04;                       // 4% safety slack for sub-pixel rounding
};

export function wrap(text, size, maxW, mono = false) {
  const lines = []; let cur = '';
  for (const w of String(text).split(/\s+/)) {
    const t = cur ? cur + ' ' + w : w;
    if (!cur || cw(t, size, mono) <= maxW) cur = t; else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

function boxFor(label, { size = FONT.label, maxW = 600, logo = false, sub = '', pad = 30, mono = false, minW = 220, icon = null, iconSize = 0, iconMode = 'top' } = {}) {
  const left = icon && iconMode === 'left';
  const logoW = logo ? 96 : left ? iconSize + 24 : 0;
  const lines = wrap(label, size, maxW - 2 * pad - logoW, mono);
  const tw = Math.max(...lines.map(l => cw(l, size, mono)));
  const subLines = sub ? wrap(sub, FONT.sub, maxW - 2 * pad) : [];
  const sw = subLines.length ? Math.max(...subLines.map(l => cw(l, FONT.sub))) : 0;
  const iconH = icon && !left ? iconSize + 14 : 0;
  const w = Math.ceil(Math.max(tw + logoW, sw, icon && !left ? iconSize : 0) + 2 * pad);
  const textH = lines.length * size * 1.25 + (subLines.length ? subLines.length * FONT.sub * 1.25 + 10 : 0);
  const h = Math.ceil(Math.max(textH, left ? iconSize : 0) + iconH + 2 * pad);
  return { w: Math.max(w, minW), h: Math.max(h, 104), lines, subLines, size, icon, iconSize: icon ? iconSize : 0, iconMode };
}

const item = (o) => ({ cue: null, ...o });

// ---------- optional small scene title, top-left ----------
function withHeader(scene, area, items) {
  if (!scene.title || scene.type === 'title') return area;
  const lines = [scene.title];
  items.push(item({
    id: 'header', kind: 'header', x: area.x, y: area.y,
    w: cw(scene.title, FONT.header) + (scene.titleLogo ? 120 : 0), h: 76,
    lines, size: FONT.header, logo: scene.titleLogo || null, cue: scene.titleCue || null,
  }));
  return { x: area.x, y: area.y + 120, w: area.w, h: area.h - 120 };
}

// ---------- FLOW: layered left-to-right tree ----------
function flow(scene, area, items) {
  const nodes = scene.nodes, edges = scene.edges || [];
  if (nodes.length > 7) throw new LayoutError(`flow has ${nodes.length} nodes (max 7). Split into two scenes.`);
  const depth = {};
  nodes.filter(n => !edges.some(e => e[1] === n.id)).forEach(n => { depth[n.id] = 0; });
  for (let i = 0; i < nodes.length + 2; i++)
    for (const [a, b] of edges)
      if (depth[a] !== undefined && (depth[b] === undefined || depth[b] < depth[a] + 1)) depth[b] = depth[a] + 1;
  for (const n of nodes)
    if (depth[n.id] === undefined || depth[n.id] >= nodes.length)
      throw new LayoutError(`flow node "${n.id}" is unreachable or in a cycle`);
  const nCols = Math.max(...Object.values(depth)) + 1;

  let sized = null;
  for (const size of [68, 60, 54, 48, FONT.label, 42, FONT.labelFloor]) {
    const maxW = nCols >= 4 ? 460 : nCols === 3 ? 600 : 760;
    const boxes = Object.fromEntries(nodes.map(n => [n.id, boxFor(n.label, { size, maxW, logo: !!n.logo, sub: n.sub, icon: n.icon || null, iconSize: Math.round(size * 1.7), iconMode: 'left' })]));
    const colW = Array.from({ length: nCols }, (_, c) => Math.max(...nodes.filter(n => depth[n.id] === c).map(n => boxes[n.id].w)));
    const sumW = colW.reduce((a, b) => a + b, 0);
    const gapX = nCols > 1 ? (area.w - sumW) / (nCols - 1) : 0;
    const colH = Array.from({ length: nCols }, (_, c) => nodes.filter(n => depth[n.id] === c).reduce((a, n) => a + boxes[n.id].h + 64, -64));
    if ((nCols === 1 || gapX >= 110) && Math.max(...colH) <= area.h) { sized = { boxes, colW, gapX: Math.min(gapX, 260) }; break; }
  }
  if (!sized) {
    const size = FONT.labelFloor, maxW = nCols >= 4 ? 460 : nCols === 3 ? 600 : 760;
    const bx = Object.fromEntries(nodes.map(n => [n.id, boxFor(n.label, { size, maxW, logo: !!n.logo, sub: n.sub, icon: n.icon || null, iconSize: Math.round(size * 1.7), iconMode: 'left' })]));
    const sumW = Array.from({ length: nCols }, (_, c) => Math.max(...nodes.filter(n => depth[n.id] === c).map(n => bx[n.id].w))).reduce((a, b) => a + b, 0);
    const maxH = Math.max(...Array.from({ length: nCols }, (_, c) => nodes.filter(n => depth[n.id] === c).reduce((a, n) => a + bx[n.id].h + 64, -64)));
    throw new LayoutError(sumW + 110 * (nCols - 1) > area.w
      ? `flow is too WIDE: ${nCols} columns need ${Math.round(sumW)}px of boxes but only ${Math.round(area.w)}px fit. Shorten labels or split the scene.`
      : `flow is too TALL: its busiest column needs ${Math.round(maxH)}px but only ${Math.round(area.h)}px fit. Put fewer nodes in one column or split the scene.`);
  }
  const { boxes, colW, gapX } = sized;
  const totalW = colW.reduce((a, b) => a + b, 0) + gapX * (nCols - 1);
  let cx = area.x + (area.w - totalW) / 2;
  const colX = colW.map(w => { const x = cx; cx += w + gapX; return x; });
  const gapY = 64, placed = {};
  for (let c = 0; c < nCols; c++) {
    const col = nodes.filter(n => depth[n.id] === c);
    const H = col.reduce((a, n) => a + boxes[n.id].h, 0) + gapY * (col.length - 1);
    if (H > area.h) throw new LayoutError(`flow column ${c} needs ${Math.round(H)}px but only ${area.h}px available. Fewer nodes per column.`);
    let y = area.y + (area.h - H) / 2;
    for (const n of col) {
      const b = boxes[n.id];
      placed[n.id] = { x: colX[c] + (colW[c] - b.w) / 2, y, w: b.w, h: b.h };
      y += b.h + gapY;
    }
  }
  for (const n of nodes) {
    const b = boxes[n.id];
    items.push(item({
      id: n.id, kind: n.kind || 'node', ...placed[n.id], lines: b.lines, subLines: b.subLines,
      size: b.size, logo: n.logo || null, icon: b.icon, iconSize: b.iconSize, iconMode: 'left', emphasis: !!n.emphasis, cue: n.cue || null, col: depth[n.id],
    }));
  }
  return edges.map(([a, b]) => ({
    from: a, to: b,
    p0: [placed[a].x + placed[a].w, placed[a].y + placed[a].h / 2],
    p1: [placed[b].x, placed[b].y + placed[b].h / 2],
  }));
}

// ---------- SHOT: 1-2 real screenshots, optional device frame, highlights anchored to real on-page text ----------
const FRAMES = { browser: { t: 64, r: 0, b: 0, l: 0 }, laptop: { t: 26, r: 26, b: 64, l: 26 }, phone: { t: 48, r: 22, b: 48, l: 22 } };
function shots(scene, area, items, dims) {
  const list = scene.shots;
  if (!list || list.length < 1 || list.length > 2) throw new LayoutError('shot scene needs 1 or 2 shots');
  const gap = 56, n = list.length;
  const capH = scene.caption ? 110 : 0;
  const lblH = list.some(s => s.label) ? 96 : 0;
  const slotW = (area.w - gap * (n - 1)) / n, slotH = area.h - capH - lblH;
  list.forEach((s, i) => {
    if (s.frame && !FRAMES[s.frame]) throw new LayoutError(`unknown frame "${s.frame}" (browser | laptop | phone)`);
    const ins = s.frame ? FRAMES[s.frame] : { t: 0, r: 0, b: 0, l: 0 };
    const d = dims[s.asset] || (s.frame === 'phone' ? { w: 900, h: 1700, assumed: true } : { w: 1600, h: 900, assumed: true });
    const k = Math.min((slotW - ins.l - ins.r) / d.w, (slotH - ins.t - ins.b) / d.h, 1.25);
    const iw = Math.round(d.w * k), ih = Math.round(d.h * k);
    const w = iw + ins.l + ins.r, h = ih + ins.t + ins.b;
    const x = Math.round(area.x + i * (slotW + gap) + (slotW - w) / 2);
    const y = Math.round(area.y + lblH + (slotH - h) / 2);
    if (s.label) items.push(item({
      id: `${s.id}-label`, kind: 'label', x, y: y - 92,
      w: Math.min(w, cw(s.label, FONT.label) + (s.labelLogo ? 110 : 0)), h: 72,
      lines: [s.label], size: FONT.label, logo: s.labelLogo || null, cue: s.labelCue || s.cue || null, parent: s.id,
    }));
    items.push(item({ id: s.id, kind: 'shot', col: i, x, y, w, h, inset: ins, frame: s.frame || null, asset: s.asset, assumedDims: !!d.assumed, cue: s.cue || null }));
    (s.highlights || []).forEach((hl, j) => {
      let box = null, manual = false;
      if (hl.text) {
        box = d.boxes?.[hl.text] || null;
        if (!box && d.assumed) box = { x: 0.1, y: 0.45 + 0.15 * j, w: 0.5, h: 0.1 };            // draft mode only (asset missing)
        if (!box) throw new LayoutError(`highlight text "${hl.text}" has no recorded position in ${s.asset}.boxes.json. Run "npm run assets" (captures it from the live page) or pick text that is really visible on the screenshot.`);
      } else if (hl.w) { box = hl; manual = true; }
      else throw new LayoutError(`highlight on "${s.id}" needs {text:"..."} (preferred) or {x,y,w,h}`);
      items.push(item({
        id: `${s.id}-hl${j}`, kind: 'mark', within: s.id, parent: s.id, manual,
        x: x + ins.l + box.x * iw - 8, y: y + ins.t + box.y * ih - 6, w: box.w * iw + 16, h: box.h * ih + 12,
        cue: hl.cue || null, text: hl.text || null, zoomTarget: true,
      }));
    });
  });
  if (scene.caption) items.push(item({
    id: 'caption', kind: 'caption', x: area.x, y: area.y + area.h - capH + 20, w: area.w, h: 70,
    lines: [scene.caption], size: FONT.label, cue: scene.captionCue || null, center: true,
  }));
}

// ---------- ICONROW: 2-5 big illustrated cards (desktop / phone / drone ...) ----------
function iconrow(scene, area, items) {
  const cards = scene.cards;
  if (!cards || cards.length < 2 || cards.length > 5) throw new LayoutError('iconrow needs 2-5 cards');
  const nC = cards.length, gap = scene.arrows ? 130 : 48, pad = 30;
  const cardW = Math.min(600, (area.w - gap * (nC - 1)) / nC);
  let best = null;
  for (const size of [72, 64, 58, 54, 48, FONT.label, 42, FONT.labelFloor]) {
    const iconSize = Math.round(Math.min(340, cardW * 0.7));
    const bs = cards.map(c => boxFor(c.label, { size, maxW: cardW, sub: c.sub, icon: c.icon, iconSize, pad, minW: cardW }));
    const H = Math.max(...bs.map(b => b.h));
    if (H <= area.h * 0.85 && bs.every(b => b.w <= cardW + 1)) { best = { bs, H, size }; break; }
  }
  if (!best) throw new LayoutError('iconrow labels too long for the card width. Shorten them.');
  const totalW = cardW * nC + gap * (nC - 1);
  let x = area.x + (area.w - totalW) / 2;
  const y = area.y + (area.h - best.H) / 2;
  const placed = [];
  cards.forEach((c, i) => {
    const b = best.bs[i];
    items.push(item({ id: c.id, kind: 'icard', x, y, w: cardW, h: best.H, lines: b.lines, subLines: b.subLines, size: best.size, icon: c.icon, iconSize: b.iconSize, emphasis: !!c.emphasis, cue: c.cue || null, col: i }));
    placed.push({ x, y, w: cardW, h: best.H }); x += cardW + gap;
  });
  return scene.arrows ? cards.slice(1).map((c, i) => ({ from: cards[i].id, to: c.id, p0: [placed[i].x + placed[i].w, y + best.H / 2], p1: [placed[i + 1].x, y + best.H / 2] })) : [];
}

// ---------- STAT ----------
function stat(scene, area, items) {
  const big = String(scene.value);
  if (cw(big, FONT.stat, false, true) > area.w) throw new LayoutError(`stat value "${big}" too wide`);
  const parts = [['value', big, FONT.stat, FONT.stat * 1.1], ['label', scene.label, FONT.statLabel, 80]];
  if (scene.icon) parts.unshift(['hero', null, 0, 190]);
  if (scene.note) parts.push(['note', scene.note, FONT.label, 64]);
  const H = parts.reduce((a, p) => a + p[3], 0) + 30 * (parts.length - 1);
  let y = area.y + (area.h - H) / 2;
  for (const [id, text, size, h] of parts) {
    if (id === 'hero') { items.push(item({ id: 'hero', kind: 'hero', x: area.x + (area.w - 190) / 2, y, w: 190, h: 190, icon: scene.icon, iconSize: 190, emphasis: true, cue: null, groupWith: 'value' })); y += h + 30; continue; }
    const w = Math.min(area.w, cw(text, size, false, id === 'value'));
    items.push(item({
      id, kind: id === 'value' ? 'stat' : 'text', x: area.x + (area.w - w) / 2, y, w, h,
      lines: [text], size, center: true, emphasis: id === 'value',
      cue: scene[id + 'Cue'] || (id === 'value' ? scene.cue : null) || null,
    }));
    y += h + 30;
  }
}

// ---------- TIMELINE ----------
function timeline(scene, area, items) {
  const pts = scene.points;
  if (pts.length < 2 || pts.length > 4) throw new LayoutError('timeline needs 2-4 points');
  const colW = area.w / pts.length, lineY = area.y + area.h * 0.62;
  pts.forEach((p, i) => {
    const cx = area.x + colW * (i + 0.5);
    let b = null;
    for (const sz of [60, 54, 48, FONT.label, FONT.labelFloor]) { b = boxFor(p.label, { size: sz, maxW: colW - 50, logo: !!p.logo, sub: p.detail }); if (b.h <= 330) break; }
    items.push(item({
      id: p.id, kind: 'node', x: cx - b.w / 2, y: lineY - 150 - b.h, w: b.w, h: b.h,
      lines: b.lines, subLines: b.subLines, size: b.size, logo: p.logo || null, emphasis: !!p.emphasis, cue: p.cue || null, col: i,
    }));
    items.push(item({ id: `${p.id}-date`, kind: 'date', x: cx - 150, y: lineY + 40, w: 300, h: 64, lines: [p.date], size: FONT.label, center: true, cue: null, groupWith: p.id }));
  });
  return { timelineY: lineY, xs: pts.map((_, i) => area.x + colW * (i + 0.5)) };
}

// ---------- COMPARE ----------
function compare(scene, area, items) {
  const gap = 140, W = (area.w - gap) / 2, sides = [['a', scene.a], ['b', scene.b]];
  if (sides.some(([, s]) => !s || (s.bullets || []).length > 4)) throw new LayoutError('compare needs a and b with at most 4 bullets each');
  let size = null, H = 0;
  for (const sz of [60, 54, 48, FONT.label, FONT.labelFloor]) {
    const hs = sides.map(([, s]) => {
      const lines = [s.title, ...(s.bullets || [])].flatMap((t, i) => wrap(t, i ? sz : sz + 8, W - 90 - (i === 0 && s.icon ? Math.round((sz + 8) * 1.3) + 24 : 0)));
      return Math.ceil(lines.length * sz * 1.3 + 110);
    });
    if (Math.max(...hs) <= area.h * 0.8) { size = sz; H = Math.max(...hs); break; }
  }
  if (!size) throw new LayoutError('compare panels do not fit even at 40px. Shorten bullets.');
  sides.forEach(([k, s], i) => items.push(item({
    id: `panel-${k}`, kind: 'panel', x: area.x + i * (W + gap), y: area.y + (area.h - H) / 2, w: W, h: H,
    lines: [s.title, ...(s.bullets || [])], size, emphasis: s.emphasis === true, logo: s.logo || null, icon: s.icon || null, iconSize: Math.round((size + 8) * 1.3), cue: s.cue || null,
  })));
  items.push(item({ id: 'vs', kind: 'text', x: area.x + W + 10, y: area.y + area.h / 2 - 40, w: gap - 20, h: 80, lines: ['vs'], size: FONT.label, center: true, cue: null, groupWith: 'panel-b' }));
}

// ---------- TITLE / WORDMARK ----------
function title(scene, area, items) {
  const parts = [];
  if (scene.icon) parts.push({ id: 'hero', h: 200, kind: 'hero', cue: scene.iconCue || scene.cue });
  parts.push({ id: 'title', size: FONT.title, text: scene.title, h: Math.round(FONT.title * 1.15), kind: 'bigtitle', cue: scene.cue });
  if (scene.subtitle) parts.push({ id: 'subtitle', size: FONT.label, text: scene.subtitle, h: 66, kind: 'text', cue: scene.subtitleCue });
  const chips = scene.chips || [];
  if (chips.length) parts.push({ id: 'chips', h: 96, kind: 'chips' });
  if (scene.command) parts.push({ id: 'command', size: FONT.mono, text: scene.command, h: 130, kind: 'terminal', cue: scene.commandCue });
  const H = parts.reduce((a, p) => a + p.h, 0) + 36 * (parts.length - 1);
  if (H > area.h) throw new LayoutError('title scene too tall');
  let y = area.y + (area.h - H) / 2;
  for (const p of parts) {
    if (p.id === 'chips') {
      const bs = chips.map(c => boxFor(c.label, { size: FONT.labelFloor, maxW: 420, pad: 22, minW: 0 }));
      const gapC = 40, tw = bs.reduce((a, b) => a + b.w, 0) + gapC * (bs.length - 1);
      if (tw > area.w) throw new LayoutError('chips row too wide');
      let x = area.x + (area.w - tw) / 2;
      chips.forEach((c, i) => {
        items.push(item({ id: `chip-${i}`, kind: 'chip', x, y, w: bs[i].w, h: 80, lines: bs[i].lines, size: FONT.labelFloor, cue: c.cue || null }));
        x += bs[i].w + gapC;
      });
    } else if (p.id === 'hero') {
      items.push(item({ id: 'hero', kind: 'hero', x: area.x + (area.w - 200) / 2, y, w: 200, h: 200, icon: scene.icon, iconSize: 200, emphasis: true, cue: null, groupWith: 'title' }));
    } else {
      const w = Math.min(area.w, p.kind === 'terminal' ? Math.max(700, cw(p.text, p.size, true) + 140) : cw(p.text, p.size));
      items.push(item({ id: p.id, kind: p.kind, x: area.x + (area.w - w) / 2, y, w, h: p.h, lines: [p.text], size: p.size, center: true, cue: p.cue || null }));
    }
    y += p.h + 36;
  }
  if (scene.tag) {
    const t = items.find(i => i.id === 'title'), w = cw(scene.tag, FONT.label) + 20;
    const x = Math.min(t.x + t.w + 20, area.x + area.w - w);
    items.push(item({ id: 'tag', kind: 'tag', x, y: t.y - 10, w, h: 64, lines: [scene.tag], size: FONT.label, cue: scene.tagCue || null }));
  }
}

export function layoutScene(scene, { dims = {}, root = '.', mascot: wantMascot = false, logoInfo = {} } = {}) {
  const items = [];
  const area = withHeader(scene, { ...SAFE }, items);
  let extra = {}, edges = [];
  switch (scene.type) {
    case 'flow': edges = flow(scene, area, items); break;
    case 'shot': shots(scene, area, items, dims); break;
    case 'stat': stat(scene, area, items); break;
    case 'timeline': extra = timeline(scene, area, items); break;
    case 'iconrow': edges = iconrow(scene, area, items); break;
    case 'compare': compare(scene, area, items); break;
    case 'title': title(scene, area, items); break;
    default: throw new LayoutError(`unknown scene type "${scene.type}"`);
  }

  // resolve icons to path data so plan.json is self-contained (unknown icon -> iconData:null -> lint error)
  for (const it of items) if (it.icon) it.iconData = loadIcon(it.icon, root);

  for (const it of items) if (it.logo) it.logoDark = !!logoInfo[it.logo]?.dark;     // dark logos get a light plate so they stay readable on the dark canvas

  // Mascot gets a RESERVED slot that provably does not overlap anything.
  const hit = (a, b, g) => a.x < b.x + b.w + g && a.x + a.w > b.x - g && a.y < b.y + b.h + g && a.y + a.h > b.y - g;
  const edgeBox = e => ({ x: Math.min(e.p0[0], e.p1[0]), y: Math.min(e.p0[1], e.p1[1]), w: Math.abs(e.p1[0] - e.p0[0]), h: Math.abs(e.p1[1] - e.p0[1]) });
  const cands = [
    { x: SAFE.x + SAFE.w - MASCOT.w, y: SAFE.y + SAFE.h - MASCOT.h },
    { x: SAFE.x, y: SAFE.y + SAFE.h - MASCOT.h },
    { x: SAFE.x + SAFE.w - MASCOT.w, y: SAFE.y },
    { x: SAFE.x, y: SAFE.y },
  ].map(c => ({ ...c, w: MASCOT.w, h: MASCOT.h }));
  const mascot = !wantMascot ? null : cands.find(m => !items.some(it => hit(m, it, RULES.minGap)) && !edges.some(e => hit(m, edgeBox(e), 0))) || null;
  return { items, edges, mascot, ...extra };
}
