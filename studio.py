#!/usr/bin/env python3
"""
Motion Studio: Remotion + Manim + Google Antigravity + Local AI-Assisted Workflow.

  motion-studio/    TOOLS only (Remotion, Manim, local Whisper transcription, rules, indexers).
  Videos/           YOUR WORK (each video project in Videos/PROJECT_NAME/).

Core Commands:
    python studio.py new <project>                 # Scaffolds complete video project under Videos/<project>/
    python studio.py transcribe <project> [--file] # Local faster-whisper with word timestamps
    python studio.py index-assets [--all]          # Scans & indexes external asset libraries
    python studio.py search-assets <query>         # Searches indexed assets with metadata
    python studio.py import-asset <proj> <file>    # Imports asset & updates manifests
    python studio.py inspect-media <file>          # Runs FFprobe technical inspection
    python studio.py validate <project>            # Verifies project consistency before render
    python studio.py render-remotion <proj> <Comp> # Renders Remotion composition
    python studio.py render-manim <proj> <f> <Sc>  # Renders Manim scene
    python studio.py doctor                        # Full system & environment health check
    python studio.py clean                         # Frees disk space, preserves user projects in Videos/
"""
import argparse
from datetime import datetime
import json
import os
import re
import shutil
import subprocess
import sys
import venv
from pathlib import Path

SELF = Path(__file__).resolve()
CFG_FILE = SELF.parent / "studio.json"
IS_WIN = os.name == "nt"

RULES = """# Motion Graphics Rules

## Layout
- Tools live in `@STUDIO@`.
  - Remotion app: `projects/remotion-app/src/` (one folder per component under `src/compositions/` or `src/templates/`)
  - Manim scenes: `projects/manim-app/scenes/`
- User video projects live in `Videos/<project-name>/`
  (`assets/`, `transcripts/`, `manifests/`, `renders/`, `brief.md`, `style.md`, `frames.md`, `project.json`, `AGENTS.md`).

## Workflow Steps
1. Create project: `python studio.py new <project>`
2. Place manual narration into `Videos/<project>/assets/audio/voice/`
3. Transcribe locally: `python studio.py transcribe <project>`
4. Plan scenes & timing in `Videos/<project>/frames.md` using timestamps
5. Index & reuse assets: `python studio.py search-assets "<keyword>"` or `python studio.py import-asset <project> <file>`
6. Build composition in Remotion / Manim
7. Validate project: `python studio.py validate <project>`
8. Render: `python studio.py render-remotion <project> <CompositionId>` or `python studio.py render-manim ...`

## Standards
- Remotion: use `spring()` with natural overshoot for UI, badges, and text.
  Drive all timing from `useCurrentFrame()` and `fps`; never use CSS transitions or setTimeout.
  Use `<Sequence>` for staging and `interpolate()` with `extrapolateRight: "clamp"`.
  For transparent output, leave the composition background unset (no solid background color).
- Manim: scenes extend `Scene`; keep one scene per class; transparent export is done by the helper.
- After editing, run the preview or a quick render to check for errors before declaring complete.
"""

PROJECT_AGENTS_TEMPLATE = """# AGENTS.md — Video Project Guide: {name}

You are working on the video project `{name}` located at `Videos/{name}/`.
Follow the Motion Studio rules and these project-specific instructions.

## Project Structure
- `project.json`: Project resolution, frame rate, aspect ratio, audio and render metadata.
- `brief.md`: Objective, target audience, key message, and narrative outline.
- `style.md`: Visual identity, color palette, typography, motion curves, and transitions.
- `frames.md`: Scene-by-scene timing aligned to narration timestamps.
- `assets/audio/voice/`: Narration audio provided manually by the user.
- `transcripts/`: Word-level and segment-level timestamps generated locally by faster-whisper.
- `manifests/`: Provenance, attribution, and license details for all imported assets.
- `renders/`: Output video files.

## Production Workflow
1. **Narration & Transcripts**: Check `assets/audio/voice/` and `transcripts/transcript.json`.
   Do not generate voices or call voice APIs. Use the word timestamps in `transcripts/word-timestamps.json`
   to precisely synchronize graphics and cuts.
2. **Visual Planning**: Read `brief.md` and `style.md`. Keep `frames.md` updated with exact timestamps.
3. **Asset Sourcing**: Check existing libraries first (`python studio.py search-assets`). Record imported assets
   in `manifests/assets.json`.
4. **Composition**: Build in `projects/remotion-app/src/` or `projects/manim-app/scenes/`.
5. **Validation & Render**:
   - Validate: `python studio.py validate {name}`
   - Render Remotion: `python studio.py render-remotion {name} <CompositionId>`
   - Render Manim: `python studio.py render-manim {name} <file.py> <SceneName>`
"""

STYLE_MD_TEMPLATE = """# Style Guide: {name}

## Visual Identity
- **Mood**: Modern, crisp, engaging, and professional.
- **Aspect Ratio**: 16:9 (1920x1080) [or adjust in project.json]
- **Frame Rate**: 30 fps

## Color Palette
- **Background**: `#0B0F19` (Deep Obsidian / Slate)
- **Primary Accent**: `#3B82F6` (Electric Blue)
- **Secondary Accent**: `#8B5CF6` (Vibrant Purple)
- **Text Primary**: `#F8FAFC` (Pure Light)
- **Text Muted**: `#94A3B8` (Cool Grey)
- **Card Background**: `rgba(30, 41, 59, 0.7)` (Glassmorphism slate with subtle blur)
- **Borders**: `rgba(255, 255, 255, 0.1)`

## Typography
- **Headings**: Inter / Outfit / System Sans-Serif (700 Bold)
- **Body / Captions**: Inter / System Sans-Serif (400-500 Regular/Medium)
- **Mono / Numbers**: JetBrains Mono or tabular figures for dynamic counters

## Motion Language
- **Entrances**: Spring physics with natural overshoot (`damping: 12-15`, `mass: 0.5-0.8`).
- **Kinetic Text**: Fade & translateY (10-20px) staggered per word or phrase.
- **Transitions**: Smooth slide, subtle scale-up, or optical wipe. No jarring cuts unless pacing demands.
- **Pacing**: Driven by narration speed; cards appear 0.2s before key words for anticipation.
"""

FRAMES_MD_TEMPLATE = """# Scene & Frame Breakdown: {name}

Use `transcripts/word-timestamps.json` to assign exact start and end frames (`frame = seconds × 30`).

| Scene | Start (s) | End (s) | Frame Range | Visual Focus / Component | Assets & Audio | Transition |
|-------|-----------|---------|-------------|--------------------------|----------------|------------|
| 1. Hook | 0.00 | 3.50 | 0 - 105 | TitleHook + Animated Badge | Opening SFX | Quick Zoom |
| 2. Problem | 3.50 | 8.20 | 105 - 246 | StatCard / Callout | Whoosh SFX | Slide Left |
| 3. Solution | 8.20 | 15.00 | 246 - 450 | FeatureList / Demo | Subtle B-roll | Fade |
| 4. Outro | 15.00 | 20.00 | 450 - 600 | LogoIntro + CTA Card | Chime SFX | Fade to Black |

## Scene Details
### Scene 1: Opening Hook
- **Narration excerpt**: "..."
- **Visuals**: Modern title card with spring entrance.
- **Assets needed**: Logo / SFX.
"""

BRIEF_MD_TEMPLATE = """# Video Brief: {name}

## Overview
- **Project Name**: {name}
- **Objective**: 
- **Target Audience**: 
- **Core Message**: 

## Structure & Deliverables
- **Estimated Duration**: ~30-60 seconds
- **Format**: 1080p MP4 (H.264)
- **Platform**: YouTube / Web / Social
"""

