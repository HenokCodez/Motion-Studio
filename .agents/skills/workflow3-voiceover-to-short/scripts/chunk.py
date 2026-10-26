#!/usr/bin/env python3
"""Step 2: words.json -> storyboard.skeleton.json  (DETERMINISTIC caption chunking + timing).
The model must NOT re-time or re-split captions by hand. It only fills in `media` (and optional caption mode).
Usage: python scripts/chunk.py words.json --audio voiceover.mp3 --brand yourhandle --out storyboard.json
Rules: split at sentence end / pause>0.40s; <=9 words; <=56 chars; 1.4s..4.6s per scene; 2 bold words max.
"""
import argparse, json, re

ap = argparse.ArgumentParser()
ap.add_argument("words"); ap.add_argument("--audio", default="voiceover.mp3"); ap.add_argument("--brand", default="")
ap.add_argument("--grid", default="video"); ap.add_argument("--out", default="storyboard.json")
a = ap.parse_args()
d = json.load(open(a.words)); W = d["words"]; total = d["duration"]
MAXW, MAXC, MINDUR, MAXDUR, GAP = 9, 56, 1.4, 4.6, 0.40
STOP = set("the a an and or but of to in on at for with from by is are was were be been it its this that these those as you your we our they their i he she his her not no do does did can could will would should may might have has had so if then than just very really also about into over under more most".split())

def chars(ws): return len(" ".join(w["t"] for w in ws))
chunks, cur = [], []
def stripw(w): return re.sub(r"\W", "", w["t"]).lower()
for i, w in enumerate(W):
    cur.append(w)
    nxt = W[i + 1] if i + 1 < len(W) else None
    end_sentence = bool(re.search(r"[.!?]$", w["t"]))
    pause = nxt and (nxt["s"] - w["e"] > GAP)
    comma = bool(re.search(r"[,;:]$", w["t"])) and len(cur) >= 4
    too_long = nxt and (len(cur) + 1 > MAXW or chars(cur + [nxt]) > MAXC or (nxt["e"] - cur[0]["s"]) > MAXDUR)
    if nxt is None or end_sentence or pause or comma:
        chunks.append(cur); cur = []
    elif too_long:
        carry = []  # never end a caption on "the / in / of / and ..." : push those words to the next chunk
        while len(cur) > 3 and stripw(cur[-1]) in STOP: carry.insert(0, cur.pop())
        chunks.append(cur); cur = carry
# merge chunks that are too short (<3 words or <MINDUR) into a neighbour when it still fits
def dur(ws): return ws[-1]["e"] - ws[0]["s"]
merged = []
for c in chunks:
    if merged and (len(c) < 3 or dur(c) < MINDUR):
        m = merged[-1] + c
        if len(m) <= MAXW + 2 and chars(m) <= MAXC + 10 and dur(m) <= MAXDUR + 0.8:
            merged[-1] = m; continue
    merged.append(c)
if len(merged) > 1 and (len(merged[0]) < 3):
    m = merged[0] + merged[1]
    if len(m) <= MAXW + 2: merged = [m] + merged[2:]

def bold_idx(ws):
    score = []
    for i, w in enumerate(ws):
        t = re.sub(r"[^\w%$.]", "", w["t"])
        if not t: continue
        s = 0
        if re.search(r"\d", t): s += 5
        if t.isupper() and len(t) > 1: s += 4
        if i > 0 and t[0].isupper(): s += 3
        if re.search(r"[a-z][A-Z]", t): s += 3  # CamelCase brand names
        if t.lower() not in STOP: s += len(t) / 8
        else: s -= 3
        score.append((s, i))
    score.sort(reverse=True)
    return {i for s, i in score[:2] if s > 1.2}

scenes = []
bounds = [0.0]
for k in range(len(merged) - 1):
    bounds.append(round((merged[k][-1]["e"] + merged[k + 1][0]["s"]) / 2, 3))
bounds.append(round(total, 3))
for k, c in enumerate(merged):
    bi = bold_idx(c)
    scenes.append({
        "id": f"s{k+1:02d}", "start": bounds[k], "end": bounds[k + 1],
        "media": {"type": "NONE"},
        "caption": {"mode": "WORDS", "words": [dict(t=w["t"], s=w["s"], e=w["e"], **({"b": True} if i in bi else {})) for i, w in enumerate(c)]},
        "note": " ".join(w["t"] for w in c),
    })
sb = {"meta": {"fps": 30, "durationSec": round(total, 3), "audio": a.audio, "brand": a.brand, "grid": a.grid}, "scenes": scenes}
json.dump(sb, open(a.out, "w"), indent=1, ensure_ascii=False)
print(f"{len(scenes)} scenes over {total:.1f}s -> {a.out}  (avg {total/len(scenes):.1f}s/scene)")
print("NEXT: fill every scene's `media` (see reference/02-scene-template-catalog.md). `note` shows the spoken text.")
