// Shared by preview + font measurement so layout is validated against the REAL fonts.
// font.config.json points at your .woff2 files (e.g. the studio's public/fonts/virgil.woff2).
// For experiments, W2_HAND / W2_SANS / W2_MONO env vars override a family name.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function loadFontConfig(root = '.') {
  const f = path.join(root, 'font.config.json');
  const cfg = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
  const out = {};
  for (const [k, env] of [['hand', 'W2_HAND'], ['sans', 'W2_SANS'], ['mono', 'W2_MONO']]) {
    const c = cfg[k] || {};
    const file = c.file && fs.existsSync(path.join(root, c.file)) ? path.resolve(root, c.file) : null;
    const family = process.env[env] || c.family || k;
    out[k] = { family, file, weight: c.weight || 400, stack: `'${family}',${c.fallback || 'sans-serif'}`, found: !!file || !!process.env[env] };
  }
  return out;
}
export const fontFaceCss = (fonts) => Object.values(fonts).filter(f => f.file)
  .map(f => {
    try {
      const data = fs.readFileSync(f.file).toString('base64');
      return `@font-face{font-family:'${f.family}';src:url('data:font/woff2;base64,${data}');font-weight:${f.weight};}`;
    } catch {
      return `@font-face{font-family:'${f.family}';src:url('${pathToFileURL(f.file).href}');font-weight:${f.weight};}`;
    }
  }).join('\n');
