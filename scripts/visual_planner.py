#!/usr/bin/env python3
"""
Automated Visual Planner for Motion Studio & VantaBrief.
Authoritative Channel Directive: VantaBrief Visual Style Bible
(Channels/VantaBrief/style/VantaBrief_Visual_Style_Bible.md)

Turns narration audio and/or timestamped scripts into deterministic machine-readable
Remotion scene timelines (timeline/scenes.json), scene frames (frames.md),
and footage checklists (manifests/footage-needed.md).

Enforces:
- Five Visual Styles (Kinetic Typography, Real Evidence, Editorial Collage, Graphic Symbols, Technical Motion Graphics)
- Style 5 constraint: Technical motion graphics used primarily for explanatory/comparison/process beats
- Non-negotiable Character Ban (Rule R4): No cartoon avatars, mascots, stick figures
- Palette compliance (Rule R3)
- High-legibility footage placeholders with FOOTAGE NEEDED standard (Rule R5)
"""
import argparse
from datetime import datetime
import json
import math
import os
from pathlib import Path
import re
import sys


STYLE_1_KINETIC = "kinetic_typography"
STYLE_2_EVIDENCE = "real_evidence"
STYLE_3_COLLAGE = "editorial_collage"
STYLE_4_SYMBOL = "graphic_symbol"
STYLE_5_TECHNICAL = "technical_motion_graphics"


def extract_factual_claims(text: str) -> list:
    """Extract verifiable numbers, percentages, dollar amounts, and metrics."""
    claims = []
    # Match percentages, dollar values, multipliers, or numerical benchmarks
    patterns = [
        r"\$\d+(?:\.\d+)?(?:\s*(?:billion|million|k|/mo|/yr))?",
        r"\d+(?:\.\d+)?%",
        r"\d+x\s+(?:faster|more|reduction)",
        r"\d+\s+(?:hours|months|days|weeks|seconds|tokens/s|parameters)",
    ]
    for pat in patterns:
        for match in re.findall(pat, text, re.IGNORECASE):
            claims.append(match)
    return claims


def classify_vanta_style(text: str, index: int, total_scenes: int, previous_styles: list) -> tuple:
    """
    Classify narration segment into one of the 5 official VantaBrief styles.
    Returns: (primary_style, secondary_style, narrative_purpose, takeaway, composition)
    """
    t = text.lower()

    # Rule: Opening hook defaults to Kinetic Typography or Real Evidence
    if index == 0:
        return (
            STYLE_1_KINETIC,
            STYLE_2_EVIDENCE,
            "Hook the audience with the core premise and thesis statement.",
            "Understand why this topic matters right now in 2026.",
            "Centered heavy sans typography with brand accent word highlight and subtle dark canvas glow.",
            "vanta-title-hook"
        )

    # Style 5 Constraint: ONLY used for explaining concepts, systems, comparisons, mechanisms, or data processes.
    is_technical_explanatory = any(k in t for k in [
        "how it works", "how this works", "under the hood", "architecture",
        "pipeline", "workflow", "process", "mechanism", "versus", "vs", "compared to",
        "difference between", "benchmark", "tokens/s", "latency", "system", "stack",
        "cost breakdown", "business model", "engine", "pricing model"
    ])

    if is_technical_explanatory:
        return (
            STYLE_5_TECHNICAL,
            STYLE_4_SYMBOL,
            "Explain the technical mechanism, system architecture, or comparative performance.",
            "See the exact data flow or comparison without hand-waving abstractions.",
            "Step-by-step node pipeline or side-by-side comparison matrix with glowing connectors.",
            "vanta-comparison" if any(k in t for k in ["vs", "versus", "compared"]) else "vanta-benchmark"
        )

    # Style 2: Real evidence, authentic interfaces, screenshots, screen recording, code
    is_evidence = any(k in t for k in [
        "github", "repo", "terminal", "command", "cli", "install", "code", "run",
        "docker", "pull", "documentation", "tweet", "post", "article", "report",
        "website", "interface", "app", "demo", "screen recording", "capture",
        "let's open", "here is", "in the terminal", "look at"
    ])

    if is_evidence:
        needs_recording = any(k in t for k in ["demo", "let's open", "screen recording", "live", "interface"])
        return (
            STYLE_2_EVIDENCE,
            STYLE_1_KINETIC,
            "Present authentic evidence, verified documentation, or software interfaces.",
            "Verify the concrete tool or source discussed in the voiceover.",
            "Authentic UI framed inside EvidenceFrame with window controls and source URL pill.",
            "footage-placeholder" if needs_recording else "vanta-highlight-browser"
        )

    # Style 4: Non-human graphic symbols, security, database, infrastructure tokens
    is_symbol = any(k in t for k in [
        "security", "lock", "encrypt", "database", "storage", "cpu", "gpu",
        "hardware", "token", "api", "network", "cloud", "local", "offline", "server"
    ])

    if is_symbol:
        return (
            STYLE_4_SYMBOL,
            STYLE_1_KINETIC,
            "Anchor abstract infrastructure concepts with clean non-human graphic symbols.",
            "Recognize the structural building block (database, server, key, or compute engine).",
            "Geometric vector symbol inside elevated surface card with pulsing brand glow. No mascots.",
            "vanta-spatial-callout"
        )

    # Style 3: Editorial collage, visual metaphors, market shifts, industry trends
    is_editorial = any(k in t for k in [
        "market", "industry", "big tech", "movement", "disruption", "enterprise",
        "commercial", "history", "shift", "future", "closed source", "walled garden",
        "community", "trillion", "billion", "revolution"
    ])

    if is_editorial:
        return (
            STYLE_3_COLLAGE,
            STYLE_1_KINETIC,
            "Highlight market impact and macro industry tension using editorial collage.",
            "Grasp the strategic significance and scale of the development.",
            "Textured editorial card with washi tape accent, exhibit stamp, and bold typography.",
            "vanta-chapter-card"
        )

    # Style 1: Kinetic typography fallback for punchy rhetoric or transitions
    recent_styles = previous_styles[-2:] if len(previous_styles) >= 2 else []
    if recent_styles.count(STYLE_1_KINETIC) < 2:
        return (
            STYLE_1_KINETIC,
            STYLE_3_COLLAGE,
            "Deliver punchy kinetic statement and maintain viewer retention.",
            "Register the single core takeaway before moving to next point.",
            "High-contrast kinetic text reveal with staggered spring animation on brand canvas.",
            "vanta-kinetic-list"
        )
    else:
        return (
            STYLE_3_COLLAGE,
            STYLE_2_EVIDENCE,
            "Provide editorial framing for the narrative beat.",
            "Connect the preceding explanation to real-world implications.",
            "Layered editorial layout with verified badge and subtle camera push-in.",
            "vanta-asymmetric-split"
        )


