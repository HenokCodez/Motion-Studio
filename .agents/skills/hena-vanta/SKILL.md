---
name: hena-vanta
description: Builds Hena Vanta videos (Remotion kinetic style, white grid bg). Use when the user says 'Use the hena-vanta skill', 'use hena-vanta', /hena-vanta, HV6, Hena Vanta, or gives a path under D:\Youtube\Hena Vanta\. Never use for Vanta Brief or any other channel, and never when another channel's skill is named.
---

# Hena Vanta video skill — v6 (final)

> [!IMPORTANT]
> Always print the **Startup Confirmation Block** filled with real values as the first reply of every Hena Vanta run before any work:
> ```text
> hena-vanta v6 loaded [v6.0 (final), STYLE-LOCK: LOCKED 2026-11-09]
> Approved reference: projects\hena-vanta-v6-upwork-365
> Checksums: OK / MISMATCH (list files)
> Parsed input:
>   Voiceover: <path> (found: yes/no, duration)
>   Script: <path or pasted -> saved to ...> (timestamps: supplied / aligned)
>   Format: long-form 1920x1080 / shorts 1080x1920
>   Background: <file>
>   VIDEO_DIR: <path>
>   Output: <path>\output
>   SFX folder: D:\Editor 2.0\SFX + Meme sounds
> Skill files edited this run: none
> Other channels' files touched: none
> Render: NOT started (command will be in render-command.txt)
> ```
> If checksums mismatch, STOP and ask the user before doing anything. If a required input is missing, ask ONE question.
> NEVER render the video: build, run `validate-v6.mjs` + `qa-frames.mjs`, view the stills, write `render-command.txt` (with loudness and word-recovery checks), and stop.

## Input Format & Project Intake

The skill accepts this exact user prompt format and runs the full workflow from it:

```text
Use the `hena-vanta` skill.
- Voiceover: <path to .wav/.mp3>
- Script: <path to script.txt, or the script pasted in the message>
- Format: long-form (16:9 1080p) or shorts (vertical)
- Background: <optional; a video from Branding\Bg; default = D:\Youtube\Hena Vanta\Branding\Bg\bg.mp4>
```

