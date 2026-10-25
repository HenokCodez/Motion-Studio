import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const kitRoot = path.resolve(dir, '..');
process.chdir(kitRoot);

const targetScript = process.argv[2];
if (!targetScript) {
  console.error('Usage: node run.mjs <script-path> [args...]');
  process.exit(1);
}

const targetPath = path.resolve(kitRoot, targetScript);
const forwardedArgs = process.argv.slice(3);
process.argv = [process.argv[0], targetPath, ...forwardedArgs];

await import(pathToFileURL(targetPath).href);
