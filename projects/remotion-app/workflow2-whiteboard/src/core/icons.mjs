// Icons = the kit's diagram vocabulary (desktop, phone, drone, server, cloud ...).
// Resolution order:  assets/icons/<name>.svg  ->  @iconify-json/tabler (if installed)  -> not found (lint error)
// Every icon is converted to plain SVG path strings so the renderer can hand-draw them with rough.js.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let tabler = null;
try { tabler = require('@iconify-json/tabler/icons.json'); } catch { /* optional */ }

const attrsOf = (s) => Object.fromEntries([...s.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)].map(m => [m[1], m[2]]));
const n = (v, d = 0) => (v === undefined || v === '' ? d : parseFloat(v));
const f = (x) => +x.toFixed(3);

function shapeToPath(tag, a) {
  switch (tag) {
    case 'path': return a.d || null;
    case 'circle': { const cx = n(a.cx), cy = n(a.cy), r = n(a.r); return `M${f(cx - r)} ${f(cy)}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0`; }
    case 'ellipse': { const cx = n(a.cx), cy = n(a.cy), rx = n(a.rx), ry = n(a.ry); return `M${f(cx - rx)} ${f(cy)}a${rx} ${ry} 0 1 0 ${f(2 * rx)} 0a${rx} ${ry} 0 1 0 ${f(-2 * rx)} 0`; }
    case 'rect': {
      const x = n(a.x), y = n(a.y), w = n(a.width), h = n(a.height), rx = Math.min(n(a.rx, n(a.ry)), w / 2), ry = Math.min(n(a.ry, rx), h / 2);
      if (!rx && !ry) return `M${x} ${y}h${w}v${h}h${-w}z`;
      return `M${f(x + rx)} ${y}h${f(w - 2 * rx)}a${rx} ${ry} 0 0 1 ${rx} ${ry}v${f(h - 2 * ry)}a${rx} ${ry} 0 0 1 ${-rx} ${ry}h${f(-(w - 2 * rx))}a${rx} ${ry} 0 0 1 ${-rx} ${-ry}v${f(-(h - 2 * ry))}a${rx} ${ry} 0 0 1 ${rx} ${-ry}z`;
    }
    case 'line': return `M${n(a.x1)} ${n(a.y1)}L${n(a.x2)} ${n(a.y2)}`;
    case 'polyline': case 'polygon': {
      const pts = (a.points || '').trim().split(/[\s,]+/).map(Number);
      if (pts.length < 4) return null;
      let d = `M${pts[0]} ${pts[1]}`; for (let i = 2; i < pts.length; i += 2) d += `L${pts[i]} ${pts[i + 1]}`;
      return tag === 'polygon' ? d + 'z' : d;
    }
    default: return null;
  }
}

export function parseSvg(svg) {
  const vb = (svg.match(/viewBox="([^"]+)"/)?.[1] || '0 0 24 24').trim().split(/\s+/).map(Number);
  const paths = [];
  for (const m of svg.matchAll(/<(path|circle|ellipse|rect|line|polyline|polygon)\b([^>]*?)\/?>/g)) {
    const a = attrsOf(m[2]);
    if (a.stroke === 'none' && (!a.fill || a.fill === 'none')) continue;       // Tabler's invisible 24x24 bounding box
    const d = shapeToPath(m[1], a);
    if (d) paths.push(d);
  }
  return { vb: vb[2] || 24, paths };
}

// Plain-English synonyms -> real icon names, so "phone" finds device-mobile.
export const ALIASES = {
  phone: 'device-mobile', mobile: 'device-mobile', smartphone: 'device-mobile', iphone: 'device-mobile', android: 'device-mobile',
  desktop: 'device-desktop', computer: 'device-desktop', pc: 'device-desktop', monitor: 'device-desktop', workstation: 'device-desktop',
  laptop: 'device-laptop', notebook: 'device-laptop', tablet: 'device-tablet', ipad: 'device-tablet', tv: 'device-tv', television: 'device-tv', watch: 'device-watch', smartwatch: 'device-watch',
  drone: 'drone', quadcopter: 'drone', uav: 'drone', robot: 'robot', bot: 'robot', agent: 'robot', ai: 'brain', llm: 'brain', model: 'brain', neural: 'brain',
  money: 'coin', cash: 'cash', price: 'currency-dollar', dollar: 'currency-dollar', cost: 'currency-dollar', subscription: 'receipt', payment: 'credit-card',
  security: 'shield', safe: 'shield', private: 'lock', privacy: 'lock', open: 'lock-open', web: 'world', internet: 'world', globe: 'world', online: 'wifi',
  chat: 'message', email: 'mail', speed: 'bolt', fast: 'bolt', launch: 'rocket', growth: 'chart-line', stats: 'chart-bar', idea: 'bulb', github: 'brand-github', repo: 'git-branch',
  storage: 'database', db: 'database', backend: 'server', cloud: 'cloud', chip: 'cpu', gpu: 'cpu', hardware: 'cpu', people: 'users', team: 'users', person: 'user',
  video: 'video', film: 'movie', photo: 'photo', image: 'photo', design: 'palette', art: 'palette', build: 'tool', tools: 'tool', bug: 'bug', terminal: 'terminal-2', cli: 'terminal-2',
};

const cache = new Map();
export function loadIcon(name, root = '.') {
  const key = root + '|' + name;
  name = String(name).toLowerCase();
  if (cache.has(key)) return cache.get(key);
  let out = null;
  const file = path.join(root, 'assets', 'icons', `${name}.svg`);
  if (fs.existsSync(file)) out = parseSvg(fs.readFileSync(file, 'utf8'));
  else if (tabler?.icons?.[name]) out = parseSvg(`<svg viewBox="0 0 ${tabler.width || 24} ${tabler.height || 24}">${tabler.icons[name].body}</svg>`);
  if (!out && ALIASES[name] && ALIASES[name] !== name) out = loadIcon(ALIASES[name], root);
  cache.set(key, out);
  return out;
}

export function listIcons(root = '.') {
  const local = fs.existsSync(path.join(root, 'assets', 'icons'))
    ? fs.readdirSync(path.join(root, 'assets', 'icons')).filter(f => f.endsWith('.svg')).map(f => f.slice(0, -4)) : [];
  return [...new Set([...local, ...Object.keys(tabler?.icons || {})])].sort();
}

export const suggestIcons = (q, root = '.') => {
  const t = String(q).toLowerCase();
  const hits = listIcons(root).filter(n => n.includes(t) || t.includes(n));
  return [...new Set([ALIASES[t], ...hits].filter(Boolean))].slice(0, 8);
};
