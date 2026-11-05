---
description: Build a complete Hena Vanta video (long-form or shorts) using the hena-vanta v6 skill.
---

# Hena Vanta Video Production Workflow

Builds a complete, broadcast-ready Hena Vanta video in Remotion using the **hena-vanta (v6)** kinetic motion language on the white grid background.

## Arguments
- `folder`: The project folder under `D:\Youtube\Hena Vanta\Videos\<name>\` containing voiceover audio, time-stamped script, and `script.txt`.
- `format`: `long-form` (1920x1080, 30fps) or `shorts` (1080x1920, 30fps).

## Pre-flight Checks (MUST PASS BEFORE STARTING)
Before executing any generation step, verify the following files exist:
1. **Skill Folder**: `D:\Automations\motion-studio\.agents\skills\hena-vanta`
   - If missing, refuse to run: `"REFUSED: The skill folder D:\Automations\motion-studio\.agents\skills\hena-vanta is missing."`
2. **Background Loop**: `D:\Automations\motion-studio\.agents\skills\hena-vanta\public\bg.mp4`
   - If missing, refuse to run: `"REFUSED: The background file public/bg.mp4 is missing from the hena-vanta skill."`
3. **Channel Logo**: `D:\Automations\motion-studio\.agents\skills\hena-vanta\public\logo.png`
   - If missing, refuse to run: `"REFUSED: The channel logo public/logo.png is missing from the hena-vanta skill."`

If any of these three assets is missing, **STOP IMMEDIATELY**, state exactly which one is missing, and do NOT proceed.

### Asset Sync to Remotion Project (Runs at the Start of Every Run)
At the start of every run, use the exact project path that motion-studio uses for Remotion renders: `D:\Automations\motion-studio\projects\remotion-app`. If that path does not exist, STOP and ask the user; never create a new Remotion project.
Copy both assets into its `public/` folder:
1. Ensure `D:\Automations\motion-studio\projects\remotion-app\public\` directory exists.
2. Copy `D:\Automations\motion-studio\.agents\skills\hena-vanta\public\bg.mp4` -> `D:\Automations\motion-studio\projects\remotion-app\public\bg.mp4`.
3. Copy `D:\Automations\motion-studio\.agents\skills\hena-vanta\public\logo.png` -> `D:\Automations\motion-studio\projects\remotion-app\public\logo.png`.
4. Verify that both `D:\Automations\motion-studio\projects\remotion-app\public\bg.mp4` and `D:\Automations\motion-studio\projects\remotion-app\public\logo.png` exist on disk and are non-empty. If either is missing, refuse to proceed:
   `"REFUSED: Failed to verify <bg.mp4 | logo.png> in Remotion project public/ folder: D:\Automations\motion-studio\projects\remotion-app\public\"`

---

## Execution Instructions (from PROMPT-TEMPLATE.md)

### 1. Initialize & Read Order
Print as the first line of output:
`hena-vanta v6 loaded [version: v6, STYLE-LOCK: <DRAFT | LOCKED>]`

Read the following reference documents in exact order before writing any scene:
1. `SKILL.md`
2. `STYLE-LOCK.md` (if it exists)
3. `references/MOTION-PRINCIPLES.md`
4. `references/ANIMATION-CATALOG.md` (64 animations A01–A64; inspect reference frames in `references/frames/`)
5. `references/HOOK-PLAYBOOK.md` (first 15s hook recipe H1–H6)
6. `references/IDEA-TO-ANIMATION.md`

### 2. Work Through Checklist in Order (A1–D5)
For every item, write `[x] item - evidence` (number, file path, or quoted line). If an item fails, write `[ ] item - why` and stop. Do not render until A–D are `[x]`.

#### A. Timing
- [ ] A1: Found timing and voiceover files in the folder.
- [ ] A2: Glossary imported, spelling variants resolved in `timeline.raw.json`. No re-transcription.
- [ ] A3: `refine-timing.mjs` against voiceover + `check-timing.mjs` outputs TIMING OK.
- [ ] A4: Every on-screen element has a cue word appearing within -0.35s to +0.15s of it.

#### B. Content
- [ ] B1: Built beats with `build-timeline.mjs`, hand-authored all takeaways. No verbatim voiceover captions.
- [ ] B2: Every statement is a specific takeaway (<=4 words). No template phrases.
- [ ] B3: 1–2 red keywords per line, red from frame 1. Every word in transcript or `meta.allowWords`.
- [ ] B4: Every number/claim spoken in voiceover or verified with source.
- [ ] B5: Footage slots are single 20px centred grey text lines (FootageNote, no boxes, no fills).
- [ ] B6: Bare footage <= 25% of runtime, max bare run <= 6s. No 4 identical compositions in a row.
- [ ] B7: SFX only on image/chapter cards. No SFX on text. No music.

#### C. Visuals
- [ ] C1: No arrows, circles, X marks, or drawn marks over footage.
- [ ] C2: Kinetic elements attached to objects (bubbles, pills, windows, cards, cursor, Venn, journey).
- [ ] C3: One master journey timeline (if story over time), revealed progressively.
- [ ] C4: Verified real screenshots (0 blocked/captcha/blank pages).
- [ ] C5: Missing footage represented only as 20px centred grey text notes.
- [ ] C6: `PLAN.md` completed with idea -> animation ID -> rationale, hook recipe H1–H6.

#### D. QA and Render
- [ ] D1: `qa-frames.mjs` passed with 0 failures. Pasted `qa/REPORT.md`.
- [ ] D2: Opened every still at start, +0.15s, +0.45s, and mid-scene.
- [ ] D3: Wrote `qa/review.json` with >= 90% stills reviewed.
- [ ] D4: Rendered via `render.mjs` with -14 LUFS (+/- 1), true peak <= -1 dBTP, word recovery >= 98%.
- [ ] D5: Final report pasted.

---

### 3. Extra v6 Checks (E1–E8)
- **E1**: Distinct animation IDs used: (long-form >= 14, shorts >= 6).
- **E2**: No ID repeated within 4 consecutive scenes.
- **E3**: Text-only runtime <= 20%.
- **E4**: Visual events in first 15s: >= 9 (long-form), distinct hook IDs >= 5.
- **E5**: Every FootageNote: 20px, centred, grey, no box.
- **E6**: Mock UIs contain no invented numbers.
- **E7**: Every still opened at start, +0.15s, +0.45s, mid-scene.
- **E8**: Brand check: grep for forbidden reference creator strings ("ItsProger", "Proger", "5.5M", "346,154", "vidIQ", "ViewStats", "MrBeast", "Wifies", "Noob") = 0 hits; verified logo used.

