# Hena Vanta Channel Lock Rule

> [!IMPORTANT]
> Applies EXCLUSIVELY to Hena Vanta. Never apply to Vanta Brief or any other channel. No other skill, workflow, template, or motion studio style may be used, mixed in, or borrowed from.

## 1. Trigger Conditions
This rule, the `hena-vanta` skill, and the `/hena-vanta` workflow MUST start when a user message contains any of the following:
- `"Use the \`hena-vanta\` skill"` (any capitalization, with or without backticks, e.g., `"Use the hena-vanta skill"`)
- `"use hena-vanta"` (any capitalization)
- `"/hena-vanta"`
- `"HV6"` (or `"hv6"`)
- `"Hena Vanta"` (or `"hena vanta"`)
- Any file or directory path under `D:\Youtube\Hena Vanta\`

### Anti-Triggers & Prohibitions:
- They must **NOT** start on generic phrases alone: `"Vanta"`, `"Vanta Brief"`, `"my channel"`, `"make a video"`, `"shorts"`, or `"motion studio"` alone.
- **NEVER** start when the message names another channel's skill (e.g. `workflow2-explainer-v2`, `voiceover-to-short`, `workflow4-editor-v1`, or requests a Vanta Brief video).
- If the request names a different channel style or skill, ask ONE question before doing anything. Never silently switch.

## 2. Mandatory Startup Confirmation Block
Every Hena Vanta run must begin with this exact block, filled with real values, before any work:

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

## 2.1. Mandatory Build Finish Confirmation Block
When the build is done, conclude with this exact block:
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

## 3. Mandatory Input Format & Parsing Rules
The skill accepts and executes the complete workflow from this message format:
```text
Use the `hena-vanta` skill.
- Voiceover: <path to .wav/.mp3>
- Script: <path to script.txt, or the script pasted in the message>
- Format: long-form (16:9 1080p) or shorts (vertical)
- Background: <optional; a video from Branding\Bg; default = D:\Youtube\Hena Vanta\Branding\Bg\bg.mp4>
```

### Execution Rules for Inputs:
- **Folder Derivation (`VIDEO_DIR`)**:
  - Derive `VIDEO_DIR` from the voiceover path.
  - The actual folder layout on disk may be:
    - `D:\Youtube\Hena Vanta\Videos\<name>\` OR
    - `D:\Youtube\Hena Vanta\Project FIle\Videos\<name>\AI\`
  - If a specified path does not exist, search both layouts for `<name>` and use the match.
  - Ask the user ONE question only if there are multiple directory matches.
- **Voiceover**: `.wav` or `.mp3` audio file.
- **Script**:
  - If the script is pasted into the prompt, save it as `script.txt` in `VIDEO_DIR`.
  - If the script contains timestamps, import them and label `raw.source: "supplied:"`.
  - If the script lacks timestamps, align it to the voiceover audio (via Whisper / forced alignment) and label `raw.source: "aligned:"`.
- **Format**:
  - `"shorts"` = 1080x1920 vertical.
  - `"long-form"` = 1920x1080 horizontal.
  - If missing from the message, ask the user ONE question to clarify.
- **Background**:
  - Optional; default is `D:\Youtube\Hena Vanta\Branding\Bg\bg.mp4` (or any video under `D:\Youtube\Hena Vanta\Branding\Bg\`).
  - Copy to `public\hena-vanta\bg.mp4` in the Remotion project.
- **Output & Asset Paths**:
  - Output folder: `VIDEO_DIR\output` (create it if missing).
  - SFX Library: `D:\Editor 2.0\SFX + Meme sounds`.
  - Channel Logo: `D:\Youtube\Hena Vanta\Branding\logo2.png` -> copy to `public\hena-vanta\logo.png`.
- **Non-Render Policy**:
  - **NEVER** render the video: build, execute `validate-v6.mjs` + `qa-frames.mjs`, inspect the stills, then write `render-command.txt` (with loudness check `-14 LUFS, true peak <= -1 dBTP` and word-recovery check `>=98%`) and stop.

## 4. Execution Sequence & Safeguards
- Before starting any video, read in order: `SKILL.md`, `STYLE-LOCK.md` (if it exists), `references/MOTION-PRINCIPLES.md`, `ANIMATION-CATALOG.md`, `HOOK-PLAYBOOK.md`, `IDEA-TO-ANIMATION.md`.
- Never edit anything inside the skill folder, `STYLE-LOCK.md`, or this rule unless the user says the exact words `"update the skill"`. Suggest changes in `PLAN.md` instead.
- Never copy names, logos, avatars, thumbnails or numbers from the reference images (they belong to other creators; see Brand Rule in `SKILL.md`).
