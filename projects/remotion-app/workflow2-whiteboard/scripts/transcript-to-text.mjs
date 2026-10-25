#!/usr/bin/env node
// Prints the voiceover as numbered, timestamped lines so beats.json "narration" can be copied VERBATIM.
//   node scripts/transcript-to-text.mjs words.json
import fs from 'node:fs';
const words = JSON.parse(fs.readFileSync(process.argv[2] || 'words.json', 'utf8'));
let line = [], t0 = 0, n = 0;
const flush = () => { if (line.length) { console.log(`[${String(n).padStart(4)}] ${t0.toFixed(1).padStart(6)}s  ${line.join(' ')}`); n += line.length; line = []; } };
words.forEach((w, i) => { if (!line.length) t0 = w.start; line.push(w.w); if (/[.!?]$/.test(w.w) || line.length >= 14) flush(); });
flush();
