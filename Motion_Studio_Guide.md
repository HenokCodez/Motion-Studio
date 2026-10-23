# Motion Studio Guide
**Remotion + Manim + Google Antigravity on Windows 11**

This guide explains how your setup works, how to preview and render, and how to get good prompts for any motion graphic. You can read it yourself, or paste it (or just Part 10) into ChatGPT so it understands your setup and can write prompts for you.

**Which tool for which job**

- **Remotion**: UI cards, dynamic counters, kinetic text, lower thirds, social-media animations, modern motion graphics. Fast to iterate and batch.
- **Manim**: technical explainers, data visualizations, flowcharts, math and algorithm animations. Cleaner and more precise for diagrams.
- **Antigravity**: the code editor with an AI agent. It *writes* the Remotion and Manim code for you. It is not a video tool itself.

---

## Part 1. The big picture

```text
 You  --prompt-->  Antigravity Agent  --writes code-->  Remotion / Manim project
                                                              |
                          preview (Remotion Studio, or a quick Manim render)
                                                              |
                          final render  -->  .mp4 or transparent .mov
                                                              |
                          import into your video editor (Premiere, DaVinci, CapCut...)
```

Think of it as three layers:

1. **Idea layer**: you describe the animation (you, or ChatGPT helping you write the prompt).
2. **Code layer**: the Antigravity agent turns the description into code.
3. **Video layer**: Remotion or Manim runs the code and produces video files.

You almost never write the code yourself. Your job is to describe clearly, preview, and ask for small changes.

---

## Part 2. Your folders

Everything lives on `D:\Automations\motion-studio`.

```text
D:\Automations\motion-studio\
├── .agent\rules\motion-rules.md   Rules the Antigravity agent follows
├── AGENTS.md                      Root studio guidelines
├── studio.py                      Helper commands (new, transcribe, render, clean...)
├── studio.json                    Studio configuration & library paths
├── projects\
│   ├── remotion-app\              The Remotion project (React + TypeScript)
│   │   ├── src\                   Code: index.ts, Root.tsx, compositions/, templates/
│   │   ├── public\                Default assets folder for preview
│   │   ├── package.json
│   │   └── node_modules\          Downloaded libraries
│   └── manim-app\
│       ├── .venv\                 Python environment holding Manim & faster-whisper
│       └── scenes\                Your Manim scene files (hello.py is an example)
├── scripts\                       transcribe.py, asset_indexer.py, media_inspector.py
│
└── Videos\                        YOUR WORK (video projects live here)
    └── my-first-video\
        ├── AGENTS.md              Project-specific agent instructions
        ├── project.json           Project settings & resolution
        ├── brief.md               What the video is about
        ├── style.md               Visual identity & motion easing
        ├── frames.md              Scene breakdown & timestamps
        ├── assets\                audio/, images/, video/, fonts/
        ├── transcripts\           transcript.txt, transcript.json, word-timestamps.json, captions.json
        ├── manifests\             assets.json, b-roll.json, sound-effects.json, icons.json, logos.json
        ├── renders\               Finished video renders
        └── notes\
```

