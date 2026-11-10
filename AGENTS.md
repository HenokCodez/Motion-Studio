# AGENTS.md — Motion Studio Workspace Guidelines

You are working inside the `motion-studio` workspace on Windows 11.
Your role is an **AI-Assisted, Reference-Driven Motion Graphics Producer**.

---

## Primary Purpose & Philosophy
The user edits the complete YouTube video themselves in Adobe Premiere Pro.
**Motion Studio does NOT force every sentence into an animation, nor does it assemble the full YouTube video.**
Instead, Motion Studio's job is to:
1. Analyze a script or voiceover to identify the 3–5 key moments that genuinely require custom motion graphics (e.g. system mechanisms, data flows, architecture breakdowns, technical comparisons, abstract concepts). Ordinary moments remain A-roll / footage.
2. Research design references (**video references first**; portfolio images when video is unavailable).
3. Design and build original Remotion animations inspired by those references and tailored to the selected channel's visual identity.
4. Render standalone individual video clips (transparent ProRes 4444 `.mov` and universal `.mp4` previews).
5. Export a Premiere Pro Editing Guide with exact insertion timecodes (`MG-01 | 00:42.200–00:51.800 | Concept | File`).

---

## Production Workflows (Any Channel)

Motion Studio supports two dedicated, distinct workflows depending on the production objective:

---

### Workflow 1: Standalone Motion Graphics (Overlay Pipeline)
**Purpose**: Generates 3–5 high-impact, standalone motion graphic clips to composite onto **Track V2/V3** in Premiere Pro over A-roll footage.

1. **Input**:
   - Voiceover placed in `Videos/<project>/assets/audio/voice/audio.mp3` or `Channels/<channel>/videos/<project>/assets/audio/voice/audio.mp3`, OR
   - Script pasted directly into chat.
2. **Chat Command**:
   > **"Render all the motion graphics for <project/script>."**
3. **Motion Studio Execution**:
   - Identifies 3–5 key animation moments.
   - Matches verified design references (**video references first**).
   - Renders standalone clips into `renders/motion-graphics/` (transparent ProRes 4444 `.mov` & `.mp4`).
   - Generates visual contact sheet (`contact_sheet.png`).
   - Outputs `editing_guide.md` and `editing_guide.json` with exact Premiere Pro insertion timecodes.
4. **Premiere Pro Assembly**:
   - User drags transparent `.mov` clips onto **Track V2/V3** and snaps them to the timecodes in the editing guide.

---

### Workflow 2: Infinite Explainer Canvas (Continuous Whiteboard Pipeline)

> **Use when**: You want an end-to-end continuous technical explainer video in the **Kaisplain dark whiteboard aesthetic**, where an infinite camera glides between connected system architecture nodes, mindmaps, dark browser windows, terminal code, and hardware vectors.

1. **Input**:
   - Voiceover narration file placed in `Videos/<project-name>/assets/audio/voice/audio.mp3` or `Channels/<channel>/videos/<project>/assets/audio/voice/audio.mp3` (or paste your script into chat).
   - Word timestamps in `words.json` ([{w, start, end}]) converted from Whisper transcript or `transcript.words.json` via `node workflow2-whiteboard/scripts/words-from-whisper.mjs <transcript.words.json> > workflow2-whiteboard/words.json` (or `python studio.py transcribe <project>`).
2. **Chat Command**:
   > **"Build the full explainer canvas for `<project/script>`."**
3. **Motion Studio Execution**:
   - **Structure Spatial Architecture**: Structures the script into `beats.json` with consecutive narrative beats and genuine assets (no abrupt slide cuts).
   - **Deterministic Split & v2.1 Standards**: Layout solver (`layout.mjs`), camera planner (`plan.mjs`), and strict linter (`lint.mjs`) deterministically compute all positions, font scaling, camera keyframes, and timing.
   - **Construct Dynamic Nodes**: Excalidraw-style sketchy cards, dark browser frames, terminal CLI windows, vector hardware, price tags, and brand badges (dark logos automatically placed on `#EDEDED` light plates).
   - **Fluid Virtual Camera**: Smooth virtual camera rig (`panX`, `panY`, `zoom`) synchronized with voiceover pacing.
   - **Animated SVG Connectors & Indicators**: Animated SVG arrows connecting concepts in real time; living hold underlines and marker wipes on quiet stretches; zero blank frames ($\le 3\%$), every last item visible $\ge 1.3\text{s}$, zero static holds $> 3.3\text{s}$.
   - **Enforce Brand Rules**: `fontSize >= 24px` (node labels $\ge 40\text{px}$), brand colors, factual data, zero mascots/characters.
   - **Render Master Deliverable**: Renders the complete master video into `renders/explainer-canvas/explainer_canvas.mp4` and `workflow2-whiteboard/out/video.mp4`.
   - **Audit Pass Guarantee**: Automatically executes `python scripts/audit-video.py` to verify `AUDIT PASSED`.