VANTABRIEF_PROJECT_AGENTS_TEMPLATE = """# AGENTS.md — Video Project Guide: {name}

You are working on the VantaBrief video project `{name}` located at `Channels/VantaBrief/videos/{name}/`.

## Authoritative Directive
All planning, visuals, Remotion implementation, and quality assurance MUST strictly comply with:
[VantaBrief Visual Style Bible](file:///D:/Automations/motion-studio/Channels/VantaBrief/style/VantaBrief_Visual_Style_Bible.md)

## Five Visual Styles (Toolkit, Not Fixed Templates)
1. **Style 1: Kinetic typography** — Bold claims, punchlines, contrasts, key phrases; readable hold; no karaoke subtitles.
2. **Style 2: Real evidence / screen-led** — Authentic UI, code snippets, terminal execution, documentation, screenshots; no fabricated mockups.
3. **Style 3: Editorial collage / visual metaphor** — Paper-like layers, receipts, stacking invoices, real object cutouts; no cartoon humans.
4. **Style 4: Graphic symbols / icon-led beats** — Minimal non-human geometric icons, state changes, progress indicators.
5. **Style 5: Technical motion graphics** — RESERVED PRIMARILY FOR EXPLAINING HOW THINGS WORK: systems, architecture, comparisons, timelines, process logic.

## Non-Negotiable Operational Rules
- **Rule R1 (Audio Integrity)**: STRICTLY NO sound effects, NO background music, NO audio ducking. Untouched narration audio (`audio.mp3`) is the single audio source.
- **Rule R2 (Untouched Voiceover)**: Visuals adapt to voiceover timestamps; never trim, speed up, or re-time the voiceover.
- **Rule R3 (VantaBrief Palette)**: Charcoal `#231F20`, Cream `#FAF4D9`, Electric blue `#1677FF`, Amber `#F59E0B`, Crimson `#EF4444`, Emerald `#10B981`.
- **Rule R4 (Strict Character Ban)**: No human characters, stick figures, mascots, cartoon people, generic avatars. Default = NO characters.
- **Rule R5 (Standardized Placeholders)**: Unsupplied footage must display a centered `FOOTAGE NEEDED` slate with exact shot instructions and timecode.
- **Rule R6 (Clean Motion Graphics, No Captions)**: Bottom full-sentence subtitles are removed.
- **Rule R7 (Factual Integrity)**: No fabricated benchmarks, prices, or statistics. All numbers must cite verifiable sources.
"""

VANTABRIEF_STYLE_MD_TEMPLATE = """# VantaBrief Style Guide: {name}

Authoritative Directive: [VantaBrief Visual Style Bible](file:///D:/Automations/motion-studio/Channels/VantaBrief/style/VantaBrief_Visual_Style_Bible.md)

## Color Palette (Single Source of Truth: tokens.ts)
- **Charcoal Base**: `#231F20` (Matte dark canvas, never flat grey or pure black)
- **Warm Cream**: `#FAF4D9` (Primary readable text & light surfaces)
- **Electric Blue**: `#1677FF` (Primary active / technical accent & circuit nodes)
- **Amber**: `#F59E0B` (Metric emphasis, marker highlight, warnings)
- **Crimson**: `#EF4444` (Critical punch, strikeout, risk, chapter emphasis)
- **Emerald**: `#10B981` (Positive state, success metric, verified $0 license)

## Strict Rules
1. **Audio**: 100% untouched narration. Zero SFX, zero background music.
2. **Character Ban**: No human characters, cartoon people, mascots, avatars, or stick figures.
3. **Footage Placeholders**: Centered `FOOTAGE NEEDED` slate with precise shot instructions.
"""

VANTABRIEF_FRAMES_MD_TEMPLATE = """# Scene & Frame Breakdown: {name}

Aligned to `transcripts/transcript.words.json` (30 fps). Each scene selects from the 5 Visual Styles based on narrative purpose.

| Scene | Start (s) | End (s) | Frame Range | Primary Style | Narrative Purpose & Visual Focus | Asset & Footage Status |
|-------|-----------|---------|-------------|---------------|----------------------------------|------------------------|
| 01    | 0.00      | 8.42    | 0 - 253     | Style 1 + 2   | Hook: $0 2026 workstation stack  | Real screenshots       |
| 02    | 8.42      | 15.14   | 253 - 454   | Style 2       | Benchmark: DaVinci Resolve       | FOOTAGE NEEDED slot-001|
| 03    | 15.14     | 21.82   | 454 - 655   | Style 2 + 5   | ArtCraft NLE vs Adobe Toll       | Real UI + Placeholders |
"""

# ---------- helpers ----------
def run(cmd, cwd=None, check=True):
    print("->", " ".join(str(c) for c in cmd))
    return subprocess.run([str(c) for c in cmd], cwd=cwd, check=check)


def load_cfg():
    studio_root = SELF.parent
    if CFG_FILE.exists():
        try:
            cfg = json.loads(CFG_FILE.read_text(encoding="utf-8"))
        except Exception:
            cfg = {}
    else:
        cfg = {}

    studio_val = cfg.get("studio", ".")
    if studio_val in [".", "", None]:
        studio = studio_root
    else:
        studio = Path(studio_val)
        if not studio.is_absolute():
            studio = (studio_root / studio).resolve()

    videos_val = cfg.get("videos", "Videos")
    videos = Path(videos_val)
    if not videos.is_absolute():
        videos = (studio_root / videos).resolve()

    channels_val = cfg.get("channels", "Channels")
    channels = Path(channels_val)
    if not channels.is_absolute():
        channels = (studio_root / channels).resolve()

    libraries = cfg.get("libraries", {})
    return studio, videos, channels, libraries


def tool(name):
    path = shutil.which(name)
    if not path:
        sys.exit(f"'{name}' not found on PATH. Run `python studio.py doctor`.")
    return path


def venv_python(studio):
    sub = "Scripts/python.exe" if IS_WIN else "bin/python"
    return studio / "projects" / "manim-app" / ".venv" / sub


def next_episode_number(channel_dir: Path) -> str:
    vids_dir = channel_dir / "videos"
    if not vids_dir.exists():
        return "001"
    highest = 0
    for item in vids_dir.iterdir():
        if item.is_dir():
            match = re.match(r"^(\d+)", item.name)
            if match:
                highest = max(highest, int(match.group(1)))
    return f"{highest + 1:03d}"


def project_dir(videos, name):
    studio, v_def, channels, _ = load_cfg()
    videos = videos or v_def
    name_str = str(name).strip()

    # 1. Direct path check (if a relative or absolute path is supplied)
    p_direct = Path(name_str)
    if p_direct.is_absolute() and p_direct.exists():
        return p_direct
    if (SELF.parent / p_direct).exists():
        return (SELF.parent / p_direct).resolve()

    # 2. Check within Channels/<Channel>/videos/<name_str>
    if channels.exists():
        for ch_dir in channels.iterdir():
            if ch_dir.is_dir():
                ch_vids = ch_dir / "videos"
                if ch_vids.exists():
                    candidate = ch_vids / name_str
                    if candidate.exists():
                        return candidate
                    for ep in ch_vids.iterdir():
                        if ep.is_dir() and (ep.name == name_str or ep.name.endswith(f"-{name_str}") or ep.name.startswith(f"{name_str}-")):
                            return ep

    # 3. Canonical Videos/ location
    p_canonical = videos / name_str
    if p_canonical.exists():
        return p_canonical

    # 4. Fallback check for existing projects in legacy video-projects location
    legacy_candidate = Path("D:/Automations/video-projects") / name_str
    if legacy_candidate.exists():
        print(f"[NOTE] Resolved '{name_str}' to existing project at legacy location: {legacy_candidate}")
        return legacy_candidate

    sys.exit(f"Project '{name_str}' not found in {channels} or {videos}. Create it with: python studio.py new {name_str}")


