#!/usr/bin/env python3
"""
Local speech transcription module using faster-whisper.
Runs entirely offline without paid APIs. Supports NVIDIA CUDA acceleration
with automatic CPU fallback and produces word-level & segment-level timestamps.
"""
import json
import os
import sys
from pathlib import Path

# Common locations where CUDA 12 / cuBLAS / cuDNN runtime DLLs may reside
CUDA_DLL_CANDIDATES = [
    Path(r"D:\Automations\VoiceStudio\Files\VoiceStudio\project\.venv\Lib\site-packages\torch\lib"),
    Path(r"C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.0\bin"),
    Path(r"C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.1\bin"),
    Path(r"C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.2\bin"),
    Path(r"C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.3\bin"),
    Path(r"C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.4\bin"),
]

def setup_cuda_environment():
    """Ensure CUDA and cuBLAS/cuDNN runtime DLLs are accessible to ctranslate2 on Windows."""
    for dll_dir in CUDA_DLL_CANDIDATES:
        if dll_dir.exists():
            try:
                os.add_dll_directory(str(dll_dir))
                os.environ["PATH"] = str(dll_dir) + os.pathsep + os.environ.get("PATH", "")
                return str(dll_dir)
            except Exception:
                pass
    return None

def format_timestamp(seconds: float, srt: bool = False) -> str:
    """Format seconds into HH:MM:SS,mmm or HH:MM:SS.mmm."""
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    msecs = int(round((seconds - int(seconds)) * 1000))
    sep = "," if srt else "."
    return f"{hrs:02d}:{mins:02d}:{secs:02d}{sep}{msecs:03d}"