### Rules for Reading & Parsing Inputs:
1. **Folder Derivation**:
   - Derive `VIDEO_DIR` from the voiceover path.
   - The real layout may be `D:\Youtube\Hena Vanta\Videos\<name>\` OR `D:\Youtube\Hena Vanta\Project FIle\Videos\<name>\AI\`.
   - If a path does not exist, search both layouts for the folder name and use the match.
   - Ask the user ONE question only if there are several matches.
2. **Voiceover**: `.wav` or `.mp3`.
3. **Script**:
   - If pasted in the chat prompt, save it as `script.txt` in `VIDEO_DIR`.
   - If the script has timestamps, import them (label `raw.source: "supplied:"`).
   - If the script lacks timestamps, align it to the voiceover audio and label `raw.source: "aligned:"`.
4. **Format**:
   - `"shorts"` = 1080x1920 vertical.
   - `"long-form"` = 1920x1080 horizontal.
   - If missing from the prompt, ask the user ONE question to clarify format before proceeding.
5. **Background**:
   - Optional parameter; default is `D:\Youtube\Hena Vanta\Branding\Bg\bg.mp4` (or any video from `Branding\Bg`).
   - Copy to `public/hena-vanta/bg.mp4` in the Remotion project.
6. **Output & Directories**:
   - Output directory: `VIDEO_DIR\output` (create it if it does not exist).
   - SFX Library: `D:\Editor 2.0\SFX + Meme sounds`.
   - Logo: `D:\Youtube\Hena Vanta\Branding\logo2.png` -> copy to `public/hena-vanta/logo.png`.
7. **Execution & Non-Render Policy**:
   - NEVER render the video: build, run `validate-v6.mjs` + `qa-frames.mjs`, view the stills, then write `render-command.txt` (with loudness `-14 LUFS, true peak <= -1 dBTP` and word-recovery `>=98%` checks) and stop.

---

You build the full video in one go. You cannot see the reference video, so everything you need to reproduce its look
is written down here and in `references/`. READ THE FILES IN THE ORDER BELOW BEFORE WRITING ANY SCENE.

1. `references/MOTION-PRINCIPLES.md`  – how everything moves (camera drift, blur hand-off, word sync, springs).
2. `references/ANIMATION-CATALOG.md`  – 64 animations (A01–A64). Each one has: what idea it explains, anatomy,
   frame-by-frame timing, exit, palette, and a reference image in `references/frames/`.
3. `references/HOOK-PLAYBOOK.md`      – the first 15 seconds. Strongest animations only.
4. `references/IDEA-TO-ANIMATION.md`  – lookup table: "the voiceover says X" -> use animation Y.
5. `src/`                              – Remotion starter code (tokens, motion helpers, components) + `src/README.md`.
6. `PROMPT-TEMPLATE.md`                 – the per-video prompt to paste (includes the extra v6 checks E1–E7).

OPEN THE REFERENCE IMAGE of every animation you use (`references/frames/<id>.jpg`, 6 frames F1–F6 left-to-right,
top-to-bottom, with time offsets). The catalog text describes each frame; the image is the ground truth for layout.
Colours in the images are NOT ours (see "Palette"); layout and motion are.


## BRAND AND REFERENCE-IMAGE RULE (read twice)

The images in `references/frames/` A02–A51 were cut from videos by OTHER creators ("ItsProger", a Shorts-algorithm channel, and the
thumbnails/logos of other people). They exist ONLY to show layout and motion. This is NOT their channel, and the output is NOT a copy.

* NEVER reproduce any name, channel name, avatar, logo, thumbnail, screenshot, wordmark (vidIQ, ViewStats, YouTube, Apple, etc.), number,
  caption, quote or colour wash seen in a reference image. If a reference shows "ItsProger", "5.5M", "346,154M Views", a MrBeast thumbnail, etc.,
  those are placeholders to be replaced with OUR content or removed.
* Every place the references show a channel identity (A01 channel row, A13 avatars, A33 channel header, A36/A40-A43 thumbnails),
  use **Hena Vanta**: the channel name "Hena Vanta" and OUR logo.
* **Logo**: use the user's own logo file (`D:\Youtube\Hena Vanta\Branding\logo2.png` -> copy to `public/hena-vanta/logo.png`; if this file is
  missing, stop and ask the user for the path; do NOT invent or draw a logo, and do NOT use the "HV" circle drawn in the schematic frames,
  it is only a slot marker). The logo appears small (avatar-size) in A01/A13/A33 and the chapter card A64; never large, never every scene.
* Examples/thumbnails come only from OUR captures of real things named in the script (C4), with credit (A43), never from the references.
* Self-check before QA: grep the build for the strings "ItsProger", "Proger", "5.5M", "346,154", "vidIQ", "ViewStats", "MrBeast", "Wifies",
  "Noob" and fail the build if any appear. Report the result in E8.

## What changed from v5 (the user's three complaints)

| Complaint | v6 rule |
|---|---|
| "Text parts are confusing, unnecessary, used too much." | NO paragraph/bullet text screens. Text is ONE WORD (or <=4 words) at a time, appearing exactly when spoken, and it is almost always attached to an object (bubble, pill, window, card, beam). Pure-text scenes are <=20% of runtime. Never two text-only scenes back to back. |
| "I don't like the black placeholders." | NO boxes, fills or outlines for missing footage. A footage slot is a single line of 20px text, centred in the slot (see "Footage notes"). Nothing else is drawn there so the editor's footage covers it completely. |
| "Combine the earlier style with the new style." | Earlier style keeps: red keyword inside an italic sentence, real screenshot cards with an italic footnote, stick-figure + quote, "trap" warning line. New style supplies: kinetic words, iMessage bubbles, pills, list cards, windows with a cursor, camera drift, blur hand-offs, Venn / S-curve diagrams. |

## Hard rules (every scene)

1. **Every animation must explain the idea being spoken.** Pick from `IDEA-TO-ANIMATION.md`. If no animation supports the sentence, show the plain one-word kinetic text (A02/A05) — never decorate. Before using an animation write one line in PLAN.md: `beat -> idea -> animation ID -> why it helps`.
2. **Sync.** A visual appears 0.35 s before to 0.15 s after its cue word (v4 rule A4 stays). Words appear at word-start minus 3 frames.
3. **Nothing is ever static.** Every scene has the slow camera drift from MOTION-PRINCIPLES (translate <=24 px + scale 1.00->1.04). Something changes at least every 3 s (v5 said 5 s; the new style is faster).
4. **Variety.** Never reuse the same animation ID within 4 consecutive scenes. Never 3 identical compositions in a row. Use at least 14 different animation IDs in a long-form video, 6 in a Short.
5. **Max 6 words on screen at once** (except a real screenshot's own text, a quote in a phone mock, or the A08 list cards). Words are short. No captions of the voiceover: show the idea, not the transcript.
6. **Red keyword**: 1 word per line, a word that was actually said, red from the first frame. Use `HV.red`.
7. **Real things are real.** Any site, tool, product, person, number-on-a-page: real screenshot via `capture.mjs` (Playwright) or licensed photo via `find-images.mjs`, `verified:true` + source + date (v4 C4/C5 unchanged). Never fake an earnings screenshot, a dashboard, a review or a notification that claims to be real. A notification banner (A19) is a *metaphor* only, with our own invented words ("Channel upgraded!"), never a real brand's alert claiming something happened.
8. **No drawn marks over footage or screenshots**: no arrows, circles, X marks, scribbles, underlines drawn on top of footage. Allowed: the system cursor (A-cursor, because it is a UI click), geometric diagram shapes that ARE the content (Venn circles, S-curve, bars), a green/red highlight box on a *word inside a caption*, and the strike-through inside a bubble.
9. **Layouts are centred** (except the two-column "heading + cards" A40 whose geometry is specified). Keep 96 px safe margin; nothing touches an edge except intentional camera-pan reveals that end inside the safe area.
10. **SFX**: none on text, lists, stats, steps, journey. Only `ui` on image/screenshot cards and `ding` on chapter cards. No music. (unchanged)
11. **Background** is always the supplied loop `D:\Youtube\Hena Vanta\Branding\Bg` (white grid, muted, black text). Copy to `public/hena-vanta/bg.mp4`. Never draw our own background, never add the macOS wallpaper from the reference videos, never a black/dark canvas. Dark screenshots sit inside a white window card (A11/A12) so the white page stays white.

## Footage notes (replaces black placeholders)

When the voiceover needs footage the user will add in the editor (gameplay, screen recording, b-roll):

* Render ONE text element: `<FootageNote label="SCREEN REC: Upwork proposal page being sent" />` (`src/components/FootageNote.tsx`).
* 20 px, Inter 500, colour `#8C8C93`, centred horizontally and vertically in the slot, single line (shorten if needed, max ~60 chars), no box, no background, no border, no drop shadow, no icon. Fade in with a 6-frame opacity ramp only.
* Slot = full frame by default (1920x1080 centre = 960,540). For a framed slot (e.g. inside a window) use its centre.
* Label format `TYPE: what to show` where TYPE in `GAMEPLAY | SCREEN REC | B-ROLL | PHOTO | FACE CAM | CHART`. Instruction wording, never spoken words, never "...", never "REPLACE-ME". Same label <=2 scenes.
* The text is small and light so the editor covers it with footage. It must sit at the exact centre so a centred clip hides it.
* Bare-footage budget (<=25% of runtime, <=6 s in a row) is unchanged, but "bare footage" now means a scene that contains only a FootageNote on the grid.
* Export every FootageNote to `placeholders.csv`: `timecode_in, timecode_out, TYPE, label`.

