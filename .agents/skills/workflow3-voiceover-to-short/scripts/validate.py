#!/usr/bin/env python3
"""Step 4 gate: validate storyboard.json BEFORE rendering. Exit 1 on errors.
Usage: python scripts/validate.py storyboard.json [--public public]
"""
import argparse, json, os, sys

ap = argparse.ArgumentParser(); ap.add_argument("sb"); ap.add_argument("--public", default="public/workflow3"); a = ap.parse_args()
sb = json.load(open(a.sb)); E, Wn = [], []
err = lambda m: E.append("ERROR  " + m); warn = lambda m: Wn.append("warn   " + m)
M = sb.get("meta", {}); S = sb.get("scenes", [])
for k in ("fps", "durationSec", "audio", "brand", "grid"):
    if k not in M: err(f"meta.{k} missing")
if M.get("fps") != 30: err("meta.fps must be 30")
if M.get("grid") not in ("video", "procedural"): err("meta.grid must be 'video' or 'procedural'")
dur = M.get("durationSec", 0)
if not 28 <= dur <= 62: warn(f"durationSec={dur} outside the 30-60s target")
if not os.path.exists(os.path.join(a.public, M.get("audio", "?"))): err(f"audio file {a.public}/{M.get('audio')} not found")
if M.get("grid") == "video" and not os.path.exists(os.path.join(a.public, "grid_vertical.mp4")): err(f"{a.public}/grid_vertical.mp4 missing (copy from the skill template/public/)")
if not S: err("no scenes"); 
SPEC = {  # required fields per media type  (image fields are checked separately)
 "NONE": [], "HERO_CARD": ["image"], "CUTOUT": ["image"], "BADGE_LINE_CARD": ["badges", "card"], "HUB_SPOKES": ["center", "spokes"],
 "ORBIT": ["center", "orbiters"], "BADGE_ROW": ["badges"], "CARD_STACK": ["cards"], "PROGRESS_BAR": ["from", "to"],
 "WORDMARK": ["text"], "ICON_SCATTER": ["glyph"], "END_CTA": ["top"]}
COUNT = {("BADGE_LINE_CARD", "badges"): (1, 3), ("HUB_SPOKES", "spokes"): (1, 4), ("ORBIT", "orbiters"): (3, 6), ("BADGE_ROW", "badges"): (1, 3), ("CARD_STACK", "cards"): (2, 4)}
def imgs(m):
    out = []
    for k, v in m.items():
        if isinstance(v, dict) and "src" in v: out.append(v)
        if isinstance(v, list): out += [x for x in v if isinstance(x, dict) and "src" in x]
    return out
prev_end, run, last_key, none_run, types = 0.0, 0, None, 0, []
for i, s in enumerate(S):
    sid = s.get("id", f"#{i}")
    if abs(s["start"] - prev_end) > 0.02: err(f"{sid}: start {s['start']} != previous end {prev_end} (scenes must be contiguous)")
    if s["end"] <= s["start"]: err(f"{sid}: end <= start")
    prev_end = s["end"]; d = s["end"] - s["start"]
    if d < 1.2: warn(f"{sid}: only {d:.1f}s long (min 1.4s ideal)")
    if d > 5.2: warn(f"{sid}: {d:.1f}s long (>5s feels static; split it or add motion)")
    m = s.get("media", {}); t = m.get("type"); types.append(t)
    if t not in SPEC: err(f"{sid}: unknown media.type '{t}'"); continue
    for f in SPEC[t]:
        if f not in m: err(f"{sid}: media.{f} required for {t}")
    for (tt, f), (lo, hi) in COUNT.items():
        if t == tt and f in m and not lo <= len(m[f]) <= hi: err(f"{sid}: {t}.{f} needs {lo}-{hi} items, has {len(m[f])}")
    for im in imgs(m):
        if im["src"] == "":
            if not im.get("alt"): err(f"{sid}: letter-badge (src '') needs alt text, e.g. 'Slack'")
            continue
        p = os.path.join(a.public, im["src"])
        if im["src"].startswith("http"): err(f"{sid}: remote image {im['src']} - download it into {a.public}/img first")
        elif not os.path.exists(p): err(f"{sid}: image file missing: {a.public}/{im['src']}")
        if not im.get("w") or not im.get("h"): err(f"{sid}: image {im['src']} needs w and h (run scripts/prep_images.py)")
        elif t in ("HERO_CARD",) and min(im["w"], im["h"]) < 500: warn(f"{sid}: {im['src']} is only {im['w']}x{im['h']} - will look soft on a card")
    c = s.get("caption", {}); cm = c.get("mode")
    if cm not in ("WORDS", "BULLETS", "BIG_STAT", "NONE"): err(f"{sid}: caption.mode invalid '{cm}'")
    if cm in ("WORDS", "BIG_STAT"):
        ws = c.get("words", [])
        if not ws: err(f"{sid}: caption.words empty")
        txt = " ".join(w["t"] for w in ws)
        if len(ws) > 11 or len(txt) > 80: err(f"{sid}: caption too long ({len(ws)} words / {len(txt)} chars; max 11 / 80)")
        if sum(1 for w in ws if w.get("b")) > 3: warn(f"{sid}: more than 3 bold words")
        for w in ws:
            if w["s"] < s["start"] - 0.25 or w["s"] > s["end"] + 0.05: warn(f"{sid}: word '{w['t']}' at {w['s']}s is outside scene {s['start']}-{s['end']}")
    if cm == "BIG_STAT" and (not c.get("stat") or len(c["stat"]) > 12): err(f"{sid}: BIG_STAT.stat required, <=12 chars")
    if cm == "BULLETS":
        its = c.get("items", [])
        if not 1 <= len(its) <= 3: err(f"{sid}: BULLETS needs 1-3 items")
        for it in its:
            if len(it["text"]) > 30: err(f"{sid}: bullet '{it['text']}' > 30 chars")
    if t == "END_CTA" and cm != "NONE": err(f"{sid}: END_CTA scene must use caption.mode NONE")
    if t == "END_CTA" and i != len(S) - 1: warn(f"{sid}: END_CTA should be the last scene")
    key = s.get("mediaKey") or json.dumps(m, sort_keys=True)
    run = run + 1 if key == last_key else 1; last_key = key
    if run > 4: warn(f"{sid}: same media for {run} scenes in a row - add variety")
    none_run = none_run + 1 if t == "NONE" else 0
    if none_run > 2: warn(f"{sid}: {none_run} NONE scenes in a row - viewers need a visual every ~3s")
if S and abs(S[-1]["end"] - dur) > 0.05: err(f"last scene ends {S[-1]['end']} but durationSec is {dur}")
if S and S[0]["start"] != 0: err("first scene must start at 0")
if len(S) >= 8 and len(set(types) - {"NONE"}) < 4: warn(f"only {len(set(types)-{'NONE'})} different templates used - aim for 5+ in a 45s video")
if S and S[-1]["media"].get("type") != "END_CTA": warn("last scene is not END_CTA (fine if the user did not want a call-to-action)")
print("\n".join(E + Wn) or "OK")
print(f"-- {len(S)} scenes, {dur:.1f}s, templates: " + ", ".join(sorted(set(t for t in types if t))))
sys.exit(1 if E else 0)
