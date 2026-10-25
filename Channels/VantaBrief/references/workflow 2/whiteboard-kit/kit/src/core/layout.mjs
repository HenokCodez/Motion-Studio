import { SAFE, FONT, MASCOT, RULES } from './tokens.mjs';

export class LayoutError extends Error {}

// Conservative text-width model (handwriting ~0.5em/char, mono ~0.6em/char).
// Over-estimates slightly on purpose: a box that is a bit roomy beats text that clips.
export const cw = (s, size, mono = false, bold = false) => String(s).length * size * (mono ? 0.6 : bold ? 0.74 : 0.5);

export function wrap(text, size, maxW, mono = false) {
  const lines = []; let cur = '';
  for (const w of String(text).split(/\s+/)) {
    const t = cur ? cur + ' ' + w : w;
    if (!cur || cw(t, size, mono) <= maxW) cur = t; else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

function boxFor(label, { size = FONT.label, maxW = 600, logo = false, sub = '', pad = 30, mono = false, minW = 220 } = {}) {
  const logoW = logo ? 96 : 0;
  const lines = wrap(label, size, maxW - 2 * pad - logoW, mono);
  const tw = Math.max(...lines.map(l => cw(l, size, mono)));
  const subLines = sub ? wrap(sub, FONT.sub, maxW - 2 * pad) : [];
  const sw = subLines.length ? Math.max(...subLines.map(l => cw(l, FONT.sub))) : 0;
  const w = Math.ceil(Math.max(tw + logoW, sw) + 2 * pad);
  const h = Math.ceil(lines.length * size * 1.25 + (subLines.length ? subLines.length * FONT.sub * 1.25 + 10 : 0) + 2 * pad);
  return { w: Math.max(w, minW), h: Math.max(h, 104), lines, subLines, size };
}

const item = (o) => ({ cue: null, ...o });

// ---------- optional small scene title, top-left ----------
function withHeader(scene, area, items) {
  if (!scene.title || scene.type === 'title') return area;
  const lines = [scene.title];
  items.push(item({
    id: 'header', kind: 'header', x: area.x, y: area.y,
    w: cw(scene.title, FONT.header) + (scene.titleLogo ? 100 : 0), h: 70,
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
    const boxes = Object.fromEntries(nodes.map(n => [n.id, boxFor(n.label, { size, maxW, logo: !!n.logo, sub: n.sub })]));
    const colW = Array.from({ length: nCols }, (_, c) => Math.max(...nodes.filter(n => depth[n.id] === c).map(n => boxes[n.id].w)));
    const sumW = colW.reduce((a, b) => a + b, 0);
    const gapX = nCols > 1 ? (area.w - sumW) / (nCols - 1) : 0;
    const colH = Array.from({ length: nCols }, (_, c) => nodes.filter(n => depth[n.id] === c).reduce((a, n) => a + boxes[n.id].h + 64, -64));
    if ((nCols === 1 || gapX >= 110) && Math.max(...colH) <= area.h) { sized = { boxes, colW, gapX: Math.min(gapX, 260) }; break; }
  }
  if (!sized) throw new LayoutError(`flow too wide for ${nCols} columns even at ${FONT.labelFloor}px. Shorten labels or split the scene.`);
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
      size: b.size, logo: n.logo || null, emphasis: !!n.emphasis, cue: n.cue || null,
    }));
  }
  return edges.map(([a, b]) => ({
    from: a, to: b,
    p0: [placed[a].x + placed[a].w, placed[a].y + placed[a].h / 2],
    p1: [placed[b].x, placed[b].y + placed[b].h / 2],
  }));
}

// ---------- SHOT: 1-2 real screenshots, highlights given as fractions ----------
function shots(scene, area, items, dims) {
  const list = scene.shots;
  if (!list || list.length < 1 || list.length > 2) throw new LayoutError('shot scene needs 1 or 2 shots');
  const gap = 56, n = list.length;
  const capH = scene.caption ? 110 : 0;
  const lblH = list.some(s => s.label) ? 96 : 0;
  const slotW = (area.w - gap * (n - 1)) / n, slotH = area.h - capH - lblH;
  list.forEach((s, i) => {
    const d = dims[s.asset] || { w: 1600, h: 900, assumed: true };
    const k = Math.min(slotW / d.w, slotH / d.h, 1.25);
    const w = Math.round(d.w * k), h = Math.round(d.h * k);
    const x = Math.round(area.x + i * (slotW + gap) + (slotW - w) / 2);
    const y = Math.round(area.y + lblH + (slotH - h) / 2);
    if (s.label) items.push(item({
      id: `${s.id}-label`, kind: 'label', x, y: y - 84,
      w: Math.min(w, cw(s.label, FONT.label) + (s.labelLogo ? 100 : 0)), h: 64,
      lines: [s.label], size: FONT.label, logo: s.labelLogo || null, cue: s.labelCue || s.cue || null,
    }));
    items.push(item({ id: s.id, kind: 'shot', x, y, w, h, asset: s.asset, assumedDims: !!d.assumed, cue: s.cue || null }));
    (s.highlights || []).forEach((hl, j) => items.push(item({
      id: `${s.id}-hl${j}`, kind: 'mark', within: s.id,
      x: x + hl.x * w, y: y + hl.y * h, w: hl.w * w, h: hl.h * h, cue: hl.cue || null, zoomTarget: true,
    })));
  });
  if (scene.caption) items.push(item({
    id: 'caption', kind: 'caption', x: area.x, y: area.y + area.h - capH + 20, w: area.w, h: 70,
    lines: [scene.caption], size: FONT.label, cue: scene.captionCue || null, center: true,
  }));
}