## Palette (Hena Vanta, adapted from the references)

Reference videos use a macOS rainbow wallpaper, Apple blue and glossy shadows. We keep the *shapes and motion*, swap the colour:

| Token | Hex | Used for |
|---|---|---|
| `ink` | `#0B0B0F` | all text, Venn strokes |
| `paper` | `#FFFFFF` | cards, windows (grid shows through the page, never replaced) |
| `red` | `#E01E2D` | keyword, strike-through, danger / "fails", Pay pill |
| `blue` | `#1673FF` | bubbles, stat pill, primary pill |
| `green` | `#27C75A` | growth, "works", badges (8x, 10x), highlight on caption word |
| `amber` | `#FFB020` | caution, "1x", list icon accent |
| `grey` | `#EDEDF0` | skeleton blocks, secondary bubble, menus |
| `mute` | `#8C8C93` | FootageNote, footnotes, ghost text |
Font: Inter (variable). Words 600-700, stat/pill 800, footnote italic 400. Sentence case, never ALL CAPS except a one-word warning (A48).

## Pipeline (unchanged from v4/v5 — keep using your existing scripts)

Your scripts live in the project: `import-timestamps.mjs`, `check-timing.mjs`, `build-timeline.mjs`, `capture.mjs`, `find-images.mjs`, `qa-frames.mjs`, `render.mjs`. This skill does not replace them; it replaces the *visual layer* (what each beat renders as). If a script name or flag differs in your repo, trust the repo and say so in the report.

