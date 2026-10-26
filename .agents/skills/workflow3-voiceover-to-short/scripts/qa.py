#!/usr/bin/env python3
"""Step 7: automatic QA of a rendered video + contact sheets for the model to LOOK at.
Usage: python scripts/qa.py out/short.mp4 storyboard.json --out qa
Creates qa/sheet_01.png ... (3 frames per scene, labelled), qa/report.json, qa/review.md (checklist to fill in).
Exit code 1 if any automatic ERROR was found.
"""
import argparse, json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw

ap = argparse.ArgumentParser(); ap.add_argument("video"); ap.add_argument("sb"); ap.add_argument("--out", default="qa")
ap.add_argument("--w", type=int, default=1080); ap.add_argument("--h", type=int, default=1920); a = ap.parse_args()
os.makedirs(a.out + "/frames", exist_ok=True)
sb = json.load(open(a.sb)); scenes = sb["scenes"]; flags = {}; errors = 0
def flag(sid, level, msg):
    global errors; flags.setdefault(sid, []).append(f"{level}: {msg}"); errors += level == "ERROR"

# ---- container checks ---------------------------------------------------------------------------------
pr = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height,r_frame_rate,duration", "-of", "json", a.video]))
v = [s for s in pr["streams"] if s["codec_type"] == "video"][0]; au = [s for s in pr["streams"] if s["codec_type"] == "audio"]
W, H = int(v["width"]), int(v["height"])
if (W, H) != (a.w, a.h): flag("_video", "WARN" if W * 16 == H * 9 else "ERROR", f"resolution {W}x{H}, expected {a.w}x{a.h} (9:16)")
num, den = v["r_frame_rate"].split("/"); fps = float(num) / float(den)
if abs(fps - 30) > 0.1: flag("_video", "ERROR", f"fps {fps}")
if not au: flag("_video", "ERROR", "no audio track - voiceover missing from render")
vd = float(v.get("duration") or 0)
if vd and abs(vd - sb["meta"]["durationSec"]) > 0.25: flag("_video", "ERROR", f"video {vd:.2f}s vs storyboard {sb['meta']['durationSec']}s")
if vd and not 28 <= vd <= 62: flag("_video", "WARN", f"duration {vd:.1f}s outside 30-60s")
fz = subprocess.run(["ffmpeg", "-v", "info", "-i", a.video, "-vf", "freezedetect=n=-55dB:d=3.5", "-an", "-f", "null", "-"], capture_output=True, text=True).stderr
if "freeze_start" in fz: flag("_video", "WARN", "a frozen stretch >3.5s was detected (nothing moves) - add motion/scene change")

# ---- per-scene frame sampling + pixel checks ---------------------------------------------------------------
def grab(t, path):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", a.video, "-frames:v", "1", path], check=True)
    return Image.open(path).convert("RGB")
def lum(im): return np.asarray(im.convert("L"), dtype=np.float32)
sx, sy = W / 1080, H / 1920
def zone(L, x0, y0, x1, y1): return L[int(y0 * sy):int(y1 * sy), int(x0 * sx):int(x1 * sx)]
thumbs = []
for s in scenes:
    d = s["end"] - s["start"]; row = []
    for tag, frac in (("a", 0.22), ("b", 0.55), ("c", 0.90)):
        p = f"{a.out}/frames/{s['id']}_{tag}.png"; im = grab(s["start"] + d * frac, p); row.append(im); L = lum(im)
        t = s["media"]["type"]; cm = s["caption"]["mode"]
        edge = (zone(L, 0, 0, 34, 1920) > 190).sum() + (zone(L, 1046, 0, 1080, 1920) > 190).sum() + (zone(L, 0, 0, 1080, 70) > 190).sum()
        if edge > 120 * sx * sy: flag(s["id"], "ERROR", f"bright content touches the screen edge at {tag} ({int(edge)} px) - something overflows the safe area")
        if cm in ("WORDS", "BIG_STAT") and (zone(L, 0, 1040, 56, 1560) > 190).sum() + (zone(L, 1024, 1040, 1080, 1560) > 190).sum() > 60 * sx * sy:
            flag(s["id"], "ERROR", f"caption text reaches the side margins at {tag} - too long / font too big")
        if tag == "b" and t not in ("NONE", "ICON_SCATTER", "END_CTA"):
            if (zone(L, 90, 170, 990, 1030) > 70).mean() < 0.004: flag(s["id"], "ERROR", "media zone looks EMPTY at mid-scene - image missing/transparent/offscreen")
        if tag == "c" and cm in ("WORDS", "BIG_STAT") and (zone(L, 100, 1000, 980, 1400) > 150).sum() < 700 * sx * sy and t != "END_CTA":
            flag(s["id"], "WARN", "almost no caption pixels at the end of the scene - caption missing or still invisible")
        if t == "END_CTA" or t == "NONE": pass
        if L.max() < 90: flag(s["id"], "ERROR", f"frame {tag} is blank/dark")
    thumbs.append(row)

# ---- contact sheets (6 scenes per sheet, 2 scenes per row) ------------------------------------------------------
TW = 220; TH = int(TW * 16 / 9); LH = 34; PER = 6; n = 0
for k in range(0, len(scenes), PER):
    chunk = list(zip(scenes[k:k + PER], thumbs[k:k + PER])); rows = (len(chunk) + 1) // 2
    S = Image.new("RGB", (2 * (3 * TW + 24) + 8, rows * (TH + LH + 10) + 8), (40, 40, 40)); dr = ImageDraw.Draw(S)
    for i, (s, row) in enumerate(chunk):
        ox = 8 + (i % 2) * (3 * TW + 24); oy = 8 + (i // 2) * (TH + LH + 10)
        fl = flags.get(s["id"], []); col = (255, 90, 90) if any(f.startswith("ERROR") for f in fl) else (255, 200, 0) if fl else (120, 255, 140)
        dr.text((ox, oy + 2), f"{s['id']}  {s['media']['type']}  {s['start']:.1f}-{s['end']:.1f}s  caption:{s['caption']['mode']}", fill=col)
        dr.text((ox, oy + 18), (s.get("note") or "")[:70], fill=(200, 200, 200))
        for j, im in enumerate(row): S.paste(im.resize((TW, TH)), (ox + j * (TW + 6), oy + LH))
    n += 1; S.save(f"{a.out}/sheet_{n:02d}.png")

json.dump({"flags": flags, "sheets": n}, open(f"{a.out}/report.json", "w"), indent=1)
with open(f"{a.out}/review.md", "w") as f:
    f.write("# Self-review (fill in EVERY line; see reference/05-self-review-loop.md)\n\n")
    for s in scenes:
        f.write(f"## {s['id']}  {s['media']['type']}  ({s['start']:.1f}-{s['end']:.1f}s)  \"{(s.get('note') or '')[:60]}\"\n")
        for fl in flags.get(s["id"], []): f.write(f"- AUTO {fl}\n")
        f.write("- [ ] media fully visible, not cropped/stretched, inside the media zone\n- [ ] caption readable, <=4 lines, no word cut off, not touching media\n- [ ] image is sharp (not blurry/pixelated) and relevant to the spoken words\n- [ ] looks like the reference sheet for this template\n- RESULT: PASS / FAIL -> fix: \n\n")
print("\n".join(f"{k}: {m}" for k, v in flags.items() for m in v) or "AUTO-CHECKS: all clean")
print(f"-> {n} contact sheets in {a.out}/ (OPEN AND LOOK AT THEM), checklist in {a.out}/review.md")
sys.exit(1 if errors else 0)
