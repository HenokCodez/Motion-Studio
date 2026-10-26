// Usage: node scripts/screenshot.mjs https://example.com public/raw/site.png [width=1440] [height=900]
// Needs: npm i -D playwright && npx playwright install chromium
import {chromium} from 'playwright';
const [url, out, w = '1440', h = '900'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({viewport: {width: +w, height: +h}, deviceScaleFactor: 2});
await p.goto(url, {waitUntil: 'networkidle', timeout: 45000});
for (const t of ['Accept all', 'Accept', 'I agree', 'Got it', 'Close']) {
  try { await p.getByRole('button', {name: t}).first().click({timeout: 800}); break; } catch {}
}
await p.waitForTimeout(1200);
await p.screenshot({path: out});
await b.close();
console.log('saved', out);
