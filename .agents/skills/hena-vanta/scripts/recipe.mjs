#!/usr/bin/env node
// Instantiate a ready-made animated scene from templates/presets/recipes.json.
//   node recipe.mjs list
//   node recipe.mjs R08-statement-with-colour-hits --id s014 --start 12.3 --end 15.1 --vo "once your trust score is high enough" [--set text="..."]
// Prints the scene JSON (paste/merge into src/timeline.json). Every recipe documents its animation in `animation`.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readJson } from "./lib.mjs";
const here = path.dirname(fileURLToPath(import.meta.url));
const recipes = readJson(path.join(here, "..", "templates", "presets", "recipes.json"));
const a = process.argv.slice(2); const opt = (k, d) => { const i = a.indexOf("--" + k); return i >= 0 ? a[i + 1] : d; };
if (!a.length || a[0] === "list") { recipes.forEach((r) => console.log(`${r.id.padEnd(34)} ${r.source.padEnd(28)} ${r.what}`)); process.exit(0); }
const r = recipes.find((x) => x.id === a[0] || x.id.startsWith(a[0]));
if (!r) { console.error("unknown recipe. run: recipe.mjs list"); process.exit(2); }
const start = +opt("start", 0), end = +opt("end", start + r.durationHintSec);
const sc = JSON.parse(JSON.stringify(r.scene));
Object.assign(sc, { id: opt("id", "s000"), startSec: start, endSec: end, vo: opt("vo", ""), why: opt("why", r.what) });
console.error("ANIMATION:\n - " + r.animation.join("\n - "));
console.log(JSON.stringify(sc, null, 2));
