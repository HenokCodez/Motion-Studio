import json

with open("Channels/VantaBrief/videos/003-Open-Source-Is-Taking-Over-Software-in-2026/transcripts/aligned_script.json", encoding="utf-8") as f:
    data = json.load(f)

pars = data["paragraphs"]
print(f"Total paragraphs: {len(pars)}")
for p in pars:
    dur = p["end_sec"] - p["start_sec"]
    frames = p["end_frame"] - p["start_frame"]
    print(f"[{p['index']+1:02d}] Frames {p['start_frame']:4d} -> {p['end_frame']:4d} ({dur:4.1f}s, {frames:3d}f): {p['text'][:65]}")
