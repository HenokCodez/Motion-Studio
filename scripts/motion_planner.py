#!/usr/bin/env python3
"""
Motion Studio Animation Moment Planner
Analyzes a full video script or Whisper transcript to identify and specify
the 3-5 critical moments that genuinely require custom motion graphics.
Outputs to plans/motion_plan.json and plans/animation_plans.md.
"""
import json
import re
from pathlib import Path
from typing import List, Dict, Any, Optional

STUDIO_ROOT = Path(__file__).resolve().parent.parent

# Semantic markers for animation-worthy technical moments
ANIMATION_KEYWORDS = {
    "system_architecture": [
        "architecture", "system", "infrastructure", "stack", "pipeline", 
        "engine", "backend", "frontend", "cluster", "distributed", "server",
        "adobe applications", "applications", "project", "photoshop", "premiere pro",
        "open-source project", "open source"
    ],
    "data_flow_process": [
        "process", "how it works", "workflow", "data moves", "step", "flow", 
        "pipeline", "transformation", "converts", "compiles", "executes",
        "generate images", "clone voices", "run ai models", "computer"
    ],
    "comparison": [
        "versus", "vs", "compare", "alternative", "unlike", "instead of", 
        "difference between", "paid vs", "cloud vs local", "open source vs",
        "subscription", "paying for", "free open-source", "cheap knockoffs",
        "replace the software", "pay for"
    ],
    "abstract_mechanism": [
        "mechanism", "weights", "parameters", "neural", "attention", "transformer", 
        "quantization", "latency", "throughput", "bandwidth", "memory", "development",
        "developer can even attempt", "where software development is heading",
        "download a model", "run it locally", "connect it to your own"
    ],
    "monetization_models": [
        "paid convenience", "enterprise features", "selling services", "make money",
        "how do open-source developers make money", "monetization", "first model is",
        "second is enterprise", "third is selling", "companies that depend on them"
    ]
}

