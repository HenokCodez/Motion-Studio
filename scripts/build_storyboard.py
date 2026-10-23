"""
Automated Storyboard Builder for Fireship-Style High-Retention Tech Videos.
Slices word-level transcripts into 1.5s-2.5s visual beats (<3.0s max),
enforcing layout rotation, transition variety, and real media asset mapping.
"""

import sys
import os
import json
import argparse
from pathlib import Path

def build_storyboard(project_dir: str):
    p_dir = Path(project_dir).resolve()
    trans_file = p_dir / "transcripts" / "aligned_script.json"
    
    if not trans_file.exists():
        print(f"[ERROR] aligned_script.json not found: {trans_file}")
        return False

    with open(trans_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    words = data.get("words", [])
    if not words:
        print("[ERROR] No words found in aligned_script.json")
        return False

    catalog_path = Path("assets/index.json").resolve()
    catalog = {}
    if catalog_path.exists():
        with open(catalog_path, "r", encoding="utf-8") as f:
            catalog = json.load(f)

    # Core layout archetypes to cycle through
    layout_cycle = [
        "big_text",
        "cutout",
        "screenshot",
        "meme_card",
        "logo_cluster",
        "stat_counter",
        "diagram",
        "big_text",
        "screenshot",
        "cutout"
    ]

    transitions_cycle = ["whipPan", "zoomThrough", "glitch", "swipe", "flashCut"]
    sfx_cycle = ["whoosh.mp3", "pop.mp3", "click.mp3", "impact.wav", "glitch.wav", "punch.mp3"]

    beats = []
    current_words = []
    beat_start_frame = words[0]["start_frame"]
    max_beat_frames = 72  # ~2.4s max (strictly < 90 frames / 3.0s)
    min_beat_frames = 36  # ~1.2s min (allows punchy rapid cuts)

    # Entity detection keywords for smart asset assignment
    entity_asset_map = {
        "altman": {"type": "cutout", "asset": "people/sam_altman.png", "label": "SAM ALTMAN", "role": "OpenAI CEO"},
        "linus": {"type": "cutout", "asset": "people/linus_torvalds.png", "label": "LINUS TORVALDS", "role": "Creator of Linux"},
        "torvalds": {"type": "cutout", "asset": "people/linus_torvalds.png", "label": "LINUS TORVALDS", "role": "Creator of Linux"},
        "satya": {"type": "cutout", "asset": "people/satya_nadella.png", "label": "SATYA NADELLA", "role": "Microsoft CEO"},
        "nadella": {"type": "cutout", "asset": "people/satya_nadella.png", "label": "SATYA NADELLA", "role": "Microsoft CEO"},
        "gates": {"type": "cutout", "asset": "people/bill_gates.png", "label": "BILL GATES", "role": "Microsoft Founder"},
        "jensen": {"type": "cutout", "asset": "people/jensen_huang.png", "label": "JENSEN HUANG", "role": "NVIDIA CEO"},
        "huang": {"type": "cutout", "asset": "people/jensen_huang.png", "label": "JENSEN HUANG", "role": "NVIDIA CEO"},
        "zuckerberg": {"type": "cutout", "asset": "people/mark_zuckerberg.png", "label": "MARK ZUCKERBERG", "role": "Meta Founder"},
        "davinci": {"type": "screenshot", "asset": "screenshots/davinci_site.png", "url": "blackmagicdesign.com/davinci"},
        "blender": {"type": "screenshot", "asset": "screenshots/blender_site.png", "url": "blender.org"},
        "supabase": {"type": "screenshot", "asset": "screenshots/supabase_github.png", "url": "github.com/supabase/supabase"},
        "kokoro": {"type": "screenshot", "asset": "screenshots/kokoro_github.png", "url": "github.com/hexgrad/kokoro"},
        "krea": {"type": "screenshot", "asset": "screenshots/krea_site.png", "url": "krea.ai/canvas"},
        "anthropic": {"type": "screenshot", "asset": "screenshots/anthropic_blog.png", "url": "anthropic.com/research"},
        "money": {"type": "meme_card", "asset": "memes/falling_dollar.png", "captionTop": "SUBSCRIPTION TAX", "captionBottom": "CASH BURN"},
        "dollar": {"type": "meme_card", "asset": "memes/falling_dollar.png", "captionTop": "SUBSCRIPTION TAX", "captionBottom": "CASH BURN"},
        "cost": {"type": "stat_counter", "prefix": "$", "toValue": 2894, "suffix": "/YR", "label": "SAAS SUBSCRIPTION TAX"},
        "percent": {"type": "stat_counter", "toValue": 90, "suffix": "%", "label": "COST REDUCTION RULE"},
        "adobe": {"type": "logo_cluster", "logos": ["logos/photoshop.svg", "logos/premiere.svg", "logos/davinci.svg", "logos/blender.svg"]},
        "hardware": {"type": "logo_cluster", "logos": ["logos/nvidia.svg", "logos/apple.svg", "logos/microsoft.svg"]}
    }

    def flush_beat(end_frame):
        nonlocal current_words, beat_start_frame
        if not current_words:
            return
        
        spoken_text = " ".join([w["word"] for w in current_words]).strip()
        spoken_lower = spoken_text.lower()
        beat_idx = len(beats)
        
        # Check entity matches first
        matched_info = None
        for kw, info in entity_asset_map.items():
            if kw in spoken_lower:
                matched_info = info
                break

        # Check for chapter title trigger
        is_chapter = False
        chapter_title = ""
        chapter_num = ""
        if "the economics" in spoken_lower:
            is_chapter = True
            chapter_num = "01"
            chapter_title = "THE ECONOMICS OF OPEN SOURCE"
        elif "local ai" in spoken_lower or "offline models" in spoken_lower:
            is_chapter = True
            chapter_num = "02"
            chapter_title = "THE RISE OF LOCAL MODELS"
        elif "business model" in spoken_lower or "monetization" in spoken_lower:
            is_chapter = True
            chapter_num = "03"
            chapter_title = "HOW OPEN SOURCE MAKES BILLIONS"
        elif "turning point" in spoken_lower or "future" in spoken_lower:
            is_chapter = True
            chapter_num = "04"
            chapter_title = "THE 2026 INFLECTION POINT"

        if is_chapter:
            shot_type = "chapter_card"
            asset_info = {"number": chapter_num, "title": chapter_title}
        elif matched_info:
            shot_type = matched_info["type"]
            asset_info = matched_info
        else:
            # Cycle through layouts ensuring no consecutive duplicate
            prev_shot = beats[-1]["shotType"] if beats else ""
            candidate = layout_cycle[beat_idx % len(layout_cycle)]
            if candidate == prev_shot:
                candidate = layout_cycle[(beat_idx + 1) % len(layout_cycle)]
            shot_type = candidate
            asset_info = {}

        # Pick accent word
        word_list = spoken_text.split()
        headline = " ".join(word_list[:6])  # Max 6 words
        accent_word = word_list[-1] if len(word_list) > 1 else word_list[0]

        transition = transitions_cycle[beat_idx % len(transitions_cycle)]
        sfx = sfx_cycle[beat_idx % len(sfx_cycle)]

        actual_start = current_words[0]["start_frame"]
        # If there is a previous beat, extend it seamlessly to actual_start so no gap occurs
        if beats and beats[-1]["endFrame"] < actual_start:
            beats[-1]["endFrame"] = actual_start
            beats[-1]["durationInFrames"] = actual_start - beats[-1]["startFrame"]

        beats.append({
            "beatId": f"beat-{beat_idx+1:03d}",
            "startFrame": actual_start,
            "endFrame": end_frame,
            "durationInFrames": end_frame - actual_start,
            "spokenWords": spoken_text,
            "shotType": shot_type,
            "headline": headline,
            "accentWord": accent_word,
            "assetInfo": asset_info,
            "inAnimation": "springPop" if shot_type != "chapter_card" else "glitchZoom",
            "outAnimation": "scaleDown" if shot_type != "chapter_card" else "flashWipe",
            "transition": transition,
            "sfx": sfx
        })

        beat_start_frame = end_frame
        current_words = []

    for w in words:
        current_words.append(w)
        current_duration = w["end_frame"] - beat_start_frame

        # Split conditions: punctuation break, duration limit, or paragraph end
        has_break = any(p in w["word"] for p in [".", ",", "!", "?", ";", ":", "—"])
        if (current_duration >= min_beat_frames and has_break) or current_duration >= max_beat_frames:
            flush_beat(w["end_frame"])

    # Flush remainder
    if current_words:
        flush_beat(words[-1]["end_frame"])

    # Write storyboard.json
    timeline_dir = p_dir / "timeline"
    timeline_dir.mkdir(parents=True, exist_ok=True)
    out_file = timeline_dir / "storyboard.json"

    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(beats, f, indent=2)

    total_duration_sec = beats[-1]["endFrame"] / 30
    cpm = (len(beats) / total_duration_sec) * 60
    max_hold = max(b["durationInFrames"] for b in beats) / 30

    print(f"[OK] Generated {len(beats)} beats in {out_file}")
    print(f"     Total Duration: {total_duration_sec:.1f}s ({beats[-1]['endFrame']} frames)")
    print(f"     Cuts Per Minute: {cpm:.1f} CPM (Fireship target: >= 25)")
    print(f"     Longest Hold: {max_hold:.2f}s (Fireship target: < 3.0s)")

    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate high-retention storyboard JSON")
    parser.add_argument("project_dir", help="Project path or title")
    args = parser.parse_args()

    build_storyboard(args.project_dir)
