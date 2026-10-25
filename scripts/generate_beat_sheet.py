import json
from pathlib import Path

TRANSCRIPT_WORDS_FILE = Path("Channels/VantaBrief/videos/003-Open-Source-Is-Taking-Over-Software-in-2026/transcripts/transcript.words.json")
TRANSCRIPT_SEGMENTS_FILE = Path("Channels/VantaBrief/videos/003-Open-Source-Is-Taking-Over-Software-in-2026/transcripts/transcript.json")
OUTPUT_BEAT_SHEET = Path("Channels/VantaBrief/videos/003-Open-Source-Is-Taking-Over-Software-in-2026/timeline/beat_sheet.json")

def build_beat_sheet():
    with open(TRANSCRIPT_SEGMENTS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    segments = data["segments"]

    beats = []
    beat_idx = 1

    # Camera anchor coordinates for spatial clusters
    # Cluster 1 (0-45s): Top-Left (x: -500, y: -300)
    # Cluster 2 (45-90s): Top-Right (x: 500, y: -300)
    # Cluster 3 (90-138s): Mid-Right (x: 800, y: 200)
    # Cluster 4 (138-191s): Center (x: 0, y: 350)
    # Cluster 5 (191-228s): Bottom-Left (x: -600, y: 650)
    # Cluster 6 (228-265s): Master Overview (x: 0, y: 150)

    for seg in segments:
        seg_start_f = int(round(seg["start"] * 30))
        seg_end_f = int(round(seg["end"] * 30))
        words = seg.get("words", [])

        # If segment is longer than 75 frames (2.5s), chunk it into sub-beats so no beat exceeds 75-85 frames
        seg_dur = seg_end_f - seg_start_f
        if seg_dur <= 75 or len(words) <= 5:
            chunks = [(seg_start_f, seg_end_f, seg["text"].strip())]
        else:
            # Split words into sub-beats of ~4-7 words (approx 45-70 frames each)
            chunks = []
            target_words_per_chunk = max(3, len(words) // max(2, (seg_dur + 50) // 60))
            for i in range(0, len(words), target_words_per_chunk):
                sub_words = words[i:i + target_words_per_chunk]
                if not sub_words:
                    continue
                w_start = int(round(sub_words[0]["start"] * 30))
                w_end = int(round(sub_words[-1]["end"] * 30))
                # Ensure no sub-beat gap
                if chunks:
                    w_start = chunks[-1][1]
                w_text = " ".join(w["word"] for w in sub_words).strip()
                chunks.append((w_start, max(w_start + 30, w_end), w_text))
            if chunks:
                chunks[-1] = (chunks[-1][0], max(chunks[-1][0] + 30, seg_end_f), chunks[-1][2])

        for c_start, c_end, c_text in chunks:
            # Ensure maximum gap between events is <= 85 frames (strict Rule 1: <= 90 frames)
            if c_end - c_start > 85:
                mid = c_start + (c_end - c_start) // 2
                sub_entries = [
                    (c_start, mid, c_text),
                    (mid, c_end, c_text)
                ]
            else:
                sub_entries = [(c_start, c_end, c_text)]

            for s_start, s_end, s_text in sub_entries:
                time_sec = s_start / 30.0

                # Determine idea, elements, assets, and camera
                idea = ""
                elements = []
                assets = []
                mascot = "idle"

                # Spatial cluster assignment
                if time_sec < 45.6:
                    cluster = "cluster_1_2026_shift"
                    base_x, base_y = -500, -300
                elif time_sec < 90.4:
                    cluster = "cluster_2_saas_toll"
                    base_x, base_y = 500, -300
                elif time_sec < 137.8:
                    cluster = "cluster_3_open_weights"
                    base_x, base_y = 800, 200
                elif time_sec < 191.2:
                    cluster = "cluster_4_monetization"
                    base_x, base_y = 0, 350
                elif time_sec < 227.6:
                    cluster = "cluster_5_hardware_shift"
                    base_x, base_y = -600, 650
                else:
                    cluster = "cluster_6_master_overview"
                    base_x, base_y = 0, 150

                text_lower = s_text.lower()

                # Keywords to assets and actions
                if "2026" in text_lower:
                    idea = "2026 title wordmark reveal"
                    elements = ["draw_title_wordmark", "orange_highlight_2026"]
                    assets = ["logos/opensource.svg"]
                    mascot = "pointing"
                    cam = {"x": base_x, "y": base_y, "zoom": 1.4, "type": "punch_in"}
                elif "edit videos" in text_lower or "design graphics" in text_lower or "clone voices" in text_lower:
                    idea = "Capabilities check boxes draw"
                    elements = ["draw_sketch_box_features", "stagger_sub_chips"]
                    assets = []
                    mascot = "thinking"
                    cam = {"x": base_x + 80, "y": base_y + 40, "zoom": 1.35, "type": "pan"}
                elif "artcraft" in text_lower:
                    idea = "ArtCraft open suite repo pop-in"
                    elements = ["drop_repo_card", "draw_curved_arrow", "counter_stars"]
                    assets = ["screenshots/artcraft_repo.png", "logos/github.svg"]
                    mascot = "pointing"
                    cam = {"x": base_x + 250, "y": base_y + 80, "zoom": 1.5, "type": "punch_in"}
                elif "photoshop" in text_lower:
                    idea = "Adobe Photoshop target node"
                    elements = ["draw_target_box", "pop_logo"]
                    assets = ["logos/photoshop.svg", "logos/adobe.svg"]
                    mascot = "pointing"
                    cam = {"x": base_x + 320, "y": base_y + 120, "zoom": 1.45, "type": "pan"}
                elif "premiere" in text_lower:
                    idea = "Adobe Premiere Pro target node"
                    elements = ["draw_target_box", "pop_logo"]
                    assets = ["logos/premiere.svg"]
                    mascot = "pointing"
                    cam = {"x": base_x + 380, "y": base_y + 160, "zoom": 1.45, "type": "pan"}
                elif "after effects" in text_lower:
                    idea = "Adobe After Effects target node"
                    elements = ["draw_target_box", "pop_logo"]
                    assets = ["logos/aftereffects.svg"]
                    mascot = "pointing"
                    cam = {"x": base_x + 440, "y": base_y + 200, "zoom": 1.45, "type": "pan"}
                elif "one developer" in text_lower or "solo" in text_lower:
                    idea = "Solo developer velocity highlight"
                    elements = ["draw_sketch_callout", "marker_highlight_solo"]
                    assets = ["logos/anthropic.svg"]
                    mascot = "celebrating"
                    cam = {"x": base_x + 180, "y": base_y + 120, "zoom": 1.4, "type": "punch_in"}
                elif "who's actually making money" in text_lower or "nobody's paying" in text_lower:
                    idea = "Central monetization paradox query"
                    elements = ["draw_rust_box_query", "draw_curved_orange_arrow", "marker_highlight_money"]
                    assets = []
                    mascot = "shrugging"
                    cam = {"x": base_x + 480, "y": base_y + 300, "zoom": 1.55, "type": "punch_in"}
                elif "premiere pro" in text_lower or "pay for photoshop" in text_lower:
                    idea = "Proprietary toll stack"
                    elements = ["draw_sketch_toll_card", "pop_logo_stack"]
                    assets = ["logos/adobe.svg", "logos/photoshop.svg", "logos/premiere.svg"]
                    mascot = "pointing"
                    cam = {"x": base_x - 100, "y": base_y, "zoom": 1.35, "type": "pan"}
                elif "davinci" in text_lower or "blender" in text_lower or "libreoffice" in text_lower:
                    idea = "The free Hollywood-grade stack"
                    elements = ["draw_open_stack_box", "pop_logo_davinci", "pop_logo_blender", "pop_logo_libreoffice"]
                    assets = ["logos/davinci.svg", "logos/blender.svg", "logos/libreoffice.svg"]
                    mascot = "celebrating"
                    cam = {"x": base_x + 200, "y": base_y, "zoom": 1.4, "type": "punch_in"}
                elif "90%" in text_lower or "nonsense" in text_lower:
                    idea = "90% utility threshold gauge"
                    elements = ["draw_gauge_line", "pulse_90_percent", "marker_highlight_nonsense"]
                    assets = []
                    mascot = "pointing"
                    cam = {"x": base_x + 350, "y": base_y + 80, "zoom": 1.5, "type": "punch_in"}
                elif "krea" in text_lower or "kokoro" in text_lower:
                    idea = "Open weights models reveal"
                    elements = ["drop_models_card", "pop_terminal_snippet"]
                    assets = ["screenshots/kokoro_repo.png", "screenshots/krea_ai.png"]
                    mascot = "pointing"
                    cam = {"x": base_x + 100, "y": base_y + 100, "zoom": 1.45, "type": "punch_in"}
                elif "download a model" in text_lower or "run it locally" in text_lower:
                    idea = "Local compute execution diagram"
                    elements = ["draw_terminal_window", "type_terminal_command", "marker_highlight_local"]
                    assets = []
                    mascot = "pointing"
                    cam = {"x": base_x + 250, "y": base_y + 200, "zoom": 1.5, "type": "punch_in"}
                elif "paid convenience" in text_lower or "first model" in text_lower:
                    idea = "Monetization Blueprint 1: Paid Convenience"
                    elements = ["draw_quadrant_1", "draw_fork_arrow_1", "pop_cloud_chip"]
                    assets = []
                    mascot = "pointing"
                    cam = {"x": base_x - 180, "y": base_y - 120, "zoom": 1.4, "type": "punch_in"}
                elif "enterprise" in text_lower or "second is" in text_lower:
                    idea = "Monetization Blueprint 2: Enterprise Tier"
                    elements = ["draw_quadrant_2", "draw_fork_arrow_2", "pop_security_chip"]
                    assets = []
                    mascot = "pointing"
                    cam = {"x": base_x + 180, "y": base_y - 120, "zoom": 1.4, "type": "punch_in"}
                elif "services" in text_lower or "third is" in text_lower:
                    idea = "Monetization Blueprint 3: Services & Consulting"
                    elements = ["draw_quadrant_3", "draw_fork_arrow_3", "pop_consulting_chip"]
                    assets = []
                    mascot = "pointing"
                    cam = {"x": base_x - 180, "y": base_y + 140, "zoom": 1.4, "type": "punch_in"}
                elif "sponsorships" in text_lower or "donations" in text_lower:
                    idea = "Monetization Blueprint 4: Capital & Grants"
                    elements = ["draw_quadrant_4", "draw_fork_arrow_4", "pop_grant_chip"]
                    assets = []
                    mascot = "celebrating"
                    cam = {"x": base_x + 180, "y": base_y + 140, "zoom": 1.4, "type": "punch_in"}
                elif "hardware" in text_lower or "chips" in text_lower or "vram" in text_lower:
                    idea = "The Hardware & VRAM Migration"
                    elements = ["draw_hardware_chassis", "led_power_pulse", "draw_price_slider"]
                    assets = ["logos/nvidia.svg", "logos/apple.svg"]
                    mascot = "pointing"
                    cam = {"x": base_x + 150, "y": base_y + 100, "zoom": 1.45, "type": "punch_in"}
                elif "choice rather than a requirement" in text_lower:
                    idea = "The Grand Thesis: Software as Choice"
                    elements = ["draw_grand_verdict_card", "marker_highlight_choice", "draw_connectors_summary"]
                    assets = []
                    mascot = "celebrating"
                    cam = {"x": 0, "y": 150, "zoom": 0.95, "type": "pull_back"}
                elif "comments" in text_lower or "next one" in text_lower:
                    idea = "Master canvas full overview outro"
                    elements = ["pull_back_master_view", "highlight_all_nodes", "outro_call_to_action"]
                    assets = []
                    mascot = "pointing"
                    cam = {"x": 0, "y": 100, "zoom": 0.65, "type": "pull_back"}
                else:
                    idea = f"Visual narrative step: {s_text[:28]}"
                    elements = ["pulse_active_node", "marker_sweep_keyword"]
                    assets = []
                    mascot = "pointing" if (beat_idx % 2 == 0) else "idle"
                    cam = {"x": base_x, "y": base_y, "zoom": 1.25, "type": "settle"}

                beats.append({
                    "id": f"beat_{beat_idx:03d}",
                    "startFrame": s_start,
                    "endFrame": s_end,
                    "durationFrames": s_end - s_start,
                    "narration": s_text,
                    "oneIdea": idea,
                    "cluster": cluster,
                    "elements": elements,
                    "assets": assets,
                    "cameraMove": cam,
                    "mascotPose": mascot
                })
                beat_idx += 1

    OUTPUT_BEAT_SHEET.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_BEAT_SHEET, "w", encoding="utf-8") as f:
        json.dump({"total_beats": len(beats), "total_duration_frames": 7946, "beats": beats}, f, indent=2)

    print(f"Beat sheet generated: {len(beats)} beats.")
    # Check rule: max gap between events <= 90 frames
    violations = [b for b in beats if b["durationFrames"] > 90]
    print(f"Violations > 90 frames: {len(violations)}")

if __name__ == "__main__":
    build_beat_sheet()
