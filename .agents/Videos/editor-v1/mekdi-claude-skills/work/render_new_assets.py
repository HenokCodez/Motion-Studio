import os, subprocess

CHROME = r"C:\Users\zakbi\.cache\hyperframes\chrome\chrome-headless-shell\win64-152.0.7977.30\chrome-headless-shell-win64\chrome-headless-shell.exe"
PROJECT_DIR = r"D:\Automations\motion-studio\.agents\Videos\editor-v1\mekdi-claude-skills"
IMG_DIR = os.path.join(PROJECT_DIR, "assets", "img")
os.makedirs(IMG_DIR, exist_ok=True)

# 1. GEEZ TECK DYNAMIC CARD (Inspired by pin.it/4LZNI6zfI)
geez_teck_html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
    width: 1080px; height: 1920px;
    background: #080507;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #FAF4D9;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 60px; position: relative; overflow: hidden;
}
.bg-ambient {
    position: absolute; inset: 0;
    background: radial-gradient(circle at 50% 45%, #3B0813 0%, #150307 55%, #050203 100%);
}
.bg-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255, 77, 109, 0.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255, 77, 109, 0.04) 1px, transparent 1px);
    background-size: 64px 64px;
}
.glow-core {
    position: absolute; width: 800px; height: 800px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 51, 85, 0.22) 0%, rgba(220, 20, 60, 0.08) 50%, transparent 75%);
    filter: blur(80px); top: 320px;
}
.pill-tag {
    display: inline-flex; align-items: center; gap: 12px;
    padding: 12px 28px; border-radius: 999px;
    background: rgba(30, 10, 15, 0.85); backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 77, 109, 0.35);
    color: #FF758F; font-size: 22px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    box-shadow: 0 0 25px rgba(255, 77, 109, 0.25);
    margin-bottom: 30px; z-index: 5;
}
.pulse-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: #FF4D6D; box-shadow: 0 0 12px #FF4D6D;
}
.card {
    width: 940px; padding: 50px 48px; border-radius: 40px;
    background: linear-gradient(160deg, rgba(26, 8, 12, 0.94) 0%, rgba(14, 4, 7, 0.98) 100%);
    border: 1px solid rgba(255, 77, 109, 0.3);
    box-shadow: 0 40px 90px rgba(0, 0, 0, 0.85), 0 0 50px rgba(255, 77, 109, 0.15);
    display: flex; flex-direction: column; align-items: center;
    position: relative; z-index: 5;
}

