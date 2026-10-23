#!/usr/bin/env python3
"""
Media inspection and project validation utility.
Inspects audio/video files via ffprobe and validates video project consistency.
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path

def inspect_media_cli(file_path: Path):
    """Run ffprobe on a file and display readable specs."""
    file_path = Path(file_path).resolve()
    if not file_path.exists():
        print(f"Error: File not found: {file_path}")
        return False

    ffprobe = shutil.which("ffprobe")
    if not ffprobe:
        print("Error: ffprobe is not installed or not found on PATH.")
        return False

    cmd = [
        ffprobe,
        "-v", "quiet",
        "-print_format", "json",
        "-show_format",
        "-show_streams",
        str(file_path)
    ]
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        data = json.loads(res.stdout)
    except Exception as e:
        print(f"Failed to inspect media file: {e}")
        return False

    fmt = data.get("format", {})
    streams = data.get("streams", [])

    print(f"\n=== Media Inspection: {file_path.name} ===")
    print(f"Path: {file_path}")
    print(f"Container: {fmt.get('format_long_name', fmt.get('format_name', 'Unknown'))}")
    try:
        duration = float(fmt.get("duration", 0))
        mins, secs = divmod(duration, 60)
        print(f"Duration: {int(mins)}m {secs:.2f}s ({duration:.2f} seconds)")
    except Exception:
        pass
    try:
        size_mb = float(fmt.get("size", 0)) / (1024 * 1024)
        print(f"File Size: {size_mb:.2f} MB")
    except Exception:
        pass
    try:
        bitrate_kbps = float(fmt.get("bit_rate", 0)) / 1000
        print(f"Overall Bitrate: {bitrate_kbps:.0f} kbps")
    except Exception:
        pass

    for i, s in enumerate(streams):
        codec_type = s.get("codec_type")
        codec_name = s.get("codec_name")
        codec_long = s.get("codec_long_name", codec_name)
        print(f"\n--- Stream #{i} ({codec_type.upper() if codec_type else 'OTHER'}) ---")
        print(f"  Codec: {codec_long} ({codec_name})")
        if codec_type == "video":
            width = s.get("width")
            height = s.get("height")
            print(f"  Resolution: {width}x{height}")
            r_fps = s.get("r_frame_rate", "")
            if "/" in r_fps:
                try:
                    num, den = r_fps.split("/")
                    fps = float(num) / float(den)
                    print(f"  Frame Rate: {fps:.2f} fps")
                except Exception:
                    pass
            print(f"  Pixel Format: {s.get('pix_fmt', 'Unknown')}")
        elif codec_type == "audio":
            print(f"  Sample Rate: {s.get('sample_rate')} Hz")
            print(f"  Channels: {s.get('channels')} ({s.get('channel_layout', 'stereo')})")
            if s.get("bit_rate"):
                try:
                    abps = float(s.get("bit_rate")) / 1000
                    print(f"  Bitrate: {abps:.0f} kbps")
                except Exception:
                    pass

    return True

def validate_project(project_dir: Path):
    """Validate consistency of video project directories, audio, manifests, and renders."""
    project_dir = Path(project_dir).resolve()
    if not project_dir.exists():
        print(f"Project not found: {project_dir}")
        return False

    print(f"\n=== Validating Project: {project_dir.name} ===")
    issues = []
    warnings = []

    # 1. Project config
    cfg_file = project_dir / "project.json"
    if not cfg_file.exists():
        issues.append("Missing project.json")
    else:
        try:
            cfg = json.loads(cfg_file.read_text(encoding="utf-8"))
            print(f"[OK] project.json loaded: {cfg.get('name', project_dir.name)} ({cfg.get('resolution', {}).get('width', 1920)}x{cfg.get('resolution', {}).get('height', 1080)} @ {cfg.get('fps', 30)}fps)")
        except Exception as e:
            issues.append(f"Invalid JSON in project.json: {e}")

    # 2. Key markdown files
    for doc in ["brief.md", "style.md", "frames.md", "AGENTS.md"]:
        f = project_dir / doc
        if not f.exists():
            warnings.append(f"Missing {doc}")
        else:
            print(f"[OK] {doc} exists")

    # 3. Voiceover narration audio
    voice_dir = project_dir / "assets" / "audio" / "voice"
    voice_files = list(voice_dir.glob("*")) if voice_dir.exists() else []
    voice_files = [v for v in voice_files if v.suffix.lower() in [".mp3", ".wav", ".m4a", ".aac", ".flac", ".ogg"]]
    if not voice_files:
        warnings.append("No voiceover narration audio found in assets/audio/voice/")
    else:
        print(f"[OK] Voiceover found: {', '.join(v.name for v in voice_files)}")

    # 4. Transcripts
    transcripts_dir = project_dir / "transcripts"
    if not (transcripts_dir / "transcript.json").exists():
        warnings.append("No transcript.json found. Run: python studio.py transcribe <project>")
    else:
        print(f"[OK] transcript.json exists")

    if not (transcripts_dir / "word-timestamps.json").exists():
        warnings.append("No word-timestamps.json found. Synchronized captions may be unavailable.")
    else:
        print(f"[OK] word-timestamps.json exists")

    # 5. Manifests and referenced assets existence
    manifests_dir = project_dir / "manifests"
    master_manifest = manifests_dir / "assets.json"
    if master_manifest.exists():
        try:
            items = json.loads(master_manifest.read_text(encoding="utf-8"))
            missing_assets = []
            for item in items:
                proj_rel = item.get("project_path")
                if proj_rel:
                    p = project_dir / proj_rel
                    if not p.exists():
                        missing_assets.append(f"{item.get('filename')} (expected at {proj_rel})")
            if missing_assets:
                issues.append(f"Assets registered in manifest but missing on disk: {', '.join(missing_assets)}")
            else:
                print(f"[OK] All {len(items)} manifest assets exist on disk")
        except Exception as e:
            issues.append(f"Corrupted manifests/assets.json: {e}")

    # 6. Timeline and scenes verification
    timeline_dir = project_dir / "timeline"
    scenes_file = timeline_dir / "scenes.json"
    if scenes_file.exists():
        try:
            t_data = json.loads(scenes_file.read_text(encoding="utf-8"))
            scenes = t_data.get("scenes", [])
            print(f"[OK] timeline/scenes.json valid ({len(scenes)} scenes, {t_data.get('totalFrames', 0)} frames)")
            for sc in scenes:
                if sc.get("startFrame", 0) >= sc.get("endFrame", 0):
                    issues.append(f"Scene {sc.get('id')} has invalid frame range: {sc.get('startFrame')} >= {sc.get('endFrame')}")
        except Exception as e:
            issues.append(f"Invalid timeline/scenes.json: {e}")
    else:
        warnings.append("No timeline/scenes.json found. Run: python studio.py plan-scenes <project>")

    # 7. Footage placeholder recording checklist
    footage_needed_file = manifests_dir / "footage-needed.md"
    if footage_needed_file.exists():
        txt = footage_needed_file.read_text(encoding="utf-8")
        if "Pending Recording" in txt:
            pending_count = txt.count("Pending Recording")
            warnings.append(f"Footage needed: {pending_count} recording(s) pending in manifests/footage-needed.md")
        else:
            print("[OK] Footage checklist complete (all recordings supplied or none required)")

    # 8. Renders directory
    renders_dir = project_dir / "renders"
    if renders_dir.exists():
        renders = [r.name for r in renders_dir.glob("*.mp4")] + [r.name for r in renders_dir.glob("*.mov")]
        if renders:
            print(f"[OK] Completed renders present: {', '.join(renders)}")
        else:
            print(f"[INFO] No renders produced yet in {renders_dir.name}/")

    print("\n--- Validation Summary ---")
    if not issues and not warnings:
        print("ALL CHECKS PASSED: Project structure is complete and consistent!")
        return True

    if warnings:
        print("Warnings (non-blocking):")
        for w in warnings:
            print(f"  - {w}")

    if issues:
        print("Errors / Issues:")
        for iss in issues:
            print(f"  - {iss}")
        return False

    return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python media_inspector.py inspect <file_path> | validate <project_dir>")
        sys.exit(1)

    cmd = sys.argv[1]
    if cmd == "inspect" and len(sys.argv) >= 3:
        inspect_media_cli(Path(sys.argv[2]))
    elif cmd == "validate" and len(sys.argv) >= 3:
        validate_project(Path(sys.argv[2]))
    else:
        # Default inspect if file passed
        inspect_media_cli(Path(cmd))
