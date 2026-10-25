#!/usr/bin/env node
// Collects every logo + screenshot that beats.json references. NEVER fakes one.
//   logos : simple-icons package (brand-accurate SVGs). Anything it lacks is listed for you to drop in manually.
//   shots : a scene shot with a "url" (and optional "selector") is captured with Playwright at 2x.
//           highlights written as {text:"..."} are located ON THE LIVE PAGE and their pixel box is saved next to the
//           screenshot (<asset>.boxes.json), so highlights land on the right words instead of guessed coordinates.
// NOTE: written for your machine (needs network). Not exercised in the sandbox this kit was authored in.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const beats = JSON.parse(fs.readFileSync(process.argv[2] || 'beats.json', 'utf8'));
const logos = new Set(), shots = [];
const walk = (o) => {
  if (!o || typeof o !== 'object') return;
  for (const [k, v] of Object.entries(o)) {
    if ((k === 'logo' || k === 'titleLogo' || k === 'labelLogo') && typeof v === 'string') logos.add(v);
    else if (k === 'shots' && Array.isArray(v)) v.forEach(s => shots.push(s));
    walk(v);
  }
};
walk(beats);

const have = (n) => ['.svg', '.png'].some(e => fs.existsSync(`assets/logos/${n}${e}`));
const missing = [];

// ---- logos ----
let si = null; try { si = await import('simple-icons'); } catch { console.warn('simple-icons not installed (npm i). Skipping auto-logos.'); }
fs.mkdirSync('assets/logos', { recursive: true });
for (const name of logos) {
  if (have(name)) continue;
  const icon = si && Object.values(si).find(i => i && i.slug === name);
  if (!icon) { missing.push(`logo:${name}`); continue; }
  const lum = (h) => { const n = parseInt(h, 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
  const color = lum(icon.hex) < 0.35 ? '#EDEDED' : `#${icon.hex}`;        // dark brand colors are invisible on #111
  fs.writeFileSync(`assets/logos/${name}.svg`, icon.svg.replace('<svg ', `<svg fill="${color}" `));
  console.log(`logo  ${name}  (simple-icons)`);
}

// ---- screenshots (+ measured positions of every highlight text, so highlights are never guessed) ----
const needs = (s) => s.url && (!fs.existsSync(s.asset) || (s.highlights || []).some(h => h.text) && !fs.existsSync(s.asset + '.boxes.json'));
const todo = shots.filter(needs);
if (todo.length) {
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  for (const s of todo) {
    const phone = s.frame === 'phone';
    const ctx = await b.newContext({ viewport: phone ? { width: 430, height: 932 } : { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: 'dark', isMobile: phone, hasTouch: phone });
    try {
      const pg = await ctx.newPage(); await pg.goto(s.url, { waitUntil: 'networkidle', timeout: 45000 });
      fs.mkdirSync(path.dirname(s.asset), { recursive: true });
      const target = s.selector ? pg.locator(s.selector).first() : null;
      const origin = target ? await target.boundingBox() : { x: 0, y: 0, ...pg.viewportSize() };
      await (target ? target.screenshot({ path: s.asset }) : pg.screenshot({ path: s.asset }));
      const boxes = {};
      for (const h of (s.highlights || []).filter(h => h.text)) {
        // measure the EXACT words (DOM Range over the text), not the whole block element that contains them
        const bb = await pg.evaluate((needle) => {
          const lower = needle.toLowerCase(), walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          for (let n = walker.nextNode(); n; n = walker.nextNode()) {
            const i = n.nodeValue.toLowerCase().indexOf(lower);
            if (i < 0) continue;
            const el = n.parentElement; if (!el || getComputedStyle(el).visibility === 'hidden' || el.offsetParent === null && getComputedStyle(el).position !== 'fixed') continue;
            const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + needle.length);
            const b = r.getBoundingClientRect(); if (b.width < 2 || b.height < 2) continue;
            return { x: b.x, y: b.y, width: b.width, height: b.height };
          }
          return null;
        }, h.text).catch(() => null);
        if (!bb) { missing.push(`highlight:"${h.text}" not found on ${s.url}`); continue; }
        const fr = { x: (bb.x - origin.x) / origin.width, y: (bb.y - origin.y) / origin.height, w: bb.width / origin.width, h: bb.height / origin.height };
        if (fr.x < 0 || fr.y < 0 || fr.x + fr.w > 1.001 || fr.y + fr.h > 1.001) { missing.push(`highlight:"${h.text}" is outside the captured area of ${s.asset} (add a "selector" or pick visible text)`); continue; }
        boxes[h.text] = fr;
      }
      fs.writeFileSync(s.asset + '.boxes.json', JSON.stringify({ size: { w: Math.round(origin.width * 2), h: Math.round(origin.height * 2) }, boxes }, null, 1));
      console.log(`shot  ${s.asset}  <- ${s.url}  (${Object.keys(boxes).length} highlight box(es) measured)`);
      await pg.close();
    } catch (e) { missing.push(`shot:${s.asset} (${e.message.split('\n')[0]})`); }
    await ctx.close();
  }
  await b.close();
}
for (const s of shots) if (!fs.existsSync(s.asset) && !todo.includes(s)) missing.push(`shot:${s.asset} (no "url" given, supply the file)`);

if (missing.length) {
  console.log('\nMISSING (supply these by hand, the build will fail until they exist):');
  [...new Set(missing)].forEach(m => console.log('  -', m));
  process.exit(1);
}
console.log('\nall assets present');