# ---------- commands ----------
def cmd_setup(a):
    studio_root = SELF.parent
    studio = (studio_root / a.studio).resolve() if not Path(a.studio).is_absolute() else Path(a.studio).resolve()
    videos = (studio / a.videos).resolve() if not Path(a.videos).is_absolute() else Path(a.videos).resolve()

    for d in [
        studio / ".agent" / "rules",
        studio / "projects" / "manim-app" / "scenes",
        studio / "scripts",
        videos,
    ]:
        d.mkdir(parents=True, exist_ok=True)

    rel_videos = "Videos" if videos == studio / "Videos" else (videos.as_posix() if videos.is_absolute() else a.videos)
    rules = RULES.replace("@STUDIO@", studio.as_posix()).replace("@VIDEOS@", rel_videos)
    (studio / ".agent" / "rules" / "motion-rules.md").write_text(rules, encoding="utf-8")
    (studio / ".gitignore").write_text("node_modules/\n.venv/\nmedia/\nlibrary_index*.json\n", encoding="utf-8")

    cfg_data = {
        "studio": ".",
        "videos": rel_videos,
        "libraries": {
            "sfx": "D:/Editor 2.0/SFX + Meme sounds",
            "music": "D:/Editor 2.0/Music",
            "broll": "D:/Editor 2.0/B-Roll Library",
            "logos": "project:assets/images/logos",
            "icons": "C:/Users/zakbi/Downloads/tag-icons",
            "fonts": "D:/Editor 2.0/Fonts"
        }
    }
    CFG_FILE.write_text(json.dumps(cfg_data, indent=2), encoding="utf-8")

    print(f"\nFolders ready:\n  tools : {studio}\n  videos: {videos}")
    if a.skip_install:
        print("Skipped installs (--skip-install).")
        return

    # Remotion (Node.js)
    remotion = studio / "projects" / "remotion-app"
    if not (remotion / "package.json").exists():
        print("\n== Creating Remotion project ==")
        run([tool("npx"), "--yes", "create-video@latest", "--blank", "remotion-app"],
            cwd=studio / "projects", check=False)
    if (remotion / "package.json").exists() and not (remotion / "node_modules").exists():
        run([tool("npm"), "install"], cwd=remotion)

    # Python venv + Manim + faster-whisper
    py = venv_python(studio)
    if not py.exists():
        print("\n== Creating Python venv ==")
        venv.create(py.parent.parent, with_pip=True)
    run([py, "-m", "pip", "install", "--upgrade", "pip"])
    run([py, "-m", "pip", "install", "manim", "faster-whisper"])

    print("\nSetup complete. Run `python studio.py doctor` to verify environment.")


def cmd_new(a):
    studio, videos, channels, _ = load_cfg()
    name = re.sub(r"[^A-Za-z0-9_-]+", "-", a.name).strip("-")

    channel_name = getattr(a, "channel", None)
    channel_cfg = None

    if channel_name:
        ch_dir = channels / channel_name
        if not ch_dir.exists():
            available = [c.name for c in channels.iterdir() if c.is_dir()]
            sys.exit(f"Channel '{channel_name}' not found. Available channels: {', '.join(available)}")
        ep_num = next_episode_number(ch_dir)
        folder_name = f"{ep_num}-{name}"
        p = ch_dir / "videos" / folder_name
        rel_root = f"Channels/{channel_name}/videos/{folder_name}"
        ch_cfg_file = ch_dir / "channel.json"
        if ch_cfg_file.exists():
            try:
                channel_cfg = json.loads(ch_cfg_file.read_text(encoding="utf-8"))
            except Exception:
                pass
    else:
        folder_name = name
        p = videos / folder_name
        rel_root = f"Videos/{folder_name}"

    # Standardized full directory structure as specified:
    is_vanta = (channel_name == "VantaBrief")

    # Standardized full directory structure:
    if is_vanta:
        subdirs = [
            p / "assets" / "audio" / "voice",
            p / "assets" / "user-footage",
            p / "assets" / "screenshots",
            p / "assets" / "images" / "b-roll",
            p / "assets" / "images" / "icons",
            p / "assets" / "images" / "logos",
            p / "assets" / "video" / "source",
            p / "assets" / "fonts",
            p / "transcripts",
            p / "manifests",
            p / "timeline",
            p / "prompts",
            p / "templates",
            p / "renders",
            p / "notes"
        ]
    else:
        subdirs = [
            p / "assets" / "audio" / "voice",
            p / "assets" / "audio" / "music",
            p / "assets" / "audio" / "sfx",
            p / "assets" / "images" / "b-roll",
            p / "assets" / "images" / "generated",
            p / "assets" / "images" / "icons",
            p / "assets" / "images" / "logos",
            p / "assets" / "video" / "source",
            p / "assets" / "video" / "b-roll",
            p / "assets" / "video" / "generated",
            p / "assets" / "fonts",
            p / "transcripts",
            p / "manifests",
            p / "timeline",
            p / "prompts",
            p / "templates",
            p / "renders",
            p / "notes"
        ]
    for d in subdirs:
        d.mkdir(parents=True, exist_ok=True)

    # project.json with relative paths and channel identity
    project_cfg = {
        "name": folder_name,
        "title": name,
        "channel": channel_name,
        "created_at": datetime.now().isoformat(),
        "resolution": {"width": 1920, "height": 1080},
        "fps": 30,
        "aspect_ratio": "16:9",
        "style_bible": "Channels/VantaBrief/style/VantaBrief_Visual_Style_Bible.md" if is_vanta else None,
        "paths": {
            "root": rel_root,
            "assets": f"{rel_root}/assets",
            "transcripts": f"{rel_root}/transcripts",
            "manifests": f"{rel_root}/manifests",
            "timeline": f"{rel_root}/timeline",
            "renders": f"{rel_root}/renders"
        },
        "audio": {
            "voiceover_file": None,
            "duration_seconds": None,
            "transcription_status": "pending",
            "sfx_enabled": False if is_vanta else True,
            "bg_music_enabled": False if is_vanta else True
        },
        "render_settings": {
            "default_codec": "h264",
            "transparent_codec": "prores"
        }
    }
    (p / "project.json").write_text(json.dumps(project_cfg, indent=2), encoding="utf-8")

    # Initial Manifests (valid JSON / Markdown)
    manifest_names = ["assets.json", "b-roll.json", "icons.json", "logos.json"] if is_vanta else ["assets.json", "b-roll.json", "sound-effects.json", "icons.json", "logos.json"]
    for manifest_name in manifest_names:
        mf = p / "manifests" / manifest_name
        if not mf.exists():
            mf.write_text("[]\n", encoding="utf-8")

    if is_vanta:
        fn_file = p / "manifests" / "footage-needed.md"
        if not fn_file.exists():
            fn_file.write_text("# Footage & Recording Manifest\n\nAll missing footage slots must use centered `FOOTAGE NEEDED` placeholder slates.\n\n| Slot ID | Timecode | Duration | Shot Description & Search Keyword | Status |\n| :--- | :--- | :--- | :--- | :--- |\n", encoding="utf-8")

    # Initial Transcripts (valid empty templates ready for faster-whisper)
    transcript_files = {
        "transcript.txt": f"# Narration transcript for: {folder_name}\n# Place voiceover in assets/audio/voice/ and run: python studio.py transcribe {folder_name}\n",
        "transcript.json": json.dumps({"status": "pending", "project": folder_name, "audio_file": None, "segments": []}, indent=2) + "\n",
        "word-timestamps.json": "[]\n",
        "captions.json": "[]\n"
    }
    for t_name, t_content in transcript_files.items():
        tf = p / "transcripts" / t_name
        if not tf.exists():
            tf.write_text(t_content, encoding="utf-8")

    # Markdown Docs
    if is_vanta:
        (p / "AGENTS.md").write_text(VANTABRIEF_PROJECT_AGENTS_TEMPLATE.format(name=folder_name), encoding="utf-8")
        (p / "brief.md").write_text(BRIEF_MD_TEMPLATE.format(name=folder_name), encoding="utf-8")
        (p / "style.md").write_text(VANTABRIEF_STYLE_MD_TEMPLATE.format(name=folder_name), encoding="utf-8")
        (p / "frames.md").write_text(VANTABRIEF_FRAMES_MD_TEMPLATE.format(name=folder_name), encoding="utf-8")
    else:
        (p / "AGENTS.md").write_text(PROJECT_AGENTS_TEMPLATE.format(name=folder_name), encoding="utf-8")
        (p / "brief.md").write_text(BRIEF_MD_TEMPLATE.format(name=folder_name), encoding="utf-8")
        (p / "style.md").write_text(STYLE_MD_TEMPLATE.format(name=folder_name), encoding="utf-8")
        (p / "frames.md").write_text(FRAMES_MD_TEMPLATE.format(name=folder_name), encoding="utf-8")

    # Run automated visual planner to seed timeline/scenes.json and manifests/footage-needed.md
    try:
        py = venv_python(studio)
        script = studio / "scripts" / "visual_planner.py"
        if py.exists() and script.exists():
            subprocess.run([str(py), str(script), str(p)], capture_output=True, text=True)
    except Exception as e:
        print(f"Initial visual planner note: {e}")

    print(f"\nCreated complete video project scaffolding at:\n  {p}")
    if channel_name:
        print(f"  Channel: {channel_name} (Episode: {folder_name})")
    print("\nNext steps:")
    print(f"  1. Place your voiceover in: {p / 'assets' / 'audio' / 'voice'}")
    print(f"  2. Transcribe: python studio.py transcribe {folder_name}")
    print(f"  3. Plan scenes: python studio.py plan-scenes {folder_name}")
    print(f"  4. Render draft: python studio.py render-draft {folder_name}")


