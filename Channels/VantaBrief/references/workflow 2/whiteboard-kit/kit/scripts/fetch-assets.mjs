#!/usr/bin/env node
// Collects every logo + screenshot that beats.json references. NEVER fakes one.
//   logos : simple-icons package (brand-accurate SVGs). Anything it lacks is listed for you to drop in manually.
//   shots : a scene shot with a "url" (and optional "selector") is captured with Playwright at 2x.
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

// ---- screenshots ----
const todo = shots.filter(s => s.url && !fs.existsSync(s.asset));
if (todo.length) {
  const { chromium } = require('playwright');
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: 'dark' });
  for (const s of todo) {
    try {
      const pg = await ctx.newPage(); await pg.goto(s.url, { waitUntil: 'networkidle', timeout: 45000 });
      fs.mkdirSync(path.dirname(s.asset), { recursive: true });
      await (s.selector ? pg.locator(s.selector).first().screenshot({ path: s.asset }) : pg.screenshot({ path: s.asset }));
      console.log(`shot  ${s.asset}  <- ${s.url}`); await pg.close();
    } catch (e) { missing.push(`shot:${s.asset} (${e.message.split('\n')[0]})`); }
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
