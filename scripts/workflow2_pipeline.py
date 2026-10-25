#!/usr/bin/env python3
"""
Workflow 2 Pipeline: Deterministic Whiteboard Explainer Kit integration.
Provides isolated, per-project workspace execution without shared-state collisions:
  Channels/<channel>/videos/<project>/workflow2/
    ├── beats.json
    ├── words.json
    ├── plan.json
    ├── assets/
    │    ├── logos/
    │    ├── shots/
    │    └── mascot/
    └── previews/
"""
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path
from PIL import Image

STUDIO_ROOT = Path(__file__).resolve().parent.parent
REMOTION_APP = STUDIO_ROOT / "projects" / "remotion-app"
KIT_ROOT = REMOTION_APP / "workflow2-whiteboard"
IS_WIN = os.name == "nt"
NPX_CMD = "npx.cmd" if IS_WIN else "npx"
NODE_CMD = "node.exe" if IS_WIN else "node"


def get_w2_workspace(proj_dir: Path) -> Path:
    w2 = proj_dir / "workflow2"
    w2.mkdir(parents=True, exist_ok=True)
    (w2 / "assets" / "logos").mkdir(parents=True, exist_ok=True)
    (w2 / "assets" / "shots").mkdir(parents=True, exist_ok=True)
    (w2 / "assets" / "mascot").mkdir(parents=True, exist_ok=True)
    (w2 / "previews").mkdir(parents=True, exist_ok=True)
    (proj_dir / "renders" / "workflow2").mkdir(parents=True, exist_ok=True)
    return w2


def w2_words_cmd(proj_dir: Path) -> Path:
    """Generate words.json from project's Whisper transcription."""
    w2 = get_w2_workspace(proj_dir)
    words_file = w2 / "words.json"

    # Search candidates in priority order
    candidates = [
        proj_dir / "transcripts" / "word-timestamps.json",
        proj_dir / "transcripts" / "transcript.words.json",
        proj_dir / "transcripts" / "transcript.json",
    ]
    src = None
    for c in candidates:
        if c.exists():
            src = c
            break

    if not src:
        sys.exit(f"No transcript found in {proj_dir / 'transcripts'}. Run: python studio.py transcribe {proj_dir.name}")

    print(f"--> Converting {src.name} to {words_file.relative_to(proj_dir)}...")
    data = json.loads(src.read_text(encoding="utf-8"))
    words = []

    if isinstance(data, list) and len(data) > 0 and "word" in data[0] and "start" in data[0]:
        # word-timestamps.json format
        for w in data:
            words.append({
                "w": str(w["word"]).strip(),
                "start": round(float(w["start"]), 2),
                "end": round(float(w["end"]), 2)
            })
    elif isinstance(data, dict) and "words" in data:
        # transcript.words.json format
        for w in data["words"]:
            words.append({
                "w": str(w.get("word", "")).strip(),
                "start": round(float(w.get("startMs", 0)) / 1000.0, 2),
                "end": round(float(w.get("endMs", 0)) / 1000.0, 2)
            })
    elif isinstance(data, dict) and "segments" in data:
        # transcript.json format
        for seg in data["segments"]:
            for w in seg.get("words", []):
                words.append({
                    "w": str(w.get("word", "")).strip(),
                    "start": round(float(w.get("start", 0)), 2),
                    "end": round(float(w.get("end", 0)), 2)
                })

    words = [w for w in words if w["w"]]
    words_file.write_text(json.dumps(words, indent=1), encoding="utf-8")
    print(f"[OK] Wrote {len(words)} word timestamps to {words_file.name}")
    return words_file


def w2_assets_cmd(proj_dir: Path):
    """Fetch verified logos (simple-icons) and capture screenshots (Playwright) into project workspace."""
    w2 = get_w2_workspace(proj_dir)
    beats_file = w2 / "beats.json"
    if not beats_file.exists():
        sys.exit(f"beats.json not found in {w2}. Author beats.json first.")

    # Copy studio mascot assets if meta.mascot is present
    beats_data = json.loads(beats_file.read_text(encoding="utf-8"))
    mascot_poses = beats_data.get("meta", {}).get("mascot", [])
    if mascot_poses:
        studio_mascot = KIT_ROOT / "assets" / "mascot"
        dest_mascot = w2 / "assets" / "mascot"
        for pose in mascot_poses:
            for ext in [".png", ".svg"]:
                src = studio_mascot / f"{pose}{ext}"
                if src.exists():
                    shutil.copy2(src, dest_mascot / f"{pose}{ext}")

    fetch_script = (KIT_ROOT / "scripts" / "fetch-assets.mjs").resolve()

    print(f"--> Running asset collection for {proj_dir.name}...")
    cmd = [
        NODE_CMD,
        str(fetch_script),
        str(beats_file.resolve())
    ]
    res = subprocess.run(cmd, cwd=w2)
    if res.returncode != 0:
        print("[WARN] Some assets are missing. Supply them manually into workflow2/assets/ before production render.")


