// Voiceover alignment. Scene boundaries come from the TRANSCRIPT, never from authored durations.
//   beats.scenes[i].narration  = the words spoken in that scene, copied from the transcript
//   words.json                 = [{w,start,end}] from Whisper
// Result per scene: start, dur, and the exact slice of transcript words it owns.

export class AlignError extends Error {}

export const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
export const tokens = (text) => String(text).split(/\s+/).map(norm).filter(Boolean);

// Sequential match of narration tokens N against transcript tokens W starting at j.
// Tolerates 1-2 inserted/dropped words and substitutions (Whisper vs. hand-copied text).
function matchFrom(N, W, j) {
  let wi = j, ni = 0, matched = 0;
  while (ni < N.length && wi < W.length) {
    if (N[ni] === W[wi]) { matched++; ni++; wi++; continue; }
    if (N[ni] === W[wi + 1]) { wi += 1; continue; }
    if (N[ni] === W[wi + 2]) { wi += 2; continue; }
    if (N[ni + 1] === W[wi]) { ni += 1; continue; }
    if (N[ni + 2] === W[wi]) { ni += 2; continue; }
    ni++; wi++;
  }
  return { matched, end: wi };
}

export function alignScenes(scenes, words, { lead = 0.15, tail = 0.8, minScore = 0.7, maxSkip = 90 } = {}) {
  const W = [], orig = [];
  words.forEach((w, i) => { const t = norm(w.w); if (t) { W.push(t); orig.push(i); } });
  if (!W.length) throw new AlignError('words.json is empty');

  const out = [];
  let cursor = 0;
  for (const sc of scenes) {
    const N = tokens(sc.narration || '');
    if (N.length < 3) throw new AlignError(`scene "${sc.id}": "narration" must be the spoken words of this scene (copied from the transcript), at least 3 words.`);
    let best = null;
    for (let j = cursor; j < Math.min(W.length, cursor + maxSkip); j++) {
      if (W[j] !== N[0] && W[j + 1] !== N[0]) continue;
      const m = matchFrom(N, W, j);
      const score = m.matched / N.length;
      if (!best || score > best.score + 1e-9) best = { j, end: m.end, score };
    }
    if (!best || best.score < minScore) {
      const near = W.slice(cursor, cursor + 8).join(' ');
      throw new AlignError(`scene "${sc.id}": narration does not match the voiceover near word ${cursor} (best match ${best ? Math.round(best.score * 100) : 0}%, need ${minScore * 100}%). The transcript there says: "${near} ...". Copy the narration VERBATIM from the transcript.`);
    }
    out.push({ id: sc.id, wi0: best.j, wi1: Math.min(best.end, W.length), score: best.score });
    cursor = Math.min(best.end, W.length);
  }

  // contiguous boundaries: scene i owns [B_i, B_{i+1}); first starts at 0; last ends after its final word
  const wordStart = (k) => words[orig[Math.min(k, orig.length - 1)]].start;
  const wordEnd = (k) => words[orig[Math.min(k, orig.length - 1)]].end;
  const B = out.map((o, i) => (i === 0 ? 0 : wordStart(o.wi0) - lead));
  for (let i = 1; i < B.length; i++) B[i] = Math.max(B[i], B[i - 1] + 1.0);
  const endT = wordEnd(out[out.length - 1].wi1 - 1) + tail;
  const scenesOut = out.map((o, i) => {
    const start = B[i], end = i + 1 < B.length ? B[i + 1] : endT;
    const slice = [];
    for (let k = o.wi0; k < o.wi1; k++) slice.push({ w: words[orig[k]].w, n: W[k], start: words[orig[k]].start, end: words[orig[k]].end });
    return { id: o.id, start, dur: +(end - start).toFixed(3), words: slice, score: o.score };
  });

  // coverage: every spoken word must belong to a scene (no silent, unillustrated stretches)
  const issues = [];
  const firstCovered = out[0].wi0;
  if (firstCovered > 3) issues.push(`first ${firstCovered} spoken words ("${W.slice(0, 6).join(' ')} ...") are not covered by any scene`);
  for (let i = 1; i < out.length; i++) {
    const gap = out[i].wi0 - out[i - 1].wi1;
    if (gap > 4) issues.push(`${gap} spoken words between "${out[i - 1].id}" and "${out[i].id}" are not covered: "${W.slice(out[i - 1].wi1, out[i - 1].wi1 + 8).join(' ')} ..."`);
  }
  const tailGap = W.length - out[out.length - 1].wi1;
  if (tailGap > 4) issues.push(`last ${tailGap} spoken words are not covered by any scene`);
  const covered = out.reduce((a, o) => a + (o.wi1 - o.wi0), 0);
  return { scenes: scenesOut, issues, coverage: covered / W.length, totalSec: endT };
}

// Time at which `cue` is spoken inside a scene's own words. cue = "word", "two words", or "word#2" (2nd occurrence).
export function cueTime(cue, sceneWords) {
  if (!cue) return { t: null, count: 0 };
  const m = String(cue).match(/^(.*?)(?:#(\d+))?$/);
  const toks = tokens(m[1]); const nth = m[2] ? parseInt(m[2], 10) : 1;
  if (!toks.length) return { t: null, count: 0 };
  const hits = [];
  for (let i = 0; i < sceneWords.length; i++)
    if (toks.every((t, k) => sceneWords[i + k] && sceneWords[i + k].n === t)) hits.push(sceneWords[i].start);   // exact token match, no prefix matching
  return { t: hits[nth - 1] ?? null, count: hits.length };
}