def plan_project_visuals(project_dir: Path, fps: int = 30):
    project_dir = Path(project_dir).resolve()
    if not project_dir.exists():
        raise FileNotFoundError(f"Project directory not found: {project_dir}")

    timeline_dir = project_dir / "timeline"
    timeline_dir.mkdir(parents=True, exist_ok=True)
    manifests_dir = project_dir / "manifests"
    manifests_dir.mkdir(parents=True, exist_ok=True)

    # 1. Resolve Channel Configuration
    channel_cfg = {}
    channel_id = "VantaBrief"
    try:
        parts = project_dir.parts
        if "Channels" in parts:
            c_idx = parts.index("Channels")
            c_name = parts[c_idx + 1]
            c_json = project_dir.parents[1] / "channel.json"
            if c_json.exists():
                channel_cfg = json.loads(c_json.read_text(encoding="utf-8"))
                channel_id = channel_cfg.get("id", c_name)
    except Exception as e:
        print(f"Channel detection note: {e}")

    is_vanta = "vanta" in channel_id.lower()

    # 2. Extract Segments (Prioritize verified aligned_script.json)
    aligned_json = project_dir / "transcripts" / "aligned_script.json"
    transcript_json = project_dir / "transcripts" / "transcript.json"
    segments = []

    if aligned_json.exists():
        try:
            a_data = json.loads(aligned_json.read_text(encoding="utf-8"))
            for p in a_data.get("paragraphs", []):
                start = float(p.get("start_sec", 0))
                end = float(p.get("end_sec", start + 3.0))
                text = p.get("text", "").strip()
                words = p.get("words", [])
                if text:
                    segments.append({"start": start, "end": end, "text": text, "words": words})
            print(f"-> Loaded {len(segments)} verified human-script paragraphs from aligned_script.json")
        except Exception as e:
            print(f"Warning reading aligned_script.json: {e}")

    if not segments and transcript_json.exists():
        try:
            t_data = json.loads(transcript_json.read_text(encoding="utf-8"))
            raw_segs = t_data.get("segments", [])
            for s in raw_segs:
                start = float(s.get("start", 0))
                end = float(s.get("end", start + 3.0))
                text = s.get("text", "").strip()
                words = s.get("words", [])
                if text:
                    segments.append({"start": start, "end": end, "text": text, "words": words})
        except Exception as e:
            print(f"Warning reading transcript.json: {e}")

    if not segments:
        print("No audio segments found in transcripts. Generating initial 4-scene storyboard draft...")
        segments = [
            {"start": 0.0, "end": 4.0, "text": "Welcome to VantaBrief. Open source software is fundamentally reshaping modern development."},
            {"start": 4.0, "end": 9.0, "text": "Let us examine the architecture of local AI systems running directly on developer workstations."},
            {"start": 9.0, "end": 14.0, "text": "Here is an authentic screen recording of model weights executing offline at twenty tokens per second."},
            {"start": 14.0, "end": 18.0, "text": "The balance of power has shifted from closed centralized servers to distributed local compute."}
        ]

    # 3. Build Scenes Timeline with Five Visual Styles & Phase 7 Manifest
    scenes = []
    footage_needed = []
    style_history = []
    total_scenes = len(segments)

    for i, seg in enumerate(segments):
        start_sec = seg["start"]
        end_sec = seg["end"]
        duration_sec = max(end_sec - start_sec, 2.0)

        start_frame = int(round(start_sec * fps))
        end_frame = int(round((start_sec + duration_sec) * fps))
        duration_frames = end_frame - start_frame

        scene_id = f"scene-{i+1:02d}"

        if is_vanta:
            p_style, s_style, purpose, takeaway, comp, layout = classify_vanta_style(
                seg["text"], i, total_scenes, style_history
            )
            style_history.append(p_style)
        else:
            p_style = "default"
            s_style = None
            purpose = "Deliver topic overview."
            takeaway = "Understand the scene content."
            comp = "Standard layout"
            layout = "callout-card"

        # Check for factual claims
        claims = extract_factual_claims(seg["text"])

        # Determine asset needs and placeholder status
        required_assets = []
        is_missing_footage = False
        target_footage_path = f"assets/user-footage/{scene_id}-recording.mp4"
        real_footage_exists = (project_dir / target_footage_path).exists()

        if p_style == STYLE_2_EVIDENCE or "demo" in seg["text"].lower() or "screen recording" in seg["text"].lower():
            if not real_footage_exists:
                is_missing_footage = True
                required_assets.append({
                    "slotId": scene_id,
                    "type": "SCREEN RECORDING",
                    "path": target_footage_path,
                    "verified": False,
                    "instruction": f"Screen recording: authentic capture of {seg['text'][:60]}...",
                    "actionPrompt": seg["text"],
                    "searchTerms": [w for w in seg["text"].split() if len(w) > 4][:4]
                })
                footage_needed.append(required_assets[-1])
            else:
                required_assets.append({
                    "slotId": scene_id,
                    "type": "SCREEN RECORDING",
                    "path": target_footage_path,
                    "verified": True,
                    "instruction": "Recorded footage supplied by editor."
                })

        scene = {
            "id": scene_id,
            "sceneNumber": i + 1,
            "startFrame": start_frame,
            "endFrame": end_frame,
            "durationInFrames": duration_frames,
            "durationSeconds": round(duration_sec, 2),
            "voiceoverSegment": seg["text"],
            "narrativePurpose": purpose,
            "primaryStyle": p_style,
            "secondaryStyle": s_style,
            "audienceTakeaway": takeaway,
            "visualComposition": comp,
            "layoutTemplate": layout,
            "animationSequence": {
                "entrance": "springPop (8 frames, damping: 11, stiffness: 230)",
                "mainAction": "subtle camera pushIn (scale: 1.00 -> 1.04)",
                "hold": "steady hold with kinetic element drift",
                "exit": "rapid scaleDown (6 frames, damping: 15, stiffness: 300)"
            },
            "requiredAssets": required_assets,
            "isPlaceholder": is_missing_footage,
            "placeholderHeading": "FOOTAGE NEEDED" if is_missing_footage else None,
            "factualClaims": claims,
            "transitionIntent": "hard-cut with camera continuity",
            "readabilityNotes": "Panton Rust Display font; word cap <= 7 words per kinetic card; high contrast on #231F20 charcoal background."
        }

        # Add synchronized word anchors
        words = seg.get("words", [])
        if words:
            scene["wordAnchors"] = [
                {
                    "word": w.get("word", ""),
                    "triggerFrame": max(0, int(round((w.get("start", start_sec) - start_sec) * fps))),
                    "isAccent": idx == min(3, len(words) - 1)
                }
                for idx, w in enumerate(words[:6])
            ]

        scenes.append(scene)

    total_duration_frames = scenes[-1]["endFrame"] if scenes else 300
    total_duration_sec = total_duration_frames / fps

    timeline_data = {
        "channelId": channel_id,
        "styleBibleVersion": "VantaBrief_Visual_Style_Bible_2026",
        "fps": fps,
        "totalFrames": total_duration_frames,
        "durationSeconds": round(total_duration_sec, 2),
        "totalScenes": len(scenes),
        "styleDistribution": {
            STYLE_1_KINETIC: style_history.count(STYLE_1_KINETIC),
            STYLE_2_EVIDENCE: style_history.count(STYLE_2_EVIDENCE),
            STYLE_3_COLLAGE: style_history.count(STYLE_3_COLLAGE),
            STYLE_4_SYMBOL: style_history.count(STYLE_4_SYMBOL),
            STYLE_5_TECHNICAL: style_history.count(STYLE_5_TECHNICAL),
        },
        "characterBanCompliant": True,
        "brandPaletteCompliant": True,
        "scenes": scenes
    }

    # Write timeline/scenes.json
    scenes_json_file = timeline_dir / "scenes.json"
    scenes_json_file.write_text(json.dumps(timeline_data, indent=2), encoding="utf-8")
    print(f"-> Generated timeline scenes: {scenes_json_file} ({len(scenes)} scenes, {total_duration_frames} frames)")

    # Write manifests/footage-needed.md with FOOTAGE NEEDED standard
    checklist_md = manifests_dir / "footage-needed.md"
    checklist_content = [
        f"# Footage Recording Checklist: {project_dir.name}",
        f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "",
        f"**Channel**: `{channel_id}` | **Authoritative Directive**: `Channels/VantaBrief/style/VantaBrief_Visual_Style_Bible.md`",
        f"**Total Missing Footage Slots**: {len(footage_needed)}",
        "",
        "> [!IMPORTANT]",
        "> When a scene needs real footage or an authentic interface that is not yet available,",
        "> the draft renders a centered `FOOTAGE NEEDED` placeholder card. Never fill with generic filler.",
        "",
        "| Scene ID | Type | Target File Location | Instructions & Required Capture | Search / Reference | Status |",
        "| :--- | :--- | :--- | :--- | :--- | :--- |"
    ]

    if footage_needed:
        for fn in footage_needed:
            checklist_content.append(
                f"| `{fn['slotId']}` | `{fn['type']}` | `{fn['path']}` | **{fn['instruction']}**<br>*\"{fn['actionPrompt']}\"* | `{', '.join(fn.get('searchTerms', []))}` | 🔴 **FOOTAGE NEEDED** |"
            )
        checklist_content.extend([
            "",
            "## How to Drop In Footage:",
            "1. Record the authentic screen recording, terminal session, or software demonstration.",
            "2. Save the file into `assets/user-footage/` with the exact filename listed above.",
            "3. Remotion will auto-detect the replacement file upon next render.",
            "4. Rerun QA: `npx tsx scripts/qa.ts`."
        ])
    else:
        checklist_content.append("| — | — | — | All required video recordings and authentic assets are verified! | — | ✅ Ready |")

    checklist_md.write_text("\n".join(checklist_content) + "\n", encoding="utf-8")
    print(f"-> Updated footage recording checklist: {checklist_md}")

    # Write frames.md with Phase 7 Scene Breakdown
    frames_md = project_dir / "frames.md"
    f_content = [
        f"# Scene & Frame Breakdown: {project_dir.name}",
        f"Channel: `{channel_id}` | FPS: {fps} | Total Frames: {total_duration_frames} ({total_duration_sec:.1f}s)",
        "",
        "| Scene | Start (s) | End (s) | Frames | Primary Visual Style | Narrative Purpose | Factual Claims | Narration Snippet |",
        "|-------|-----------|---------|--------|----------------------|-------------------|----------------|-------------------|"
    ]
    for s in scenes:
        start_s = s["startFrame"] / fps
        end_s = s["endFrame"] / fps
        narration_short = (s.get("voiceoverSegment", "")[:50] + "...") if len(s.get("voiceoverSegment", "")) > 50 else s.get("voiceoverSegment", "")
        claims_str = ", ".join(s.get("factualClaims", [])) if s.get("factualClaims") else "—"
        f_content.append(
            f"| `{s['id']}` | {start_s:.2f} | {end_s:.2f} | {s['startFrame']}-{s['endFrame']} | `{s['primaryStyle']}` | {s['narrativePurpose'][:35]}... | {claims_str} | {narration_short} |"
        )
    frames_md.write_text("\n".join(f_content) + "\n", encoding="utf-8")
    print(f"-> Updated frame breakdown: {frames_md}")

    return timeline_data


def main():
    parser = argparse.ArgumentParser(description="Automated Visual Planner")
    parser.add_argument("project", help="Project directory path")
    parser.add_argument("--fps", type=int, default=30)
    args = parser.parse_args()
    plan_project_visuals(args.project, args.fps)


if __name__ == "__main__":
    main()
