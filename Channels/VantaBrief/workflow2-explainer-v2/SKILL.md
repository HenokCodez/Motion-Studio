---
name: workflow2-explainer-v2
description: Builds long-form 1920x1080 explainer videos in the Vanta Brief hand-drawn style with Remotion. Use when turning a script + voiceover into a Workflow 2 explainer: plans scenes, picks from a catalog of 57 rendered animations (specs + filmstrips), fetches real logos/screenshots, enforces safe-frame layout, palette, variety and pacing rules, and renders over the real Grid_1.mp4 background. No captions.
---
# Workflow 2 Explainer v2

Read in this order before doing anything, confirm each in one line: this file, references/layout-law.md, references/style-bible.md, references/scheduler-rules.md, references/asset-protocol.md, references/animation-catalog/INDEX.md.

## Hard rules
- Background = assets/bg/Grid_1.mp4 (looped by components/SceneVideo.tsx). Never recreate, tint or overlay it.
- Palette/type/lines: style-bible.md. NO captions, subtitles or lower-thirds. No GIFs.
- Layout: layout-law.md (safe frame x154-1766, y86-994; every text >= 24px; titles never clip).
- Narration is never edited. Workflow 1 and 3 are untouched. Do not auto-render unless the prompt requests "Build the full video in one go" (which explicitly authorizes the final render in the specified output folder).
- Use ONLY catalog components. For each scene open filmstrips/<ID>.png AND the spec .md of the chosen ID first. Need a new animation? Follow references/new-animation-template.md.

## Procedure (each gate must pass before the next)
1. Inspect project: script, timestamped script, voiceover, assets. Missing input -> list it once and continue with the rest.
2. Analyze script into scenes (intent per scene) with the configured analysis model.
3. Write scene-plan.json (schemas/scene-plan.schema.json; example in examples/). Fail -> fix JSON.
4. `python3 scripts/variety-lint.py scene-plan.json` (add --partial only for excerpts). Fail -> change IDs / split long scenes.
5. Fetch assets per asset-protocol.md. Failures -> assets/MISSING.md.
6. Build: scene-plan.json at project root drives composition "Video" (components/Root.tsx). Params come from the plan; text limits from each spec's "Max content".
7. Verify: render stills of every scene's rest frame and a mid frame (`npx remotion still components/Root.tsx Video out/s<NN>.png --frame=<n>`), then `python3 scripts/safe-pixel-check.py out/s*.png` and `python3 scripts/palette-lint.py out/s*.png`; run `python3 scripts/check-assets.py scene-plan.json`; DOM check of the animations you used: `node scripts/bounds-check-remotion.mjs A01 A09 ...` (reads real text boxes inside the Remotion render: font >= 24, inside safe frame, no text overlap). Titles: scripts/font-fit.js. Fail -> fix params/scale and re-run.
8. `python3 scripts/contact-sheet.py <preview.mp4> out/contact.png` (one thumbnail per 3 s) - open the image and review it. Mid-slide frames of entrance animations (A04, A08, A09) may legitimately sit off-frame.
9. Report the self-audit (see ANTIGRAVITY_PROMPT.md) and the render command: `node scripts/render-video.mjs out/final.mp4` (same as `npx remotion render components/Root.tsx Video out/final.mp4`; audio = plan.audio). A quick partial render: `node scripts/render-video.mjs out/preview.mp4 0 10`.

## Layout of this package
references/ (specs, rules, animation-catalog with INDEX.md, A##-*.md specs, filmstrips/*.png) | components/ (primitives, animations A01-A57, SceneVideo, Root) | references/visual-refs/ (the user's reference images + MAP.md) | scripts/ | schemas/ | assets/ (fonts, brand, bg, logos, screenshots) | examples/ | ANTIGRAVITY_PROMPT.md
Read references/visual-refs/MAP.md: those images are the user's visual authority; each animation spec says which reference it follows.
Setup once: `npm i`. Catalog rebuild: `npm run boards` (needs Chromium; set CHROME=<path>).

## v2.1 extensions (additive; the procedure and rules above are unchanged)
Read `references/pacing-rules.md` and `references/creative-brief.md` once, then apply these extra lines to the gates above:
- Gate 2/3: cut scenes on sentence ends; set per-animation `delay` from the narration timestamps; write `creative-notes.md` and plan custom animations (>= 1/3 of scenes) before the scene plan.
- Gate 4: after `variety-lint.py` also run `python scripts\v21-lint.py scene-plan.json` until PASS.
- Gate 5: also run `python scripts\content-check.py scene-plan.json` until PASS.
- Gate 6: custom animations live in `components/custom/` and are registered in `components/custom/index.ts`; plans may use `"pacing"` (auto by default), per-animation `delay`/`speed`.
- Gate 8: also run `python scripts\frame-audit.py out\preview.mp4` and fix every FAIL (empty frames, empty ending).
- A30 (screenshot) now takes `region` and `theme`; always set `region` to the part of the screenshot that matters.

## One-Go Execution Mode ("Build the full video in one go")
When the user's prompt requests "Build the full video in one go" (or explicitly authorizes full delivery):
1. **Full Render Authorized**: The request explicitly grants final render authorization. Do not halt at Gate 9 to ask questions or wait for permission.
2. **Execute All Gates Continuously**: Run Gates 1 through 9 end-to-end without stopping:
   - Read and inspect inputs (voiceover, script, timestamped script, assets).
   - Write `creative-notes.md` planning pacing synced to narration (`delay` on spoken words), unique visual metaphors, >= 1/3 custom animations (`components/custom/C##.tsx`), real logos/screenshots, and the channel logo on intro and subscribe moments.
   - Build and validate `scene-plan.json` with `python scripts/v21-lint.py` and `python scripts/content-check.py`.
   - Run verification tests (`safe-pixel-check.py`, `palette-lint.py`, `bounds-check-remotion.mjs`).
   - Render the complete master video using `node scripts/render-video.mjs <output-path>` directly into the requested output folder.
   - Run `python scripts/frame-audit.py <output-path>` to verify zero dead air and pristine delivery.
3. **No Intermediate Steps**: Deliver the finished video directly in the requested output folder in one continuous run without questions or back-and-forth.
