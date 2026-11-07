# Vanta Brief Channel Permanent Lock Rule

> [!IMPORTANT]
> NOT FOR HENA VANTA. Never use for the Hena Vanta channel. Applies EXCLUSIVELY to Vanta Brief.

## 1. Trigger Conditions
This rule applies ALWAYS and AUTOMATICALLY whenever:
- The user prompt mentions "Vanta Brief" or "VantaBrief".
- The user prompt mentions or pastes: `Use the D:\Automations\motion-studio\Channels\VantaBrief\workflow2-explainer-v2 for the channel Vanta Brief. Build the full video in one go.`
- The user references any path under `D:\Automations\motion-studio\Channels\VantaBrief\`.
- The user provides project inputs with Format: long-form, Resolution: 1920x1080 for Vanta Brief.

## 2. Fixed Skill Location (Permanent & Immutable)
- **Skill Path**: `D:\Automations\motion-studio\Channels\VantaBrief\workflow2-explainer-v2`
- **Rule**: NEVER change this location. NEVER copy it elsewhere. NEVER reinvent the workflow or use generic Remotion scaffolds.
- **Working Directory**: Every terminal command MUST run inside this folder (`cd D:\Automations\motion-studio\Channels\VantaBrief\workflow2-explainer-v2`). Where any prompt and the skill disagree, the skill's files win.

## 3. Mandatory Pre-Flight Sequence
Before executing any video generation for Vanta Brief:
1. Open and follow `SKILL.md` in the fixed directory.
2. Read the 6 core reference documents in order:
   - `references\layout-law.md` (Safe frame x:154-1766, y:86-994; font >= 24px; title auto-fit; gap >= 40px)
   - `references\style-bible.md` (Real Grid_1.mp4 background; #FAF4D9 cream; #231F20 card; #FF6B35 orange accent; Excalifont/Inter; NO captions/subtitles)
   - `references\scheduler-rules.md` (scene-plan JSON schema; pacing <= 3.5s/anim; >=15-20 distinct IDs; no repeat within 6 scenes; alternating intensity)
   - `references\asset-protocol.md` (Official logos with provenance; Playwright screenshots in A30; missing assets to MISSING.md; NO GIFs)
   - `references\animation-catalog\INDEX.md` (Catalog A01-A57; specs + filmstrips)
   - `references\visual-refs\MAP.md` (Visual reference mapping)
3. Windows environment: use `python` (not `python3`); Remotion Chromium path `CHROME="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"`.

## 4. Hard Rules & Prohibitions
- **Background**: ALWAYS the real `assets\bg\Grid_1.mp4` looped by `components\SceneVideo.tsx`. NEVER recreate, tint, or overlay it.
- **Palette**: Locked to Charcoal `#231F20`, Cream `#FAF4D9`, Orange `#FF6B35` (max 1 focal element per scene), restricted Blue `#1677FF`, rare Lime `#CBFF4D`. NO green, purple, red, neon, gradients, or glassmorphism.
- **Audio Integrity**: Untouched narration voiceover only (`audio.mp3` in `assets\audio\`). NO sound effects, NO background music, NO ducking (Rule R1).
- **Character Ban**: NO cartoon mascots, stick figures, human faces, or animated avatars (Rule R4). Pure geometric/technical hand-drawn UI.
- **Typography & Layout**: Absolute minimum `fontSize >= 24px`. Safe frame `x: 154-1766, y: 86-994`. Titles never clip (use `scripts\font-fit.js`).
- **No Captions / Subtitles**: NEVER add word-by-word karaoke captions or narration subtitles.
- **No GIFs**: Leave named slots (`GIF_SLOT_01...`) in the plan notes for the user.
- **Never Auto-Render Full Video**: Never run the final production video render automatically. Output the exact CLI command for the user to execute.

## 5. Standard 9-Gate Execution Procedure
1. **Inspect Inputs**: Read script, timestamped script, voiceover audio, and existing assets from the input folder. List any missing inputs once.
2. **Analyze Intent**: Deconstruct script into narrative beats with an explicit `intent` each.
3. **Author Scene Plan**: Generate `scene-plan.json` in the fixed skill folder according to `schemas\scene-plan.schema.json`.
4. **Lint Variety**: Run `python scripts\variety-lint.py scene-plan.json` until PASS.
5. **Check Assets**: Run `python scripts\check-assets.py scene-plan.json`. Log gaps to `assets\MISSING.md`.
6. **Build Scenes**: Use only verified catalog animations (`A01`–`A57`) via composition `Video` in `components\Root.tsx`.
7. **Pixel & DOM Audit**: Render scene stills (`npx remotion still components/Root.tsx Video out/s<NN>.png --frame=<n>`). Run `python scripts\safe-pixel-check.py out\s*.png`, `python scripts\palette-lint.py out\s*.png`, and `node scripts\bounds-check-remotion.mjs <IDs>`.
8. **Preview & Contact Sheet**: Render a 10s preview (`node scripts\render-video.mjs out\preview.mp4 0 10`), generate contact sheet (`python scripts\contact-sheet.py out\preview.mp4 out\contact.png`), and inspect the image.
9. **Deliverables & Handoff**: Output self-audit report (PASS/FAIL with numbers) and provide the exact command:  
   `node scripts\render-video.mjs out\final.mp4`
