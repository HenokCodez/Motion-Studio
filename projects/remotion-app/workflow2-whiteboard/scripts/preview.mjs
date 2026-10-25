#!/usr/bin/env node
// plan.json -> previews/<scene>.png (final state) + <scene>_cam.png (deepest zoom, if any)
// ALSO a render-based check: real fonts, real DOM. Text that spills outside its box FAILS (exit 1).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { COLOR, CANVAS, SAFE } from '../src/core/tokens.mjs';
import { loadFontConfig, fontFaceCss } from '../src/core/fonts.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const plan = JSON.parse(fs.readFileSync('plan.json', 'utf8'));
const fonts = loadFontConfig('.');
const HAND = fonts.hand.stack, SANS = fonts.sans.stack, MONO = fonts.mono.stack;
const exists = p => fs.existsSync(p);
const url = p => pathToFileURL(path.resolve(p)).href;

const iconSvg = (it, size, color) => it.iconData
  ? `<svg viewBox="0 0 ${it.iconData.vb} ${it.iconData.vb}" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex:none">${it.iconData.paths.map(d => `<path d="${d}"/>`).join('')}</svg>`
  : `<div style="width:${size}px;height:${size}px;border:3px dashed #f33;color:#f33;font:20px monospace">?</div>`;

const logoHtml = (name, size, dark = false) => {
  for (const e of ['.svg', '.png']) { const f = `assets/logos/${name}${e}`; if (exists(f)) return dark ? `<span style="flex:none;width:${size}px;height:${size}px;background:#EDEDED;border-radius:${Math.round(size * 0.22)}px;display:inline-flex;align-items:center;justify-content:center"><img src="${url(f)}" style="width:${size - 12}px;height:${size - 12}px;object-fit:contain"></span>` : `<img src="${url(f)}" style="width:${size}px;height:${size}px;object-fit:contain;flex:none">`; }
  return `<div style="flex:none;width:${size}px;height:${size}px;border:3px dashed ${COLOR.accent};border-radius:50%;display:flex;align-items:center;justify-content:center;font:20px monospace;color:${COLOR.accent}">${name.slice(0, 4)}</div>`;
};

function frameHtml(it, inner) {
  const ins = it.inset || { t: 0, r: 0, b: 0, l: 0 };
  const stroke = `border:3px solid ${COLOR.dim}`;
  const img = `<div style="position:absolute;left:${ins.l}px;top:${ins.t}px;right:${ins.r}px;bottom:${ins.b}px;overflow:hidden;background:#1d1d1d">${inner}</div>`;
  if (it.frame === 'browser') return `<div style="${stroke};border-radius:18px;position:absolute;inset:0;overflow:hidden;background:#161616"><div style="height:${ins.t}px;border-bottom:3px solid ${COLOR.dim};display:flex;align-items:center;gap:10px;padding:0 20px"><span style="color:#ff5f56;font-size:22px">●</span><span style="color:#ffbd2e;font-size:22px">●</span><span style="color:#27c93f;font-size:22px">●</span><div style="margin-left:18px;flex:1;height:30px;border:2px solid #444;border-radius:16px"></div></div>${img}</div>`;
  if (it.frame === 'laptop') return `<div style="position:absolute;inset:0"><div style="position:absolute;left:0;right:0;top:0;bottom:${ins.b - 10}px;${stroke};border-radius:22px;background:#161616"></div>${img}<div style="position:absolute;left:-30px;right:-30px;bottom:0;height:${ins.b - 28}px;${stroke};border-radius:0 0 40px 40px;background:#161616"></div></div>`;
  if (it.frame === 'phone') return `<div style="position:absolute;inset:0;${stroke};border-radius:56px;background:#161616"><div style="position:absolute;left:50%;top:14px;width:90px;height:14px;margin-left:-45px;border-radius:8px;background:${COLOR.dim}"></div>${img}</div>`;
  return `<div style="position:absolute;inset:0;border-radius:18px;overflow:hidden;border:2px solid #333">${inner}</div>`;
}