def transcribe_audio(
    audio_path: Path,
    output_dir: Path,
    model_size: str = "small",
    device: str = "auto",
    compute_type: str = "auto",
    language: str = None
):
    """
    Transcribe audio file locally using faster-whisper.
    Generates transcript.txt, transcript.md, transcript.json, word-timestamps.json, and captions.srt.
    """
    setup_cuda_environment()
    from faster_whisper import WhisperModel

    audio_path = Path(audio_path).resolve()
    if not audio_path.exists():
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    output_dir = Path(output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    # Determine execution device & compute type
    chosen_device = device
    chosen_compute = compute_type

    if chosen_device == "auto":
        try:
            import ctranslate2
            if ctranslate2.get_cuda_device_count() > 0:
                chosen_device = "cuda"
                if chosen_compute == "auto":
                    # For 4GB VRAM GPU, float16 or int8_float16 gives great balance
                    chosen_compute = "float16"
            else:
                chosen_device = "cpu"
                if chosen_compute == "auto":
                    chosen_compute = "int8"
        except Exception:
            chosen_device = "cpu"
            chosen_compute = "int8"
    else:
        if chosen_compute == "auto":
            chosen_compute = "float16" if chosen_device == "cuda" else "int8"

    print(f"Loading Whisper model '{model_size}' on {chosen_device} ({chosen_compute})...")
    model = None
    try:
        model = WhisperModel(model_size, device=chosen_device, compute_type=chosen_compute)
    except Exception as e:
        if chosen_device == "cuda":
            print(f"Warning: GPU initialization failed ({e}). Falling back to CPU int8...")
            chosen_device = "cpu"
            chosen_compute = "int8"
            model = WhisperModel(model_size, device="cpu", compute_type="int8")
        else:
            raise

    print(f"Transcribing '{audio_path.name}' with word-level timestamps...")
    segments_generator, info = model.transcribe(
        str(audio_path),
        word_timestamps=True,
        language=language
    )

    detected_lang = info.language
    prob = round(info.language_probability, 3)
    duration = round(info.duration, 2)
    print(f"Detected language: {detected_lang} (confidence: {prob}), duration: {duration}s")

    raw_segments = []
    word_timestamps = []
    plain_text_lines = []
    markdown_lines = [
        f"# Transcript: {audio_path.name}\n",
        f"- **Language:** {detected_lang} (probability: {prob})",
        f"- **Duration:** {duration}s",
        f"- **Model:** faster-whisper {model_size} ({chosen_device}/{chosen_compute})\n",
        "## Scene & Segment Timestamps\n"
    ]
    srt_entries = []

    segment_id = 0
    for seg in segments_generator:
        segment_id += 1
        seg_text = seg.text.strip()
        plain_text_lines.append(seg_text)

        start_fmt = format_timestamp(seg.start)
        end_fmt = format_timestamp(seg.end)
        markdown_lines.append(f"**[{start_fmt} -> {end_fmt}]** {seg_text}\n")

        # SRT format
        srt_start = format_timestamp(seg.start, srt=True)
        srt_end = format_timestamp(seg.end, srt=True)
        srt_entries.append(f"{segment_id}\n{srt_start} --> {srt_end}\n{seg_text}\n")

        seg_words = []
        if seg.words:
            for w in seg.words:
                w_clean = w.word.strip()
                w_item = {
                    "word": w_clean,
                    "start": round(w.start, 3),
                    "end": round(w.end, 3),
                    "probability": round(w.probability, 3)
                }
                seg_words.append(w_item)
                word_timestamps.append(w_item)

        avg_logprob = getattr(seg, "avg_logprob", None)
        no_speech_prob = getattr(seg, "no_speech_prob", None)

        raw_segments.append({
            "id": segment_id,
            "start": round(seg.start, 3),
            "end": round(seg.end, 3),
            "text": seg_text,
            "avg_logprob": round(avg_logprob, 3) if avg_logprob is not None else None,
            "no_speech_prob": round(no_speech_prob, 3) if no_speech_prob is not None else None,
            "words": seg_words
        })

    # Save outputs
    # 1. Plain text
    txt_path = output_dir / "transcript.txt"
    txt_path.write_text("\n\n".join(plain_text_lines), encoding="utf-8")

    # 2. Markdown
    md_path = output_dir / "transcript.md"
    md_path.write_text("\n".join(markdown_lines), encoding="utf-8")

    # 3. JSON transcript
    json_path = output_dir / "transcript.json"
    json_data = {
        "audio_file": audio_path.name,
        "language": detected_lang,
        "language_probability": prob,
        "duration_seconds": duration,
        "model": model_size,
        "device": chosen_device,
        "compute_type": chosen_compute,
        "segments": raw_segments
    }
    json_path.write_text(json.dumps(json_data, indent=2, ensure_ascii=False), encoding="utf-8")

    # 4. Word timestamps JSON
    words_path = output_dir / "word-timestamps.json"
    words_path.write_text(json.dumps(word_timestamps, indent=2, ensure_ascii=False), encoding="utf-8")

    # 5. Captions SRT
    srt_path = output_dir / "captions.srt"
    srt_path.write_text("\n".join(srt_entries), encoding="utf-8")

    # 6. Captions JSON for Remotion subtitle rendering
    captions_json_path = output_dir / "captions.json"
    captions_data = [
        {
            "id": s["id"],
            "start": s["start"],
            "end": s["end"],
            "text": s["text"],
            "words": s["words"]
        }
        for s in raw_segments
    ]
    captions_json_path.write_text(json.dumps(captions_data, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"Transcription complete! Results saved to:\n  - {txt_path}\n  - {md_path}\n  - {json_path}\n  - {words_path}\n  - {captions_json_path}\n  - {srt_path}")
    return json_data


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Transcribe audio locally with faster-whisper")
    parser.add_argument("audio", help="Path to input audio file")
    parser.add_argument("--out", "-o", default="transcripts", help="Output directory")
    parser.add_argument("--model", default="small", choices=["tiny", "base", "small", "medium"], help="Whisper model size")
    parser.add_argument("--device", default="auto", choices=["auto", "cuda", "cpu"], help="Inference device")
    parser.add_argument("--compute-type", default="auto", help="Compute type (float16, int8_float16, int8)")
    parser.add_argument("--language", default=None, help="Force language (e.g. en, es, fr)")
    args = parser.parse_args()

    transcribe_audio(
        audio_path=Path(args.audio),
        output_dir=Path(args.out),
        model_size=args.model,
        device=args.device,
        compute_type=args.compute_type,
        language=args.language
    )
