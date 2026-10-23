"""
Automated Asset Finder & Media Ratio Auditor.
Scans transcript or storyboard, matches entities to assets/index.json,
and generates manifests/missing-assets.md if any entity lacks media.
"""

import sys
import os
import json
import argparse
from pathlib import Path

# Known entity dictionary mapping tech terms to asset catalog categories & IDs
ENTITY_MAP = {
    "altman": {"type": "people", "id": "sam_altman", "name": "Sam Altman"},
    "linus": {"type": "people", "id": "linus_torvalds", "name": "Linus Torvalds"},
    "torvalds": {"type": "people", "id": "linus_torvalds", "name": "Linus Torvalds"},
    "nadella": {"type": "people", "id": "satya_nadella", "name": "Satya Nadella"},
    "gates": {"type": "people", "id": "bill_gates", "name": "Bill Gates"},
    "jensen": {"type": "people", "id": "jensen_huang", "name": "Jensen Huang"},
    "huang": {"type": "people", "id": "jensen_huang", "name": "Jensen Huang"},
    "zuckerberg": {"type": "people", "id": "mark_zuckerberg", "name": "Mark Zuckerberg"},
    
    "davinci": {"type": "screenshots", "id": "davinci_resolve", "logo": "davinci"},
    "blender": {"type": "screenshots", "id": "blender_3d", "logo": "blender"},
    "supabase": {"type": "screenshots", "id": "supabase_repo", "logo": "supabase"},
    "kokoro": {"type": "screenshots", "id": "kokoro_tts"},
    "krea": {"type": "screenshots", "id": "krea_ai"},
    "anthropic": {"type": "screenshots", "id": "anthropic_blog"},
    
    "nvidia": {"type": "logos", "id": "nvidia"},
    "openai": {"type": "logos", "id": "openai"},
    "apple": {"type": "logos", "id": "apple"},
    "microsoft": {"type": "logos", "id": "microsoft"},
    "python": {"type": "logos", "id": "python"},
    "docker": {"type": "logos", "id": "docker"},
    "red hat": {"type": "logos", "id": "redhat"},
    "redhat": {"type": "logos", "id": "redhat"},
    "linux": {"type": "logos", "id": "tux"},
    "photoshop": {"type": "logos", "id": "photoshop"},
    "premiere": {"type": "logos", "id": "premiere"},
    "firebase": {"type": "logos", "id": "firebase"},
    
    "money": {"type": "memes", "id": "falling_dollar"},
    "cash": {"type": "memes", "id": "falling_dollar"},
    "tax": {"type": "memes", "id": "falling_dollar"},
    "bill": {"type": "memes", "id": "falling_dollar"}
}

def audit_project_assets(project_dir: str):
    p_dir = Path(project_dir).resolve()
    catalog_path = Path("assets/index.json").resolve()
    
    if not catalog_path.exists():
        print(f"[ERROR] Asset catalog missing: {catalog_path}")
        return False

    with open(catalog_path, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    # Flatten available catalog paths
    available_ids = set()
    for cat in ["people", "memes", "screenshots", "logos", "sfx"]:
        for item in catalog.get(cat, []):
            available_ids.add(item["id"])

    # Read project storyboard or transcript
    storyboard_file = p_dir / "timeline" / "storyboard.json"
    transcript_file = p_dir / "transcripts" / "aligned_script.json"

    matched_assets = []
    missing_assets = []

    text_to_scan = ""
    if storyboard_file.exists():
        with open(storyboard_file, "r", encoding="utf-8") as f:
            beats = json.load(f)
            for b in beats:
                text_to_scan += " " + b.get("spokenWords", "")
    elif transcript_file.exists():
        with open(transcript_file, "r", encoding="utf-8") as f:
            paragraphs = json.load(f)
            for p in paragraphs:
                text_to_scan += " " + p.get("text", "")
    else:
        print("[WARNING] Neither storyboard.json nor aligned_script.json found.")
        return False

    text_lower = text_to_scan.lower()

    for keyword, info in ENTITY_MAP.items():
        if keyword in text_lower:
            asset_id = info["id"]
            if asset_id in available_ids:
                matched_assets.append({"keyword": keyword, "type": info["type"], "id": asset_id})
            else:
                missing_assets.append({"keyword": keyword, "type": info["type"], "id": asset_id})

    # Write missing assets report
    manifest_dir = p_dir / "manifests"
    manifest_dir.mkdir(parents=True, exist_ok=True)
    report_file = manifest_dir / "missing-assets.md"

    with open(report_file, "w", encoding="utf-8") as f:
        f.write("# Asset Audit & Missing Media Report\n\n")
        f.write(f"- **Total Matched Real Assets**: {len(matched_assets)}\n")
        f.write(f"- **Missing Assets Needing Sourcing**: {len(missing_assets)}\n\n")
        
        if missing_assets:
            f.write("## ⚠️ Missing Assets Requiring Download / Capture\n\n")
            f.write("| Keyword | Asset Type | Target ID | Action Required |\n")
            f.write("| :--- | :--- | :--- | :--- |\n")
            for m in missing_assets:
                f.write(f"| `{m['keyword']}` | `{m['type']}` | `{m['id']}` | Source asset & place in `assets/{m['type']}/` |\n")
        else:
            f.write("## ✅ All Required Entities Matched to Real Assets\n\n")
            f.write("Every key person, site, and software tool mentioned in the voiceover has a verified real-world media asset.\n")

    print(f"[OK] Asset audit complete: {len(matched_assets)} matched, {len(missing_assets)} missing. Written to {report_file}")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Audit and find assets for a video project")
    parser.add_argument("project_dir", help="Project path or title")
    args = parser.parse_args()

    audit_project_assets(args.project_dir)