function sceneHtml(sc, cam) {
  const els = sc.items.map(it => {
    const base = `position:absolute;left:${it.x}px;top:${it.y}px;width:${it.w}px;height:${it.h}px;box-sizing:border-box;`;
    const f = `font-family:${HAND};font-size:${it.size || 40}px;line-height:1.25;color:${COLOR.ink};`;
    const lines = (it.lines || []).map(l => `<div>${l}</div>`).join('');
    const sub = (it.subLines || []).map(l => `<div style="font-size:34px;color:${COLOR.dim}">${l}</div>`).join('');
    const logo = it.logo ? `<span style="margin-right:20px;display:inline-flex">${logoHtml(it.logo, it.kind === 'header' || it.kind === 'label' ? it.h - 8 : Math.round(it.size * 1.5), it.logoDark)}</span>` : '';
    const ic = it.icon ? iconSvg(it, it.iconSize, it.emphasis ? COLOR.accent : COLOR.ink) : '';
    const box = it.emphasis ? `border:3px solid ${COLOR.accent};background:${COLOR.rust}` : `border:3px solid ${COLOR.dim};background:${COLOR.panel}`;
    const chk = (inner) => `<div class="inner" style="display:inline-block;max-width:100%">${inner}</div>`;
    switch (it.kind) {
      case 'shot': {
        const src = exists(it.asset) ? `<img src="${url(it.asset)}" style="width:100%;height:100%;object-fit:cover">` : `<div style="color:#777;font:30px monospace;padding:20px">MISSING SCREENSHOT<br>${it.asset}</div>`;
        return `<div style="${base}box-shadow:0 20px 60px #0008">${frameHtml(it, src)}</div>`;
      }
      case 'hero': return `<div style="${base}">${iconSvg(it, it.iconSize, COLOR.accent)}</div>`;
      case 'mark': return `<div style="${base}background:${COLOR.accent}55;border:4px solid ${COLOR.accent};border-radius:8px"></div>`;
      case 'bigtitle': return `<div data-box style="${base}${f}font-family:${SANS};font-weight:800;text-align:center;line-height:1;white-space:nowrap">${chk(lines)}</div>`;
      case 'stat': return `<div data-box style="${base}${f}color:${COLOR.accent};font-family:${SANS};font-weight:800;text-align:center;line-height:1;white-space:nowrap">${chk(lines)}</div>`;
      case 'terminal': return `<div data-box style="${base}background:#1a1a1a;border:2px solid #333;border-radius:14px;padding:22px 30px;font-family:${MONO};font-size:${it.size}px;color:${COLOR.ink}">${chk(`<div style="color:#ff5f56;font-size:20px">● <span style="color:#ffbd2e">●</span> <span style="color:#27c93f">●</span></div>$ ${it.lines[0]}`)}</div>`;
      case 'tag': return `<div data-box style="${base}${f}color:${COLOR.accent};transform:rotate(-4deg);white-space:nowrap">${chk(lines)}</div>`;
      case 'text': case 'caption': case 'date': return `<div data-box style="${base}${f}${it.center ? 'text-align:center;' : ''}white-space:nowrap">${chk(lines)}</div>`;
      case 'header': case 'label': return `<div data-box style="${base}${f}display:flex;align-items:center;white-space:nowrap">${chk(`<span style="display:inline-flex;align-items:center">${logo}${it.lines[0]}</span>`)}</div>`;
      case 'chip': return `<div data-box style="${base}${f}${box};background:${COLOR.rust};border:3px solid ${COLOR.ink};border-radius:40px;display:flex;align-items:center;justify-content:center;white-space:nowrap">${chk(lines)}</div>`;
      case 'panel': {
        const [h, ...rest] = it.lines;
        return `<div data-box style="${base}${f}padding:30px 36px;${box};border-radius:22px;overflow:visible">${chk(`<div style="display:flex;align-items:center;gap:24px;font-size:${it.size + 8}px;margin-bottom:14px;color:${it.emphasis ? COLOR.accent : COLOR.ink}">${it.icon ? ic : ''}${logo}<span>${h}</span></div>${rest.map(r => `<div>• ${r}</div>`).join('')}`)}</div>`;
      }
      case 'icard': return `<div data-box style="${base}${f}padding:30px;${box};border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:14px">${chk(`<div style="display:flex;flex-direction:column;align-items:center;gap:14px">${ic}<div>${lines}</div>${sub}</div>`)}</div>`;
      default: { // node / bubble: icon on the left like a logo
        return `<div data-box style="${base}${f}padding:30px;${box};border-radius:${it.kind === 'bubble' ? 36 : 18}px;display:flex;flex-direction:column;justify-content:center;overflow:visible">${chk(`<div style="display:flex;align-items:center;gap:${it.icon ? 24 : 0}px">${it.icon ? ic : ''}${logo}<div>${lines}</div></div>${sub}`)}</div>`;
      }
    }
  }).join('');

  const edges = (sc.edges || []).map(e => {
    const [x0, y0] = e.p0, [x1, y1] = e.p1, mx = (x0 + x1) / 2;
    return `<path d="M${x0 + 6} ${y0} C ${mx} ${y0}, ${mx} ${y1}, ${x1 - 16} ${y1}" fill="none" stroke="${COLOR.dim}" stroke-width="4" stroke-linecap="round"/><path d="M${x1 - 34} ${y1 - 16} L${x1 - 8} ${y1} L${x1 - 34} ${y1 + 16}" fill="none" stroke="${COLOR.dim}" stroke-width="4" stroke-linecap="round"/>`;
  }).join('');
  const line = sc.timelineY ? `<line x1="${SAFE.x}" x2="${SAFE.x + SAFE.w}" y1="${sc.timelineY}" y2="${sc.timelineY}" stroke="${COLOR.dim}" stroke-width="4"/>${sc.xs.map(x => `<circle cx="${x}" cy="${sc.timelineY}" r="12" fill="${COLOR.accent}"/>`).join('')}` : '';
  const mascot = sc.mascot ? `<div style="position:absolute;left:${sc.mascot.x}px;top:${sc.mascot.y}px;width:${sc.mascot.w}px;height:${sc.mascot.h}px;border:3px dashed #555;border-radius:12px;color:#777;font:24px monospace;display:flex;align-items:center;justify-content:center;text-align:center">MASCOT<br>slot</div>` : '';
  const transform = cam ? `transform-origin:0 0;transform:translate(${CANVAS.w / 2 - cam.cx * cam.s}px,${CANVAS.h / 2 - cam.cy * cam.s}px) scale(${cam.s});` : '';
  return `<html><head><style>${fontFaceCss(fonts)}</style></head><body style="margin:0;background:${COLOR.bg};width:${CANVAS.w}px;height:${CANVAS.h}px;overflow:hidden;position:relative;background-image:radial-gradient(${COLOR.dot} 2px,transparent 2px);background-size:32px 32px">
  <div style="position:absolute;inset:0;${transform}"><svg style="position:absolute;inset:0" width="${CANVAS.w}" height="${CANVAS.h}">${edges}${line}</svg>${els}${mascot}</div>
  <div style="position:absolute;left:${SAFE.x}px;top:${SAFE.y}px;width:${SAFE.w}px;height:${SAFE.h}px;border:1px dashed #2a2a2a;pointer-events:none"></div></body></html>`;
}

