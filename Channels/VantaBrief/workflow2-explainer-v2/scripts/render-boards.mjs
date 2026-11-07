// node scripts/render-boards.mjs [A01 A02 ...]  -> out/<ID>/f<frame>.png (6 keyframes). Then python3 scripts/make-board.py
import {bundle} from '@remotion/bundler'; import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'fs'; import path from 'path';
const exe = process.env.CHROME || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
const metaDir = 'components/animations/meta';
const ids = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(metaDir).map(f => f.replace('.json', '')).sort();
const serveUrl = await bundle({entryPoint: path.resolve('components/Root.tsx'), publicDir: path.resolve('assets')});
let failed = 0;
for (const id of ids) {
  const meta = JSON.parse(fs.readFileSync(`${metaDir}/${id}.json`));
  try {
    const comp = await selectComposition({serveUrl, id, browserExecutable: exe, chromiumOptions: {args: ['--no-sandbox']}});
    fs.mkdirSync(`out/${id}`, {recursive: true});
    for (const f of meta.keyframes) await renderStill({composition: comp, serveUrl, frame: f, output: `out/${id}/f${f}.png`, browserExecutable: exe, chromiumOptions: {args: ['--no-sandbox']}});
    console.log('rendered', id);
  } catch (e) { failed++; console.error('FAILED', id, String(e).slice(0, 300)); }
}
process.exit(failed ? 1 : 0);
