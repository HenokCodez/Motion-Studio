---
description: Build a complete Hena Vanta video (long-form or shorts) using the hena-vanta v6 skill. Trigger on /hena-vanta, 'Use the hena-vanta skill', 'use hena-vanta', HV6, 'Hena Vanta', or paths under D:\Youtube\Hena Vanta\. Never use for Vanta Brief or other channels.
---

# Hena Vanta Video Production Workflow

Builds a complete Hena Vanta video in Remotion using the **hena-vanta (v6)** kinetic motion language on the white grid background.

## Trigger Conditions
Triggers automatically when the user message contains:
- `"Use the \`hena-vanta\` skill"` (any capitalization, with or without backticks, e.g. `"Use the hena-vanta skill"`)
- `"use hena-vanta"` (any capitalization)
- `"/hena-vanta"`
- `"HV6"` (or `"hv6"`)
- `"Hena Vanta"` (or `"hena vanta"`)
- Any file or folder path under `D:\Youtube\Hena Vanta\`

### Anti-Triggers & Exclusions:
- Must **NOT** trigger on `"Vanta"`, `"Vanta Brief"`, `"my channel"`, `"make a video"`, `"shorts"`, or `"motion studio"` alone.
- **NEVER** trigger when another channel's skill is named (e.g. `workflow2-explainer-v2`, `voiceover-to-short`, `workflow4-editor-v1`).
- Never run for Vanta Brief or any other channel.

---

## Input Format & Parsing Rules

The workflow accepts this message format:
```text
Use the `hena-vanta` skill.
- Voiceover: <path to .wav/.mp3>
- Script: <path to script.txt, or the script pasted in the message>
- Format: long-form (16:9 1080p) or shorts (vertical)
- Background: <optional; a video from Branding\Bg; default = D:\Youtube\Hena Vanta\Branding\Bg\bg.mp4>
```

### Parsing & Pre-Flight Rules:
1. **Folder Derivation (`VIDEO_DIR`)**:
   - Derive `VIDEO_DIR` from the voiceover path.
   - Real layouts on disk:
     - `D:\Youtube\Hena Vanta\Videos\<name>\` OR
     - `D:\Youtube\Hena Vanta\Project FIle\Videos\<name>\AI\`
   - If a path does not exist, search both layouts for `<name>` and use the matching folder.
   - If multiple matching folders are found, ask the user ONE question to clarify.
2. **Voiceover**: `.wav` or `.mp3` audio.
3. **Script**:
   - If pasted directly, write it to `script.txt` in `VIDEO_DIR`.
   - If the script has timestamps, import them (`raw.source: "supplied:"`).
   - If the script lacks timestamps, align to voiceover audio and label `raw.source: "aligned:"`.
4. **Format**:
   - `"shorts"` = 1080x1920 vertical.
   - `"long-form"` = 1920x1080 horizontal.
   - If format is missing from the request, ask the user ONE question to clarify.
5. **Background**:
   - Optional; default is `D:\Youtube\Hena Vanta\Branding\Bg\bg.mp4` (or any video from `D:\Youtube\Hena Vanta\Branding\Bg\`).
   - Copy to `public/hena-vanta/bg.mp4` in the Remotion project.
6. **Assets & Output**:
   - Output folder: `VIDEO_DIR\output` (create it if missing).
   - SFX Library: `D:\Editor 2.0\SFX + Meme sounds`.
   - Channel Logo: `D:\Youtube\Hena Vanta\Branding\logo2.png` -> copy to `public/hena-vanta/logo.png`.
7. **Strict Non-Render Policy**:
   - **NEVER** render the final video: build the composition, run `validate-v6.mjs` + `qa-frames.mjs`, inspect the stills, then write `render-command.txt` (with loudness check `-14 LUFS, true peak <= -1 dBTP` and word-recovery check `>=98%`) and stop.

---

## Execution Sequence

### 1. Initialize & Mandatory Startup Confirmation
Always print the complete **Startup Confirmation Block** before any work:

```text
hena-vanta v6 loaded [v6.0 (final), STYLE-LOCK: LOCKED 2026-11-09]
Approved reference: projects\hena-vanta-v6-upwork-365
Checksums: OK / MISMATCH (list files)
Parsed input:
  Voiceover: <path> (found: yes/no, duration)
  Script: <path or pasted -> saved to ...> (timestamps: supplied / aligned)
  Format: long-form 1920x1080 / shorts 1080x1920
  Background: <file>
  VIDEO_DIR: <path>
  Output: <path>\output
  SFX folder: D:\Editor 2.0\SFX + Meme sounds
Skill files edited this run: none
Other channels' files touched: none
Render: NOT started (command will be in render-command.txt)
```

If checksums mismatch, STOP and ask the user before doing anything. If a required input is missing, ask ONE question.

When the build is done, conclude with the **Finish Confirmation Block**:
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

Read the following reference documents in exact order before writing any scene:
1. `SKILL.md`
2. `STYLE-LOCK.md` (if it exists)
3. `references/MOTION-PRINCIPLES.md`
4. `references/ANIMATION-CATALOG.md` (64 animations A01–A64; inspect reference frames in `references/frames/`)
5. `references/HOOK-PLAYBOOK.md` (first 15s hook recipe H1–H6)
6. `references/IDEA-TO-ANIMATION.md`

### 2. Work Through Checklist in Order (A1–D5)
For every item, write `[x] item - evidence` (number, file path, or quoted line). If an item fails, write `[ ] item - why` and stop.

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

#### D. QA and Render Command
- [ ] D1: `qa-frames.mjs` passed with 0 failures. Pasted `qa/REPORT.md`.
- [ ] D2: Opened every still at start, +0.15s, +0.45s, and mid-scene.
- [ ] D3: Wrote `qa/review.json` with >= 90% stills reviewed.
- [ ] D4: Wrote `render-command.txt` with loudness verification (`-14 LUFS ±1, true peak <= -1 dBTP`) and word recovery (`>=98%`); video NOT auto-rendered.
- [ ] D5: Exported `placeholders.csv` and `placeholders.edl.txt`.

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
