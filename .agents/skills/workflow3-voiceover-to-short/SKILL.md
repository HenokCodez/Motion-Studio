---
name: voiceover-to-short
description: Turns a user-supplied voiceover audio file into a finished 30-60 second vertical (1080x1920, 30fps) YouTube Short in a "tech explainer" motion-graphics style - black animated grid background, word-by-word captions, logo badges, screenshot cards, hub/orbit diagrams, bullets, big numbers and an end call-to-action - built with Remotion. After rendering it extracts frames, looks at its own video, and fixes defects. Use whenever the user uploads or mentions a voiceover/narration and wants a short, reel, vertical explainer or "video like the reference".
---

> [!IMPORTANT]
> NOT FOR HENA VANTA. Never use for the Hena Vanta channel.

# voiceover-to-short

You turn **one voiceover file** into **one finished vertical video**. You are NOT designing anything.
The design is already built (Remotion components in `template/`). Your job is to **fill in a JSON file**
(`storyboard.json`) correctly, render, look at the result, and fix mistakes.

> Read this file fully. Then read ONLY the reference file named in the step you are on.
> If something is not described here, the answer is "do the simplest allowed thing" - never invent new layouts.

---------------------------------------------------------------------------------------------------

## 0. The 12 laws (never break these)

1. **Canvas = 1080x1920, 30 fps, duration = voiceover length (target 30-60 s).** Never change it.
2. **Never edit `src/theme.ts` values, component files, or `types.ts`** unless step 8 proves a real bug. All normal work happens in `storyboard.json` + `public/`.
3. **Only the 12 media templates in `reference/02-scene-template-catalog.md` exist.** `NONE`, `HERO_CARD`, `CUTOUT`, `BADGE_LINE_CARD`, `HUB_SPOKES`, `ORBIT`, `BADGE_ROW`, `CARD_STACK`, `PROGRESS_BAR`, `WORDMARK`, `ICON_SCATTER`, `END_CTA`. Caption modes: `WORDS`, `BULLETS`, `BIG_STAT`, `NONE`.
4. **Never retime or re-split captions by hand.** `scripts/chunk.py` does it from the real audio. You only add `media` (and optionally convert a scene's caption to BULLETS / BIG_STAT).
5. **One scene = one caption chunk = about 1.5-4.5 s.** Something visibly new must appear at least every ~3 s.
6. **Background is always the black grid** (`public/grid_vertical.mp4`, from the user's Grid_1.mp4). No other background, no gradients, no colour backgrounds.
7. **Everything stays inside the safe zones** (`reference/01-style-bible.md` section 3). Media in the upper zone, captions in the lower zone, watermark at the bottom. Nothing overlaps.
8. **No text on top of photos/screenshots.** Words live in the caption zone only.
9. **Every image must be prepared** with `scripts/prep_images.py` before use (trimmed, sized, w/h known). Never use a raw download. Never stretch an image. Never use a blurry image.
10. **Use real, relevant images** (the actual product site, its real logo). If you cannot get a real one, use a letter badge (`"src": ""`, `"alt": "Slack"`) or `NONE` - do not use random unrelated pictures.
11. **Validate before rendering, QA after rendering** (`validate.py`, `qa.py`). Do not skip either.
12. **You must LOOK at your own render** (open the contact sheets as images) and fix problems, up to 3 passes, before telling the user it is done.

---------------------------------------------------------------------------------------------------

## 0.1 General rules (shared) & Conflict Resolutions

This workflow operates inside the Motion Studio workspace alongside Workflow 1 (Overlay Pipeline) and Workflow 2 (Infinite Whiteboard Explainer). The shared core production rules are defined in [AGENTS.md](file:///d:/Automations/motion-studio/AGENTS.md) and [.agents/rules/motion-studio.md](file:///d:/Automations/motion-studio/.agents/rules/motion-studio.md).

### Resolved Conflicts Between Workflow 3 Style and General Studio Rules:
1. **Aspect Ratio & Frame Canvas**:
   - *General Studio Rule*: 16:9 widescreen (1920x1080) for YouTube desktop long-form.
   - *Workflow 3 Style*: 9:16 vertical (1080x1920) for YouTube Shorts & mobile reels.
   - *Resolution*: Workflow 3's 1080x1920 vertical canvas wins.
2. **Clip Duration**:
   - *General Studio Rule (WF1)*: 5–8 seconds per motion graphic clip for Premiere Pro track V2/V3 overlays.
   - *Workflow 3 Style*: 30–60 seconds continuous short video.
   - *Resolution*: Workflow 3's 30–60s duration wins.
3. **Background Aesthetic & Transparency**:
   - *General Studio Rule (WF1)*: Alpha transparent ProRes 4444 (`yuva444p12le`) overlay.
   - *Workflow 3 Style*: Dark animated grid video (`public/workflow3/grid_vertical.mp4`).
   - *Resolution*: Workflow 3's animated black grid background wins.
4. **Caption Presentation**:
   - *General Studio Rule*: Minimal telemetry labels, system monospace chrome.
   - *Workflow 3 Style*: Fast word-by-word kinetic captions with bold keywords and active word ghosting.
   - *Resolution*: Workflow 3's kinetic word captions win for Shorts engagement.

### Universal Craft Rules Enforced Across All Workflows (General Rules Win):
1. **Hook & Pacing**: Visual hook in the first 1–2 seconds (Scene 1 must never be `NONE`). A visible change / transition at least every 2–4 seconds; one dominant concept per screen; zero static holds > 3.5s (`freezedetect` check in `qa.py`).
2. **Visual Hierarchy & Mobile Readability**: High-contrast typography; maximum 3–4 lines of text; safe zones strictly enforced keeping YouTube Shorts UI (top 150px, bottom 360px, right 120px) clear of vital content.
3. **Audio-Sync Precision**: Visual elements and word captions locked to actual speech timing (aligned via faster-whisper word timestamps, tolerance < 0.15s).
4. **Motion Physics**: Easing on every move (`spring()` or smooth cubic easing), zero linear tweens, zero jarring snaps, one primary motion at a time.
5. **Aesthetic Consistency**: Unified color palette (`#0a0a0a` background, `#F4F4F4` text, `#6B6B6B` ghost, clean card borders, genuine brand logos, zero clutter).
6. **Clean Audio**: Voiceover is primary, normalized, no clipping, zero leading/trailing silence gap > 0.3s.
7. **Delivery Quality**: H.264 + AAC, 1080x1920 @ 30fps, exact audio-video sync (+-0.25s), zero blank frames (`L.max() < 90` in `qa.py`).
8. **Autonomous Visual Inspection**: Final verification requires inspecting generated contact sheets (`qa/sheet_*.png`), not just passing script assertions.

---------------------------------------------------------------------------------------------------

## 1. What the user gives you / what you deliver

| Input | Where it goes |
|---|---|
| Voiceover audio (mp3/wav/m4a) | `public/voiceover.mp3` (convert with `ffmpeg -i in.wav -q:a 2 public/voiceover.mp3` if needed) |
| Optional: images, logos, screenshots, brand name/handle, CTA keyword | `raw/` folder (you create it) |
| Optional: topic notes | read them; otherwise infer topic from the transcript |

**Deliver:** `out/short.mp4` (H.264 + AAC, 1080x1920) + a 3-line summary (length, number of scenes, anything you could not source). Optionally suggest a title (<= 80 chars) and description with `#Shorts`.

If the user did not say a **brand/handle** for the watermark: leave `"brand": ""` (no watermark) and mention it. If the voiceover contains a call-to-action ("comment X", "follow"), the last scene is `END_CTA`; otherwise it is not.

---------------------------------------------------------------------------------------------------

## 2. Folder map (this skill)

```
SKILL.md                              <- you are here
reference/
  01-style-bible.md                   <- exact numbers: colours, sizes, zones, motion (the "why" behind template/)
  02-scene-template-catalog.md        <- the 12 media templates, JSON to copy, when to use each
  03-storyboard-guide.md              <- how to turn transcript scenes into media choices (+ full worked example)
  04-image-handling.md                <- how to find, clean and place photos/screenshots/logos/cutouts
  05-self-review-loop.md              <- how to watch your own render and fix it (checklists + symptom->fix table)
  06-troubleshooting.md               <- errors and fixes
  frames/A..E_*.jpg                   <- REFERENCE FRAMES. LOOK AT THEM (see step 4 and step 8)
template/                             <- Remotion code + example project files (copy into the project)
scripts/                              <- transcribe.py chunk.py prep_images.py validate.py qa.py render.sh frame_at.sh screenshot.mjs make_grid.sh
examples/storyboard.example.json      <- a complete valid storyboard (38.7 s, 14 scenes)
```

IMPORTANT about the reference frames: they come from third-party videos with a **light grey** background.
**Our version is the same layout on the black grid**: text is white, shadows are deeper, cards get a thin light border.
Copy the *layout, spacing, motion and word behaviour*, not the grey colour.

---------------------------------------------------------------------------------------------------

## 3. Pipeline (follow in order, do not skip)

### STEP 0 - One-time project setup (skip if `src/Short.tsx` already exists)
Follow `template/README.md`. Result: a Remotion project where this works:
`npx remotion still src/index.ts Short out/test.png --frame=60` -> a PNG with a black grid and caption text.
If the smoke test fails, read `reference/06-troubleshooting.md`. Do not continue until it passes.

### STEP 1 - Put the voiceover in place and transcribe
```bash
cp "<user file>" public/voiceover.mp3        # convert first if it is not mp3
python scripts/transcribe.py public/voiceover.mp3 --out words.json
```
Read the printed duration. If it is **< 28 s or > 62 s**, tell the user (still continue unless it is > 90 s).

### STEP 2 - Auto-chunk into scenes (deterministic)
```bash
python scripts/chunk.py words.json --audio voiceover.mp3 --brand "<handle or empty>" --out storyboard.json
```
This creates the scenes with exact timings and caption words (`note` shows the spoken text; bold words are pre-selected).
Every scene currently has `"media": {"type": "NONE"}`. **Your job is to replace those.**

### STEP 3 - Read the transcript and write `plan.md` BEFORE touching JSON
Read `reference/03-storyboard-guide.md` and `reference/02-scene-template-catalog.md`.
Create `plan.md` with one row per scene:

| scene | spoken text | template | caption mode | assets needed (what exactly) |
|---|---|---|---|---|

Rules for the plan (details in 03):
- Pick the template from the **decision table** in the catalog (what the narrator says -> template).
- **Use at least 5 different templates** in a 45 s video; never the same template 3 scenes in a row (except deliberate continuation, see `mediaKey`).
- Scene 1 must be a **visual hook** (a logo/badge scene or a strong card), never `NONE`.
- A list of 2-3 parallel things in one sentence -> `BULLETS`. A number/stat -> `BIG_STAT`. 3+ named products/tools -> `HUB_SPOKES` or `ORBIT`.
- Maximum 2 consecutive `NONE` scenes.

### STEP 4 - Look at the reference frames (mandatory, 1 minute)
Open and study `reference/frames/B_*.jpg`, `C_*.jpg`, `D_*.jpg`, `E_*.jpg`. For each template you chose, find its labelled frame.
That is what your result must resemble (positions, size of media, caption below it, watermark at bottom).
Open `A_caption_word_by_word.jpg` once to understand the caption behaviour (words arrive one by one, newest is grey, bold keywords).

### STEP 5 - Get and prepare the assets
Read `reference/04-image-handling.md`. Summary:
1. Make `raw/` (screenshots, photos), `raw_logos/` (logos), `raw_objects/` (product photos to cut out).
2. Use the user's files first. Otherwise capture real screenshots of official sites with the browser tool or `node scripts/screenshot.mjs <url> raw/<name>.png`. Download official logos (SVG/PNG from the brand's own site / press kit).
3. Clean them:
```bash
python scripts/prep_images.py raw/         --out public/img
python scripts/prep_images.py raw_logos/   --out public/img --logos
python scripts/prep_images.py raw_objects/ --out public/img --cutout     # needs rembg; else use PNGs that are already transparent
```
4. Read `public/img/manifest.json`: it gives `src`, `w`, `h`, a template `hint`, and warnings (LOW-RES etc.). Fix warnings (find a bigger image) or choose another template.

### STEP 6 - Fill in `storyboard.json`
For each scene, replace `"media"` with a **copy of the JSON snippet from the catalog** and paste in the `src/w/h` values from the manifest. Optionally change `caption` to BULLETS or BIG_STAT (snippets in the catalog; use the real word times from `words.json` / the scene's words for `at`/`statAt`).
Use `mediaKey` (same string on consecutive scenes) when the SAME visual should stay on screen across scenes.
Then:
```bash
python scripts/validate.py storyboard.json --public public
```
Fix every `ERROR` (and read every `warn`). Repeat until it prints `OK`.

### STEP 7 - Render
```bash
bash scripts/render.sh          # validate -> remotion render -> qa
```
Quick preview of single frames first if you want (fast): `npx remotion still src/index.ts Short out/p.png --frame=<N>` (N = seconds x 30).
To re-render only part of the video: `npx remotion render src/index.ts Short out/part.mp4 --frames=120-300` (this is only for checking; the final must be a full render).

### STEP 8 - Watch your own video and fix it  (read `reference/05-self-review-loop.md` NOW)
1. `qa.py` already created `qa/sheet_01.png ...` (3 frames per scene), `qa/report.json`, `qa/review.md`.
2. **Open every sheet image with the image viewer and look at it.** Compare each scene with the reference frame of the same template.
3. Fill in `qa/review.md` (PASS/FAIL per scene, with the exact fix).
4. Apply fixes **in `storyboard.json` first** (see the symptom->fix table). Only touch `src/` if a component is truly broken, and keep the change minimal.
5. Re-run `bash scripts/render.sh`. Repeat. **Max 3 passes.** After pass 3, report any remaining issue honestly.

### STEP 9 - Deliver
Give the user: path of `out/short.mp4`, duration, scene count, list of templates used, a list of anything imperfect (e.g. "no official logo found for X, used letter badge"), and the optional title/description.

---------------------------------------------------------------------------------------------------

## 4. Definition of DONE (all must be true)

- [ ] `validate.py` printed `OK` (warnings reviewed)
- [ ] `out/short.mp4` is 1080x1920, 30 fps, has audio, length matches the voiceover (+-0.25 s)
- [ ] `qa.py` reported no ERROR, and you personally looked at all contact sheets
- [ ] Every scene has a visual (or is one of max 2 consecutive `NONE`), captions fully readable, nothing cropped/overlapping/blurry
- [ ] First scene is a visual hook; if the voiceover has a CTA the last scene is `END_CTA`
- [ ] `qa/review.md` is filled in and every scene is PASS

## 5. If you are stuck

- Unsure which template? Use `HERO_CARD` (if you have a good screenshot/photo) or `BADGE_ROW`/`WORDMARK` (if you only have logos/names) or `NONE`. A simple correct scene beats a fancy broken one.
- Image not found? Letter badge or `NONE`. Never leave a missing file path - validate.py will fail.
- Component bug? Read `reference/06-troubleshooting.md`. Make the smallest possible fix, note it in your final summary.