def cmd_transcribe(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    py = venv_python(studio)
    if not py.exists():
        sys.exit(f"Python venv not found at {py}. Run python studio.py setup first.")

    voice_dir = proj / "assets" / "audio" / "voice"
    voice_files = []
    if voice_dir.exists():
        for ext in [".mp3", ".wav", ".m4a", ".aac", ".flac", ".ogg"]:
            voice_files.extend(list(voice_dir.glob(f"*{ext}")))

    target_audio = None
    if a.file:
        candidate = Path(a.file)
        if candidate.is_absolute() and candidate.exists():
            target_audio = candidate
        elif (voice_dir / a.file).exists():
            target_audio = voice_dir / a.file
        elif (proj / a.file).exists():
            target_audio = proj / a.file
        else:
            sys.exit(f"Audio file '{a.file}' not found.")
    else:
        if not voice_files:
            sys.exit(
                f"No voiceover audio found in:\n  {voice_dir}\n"
                "Please place your narration audio (.mp3, .wav, .m4a) there, then rerun:\n"
                f"  python studio.py transcribe {a.project}"
            )
        if len(voice_files) == 1:
            target_audio = voice_files[0]
        else:
            print(f"Multiple voiceover files found in {voice_dir.name}:")
            for i, vf in enumerate(voice_files, 1):
                print(f"  [{i}] {vf.name}")
            target_audio = voice_files[0]
            print(f"Using default: {target_audio.name} (use --file to select another).")

    transcripts_dir = proj / "transcripts"
    script = studio / "scripts" / "transcribe.py"

    cmd = [
        str(py), str(script), str(target_audio),
        "--out", str(transcripts_dir),
        "--model", a.model,
        "--device", a.device,
        "--compute-type", a.compute_type
    ]
    if a.language:
        cmd += ["--language", a.language]

    run(cmd)

    # Update project.json
    cfg_file = proj / "project.json"
    if cfg_file.exists():
        try:
            cfg = json.loads(cfg_file.read_text(encoding="utf-8"))
            transcript_json_path = transcripts_dir / "transcript.json"
            if transcript_json_path.exists():
                t_data = json.loads(transcript_json_path.read_text(encoding="utf-8"))
                cfg["audio"]["voiceover_file"] = target_audio.name
                cfg["audio"]["duration_seconds"] = t_data.get("duration_seconds")
                cfg["audio"]["language"] = t_data.get("language")
                cfg["audio"]["transcription_status"] = "completed"
                cfg_file.write_text(json.dumps(cfg, indent=2), encoding="utf-8")
        except Exception as e:
            print(f"Warning: Could not update project.json: {e}")

    # 3. Automatic script crosschecking & alignment if human script is found
    script_candidates = [
        proj / "assets" / "audio" / "voice" / "script.txt",
        proj / "script.txt",
        proj / "transcripts" / "script.txt"
    ]
    found_script = None
    for cand in script_candidates:
        if cand.exists():
            found_script = cand
            break

    if found_script:
        print(f"\n-> Found original user script: {found_script.name}")
        print("   Crosschecking and aligning proper names and word timestamps...")
        align_script = studio / "scripts" / "align_script.py"
        try:
            run([str(py), str(align_script), str(proj), "--script", str(found_script)])
        except Exception as e:
            print(f"Warning: Script alignment note: {e}")


def cmd_align_script(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    py = venv_python(studio)
    align_script = studio / "scripts" / "align_script.py"
    cmd = [str(py), str(align_script), str(proj), "--fps", str(a.fps)]
    if a.script:
        cmd += ["--script", a.script]
    run(cmd)


def cmd_index_assets(a):
    studio, videos, channels, libraries = load_cfg()
    py = venv_python(studio)
    script = studio / "scripts" / "asset_indexer.py"

    if a.all or not a.directory:
        print("Scanning all configured asset libraries from studio.json...")
        all_assets = []
        for cat, path_str in libraries.items():
            if not path_str or path_str.startswith("project:"):
                continue
            lib_path = Path(path_str).expanduser().resolve()
            if lib_path.exists():
                print(f"-> Scanning [{cat}]: {lib_path}")
                cmd = [
                    str(py), "-c",
                    f"import sys, json; sys.path.insert(0, r'{studio / 'scripts'}'); "
                    f"from asset_indexer import scan_directory; "
                    f"items = scan_directory(r'{lib_path}'); "
                    f"print(json.dumps(items))"
                ]
                try:
                    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
                    items = json.loads(res.stdout)
                    for item in items:
                        if cat in ["sfx", "music", "icons", "fonts", "broll"]:
                            item["category"] = "b-roll" if cat == "broll" else cat
                    all_assets.extend(items)
                    print(f"   Indexed {len(items)} assets from {cat}")
                except Exception as e:
                    print(f"   Warning: Failed indexing {cat}: {e}")

        master_index = studio / "library_index.json"
        index_data = {
            "indexed_at": str(Path().cwd()),
            "total_assets": len(all_assets),
            "assets": all_assets
        }
        master_index.write_text(json.dumps(index_data, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"\nSaved combined master asset index ({len(all_assets)} total assets) to:\n  {master_index}")
        return

    target_dir = Path(a.directory).expanduser().resolve()
    cmd = [str(py), str(script), "scan", str(target_dir)]
    if a.out:
        cmd += ["--out", a.out]
    run(cmd)


def cmd_search_assets(a):
    studio, videos, channels, _ = load_cfg()
    py = venv_python(studio)
    script = studio / "scripts" / "asset_indexer.py"

    index_file = None
    if a.index:
        index_file = Path(a.index)
    else:
        candidates = [
            studio / "library_index.json",
            videos / "library_index.json",
            studio / "scripts" / "library_index.json"
        ]
        for c in candidates:
            if c.exists():
                index_file = c
                break

    if not index_file or not index_file.exists():
        sys.exit(
            "No asset index found. Scan your asset directory first with:\n"
            "  python studio.py index-assets --all"
        )

    cmd = [str(py), str(script), "search", str(index_file), a.query]
    if a.category:
        cmd += ["--category", a.category]
    if a.type:
        cmd += ["--type", a.type]
    if a.max_duration:
        cmd += ["--max-duration", str(a.max_duration)]
    run(cmd)


def cmd_import_asset(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    py = venv_python(studio)
    script = studio / "scripts" / "asset_indexer.py"
    cmd = [
        str(py), str(script), "import", str(proj), a.file,
        "--category", a.category,
        "--license", a.license,
        "--attribution", a.attribution
    ]
    run(cmd)


def cmd_inspect_media(a):
    studio, _, _, _ = load_cfg()
    py = venv_python(studio)
    script = studio / "scripts" / "media_inspector.py"
    run([str(py), str(script), "inspect", str(Path(a.file).resolve())])


def cmd_validate(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    py = venv_python(studio)
    script = studio / "scripts" / "media_inspector.py"
    run([str(py), str(script), "validate", str(proj)])


def ensure_remotion_assets(studio: Path, proj: Path):
    app_fonts = studio / "projects" / "remotion-app" / "public" / "fonts"
    proj_fonts = proj / "assets" / "fonts"
    if app_fonts.exists() and not proj_fonts.exists():
        proj_fonts.parent.mkdir(parents=True, exist_ok=True)
        shutil.copytree(app_fonts, proj_fonts)


def cmd_render_remotion(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    app = studio / "projects" / "remotion-app"
    ensure_remotion_assets(studio, proj)
    ext = "mov" if a.transparent else "mp4"
    out = proj / "renders" / f"{a.composition}.{ext}"
    out.parent.mkdir(parents=True, exist_ok=True)
    cmd = [tool("npx"), "remotion", "render", "src/index.ts", a.composition, str(out),
           f"--public-dir={proj / 'assets'}"]
    if a.transparent:
        cmd += ["--codec=prores", "--prores-profile=4444",
                "--pixel-format=yuva444p10le", "--image-format=png"]
    else:
        cmd += ["--codec=h264"]
    run(cmd, cwd=app)
    print(f"Saved {out}")


def cmd_new_video(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    py = venv_python(studio)
    print("=" * 60)
    print(f"   VANTABRIEF UNIFIED 1-COMMAND VIDEO PIPELINE: {proj.name}")
    print("=" * 60 + "\n")

    # Step 1: Transcribe & Calibrate if needed
    voice_file = proj / "assets" / "audio" / "voice" / "audio.mp3"
    words_file = proj / "transcripts" / "transcript.words.json"
    if voice_file.exists() and not words_file.exists():
        print("--> Step 1: Transcribing voiceover & calibrating speech sync...")
        transcribe_script = studio / "scripts" / "transcribe.py"
        run([str(py), str(transcribe_script), str(proj)])

    # Step 2 & 3: Semantic Beats & Variety Engine
    print("--> Step 2 & 3: Building semantic thought beats across 47 templates...")
    beats_script = studio / "scripts" / "build_beats.py"
    run([str(py), str(beats_script)])

    # Step 4: QA Gate
    print("--> Step 4: Running 7 Production QA Gates...")
    run(["npx", "tsx", "scripts/qa.ts"], cwd=studio)

    # Step 5: Render (if --auto)
    if getattr(a, "auto", False):
        print("--> Step 5: Rendering final composition...")
        cmd_render_remotion(argparse.Namespace(
            project=a.project,
            composition="VantaBrief-Episode-003",
            transparent=False
        ))
    else:
        print("\n✔ Production pipeline complete!")
        print("Review checkpoint: docs/beats-review.md")
        print("Footage checklist: manifests/PLACEHOLDERS.md")
        print("To render: python studio.py render-remotion <project> VantaBrief-Episode-003")


def cmd_plan_motion(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    py = venv_python(studio)
    script = studio / "scripts" / "motion_planner.py"
    ch = getattr(a, "channel", "VantaBrief")
    run([str(py), str(script), str(proj), ch])


def cmd_research_references(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    py = venv_python(studio)
    script = studio / "scripts" / "reference_researcher.py"
    run([str(py), str(script), str(proj)])


def cmd_render_motion_graphics(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    py = venv_python(studio)
    script = studio / "scripts" / "render_motion_graphics.py"
    args = [str(py), str(script), str(proj)]
    if getattr(a, "transparent", False):
        args.append("--transparent")
    run(args)


def cmd_render_all_motion(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    py = venv_python(studio)
    ch = getattr(a, "channel", "VantaBrief")
    print("=" * 70)
    print(f"   MOTION STUDIO: REFERENCE-DRIVEN MOTION GRAPHICS PIPELINE")
    print(f"   Project: {proj.name} | Channel: {ch}")
    print("=" * 70 + "\n")
    
    # 1. Transcribe voiceover if transcripts not found
    words_file = proj / "transcripts" / "transcript.words.json"
    transcript_file = proj / "transcripts" / "transcript.json"
    if not words_file.exists() and not transcript_file.exists():
        print("--> Step 1: Transcribing voiceover audio...")
        transcribe_script = studio / "scripts" / "transcribe.py"
        run([str(py), str(transcribe_script), str(proj)])
        
    # 2. Identify key animation-worthy moments (3-5 moments)
    print("--> Step 2: Analyzing script & selecting animation-worthy moments...")
    planner_script = studio / "scripts" / "motion_planner.py"
    run([str(py), str(planner_script), str(proj), ch])
    
    # 3. Research verified visual references
    print("--> Step 3: Researching verified visual design references...")
    ref_script = studio / "scripts" / "reference_researcher.py"
    run([str(py), str(ref_script), str(proj)])
    
    # 4. Render standalone clips & generate Premiere Editing Guide
    print("--> Step 4: Rendering standalone clips & generating Premiere Editing Guide...")
    render_script = studio / "scripts" / "render_motion_graphics.py"
    args = [str(py), str(render_script), str(proj)]
    if getattr(a, "transparent", False):
        args.append("--transparent")
    run(args)
    print("\n[SUCCESS] Reference-driven motion graphics pipeline complete!")


def cmd_render_manim(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    scene_file = Path(a.file)
    if not scene_file.is_absolute():
        scene_file = studio / "projects" / "manim-app" / "scenes" / a.file
    manim_renders_dir = proj / "renders" / "manim"
    manim_renders_dir.mkdir(parents=True, exist_ok=True)
    cmd = [venv_python(studio), "-m", "manim", f"-q{a.quality}",
           "--media_dir", str(manim_renders_dir), str(scene_file), a.scene]
    if a.transparent:
        cmd += ["-t", "--format=mov"]
    run(cmd)
    print(f"Saved under {manim_renders_dir}")


def cmd_doctor(a):
    studio, videos, channels, libraries = load_cfg()
    print("=== System & Environment Health Check ===")
    tools_to_check = ["node", "npm", "npx", "python3" if not IS_WIN else "python", "ffmpeg", "ffprobe", "git"]
    for name in tools_to_check:
        p = shutil.which(name)
        status = f"OK   ({p})" if p else "MISSING"
        print(f"  {name:10} {status}")

    # Remotion
    remotion_dir = studio / "projects" / "remotion-app"
    if (remotion_dir / "node_modules").exists():
        print(f"  {'remotion':10} OK   (installed in {remotion_dir})")
    else:
        print(f"  {'remotion':10} MISSING node_modules")

    # Manim & venv
    py = venv_python(studio)
    if py.exists():
        print(f"  {'python-venv':10} OK   ({py})")
        # Check faster-whisper
        try:
            r = subprocess.run([str(py), "-c", "import faster_whisper; print('OK')"], capture_output=True, text=True)
            if "OK" in r.stdout:
                print(f"  {'whisper':10} OK   (faster-whisper available)")
            else:
                print(f"  {'whisper':10} MISSING ({r.stderr.strip()})")
        except Exception:
            print(f"  {'whisper':10} MISSING")

        # Check CUDA
        try:
            r = subprocess.run([str(py), "-c", "import ctranslate2; print(ctranslate2.get_cuda_device_count())"], capture_output=True, text=True)
            count = int(r.stdout.strip()) if r.stdout.strip().isdigit() else 0
            if count > 0:
                print(f"  {'cuda/gpu':10} OK   (1 NVIDIA GPU detected for ctranslate2)")
            else:
                print(f"  {'cuda/gpu':10} CPU ONLY")
        except Exception:
            print(f"  {'cuda/gpu':10} CPU ONLY")

        # Check Manim
        try:
            r = subprocess.run([str(py), "-m", "manim", "--version"], capture_output=True, text=True)
            if r.returncode == 0:
                print(f"  {'manim':10} OK   ({r.stdout.strip()})")
            else:
                print(f"  {'manim':10} WARNING")
        except Exception:
            print(f"  {'manim':10} ERROR")
    else:
        print(f"  {'python-venv':10} MISSING ({py})")

    print("\n=== Folders ===")
    print(f"  Studio tools  : {studio}")
    print(f"  Video projects: {videos}")
    print(f"  Channels root : {channels}")
    if channels.exists():
        ch_names = [c.name for c in channels.iterdir() if c.is_dir()]
        print(f"  Active channels: {', '.join(ch_names) if ch_names else 'None'}")
    if libraries:
        print("\n=== Configured Asset Libraries ===")
        for k, v in libraries.items():
            print(f"  {k:10}: {v or '(Not configured yet)'}")


def cmd_channel(a):
    studio, videos, channels, _ = load_cfg()
    subcmd = getattr(a, "channel_cmd", "list")
    if subcmd == "list" or not subcmd:
        print("\n=== Configured Video Channels ===")
        if not channels.exists():
            print("No Channels/ directory found.")
            return
        ch_list = [c for c in channels.iterdir() if c.is_dir()]
        if not ch_list:
            print("No channels registered yet. Create one in Channels/<ChannelName>/.")
            return
        for c in ch_list:
            cfg_f = c / "channel.json"
            tagline = ""
            if cfg_f.exists():
                try:
                    c_data = json.loads(cfg_f.read_text(encoding="utf-8"))
                    tagline = c_data.get("tagline", "")
                except Exception:
                    pass
            ep_count = len([v for v in (c / "videos").iterdir() if v.is_dir()]) if (c / "videos").exists() else 0
            print(f"  • {c.name:<16} [{ep_count:02d} episodes]  {tagline}")
        print("\nCreate a video for a channel: python studio.py new <title> --channel <channel>")

    elif subcmd == "info":
        ch_dir = channels / a.channel_name
        if not ch_dir.exists():
            sys.exit(f"Channel '{a.channel_name}' not found.")
        cfg_f = ch_dir / "channel.json"
        if cfg_f.exists():
            print(f"\n=== Channel Configuration: {a.channel_name} ===")
            print(cfg_f.read_text(encoding="utf-8"))
        else:
            print(f"Channel found at {ch_dir}, but no channel.json found.")


def cmd_plan_scenes(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    py = venv_python(studio)
    script = studio / "scripts" / "visual_planner.py"
    run([str(py), str(script), str(proj), "--fps", str(a.fps)])


def cmd_capture_web(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    py = venv_python(studio)
    script = studio / "scripts" / "web_capture.py"
    out_dir = proj / "assets" / "images" / "generated"
    cmd = [str(py), str(script), a.url, "--out", str(out_dir)]
    if a.filename:
        cmd += ["--filename", a.filename]
    if a.selector:
        cmd += ["--selector", a.selector]
    if a.light:
        cmd += ["--light"]
    run(cmd)

    # Log to manifests/assets.json
    try:
        manifest_file = proj / "manifests" / "assets.json"
        items = json.loads(manifest_file.read_text(encoding="utf-8")) if manifest_file.exists() else []
        items.append({
            "filename": a.filename or a.url.split("//")[-1][:30],
            "project_path": f"assets/images/generated/{a.filename or 'web-capture.png'}",
            "category": "screenshot",
            "source_url": a.url,
            "captured_at": datetime.now().isoformat(),
            "license": "authorized_capture"
        })
        manifest_file.write_text(json.dumps(items, indent=2), encoding="utf-8")
        print(f"Logged capture in {manifest_file}")
    except Exception as e:
        print(f"Note: Could not log to manifests/assets.json: {e}")


def cmd_render_draft(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    app = studio / "projects" / "remotion-app"

    # Ensure scenes.json exists
    scenes_json = proj / "timeline" / "scenes.json"
    if not scenes_json.exists():
        print("Planning scenes before draft render...")
        py = venv_python(studio)
        script = studio / "scripts" / "visual_planner.py"
        run([str(py), str(script), str(proj)])

    comp = a.composition or "ChannelVideo"
    ensure_remotion_assets(studio, proj)
    out = proj / "renders" / f"draft-{comp}.mp4"
    out.parent.mkdir(parents=True, exist_ok=True)

    cmd = [
        tool("npx"), "remotion", "render", "src/index.ts", comp, str(out),
        f"--public-dir={proj / 'assets'}",
        "--codec=h264",
        f"--scale={a.scale}"
    ]
    run(cmd, cwd=app)
    print(f"\n[DRAFT RENDER COMPLETE]\nSaved draft video to: {out}")
    print(f"Inspect footage checklist: {proj / 'manifests' / 'footage-needed.md'}")


def cmd_report(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    manifests_dir = proj / "manifests"
    report_file = manifests_dir / "production-report.md"

    p_cfg = {}
    p_json = proj / "project.json"
    if p_json.exists():
        try:
            p_cfg = json.loads(p_json.read_text(encoding="utf-8"))
        except Exception:
            pass

    timeline_scenes = []
    scenes_f = proj / "timeline" / "scenes.json"
    if scenes_f.exists():
        try:
            t_data = json.loads(scenes_f.read_text(encoding="utf-8"))
            timeline_scenes = t_data.get("scenes", [])
        except Exception:
            pass

    renders = [r.name for r in (proj / "renders").glob("*.mp4")] + [r.name for r in (proj / "renders").glob("*.mov")] if (proj / "renders").exists() else []

    footage_pending = 0
    fn_file = manifests_dir / "footage-needed.md"
    if fn_file.exists():
        footage_pending = fn_file.read_text(encoding="utf-8").count("Pending Recording")

    channel_name = p_cfg.get("channel", "Standalone")

    report_lines = [
        f"# Production Report: {proj.name}",
        f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "",
        "## Overview",
        f"- **Project**: `{proj.name}`",
        f"- **Channel**: `{channel_name}`",
        f"- **Location**: `{proj}`",
        f"- **Resolution**: {p_cfg.get('resolution', {}).get('width', 1920)}x{p_cfg.get('resolution', {}).get('height', 1080)} @ {p_cfg.get('fps', 30)} FPS",
        f"- **Total Scenes**: {len(timeline_scenes)}",
        f"- **Footage Recordings Needed**: {footage_pending}",
        f"- **Completed Renders**: {len(renders)} ({', '.join(renders) if renders else 'None'})",
        "",
        "## Scene Breakdown",
        "| ID | Type | Frames | Narration / Instruction |",
        "| :--- | :--- | :--- | :--- |"
    ]
    for sc in timeline_scenes:
        report_lines.append(f"| `{sc.get('id')}` | `{sc.get('type')}` | {sc.get('startFrame')} - {sc.get('endFrame')} ({sc.get('durationInFrames')}) | {sc.get('title', '')} |")

    report_lines.extend([
        "",
        "## Readiness Status",
        "⚠️ **DRAFT STAGE**: Final rendering blocked until pending footage recordings are supplied." if footage_pending > 0 else "✅ **READY FOR FINAL RENDER**: All scene assets and footage placeholders are satisfied.",
        "",
        f"Recording Checklist: [footage-needed.md]({proj / 'manifests' / 'footage-needed.md'})"
    ])

    report_file.write_text("\n".join(report_lines) + "\n", encoding="utf-8")
    print(f"\nGenerated production report:\n  {report_file}")


def cmd_clean(a):
    studio, videos, channels, _ = load_cfg()
    if a.all:
        if input(f"Delete studio virtual environments and caches? User video projects in {videos} are kept. [y/N] ").lower() != "y":
            return
        for p in [studio / "projects" / "remotion-app" / "node_modules",
                  studio / "projects" / "manim-app" / ".venv",
                  studio / "library_index.json"]:
            if p.exists():
                print("Removing", p)
                if p.is_dir():
                    shutil.rmtree(p, ignore_errors=True)
                else:
                    p.unlink(missing_ok=True)
        print(f"Studio clean complete. Video projects in {videos} are preserved.")
        return
    for p in [studio / "projects" / "remotion-app" / "node_modules",
              studio / "projects" / "manim-app" / ".venv"]:
        if p.exists():
            print("Removing", p)
            shutil.rmtree(p, ignore_errors=True)
    print("Done. Reinstall with: python studio.py setup")


def cmd_plan_motion(a):
    from scripts.motion_planner import plan_project_motion
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    channel_name = a.channel or "VantaBrief"
    plan_project_motion(proj, channel_name)


def cmd_research_references(a):
    from scripts.reference_researcher import research_references_for_plan
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    research_references_for_plan(proj)


def cmd_render_motion_graphics(a):
    from scripts.render_motion_graphics import render_standalone_clips
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    render_standalone_clips(proj, transparent=a.transparent)


def cmd_render_all_motion(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    channel_name = a.channel or "VantaBrief"

    print("\n=======================================================")
    print("   MOTION STUDIO: REFERENCE-DRIVEN PRODUCTION")
    print(f"   Project: {proj.name} | Channel: {channel_name}")
    print("=======================================================\n")

    from scripts.motion_planner import plan_project_motion
    plan_project_motion(proj, channel_name)

    from scripts.reference_researcher import research_references_for_plan
    research_references_for_plan(proj, verify_live=True)

    from scripts.render_motion_graphics import render_standalone_clips
    render_standalone_clips(proj, transparent=a.transparent)

    print("\n=======================================================")
    print("   [SUCCESS] All motion graphics rendered and verified!")
    print(f"   Editing Guide: {proj / 'editing_guide.md'}")
    print(f"   Clips:         {proj / 'renders' / 'motion-graphics'}")
    print("=======================================================\n")


def cmd_build_explainer_canvas(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    out_dir = proj / "renders" / "explainer-canvas"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / "explainer_canvas.mp4"
    remotion_app = studio / "projects" / "remotion-app"
    npx_cmd = "npx.cmd" if IS_WIN else "npx"
    comp_id = getattr(a, "composition", None) or "Workflow2-FullExplainerCanvas"
    cmd = [
        npx_cmd, "remotion", "render",
        "src/index.ts",
        comp_id,
        str(out_file.resolve()),
        "--codec=h264"
    ]
    print(f"\n--> Rendering Workflow 2 Explainer Canvas ({comp_id}) -> {out_file.name}...")
    subprocess.run(cmd, cwd=remotion_app, check=True)
def cmd_w2_words(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    from scripts.workflow2_pipeline import w2_words_cmd
    w2_words_cmd(proj)


def cmd_w2_assets(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    from scripts.workflow2_pipeline import w2_assets_cmd
    w2_assets_cmd(proj)


def cmd_w2_plan(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    from scripts.workflow2_pipeline import w2_plan_cmd
    w2_plan_cmd(proj, allow_missing=a.allow_missing)


def cmd_w2_preview(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    from scripts.workflow2_pipeline import w2_preview_cmd
    w2_preview_cmd(proj)


def cmd_w2_render(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    from scripts.workflow2_pipeline import w2_render_cmd
    w2_render_cmd(proj, crf=a.crf)


def cmd_w2_all(a):
    studio, videos, channels, _ = load_cfg()
    proj = project_dir(videos, a.project)
    from scripts.workflow2_pipeline import w2_words_cmd, w2_assets_cmd, w2_plan_cmd, w2_preview_cmd, w2_render_cmd
    print(f"\n=======================================================")
    print(f"   WORKFLOW 2: END-TO-END WHITEBOARD PIPELINE")
    print(f"   Project: {proj.name}")
    print(f"=======================================================\n")
    w2_words_cmd(proj)
    w2_assets_cmd(proj)
    w2_plan_cmd(proj, allow_missing=a.allow_missing)
    w2_preview_cmd(proj)
    w2_render_cmd(proj, crf=a.crf)


def main():
    ap = argparse.ArgumentParser(description="Motion Studio helper")
    sub = ap.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("setup", help="Create folders and install Remotion + Manim + faster-whisper")
    s.add_argument("--studio", default=".")
    s.add_argument("--videos", default="Videos")
    s.add_argument("--skip-install", action="store_true")
    s.set_defaults(fn=cmd_setup)

    s = sub.add_parser("new", help="Create a complete video project folder (supports --channel)")
    s.add_argument("name", help="Video title or slug")
    s.add_argument("--channel", help="Channel name (e.g. VantaBrief, HanaVanta). If omitted, saves in Videos/<name>/")
    s.set_defaults(fn=cmd_new)

    ch_p = sub.add_parser("channel", help="List or inspect configured video channels")
    ch_sub = ch_p.add_subparsers(dest="channel_cmd", required=False)
    ch_list_p = ch_sub.add_parser("list", help="List all configured channels")
    ch_list_p.set_defaults(fn=cmd_channel)
    ch_info_p = ch_sub.add_parser("info", help="View channel configuration")
    ch_info_p.add_argument("channel_name", help="Name of the channel")
    ch_info_p.set_defaults(fn=cmd_channel)
    ch_p.set_defaults(fn=cmd_channel)

    s = sub.add_parser("plan-scenes", help="Generate machine-readable scene timeline and recording checklist")
    s.add_argument("project", help="Project name or path")
    s.add_argument("--fps", type=int, default=30)
    s.set_defaults(fn=cmd_plan_scenes)

    s = sub.add_parser("capture-web", help="Capture screenshot of a public website or UI via Playwright")
    s.add_argument("project", help="Project name or path")
    s.add_argument("url", help="URL to capture")
    s.add_argument("--filename", help="Optional output image filename")
    s.add_argument("--selector", help="Optional CSS selector for targeted element capture")
    s.add_argument("--light", action="store_true", help="Force light mode")
    s.set_defaults(fn=cmd_capture_web)

    s = sub.add_parser("render-draft", help="Render fast draft video preview")
    s.add_argument("project", help="Project name or path")
    s.add_argument("composition", nargs="?", default="ChannelVideo", help="Composition ID (default: ChannelVideo)")
    s.add_argument("--scale", type=float, default=0.75, help="Render scale (default: 0.75)")
    s.set_defaults(fn=cmd_render_draft)

    s = sub.add_parser("report", help="Generate project production readiness report")
    s.add_argument("project", help="Project name or path")
    s.set_defaults(fn=cmd_report)

    s = sub.add_parser("transcribe", help="Transcribe voiceover locally with faster-whisper")
    s.add_argument("project", help="Project name (or relative path)")
    s.add_argument("--file", help="Specific voiceover filename in assets/audio/voice/")
    s.add_argument("--model", default="small", choices=["tiny", "base", "small", "medium"])
    s.add_argument("--device", default="auto", choices=["auto", "cuda", "cpu"])
    s.add_argument("--compute-type", default="auto")
    s.add_argument("--language", default=None)
    s.set_defaults(fn=cmd_transcribe)

    s = sub.add_parser("align-script", help="Crosscheck and align human script with Whisper timestamps")
    s.add_argument("project", help="Project name (or relative path)")
    s.add_argument("--script", help="Optional path to human script file (defaults to assets/audio/voice/script.txt)")
    s.add_argument("--fps", type=int, default=30)
    s.set_defaults(fn=cmd_align_script)

    s = sub.add_parser("index-assets", help="Scan and index external asset libraries")
    s.add_argument("directory", nargs="?", default=None, help="Path to asset directory (omit to scan all configured libraries)")
    s.add_argument("--all", action="store_true", help="Scan all configured asset libraries from studio.json")
    s.add_argument("--out", help="Output JSON index path")
    s.set_defaults(fn=cmd_index_assets)

    s = sub.add_parser("search-assets", help="Search indexed assets")
    s.add_argument("query", nargs="?", default="", help="Search query")
    s.add_argument("--index", help="Path to index JSON file")
    s.add_argument("--category", choices=["sfx", "music", "b-roll", "logos", "icons", "images", "fonts"])
    s.add_argument("--type", choices=["audio", "video", "image", "font"])
    s.add_argument("--max-duration", type=float)
    s.set_defaults(fn=cmd_search_assets)

    s = sub.add_parser("import-asset", help="Import an asset to project and record in manifests")
    s.add_argument("project")
    s.add_argument("file")
    s.add_argument("--category", default="b-roll", choices=["voice", "music", "sfx", "b-roll", "video", "images", "logos", "icons", "fonts"])
    s.add_argument("--license", default="free_or_owned")
    s.add_argument("--attribution", default="")
    s.set_defaults(fn=cmd_import_asset)

    s = sub.add_parser("inspect-media", help="Inspect technical specifications of media via FFprobe")
    s.add_argument("file")
    s.set_defaults(fn=cmd_inspect_media)

    s = sub.add_parser("validate", help="Validate project consistency before render")
    s.add_argument("project")
    s.set_defaults(fn=cmd_validate)

    s = sub.add_parser("new-video", help="Run unified end-to-end VantaBrief production workflow")
    s.add_argument("project", help="Project name or path")
    s.add_argument("--auto", action="store_true", help="Automatically trigger full render after QA")
    s.add_argument("--fps", type=int, default=30)
    s.add_argument("--vertical", action="store_true", help="9:16 vertical variant")
    s.set_defaults(fn=cmd_new_video)

    s = sub.add_parser("render-remotion", help="Render Remotion composition")
    s.add_argument("project")
    s.add_argument("composition")
    s.add_argument("--transparent", action="store_true")
    s.set_defaults(fn=cmd_render_remotion)

    s = sub.add_parser("render-manim", help="Render Manim scene")
    s.add_argument("project")
    s.add_argument("file")
    s.add_argument("scene")
    s.add_argument("--quality", default="h", choices=["l", "m", "h", "k"])
    s.add_argument("--transparent", action="store_true")
    s.set_defaults(fn=cmd_render_manim)

    sub.add_parser("doctor").set_defaults(fn=cmd_doctor)

    s = sub.add_parser("clean", help="Free disk space (preserves user projects in Videos/)")
    s.add_argument("--all", action="store_true")
    s.set_defaults(fn=cmd_clean)

    # --- Reference-Driven Standalone Motion Graphics Pipeline ---
    s = sub.add_parser("plan-motion", help="Analyze script & identify 3-5 animation-worthy moments")
    s.add_argument("project", help="Project name or relative path")
    s.add_argument("--channel", default="VantaBrief", help="Channel configuration (e.g. VantaBrief, HanaVanta)")
    s.set_defaults(fn=cmd_plan_motion)

    s = sub.add_parser("research-references", help="Research verified visual design references for planned moments")
    s.add_argument("project", help="Project name or relative path")
    s.set_defaults(fn=cmd_research_references)

    s = sub.add_parser("render-motion-graphics", help="Render standalone motion graphic clips & generate Editing Guide")
    s.add_argument("project", help="Project name or relative path")
    s.add_argument("--transparent", action="store_true", help="Export transparent ProRes 4444 alpha clips")
    s.set_defaults(fn=cmd_render_motion_graphics)

    s = sub.add_parser("render-all-motion", help="Run full 1-command Reference-Driven Motion Graphics pipeline")
    s.add_argument("project", help="Project name or relative path")
    s.add_argument("--channel", default="VantaBrief", help="Channel configuration (e.g. VantaBrief, HanaVanta)")
    s.add_argument("--transparent", action="store_true", help="Export transparent ProRes 4444 alpha clips")
    s.set_defaults(fn=cmd_render_all_motion)

    s = sub.add_parser("build-explainer-canvas", help="Render continuous Workflow 2 Infinite Explainer Canvas video")
    s.add_argument("project", help="Project name or relative path")
    s.add_argument("--channel", default="VantaBrief", help="Channel configuration")
    s.set_defaults(fn=cmd_build_explainer_canvas)

    # Workflow 2: Whiteboard Explainer Kit commands
    s = sub.add_parser("w2-words", help="Convert project Whisper transcript into workflow2/words.json")
    s.add_argument("project", help="Project name or relative path")
    s.set_defaults(fn=cmd_w2_words)

    s = sub.add_parser("w2-assets", help="Fetch verified logos & screenshots for workflow2/beats.json")
    s.add_argument("project", help="Project name or relative path")
    s.set_defaults(fn=cmd_w2_assets)

    s = sub.add_parser("w2-plan", help="Solve layout, camera and lint workflow2/beats.json")
    s.add_argument("project", help="Project name or relative path")
    s.add_argument("--allow-missing", action="store_true", help="Allow missing assets during drafting")
    s.set_defaults(fn=cmd_w2_plan)

    s = sub.add_parser("w2-preview", help="Render headless Playwright previews into workflow2/previews/")
    s.add_argument("project", help="Project name or relative path")
    s.set_defaults(fn=cmd_w2_preview)

    s = sub.add_parser("w2-render", help="Render master video & contact sheet for workflow2")
    s.add_argument("project", help="Project name or relative path")
    s.add_argument("--crf", type=int, default=18, help="H.264 CRF quality (default: 18)")
    s.set_defaults(fn=cmd_w2_render)

    s = sub.add_parser("w2-all", help="Run end-to-end Workflow 2 pipeline (words -> assets -> plan -> preview -> render)")
    s.add_argument("project", help="Project name or relative path")
    s.add_argument("--allow-missing", action="store_true", help="Allow missing assets during drafting")
    s.add_argument("--crf", type=int, default=18, help="H.264 CRF quality (default: 18)")
    s.set_defaults(fn=cmd_w2_all)

    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