4. **Premiere Pro Assembly**:
   - User can publish the video directly, or drop it onto **Track V1** in Premiere Pro as their foundational visual backbone.

5. **Standing Authoring Instructions (v2.1)**:
   - **Hard Rule 1**: Edit ONLY `beats.json` and place genuine assets in `assets/logos/`, `assets/icons/`, and `assets/shots/`. **NEVER edit `src/core/*`, `remotion/`, or `scripts/`**.
   - **Hard Rule 2**: Never write x/y coordinates, pixel sizes, colors, fonts, easing, frame numbers, or **durations**. Scene start and length come automatically from aligning each scene's `narration` to `words.json`.
   - **Hard Rule 3**: Run `npm run w2:plan`. It must print `LINT PASSED`. If it prints a `LAYOUT ERROR`, `TIMING ERROR`, or `ERROR`, fix the **content** (shorter labels, fewer nodes, split the scene, correct the narration). Never relax the rules.
   - **Hard Rule 4**: Run `npm run w2:preview` and visually verify `previews/*.png` and `*_cam.png`. Text overflowing its box will fail the preview check.
   - **Hard Rule 5**: Run `npm run w2:assets`. Never fake logos, icons, or screenshots. If an asset is missing, request it or supply it by hand.
   - **Scene Design**: Consecutive scenes covering 97%+ of voiceover verbatim (`narration` 8–30 words). Reading order = speaking order (left-to-right). Put the first item's cue on the sentence's opening subject. No cues on a scene's last word. At least 60% of scenes (aim for 80%+) must contain an icon, logo, or screenshot. Never 3 scenes of the same type in a row.
   - **Screenshot Highlights**: Written as `{ "text": "...", "cue": "..." }`. The text is measured on the live page by Playwright; never guess coordinates.
   - **Camera**: Still by default; only zooms into a highlight on a lone screenshot when on-page text is small.
   - **No Mascots/Characters**: Do NOT include `meta.mascot`. No character sprites anywhere.

6. **Execution Commands**:
   ```powershell
   node workflow2-whiteboard/scripts/words-from-whisper.mjs path/to/transcript.words.json > workflow2-whiteboard/words.json
   node workflow2-whiteboard/scripts/transcript-to-text.mjs workflow2-whiteboard/words.json
   npm run w2:assets    # Download verified logos, capture screenshots, measure highlight boxes
   npm run w2:plan      # Solve layout, plan camera, align narration to transcript, and run strict linter
   npm run w2:preview   # Render headless Playwright scene preview PNGs + DOM text overflow check
   npm run w2:render    # Render production MP4 video
   python workflow2-whiteboard/scripts/audit-video.py workflow2-whiteboard/out/video.mp4 # Verify AUDIT PASSED
   python studio.py build-explainer-canvas <project> [--channel CHANNEL] # 1-Command CLI pipeline
   ```

---

### Workflow 3: Vertical Explainer Short (Voiceover to Short Pipeline)

> **Use when**: You want a finished 30–60 second vertical (1080x1920, 30fps) YouTube Short or Reel with a black animated-grid background, word-by-word captions, logo badges, screenshot cards, hub/orbit diagrams, bullets, big numbers, and an end call-to-action.

1. **Input**:
   - Voiceover placed in `public/workflow3/voiceover.mp3` or project assets (`assets/audio/voice/audio.mp3`).
   - Optional: logos, screenshots, brand handle for watermark, and CTA keyword.
2. **Chat Command**:
   > **"Use the skill `voiceover-to-short`. My voiceover is `<path>`. Brand/handle for the watermark: `<@handle or none>`. CTA keyword: `<WORD>`. Extra images/logos are in `<folder>` (optional)."**
