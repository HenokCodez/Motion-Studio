#!/usr/bin/env node
// node scripts/find-icon.mjs drone phone server   -> icon names you can use in beats.json
import { listIcons, suggestIcons } from '../src/core/icons.mjs';
const all = listIcons(process.cwd());
for (const q of process.argv.slice(2)) {
  const hits = suggestIcons(q, process.cwd());
  console.log(`${q}: ${hits.length ? hits.slice(0, 25).join(', ') : '(none)  try a synonym'}`);
}
console.log(`\n${all.length} icons available. Add your own by dropping assets/icons/<name>.svg (24x24, stroke-based).`);
