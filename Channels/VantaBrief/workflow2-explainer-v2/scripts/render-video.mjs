// node scripts/render-video.mjs [out.mp4] [startSec endSec]   Renders composition "Video" from scene-plan.json (audio = plan.audio). Needs Chromium + ffmpeg (bundled by Remotion).
import {bundle} from '@remotion/bundler'; import {renderMedia, selectComposition} from '@remotion/renderer'; import fs from 'fs'; import path from 'path';
const exe = process.env.CHROME || undefined; const out = process.argv[2] || 'out/final.mp4'; const a = process.argv[3], b = process.argv[4];
const plan = JSON.parse(fs.readFileSync(process.env.PLAN || 'scene-plan.json'));
console.log('Bundling Remotion project...');
const serveUrl = await bundle({entryPoint: path.resolve('components/Root.tsx'), publicDir: path.resolve('assets')});
console.log('Selecting composition "Video"...');
const comp = await selectComposition({serveUrl, id: 'Video', inputProps: {plan}, browserExecutable: exe, chromiumOptions: {args: ['--no-sandbox']}});
fs.mkdirSync(path.dirname(out), {recursive: true});

const totalFrames = a !== undefined ? (Math.round(+b * 30) - Math.round(+a * 30)) : comp.durationInFrames;
console.log(`Starting render: ${totalFrames} frames @ 30fps (${(totalFrames / 30).toFixed(1)}s) -> ${out}`);

let lastLoggedPercent = -1;
let startTime = Date.now();

await renderMedia({
  composition: comp,
  serveUrl,
  codec: 'h264',
  outputLocation: out,
  inputProps: {plan},
  browserExecutable: exe,
  concurrency: 6,
  chromiumOptions: {
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-background-networking',
      '--disable-background-timer-throttling'
    ]
  },
  frameRange: a !== undefined ? [Math.round(+a * 30), Math.round(+b * 30) - 1] : undefined,
  onProgress: p => {
    const percent = Math.floor(p.progress * 100);
    const rendered = p.renderedFrames ?? Math.round(p.progress * totalFrames);
    if (percent !== lastLoggedPercent || rendered % 150 === 0 || p.progress === 1) {
      lastLoggedPercent = percent;
      const elapsed = (Date.now() - startTime) / 1000;
      const fps = elapsed > 0 ? (rendered / elapsed).toFixed(1) : '0.0';
      const eta = elapsed > 0 && p.progress > 0.01 ? Math.round((elapsed / p.progress) - elapsed) : '--';
      process.stdout.write(`\r[${percent.toString().padStart(3, ' ')}%] Frame ${rendered}/${totalFrames} | ${fps} fps | ETA: ${eta}s `);
    }
  }
});
console.log('\nRender completed successfully:', out);
