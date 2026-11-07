# ANTIGRAVITY PROMPT: Workflow 2 v2 (paste into Google Antigravity)

You are executing a skill, not designing a workflow. The skill folder `workflow2-explainer-v2/` is your instruction set. Do not reinvent, skip or "improve" its procedure. Where this prompt and the skill disagree, the skill's files win.

## 0. Install and load (do this first)
1. If the folder is a ZIP, unzip it. Copy the folder `workflow2-explainer-v2/` to the project at `.agent/skills/workflow2-explainer-v2/` (or to your global skills directory, e.g. `~/.gemini/antigravity/skills/`; use the path the user gives if different). Keep the folder name.
2. In that folder run `npm install` once. Chromium is needed for rendering: Remotion fetches its own; if that is blocked, set `CHROME=<path to a Chromium/Chrome binary>`.
3. Read, in this order, and reply with ONE line per file confirming you read it: `SKILL.md`, `references/layout-law.md`, `references/style-bible.md`, `references/scheduler-rules.md`, `references/asset-protocol.md`, `references/animation-catalog/INDEX.md`, `references/visual-refs/MAP.md`. Do nothing else until done.

## 1. Hard rules (from the original handoff, unchanged)
Background = the real `assets/bg/Grid_1.mp4` (never recreate, tint or overlay). Keep the approved Vanta Brief hand-drawn look. Workflow 2 stays the pipeline; do not touch Workflow 1 or 3. Do not change the narration. Do not ask the user to re-explain style. No captions/subtitles/lower-thirds. No GIFs (leave `GIF_SLOT_nn` notes). Do NOT start the final render yourself: give the user the exact command.

## 2. Use the library and the visual references
- The catalog has 57 animations A01-A57 (`components/animations/`). For EVERY scene, open `references/animation-catalog/filmstrips/<ID>.png` AND its spec `.md` before using it. Params and text limits come from the spec ("Max content").
- The user's reference images are in `references/visual-refs/`. Specs that follow one say so (shown bottom-right on the board). Match that composition and motion idea in the flat palette; never copy their gradients/glass/colors.
- Pick animations by intent with the table in `scheduler-rules.md`. Do not improvise. If nothing fits, create a catalog entry first via `references/new-animation-template.md` (component + meta JSON + rendered filmstrip), then use it.

## 3. Procedure (each gate must pass before the next; on failure fix and retry that gate)
1. Inspect the project: script, timestamped script, voiceover, assets. List missing inputs once; continue with what you have.
2. Analyze the script with the configured analysis model into scenes with an `intent` each.
3. Write `scene-plan.json` (project root of the skill) valid against `schemas/scene-plan.schema.json`; copy structure from `examples/scene-plan.example.json`. Put the voiceover under `assets/audio/` and reference it as `"audio": "audio/<file>"`.
4. `python3 scripts/variety-lint.py scene-plan.json` -> fix IDs/split scenes until PASS (no repeats within 6 scenes, categories alternate, >=15 distinct IDs, >=5 hero scenes, <=3.5 s per animation, CTA uses A29).
5. Assets per `asset-protocol.md`: logos for every named company (already in `assets/logos/`: DeepSeek, ChatGPT, Claude, Gemini, Grok, Mistral, Meta; fetch others with `scripts/asset-fetch.py logo <name> <url>`), screenshots with `scripts/asset-fetch.py screenshot <name> <url>`, photos only from official sources into `assets/photos/`. Then `python3 scripts/check-assets.py scene-plan.json` -> PASS, or list the missing files in `assets/MISSING.md` and tell the user.
6. Build only with catalog components through composition `Video` (`components/Root.tsx` + `components/SceneVideo.tsx`). Nothing else needs writing.
7. Validate: render stills of each scene (rest + mid frame) with `npx remotion still components/Root.tsx Video out/sNN.png --frame=N`; run `python3 scripts/safe-pixel-check.py out/s*.png`, `python3 scripts/palette-lint.py out/s*.png`, and `node scripts/bounds-check-remotion.mjs <IDs used>` (DOM text boxes inside the real render). Use `scripts/font-fit.js` for long titles. Fix and re-run until PASS. Frames of entrance animations that are mid-slide may sit off-frame by design.
8. Preview: `node scripts/render-video.mjs out/preview.mp4 0 10`, then `python3 scripts/contact-sheet.py out/preview.mp4 out/contact.png`. OPEN the contact sheet image and review it (one thumbnail per 3 s). Fix failures.
9. Output the self-audit below and the final command `node scripts/render-video.mjs out/final.mp4` (audio is mixed from `plan.audio`).

## 4. Self-audit (print PASS/FAIL + evidence for every line)
Nothing outside the safe frame (x154-1766, y86-994); titles fit one line or wrap at a word. All text >= 24 px; sizes follow layout-law/scale-spec. >= 15 distinct IDs, variety-lint output attached. Channel logo on CTA (A29) and intro/outro (A27). Real logo for every named company; groups use A28/A55; DeepSeek appears in varied logo animations. Screenshots (A30/A57) wherever a product/site/benchmark is named. >= 5 hero scenes; a development event at least every 3.5 s. Palette-lint PASS; no captions anywhere; check-assets PASS or MISSING listed.

## 5. Do not
No captions/subtitles. No off-palette colors. Blue only for channel-identity moments, contrast-pair second side, chart series 2. Lime (#CBFF4D) only with channel-logo moments, rare. No oversized hero cards; full-width 3-card rows in at most 1 scene in 4. No PowerPoint-style bullet slides. No static scene > 3.5 s. No text < 24 px. Never clip a title. No stock images, no invented logos. Do not rebuild or edit the catalog unless step 2's rule requires a new entry.

## 6. Re-do the current Deepseek / benchmark video
Run the procedure above on its script. Required corrections: all scenes inside the safe frame at the corrected scale; titles fit (the old "Real World or Benchm..." clipped); >= 20 distinct IDs; A28 or A55 logo cluster for "other closed-tier models"; A29 on the subscribe line; DeepSeek logo in varied animations (A27, A55 hub, A56 duel, A21 hub); A30/A57 for benchmark and leaderboard mentions, A25/A26/A33/A37 for numbers; >= 5 hero scenes. Example rows:
- "Real World or Benchmark?" -> title, hero: A01.
- "Official Test Runs / Case Studies / Heavy-Duty Tasks" -> list: A13 or A34 (not a full-width card row), then A03 for the orange one.
- "Standard Webchat vs Agentic Workflows" -> compare: A09 (or A11/A12/A31).
- "Breguet Overcoil and 3D Explode" -> process, hero: A19 then A22.
- "130+" -> stat, hero: A07; several stats: A37.
- "other closed-tier models" -> brand-group: A28 (ChatGPT, Claude, Gemini, Grok) or A55; then DeepSeek via A27/A56.
- "Subscribe to Vanta Brief" -> cta: A29.
