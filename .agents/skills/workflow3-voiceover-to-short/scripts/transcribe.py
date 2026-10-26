#!/usr/bin/env python3
"""Step 1: voiceover -> word-level timestamps.
Usage: python scripts/transcribe.py public/voiceover.mp3 [--out words.json] [--model small]
Output words.json: {"duration": 43.21, "words": [{"t":"Hello","s":0.12,"e":0.40}, ...]}
Needs ONE of:  pip install faster-whisper   |   pip install openai-whisper
"""
import argparse, json, subprocess, sys

ap = argparse.ArgumentParser()
ap.add_argument("audio"); ap.add_argument("--out", default="words.json"); ap.add_argument("--model", default="small")
ap.add_argument("--lang", default=None, help="e.g. en (auto-detect if omitted)")
ap.add_argument("--device", default="auto", help="cuda or cpu")
a = ap.parse_args()

dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", a.audio]).decode().strip())
words = []
try:
    from faster_whisper import WhisperModel
    try:
        m = WhisperModel(a.model, device=a.device if a.device != "auto" else "cuda", compute_type="float16" if a.device == "cuda" else "int8")
        segs, _ = m.transcribe(a.audio, word_timestamps=True, language=a.lang, vad_filter=False)
        for sg in segs:
            for w in sg.words:
                words.append({"t": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)})
    except Exception:
        m = WhisperModel(a.model, device="cpu", compute_type="int8")
        segs, _ = m.transcribe(a.audio, word_timestamps=True, language=a.lang, vad_filter=False)
        for sg in segs:
            for w in sg.words:
                words.append({"t": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)})
except ImportError:
    try:
        import whisper
        m = whisper.load_model(a.model)
        r = m.transcribe(a.audio, word_timestamps=True, language=a.lang)
        for sg in r["segments"]:
            for w in sg["words"]:
                words.append({"t": w["word"].strip(), "s": round(w["start"], 3), "e": round(w["end"], 3)})
    except ImportError:
        sys.exit("Install faster-whisper (pip install faster-whisper) or openai-whisper first.")

words = [w for w in words if w["t"]]
# repair: monotonic, e>=s
last = 0.0
for w in words:
    w["s"] = max(w["s"], last); w["e"] = max(w["e"], w["s"] + 0.05); last = w["s"]
json.dump({"duration": round(dur, 3), "words": words}, open(a.out, "w"), indent=1, ensure_ascii=False)
print(f"{len(words)} words, {dur:.2f}s -> {a.out}")
if not 25 <= dur <= 65: print(f"WARNING: duration {dur:.1f}s is outside the 30-60s target.")
