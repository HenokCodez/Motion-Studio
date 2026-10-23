"""
Reusable cutout extraction script using rembg (silueta model).
Takes input photo -> removes background -> writes transparent PNG.
"""

import sys
import os
import argparse
from pathlib import Path
from PIL import Image

def make_cutout(input_image_path: str, output_path: str = None):
    try:
        import rembg
    except ImportError:
        print("[ERROR] rembg not installed. Run: pip install rembg onnxruntime")
        return False

    input_file = Path(input_image_path).resolve()
    if not input_file.exists():
        print(f"[ERROR] Input file does not exist: {input_file}")
        return False

    if not output_path:
        output_file = input_file.with_stem(input_file.stem + "_cutout").with_suffix(".png")
    else:
        output_file = Path(output_path).resolve()

    output_file.parent.mkdir(parents=True, exist_ok=True)

    print(f"[EXTRACTING CUTOUT] {input_file.name} -> {output_file.name}")
    try:
        # Prefer pre-cached silueta model
        session = rembg.new_session("silueta")
    except Exception:
        session = rembg.new_session("u2net")

    with Image.open(input_file) as img:
        img_rgb = img.convert("RGB")
        cutout = rembg.remove(img_rgb, session=session)
        cutout.save(str(output_file), "PNG")

    print(f"[OK] Saved cutout to {output_file}")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extract transparent PNG cutout with rembg")
    parser.add_argument("input", help="Input image file path")
    parser.add_argument("--output", "-o", help="Output PNG path (optional)")
    args = parser.parse_args()

    success = make_cutout(args.input, args.output)
    sys.exit(0 if success else 1)
