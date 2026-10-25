from pathlib import Path

OUT_DIR = Path("projects/remotion-app/public/mascot")
OUT_DIR.mkdir(parents=True, exist_ok=True)

def generate_svg(pose_name, arm_elements):
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 200" width="160" height="200" shape-rendering="crispEdges">
  <filter id="white-sticker-glow" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#FFFFFF" flood-opacity="0.9"/>
  </filter>
  <g filter="url(#white-sticker-glow)">
    <!-- White Sticker Outline Base -->
    <rect x="36" y="16" width="88" height="88" rx="16" fill="#FFFFFF" />
    <rect x="44" y="96" width="72" height="74" rx="12" fill="#FFFFFF" />
    <rect x="50" y="166" width="24" height="26" rx="6" fill="#FFFFFF" />
    <rect x="86" y="166" width="24" height="26" rx="6" fill="#FFFFFF" />

    <!-- Dark Hair -->
    <rect x="42" y="22" width="76" height="34" rx="10" fill="#231F20" />
    <rect x="40" y="32" width="16" height="40" fill="#231F20" />
    <rect x="104" y="32" width="16" height="40" fill="#231F20" />

    <!-- Face Skin Tone -->
    <rect x="48" y="44" width="64" height="52" rx="8" fill="#FAD0B1" />

    <!-- Glasses (Tech Nerd look) -->
    <rect x="52" y="56" width="24" height="18" rx="4" fill="none" stroke="#231F20" stroke-width="4" />
    <rect x="84" y="56" width="24" height="18" rx="4" fill="none" stroke="#231F20" stroke-width="4" />
    <line x1="76" y1="64" x2="84" y2="64" stroke="#231F20" stroke-width="4" />

    <!-- Eyes (Glint behind glasses) -->
    <rect x="60" y="62" width="6" height="6" fill="#231F20" />
    <rect x="92" y="62" width="6" height="6" fill="#231F20" />

    <!-- Smile / Expression -->
    <rect x="74" y="82" width="12" height="4" rx="2" fill="#231F20" />

    <!-- Hoodie (Charcoal / Orange tech accent) -->
    <rect x="48" y="100" width="64" height="66" rx="10" fill="#363234" />
    <polygon points="80,100 68,124 92,124" fill="#FF6B35" />

    <!-- Legs & Shoes -->
    <rect x="54" y="168" width="16" height="20" fill="#231F20" />
    <rect x="90" y="168" width="16" height="20" fill="#231F20" />
    <rect x="50" y="184" width="22" height="10" rx="4" fill="#EDEDED" />
    <rect x="88" y="184" width="22" height="10" rx="4" fill="#EDEDED" />

    <!-- Pose-Specific Arms / Hands / Props -->
    {arm_elements}
  </g>
</svg>"""
    return svg

# 1. Idle (arms resting at sides)
idle_arms = """
<rect x="34" y="104" width="14" height="48" rx="6" fill="#363234" stroke="#FFFFFF" stroke-width="2" />
<circle cx="41" cy="154" r="8" fill="#FAD0B1" stroke="#FFFFFF" stroke-width="2" />
<rect x="112" y="104" width="14" height="48" rx="6" fill="#363234" stroke="#FFFFFF" stroke-width="2" />
<circle cx="119" cy="154" r="8" fill="#FAD0B1" stroke="#FFFFFF" stroke-width="2" />
"""

# 2. Pointing (right arm pointing up-right toward diagram)
pointing_arms = """
<rect x="34" y="104" width="14" height="48" rx="6" fill="#363234" stroke="#FFFFFF" stroke-width="2" />
<circle cx="41" cy="154" r="8" fill="#FAD0B1" stroke="#FFFFFF" stroke-width="2" />
<path d="M 112 110 L 146 76" stroke="#363234" stroke-width="14" stroke-linecap="round" />
<path d="M 112 110 L 146 76" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none" />
<circle cx="148" cy="74" r="10" fill="#FAD0B1" stroke="#FFFFFF" stroke-width="2" />
<!-- Orange indicator spark -->
<circle cx="152" cy="62" r="5" fill="#FF6B35" />
"""

# 3. Thinking (hand on chin, question mark)
thinking_arms = """
<rect x="34" y="104" width="14" height="48" rx="6" fill="#363234" stroke="#FFFFFF" stroke-width="2" />
<circle cx="41" cy="154" r="8" fill="#FAD0B1" stroke="#FFFFFF" stroke-width="2" />
<path d="M 112 120 L 96 90" stroke="#363234" stroke-width="14" stroke-linecap="round" />
<circle cx="94" cy="88" r="9" fill="#FAD0B1" stroke="#FFFFFF" stroke-width="2" />
<text x="116" y="44" font-family="'Inter', sans-serif" font-weight="900" font-size="28" fill="#FF6B35">?</text>
"""

# 4. Shrugging (both hands up & out)
shrugging_arms = """
<path d="M 48 116 L 24 100" stroke="#363234" stroke-width="14" stroke-linecap="round" />
<circle cx="22" cy="98" r="9" fill="#FAD0B1" stroke="#FFFFFF" stroke-width="2" />
<path d="M 112 116 L 136 100" stroke="#363234" stroke-width="14" stroke-linecap="round" />
<circle cx="138" cy="98" r="9" fill="#FAD0B1" stroke="#FFFFFF" stroke-width="2" />
"""

# 5. Celebrating (arms raised high)
celebrating_arms = """
<path d="M 46 110 L 26 64" stroke="#363234" stroke-width="14" stroke-linecap="round" />
<circle cx="24" cy="62" r="9" fill="#FAD0B1" stroke="#FFFFFF" stroke-width="2" />
<path d="M 114 110 L 134 64" stroke="#363234" stroke-width="14" stroke-linecap="round" />
<circle cx="136" cy="62" r="9" fill="#FAD0B1" stroke="#FFFFFF" stroke-width="2" />
"""

poses = {
    "mascot_idle.svg": idle_arms,
    "mascot_pointing.svg": pointing_arms,
    "mascot_thinking.svg": thinking_arms,
    "mascot_shrugging.svg": shrugging_arms,
    "mascot_celebrating.svg": celebrating_arms
}

for name, arms in poses.items():
    with open(OUT_DIR / name, "w", encoding="utf-8") as f:
        f.write(generate_svg(name, arms))
    print(f"Generated {name}")