/* GEEZ TECK LOGO */
.logo-container {
    display: flex; align-items: center; gap: 20px;
    margin-bottom: 40px;
}
.logo-mark {
    width: 80px; height: 80px; border-radius: 22px;
    background: linear-gradient(135deg, #FF4D6D 0%, #C9184A 50%, #590D22 100%);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 35px rgba(255, 77, 109, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.3);
    border: 1.5px solid rgba(255, 255, 255, 0.4);
}
.logo-mark svg {
    width: 48px; height: 48px; fill: none; stroke: #FFF; stroke-width: 3.5;
    stroke-linecap: round; stroke-linejoin: round;
}
.logo-text-block {
    display: flex; flex-direction: column;
}
.logo-title {
    font-size: 52px; font-weight: 900; letter-spacing: -0.02em;
    background: linear-gradient(90deg, #FFFFFF 0%, #FFB3C1 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    line-height: 1;
}
.logo-sub {
    font-size: 18px; font-weight: 700; letter-spacing: 0.16em;
    color: #FF758F; text-transform: uppercase; margin-top: 6px;
}

/* 3D ENTITY STYLED AFTER PIN 4LZNI6zfI */
.entity-stage {
    position: relative; width: 420px; height: 340px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    margin: 10px 0 35px;
}
.entity-head {
    width: 170px; height: 170px; border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #FF4D6D 0%, #C9184A 45%, #800F2F 75%, #300410 100%);
    box-shadow: 0 0 50px rgba(255, 77, 109, 0.6), inset 0 0 25px rgba(255, 200, 215, 0.4);
    position: relative; z-index: 2; margin-bottom: -15px;
    display: flex; align-items: center; justify-content: center; gap: 28px;
}
.eye {
    width: 22px; height: 34px; border-radius: 50%;
    background: #FFFFFF;
    box-shadow: 0 0 16px #FFFFFF, 0 0 28px rgba(255, 255, 255, 0.8);
}
.entity-body {
    width: 260px; height: 160px; border-radius: 130px 130px 40px 40px;
    background: radial-gradient(circle at 40% 25%, #E5383B 0%, #A4161A 50%, #660708 80%, #200305 100%);
    box-shadow: 0 0 60px rgba(229, 56, 59, 0.5), inset 0 0 30px rgba(255, 180, 190, 0.3);
    position: relative; z-index: 1;
}
.sparkle-star {
    position: absolute;
    width: 44px; height: 44px;
    filter: drop-shadow(0 0 16px #FF4D6D) drop-shadow(0 0 32px #FF758F);
}
.star-left {
    left: 20px; top: 120px; transform: scale(1.1);
}
.star-right {
    right: 25px; top: 60px; transform: scale(0.9);
}

/* SKILLS CHIPS ROW */
.skills-grid {
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;
    width: 100%; margin-top: 20px;
}
.skill-chip {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 77, 109, 0.2);
    border-radius: 20px; padding: 20px 16px; text-align: center;
}
.chip-num {
    font-size: 16px; font-weight: 800; color: #FF758F;
    letter-spacing: 0.1em; margin-bottom: 6px;
}
.chip-label {
    font-size: 20px; font-weight: 800; color: #FAF4D9;
    letter-spacing: -0.01em;
}

/* FOOTER TELEMETRY */
.telemetry-bar {
    display: flex; justify-content: space-between; align-items: center;
    width: 100%; padding-top: 28px; margin-top: 28px;
    border-top: 1px solid rgba(255, 77, 109, 0.15);
}
.tele-status {
    font-size: 20px; color: rgba(250, 244, 217, 0.6); font-weight: 600;
}
.tele-badge {
    padding: 6px 18px; border-radius: 999px;
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.35);
    color: #10B981; font-size: 18px; font-weight: 800;
    letter-spacing: 0.05em;
}
</style>
</head>
<body>
<div class="bg-ambient"></div>
<div class="bg-grid"></div>
<div class="glow-core"></div>

<div class="pill-tag"><span class="pulse-dot"></span>02 // GEEZ TECK AI LABS</div>

<div class="card">
    <div class="logo-container">
        <div class="logo-mark">
            <svg viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
        </div>
        <div class="logo-text-block">
            <span class="logo-title">GEEZ TECK</span>
            <span class="logo-sub">Engineered AI Skills</span>
        </div>
    </div>

    <div class="entity-stage">
        <!-- Star Left -->
        <svg class="sparkle-star star-left" viewBox="0 0 24 24" fill="#FF758F">
            <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z"/>
        </svg>

        <!-- 3D Avatar Shaded Sphere Head with Glowing Eyes -->
        <div class="entity-head">
            <div class="eye"></div>
            <div class="eye"></div>
        </div>
        <div class="entity-body"></div>

        <!-- Star Right -->
        <svg class="sparkle-star star-right" viewBox="0 0 24 24" fill="#FF4D6D">
            <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z"/>
        </svg>
    </div>

    <div class="skills-grid">
        <div class="skill-chip">
            <div class="chip-num">PACK 01</div>
            <div class="chip-label">YouTube Script</div>
        </div>
        <div class="skill-chip">
            <div class="chip-num">PACK 02</div>
            <div class="chip-label">Graphic Design</div>
        </div>
        <div class="skill-chip">
            <div class="chip-num">PACK 03</div>
            <div class="chip-label">Copywriting</div>
        </div>
    </div>

    <div class="telemetry-bar">
        <span class="tele-status">Active Pipeline Status</span>
        <span class="tele-badge">3 PACKS READY</span>
    </div>
</div>
</body>
</html>
"""

# 2. FAKE IG UI FOLLOW CARD (Inspired by pin.it/5Jn0vZDGG)
fake_ig_html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
    width: 1080px; height: 1920px;
    background: #0A0A0A;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #FFFFFF;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 60px; position: relative; overflow: hidden;
}
.bg-ambient {
    position: absolute; inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(30, 20, 25, 0.7) 0%, #050505 100%);
}

/* CARD CONTAINER WITH INSTAGRAM RAINBOW BORDER */
.ig-card-wrapper {
    position: relative;
    border-radius: 46px;
    padding: 4px; /* Border thickness */
    background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
    box-shadow: 0 30px 80px rgba(220, 39, 67, 0.35), 0 0 50px rgba(240, 148, 51, 0.2);
    z-index: 5;
}
.ig-card {
    width: 820px;
    background: #121212;
    border-radius: 42px;
    padding: 70px 60px;
    display: flex; flex-direction: column; align-items: center;
}

/* INSTAGRAM LOGO WORDMARK */
.ig-logo {
    font-family: 'Brush Script MT', 'Grand Hotel', cursive, sans-serif;
    font-size: 76px;
    font-weight: 500;
    letter-spacing: 0.02em;
    color: #FFFFFF;
    margin-bottom: 50px;
}

/* CIRCULAR AVATAR WITH ANIMATED GRADIENT STORY RING */
.avatar-ring-container {
    position: relative;
    width: 260px; height: 260px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 60px;
}
.story-ring {
    position: absolute; inset: 0;
    border-radius: 50%;
    border: 4px solid transparent;
    background: linear-gradient(45deg, #f09433, #dc2743, #bc1888) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    box-shadow: 0 0 25px rgba(220, 39, 67, 0.4);
}
.avatar-circle {
    width: 236px; height: 236px; border-radius: 50%;
    background: #262626;
    display: flex; align-items: center; justify-content: center;
    border: 3px solid #121212;
}
.avatar-circle svg {
    width: 110px; height: 110px; fill: #737373;
}

/* FOLLOW BUTTON */
.follow-btn {
    width: 100%; max-width: 520px;
    padding: 24px 0; border-radius: 20px;
    background: #0095F6;
    color: #FFFFFF;
    font-size: 34px; font-weight: 700;
    text-align: center;
    letter-spacing: 0.01em;
    box-shadow: 0 12px 35px rgba(0, 149, 246, 0.4);
    cursor: pointer;
}
</style>
</head>
<body>
<div class="bg-ambient"></div>

<div class="ig-card-wrapper">
    <div class="ig-card">
        <div class="ig-logo">Instagram</div>
        
        <div class="avatar-ring-container">
            <div class="story-ring"></div>
            <div class="avatar-circle">
                <svg viewBox="0 0 24 24">
                    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"/>
                </svg>
            </div>
        </div>

        <div class="follow-btn">Follow</div>
    </div>
</div>
</body>
</html>
"""

def render_html_to_png(html_str, out_path):
    temp_html = out_path.replace(".png", ".html")
    with open(temp_html, "w", encoding="utf-8") as f:
        f.write(html_str)
    
    cmd = [
        CHROME,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=1080,1920",
        f"--screenshot={out_path}",
        temp_html
    ]
    subprocess.run(cmd, check=True)
    if os.path.exists(temp_html):
        os.remove(temp_html)
    print("Rendered:", out_path)

render_html_to_png(geez_teck_html, os.path.join(IMG_DIR, "pb_geez_teck_dynamic.png"))
render_html_to_png(fake_ig_html, os.path.join(IMG_DIR, "pb_fake_ig_follow.png"))
print("Done rendering new dynamic assets!")
