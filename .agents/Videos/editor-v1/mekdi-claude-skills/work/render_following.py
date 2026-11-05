import os, subprocess

CHROME = r"C:\Users\zakbi\.cache\hyperframes\chrome\chrome-headless-shell\win64-152.0.7977.30\chrome-headless-shell-win64\chrome-headless-shell.exe"
PROJECT_DIR = r"D:\Automations\motion-studio\.agents\Videos\editor-v1\mekdi-claude-skills"
IMG_DIR = os.path.join(PROJECT_DIR, "assets", "img")

following_html = """<!DOCTYPE html>
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

.ig-card-wrapper {
    position: relative;
    border-radius: 46px;
    padding: 4px;
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
.ig-logo {
    font-family: 'Brush Script MT', 'Grand Hotel', cursive, sans-serif;
    font-size: 76px;
    font-weight: 500;
    letter-spacing: 0.02em;
    color: #FFFFFF;
    margin-bottom: 50px;
}
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
.following-btn {
    width: 100%; max-width: 520px;
    padding: 24px 0; border-radius: 20px;
    background: #262626;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #FFFFFF;
    font-size: 34px; font-weight: 700;
    text-align: center;
    letter-spacing: 0.01em;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    display: flex; align-items: center; justify-content: center; gap: 12px;
}
.following-btn svg {
    width: 30px; height: 30px; fill: none; stroke: #FFFFFF; stroke-width: 3.5;
    stroke-linecap: round; stroke-linejoin: round;
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

        <div class="following-btn">
            Following
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
    </div>
</div>
</body>
</html>
"""

temp_html = os.path.join(IMG_DIR, "temp_following.html")
out_png = os.path.join(IMG_DIR, "pb_fake_ig_following.png")
with open(temp_html, "w", encoding="utf-8") as f:
    f.write(following_html)

subprocess.run([
    CHROME, "--headless", "--disable-gpu", "--hide-scrollbars",
    "--window-size=1080,1920", f"--screenshot={out_png}", temp_html
], check=True)
if os.path.exists(temp_html):
    os.remove(temp_html)
print("Rendered following state to:", out_png)
