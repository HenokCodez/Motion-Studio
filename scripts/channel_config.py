#!/usr/bin/env python3
"""
Motion Studio Channel Configuration Loader
Dynamically loads brand palettes, typography, motion easing, and style rules
for any configured channel (VantaBrief, HanaVanta, or custom channels).
"""
import json
import os
from pathlib import Path
from typing import Dict, Any, Optional

STUDIO_ROOT = Path(__file__).resolve().parent.parent

def load_channel(channel_id: str = "VantaBrief") -> Dict[str, Any]:
    """Load channel configuration from Channels/<channel_id>/channel.json."""
    channel_dir = STUDIO_ROOT / "Channels" / channel_id
    config_file = channel_dir / "channel.json"
    
    if not config_file.exists():
        # Fallback search case-insensitively
        channels_dir = STUDIO_ROOT / "Channels"
        match = None
        for cd in channels_dir.iterdir():
            if cd.is_dir() and cd.name.lower() == channel_id.lower():
                match = cd / "channel.json"
                break
        if match and match.exists():
            config_file = match
        else:
            raise FileNotFoundError(
                f"Channel '{channel_id}' not found at {config_file}. "
                f"Available channels: {[d.name for d in channels_dir.iterdir() if d.is_dir()]}"
            )
            
    with open(config_file, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    return data

def get_channel_style_tokens(channel_id: str = "VantaBrief") -> Dict[str, Any]:
    """Extract standard design tokens (colors, fonts, springs) for Remotion/Manim."""
    cfg = load_channel(channel_id)
    style = cfg.get("style", {})
    palette = style.get("palette", {})
    typography = style.get("typography", {})
    motion = style.get("motion", {})
    
    return {
        "channel_id": cfg.get("id", channel_id),
        "channel_name": cfg.get("name", channel_id),
        "colors": {
            "background": palette.get("background", "#0F172A"),
            "surface": palette.get("surface", "#1E293B"),
            "primary": palette.get("primary", "#3B82F6"),
            "accent": palette.get("accent", "#10B981"),
            "text_primary": palette.get("text_primary", "#F8FAFC"),
            "text_muted": palette.get("text_muted", "#94A3B8"),
            "border": palette.get("border", "rgba(255, 255, 255, 0.1)"),
        },
        "typography": {
            "headline": typography.get("display_headline") or typography.get("heading_font", "Inter"),
            "body": typography.get("body_font") or typography.get("body_fallback", "Inter"),
            "code": typography.get("technical_code") or typography.get("mono_font", "monospace"),
        },
        "motion": motion,
        "style_bible": cfg.get("style_bible")
    }

if __name__ == "__main__":
    import sys
    ch = sys.argv[1] if len(sys.argv) > 1 else "VantaBrief"
    tokens = get_channel_style_tokens(ch)
    print(json.dumps(tokens, indent=2))
