import os, subprocess

CHROME = r"C:\Users\zakbi\.cache\hyperframes\chrome\chrome-headless-shell\win64-152.0.7977.30\chrome-headless-shell-win64\chrome-headless-shell.exe"
PROJECT_DIR = r"D:\Automations\motion-studio\.agents\Videos\editor-v1\mekdi-claude-skills"
IMG_DIR = os.path.join(PROJECT_DIR, "assets", "img")

thumbnail_card_html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
    width: 1080px; height: 1920px;
    background: #0C0D10;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #FAF4D9;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 60px; position: relative; overflow: hidden;
}
.bg-ambient {
    position: absolute; inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(25, 27, 34, 0.7) 0%, #090A0D 100%);
}
.bg-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(250, 244, 217, 0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(250, 244, 217, 0.03) 1px, transparent 1px);
    background-size: 72px 72px;
}
.volumetric-glow {
    position: absolute; width: 750px; height: 750px; border-radius: 50%;
    filter: blur(120px); pointer-events: none;
    background: rgba(168, 85, 247, 0.16); top: 32%;
}
.pill-badge {
    display: inline-flex; align-items: center; gap: 14px;
    padding: 12px 32px; border-radius: 999px;
    background: rgba(35, 31, 32, 0.85); backdrop-filter: blur(16px);
    border: 1px solid rgba(250, 244, 217, 0.18);
    color: #FAF4D9; font-size: 24px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); margin-bottom: 36px;
    z-index: 2;
}
.status-dot {
    width: 12px; height: 12px; border-radius: 50%;
    background: #A855F7; box-shadow: 0 0 12px #A855F7;
}
.main-card {
    width: 940px; padding: 56px 52px; border-radius: 44px;
    background: linear-gradient(145deg, rgba(35, 31, 32, 0.94) 0%, rgba(20, 18, 19, 0.98) 100%);
    backdrop-filter: blur(28px);
    border: 1px solid rgba(168, 85, 247, 0.35);
    box-shadow: 0 35px 80px rgba(0, 0, 0, 0.7), 0 0 50px rgba(168, 85, 247, 0.15);
    display: flex; flex-direction: column; position: relative; z-index: 2;
}
.icon-box {
    width: 124px; height: 124px; border-radius: 36px;
    background: linear-gradient(135deg, #A855F7, #6366F1);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 15px 40px rgba(168, 85, 247, 0.4);
    margin-bottom: 36px; font-size: 56px;
}
.hero-title {
    font-size: 72px; font-weight: 900; letter-spacing: -0.03em;
    line-height: 1.1; margin-bottom: 20px;
}
.sub-caption {
    font-size: 28px; color: rgba(250, 244, 217, 0.65);
    line-height: 1.4; margin-bottom: 44px;
}
.sparkline-box {
    background: rgba(0, 0, 0, 0.3); border-radius: 24px;
    padding: 24px 32px; margin-bottom: 32px;
}
.sparkline-meta {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 24px; font-weight: 600; margin-bottom: 16px;
}
.metrics-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
}
.metric-tile {
    background: rgba(250, 244, 217, 0.04);
    border: 1px solid rgba(250, 244, 217, 0.08);
    border-radius: 28px; padding: 28px;
}
.metric-num {
    font-size: 52px; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 6px;
}
.metric-label {
    font-size: 22px; color: rgba(250, 244, 217, 0.55); font-weight: 500;
}
</style>
</head>
<body>
<div class="bg-ambient"></div><div class="bg-grid"></div><div class="volumetric-glow"></div>
<div class="pill-badge"><span class="status-dot"></span>SKILL PACK 02</div>
<div class="main-card">
    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div class="icon-box">🖼️</div>
        <span style="padding: 10px 24px; border-radius: 999px; background: rgba(168, 85, 247, 0.15); color: #C084FC; font-size: 22px; font-weight: 800; letter-spacing: 0.08em; text-transform:uppercase">THUMBNAIL DESIGN</span>
    </div>
    <h1 class="hero-title">VIRAL THUMBNAIL SKILL</h1>
    <p class="sub-caption">High-contrast visual hierarchy, 3-element focal rule, and YouTube CTR optimization.</p>
    
    <div class="sparkline-box">
        <div class="sparkline-meta">
            <span style="color:rgba(250, 244, 217, 0.6)">Click-Through Surge (CTR)</span>
            <span style="color:#C084FC; font-weight: 800;">↑ 14.2% Verified CTR</span>
        </div>
        <svg viewBox="0 0 500 50" style="width: 100%; height: 50px; overflow: visible;">
            <path d="M 0 45 Q 120 40 240 25 T 500 5" fill="none" stroke="#A855F7" stroke-width="4" stroke-linecap="round"/>
        </svg>
    </div>

    <div class="metrics-row">
        <div class="metric-tile">
            <div class="metric-num" style="color:#C084FC">3.8x</div>
            <div class="metric-label">Impression Click Ratio</div>
        </div>
        <div class="metric-tile">
            <div class="metric-num">Focal</div>
            <div class="metric-label">Subject Isolation Rules</div>
        </div>
    </div>
</div>
</body>
</html>
"""

temp_html = os.path.join(IMG_DIR, "temp_thumb.html")
out_png = os.path.join(IMG_DIR, "pb_skill_thumbnail.png")
with open(temp_html, "w", encoding="utf-8") as f:
    f.write(thumbnail_card_html)

subprocess.run([CHROME, "--headless", "--disable-gpu", "--window-size=1080,1920", f"--screenshot={out_png}", temp_html], check=True)
if os.path.exists(temp_html):
    os.remove(temp_html)
print("Rendered pb_skill_thumbnail.png")
