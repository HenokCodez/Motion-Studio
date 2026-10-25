# Premiere Pro 60-Second Automated Video Editing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully automated 60-second proof-of-concept pipeline in a clean, self-contained folder that cuts audio silences, composites background layers, animated text, images, memes, SFX, background music, and 3 transparent Remotion motion graphics into a real, fully editable Adobe Premiere Pro timeline.

**Architecture:** A Python-based silence cutter and timeline assembler that analyzes Whisper word timestamps and audio waveforms, cuts silences, renders 3 transparent Remotion motion graphics, maps images/memes/SFX to narrative beats, and generates an industry-standard FCP 7 / Premiere XML Interchange file (`.xml`) with absolute local media links. When opened in Premiere Pro, it instantiates a native sequence across 3 video tracks (V1–V3) and 3 audio tracks (A1–A3).

**Tech Stack:** Python 3.10, `pydub`, `faster-whisper`, Remotion (React + TypeScript, ProRes 4444 with alpha), XML DOM (`xml.etree.ElementTree`), Adobe Premiere Pro 2024.

**Folder Isolation:** All generated test assets, rendered clips, audio cuts, and project files reside exclusively within `Videos/premiere-poc-60s/`.

---

## Global Constraints
- Target Duration: 60.0 seconds (trimmed from first 65s of Episode 003 audio).
- Frame Rate: Strictly 30.0 fps (1800 total frames).
- Resolution: 1920x1080 (16:9 widescreen).
- Tracks:
  - Video Track 1 (V1): Matte background & ambient loop.
  - Video Track 2 (V2): Visual b-roll, logos, product screenshots, and video memes.
  - Video Track 3 (V3): 3 transparent Remotion motion graphic overlays (alpha channel).
  - Video Track 4 (V4): Kinetic text callouts.
  - Audio Track 1 (A1): Narration with silences removed (>0.35s cut out).
  - Audio Track 2 (A2): SFX (whooshes, pops, impacts, meme punch audio).
  - Audio Track 3 (A3): Background music (ducked to -22dB during speech).
- All media paths in XML must use valid absolute `file://localhost/...` URLs to ensure zero "Media Offline" dialogs.

---

### Task 1: Scaffolding the Isolated POC Workspace & Slicing Voiceover

**Files:**
- Create: `Videos/premiere-poc-60s/project.json`
- Create: `Videos/premiere-poc-60s/assets/audio/voice/audio_60s.mp3`
- Create: `scripts/audio_silence_cutter.py`
- Output: `Videos/premiere-poc-60s/timeline/cuts_manifest.json`

**Interfaces:**
- Consumes: `Channels/VantaBrief/videos/003-Open-Source-Is-Taking-Over-Software-in-2026/assets/audio/voice/audio.mp3` and `transcripts/transcript.words.json`
- Produces: `audio_60s.mp3` (60s slice), silence-trimmed speech segments with exact frame timestamps in `cuts_manifest.json`.

- [ ] **Step 1: Create isolated folder structure**
  Create `Videos/premiere-poc-60s/` with `assets/`, `renders/`, `timeline/`, `transcripts/`.
- [ ] **Step 2: Slice the first 65 seconds of narration**
  Slice 0.0s to 65.0s of `audio.mp3` to `Videos/premiere-poc-60s/assets/audio/voice/raw_sample.mp3` using `ffmpeg`.
- [ ] **Step 3: Implement `scripts/audio_silence_cutter.py`**
  Filter Whisper word timestamps for the 60s slice. Detect pauses > 0.35s between words, ripple-trim them to 0.15s natural conversational pauses, and output the tightened audio track and segment map.
- [ ] **Step 4: Verify trimmed audio duration and playback**
  Verify the output audio is cleanly trimmed with zero pops.

---

### Task 2: Rendering 3 Remotion Motion Graphics with Alpha Transparency

**Files:**
- Create: `projects/remotion-app/src/compositions/poc/`
- Render to: `Videos/premiere-poc-60s/renders/remotion_mg1.mov`
- Render to: `Videos/premiere-poc-60s/renders/remotion_mg2.mov`
- Render to: `Videos/premiere-poc-60s/renders/remotion_mg3.mov`

