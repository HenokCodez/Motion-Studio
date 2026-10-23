#!/usr/bin/env python3
"""
Script Alignment and Crosschecking Tool for Motion Studio.

Crosschecks human-written narration script (e.g., assets/audio/voice/script.txt)
against faster-whisper word-level audio timestamps to:
1. Reconcile and fix misheard proper names, technical terms, and acronyms.
2. Produce deterministic word-by-word and paragraph-by-paragraph timing maps (aligned_script.json).
3. Update transcripts (transcript.txt, transcript.md, word-timestamps.json, captions.json)
   with the verified human text while preserving exact millisecond start and end audio timings.
"""

import argparse
import json
from pathlib import Path
import re
import sys


def normalize_token(text: str) -> str:
    """Strip punctuation and lowercase for fuzzy phonetic/spelling alignment."""
    return re.sub(r"[^a-zA-Z0-9]", "", text).lower()


def align_script_with_timestamps(
    project_dir: Path,
    script_path: Path = None,
    timestamps_path: Path = None,
    fps: int = 30,
    update_transcripts: bool = True
):
    project_dir = Path(project_dir).resolve()
    if not project_dir.exists():
        raise FileNotFoundError(f"Project directory not found: {project_dir}")

    # 1. Resolve script.txt candidate locations
    candidates = [
        script_path,
        project_dir / "assets" / "audio" / "voice" / "script.txt",
        project_dir / "script.txt",
        project_dir / "transcripts" / "script.txt",
        project_dir / "assets" / "script.txt",
    ]
    resolved_script = None
    for cand in candidates:
        if cand and Path(cand).exists():
            resolved_script = Path(cand).resolve()
            break

    if not resolved_script:
        raise FileNotFoundError(
            f"No script file found for project {project_dir.name}.\n"
            "Checked locations:\n"
            + "\n".join(f"  - {c}" for c in candidates if c)
        )

    # 2. Resolve word-timestamps.json candidate locations
    time_candidates = [
        timestamps_path,
        project_dir / "transcripts" / "word-timestamps.json",
        project_dir / "transcripts" / "transcript.json"
    ]
    resolved_times = None
    for cand in time_candidates:
        if cand and Path(cand).exists():
            resolved_times = Path(cand).resolve()
            break

    if not resolved_times:
        raise FileNotFoundError(
            f"No timestamp data found for project {project_dir.name}.\n"
            f"Please run `python studio.py transcribe {project_dir.name}` first."
        )

    # Read human script
    script_raw = resolved_script.read_text(encoding="utf-8")
    paragraphs = [p.strip() for p in script_raw.split("\n") if p.strip()]

    # Read Whisper timestamps
    whisper_raw = json.loads(resolved_times.read_text(encoding="utf-8"))
    if isinstance(whisper_raw, dict) and "segments" in whisper_raw:
        whisper_words = []
        for s in whisper_raw["segments"]:
            whisper_words.extend(s.get("words", []))
    elif isinstance(whisper_raw, list):
        whisper_words = whisper_raw
    else:
        raise ValueError(f"Unrecognized timestamp format in {resolved_times}")

    # Tokenize script words
    script_words = []
    for p_idx, p in enumerate(paragraphs):
        tokens = p.split()
        for t in tokens:
            script_words.append({
                "raw": t,
                "norm": normalize_token(t),
                "paragraph_idx": p_idx,
                "paragraph": p
            })

    total_s = len(script_words)
    total_w = len(whisper_words)
    print(f"-> Aligning {total_s} script words against {total_w} Whisper timestamped words...")

    # Dynamic sliding-window alignment
    aligned_words = []
    w_idx = 0
    corrections = []

    for s_idx, s in enumerate(script_words):
        s_norm = s["norm"]
        best_w = None
        best_offset = 0
        best_dist = 999

        # Search window of up to 14 words ahead
        lookahead = min(14, total_w - w_idx)
        for offset in range(lookahead):
            curr_w = whisper_words[w_idx + offset]
            w_norm = normalize_token(curr_w.get("word", ""))

            # Exact match
            if s_norm == w_norm:
                best_w = curr_w
                best_offset = offset
                break

            # Substring match (e.g. "kokoro" vs "kokoro", "artcraft" vs "art craft", "krea" vs "crea")
            if len(s_norm) >= 3 and len(w_norm) >= 3:
                if s_norm in w_norm or w_norm in s_norm:
                    if offset < best_dist:
                        best_w = curr_w
                        best_dist = offset
                        best_offset = offset

        if best_w is not None:
            w_idx += best_offset
            matched = whisper_words[w_idx]
            w_raw = matched.get("word", "").strip()

            if w_raw.lower() != s["raw"].lower():
                corrections.append({"script": s["raw"], "whisper": w_raw, "time": matched["start"]})

            aligned_words.append({
                "word": s["raw"],
                "start": matched["start"],
                "end": matched["end"],
                "start_frame": int(round(matched["start"] * fps)),
                "end_frame": int(round(matched["end"] * fps)),
                "paragraph_idx": s["paragraph_idx"]
            })
            w_idx += 1
        else:
            # Interpolate seamlessly if word was dropped or skipped
            prev_end = aligned_words[-1]["end"] if aligned_words else 0.0
            interpolated_end = round(prev_end + 0.28, 3)
            aligned_words.append({
                "word": s["raw"],
                "start": prev_end,
                "end": interpolated_end,
                "start_frame": int(round(prev_end * fps)),
                "end_frame": int(round(interpolated_end * fps)),
                "paragraph_idx": s["paragraph_idx"]
            })

    # Group into paragraph segments
    grouped_paragraphs = []
    for p_idx, p_text in enumerate(paragraphs):
        p_words = [a for a in aligned_words if a["paragraph_idx"] == p_idx]
        if p_words:
            start_sec = p_words[0]["start"]
            end_sec = p_words[-1]["end"]
            grouped_paragraphs.append({
                "index": p_idx,
                "text": p_text,
                "start_sec": start_sec,
                "end_sec": end_sec,
                "start_frame": int(round(start_sec * fps)),
                "end_frame": int(round(end_sec * fps)),
                "duration_frames": int(round((end_sec - start_sec) * fps)),
                "words": p_words
            })

    transcripts_dir = project_dir / "transcripts"
    transcripts_dir.mkdir(parents=True, exist_ok=True)

    # 1. Save aligned_script.json
    aligned_json_path = transcripts_dir / "aligned_script.json"
    result_data = {
        "project": project_dir.name,
        "script_source": str(resolved_script),
        "fps": fps,
        "total_paragraphs": len(grouped_paragraphs),
        "total_words": len(aligned_words),
        "corrections_detected": len(corrections),
        "paragraphs": grouped_paragraphs,
        "words": aligned_words
    }
    aligned_json_path.write_text(json.dumps(result_data, indent=2, ensure_ascii=False), encoding="utf-8")

    # 2. Update transcripts with verified script text if requested
    if update_transcripts:
        txt_path = transcripts_dir / "transcript.txt"
        txt_path.write_text("\n\n".join(paragraphs), encoding="utf-8")

        words_path = transcripts_dir / "word-timestamps.json"
        clean_words = [
            {
                "word": w["word"],
                "start": w["start"],
                "end": w["end"],
                "probability": 1.0
            }
            for w in aligned_words
        ]
        words_path.write_text(json.dumps(clean_words, indent=2, ensure_ascii=False), encoding="utf-8")

        captions_path = transcripts_dir / "captions.json"
        captions_data = [
            {
                "id": p["index"] + 1,
                "start": p["start_sec"],
                "end": p["end_sec"],
                "text": p["text"],
                "words": [
                    {"word": w["word"], "start": w["start"], "end": w["end"]}
                    for w in p["words"]
                ]
            }
            for p in grouped_paragraphs
        ]
        captions_path.write_text(json.dumps(captions_data, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"[OK] Script alignment complete!")
    print(f"   - Aligned {len(aligned_words)} words into {len(grouped_paragraphs)} paragraphs.")
    print(f"   - Reconciled {len(corrections)} name/spelling differences from Whisper.")
    print(f"   - Saved: {aligned_json_path}")
    if corrections:
        sample = corrections[:6]
        print("   - Sample reconciled proper terms:")
        for c in sample:
            print(f"     * Script: \"{c['script']}\" <-- Whisper heard: \"{c['whisper']}\" (@ {c['time']}s)")

    return result_data


def main():
    parser = argparse.ArgumentParser(description="Crosscheck and align script with Whisper timestamps")
    parser.add_argument("project", help="Project name or directory path")
    parser.add_argument("--script", help="Path to human script file (defaults to assets/audio/voice/script.txt)")
    parser.add_argument("--timestamps", help="Path to Whisper timestamps JSON")
    parser.add_argument("--fps", type=int, default=30)
    parser.add_argument("--no-update-transcripts", action="store_true", help="Don't overwrite transcript.txt / word-timestamps.json")
    args = parser.parse_args()

    # If project is passed as a name, resolve via studio.py logic
    p_path = Path(args.project)
    if not p_path.exists():
        # Try finding in Channels or Videos
        for base in [Path("Channels/VantaBrief/videos"), Path("Channels/HanaVanta/videos"), Path("Videos")]:
            cand = base / args.project
            if cand.exists():
                p_path = cand
                break
            for ep in base.glob(f"*{args.project}*"):
                if ep.is_dir():
                    p_path = ep
                    break

    align_script_with_timestamps(
        project_dir=p_path,
        script_path=Path(args.script) if args.script else None,
        timestamps_path=Path(args.timestamps) if args.timestamps else None,
        fps=args.fps,
        update_transcripts=not args.no_update_transcripts
    )


if __name__ == "__main__":
    main()