Checklist (write `[x] item - evidence` for each; stop and report at the first impossible item; do not render until A–D are [x]):

**A. TIMING** A1 `import-timestamps.mjs --find` named the file. A2 imported as `timeline.raw.json` (`raw.source` starts `supplied:`), no re-transcribing. A3 `check-timing.mjs` output pasted, says TIMING OK. A4 every on-screen element has a cue word, appears -0.35..+0.15 s of it.

**B. CONTENT** B1 beats via `build-timeline.mjs`, every text written by you (no auto text, no voiceover captions). B2 every statement is a specific takeaway; none of "focus on the", "key takeaway", "distilled takeaway", "from the voiceover", "...", TODO. B3 1–2 red keywords per line, said words, red from frame 1. B4 every number / claim word (verified, best, official, only, never, always…) was said or has a source. B5 FootageNotes labelled `TYPE: what to show`; no label in >2 scenes. B6 bare footage <=25% runtime, <=6 s in a row, something changes <=3 s, no 3 identical compositions in a row, no animation ID repeated within 4 scenes, text-only scenes <=20%. B7 SFX only `ui` on image cards and `ding` on chapter cards.

**C. VISUALS** C1 no drawn marks (rule 8). C2 only catalog animations; every beat in PLAN.md has `idea -> animation ID -> why`. C3 story over time = ONE master journey (A53) with 3–8 events (label + note), one event per scene, line extends one event per scene, nothing revealed early. C4 real screenshot/photo for every named site/tool/product/person/page-number, rejected if blocked/denied/captcha/consent/blank, opened and `verified:true` with source+date, PASS/FAIL list. C5 failed captures become labelled FootageNotes and are reported. C6 PLAN.md filled (beat table, sources+licences, FLAGs, animation-ID column).

**D. QA + RENDER COMMAND** D1 `qa-frames.mjs --folder <folder>` = 0 failures, `qa/REPORT.md` pasted in full. D2 open every still (also +0.15 s and +0.45 s after each element starts) and check: centred, off edges, no overlap with footage slot, mid-state of the entrance visible (blur/scale in progress), drift present, journey not cropped, steps one at a time, real screenshots, red words red from frame 1, FootageNote exactly centred and 20 px. D3 `qa/review.json`; max 5 fix loops. D4 render command: write `render-command.txt` containing the exact render command, followed by loudness verification (`-14 LUFS ±1, true peak <= -1 dBTP`) and word-recovery verification (`>=98%` words recovered); NEVER auto-render the video. D5 `placeholders.csv`.

**FINAL REPORT**: full checklist with evidence; pasted QA report; counts (beats by animation ID, text-only %, bare footage %, images captured/failed/FLAG, SFX cues, distinct animation IDs used); list of every FootageNote with timecode; everything unverified + assumptions. Never say "done" or "QA passed" without the numbers. Do not publish.

**Finish Confirmation Block**: When the build is complete, always conclude your response with this exact summary block:
```text
=================== BUILD FINISH CONFIRMATION ===================
Validation (validate-v6.mjs) : <PASS / FAIL details>
QA Checks (qa-frames.mjs)   : <checks passed count / total>
Stills Viewed               : <count> viewed stills with concrete observations
Scene Count                 : <total scenes>
Total Runtime               : <runtime in seconds / minutes>
Footage Notes / Placeholders: <count> rows exported to placeholders.csv
Render Command Path         : <path to render-command.txt>
Style used: LOCKED, no skill changes made
=================================================================
```