**Interfaces:**
- Consumes: Remotion engine in `projects/remotion-app/`
- Produces: 3 ProRes 4444 transparent `.mov` video clips:
  1. `remotion_mg1.mov`: Dynamic Stack / Title Hook ("In 2026... Zero Subscriptions") (~120 frames / 4s).
  2. `remotion_mg2.mov`: ArtCraft vs Adobe Architecture Breakdown (~150 frames / 5s).
  3. `remotion_mg3.mov`: Comparison Callout / Open Source Momentum Card (~150 frames / 5s).

- [ ] **Step 1: Set up the 3 Remotion compositions with transparent background**
  Ensure background colors are transparent (no solid matte) so video layers underneath show through.
- [ ] **Step 2: Render each composition via `studio.py render-remotion`**
  Use `--transparent` flag (Apple ProRes 4444, `yuva444p10le`, png image format).
- [ ] **Step 3: Verify alpha transparency via `ffprobe`**
  Verify pixel format contains alpha channel (`yuva444p10le` or `yuva420p`).

---

### Task 3: Curating Visuals, Memes, SFX, and Background Music

**Files:**
- Output: `Videos/premiere-poc-60s/assets/manifest.json`

**Interfaces:**
- Consumes: `D:\Editor 2.0\Meme Clips`, `D:\Editor 2.0\SFX + Meme sounds`, `D:\Editor 2.0\Music`, and Episode 003 assets.
- Produces: Local linked copies or verified paths:
  1. Background loop: dark textured background graphic or looping ambient.
  2. Images: `artcraft_ui.jpg`, `premiere.svg`, `photoshop.svg`, `blender.svg`, `davinci.svg`, `kokoro_github.png`.
  3. Memes: 2 video memes from `D:\Editor 2.0\Meme Clips` (e.g. `Michael Rosen - Nice.mp4`, `HEHE BOI.mp4` or `Angry gamer.mp4`).
  4. SFX: 6 transition & accent sound effects (whoosh, pop, click, impact).
  5. Music: 1 high-quality background music track trimmed and ducked.

- [ ] **Step 1: Select and prepare background and b-roll assets**
- [ ] **Step 2: Select and place meme video clips and SFX**
- [ ] **Step 3: Prepare background music track**

---

### Task 4: Timeline Assembler (FCP 7 / Premiere XML Generator)

**Files:**
- Create: `scripts/premiere_timeline_assembler.py`
- Output: `Videos/premiere-poc-60s/premiere_test_60s.xml`

**Interfaces:**
- Consumes: Audio cut segments, visual asset manifests, Remotion renders, SFX, music.
- Produces: `premiere_test_60s.xml` conforming to FCP 7 / Premiere XML schema.
  - Video Track 1 (V1): Background plates.
  - Video Track 2 (V2): B-roll, UI screenshots, Logos, and Video Memes.
  - Video Track 3 (V3): 3 Remotion transparent motion graphics overlays.
  - Audio Track 1 (A1): Ripple-cut narration voiceover.
  - Audio Track 2 (A2): SFX aligned to cuts and animations.
  - Audio Track 3 (A3): Background music track with volume levels.

- [ ] **Step 1: Write `scripts/premiere_timeline_assembler.py`**
- [ ] **Step 2: Generate `premiere_test_60s.xml`**
- [ ] **Step 3: Validate XML syntax, timebase, and file path URLs**

---

### Task 5: Premiere Pro Verification & Project Launcher

**Files:**
- Create: `Videos/premiere-poc-60s/open_in_premiere.bat`
- Output: Verified Premiere Pro session with all tracks populated.

- [ ] **Step 1: Create launcher script that opens `premiere_test_60s.xml` in Adobe Premiere Pro 2024**
- [ ] **Step 2: Execute launch and confirm Premiere Pro opens without errors**
- [ ] **Step 3: Deliver final report and checklist to user**

