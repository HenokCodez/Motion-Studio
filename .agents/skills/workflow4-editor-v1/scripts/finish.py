#!/usr/bin/env python3
"""finish.py — Picture + Voice + SFX Cues -> out/final.mp4.
Cross-platform audio-video multiplexer and loudness verifier.

Usage:
    python finish.py <video-dir> [picture.mp4]
"""
import argparse
import os
import subprocess
import sys
from pathlib import Path

def main():
    ap = argparse.ArgumentParser(description="Mux picture, premix/voice, and sfx cues into final MP4")
    ap.add_argument("video_dir", help="Path to video project directory")
    ap.add_argument("picture", nargs="?", default="out/render.mp4", help="Path to rendered video (default: out/render.mp4)")
    args = ap.parse_args()

    vd = Path(args.video_dir).resolve()
    if not vd.is_dir():
        sys.exit(f"Error: video directory not found at {vd}")

    pic = vd / args.picture
    if not pic.is_file():
        sys.exit(f"Error: rendered picture not found at {pic}. Run hyperframes render first.")

    # Audio track: prefer work/premix.wav (voice + bed music), fallback to raw voice vo.wav
    aud = vd / "work" / "premix.wav"
    if not aud.is_file():
        aud = vd / "assets" / "media" / "vo.wav"
    if not aud.is_file():
        sys.exit(f"Error: audio track not found (neither work/premix.wav nor assets/media/vo.wav exist)")

    skill_dir = Path(__file__).resolve().parent.parent
    mix_sfx_script = skill_dir / "scripts" / "mix-sfx.py"
    cues_file = vd / "sfx-cues.txt"
    out_dir = vd / "out"
    out_dir.mkdir(parents=True, exist_ok=True)
    mux_mov = out_dir / "_mux.mov"
    final_mp4 = out_dir / "final.mp4"

    print(f"--> Multiplexing {pic.name} + {aud.name}...")
    subprocess.run([
        'ffmpeg', '-nostdin', '-v', 'error', '-y',
        '-i', str(pic),
        '-i', str(aud),
        '-map', '0:v:0',
        '-map', '1:a:0',
        '-c:v', 'copy',
        '-c:a', 'pcm_s24le',
        str(mux_mov)
    ], check=True)

    if cues_file.is_file() and cues_file.stat().st_size > 0:
        print(f"--> Applying {cues_file.name} via mix-sfx.py...")
        subprocess.run([
            sys.executable, str(mix_sfx_script),
            str(mux_mov), str(cues_file), str(final_mp4)
        ], cwd=str(vd), check=True)
    else:
        print(f"--> Encoding AAC audio to final.mp4...")
        subprocess.run([
            'ffmpeg', '-nostdin', '-v', 'error', '-y',
            '-i', str(mux_mov),
            '-c:v', 'copy',
            '-c:a', 'aac', '-b:a', '256k',
            str(final_mp4)
        ], check=True)

    if mux_mov.exists():
        mux_mov.unlink(missing_ok=True)

    # Audio loudness measurement
    loud_out = subprocess.run([
        'ffmpeg', '-nostdin', '-i', str(final_mp4),
        '-af', 'loudnorm=print_format=summary',
        '-f', 'null', '-'
    ], capture_output=True, text=True).stderr

    integrated = "N/A"
    true_peak = "N/A"
    for line in loud_out.splitlines():
        if "Input Integrated:" in line:
            integrated = line.split("Input Integrated:")[1].strip()
        elif "Input True Peak:" in line:
            true_peak = line.split("Input True Peak:")[1].strip()

    dur_out = subprocess.run([
        'ffprobe', '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'csv=p=0', str(final_mp4)
    ], capture_output=True, text=True).stdout.strip()

    print(f"\n[OK] Master deliverable complete: {final_mp4}")
    print(f"     Duration: {float(dur_out):.2f}s | Integrated Loudness: {integrated} | True Peak: {true_peak}")

if __name__ == "__main__":
    main()
