#!/usr/bin/env python3
"""
Post-render audit of a FINISHED video: does the picture keep up with the voice?
Measures, from the pixels and the audio of the mp4 itself (not from the plan):
  1. BLANK screen time, and how much of it the narrator is speaking over
  2. scenes whose LAST item is on screen < 1.0 s before the scene exits
  3. static holds > 3.0 s where nothing new appears
Exit code 1 if any budget is blown.   usage: python3 scripts/audit-video.py out/video.mp4 [--json report.json] [--keep-corners]
Needs: ffmpeg on PATH, numpy.
"""
import subprocess, sys, json
import numpy as np

path = sys.argv[1]
FPS = 30
BLANK_BUDGET = 0.03        # <= 3% of the video may be empty canvas
TAIL_MIN = 1.0             # last item visible at least this long
HOLD_MAX = 3.3             # no stretch longer than this without something new

def read_gray(w=384, h=216):
    p = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-vf', f'fps={FPS},scale={w}:{h},format=gray', '-f', 'rawvideo', '-'], capture_output=True)
    return np.frombuffer(p.stdout, dtype=np.uint8).reshape(-1, h, w)

a = read_gray(); n, H, W = a.shape
bg = np.median(a[::10], axis=0).astype(np.int16)                 # median over time = the empty canvas
mask = np.ones((H, W), bool); mask[:int(H * .13), :] = False      # ignore the small scene header strip
if '--keep-corners' not in sys.argv:                              # ignore a character/mascot parked in a corner (old videos)
    for ys in (slice(int(H * .62), H), slice(0, int(H * .35))):
        mask[ys, :int(W * .16)] = False; mask[ys, int(W * .84):] = False
ink = np.empty(n)
for i in range(0, n, 400):
    ink[i:i + 400] = ((np.abs(a[i:i + 400].astype(np.int16) - bg) > 30) & mask).mean(axis=(1, 2))

def runs(flag, min_s):
    out, i = [], 0
    while i < len(flag):
        if flag[i]:
            j = i
            while j < len(flag) and flag[j]: j += 1
            if (j - i) / FPS >= min_s: out.append((i / FPS, j / FPS))
            i = j
        else: i += 1
    return out

blank = runs(ink < 0.0025, 0.7)
blank_s = sum(e - s for s, e in blank)

# voice activity during blanks
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
x = np.frombuffer(raw, dtype=np.int16).astype(float); win = 800
rms = np.sqrt((x[:len(x) // win * win].reshape(-1, win) ** 2).mean(1)); speech = rms > max(150, 0.12 * np.percentile(rms, 95))
tot = sp = 0
for s, e in blank:
    seg = speech[int(s / .05):int(e / .05)]; tot += len(seg); sp += seg.sum()
talk_over_blank = 100 * sp / tot if tot else 0

# content segments between blanks -> reveal events -> tails and holds
segs, prev = [], 0.0
for s, e in blank:
    if s - prev > 0.4: segs.append((prev, s))
    prev = e
segs.append((prev, n / FPS))
sm = np.convolve(ink, np.ones(3) / 3, mode='same')
tails, holds = [], []
for a0, b0 in segs:
    i0, i1 = int(a0 * FPS), int(b0 * FPS); ev, last = [], -9
    for j in range(6, i1 - i0):
        t = (i0 + j) / FPS
        if sm[i0 + j] - sm[i0 + j - 6] > 0.0012 and t - last > 0.5: ev.append(t); last = t
    if ev: tails.append((ev[-1], b0, b0 - ev[-1]))
    pts = [a0] + ev + [b0]
    for k in range(1, len(pts) - 1):
        if pts[k + 1] - pts[k] > HOLD_MAX: holds.append((pts[k], pts[k + 1]))
short = [t for t in tails if t[2] < TAIL_MIN]

print(f'video {n / FPS:.1f}s')
print(f'BLANK canvas: {blank_s:.1f}s = {100 * blank_s / (n / FPS):.0f}%  (budget {BLANK_BUDGET * 100:.0f}%)   narrator speaking over blank: {talk_over_blank:.0f}%')
for s, e in blank: print(f'   {s:7.1f} - {e:7.1f}  ({e - s:.1f}s)')
print(f'LAST item visible < {TAIL_MIN}s before exit: {len(short)} of {len(tails)} scenes')
for t in short: print(f'   last item at {t[0]:.1f}s, scene exits {t[1]:.1f}s  ({t[2]:.1f}s)')
print(f'STATIC holds > {HOLD_MAX}s with nothing new: {len(holds)}')
for s, e in holds: print(f'   {s:.1f} - {e:.1f}  ({e - s:.1f}s)')
bad = blank_s / (n / FPS) > BLANK_BUDGET or short or holds
if len(sys.argv) > 3 and sys.argv[2] == '--json':
    json.dump({'blank': blank, 'blank_pct': 100 * blank_s / (n / FPS), 'talk_over_blank_pct': talk_over_blank, 'short_tails': short, 'holds': holds}, open(sys.argv[3], 'w'), indent=1)
print('\nAUDIT ' + ('FAILED' if bad else 'PASSED'))
sys.exit(1 if bad else 0)
