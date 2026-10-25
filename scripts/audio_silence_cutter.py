#!/usr/bin/env python3
"""
Audio Silence Cutter & Ripple Sync Generator
Cuts silences and dead pauses from voiceover audio, produces a tightened audio file,
and maps original timestamps to new tightened timeline timestamps.
"""
import json
import os
import subprocess
from pathlib import Path

def cut_silence(
    audio_path: str,
    words_json_path: str,
    output_dir: str,
    max_duration_s: float = 60.0,
    min_pause_s: float = 0.35,
    keep_padding_s: float = 0.08
):
    out_dir = Path(output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    
    with open(words_json_path, "r", encoding="utf-8") as f:
        raw_data = json.load(f)
    words_data = raw_data.get("words", raw_data) if isinstance(raw_data, dict) else raw_data
        
    normalized_words = []
    for item in words_data:
        if isinstance(item, dict):
            s = item.get("start", item.get("startMs", 0) / 1000.0)
            e = item.get("end", item.get("endMs", 0) / 1000.0)
            w = item.get("word", "")
            normalized_words.append({"word": w, "start": s, "end": e})
            
    # Filter words within scope (take up to ~66s raw so after cutting silence it reaches ~60s)
    raw_words = [w for w in normalized_words if w["start"] <= 66.0]
    if not raw_words:
        raise ValueError("No words found in specified time range.")
        
    # Group words into speech chunks separated by pauses > min_pause_s
    chunks = []
    current_chunk = [raw_words[0]]
    
    for i in range(1, len(raw_words)):
        prev_w = raw_words[i - 1]
        curr_w = raw_words[i]
        pause = curr_w["start"] - prev_w["end"]
        
        if pause > min_pause_s:
            chunks.append(current_chunk)
            current_chunk = [curr_w]
        else:
            current_chunk.append(curr_w)
    if current_chunk:
        chunks.append(current_chunk)
        
    print(f"Divided speech into {len(chunks)} speech chunks by cutting pauses > {min_pause_s}s.")
    
    # Calculate slice boundaries with natural padding
    slices = []
    accumulated_timeline_time = 0.0
    
    for idx, chunk in enumerate(chunks):
        chunk_start = max(0.0, chunk[0]["start"] - keep_padding_s)
        chunk_end = chunk[-1]["end"] + keep_padding_s
        duration = chunk_end - chunk_start
        
        # Stop if we reached target max duration
        if accumulated_timeline_time + duration > max_duration_s and idx > 0:
            allowed_duration = max(0.0, max_duration_s - accumulated_timeline_time)
            if allowed_duration < 0.5:
                break
            chunk_end = chunk_start + allowed_duration
            duration = allowed_duration
            
        slices.append({
            "index": idx,
            "source_start": round(chunk_start, 3),
            "source_end": round(chunk_end, 3),
            "duration": round(duration, 3),
            "timeline_start": round(accumulated_timeline_time, 3),
            "timeline_end": round(accumulated_timeline_time + duration, 3),
            "first_word": chunk[0]["word"],
            "last_word": chunk[-1]["word"],
            "words": [
                {
                    "word": w["word"],
                    "timeline_start": round(accumulated_timeline_time + max(0.0, w["start"] - chunk_start), 3),
                    "timeline_end": round(accumulated_timeline_time + max(0.0, w["end"] - chunk_start), 3)
                }
                for w in chunk if w["start"] >= chunk_start and w["end"] <= chunk_end
            ]
        })
        accumulated_timeline_time += duration
        if accumulated_timeline_time >= max_duration_s:
            break

    total_tight_duration = round(accumulated_timeline_time, 3)
    print(f"Total tightened voiceover duration: {total_tight_duration} seconds (from original ~66.0s).")
    
    # Render tightened audio using ffmpeg
    slice_files = []
    tmp_dir = out_dir / "tmp_audio_slices"
    tmp_dir.mkdir(parents=True, exist_ok=True)
    
    for s in slices:
        idx = s["index"]
        slice_out = tmp_dir / f"slice_{idx:03d}.wav"
        slice_files.append(slice_out)
        cmd = [
            "ffmpeg", "-y",
            "-ss", str(s["source_start"]),
            "-to", str(s["source_end"]),
            "-i", str(audio_path),
            "-c:a", "pcm_s16le",
            str(slice_out)
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    # Concat slices
    concat_list = tmp_dir / "concat.txt"
    with open(concat_list, "w", encoding="utf-8") as f:
        for sf in slice_files:
            f.write(f"file '{sf.resolve().as_posix()}'\n")
            
    final_audio = out_dir / "narration_tight_60s.wav"
    cmd_concat = [
        "ffmpeg", "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", str(concat_list),
        "-c:a", "pcm_s16le",
        str(final_audio)
    ]
    subprocess.run(cmd_concat, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    print(f"Rendered tight narration audio: {final_audio}")
    
    # Cleanup temp slices
    for sf in slice_files:
        sf.unlink(missing_ok=True)
    concat_list.unlink(missing_ok=True)
    tmp_dir.rmdir()
    
    manifest = {
        "audio_file": str(final_audio.resolve()),
        "original_source": str(Path(audio_path).resolve()),
        "total_duration_s": total_tight_duration,
        "total_frames_30fps": int(round(total_tight_duration * 30)),
        "slices": slices
    }
    
    manifest_path = out_dir.parent.parent / "timeline" / "cuts_manifest.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    print(f"Saved cut manifest to: {manifest_path}")
    return manifest

if __name__ == "__main__":
    audio = "Channels/VantaBrief/videos/003-Open-Source-Is-Taking-Over-Software-in-2026/assets/audio/voice/audio.mp3"
    words = "Channels/VantaBrief/videos/003-Open-Source-Is-Taking-Over-Software-in-2026/transcripts/transcript.words.json"
    out = "Videos/premiere-poc-60s/assets/audio/voice"
    cut_silence(audio, words, out, max_duration_s=60.0)
