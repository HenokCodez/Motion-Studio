#!/usr/bin/env node
// Usage: node export-placeholders.mjs <timeline.v6.json|timeline.json> <outDir>  -> placeholders.csv + placeholders.edl.txt
import fs from "node:fs";
import path from "node:path";
import { readJson } from "./lib.mjs";

const [tlPath, outDir] = process.argv.slice(2);
const tl = readJson(tlPath);
const fps = tl.meta?.fps || 30;

const tc = (s) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const f = Math.round((s % 1) * fps);
  return `00:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
};

const rows = ["scene,start,end,duration_s,type,description"];
const edl = [];

for (const s of tl.scenes) {
  // v6 schema: s.media?.kind === "footage" | v5 legacy: s.stack?.media?.kind === "placeholder"
  let label = null;
  const startSec = s.start !== undefined ? s.start : s.startSec;
  const endSec = s.end !== undefined ? s.end : s.endSec;

  if (s.media && (s.media.kind === "footage" || s.media.kind === "placeholder")) {
    label = s.media.label;
  } else if (s.stack?.media?.kind === "placeholder") {
    label = s.stack.media.label;
  }

  if (label) {
    const dur = (endSec - startSec).toFixed(2);
    const m = label.match(/^([A-Z ]+):\s*(.+)$/);
    const type = m ? m[1].trim() : "FOOTAGE";
    const desc = m ? m[2].trim() : label;
    rows.push([s.id, tc(startSec), tc(endSec), dur, type, `"${desc.replace(/"/g, "'")}"`].join(","));
    edl.push(`${tc(startSec)}  ${s.id}  ${type}  ${desc}  (${dur} s)`);
  }
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "placeholders.csv"), rows.join("\n"));
fs.writeFileSync(path.join(outDir, "placeholders.edl.txt"), edl.join("\n"));
console.log(`${rows.length - 1} placeholders exported to ${outDir}`);
