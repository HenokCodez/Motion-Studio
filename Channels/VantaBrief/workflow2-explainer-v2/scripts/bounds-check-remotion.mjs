// node scripts/bounds-check-remotion.mjs [IDs...]   DOM bounds check inside the real Remotion render.
// Stage logs every <text> box when inputProps.__bounds is set; we render each keyframe still and fail on: font-size < 24, visible text outside the safe frame (rest frames), text boxes overlapping each other.
import {bundle} from '@remotion/bundler'; import {renderStill, selectComposition} from '@remotion/renderer'; import fs from 'fs'; import path from 'path';
const exe = process.env.CHROME || undefined; const md = 'components/animations/meta';
const ids = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(md).map(f => f.replace('.json', '')).sort();
const S = {x0: 154, y0: 86, x1: 1766, y1: 994}; const serveUrl = await bundle({entryPoint: path.resolve('components/Root.tsx'), publicDir: path.resolve('assets')}); let bad = 0;
for (const id of ids) {
  const meta = JSON.parse(fs.readFileSync(`${md}/${id}.json`)); const sf = meta.strictFrom ?? (meta.entrance ? meta.duration * 0.4 : 0); const errs = [];
  const comp = await selectComposition({serveUrl, id, browserExecutable: exe, inputProps: {__bounds: true}, chromiumOptions: {args: ['--no-sandbox']}});
  for (const f of meta.keyframes) { let texts = null;
    await renderStill({composition: comp, serveUrl, frame: f, inputProps: {__bounds: true}, output: '/tmp/_b.png', browserExecutable: exe, chromiumOptions: {args: ['--no-sandbox']},
      onBrowserLog: l => { if (l.text.startsWith('__BOUNDS__')) texts = JSON.parse(l.text.slice(10)); }});
    if (!texts) { errs.push(`f${f}: no bounds log received`); continue; }
    const vis = texts.filter(t => t.o > 0.05 && t.x1 > t.x0);
    for (const t of vis) { if (t.fs < 24) errs.push(`f${f}: "${t.t}" font ${t.fs}px < 24`);
      if (f >= sf && (t.x0 < S.x0 - 2 || t.x1 > S.x1 + 2 || t.y0 < S.y0 - 2 || t.y1 > S.y1 + 2)) errs.push(`f${f}: "${t.t}" outside safe frame (${Math.round(t.x0)}-${Math.round(t.x1)}, ${Math.round(t.y0)}-${Math.round(t.y1)})`); }
    if (f >= sf) for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length; j++) { const a = vis[i], b = vis[j]; const ox = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0), oy = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
      if (ox > 6 && oy > 6) errs.push(`f${f}: text overlap "${a.t}" / "${b.t}"`); } }
  if (errs.length) { bad++; console.log('FAIL', id); [...new Set(errs)].slice(0, 6).forEach(e => console.log('   ', e)); } else console.log('PASS', id);
}
process.exit(bad ? 1 : 0);
