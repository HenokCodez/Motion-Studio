#!/usr/bin/env node
// Find openly licensed images (people, places, objects) for a beat, keyless, via Openverse. Records licence + creator for the PLAN.
// Usage: node find-images.mjs "<query>" <outDir> [--n 4] [--licenses cc0,pdm,by,by-sa] [--orientation wide|tall]
import fs from "node:fs";
import path from "node:path";
const args = process.argv.slice(2); const [q, outDir] = args;
const opt = (k, d) => { const i = args.indexOf("--" + k); return i >= 0 ? args[i + 1] : d; };
if (!q || !outDir) { console.error('usage: find-images.mjs "<query>" <outDir> [--n 4] [--licenses cc0,pdm,by,by-sa]'); process.exit(2); }
const n = +opt("n", 4), lic = opt("licenses", "cc0,pdm,by,by-sa"), ori = opt("orientation");
const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license=${lic}&page_size=${Math.max(10, n * 3)}&mature=false${ori === "wide" ? "&aspect_ratio=wide" : ori === "tall" ? "&aspect_ratio=tall" : ""}`;
const r = await fetch(url, { headers: { "User-Agent": "hena-vanta-skill/3.0" } });
if (!r.ok) { console.error("Openverse error", r.status, "- fall back to a labelled card placeholder (kind: card) with the search query"); process.exit(3); }
const data = await r.json();
fs.mkdirSync(outDir, { recursive: true });
const log = []; let got = 0;
for (const it of data.results ?? []) {
  if (got >= n) break;
  if ((it.width ?? 0) < 900) continue;                       // too small for a 1080p frame
  try {
    const img = await fetch(it.url); if (!img.ok) continue;
    const ext = (it.filetype || "jpg").replace("jpeg", "jpg"); const name = `${q.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${got + 1}.${ext}`;
    fs.writeFileSync(path.join(outDir, name), Buffer.from(await img.arrayBuffer()));
    log.push({ file: name, title: it.title, creator: it.creator, license: `${it.license} ${it.license_version ?? ""}`.trim(), licenseUrl: it.license_url, source: it.foreign_landing_url, query: q });
    got++;
  } catch { /* try next */ }
}
const logPath = path.join(outDir, "licenses.json"); const prev = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, "utf8")) : [];
fs.writeFileSync(logPath, JSON.stringify([...prev, ...log], null, 2));
console.log(`saved ${got} image(s) to ${outDir}; licences appended to licenses.json. VIEW every image: right subject? no random identifiable stranger unless the subject of the line? BY/BY-SA need credit in the video description.`);
