import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'fs';
import path from 'path';

const exe = process.env.CHROME || undefined;
const plan = JSON.parse(fs.readFileSync('scene-plan.json'));
const serveUrl = await bundle({entryPoint: path.resolve('components/Root.tsx'), publicDir: path.resolve('assets')});
const comp = await selectComposition({serveUrl, id: 'Video', inputProps: {plan}, browserExecutable: exe, chromiumOptions: {args: ['--no-sandbox']}});

fs.mkdirSync('out/stills', {recursive: true});

const scenes = plan.scenes;
const frames = [];
for (const sc of scenes) {
  const midSec = (sc.start + sc.end) / 2.0;
  const f = Math.round(midSec * 30);
  frames.push({id: sc.id, f});
}

console.log(`Rendering ${frames.length} stills (1 per scene)...`);

for (const {id, f} of frames) {
  const outPath = path.resolve(`out/stills/${id}_f${f}.png`);
  await renderStill({
    composition: comp,
    serveUrl,
    frame: f,
    inputProps: {plan},
    output: outPath,
    browserExecutable: exe,
    chromiumOptions: {args: ['--no-sandbox']}
  });
  process.stdout.write(`.`);
}
console.log('\nAll stills rendered successfully!');