def w2_plan_cmd(proj_dir: Path, allow_missing: bool = False):
    """Run layout solver, camera planner and strict linter inside project workspace."""
    w2 = get_w2_workspace(proj_dir)
    beats_file = w2 / "beats.json"
    words_file = w2 / "words.json"
    if not beats_file.exists():
        sys.exit(f"beats.json not found in {w2}.")

    build_script = (KIT_ROOT / "scripts" / "build.mjs").resolve()

    cmd = [
        NODE_CMD,
        str(build_script),
        "--beats", str(beats_file.resolve()),
        "--words", str(words_file.resolve() if words_file.exists() else "none.json")
    ]
    if allow_missing:
        cmd.append("--allow-missing")

    print(f"--> Solving layout & planning camera for {proj_dir.name}...")
    res = subprocess.run(cmd, cwd=w2)
    if res.returncode != 0:
        sys.exit(f"[ERROR] w2:plan failed for {proj_dir.name}. Adjust content in beats.json.")


def w2_preview_cmd(proj_dir: Path):
    """Render headless Playwright PNG previews into project workspace."""
    w2 = get_w2_workspace(proj_dir)
    plan_file = w2 / "plan.json"
    if not plan_file.exists():
        sys.exit(f"plan.json not found in {w2}. Run w2-plan first.")

    preview_script = (KIT_ROOT / "scripts" / "preview.mjs").resolve()

    print(f"--> Rendering previews for {proj_dir.name}...")
    cmd = [
        NODE_CMD,
        str(preview_script)
    ]
    res = subprocess.run(cmd, cwd=w2)
    if res.returncode != 0:
        sys.exit(f"[ERROR] w2:preview failed for {proj_dir.name}.")
    print(f"[OK] Previews generated in {w2 / 'previews'}")


def w2_render_cmd(proj_dir: Path, crf: int = 18):
    """Render master video without polluting shared folders. Stages assets dynamically."""
    w2 = get_w2_workspace(proj_dir)
    plan_file = w2 / "plan.json"
    if not plan_file.exists():
        sys.exit(f"plan.json not found in {w2}. Run w2-plan first.")

    plan_data = json.loads(plan_file.read_text(encoding="utf-8"))
    slug = proj_dir.name
    stage_dir = REMOTION_APP / "public" / "staged" / slug
    stage_dir.mkdir(parents=True, exist_ok=True)

    # Voiceover audio
    audio_candidates = [
        proj_dir / "assets" / "audio" / "voice" / "audio.mp3",
        proj_dir / "assets" / "audio" / "voice" / "audio.wav",
        proj_dir / "assets" / "audio" / "003" / "audio.mp3",
    ]
    audio_src = None
    for ac in audio_candidates:
        if ac.exists():
            audio_src = ac
            break

    try:
        if audio_src:
            shutil.copy2(audio_src, stage_dir / "audio.mp3")
            plan_data["meta"]["audio"] = "audio.mp3"
        else:
            plan_data["meta"]["audio"] = ""

        # Copy project assets
        if (w2 / "assets").exists():
            shutil.copytree(w2 / "assets", stage_dir / "assets", dirs_exist_ok=True)

        plan_data["meta"]["assetPrefix"] = f"staged/{slug}"

        # Write staged props JSON
        props_file = stage_dir / "props.json"
        props_file.write_text(json.dumps({"plan": plan_data}), encoding="utf-8")

        out_dir = proj_dir / "renders" / "workflow2"
        out_dir.mkdir(parents=True, exist_ok=True)
        out_file = out_dir / "final.mp4"

        print(f"\n--> Rendering Workflow 2 Final Video ({proj_dir.name}) -> {out_file.name}...")
        render_cmd = [
            NPX_CMD, "remotion", "render",
            "src/index.ts",
            "Workflow2-WhiteboardKit",
            str(out_file.resolve()),
            f"--props={props_file.resolve()}",
            "--codec=h264",
            f"--crf={crf}"
        ]
        subprocess.run(render_cmd, cwd=REMOTION_APP, check=True)
        print(f"[OK] Master render complete: {out_file.resolve()}")

        # Generate Contact Sheet (1 frame every 2 seconds)
        contact_sheet = out_dir / "contact_sheet.png"
        generate_contact_sheet(out_file, contact_sheet, interval_sec=2.0)
        print(f"[OK] Contact sheet generated: {contact_sheet.resolve()}\n")

    finally:
        # Clean up staging directory immediately to avoid shared-state pollution
        if stage_dir.exists():
            shutil.rmtree(stage_dir, ignore_errors=True)


def generate_contact_sheet(video_path: Path, output_image: Path, interval_sec: float = 2.0):
    """Extract frames at interval_sec and tile into a grid contact sheet."""
    import math
    temp_dir = video_path.parent / "_temp_frames"
    if temp_dir.exists():
        shutil.rmtree(temp_dir, ignore_errors=True)
    temp_dir.mkdir(parents=True, exist_ok=True)

    try:
        # Extract frames
        extract_cmd = [
            "ffmpeg", "-y", "-i", str(video_path),
            "-vf", f"fps=1/{interval_sec}",
            "-q:v", "2",
            str(temp_dir / "frame_%04d.png")
        ]
        subprocess.run(extract_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        frames = sorted(temp_dir.glob("frame_*.png"))
        if not frames:
            return

        cols = 4
        rows = math.ceil(len(frames) / cols)
        thumb_w, thumb_h = 480, 270
        grid = Image.new("RGB", (cols * thumb_w, rows * thumb_h), color=(17, 17, 17))

        for idx, fpath in enumerate(frames):
            img = Image.open(fpath)
            img.thumbnail((thumb_w, thumb_h))
            col = idx % cols
            row = idx // cols
            grid.paste(img, (col * thumb_w, row * thumb_h))

        grid.save(output_image)
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
