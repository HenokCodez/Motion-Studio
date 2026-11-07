#!/usr/bin/env node
// Capture a REAL screenshot of a web page for a scene (e.g. the Upwork homepage when the narrator talks about it).
// Usage: node <skill>/scripts/capture.mjs <url> <out.png> [--w 1440] [--h 900] [--scale 2] [--wait 6000]
// Uses the Chrome / Edge / Chromium already installed on the machine in headless mode (no extra packages).
// Override the browser with env CHROME_PATH. Rejects blank captures (consent wall / bot check / not loaded).
// NOTE: written without being able to run a browser in the authoring sandbox - verify with one capture first.
// If this fails, use the agent's own browser tool (or `npx playwright screenshot --viewport-size=1440,900 <url> <out.png>`) instead, then run `node capture.mjs --check <png>`.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf("--" + k); return i >= 0 ? args[i + 1] : d; };
const checkOnly = args.includes("--check");
const [a0, a1] = args.filter((a) => !a.startsWith("--") && !/^\d+$/.test(a));

const candidates = [process.env.CHROME_PATH, "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe", "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].filter(Boolean);
const chrome = candidates.find((c) => fs.existsSync(c));

const blankCheck = (file) => {
  const req = createRequire(path.join(process.cwd(), "package.json")); const { PNG } = req("pngjs");
  const png = PNG.sync.read(fs.readFileSync(file)); let sum = 0, sum2 = 0, k = 0;
  for (let i = 0; i < png.width * png.height; i += 11) { const l = (png.data[i * 4] + png.data[i * 4 + 1] + png.data[i * 4 + 2]) / 3; sum += l; sum2 += l * l; k++; }
  const m = sum / k, sd = Math.sqrt(Math.max(0, sum2 / k - m * m));
  console.log(`${file}: ${png.width}x${png.height}, luminance sd ${sd.toFixed(1)}`);
  const ocr = spawnSync("tesseract", [file, "stdout", "--psm", "11"], { encoding: "utf8", timeout: 60000 });
  const ERR = /(access denied|you have been blocked|sorry, you have been|captcha|verify you are human|are you a robot|just a moment|enable javascript|don'?t have permission|forbidden|unusual traffic|cloudflare|attention required|checking your browser|accept all cookies|cookie settings|page not found|error 40\d)/i;
  if (ocr.status === 0 && ERR.test(ocr.stdout)) { console.error(`ERROR/BLOCK/CONSENT PAGE detected by OCR ("${(ocr.stdout.match(ERR) ?? [""])[0]}"). This is NOT the real page: do not use it. Try another URL/wait, or use a labelled placeholder.`); process.exit(6); }
  if (ocr.status !== 0) console.error("(tesseract not installed: OCR error-page check skipped. You MUST view the image yourself.)");
  if (sd < 12) { console.error("LOOKS BLANK (consent wall / bot check / still loading). OPEN THE IMAGE. Retry with --wait 9000 or drop it and use a labelled card placeholder."); process.exit(3); }
};
if (checkOnly) { blankCheck(a0); process.exit(0); }
const [url, out] = [a0, a1];
if (!url || !out) { console.error("usage: capture.mjs <url> <out.png> [--w 1440 --h 900 --scale 2 --wait 6000]   |   capture.mjs --check <png>"); process.exit(2); }
if (!chrome) { console.error("No Chrome/Edge found. Set CHROME_PATH, or capture with the agent's browser tool / playwright, then run: capture.mjs --check <png>"); process.exit(4); }
const w = +opt("w", 1440), h = +opt("h", 900), scale = +opt("scale", 2), wait = +opt("wait", 6000);
fs.mkdirSync(path.dirname(out), { recursive: true });
const r = spawnSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--disable-extensions", `--window-size=${w},${h}`, `--force-device-scale-factor=${scale}`, `--virtual-time-budget=${wait}`, `--screenshot=${path.resolve(out)}`, url], { encoding: "utf8", timeout: 90000 });
if (r.status !== 0 || !fs.existsSync(out)) { console.error("browser failed:", r.stderr?.slice(0, 400)); process.exit(5); }
blankCheck(out);
console.log("Now VIEW the image yourself: banners dismissed? real content? no private data? Record the URL + date in PLAN.md (sources table).");
