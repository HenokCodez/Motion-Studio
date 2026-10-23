"""
Generate Contact Sheet for v4.mp4
Extracts 24 representative frames across the video and tiles them into a high-res 6x4 grid.
"""

import os
import subprocess
import json
from pathlib import Path

VIDEO_PATH = r"D:\Automations\motion-studio\Channels\VantaBrief\videos\003-Open-Source-Is-Taking-Over-Software-in-2026\renders\v6.mp4"
OUTPUT_DIR = r"D:\Automations\motion-studio\Channels\VantaBrief\videos\003-Open-Source-Is-Taking-Over-Software-in-2026\renders"
CONTACT_SHEET_PATH = os.path.join(OUTPUT_DIR, "v6_contact_sheet.png")

def make_contact_sheet():
    if not os.path.exists(VIDEO_PATH):
        print(f"Error: Video file not found at {VIDEO_PATH}")
        return False

    print("Generating 6x4 contact sheet using FFmpeg...")
    # FFmpeg select filter to grab 24 equidistant frames and tile them in a 6x4 grid
    cmd = [
        "ffmpeg", "-y",
        "-i", VIDEO_PATH,
        "-vf", "select='not(mod(n,335))',scale=640:360,drawtext=text='%{pts\\:hms}':x=15:y=h-35:fontsize=24:fontcolor=white:box=1:boxcolor=black@0.6,tile=6x4",
        "-frames:v", "1",
        "-q:v", "2",
        CONTACT_SHEET_PATH
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        print(f"Successfully generated contact sheet at: {CONTACT_SHEET_PATH}")
        return True
    else:
        print(f"FFmpeg failed with code {result.returncode}:\n{result.stderr}")
        return False

if __name__ == "__main__":
    make_contact_sheet()
