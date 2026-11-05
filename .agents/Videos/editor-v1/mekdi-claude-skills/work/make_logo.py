import os, subprocess

CHROME = r"C:\Users\zakbi\.cache\hyperframes\chrome\chrome-headless-shell\win64-152.0.7977.30\chrome-headless-shell-win64\chrome-headless-shell.exe"
PROJECT_DIR = r"D:\Automations\motion-studio\.agents\Videos\editor-v1\mekdi-claude-skills"
IMG_DIR = os.path.join(PROJECT_DIR, "assets", "img")

# Sleek precision geometric logo for Geez Tech
# A modern tech mark: An architectural, isometric tech glyph fusing 'G' and 'T' with razor-sharp 45-degree chamfers and clean negative space.
logo_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <defs>
    <linearGradient id="gtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <linearGradient id="gtAccent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF3366"/>
      <stop offset="100%" stop-color="#C9184A"/>
    </linearGradient>
  </defs>
  <!-- Background Badge -->
  <rect width="120" height="120" rx="32" fill="#121316"/>
  <rect width="118" height="118" x="1" y="1" rx="31" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
  
  <!-- Architectural Geometric Monogram (G + T) -->
  <!-- Top Bar of T / G roof -->
  <path d="M 28 32 L 92 32 L 92 46 L 28 46 Z" fill="url(#gtGrad)"/>
  <!-- Stem of T / Spine of G -->
  <path d="M 53 46 L 67 46 L 67 88 L 53 88 Z" fill="url(#gtGrad)"/>
  <!-- G Outer Loop & Shelf -->
  <path d="M 28 46 L 42 46 L 42 74 L 78 74 L 78 60 L 64 60 L 64 50 L 92 50 L 92 88 L 28 88 Z" fill="url(#gtGrad)" fill-rule="evenodd"/>
  <!-- Precision Tech Accent Node -->
  <circle cx="85" cy="39" r="4.5" fill="url(#gtAccent)"/>
</svg>"""

svg_path = os.path.join(IMG_DIR, "geez_tech_logo.svg")
with open(svg_path, "w", encoding="utf-8") as f:
    f.write(logo_svg)

# Render logo to PNG
html = f"""<!DOCTYPE html><html><body style="margin:0;background:#0A0B0E;display:flex;align-items:center;justify-content:center;height:100vh;">
<div style="width:300px;height:300px;">
{logo_svg}
</div></body></html>"""

temp_html = os.path.join(IMG_DIR, "temp_logo.html")
out_png = os.path.join(IMG_DIR, "geez_tech_logo.png")
with open(temp_html, "w", encoding="utf-8") as f:
    f.write(html)

subprocess.run([CHROME, "--headless", "--disable-gpu", "--window-size=600,600", f"--screenshot={out_png}", temp_html], check=True)
if os.path.exists(temp_html):
    os.remove(temp_html)
print("Rendered geez_tech_logo.png")
