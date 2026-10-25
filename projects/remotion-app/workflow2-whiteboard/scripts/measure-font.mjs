#!/usr/bin/env node
// Measures the REAL width of every character in your fonts (per font.config.json) in a real browser and writes
// font-metrics.json. The layout solver then sizes boxes from true widths instead of a guess. Re-run when fonts change.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { loadFontConfig, fontFaceCss } from '../src/core/fonts.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');

const fonts = loadFontConfig('.');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(`<style>${fontFaceCss(fonts)}</style><body>x</body>`);
const out = {};
for (const [key, f] of Object.entries(fonts)) {
  const res = await page.evaluate(async ({ stack, weight, family, hasFile }) => {
    if (hasFile) await document.fonts.load(`${weight} 100px '${family}'`);
    await document.fonts.ready;
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `${weight} 100px ${stack}`;
    const chars = {}; let sum = 0, n = 0;
    for (let c = 32; c < 127; c++) { const ch = String.fromCharCode(c); chars[ch] = ctx.measureText(ch).width / 100; sum += chars[ch]; n++; }
    for (const ch of '’‘“”–—…•→×é') chars[ch] = ctx.measureText(ch).width / 100;
    // real strings (with kerning) vs summed char widths -> correction factor
    const samples = ['Software Goes Free', 'Open source suite', 'Photoshop Premiere', 'per year, every year', 'Zero Subscriptions', 'Paid software rents you'];
    const ratio = samples.map(s => (ctx.measureText(s).width / 100) / [...s].reduce((a, ch) => a + chars[ch], 0));
    return { chars, avg: sum / n, kern: ratio.reduce((a, b) => a + b, 0) / ratio.length, actualFont: ctx.font };
  }, { stack: f.stack, weight: f.weight, family: f.family, hasFile: !!f.file });
  out[key] = { ...res, family: f.family, fromFile: !!f.file };
  console.log(`${key.padEnd(5)} family "${f.family}"  ${f.file ? 'file loaded' : (f.found ? 'system font (env override)' : 'NOT FOUND, measured fallback stack')}  avg ${res.avg.toFixed(3)}em  kern x${res.kern.toFixed(3)}`);
}
await browser.close();
fs.writeFileSync('font-metrics.json', JSON.stringify(out));
console.log('wrote font-metrics.json');
