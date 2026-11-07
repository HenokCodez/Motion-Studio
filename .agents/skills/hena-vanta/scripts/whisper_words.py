"""Word-level timestamps with faster-whisper. Usage: python whisper_words.py <audio> <out.json> [model]"""
import json, sys
from faster_whisper import WhisperModel

audio, out = sys.argv[1], sys.argv[2]
model_name = sys.argv[3] if len(sys.argv) > 3 else "small.en"
try:
    model = WhisperModel(model_name, device="auto", compute_type="auto")
    segments, info = model.transcribe(audio, word_timestamps=True, vad_filter=True, language="en")
    words = []
    for seg in segments:
        for w in seg.words or []:
            words.append({"w": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)})
except Exception:
    model = WhisperModel(model_name, device="cpu", compute_type="int8")
    segments, info = model.transcribe(audio, word_timestamps=True, vad_filter=True, language="en")
    words = []
    for seg in segments:
        for w in seg.words or []:
            words.append({"w": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)})
json.dump({"duration": info.duration, "words": words}, open(out, "w"), indent=1)
print(f"{len(words)} words, {info.duration:.2f}s")