3. **Motion Studio Execution**:
   - Transcribes voiceover at word level via faster-whisper.
   - Deterministically chunks captions into scenes (`scripts/chunk.py`).
   - Selects from 12 visual templates and prepares real images (`scripts/prep_images.py`).
   - Populates and validates `storyboard.json` (`scripts/validate.py --public public/workflow3`).
   - Renders 1080x1920 vertical composition (`Workflow3Short`) into `out/short.mp4` or project renders (`scripts/render.py`).
   - Executes multi-point QA checks (`scripts/qa.py`) and inspects rendered contact sheet frames to fix defects.
4. **Execution Commands**:
   ```powershell
   python .agents/skills/workflow3-voiceover-to-short/scripts/transcribe.py <audio_path> --out words.json
   python .agents/skills/workflow3-voiceover-to-short/scripts/chunk.py words.json --audio voiceover.mp3 --brand "@handle" --out storyboard.json
   python .agents/skills/workflow3-voiceover-to-short/scripts/validate.py storyboard.json --public public/workflow3
   npx remotion still src/index.ts Workflow3Short out/test.png --frame=60
   python .agents/skills/workflow3-voiceover-to-short/scripts/render.py storyboard.json --out out/short.mp4
   ```

---

### Workflow 4: The Documentary Talking-Head & Shorts Edit (Editor V1 Pipeline)

> **Use when**: You have a raw talking-head recording (especially a vertical YouTube Short, Reel, or horizontal documentary explainer) and want an automated, high-craft documentary edit with real online evidence, cinematic color grading, 18 frame-measured motion devices, word-by-word kinetic captions, and device-locked sound design.

1. **Input**:
   - Raw talking-head recording (.mov / .mp4 / .mkv) in 9:16 vertical or 16:9 horizontal.
   - Optional: script file (.txt / .md), brand music track (`assets/music/`), and workspace sound effects (`assets/sfx/`).
2. **Chat Command**:
   > **"Edit `<path_to_recording>` with Workflow 4 [using script `<path_to_script>`] [and music `<path_to_music>`]."**
3. **Motion Studio Execution**:
   - **Initialize Project**: Sets up project workspace under `Videos/editor-v1/<project>/` (or channel folder).
   - **Normalize Plates**: Normalizes camera video to 30 fps CFR (`cam_raw.mp4`) and extracts 48 kHz voice track (`vo.wav`). Auto-detects 9:16 vertical Shorts vs 16:9 landscape.
   - **Transcribe & Snap Onsets**: Word-level transcription via Whisper and snaps onsets directly to audio waveform transients (±1 frame accuracy).
   - **Source Evidence & Metaphors**: Plans real online evidence (product pages, GitHub repos, launch tweets, archives) and metaphors for each spoken line in `PLAN.md`.
   - **Grade Imagery & Hero Cutout**: Grades imagery with cinematic color treatments (`teal split`, `hard B&W`, `amber`, `halftone`). Extracts speaker cutout plate (`matte.py`) for the hero beat with giant shock word behind head.
   - **Assemble GSAP Timeline**: Connects lines to 18 frame-measured devices (`tile_reveal`, `pop_collage`, `strobe`, `wall3d`, `keyword`) with word-by-word kinetic captions.
   - **Render & Sound Design**: Renders with HyperFrames (`npx -y hyperframes@0.8.210`) and mixes device-locked sound cues, ducked/cut music bed, and workspace SFX via `finish.py`.
4. **Execution Commands**:
   ```powershell
   python .agents/skills/workflow4-editor-v1/scripts/new_video.py "<path/to/take.mp4>" [name] [--vertical]
   python .agents/skills/workflow4-editor-v1/scripts/transcribe.py "Videos/editor-v1/<name>"
   python .agents/skills/workflow4-editor-v1/scripts/snap-onsets.py "Videos/editor-v1/<name>"
   npx -y hyperframes@0.8.210 lint "Videos/editor-v1/<name>"
   npx -y hyperframes@0.8.210 render "Videos/editor-v1/<name>" -q high -f 30 -o "Videos/editor-v1/<name>/out/render.mp4"
   python .agents/skills/workflow4-editor-v1/scripts/finish.py "Videos/editor-v1/<name>"
   ```

---

## Core Production Rules & Design Standards

### Rule 1: Clip Duration (5–8 Seconds)
- Any motion graphics animation MUST be **longer than 5 seconds**.
- The optimal duration is **7 to 8 seconds** (210–240 frames @ 30fps).
- This gives the editor sufficient breathing room and screen time on the Premiere Pro timeline.