fs.rmSync('previews', { recursive: true, force: true });
fs.mkdirSync('previews', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: CANVAS.w, height: CANVAS.h } });
const problems = [];
if (!fonts.hand.found) console.log(`note: hand font "${fonts.hand.family}" not found (${fonts.hand.stack}). Overflow check is only trustworthy with the real font. Set font.config.json.`);
for (const sc of plan.scenes) {
  await page.setContent(sceneHtml(sc, null));
  await page.evaluate(() => document.fonts.ready);
  // render-based overflow check: the text actually drawn must sit inside its box
  const bad = await page.evaluate(() => [...document.querySelectorAll('[data-box]')].flatMap(el => {
    const b = el.getBoundingClientRect(), i = el.querySelector('.inner')?.getBoundingClientRect();
    if (!i) return [];
    const tag = el.style.transform.includes('rotate');       // rotated tags: compare unrotated size only
    const over = tag ? 0 : Math.max(i.right - b.right, i.bottom - b.bottom, b.left - i.left, b.top - i.top);
    return over > 3 ? [{ text: el.innerText.trim().slice(0, 40), over: Math.round(over) }] : [];
  }));
  bad.forEach(b => problems.push(`[${sc.id}] text spills ${b.over}px outside its box: "${b.text}"`));
  await page.screenshot({ path: `previews/${sc.id}.png` });
  const deepest = [...sc.camera].sort((a, b) => b.s - a.s)[0];
  if (deepest.s > 1.05) { await page.setContent(sceneHtml(sc, deepest)); await page.evaluate(() => document.fonts.ready); await page.screenshot({ path: `previews/${sc.id}_cam.png` }); }
}
await browser.close();
console.log(`wrote ${plan.scenes.length} previews to ./previews`);
if (problems.length) { problems.forEach(p => console.log('  OVERFLOW', p)); console.error(`\n${problems.length} overflow problem(s). Shorten the text or split the scene.`); process.exit(1); }
console.log('overflow check passed (rendered text fits every box)');