def analyze_transcript_for_moments(
    transcript_path: Path,
    max_moments: int = 5,
    min_gap_seconds: float = 18.0
) -> List[Dict[str, Any]]:
    """Analyzes word/segment timestamps to pick 3-5 high-leverage animation moments."""
    with open(transcript_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    segments = data.get("segments", [])
    if not segments and isinstance(data, list):
        segments = data
        
    candidates = []
    
    for seg in segments:
        text = seg.get("text", "")
        start = seg.get("start", 0.0)
        end = seg.get("end", 0.0)
        duration = end - start
        
        # Score segment based on technical explanation markers
        score = 0
        matched_category = None
        text_lower = text.lower()
        
        for category, kws in ANIMATION_KEYWORDS.items():
            matches = [kw for kw in kws if kw in text_lower]
            if matches:
                score += len(matches) * 2
                if not matched_category:
                    matched_category = category
                    
        # Prefer segments with sufficient explanation time (2.5s to 15.0s)
        if 2.5 <= duration <= 15.0 and score > 0:
            candidates.append({
                "start": start,
                "end": end,
                "duration": duration,
                "text": text.strip(),
                "score": score,
                "category": matched_category
            })
            
    # Sort candidates by score
    candidates.sort(key=lambda x: x["score"], reverse=True)
    
    # Select non-overlapping moments with min_gap_seconds
    selected = []
    for cand in candidates:
        if len(selected) >= max_moments:
            break
        overlap = False
        for s in selected:
            if abs(cand["start"] - s["start"]) < min_gap_seconds:
                overlap = True
                break
        if not overlap:
            selected.append(cand)
            
    # Sort chronologically
    selected.sort(key=lambda x: x["start"])
    
    # Build complete MG specs
    moments = []
    for idx, s in enumerate(selected, 1):
        mg_id = f"MG-{idx:02d}"
        cat = s["category"]
        
        if cat == "comparison":
            concept_name = "Architecture or Stack Comparison"
            objective = "Contrast traditional paid software models against modern local/open-source stacks."
            viewer_takeaway = "Understand the trade-offs, cost savings, and structural differences."
            visual_treatment = "Side-by-side technical comparison grid with animated feature checks and metric badges."
            search_query = "technical comparison motion graphics design UI"
            transition = "Split horizontal wipe in from center, hold 3s, staggered fade out"
        elif cat == "data_flow_process":
            concept_name = "System Pipeline and Data Flow"
            objective = "Show how data or instructions move through the system step by step."
            viewer_takeaway = "See the exact sequence of events without getting lost in abstract jargon."
            visual_treatment = "Progressive node-connector pipeline with moving signal packets and state badges."
            search_query = "data flow animated technical diagram motion design pinterest"
            transition = "Left-to-right progressive connector reveal, pulsing node pulse, scale spring exit"
        elif cat == "system_architecture":
            concept_name = "Infrastructure Architecture Breakdown"
            objective = "Deconstruct the multi-layer technology stack into clear modular components."
            viewer_takeaway = "Grasp how the underlying components interface together."
            visual_treatment = "Layered 2D technical card stack with accent wireframe borders and live status pills."
            search_query = "system architecture animation explainer infographic pinterest"
            transition = "Staggered bottom-up card elevation with smooth cubic-bezier easing"
        elif cat == "monetization_models":
            concept_name = "Open-Source Monetization Architecture"
            objective = "Explain the 3 revenue pillars: Paid Convenience, Enterprise Support, and Services."
            viewer_takeaway = "Understand how free open-source software sustains profitable commercial businesses."
            visual_treatment = "Trio of structured service cards revealing sequentially with revenue flow arrows."
            search_query = "business architecture multi-tier revenue model motion design pinterest"
            transition = "Staggered 3-column entrance with slide-up springs"
        else:
            concept_name = "Core Technical Mechanism"
            objective = "Explain the fundamental mechanism driving this technical result."
            viewer_takeaway = "Visualize the cause-and-effect relationship."
            visual_treatment = "Kinetic typography statement with dynamic data counter and evidence callout."
            search_query = "technology explainer motion graphics kinetic callout pinterest"
            transition = "Punchy typography snap with slight motion blur, settling into static hold"
            
        moments.append({
            "id": mg_id,
            "concept_name": concept_name,
            "start_time": s["start"],
            "end_time": s["end"],
            "start_timecode": f"{int(s['start']//60):02d}:{s['start']%60:06.3f}",
            "end_timecode": f"{int(s['end']//60):02d}:{s['end']%60:06.3f}",
            "duration_seconds": round(s["duration"], 2),
            "script_excerpt": s["text"],
            "surrounding_context": f"Surrounding narration segment at {int(s['start']//60):02d}:{s['start']%60:06.3f} explaining core thesis.",
            "explanation_objective": objective,
            "viewer_understanding": viewer_takeaway,
            "why_animation_appropriate": "Text or voiceover alone leaves structural relationships abstract; an animated visual model makes the architecture immediately graspable.",
            "proposed_visual_treatment": visual_treatment,
            "reference_search_query": search_query,
            "transition_style": transition,
            "required_assets": "Vector SVG icons, channel typography fonts, Remotion spring animation definitions",
            "status": "planned"
        })
        
    return moments

def plan_project_motion(
    project_dir: Path,
    channel_id: str = "VantaBrief",
    max_moments: int = 5
) -> Dict[str, Any]:
    """Generates plans/motion_plan.json and plans/animation_plans.md for a video project."""
    # Look in script/ first, then transcripts/
    transcript_file = None
    search_dirs = [project_dir / "script", project_dir / "transcripts"]
    for s_dir in search_dirs:
        for fname in ["transcript.json", "word-timestamps.json"]:
            cand = s_dir / fname
            if cand.exists():
                transcript_file = cand
                break
        if transcript_file:
            break
            
    if not transcript_file:
        raise FileNotFoundError(f"No transcript found in {project_dir / 'script'} or {project_dir / 'transcripts'}.")
        
    moments = analyze_transcript_for_moments(transcript_file, max_moments=max_moments)
    
    plan = {
        "project": project_dir.name,
        "channel": channel_id,
        "total_selected_moments": len(moments),
        "moments": moments
    }
    
    # Save to plans/ directory
    plans_dir = project_dir / "plans"
    plans_dir.mkdir(parents=True, exist_ok=True)
    out_file = plans_dir / "motion_plan.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(plan, f, indent=2)
        
    # Also save to timeline/ for backward compatibility if needed
    (project_dir / "timeline").mkdir(parents=True, exist_ok=True)
    with open(project_dir / "timeline" / "motion_plan.json", "w", encoding="utf-8") as f:
        json.dump(plan, f, indent=2)
        
    # Generate plans/animation_plans.md
    md_file = plans_dir / "animation_plans.md"
    lines = [
        f"# Animation Moment Plans: {project_dir.name}",
        f"**Channel**: {channel_id} | **Selected Moments**: {len(moments)}",
        "",
        "Each proposed motion graphic is selected for genuine explanatory value, not arbitrary quotas.",
        ""
    ]
    for m in moments:
        lines.extend([
            f"## [{m['id']}] {m['concept_name']}",
            f"- **Voiceover Timestamp**: `{m['start_timecode']} - {m['end_timecode']}` ({m['duration_seconds']}s)",
            f"- **Exact Narration Excerpt**: \"*{m['script_excerpt']}*\"",
            f"- **Narration Meaning**: {m['explanation_objective']}",
            f"- **Viewer Takeaway**: {m['viewer_understanding']}",
            f"- **Why Animation is Justified**: {m['why_animation_appropriate']}",
            f"- **Proposed Visual Approach**: {m['proposed_visual_treatment']}",
            f"- **Transition & Duration**: {m['transition_style']}",
            f"- **Required Assets**: {m['required_assets']}",
            ""
        ])
    with open(md_file, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
        
    print(f"\nCreated Motion Graphic Plan with {len(moments)} moments:")
    for m in moments:
        print(f"  [{m['id']}] {m['start_timecode']} - {m['end_timecode']} ({m['duration_seconds']}s): {m['concept_name']}")
    print(f"Saved JSON: {out_file}")
    print(f"Saved Markdown: {md_file}\n")
    return plan

if __name__ == "__main__":
    import sys
    proj_arg = sys.argv[1] if len(sys.argv) > 1 else "Channels/VantaBrief/videos/003-Open-Source-Is-Taking-Over-Software-in-2026"
    ch_arg = sys.argv[2] if len(sys.argv) > 2 else "VantaBrief"
    plan_project_motion(Path(proj_arg), ch_arg)
