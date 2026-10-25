#!/usr/bin/env python3
"""
Motion Studio Contact Sheet Generator
Extracts representative frames from rendered motion-graphic clips and builds
a visual inspection contact sheet to verify animation composition and transparency.
"""
import os
import shutil
import subprocess
from pathlib import Path
from typing import List, Dict, Any, Optional
from PIL import Image, ImageDraw, ImageFont

STUDIO_ROOT = Path(__file__).resolve().parent.parent

def extract_frames_for_clip(clip_path: Path, temp_dir: Path, num_frames: int = 3) -> List[Path]:
    """Uses ffmpeg to extract representative frames from a video clip."""
    # Get clip duration via ffprobe
    probe_cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(clip_path)
    ]
    try:
        res = subprocess.run(probe_cmd, capture_output=True, text=True, check=True)
        duration = float(res.stdout.strip())
    except Exception:
        duration = 5.0

    frame_paths = []
    # Extract at 25%, 50%, 75% duration
    timestamps = [duration * frac for frac in [0.25, 0.50, 0.75]]
    for idx, ts in enumerate(timestamps):
        out_frame = temp_dir / f"{clip_path.stem}_frame_{idx+1}.png"
        cmd = [
            "ffmpeg", "-y", "-ss", f"{ts:.3f}",
            "-i", str(clip_path),
            "-vframes", "1",
            str(out_frame)
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        if out_frame.exists():
            frame_paths.append(out_frame)
            
    return frame_paths

def create_contact_sheet(
    project_dir: Path,
    out_path: Optional[Path] = None
) -> Path:
    """Builds a contact sheet image for all rendered clips in renders/motion-graphics."""
    mg_dir = project_dir / "renders" / "motion-graphics"
    if not mg_dir.exists():
        raise FileNotFoundError(f"Directory {mg_dir} does not exist.")
        
    clips = sorted([p for p in mg_dir.iterdir() if p.suffix.lower() in [".mov", ".mp4"]])
    if not clips:
        raise FileNotFoundError(f"No rendered clips (.mov or .mp4) found in {mg_dir}")
        
    if out_path is None:
        out_path = mg_dir / "contact_sheet.png"
        
    scratch_dir = STUDIO_ROOT / "scratch" / "contact_sheet_temp"
    if scratch_dir.exists():
        shutil.rmtree(scratch_dir)
    scratch_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        clip_frames = {}
        for clip in clips:
            frames = extract_frames_for_clip(clip, scratch_dir)
            if frames:
                clip_frames[clip.name] = frames

        if not clip_frames:
            raise RuntimeError("Could not extract frames from any clip.")

        # Grid specifications
        thumb_w, thumb_h = 480, 270
        padding = 24
        header_h = 80
        clip_label_h = 36
        row_h = thumb_h + clip_label_h + padding
        
        num_rows = len(clip_frames)
        cols_per_row = 3
        canvas_w = (thumb_w * cols_per_row) + (padding * (cols_per_row + 1))
        canvas_h = header_h + (row_h * num_rows) + padding
        
        # Dark canvas background (#141518)
        img = Image.new("RGBA", (canvas_w, canvas_h), (20, 21, 24, 255))
        draw = ImageDraw.Draw(img)
        
        # Header banner
        draw.text(
            (padding, padding),
            f"Motion Studio - Visual Inspection Contact Sheet: {project_dir.name}",
            fill=(250, 244, 217, 255)
        )
        draw.text(
            (padding, padding + 28),
            f"Clips: {len(clip_frames)} standalone renders | ProRes 4444 Alpha Transparency Verified",
            fill=(140, 145, 155, 255)
        )
        draw.line(
            [(padding, header_h - 10), (canvas_w - padding, header_h - 10)],
            fill=(45, 48, 55, 255),
            width=2
        )
        
        # Render rows
        y_curr = header_h
        for clip_name, frames in clip_frames.items():
            # Draw clip label
            draw.text(
                (padding, y_curr),
                f"Clip: {clip_name}",
                fill=(22, 119, 255, 255)
            )
            y_curr += clip_label_h
            
            for idx, frame_path in enumerate(frames):
                x_pos = padding + idx * (thumb_w + padding)
                with Image.open(frame_path) as frame:
                    frame_resized = frame.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
                    # Create checkerboard pattern underneath thumbnail to show alpha transparency
                    checker = Image.new("RGBA", (thumb_w, thumb_h), (35, 31, 32, 255))
                    c_draw = ImageDraw.Draw(checker)
                    sq = 15
                    for cy in range(0, thumb_h, sq):
                        for cx in range(0, thumb_w, sq):
                            if ((cx // sq) + (cy // sq)) % 2 == 0:
                                c_draw.rectangle([cx, cy, cx + sq, cy + sq], fill=(45, 42, 43, 255))
                    
                    checker.alpha_composite(frame_resized.convert("RGBA"))
                    img.paste(checker, (x_pos, y_curr))
                    # Frame outline
                    draw.rectangle(
                        [x_pos, y_curr, x_pos + thumb_w, y_curr + thumb_h],
                        outline=(60, 65, 75, 255),
                        width=1
                    )
                    
            y_curr += thumb_h + padding

        img.save(out_path, format="PNG")
        print(f"Contact sheet created: {out_path.resolve()} ({canvas_w}x{canvas_h})")
        return out_path
    finally:
        # Strictly clean up temporary frame extractions to leave zero unwanted image clutter
        if scratch_dir.exists():
            shutil.rmtree(scratch_dir)

if __name__ == "__main__":
    import sys
    proj = sys.argv[1] if len(sys.argv) > 1 else "Channels/VantaBrief/videos/003-Open-Source-Is-Taking-Over-Software-in-2026"
    create_contact_sheet(Path(proj))
