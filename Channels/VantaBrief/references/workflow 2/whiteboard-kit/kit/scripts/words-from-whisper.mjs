#!/usr/bin/env node
// Convert Whisper word-timestamp JSON (openai-whisper --word_timestamps True, or faster-whisper dump) -> words.json
//   whisper public/audio/narration.mp3 --word_timestamps True --output_format json --output_dir out
//   node scripts/words-from-whisper.mjs out/narration.json > words.json
import fs from 'node:fs';
const j = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const words = (j.segments || []).flatMap(s => s.words || []).map(w => ({ w: String(w.word).trim(), start: +w.start.toFixed(2), end: +w.end.toFixed(2) }));
if (!words.length) { console.error('no word timestamps found: re-run whisper with --word_timestamps True'); process.exit(1); }
process.stdout.write(JSON.stringify(words, null, 1));
