#!/usr/bin/env python3
"""new_video.py — Start a new Editor V1 video project from a talking-head recording.
Cross-platform (Windows, macOS, Linux). Automatically detects 16:9 widescreen vs 9:16 vertical Shorts.

Usage:
    python new_video.py <recording> [name] [--dir <parent>] [--vertical]
"""
import argparse
import datetime
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

def run_cmd(cmd, **kw):
    return subprocess.run(cmd, check=True, capture_output=True, text=True, **kw)

def get_video_info(path):
    out = run_cmd([
        'ffprobe', '-v', 'error',
        '-select_streams', 'v:0',
        '-show_entries', 'stream=width,height,duration',
        '-of', 'json', str(path)
    ]).stdout
    data = json.loads(out)
    streams = data.get('streams', [])
    if not streams:
        raise ValueError(f"No video stream found in {path}")
    w = int(streams[0].get('width', 1920))
    h = int(streams[0].get('height', 1080))
    d = float(streams[0].get('duration', 0.0))
    return w, h, d

def main():
    ap = argparse.ArgumentParser(description="Initialize new Workflow 4 Editor V1 project")
    ap.add_argument("recording", help="Path to raw talking-head recording (.mov/.mp4/.mkv)")
    ap.add_argument("name", nargs="?", default="", help="Project folder name")
    ap.add_argument("--dir", default="", help="Parent directory (default: Videos/editor-v1 or channels)")
    ap.add_argument("--vertical", action="store_true", help="Force 9:16 vertical Short (1080x1920)")
    args = ap.parse_args()

    rec_path = Path(args.recording).resolve()
    if not rec_path.is_file():
        sys.exit(f"Error: recording file not found at {rec_path}")

    # Skill directory
    skill_dir = Path(__file__).resolve().parent.parent

    # Verify GSAP exists
    gsap_file = skill_dir / "assets" / "vendor" / "gsap.min.js"
    if not gsap_file.is_file():
        sys.exit(f"Error: GSAP missing at {gsap_file}. Run scripts/doctor.sh or download gsap.min.js.")

    orig_w, orig_h, dur = get_video_info(rec_path)
    is_vertical = args.vertical or (orig_h > orig_w)
    target_w, target_h = (1080, 1920) if is_vertical else (1920, 1080)
    print(f"--> Input video: {orig_w}x{orig_h} ({'9:16 Vertical Short' if is_vertical else '16:9 Landscape'})")

    # Destination naming
    base_name = args.name
    if not base_name:
        clean_stem = re.sub(r'[^a-zA-Z0-9]+', '-', rec_path.stem).strip('-').lower()[:40]
        today = datetime.date.today().isoformat()
        base_name = f"{today}-{clean_stem}"

    # Target directory
    if args.dir:
        parent_dir = Path(args.dir).resolve()
    else:
        # Default inside workspace under Videos/editor-v1/
        workspace_root = Path(__file__).resolve().parents[3]
        parent_dir = workspace_root / "Videos" / "editor-v1"

    vd = parent_dir / base_name
    if vd.exists():
        sys.exit(f"Error: Target directory already exists at {vd}")

    print(f"--> Creating video directory at {vd}")
    (vd / "assets" / "ev1").mkdir(parents=True, exist_ok=True)
    (vd / "assets" / "media").mkdir(parents=True, exist_ok=True)
    (vd / "assets" / "img").mkdir(parents=True, exist_ok=True)
    (vd / "assets" / "clips").mkdir(parents=True, exist_ok=True)
    (vd / "assets" / "captures").mkdir(parents=True, exist_ok=True)
    (vd / "assets" / "music").mkdir(parents=True, exist_ok=True)
    (vd / "work" / "tx").mkdir(parents=True, exist_ok=True)
    (vd / "out").mkdir(parents=True, exist_ok=True)

    # Copy tokens, fonts, vendor
    shutil.copy(skill_dir / "assets" / "tokens.css", vd / "assets" / "ev1" / "tokens.css")
    shutil.copytree(skill_dir / "assets" / "fonts", vd / "assets" / "ev1" / "fonts", dirs_exist_ok=True)
    shutil.copytree(skill_dir / "assets" / "vendor", vd / "assets" / "ev1" / "vendor", dirs_exist_ok=True)

    # Copy template build.py and PLAN.md
    shutil.copy(skill_dir / "template" / "build.py", vd / "build.py")
    shutil.copy(skill_dir / "template" / "PLAN.md", vd / "PLAN.md")

    # If vertical, inject set_vertical() in build.py
    if is_vertical:
        build_content = (vd / "build.py").read_text(encoding="utf-8")
        if "from ev1_more import *" in build_content:
            build_content = build_content.replace(
                "from ev1_more import *",
                "from ev1_more import *\nset_vertical()  # 9:16 Vertical Short (1080x1920)"
            )
            (vd / "build.py").write_text(build_content, encoding="utf-8")

    # Write kit.json metadata
    kit_meta = {
        "skill": str(skill_dir),
        "created": datetime.date.today().isoformat(),
        "aspectRatio": "9:16" if is_vertical else "16:9",
        "width": target_w,
        "height": target_h
    }
    (vd / "kit.json").write_text(json.dumps(kit_meta, indent=2), encoding="utf-8")

    # Copy source recording
    src_copy = vd / "assets" / "media" / f"src{rec_path.suffix}"
    try:
        os.link(rec_path, src_copy)
    except Exception:
        shutil.copy(rec_path, src_copy)

    # Re-encode camera plate to 30 fps CFR raw (keyframe every 1s)
    cam_raw = vd / "assets" / "media" / "cam_raw.mp4"
    print(f"--> Normalizing camera plate -> {cam_raw.name} (30 fps CFR, {target_w}x{target_h})...")
    vf_scale = f"fps=30,scale={target_w}:{target_h}:force_original_aspect_ratio=decrease,pad={target_w}:{target_h}:(ow-iw)/2:(oh-ih)/2"
    subprocess.run([
        'ffmpeg', '-nostdin', '-v', 'error', '-y',
        '-i', str(src_copy),
        '-map', '0:v:0',
        '-vf', vf_scale,
        '-c:v', 'libx264', '-crf', '14', '-preset', 'medium',
        '-g', '30', '-keyint_min', '30', '-pix_fmt', 'yuv420p',
        '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
        '-an', str(cam_raw)
    ], check=True)

    # Extract clean 48kHz voice audio
    vo_wav = vd / "assets" / "media" / "vo.wav"
    print(f"--> Extracting voice track -> {vo_wav.name} (48kHz 24-bit)...")
    subprocess.run([
        'ffmpeg', '-nostdin', '-v', 'error', '-y',
        '-i', str(src_copy),
        '-map', '0:a:0',
        '-ac', '2', '-ar', '48000',
        '-c:a', 'pcm_s24le', str(vo_wav)
    ], check=True)

    print(f"\n[OK] Video project initialized at {vd}")
    print(f"Next steps:")
    print(f"  1. Transcribe: python {skill_dir}/scripts/transcribe.py \"{vd}\"")
    print(f"  2. Snap Onsets: python {skill_dir}/scripts/snap-onsets.py \"{vd}\"")
    print(f"  3. Fill PLAN.md & source evidence/SFX")
    print(f"  4. Build & Render: python {vd}/build.py && npx hyperframes render . -o out/render.mp4")

if __name__ == "__main__":
    main()
