import json

with open("Channels/VantaBrief/videos/003-Open-Source-Is-Taking-Over-Software-in-2026/transcripts/aligned_script.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for p in data["paragraphs"]:
    print(f"[{p['index']:02d}] {p['start_sec']:6.2f}s - {p['end_sec']:6.2f}s ({p['start_frame']:5d} - {p['end_frame']:5d}f): {p['text'][:85]}...")
