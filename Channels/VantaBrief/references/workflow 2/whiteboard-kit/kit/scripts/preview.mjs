#!/usr/bin/env node
// plan.json -> previews/<scene>.png (full layout) + <scene>_cam.png (deepest camera punch-in)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { COLOR, CANVAS, SAFE } from '../src/core/tokens.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const plan = JSON.parse(fs.readFileSync('plan.json', 'utf8'));
const FONTS = `'Excalifont','Virgil','Kalam','Caveat','Comic Sans MS',cursive`;
const exists = p => fs.existsSync(p);

const logoHtml = (name, size) => {
  for (const e of ['.svg', '.png']) {
    const f = `assets/logos/${name}${e}`;
    if (exists(f)) return `<img src="file://${path.resolve(f)}" style="width:${size}px;height:${size}px;object-fit:contain">`;
  }
  return `<div style="width:${size}px;height:${size}px;border:3px dashed ${COLOR.accent};border-radius:50%;display:flex;align-items:center;justify-content:center;font:20px monospace;color:${COLOR.accent}">${name.slice(0, 4)}</div>`;
};

function sceneHtml(sc, cam) {
  const els = sc.items.map(it => {
    const base = `position:absolute;left:${it.x}px;top:${it.y}px;width:${it.w}px;height:${it.h}px;box-sizing:border-box;`;
    const txt = (it.lines || []).map(l => `<div>${l}</div>`).join('');
    const sub = (it.subLines || []).map(l => `<div style="font-size:34px;color:${COLOR.dim}">${l}</div>`).join('');
    const logo = it.logo ? `<span style="margin-right:20px;display:inline-block;vertical-align:middle">${logoHtml(it.logo, 76)}</span>` : '';
    const f = `font-family:${FONTS};font-size:${it.size || 40}px;line-height:1.25;color:${COLOR.ink};`;
    switch (it.kind) {
      case 'shot': {
        const src = exists(it.asset) ? `<img src="file://${path.resolve(it.asset)}" style="width:100%;height:100%;object-fit:cover">` : `<div style="color:#777;font:30px monospace;padding:20px">MISSING SCREENSHOT<br>${it.asset}</div>`;
        return `<div style="${base}border-radius:18px;overflow:hidden;background:#1d1d1d;border:2px solid #333;box-shadow:0 20px 60px #0008">${src}</div>`;
      }
      case 'mark': return `<div style="${base}background:${COLOR.accent}55;border:4px solid ${COLOR.accent};border-radius:8px"></div>`;
      case 'bigtitle': return `<div style="${base}${f}font-family:Inter,Helvetica,Arial,sans-serif;font-weight:800;text-align:center;line-height:1">${txt}</div>`;
      case 'stat': return `<div style="${base}${f}color:${COLOR.accent};font-family:Inter,Helvetica,Arial,sans-serif;font-weight:800;text-align:center;line-height:1">${txt}</div>`;
      case 'terminal': return `<div style="${base}background:#1a1a1a;border:2px solid #333;border-radius:14px;padding:22px 30px;font-family:'JetBrains Mono',monospace;font-size:${it.size}px;color:${COLOR.ink}"><div style="color:#ff5f56;font-size:20px">● <span style="color:#ffbd2e">●</span> <span style="color:#27c93f">●</span></div>$ ${it.lines[0]}</div>`;
      case 'tag': return `<div style="${base}${f}color:${COLOR.accent};transform:rotate(-4deg)">${txt}</div>`;
      case 'text': case 'caption': case 'date':
        return `<div style="${base}${f}${it.center ? 'text-align:center;' : ''}${it.kind === 'caption' ? '' : ''}">${txt}</div>`;
      case 'header': return `<div style="${base}${f}">${logo}${txt.replace(/<\/?div>/g, '')}</div>`;
      case 'label': return `<div style="${base}${f}">${logo}${txt.replace(/<\/?div>/g, '')}</div>`;
      case 'chip': return `<div style="${base}border:3px solid ${COLOR.ink};border-radius:40px;${f}display:flex;align-items:center;justify-content:center;background:${COLOR.rust}">${txt}</div>`;
      case 'panel': {
        const [h, ...rest] = it.lines;
        return `<div style="${base}${f}padding:30px 36px;border:3px solid ${it.emphasis ? COLOR.accent : COLOR.dim};border-radius:22px;background:${it.emphasis ? COLOR.rust : COLOR.panel}"><div style="font-size:56px;margin-bottom:14px;color:${it.emphasis ? COLOR.accent : COLOR.ink}">${logo}${h}</div>${rest.map(r => `<div>• ${r}</div>`).join('')}</div>`;
      }
      default: // node / bubble
        return `<div style="${base}${f}padding:30px;border:3px solid ${it.emphasis ? COLOR.accent : COLOR.dim};border-radius:${it.kind === 'bubble' ? 36 : 18}px;background:${it.emphasis ? COLOR.rust : COLOR.panel};display:flex;flex-direction:column;justify-content:center"><div>${logo}${(it.lines || []).join('<br>')}</div>${sub}</div>`;
    }
  }).join('');

  const edges = (sc.edges || []).map(e => {
    const [x0, y0] = e.p0, [x1, y1] = e.p1, mx = (x0 + x1) / 2;
    return `<path d="M${x0 + 6} ${y0} C ${mx} ${y0}, ${mx} ${y1}, ${x1 - 16} ${y1}" fill="none" stroke="${COLOR.dim}" stroke-width="4" stroke-linecap="round"/><path d="M${x1 - 34} ${y1 - 16} L${x1 - 8} ${y1} L${x1 - 34} ${y1 + 16}" fill="none" stroke="${COLOR.dim}" stroke-width="4" stroke-linecap="round"/>`;
  }).join('');
  const line = sc.timelineY ? `<line x1="${SAFE.x}" x2="${SAFE.x + SAFE.w}" y1="${sc.timelineY}" y2="${sc.timelineY}" stroke="${COLOR.dim}" stroke-width="4"/>${sc.xs.map(x => `<circle cx="${x}" cy="${sc.timelineY}" r="12" fill="${COLOR.accent}"/>`).join('')}` : '';
  const mascot = sc.mascot ? `<div style="position:absolute;left:${sc.mascot.x}px;top:${sc.mascot.y}px;width:${sc.mascot.w}px;height:${sc.mascot.h}px;border:3px dashed #555;border-radius:12px;color:#777;font:24px monospace;display:flex;align-items:center;justify-content:center;text-align:center">MASCOT<br>slot</div>` : '';
  const transform = cam ? `transform-origin:0 0;transform:scale(${cam.s}) translate(${-(cam.cx - CANVAS.w / cam.s / 2)}px,${-(cam.cy - CANVAS.h / cam.s / 2)}px);` : '';
  return `<html><body style="margin:0;background:${COLOR.bg};width:${CANVAS.w}px;height:${CANVAS.h}px;overflow:hidden;position:relative;background-image:radial-gradient(${COLOR.dot} 2px,transparent 2px);background-size:32px 32px">
  <div style="position:absolute;inset:0;${transform}"><svg style="position:absolute;inset:0" width="${CANVAS.w}" height="${CANVAS.h}">${edges}${line}</svg>${els}${mascot}</div>
  <div style="position:absolute;left:${SAFE.x}px;top:${SAFE.y}px;width:${SAFE.w}px;height:${SAFE.h}px;border:1px dashed #2a2a2a;pointer-events:none"></div></body></html>`;
}

fs.mkdirSync('previews', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: CANVAS.w, height: CANVAS.h } });
for (const sc of plan.scenes) {
  await page.setContent(sceneHtml(sc, null));
  await page.screenshot({ path: `previews/${sc.id}.png` });
  const deepest = [...sc.camera].sort((a, b) => b.s - a.s)[0];
  if (deepest.s > 1.05) { await page.setContent(sceneHtml(sc, deepest)); await page.screenshot({ path: `previews/${sc.id}_cam.png` }); }
}
await browser.close();
console.log(`wrote ${plan.scenes.length} previews to ./previews`);