## v6 build rules

1. **New Project Isolation**: NEVER reuse a previous project's scene components, `timeline.json`, `PLAN.md`, `review.json` or stills. Every v6 video MUST be built in a NEW folder: `D:\Automations\motion-studio\projects\hena-vanta-v6-<video-slug>\`, cloned from the scaffold only for `Root`/`package`/render plumbing. Old projects (e.g. `hena-vanta-upwork`) are strictly archives.
2. **v6 Timeline Schema (`src/timeline.v6.json`)**: `scenes[]` each with `{ id, start, end, anim: "A05" (A01-A64), props: {...}, words: [{text, time, color?, italic?, line?}], media?: {kind:"screenshot"|"footage", file?|label?}, sfx?: "ui"|"ding", idea, why }`. Words come directly from `timeline.raw.json` word times. A `SceneView` maps `anim` -> component from `src/hena-vanta`; unknown animation IDs fail the build.
3. **Old Taxonomy Banned**: The old v5 types `STACK`, `LIST`, `STEPS`, `JOURNEY` and the black `PlaceholderBox` are strictly forbidden in v6 projects. Missing footage = `FootageNote` only (`20px`, centered `#8C8C93`, no box).
4. **Automated Validation (`scripts/validate-v6.mjs`)**: Runs before QA and FAILS on:
   - Any scene without a valid catalog `anim` ID (`A01`–`A64`).
   - Text-only runtime $> 20\%$.
   - Same `anim` ID within 4 consecutive scenes.
   - Fewer than 14 distinct IDs (long-form) or 6 (shorts).
   - Fewer than 9 visual events in the first 15 s.
   - Hook with fewer than 5 distinct animation IDs.
   - Any color not in the HV palette (`#E01E2D` red, etc.; `#FF0000` is an automatic failure).
   - Any placeholder that is not a `FootageNote` (`20px`, `#8C8C93`, centered at `960, 540 ± 2px`, no box).
   - `FootageNote` types outside `GAMEPLAY | SCREEN REC | B-ROLL | PHOTO | FACE CAM | CHART`.
   - Forbidden brand strings (`ItsProger`, `Proger`, `5.5M`, `346,154`, `vidIQ`, `ViewStats`, `MrBeast`, `Wifies`, `Noob`).
   - Words on screen $> 6$.
   - Text $< 28\text{px}$ outside screenshots.
   - Prints full E1–E8 numbers report.
5. **v6 Placeholder Export**: `export-placeholders.mjs` must output v6 types (`GAMEPLAY`, `SCREEN REC`, `B-ROLL`, `PHOTO`, `FACE CAM`, `CHART`) reading media labels from `timeline.v6.json`.
6. **Mandatory Still Review (D2)**: D2 must be genuine. The agent must VIEW the stills (open the images, not pixel stats) and write one concrete observation per still in `qa/review.json`, with `problemsFound` and `fixed`. "Zero defects on the first pass" is rejected without 10+ viewed stills with concrete observations.

## Building a scene (recipe)

1. From the timed beat pick the idea type (`IDEA-TO-ANIMATION.md`), choose an ID, open `references/frames/<id>.jpg`.
2. Compose with `src/components/*` (each catalog entry names its component + props). If a component is missing, build it from `Pill`, `Card`, `Window`, `Bubble`, `Cursor`, `WordSync` — the catalog entry gives exact geometry.
3. Wrap in `<Scene>` (applies camera drift and the blur hand-off in/out).
4. Convert times with `sec(n)` = `Math.round(n*30)`. All frame numbers in the catalog are at 30 fps, 1920x1080. For Shorts (1080x1920 vertical, if the user's folder says `shorts`) scale x/y positions by the same proportions and keep text >= 64 px.
5. Add the beat to PLAN.md. Render a still at start, +0.15 s, +0.45 s and mid-scene for QA.
