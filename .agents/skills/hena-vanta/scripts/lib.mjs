import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 1 << 28, ...opts });
  if (r.error) throw new Error(`${cmd}: ${r.error.message}`);
  return r;
};
export const need = (cmd) => {
  const r = spawnSync(cmd, ["-version"], { encoding: "utf8" });
  if (r.error || r.status !== 0) throw new Error(`${cmd} not found on PATH. Install it and retry.`);
};
export const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
export const writeJson = (p, o) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(o, null, 2)); };
export const probeDuration = (file) => {
  const r = run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", file]);
  return parseFloat(r.stdout.trim());
};
export const norm = (w) => w.toLowerCase().replace(/[^a-z0-9']/g, "");

/** Align script tokens to whisper words by LCS. Returns per-script-token {start,end,matched}. */
export const alignWords = (scriptTokens, whisperWords) => {
  const a = scriptTokens.map(norm), b = whisperWords.map((w) => norm(w.w));
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
    dp[i][j] = a[i] && a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out = scriptTokens.map((w) => ({ w, start: null, end: null, matched: false }));
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] && a[i] === b[j]) { out[i].start = whisperWords[j].start; out[i].end = whisperWords[j].end; out[i].matched = true; i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++;
  }
  // interpolate unmatched
  let k = 0;
  while (k < n) {
    if (out[k].matched) { k++; continue; }
    let s = k; while (k < n && !out[k].matched) k++;
    const prevEnd = s > 0 ? out[s - 1].end : 0;
    const nextStart = k < n ? out[k].start : (whisperWords.at(-1)?.end ?? prevEnd + 0.3 * (k - s));
    const step = (nextStart - prevEnd) / (k - s + 1);
    for (let q = s; q < k; q++) { out[q].start = +(prevEnd + step * (q - s + 0.5)).toFixed(3); out[q].end = +(prevEnd + step * (q - s + 1)).toFixed(3); }
  }
  return out;
};
