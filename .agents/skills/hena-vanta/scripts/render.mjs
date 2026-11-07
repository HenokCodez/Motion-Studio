#!/usr/bin/env node
// GATED render. Refuses to render unless QA passed on THIS timeline and the stills were reviewed. Run from the project dir:
//   node <skill>/scripts/render.mjs <out/final.mp4> [--voiceover <voiceover file>] [--folder <dir with voiceover + timestamps>]
// qa/review.json (written by the agent AFTER looking at the stills): { "reviewed": ["f000012.png", ...], "problemsFound": ["..."], "fixed": true, "notes": "..." }
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const here = path.dirname(fileURLToPath(import.meta.url));
const a = process.argv.slice(2); const out = a[0]; const opt = (k) => { const i = a.indexOf("--" + k); return i >= 0 ? a[i + 1] : undefined; };
if (!out) { console.error("usage: render.mjs <out.mp4> [--voiceover f] [--folder dir] [--project dir]"); process.exit(2); }

let proj = opt("project") ? path.resolve(opt("project")) : process.cwd();
if (!fs.existsSync(path.join(proj, "src", "timeline.v6.json")) && !fs.existsSync(path.join(proj, "src", "timeline.json"))) {
  const candidate = path.join(process.cwd(), "projects", "hena-vanta-upwork");
  if (fs.existsSync(path.join(candidate, "src", "timeline.json"))) {
    proj = candidate;
  }
}

const die = (m) => { console.error("RENDER REFUSED: " + m); process.exit(1); };
const tl = fs.existsSync(path.join(proj, "src", "timeline.v6.json"))
  ? path.join(proj, "src", "timeline.v6.json")
  : path.join(proj, "src", "timeline.json");
const rep = path.join(proj, "qa", "report.json"), rev = path.join(proj, "qa", "review.json");
if (!fs.existsSync(rep)) die("run qa-frames.mjs first (no report.json in " + proj + "/qa)");
if (fs.statSync(rep).mtimeMs < fs.statSync(tl).mtimeMs) die("timeline.json changed after the last QA run: run qa-frames.mjs again");
const r = JSON.parse(fs.readFileSync(rep, "utf8")); if (r.failures > 0) die(`${r.failures} QA checks failing (see qa/REPORT.md)`);
if (!r.stills?.length) die("QA rendered no stills (run it with a browser, not --no-render)");
if (!fs.existsSync(rev)) die("qa/review.json missing: LOOK at the stills, then write it (reviewed[], problemsFound[], fixed, notes)");
const v = JSON.parse(fs.readFileSync(rev, "utf8")); const need = r.stills.length; const got = new Set(v.reviewed ?? []).size;
if (got < need * 0.9) die(`review.json lists ${got} stills but ${need} were rendered (>= 90% must be reviewed)`);
const q = (s) => (process.platform === "win32" && typeof s === "string" && s.includes(" ") && !s.startsWith('"') ? `"${s}"` : s);
const res = (cmd, args) => {
  const safeArgs = args.map(q);
  const x = spawnSync(cmd, safeArgs, { stdio: "inherit", shell: process.platform === "win32", cwd: proj });
  if (x.status !== 0) die(`${cmd} failed`);
};
fs.mkdirSync(path.dirname(out), { recursive: true });
const raw = out.replace(/\.mp4$/i, ".raw.mp4");
res("npx", ["remotion", "render", "src/index.ts", "HenaVanta", raw, "--codec=h264", "--crf=16"]);
res("node", [path.join(here, "normalize-final.mjs"), raw, out]);
const chk = spawnSync("node", [path.join(here, "check-loudness.mjs"), out, "-14", "1", "-1"], { stdio: "inherit", cwd: proj }); if (chk.status !== 0) die("loudness out of spec after normalisation");
if (opt("voiceover")) { const x = spawnSync("node", [path.join(here, "verify-final-audio.mjs"), out, opt("voiceover")], { stdio: "inherit", cwd: proj }); if (x.status !== 0) die("words masked/lost in the final audio"); }
const exp = spawnSync("node", [path.join(here, "export-placeholders.mjs"), tl, path.dirname(out)], { stdio: "inherit", cwd: proj });
console.log("RENDER OK ->", out, "(nothing was published). Paste qa/REPORT.md into your report.");