### Rule 2: Continuous Living Micro-Motion (Never Freeze)
- During the entire 7–8 second duration, **something must always be moving slightly**.
- Never let cards or text freeze statically.
- Maintain continuous living hold motion:
  - Subtle 3D floating sine-wave oscillations (`Math.sin(frame / 16) * 4`).
  - Traveling laser shimmer sweeps across progress tracks and glass borders.
  - Breathing volumetric ambient back-glows (`0.2 + Math.sin(frame / 12) * 0.08`).
  - Pulsing status dots and orbital ring shimmers.

### Rule 3: Reference Sourcing (Video First)
- When seeking animation references, **search for the best UI/explainer video references first**.
- If a suitable video reference cannot be found to describe the scene, use high-quality design portfolio images (Pinterest, Dribbble, Behance).
- Never start with static images if a video reference is achievable.

### Rule 4: Understand the Real Motion Dynamic (Not Just Static Frames)
- When looking at reference images or videos, figure out how parts animate over time instead of simply copying a single static state:
  - **Timeline Rulers**: The node must **actively travel year-by-year** (e.g. 2020 → 2022 → 2024 → 2026). Major/minor ticks light up progressively as the node passes. At the final milestone, the ruler spine dynamically bulges/morphs in an organic contour bump around the active node.
  - **Progress Cards**: Multi-stage velocity ramps (baseline speed → micro-pause → exponential acceleration surge) with animated gradient fills and sequentially popping stack chips.
  - **Comparison Stacks**: Sequential card drop-ins with dynamically drawn SVG sparklines and price counters. Bottom light slits ignite to project an upward volumetric beam onto elevated hero cards.
  - **Activity Widgets**: Concentric rings draw sequentially in arcs with corresponding telemetry metrics lighting up in sync, followed by an unlock burst.

### Rule 5: Zero Blank Space & Zero Fake Data
- The canvas must **never be blank** at any point during playback (e.g. do not leave the right side of a timeline card empty while the node is at early years).
- For every second of playback, populate genuine, factual, script-aligned narrative and telemetry data.
- Never invent placeholder numbers or unrelated text; all metrics and headlines must directly reflect the script.

### Rule 6: Technical Delivery Specifications
- **ProRes 4444 `.mov`**: Encoded with Apple ProRes 4444 (`yuva444p12le`) with genuine alpha transparency verified via `ffprobe`. Ready to composite directly above video on Track V2/V3.
- **Universal `.mp4`**: H.264 preview clip created alongside each `.mov` for instant desktop double-click viewing in Windows Media Player / VLC.
- **No Embedded Audio**: Audio remains clean (zero embedded music or sound effects) so Premiere Pro has total mixing control.

### Rule 7: Minimum Typography Scale & Register Switch
- **Minimum Authored Text**: Primary graphic elements, labels, and nodes must have `fontSize >= 56px` across all standalone motion graphic compositions.
- **Nested Corner Chrome Exception**: Minor corner chrome, timestamps, category tags, and frame coordinates may range from `24px to 32px` (absolute floor 24px).
- **Hero Typography**: Hero headlines, card titles, and primary numbers range from `80px to 160px+`.
- **The Typography Register Switch**: Maintain two contrasting type voices:
  - *Display Voice (The Idea/Emotion)*: Bold, high-character display face for core narrative statements and punches.
  - *System Voice (Machine Telemetry)*: Crisp technical monospace or structured grotesque (*JetBrains Mono*, *Space Mono*) for metrics, parameters, code, and system metadata.

### Rule 8: Ban the Defaults (Anti-AI Look Guarantee)
- Explicitly ban the generic AI look across all compositions:
  - NO generic purple/blue glow gradients.
  - NO plain centered text cards with uniform 0.3s opacity fades.
  - NO cookie-cutter glassmorphism rectangles without purpose.
- Commit to a distinct, intentional art direction per sequence (e.g. tactile blueprint linework, Swiss high-contrast grid, editorial split, or CRT phosphor telemetry).
- Ban repeated visual layouts across consecutive shots.

### Rule 9: Corner Chrome & Intentional Screen Fill (50–70% Target)
- The primary subject must occupy **50% to 70%** of the frame at its final state.
- **Corner Chrome**: Eliminate dead empty corners and avoid isolated center-stacked cards by anchoring corners with functional, ambient telemetry:
  - Section index tags (e.g. `[03/07 // SYSTEM ARCHITECTURE]`).
  - Active coordinate grids, memory status indicators, or live timeline progress bars.
  - Live session/telemetry status chips.
- This creates dense, balanced compositions that feel engineered and cinematic.

