// A logo whose visible pixels are mostly dark (GitHub, Notion, Ps/Pr/Ae tiles) disappears on the dark canvas.
// Those get a light plate behind them. sharp rasterises both SVG and PNG.
import fs from 'node:fs';
import path from 'node:path';

export async function logoDarkness(file, sharp) {
  const { data } = await sharp(file, { density: 144 }).resize(96, 96, { fit: 'inside' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let sum = 0, cnt = 0;
  for (let i = 0; i < data.length; i += 4) if (data[i + 3] > 80) { sum += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255; cnt++; }
  const lum = cnt ? sum / cnt : null;
  return { dark: lum !== null && lum < 0.38, lum: lum === null ? null : +lum.toFixed(2) };
}

export async function collectLogoInfo(names, root, sharp) {
  const info = {};
  for (const name of names) {
    const f = ['.svg', '.png'].map(e => path.join(root, 'assets', 'logos', name + e)).find(fs.existsSync);
    if (!f || !sharp) continue;
    try { info[name] = await logoDarkness(f, sharp); } catch { /* unreadable: lint reports it */ }
  }
  return info;
}
