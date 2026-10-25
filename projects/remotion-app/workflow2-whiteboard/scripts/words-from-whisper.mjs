#!/usr/bin/env node
// Convert Whisper word-timestamp JSON (openai-whisper, faster-whisper, or Motion Studio transcript.words.json) -> words.json
//   node scripts/words-from-whisper.mjs path/to/transcript.words.json > words.json
import fs from 'node:fs';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/words-from-whisper.mjs <input.json> > words.json');
  process.exit(1);
}
const j = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
let words = [];

if (Array.isArray(j.words)) {
  // Motion Studio transcript.words.json format: { words: [ { word, startMs, endMs } ] }
  words = j.words.map(w => ({
    w: String(w.word ?? w.w).trim(),
    start: +( (w.startMs !== undefined ? w.startMs / 1000 : (w.start ?? 0)) ).toFixed(2),
    end: +( (w.endMs !== undefined ? w.endMs / 1000 : (w.end ?? 0)) ).toFixed(2),
  }));
} else if (Array.isArray(j.segments)) {
  // Whisper format: { segments: [ { words: [ { word, start, end } ] } ] }
  words = j.segments.flatMap(s => s.words || []).map(w => ({
    w: String(w.word ?? w.w).trim(),
    start: +w.start.toFixed(2),
    end: +w.end.toFixed(2),
  }));
} else if (Array.isArray(j)) {
  // Array of words
  words = j.map(w => ({
    w: String(w.word ?? w.w).trim(),
    start: +( (w.startMs !== undefined ? w.startMs / 1000 : (w.start ?? 0)) ).toFixed(2),
    end: +( (w.endMs !== undefined ? w.endMs / 1000 : (w.end ?? 0)) ).toFixed(2),
  }));
}

if (!words.length) {
  console.error('No word timestamps found: re-run whisper with --word_timestamps True or provide valid transcript.words.json');
  process.exit(1);
}
process.stdout.write(JSON.stringify(words, null, 1));
