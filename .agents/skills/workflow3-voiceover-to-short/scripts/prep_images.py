#!/usr/bin/env python3
"""Step 3: clean & normalise every image BEFORE it goes into the storyboard.
Usage:
  python scripts/prep_images.py raw/ --out public/img                 # screenshots / photos
  python scripts/prep_images.py raw_logos/ --out public/img --logos   # logos -> square, trimmed, transparent padding
  python scripts/prep_images.py raw_objects/ --out public/img --cutout   # remove background (needs: pip install rembg)
Writes public/img/<name>.png|jpg and public/img/manifest.json  (w, h, kind hint, warnings).
"""
import argparse, json, os
from PIL import Image, ImageChops

ap = argparse.ArgumentParser(); ap.add_argument("src"); ap.add_argument("--out", default="public/workflow3/img")
ap.add_argument("--logos", action="store_true"); ap.add_argument("--cutout", action="store_true"); ap.add_argument("--max", type=int, default=2400)
a = ap.parse_args(); os.makedirs(a.out, exist_ok=True)

def trim_uniform(im, tol=12):
    """Remove a uniform-colour border (white/black bars around screenshots)."""
    rgb = im.convert("RGB"); bg = Image.new("RGB", rgb.size, rgb.getpixel((0, 0)))
    diff = ImageChops.difference(rgb, bg).convert("L").point(lambda p: 255 if p > tol else 0)
    box = diff.getbbox()
    if box and (box[2] - box[0]) > im.width * 0.3 and (box[3] - box[1]) > im.height * 0.3:
        return im.crop(box)
    return im

def trim_alpha(im):
    box = im.getchannel("A").getbbox() if im.mode == "RGBA" else None
    return im.crop(box) if box else im

man = {}
for f in sorted(os.listdir(a.src)):
    if not f.lower().endswith((".png", ".jpg", ".jpeg", ".webp")): continue
    name = os.path.splitext(f)[0].lower().replace(" ", "-")
    im = Image.open(os.path.join(a.src, f)); notes = []
    if a.cutout:
        try:
            from rembg import remove
            im = remove(im.convert("RGBA"))
        except ImportError:
            notes.append("rembg not installed: cutout skipped"); im = im.convert("RGBA")
    im = im.convert("RGBA") if (im.mode in ("RGBA", "LA", "P") or a.logos or a.cutout) else im.convert("RGB")
    if im.mode == "RGBA" and im.getchannel("A").getextrema()[0] < 250: im = trim_alpha(im)
    else: im = trim_uniform(im)
    if a.logos:
        s = max(im.size); canvas = Image.new("RGBA", (s, s), (0, 0, 0, 0))
        canvas.paste(im, ((s - im.width) // 2, (s - im.height) // 2), im if im.mode == "RGBA" else None)
        im = canvas
        if im.width < 256: im = im.resize((512, 512), Image.LANCZOS); notes.append("logo upscaled - prefer SVG/larger source")
    if max(im.size) > a.max:
        r = a.max / max(im.size); im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
    has_alpha = im.mode == "RGBA" and im.getchannel("A").getextrema()[0] < 250
    out = name + (".png" if has_alpha or a.logos else ".jpg")
    (im if out.endswith(".png") else im.convert("RGB")).save(os.path.join(a.out, out), **({} if out.endswith(".png") else {"quality": 92}))
    ar = im.width / im.height
    hint = "badge" if (a.logos or (0.9 < ar < 1.1 and max(im.size) <= 700)) else "CUTOUT" if has_alpha else "HERO_CARD (landscape)" if ar > 1.25 else "HERO_CARD (portrait)" if ar < 0.8 else "HERO_CARD (square-ish)"
    if min(im.size) < 500 and hint.startswith("HERO"): notes.append("LOW-RES: will look soft; find a bigger source")
    if ar > 3 or ar < 0.33: notes.append("extreme aspect ratio: crop it first")
    man[out] = {"src": "img/" + out, "w": im.width, "h": im.height, "hint": hint, "notes": notes}
    print(f"{out:40s} {im.width}x{im.height}  {hint}  {'; '.join(notes)}")
json.dump(man, open(os.path.join(a.out, "manifest.json"), "w"), indent=1)
print(f"-> {len(man)} images, manifest at {a.out}/manifest.json  (copy src/w/h into storyboard ImgRef)")
