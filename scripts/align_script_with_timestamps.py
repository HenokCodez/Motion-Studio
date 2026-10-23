import json
import re
from pathlib import Path

def normalize(text):
    return re.sub(r"[^a-zA-Z0-9]", "", text).lower()

def align():
    proj_dir = Path(r"D:\Automations\motion-studio\Channels\VantaBrief\videos\003-Open-Source-Is-Taking-Over-Software-in-2026")
    script_path = proj_dir / "assets" / "audio" / "voice" / "script.txt"
    timestamps_path = proj_dir / "transcripts" / "word-timestamps.json"

    with open(script_path, "r", encoding="utf-8") as f:
        script_raw = f.read()

    with open(timestamps_path, "r", encoding="utf-8") as f:
        whisper_words = json.load(f)

    # Break script into paragraphs / non-empty lines
    paragraphs = [p.strip() for p in script_raw.split("\n") if p.strip()]

    script_words = []
    for p_idx, p in enumerate(paragraphs):
        tokens = p.split()
        for t in tokens:
            script_words.append({
                "raw": t,
                "norm": normalize(t),
                "paragraph_idx": p_idx,
                "paragraph": p
            })

    print(f"Script words: {len(script_words)}, Whisper words: {len(whisper_words)}")

    # Align script_words with whisper_words using a sliding window / needleman-wunsch or greedy matching
    aligned = []
    w_idx = 0
    total_w = len(whisper_words)

    for s_idx, s in enumerate(script_words):
        s_norm = s["norm"]
        # Look ahead in whisper_words within a window of 8 words
        best_w = None
        best_dist = 999
        best_offset = 0

        for offset in range(min(12, total_w - w_idx)):
            curr_w = whisper_words[w_idx + offset]
            w_norm = normalize(curr_w["word"])
            if s_norm == w_norm:
                best_w = curr_w
                best_offset = offset
                break
            # Fuzzy match (prefix or length close)
            elif len(s_norm) > 2 and (s_norm in w_norm or w_norm in s_norm):
                if offset < best_dist:
                    best_w = curr_w
                    best_dist = offset
                    best_offset = offset

        if best_w is not None:
            w_idx += best_offset
            matched = whisper_words[w_idx]
            aligned.append({
                "word": s["raw"],
                "start": matched["start"],
                "end": matched["end"],
                "start_frame": round(matched["start"] * 30),
                "end_frame": round(matched["end"] * 30),
                "paragraph_idx": s["paragraph_idx"]
            })
            w_idx += 1
        else:
            # Interpolate if skipped or not found
            prev_end = aligned[-1]["end"] if aligned else 0.0
            aligned.append({
                "word": s["raw"],
                "start": prev_end,
                "end": prev_end + 0.3,
                "start_frame": round(prev_end * 30),
                "end_frame": round((prev_end + 0.3) * 30),
                "paragraph_idx": s["paragraph_idx"]
            })

    # Group by paragraph
    grouped_paragraphs = []
    for p_idx, p_text in enumerate(paragraphs):
        p_words = [a for a in aligned if a["paragraph_idx"] == p_idx]
        if p_words:
            start_sec = p_words[0]["start"]
            end_sec = p_words[-1]["end"]
            grouped_paragraphs.append({
                "index": p_idx,
                "text": p_text,
                "start_sec": start_sec,
                "end_sec": end_sec,
                "start_frame": round(start_sec * 30),
                "end_frame": round(end_sec * 30),
                "duration_frames": round((end_sec - start_sec) * 30),
                "words": p_words
            })

    out_file = proj_dir / "transcripts" / "aligned_script.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump({
            "total_paragraphs": len(grouped_paragraphs),
            "paragraphs": grouped_paragraphs,
            "words": aligned
        }, f, indent=2)

    print(f"Aligned {len(aligned)} words across {len(grouped_paragraphs)} paragraphs.")
    print(f"Saved to {out_file}")

if __name__ == "__main__":
    align()