### Rule 10: The "Seam Model" & Object Match-Cuts (Zero Dead Zones)
- Never cut to empty black or use lazy opacity crossfades between related beats.
- Design transitions with intent:
  - **In-Object / Out-Object Match-Cuts**: The central exit element of Shot $N$ morphs, scales, or tracks into the entry anchor element of Shot $N+1$ (e.g., a status badge contracts into a root diagram node).
  - Use directional whip wipes, slice shutters, mask reveals, or continuous camera pushes.
  - Maintain continuous visual energy across sequence boundaries.

### Rule 11: Multi-Velocity Animation Physics & 2-Second Technique Density
- Avoid sterile linear tweens or uniform ease-outs for every element.
- **Velocity Dynamics**:
  - Anticipation back-pulls (micro-scale 1.0 → 0.96 over 4 frames).
  - High-velocity entry whips (`power4.out` / exponential surges).
  - Tactile spring physics (`spring({ damping: 12, stiffness: 180 })`) on card landings and badge impacts.
- **Technique Every ~2 Seconds**: Within every 5–8 second graphic, introduce a new micro-interaction every ~2 seconds:
  - Sec 0–2: Dynamic kinetic build & overshoot landing.
  - Sec 2–4: Secondary SVG path draw-on, counter surge, or toggle activation.
  - Sec 4–6: Continuous laser shimmer sweep, telemetry cascade, or focus shift.

### Rule 12: Autonomous Self-Critique Loop (Pre-Delivery Gate)
- Before presenting any render, execute an automated visual audit:
  1. Extract contact sheet frames of midpoints and final states.
  2. Inspect against hard criteria: zero text collisions, zero edge clipping, minimum font compliance (≥56px primary, ≥24px chrome), and healthy frame fill (≥50% on diagrams and evidence).
  3. Identify any static dead zones (>1.5s completely frozen) and inject living micro-motion.
  4. Fix defects and re-verify before handoff.

---

## Universal Channel Support
Motion Studio is channel-agnostic and loads brand identities dynamically from `Channels/<channel>/channel.json`:
- **VantaBrief**: Dark charcoal `#231F20`, Cream `#FAF4D9`, Electric Blue `#1677FF`, Emerald `#10B981`, Amber `#F59E0B`, Crimson `#EF4444`. Strict character ban (Rule R4: no human faces or cartoon mascots, pure geometric/system UI). Strict audio integrity (Rule R1).
- **HanaVanta**: Cinematic dark `#0C0D10`, Amber `#F59E0B`, Rose `#E11D48`, Playfair Display & Inter typography.
- **New Channels**: Create `Channels/<NewChannel>/channel.json` with color tokens, font families, and brand rules. Motion Studio automatically applies those tokens to all generated compositions.

---

## Core CLI Commands
```powershell
# Workflow 1: Standalone Motion Graphics Pipeline
python studio.py plan-motion <project> [--channel CHANNEL]             # Select 3-5 animation moments
python studio.py research-references <project>                         # Research design references
python studio.py render-motion-graphics <project> [--transparent]      # Render standalone clips & guide
python studio.py render-all-motion <project> [--channel CHANNEL]       # 1-Command end-to-end pipeline

# Workflow 2: Whiteboard Explainer Kit
npm run w2:test                                                        # Run 11/11 deterministic guardrail tests
npm run w2:plan [-- --allow-missing]                                   # Run layout solver, camera planner & linter
npm run w2:preview                                                     # Generate scene preview PNGs
npm run w2:assets                                                      # Fetch verified logos & capture screenshots
npm run w2:studio                                                      # Open Remotion Studio for live scrubbing
npm run w2:render                                                      # Render production MP4
python studio.py build-explainer-canvas <project> [--channel CHANNEL]  # Render continuous whiteboard explainer
```

For Hena Vanta, hena-vanta-lock.md takes priority over everything in this file.
For Vanta Brief, vantabrief.md and the fixed skill at `Channels/VantaBrief/workflow2-explainer-v2` take priority over everything in this file. Whenever a prompt mentions "Vanta Brief" or requests building a video with `workflow2-explainer-v2`, lock onto `D:\Automations\motion-studio\Channels\VantaBrief\workflow2-explainer-v2` as the exclusive operating instruction set. When requested to 'Build the full video in one go', execute the entire v2.1 pipeline (Gates 1–9) end-to-end and render the final video into the specified output folder in one go without stopping for questions or approval.