// ---------- STAT ----------
function stat(scene, area, items) {
  const big = String(scene.value);
  if (cw(big, FONT.stat, false, true) > area.w) throw new LayoutError(`stat value "${big}" too wide`);
  const parts = [['value', big, FONT.stat, FONT.stat * 1.1], ['label', scene.label, FONT.statLabel, 80]];
  if (scene.note) parts.push(['note', scene.note, FONT.label, 64]);
  const H = parts.reduce((a, p) => a + p[3], 0) + 30 * (parts.length - 1);
  let y = area.y + (area.h - H) / 2;
  for (const [id, text, size, h] of parts) {
    const w = Math.min(area.w, cw(text, size, false, id === 'value'));
    items.push(item({
      id, kind: id === 'value' ? 'stat' : 'text', x: area.x + (area.w - w) / 2, y, w, h,
      lines: [text], size, center: true, emphasis: id === 'value',
      cue: scene[id + 'Cue'] || (id === 'value' ? scene.cue : null) || null,
      countTo: id === 'value' ? big : null,
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
      lines: b.lines, subLines: b.subLines, size: b.size, logo: p.logo || null, emphasis: !!p.emphasis, cue: p.cue || null,
    }));
    items.push(item({ id: `${p.id}-date`, kind: 'date', x: cx - 150, y: lineY + 40, w: 300, h: 64, lines: [p.date], size: FONT.label, center: true, cue: p.cue || null }));
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
      const lines = [s.title, ...(s.bullets || [])].flatMap((t, i) => wrap(t, i ? sz : sz + 8, W - 90));
      return Math.ceil(lines.length * sz * 1.3 + 110);
    });
    if (Math.max(...hs) <= area.h * 0.8) { size = sz; H = Math.max(...hs); break; }
  }
  if (!size) throw new LayoutError('compare panels do not fit even at 40px. Shorten bullets.');
  sides.forEach(([k, s], i) => items.push(item({
    id: `panel-${k}`, kind: 'panel', x: area.x + i * (W + gap), y: area.y + (area.h - H) / 2, w: W, h: H,
    lines: [s.title, ...(s.bullets || [])], size, emphasis: s.emphasis === true, logo: s.logo || null, cue: s.cue || null,
  })));
  items.push(item({ id: 'vs', kind: 'text', x: area.x + W + 10, y: area.y + area.h / 2 - 40, w: gap - 20, h: 80, lines: ['vs'], size: FONT.label, center: true, cue: scene.vsCue || null }));
}

// ---------- TITLE / WORDMARK ----------
function title(scene, area, items) {
  const parts = [{ id: 'title', size: FONT.title, text: scene.title, h: Math.round(FONT.title * 1.15), kind: 'bigtitle', cue: scene.cue }];
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

export function layoutScene(scene, dims = {}) {
  const items = [];
  const area = withHeader(scene, { ...SAFE }, items);
  let extra = {}, edges = [];
  switch (scene.type) {
    case 'flow': edges = flow(scene, area, items); break;
    case 'shot': shots(scene, area, items, dims); break;
    case 'stat': stat(scene, area, items); break;
    case 'timeline': extra = timeline(scene, area, items); break;
    case 'compare': compare(scene, area, items); break;
    case 'title': title(scene, area, items); break;
    default: throw new LayoutError(`unknown scene type "${scene.type}"`);
  }

  // Mascot gets a RESERVED slot that provably does not overlap anything.
  const hit = (a, b, g) => a.x < b.x + b.w + g && a.x + a.w > b.x - g && a.y < b.y + b.h + g && a.y + a.h > b.y - g;
  const edgeBox = e => ({ x: Math.min(e.p0[0], e.p1[0]), y: Math.min(e.p0[1], e.p1[1]), w: Math.abs(e.p1[0] - e.p0[0]), h: Math.abs(e.p1[1] - e.p0[1]) });
  const cands = [
    { x: SAFE.x + SAFE.w - MASCOT.w, y: SAFE.y + SAFE.h - MASCOT.h },
    { x: SAFE.x, y: SAFE.y + SAFE.h - MASCOT.h },
    { x: SAFE.x + SAFE.w - MASCOT.w, y: SAFE.y },
    { x: SAFE.x, y: SAFE.y },
  ].map(c => ({ ...c, w: MASCOT.w, h: MASCOT.h }));
  const mascot = cands.find(m => !items.some(it => hit(m, it, RULES.minGap)) && !edges.some(e => hit(m, edgeBox(e), 0))) || null;
  return { items, edges, mascot, ...extra };
}