*(Note: If you have existing projects in the legacy `D:\Automations\video-projects\`, they remain accessible and are automatically resolved by `studio.py`).*

**Rule of thumb**

- *Code and tools* live in `motion-studio`.
- *Video projects* live in `Videos\<project-name>`.
- Studio cleanups preserve everything inside `Videos\`.

---

## Part 3. The tools in plain English

### Remotion
Remotion makes video from React code. Each frame of the video is a web page, and the code decides what that page looks like at frame 0, 1, 2, and so on. Remotion screenshots every frame and joins them into a video with ffmpeg.

Key ideas:

- **Composition**: one video (size, fps, duration, and the component that draws it). Each composition has an **ID** such as `ContentWorkflow`. You render by ID.
- **Frame-based animation**: everything is driven by the current frame number.
- `useCurrentFrame()` gives the current frame. `useVideoConfig()` gives fps, width, height and duration.
- `interpolate()` maps a frame range to a value range (for example frames 0 to 30 become opacity 0 to 1).
- `spring()` gives natural bouncy motion.
- `<Sequence>` starts a piece of the animation at a given frame.
- `<AbsoluteFill>` is a full-screen layer.
- **Never use CSS transitions, CSS animations or setTimeout.** They don't work in rendering. Use frame-based code only.
- **Seconds to frames**: `frames = seconds × fps`. At 30 fps, 2 seconds is 60 frames.

Useful add-on packages (the agent installs them when needed): `@remotion/google-fonts`, `@remotion/paths` (draw SVG lines progressively), `@remotion/shapes`, `@remotion/transitions`, `@remotion/noise`.

**License note**: Remotion is free for individuals and very small companies (check remotion.dev/license for current terms). Larger companies need a paid license.

### Manim
Manim (Community Edition) makes mathematical and technical animations from Python. You write a **Scene** class, and inside `construct()` you add objects and call `self.play(...)` for each animation step.

Key ideas:

- Objects: `Circle`, `Square`, `RoundedRectangle`, `Arrow`, `Line`, `Text`, `MathTex` (formulas, needs LaTeX), `Axes`, `NumberPlane`, `BarChart`, `VGroup` (group of objects).
- Animations: `Create`, `Write`, `FadeIn`, `FadeOut`, `Transform`, `ReplacementTransform`, `.animate` (animate any property change).
- `self.wait(1)` pauses for 1 second. `run_time=2` makes an animation last 2 seconds.
- `ValueTracker` plus `always_redraw` makes live-updating graphs and counters.
- Scene types: `Scene`, `MovingCameraScene` (zoom and pan), `ThreeDScene`.
- Use `Text` for normal text (no LaTeX needed). Use `MathTex` only for formulas.

### Antigravity
Antigravity is a code editor (similar to VS Code) with an AI agent panel. Parts of the window:

- **Explorer** (left): your files.
- **Editor** (center): code files.
- **Terminal** (bottom): where you type commands. It opens in `motion-studio`.
- **Agent panel** (right): where you chat with the AI. Shortcut: `Ctrl + L`.
- **Model dropdown** (in the Agent panel): choose which AI model to use.

The agent can create and edit files and run terminal commands. The rules file `.agent\rules\motion-rules.md` tells it how your workspace is laid out and how to render. If your agent seems to ignore it, check the Customizations / Rules area in Antigravity settings to confirm the file is picked up.

---

## Part 4. How previewing works

### Remotion: live preview (Remotion Studio)
Remotion Studio is the preview. It is a web app in your browser with a timeline you can scrub.

```powershell
cd D:\Automations\motion-studio\projects\remotion-app
npm run dev
```

1. It prints a link, usually `http://localhost:3000`. Open it.
2. Pick your composition in the left sidebar.
3. Press play or drag the timeline.
4. **Edit and save a file, and the preview updates by itself.** No restart needed.
5. Stop it with `Ctrl + C` in the terminal.

Tips:

- You can also render from the Studio's **Render** button, but the `studio.py` command saves into the right video folder for you.
- If you use project assets, see "Assets" in Part 6.

### Manim: preview by quick low-quality render
Manim has no live preview. You render a fast low-quality version and watch it.

```powershell
cd D:\Automations\motion-studio
python studio.py render-manim my-first-video hello.py HelloScene --quality l
```

- `l` is low quality (480p, 15 fps), very fast. Use it while designing.
- Open the file it prints. It is under `Videos\my-first-video\renders\manim\videos\hello\480p15\HelloScene.mp4`.
- When happy, render again with `--quality h` (1080p 60 fps).

---

## Part 5. Daily workflow

Every time you want to make a new animation:

1. **Open Antigravity** and choose File > Open Folder > `D:\Automations\motion-studio`.
2. **Create the video project folder** in the Antigravity terminal:
   ```powershell
   python studio.py new my-video-name
   ```
   *(Creates `Videos\my-video-name\` with the complete project tree, manifests, and documentation).*
3. **Put assets** (logo, images, audio) into `Videos\my-video-name\assets`.
4. **Write the prompt** (Part 7 has templates; ChatGPT can help you write it) and paste it into the Agent panel.
5. **Preview**: Remotion with `npm run dev`, Manim with a low-quality render.
6. **Iterate**: ask for one small change at a time. Screenshots help.
7. **Final render** with the `studio.py` command.
8. **Import** the file from `renders\` into your editor. Copy the final version into `exports\`.

---

## Part 6. Command cheat sheet

Run these from `D:\Automations\motion-studio` unless stated.

| What | Command |
|---|---|
| Check tools are installed | `python studio.py doctor` |
| New video project folder | `python studio.py new my-video` |
| Render Remotion (normal mp4) | `python studio.py render-remotion my-video CompositionId` |
| Render Remotion (transparent mov) | `python studio.py render-remotion my-video CompositionId --transparent` |
| Render Manim (draft) | `python studio.py render-manim my-video file.py SceneName --quality l` |
| Render Manim (final) | `python studio.py render-manim my-video file.py SceneName --quality h` |
| Render Manim (transparent mov) | add `--transparent` |
| Free disk space (keeps code and videos) | `python studio.py clean` |
| Delete temporary files (keeps videos) | `python studio.py clean --all` |
| Remotion live preview | `cd projects\remotion-app` then `npm run dev` |

**Outputs**

- Remotion: `Videos\<video>\renders\<CompositionId>.mp4` (or `.mov` if transparent).
- Manim: `Videos\<video>\renders\manim\videos\<file>\<resolution>\<SceneName>.mp4` (or `.mov`).

**Handy extra Remotion commands** (run inside `projects\remotion-app`):

```powershell
# Fast draft render at half size
npx remotion render src/index.ts CompositionId out\draft.mp4 --scale=0.5

# Render only frames 0 to 60 (to test a section)
npx remotion render src/index.ts CompositionId out\test.mp4 --frames=0-60

# Export a single frame as an image
npx remotion still src/index.ts CompositionId out\frame.png --frame=45
```

**Assets**

- `studio.py render-remotion` points Remotion at `Videos\<video>\assets`, so in code you reference files with `staticFile("logo.png")`.
- The live preview (`npm run dev`) uses `remotion-app\public` by default. Either copy the asset there while previewing, or start the preview with the assets folder:
  `npx remotion studio --public-dir=Videos\my-video\assets`
  (run `npx remotion studio --help` if your version differs).

**Transparent video**

- Remotion: ProRes 4444 `.mov` with alpha. Leave the composition background unset (no solid color). Files are large.
- Manim: `.mov` with the transparent flag.
- Use transparent files as overlays on a track above your footage in your editor.

---

## Part 7. How to write good prompts for the agent

The agent follows detail well. Vague prompts give vague results, and every retry uses your free quota. A good prompt has these parts.

### Remotion prompt template

```text
In projects/remotion-app, create a composition called <CompositionId>
(src/compositions/<CompositionId>/) and register it in Root.tsx.
Format: <width>x<height>, <fps> fps, <duration> seconds.

BACKGROUND
- <solid color / gradient / glow, with hex colors, or "transparent (no background)">

ELEMENTS
- <each element: shape, size, colors in hex, font, text>

MOTION TIMELINE (in seconds)
- 0.0-0.5s: <what happens, easing like spring with slight overshoot>
- 0.5-2.0s: <...>
- final 1s: hold

EDITABLE DATA
- Put all text, numbers and colors in constants at the top of the file.

RULES
- All timing from useCurrentFrame() and fps. No CSS transitions or setTimeout.
- Use spring() / interpolate() with extrapolateRight: "clamp".
- Run the preview and check for errors. Do not render the final video yet.
```

### Manim prompt template

```text
In projects/manim-app/scenes/<file>.py, create a Scene class <SceneName>.
Style: dark background (#141414), accent color <hex>, font via Text().

STEPS
1. <object appears with which animation, run_time>
2. <next step>
3. <...>

NOTES
- Use Text, not MathTex, unless a formula is required.
- Keep all labels in a list/dict at the top so I can edit them.
- Render a low-quality draft to check for errors:
  python studio.py render-manim <project> <file>.py <SceneName> --quality l
```

### Checklist for any prompt

- Say the **composition ID or scene name**.
- Give **size, fps and duration**.
- Use **hex colors**, not "purple".
- Give **timing in seconds**.
- Name the **easing feel** ("snappy spring with slight overshoot", "slow ease-out").
- Say **where the text lives** (a constants array at the top).
- Say **background: solid or transparent**.
- Say **what NOT to do** (no final render yet, no extra libraries).

### Using a reference image
Attach a screenshot of the style you want to the Agent panel and say: "Match this style." Then describe the motion in words, because a still image can't show the animation.

### Asking for changes
Change one thing per message. Examples:

- "Make the line 2px thicker and slow the draw-in by 20%."
- "The pill pop-in is too bouncy. Reduce the spring overshoot."
- "Move the title 40px up."

If something breaks, paste the full error message into the Agent panel and say "fix this."

---

## Part 8. Example prompts

### A. Remotion: animated stat card with counter

```text
In projects/remotion-app, create composition StatCard (src/compositions/StatCard/),
register in Root.tsx. 1080x1080, 30fps, 5 seconds, transparent background.

ELEMENTS
- Rounded card 800x420, radius 36, fill #16161d, 2px border #3a2a6a, soft violet glow (#6a2fc0).
- Label text "Subscribers" top-left of the card, Montserrat Medium, 36px, #b8a8ff.
- Big number centered, Montserrat ExtraBold, 160px, white.

MOTION
- 0.0-0.7s: card scales from 0.8 to 1 with spring (slight overshoot) and fades in.
- 0.5-3.0s: number counts from 0 to 12,500 with an ease-out curve, comma formatted.
- 3.0-4.0s: a thin violet underline draws left to right under the number.
- Last 1s: hold.

EDITABLE DATA: label, target number, colors in constants at the top.
RULES: frame-based timing only. Run the preview and check for errors. Do not render yet.
```

### B. Remotion: lower third (transparent overlay)

```text
Create composition LowerThird, 1920x1080, 30fps, 6 seconds, transparent background.
A name bar in the lower-left: dark panel (#141414 at 90% opacity) with a 6px violet
(#6a2fc0) accent bar on its left edge. Name in Montserrat Bold 56px white,
subtitle below in Montserrat Regular 32px #b8a8ff.
0.0-0.6s slide in from the left with spring; hold until 5.2s; 5.2-6.0s slide out
to the left with an ease-in. Editable name and subtitle constants at the top.
```

### C. Manim: flowchart

```text
In scenes/flow.py create Scene class ContentFlow. Dark background #141414.
Build 4 boxes (RoundedRectangle, violet outline #6a2fc0) labeled with Text():
"Idea", "Script", "Edit", "Publish", placed in a row with Arrow connectors.
Animate: each box appears with FadeIn + a small scale-up, then its arrow is drawn
with Create (run_time 0.6), left to right, with 0.3s pauses. At the end, flash the
last box with Indicate. Labels stored in a list at the top.
```

### D. Manim: animated bar chart

```text
In scenes/data.py create Scene class SalesBars. Use BarChart with values
[12, 25, 18, 40] and labels Q1-Q4, dark background, accent #6a2fc0.
Animate the bars growing from zero, then update the values to [20, 30, 35, 55]
with a smooth transition. Add a title Text at the top, fading in first.
```

---

## Part 9. Troubleshooting

| Problem | Fix |
|---|---|
| `python` opens the Microsoft Store | Settings > Apps > Advanced app settings > App execution aliases > turn off the "python" entries. |
| PowerShell says scripts are disabled (on `npm`) | Run once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| "Composition not found" | The ID in your command must match the `id` in `Root.tsx` exactly (case-sensitive). |
| Remotion render fails right away or says blocked | Your PC shows an App Control policy that may block Remotion's downloaded Chrome. Try `npx remotion browser ensure` in `remotion-app` and send the exact error to the agent or ChatGPT. |
| Port 3000 already in use | Close the other preview (`Ctrl + C`) or let Remotion pick another port when it asks. |
| Preview is slow or laggy | Heavy blur, glow and shadows are expensive. Ask the agent to reduce them, or preview at lower size. |
| Fonts look wrong | Use `@remotion/google-fonts` (needs internet the first time) and wait for the font to load before rendering. |
| Manim: "No module named manim" | You ran it with the wrong Python. Use `python studio.py render-manim ...`, which uses the Manim environment. |
| Manim: LaTeX error | `MathTex` needs LaTeX (install MiKTeX). Or ask the agent to use `Text` instead. |
| Manim: ffmpeg not found | Run `python studio.py doctor`. ffmpeg must be on PATH (it is on your machine). |
| Manim install fails on Python 3.10 | Install Python 3.12 beside it and recreate the Manim `.venv` with it. |
| Agent keeps breaking the code | Switch to a stronger model for the first generation, give smaller steps, and paste exact error text. |
| Agent says quota reached | Free limits are weekly and can change. Wait for the reset, or work in smaller prompts to use less. |
| Render looks different from preview | Re-check for CSS transitions or animations in the code (they don't render). Ask the agent to replace them with frame-based code. |
| Disk is filling up | Run `python studio.py clean`, delete old renders (ProRes `.mov` files are huge), and run `npm cache clean --force` and `pip cache purge` occasionally. |

---

## Part 10. Context block to paste into ChatGPT (or any chatbot)

Copy everything inside the box below into a new chat. Then describe the motion graphic you want, and the chatbot will answer with a ready-to-paste prompt for the Antigravity agent.

````text
I'm setting up motion graphics with Remotion and Manim, generated by an AI coding agent inside the Google Antigravity IDE. You will act as my "prompt writer": when I describe a motion graphic, you reply with ONE ready-to-paste prompt for the Antigravity agent. Do not write the code yourself unless I ask.

MY SETUP (Windows 11, i7-11850H, 32 GB RAM, no GPU needed)
- Node v22, Python 3.10, ffmpeg installed.
- Tools folder:  D:\Automations\motion-studio   (open this folder in Antigravity)
  - Remotion project: projects/remotion-app  (React + TypeScript, compositions in src/compositions/<Id>/, registered in src/Root.tsx, entry src/index.ts)
  - Manim Community project: projects/manim-app/scenes/*.py (Python venv in projects/manim-app/.venv)
  - Agent rules: .agent/rules/motion-rules.md
  - Helper script: studio.py
- My video work folder: Videos\<project-name>\ with assets/, transcripts/, manifests/, renders/, brief.md, style.md, frames.md (legacy projects in D:\Automations\video-projects\ are also resolved)
- Antigravity has an Agent panel (Ctrl+L), a built-in terminal, and a model dropdown (Gemini models; free tier with weekly limits, so prompts should be precise to avoid wasted retries).

COMMANDS THE AGENT/I USE
- New project folder:  python studio.py new <name>
- Remotion preview:    cd projects/remotion-app ; npm run dev   (Remotion Studio, localhost:3000, hot reload)
- Remotion render:     python studio.py render-remotion <project> <CompositionId> [--transparent]
    (transparent = ProRes 4444 .mov with alpha; otherwise H.264 .mp4; output in Videos/<project>/renders/)
- Manim render:        python studio.py render-manim <project> <file.py> <SceneName> [--quality l|m|h|k] [--transparent]
    (l = fast draft preview; h = 1080p60 final; --transparent gives .mov with alpha)
- Remotion assets are referenced with staticFile("name.png") and live in Videos/<project>/assets/.

WHICH TOOL TO PICK
- Remotion: UI cards, dynamic counters, kinetic typography, lower thirds, social formats, modern polished motion graphics, overlays.
- Manim: technical explainers, data visualizations, flowcharts, graphs, math/algorithm animations, precise diagrams.

REMOTION RULES THE AGENT MUST FOLLOW
- All animation driven by useCurrentFrame() and useVideoConfig().fps. NO CSS transitions/animations, NO setTimeout.
- Use spring() for natural motion, interpolate() with extrapolateRight: "clamp", <Sequence> for staging, <AbsoluteFill> layers.
- seconds x fps = frames.
- Packages available when needed: @remotion/google-fonts, @remotion/paths (evolvePath), @remotion/shapes, @remotion/transitions, @remotion/noise.
- For transparent output, no solid background on the composition.
- Editable text/numbers/colors go in constants at the top of the file.

MANIM RULES
- Manim Community Edition (from manim import *), one Scene class per animation, animations via self.play(), use Text() instead of MathTex unless a formula is needed (LaTeX is not guaranteed to be installed).
- Labels/data in a list or dict at the top of the file.

HOW YOU MUST WRITE EACH PROMPT FOR THE AGENT
1. Name the tool and exact composition ID / scene name and file location.
2. State size, fps, duration (Remotion) or quality (Manim).
3. Give background (solid hex / gradient / transparent), colors as hex, fonts, element sizes.
4. Give a MOTION TIMELINE in seconds with easing descriptions (e.g. "spring with slight overshoot", "ease-out").
5. Put editable data in constants at the top.
6. End with: run the preview / low-quality draft and check for errors; do NOT render the final video yet.
7. Keep it as one copy-paste block. If my request is vague, ask me at most 3 short questions first.
8. If I paste an error, reply with a short fix instruction I can give the agent.

Ready? I'll describe the motion graphic next.
````

---

## Quick start recap

1. Open `D:\Automations\motion-studio` in Antigravity.
2. `python studio.py new my-video`
3. Paste a prompt into the Agent panel.
4. Preview: `npm run dev` inside `projects\remotion-app` (Remotion), or a `--quality l` render (Manim).
5. Ask for small tweaks, one at a time.
6. Render with `python studio.py render-remotion ...` or `render-manim ...`.
7. Take the file from `Videos\my-video\renders\` into your editor.

---

## Part 11. Complete AI-Assisted Video Production Workflow

The motion studio includes a full offline, AI-assisted video editing workflow using open-source tools:

### Step 1: Initialize Project Scaffolding
Create a structured project with all required subfolders, manifests, and documentation:
```powershell
python studio.py new my-next-video
```
This generates:
- `project.json`: Video specifications, resolution (1080p), 30 fps, audio tracking.
- `AGENTS.md`: Dedicated guide for AI pair programming on this specific video.
- `brief.md`: Objective, target audience, core messaging, deliverables.
- `style.md`: Visual identity, color palette, typography, motion easing.
- `frames.md`: Scene-by-scene script linked to timestamps.
- `assets/`: Structured folders for `audio/{voice, music, sfx}`, `images/{b-roll, generated, logos, icons}`, `video/{source, b-roll, generated}`, `fonts/`.
- `transcripts/`: Plain text, markdown, machine-readable JSON, word timestamps, captions.
- `manifests/`: Provenance and licensing records (`assets.json`, `b-roll.json`, `sound-effects.json`, `icons.json`, `logos.json`).

### Step 2: Manually Place Voiceover Narration
Copy your manually recorded voiceover file (.mp3, .wav, or .m4a) into:
```text
Videos\<project-name>\assets\audio\voice\
```
*(Strict rule: the studio never calls voice synthesis or paid text-to-speech APIs.)*

### Step 3: Transcribe Locally with Faster-Whisper
Run local transcription with word-level timestamps:
```powershell
python studio.py transcribe my-next-video
```
- **Engine**: Local `faster-whisper` (no internet connection or paid API keys needed).
- **GPU Acceleration**: Uses NVIDIA RTX A2000 Laptop GPU with CUDA `float16` by default.
- **Fallback**: Automatically falls back to CPU `int8` if GPU VRAM is constrained.
- **Generated files**:
  - `transcripts/transcript.txt`: Plain readable text.
  - `transcripts/transcript.md`: Formatted scene timestamps and spoken text.
  - `transcripts/transcript.json`: Machine-readable segment timestamps with confidence scores.
  - `transcripts/word-timestamps.json`: Millisecond-accurate word-by-word timing for dynamic typography.
  - `transcripts/captions.json` & `captions.srt`: Ready for Remotion `<KineticCaptions>` and video player subtitles.

### Step 4: Plan Scenes in frames.md
Open `Videos\<project>\frames.md` and map your script to frames (`frame = seconds × 30`).
Word timestamps allow micro-precision timing so visual cutaways and cards appear right before spoken phrases.

### Step 5: Sourcing & Indexing Assets
1. **Index External Asset Folders**:
   Scan your SFX, B-roll, music, or logo folders:
   ```powershell
   python studio.py index-assets --all
   ```
2. **Search Assets**:
   ```powershell
   python studio.py search-assets "whoosh" --category sfx
   python studio.py search-assets "tech" --type video --max-duration 10
   ```
3. **Import to Project with Provenance Tracking**:
   ```powershell
   python studio.py import-asset my-next-video "D:\Editor 2.0\SFX + Meme sounds\336 SFX\MIX\Fast whoosh.wav" --category sfx --license "owned"
   ```
   This automatically copies the asset into the project and registers it in `manifests/assets.json` and `manifests/sound-effects.json`.

4. **Free External Logos & Icons**:
   - For logos: Check Flaticon, Freepik, or Seeklogo only when free to use with appropriate licenses. Prefer transparent PNG or SVG.
   - Record source URL and license in `manifests/logos.json`.

### Step 6: Assemble Compositions with Pre-Built Templates
Remotion includes production-grade templates in `src/templates/`:
- `TitleHook`: Dynamic entrance hook with spring overshoot and accent badge.
- `KineticCaptions`: Real-time karaoke-style word highlighting synced to `word-timestamps.json`.
- `CalloutCard`: Apple Design glassmorphic stat card with dynamic animated counter.
- `ComparisonGrid`: Side-by-side comparison (Before vs After) with staggered entrance.
- `LiquidBackground`: Subtle moving abstract mesh gradient computed entirely via canvas/CSS (zero heavy video renders).
- `LogoIntro`: Brand reveal with glowing ring and scale dynamics.
- `EndingCard`: High-converting call-to-action card with website and social buttons.

### Step 7: Inspect & Validate Before Rendering
Verify all files, audio, and asset paths before launching expensive renders:
```powershell
python studio.py inspect-media "Videos\my-next-video\assets\audio\voice\narration.wav"
python studio.py validate my-next-video
```

### Step 8: Render Final Video
```powershell
# Remotion
python studio.py render-remotion my-next-video ContentWorkflow

# Transparent overlay for DaVinci / Premiere / CapCut
python studio.py render-remotion my-next-video TitleHook --transparent

# Manim technical scene
python studio.py render-manim my-next-video hello.py HelloScene --quality h
```

### Troubleshooting
- **GPU / CUDA DLL Error**: If `cublas64_12.dll` is reported missing, `scripts/transcribe.py` automatically links the runtime libraries from `VoiceStudio\project\.venv\Lib\site-packages\torch\lib` or falls back to CPU `int8`.
- **Port Conflict in Remotion Studio**: If port 3000 is occupied, Remotion Studio automatically binds to 3001.
- **Missing Asset in Render**: Run `python studio.py validate <project>` to find any manifest files that are missing from disk before rendering.

