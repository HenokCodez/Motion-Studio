import fs from "node:fs";
import path from "node:path";

const proj = "d:/Automations/motion-studio/projects/hena-vanta-upwork";
const tl = JSON.parse(fs.readFileSync(path.join(proj, "src", "timeline.json"), "utf8"));
const { fps, width: W, height: H, durationSec } = tl.meta;

let failures = 0;
const check = (name, ok, detail = "") => {
  if (ok) {
    console.log(`[PASS] ${name}`);
  } else {
    console.log(`[FAIL] ${name} -> ${detail}`);
    failures++;
  }
};

console.log(`=== RUNNING HENA VANTA QA CHECKS (${tl.scenes.length} scenes, ${durationSec}s) ===`);

// Check 10 & 11: Assets exist
check("Background file exists", fs.existsSync(path.join(proj, "public", tl.meta.background)));
check("Voiceover file exists", fs.existsSync(path.join(proj, "public", tl.meta.voiceover)));
check("No music referenced", !JSON.stringify(tl).match(/music|\.mp3.*bgm/i));

// Check 12: Duration
check("Duration matches VO + 0.5s", Math.abs(durationSec - 904.556) < 0.1, `${durationSec}s`);

// Check scenes
const scenes = tl.scenes;
check("Scenes exist and count > 0", scenes.length > 0, `Count: ${scenes.length}`);

let totalSfx = 0;
const allSfx = [];

scenes.forEach((s, i) => {
  const dur = s.endSec - s.startSec;
  if (dur < 0.5) check(`Scene ${s.id} min duration >= 0.5s`, false, `${dur}s`);
  if (i > 0) {
    const gap = s.startSec - scenes[i - 1].endSec;
    if (Math.abs(gap) > 0.05) check(`Scene ${s.id} no gap with previous`, false, `gap: ${gap}s`);
  }
  if ((s.red?.length ?? 0) > 2) check(`Scene ${s.id} <= 2 red words`, false, `Got: ${s.red.length}`);
  
  for (const p of s.placeholders ?? []) {
    if (!p.label || p.label.length < 4) check(`Scene ${s.id} placeholder label`, false, p.label);
  }

  for (const c of s.sfx ?? []) {
    totalSfx++;
    allSfx.push(c);
    const sfxPath = path.join(proj, "public", "sfx", c.file);
    if (!fs.existsSync(sfxPath)) check(`SFX ${c.file} exists`, false, sfxPath);
    if (c.atSec < 0.3 || c.atSec > durationSec - 0.3) check(`SFX ${c.file} bounds`, false, `@${c.atSec}s`);
  }
});

// Check SFX spacing & density
allSfx.sort((a, b) => a.atSec - b.atSec);
for (let i = 1; i < allSfx.length; i++) {
  const spacing = allSfx[i].atSec - allSfx[i - 1].atSec;
  if (spacing < 1.2) check(`SFX spacing >= 1.2s`, false, `${allSfx[i].file} vs ${allSfx[i-1].file}: ${spacing.toFixed(2)}s`);
}

const minutes = durationSec / 60;
const maxSfxAllowed = Math.ceil(6 * minutes);
check(`SFX density cap (<= 6/min for longform: max ${maxSfxAllowed})`, totalSfx <= maxSfxAllowed, `Total SFX: ${totalSfx}`);

console.log(`\n=== QA CHECK SUMMARY: ${failures === 0 ? "ALL CHECKS PASSED!" : failures + " FAILURES FOUND"} ===\n`);
process.exit(failures === 0 ? 0 : 1);
