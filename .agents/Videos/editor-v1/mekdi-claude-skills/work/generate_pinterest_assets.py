import os, subprocess

CHROME = r"C:\Users\zakbi\.cache\hyperframes\chrome\chrome-headless-shell\win64-152.0.7977.30\chrome-headless-shell-win64\chrome-headless-shell.exe"
PROJECT_DIR = r"D:\Automations\motion-studio\.agents\Videos\editor-v1\mekdi-claude-skills"
IMG_DIR = os.path.join(PROJECT_DIR, "assets", "img")
os.makedirs(IMG_DIR, exist_ok=True)

# Common Pinterest UserBoard CSS Tokens
BASE_STYLE = """
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
    position: absolute; width: 750px; height: 750px;
    border-radius: 50%; filter: blur(120px); pointer-events: none;
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
}
.main-card {
    width: 940px; padding: 56px 52px; border-radius: 44px;
    background: linear-gradient(145deg, rgba(35, 31, 32, 0.94) 0%, rgba(20, 18, 19, 0.98) 100%);
    backdrop-filter: blur(28px);
    box-shadow: 0 35px 80px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5);
    display: flex; flex-direction: column; position: relative; z-index: 2;
}
.hero-title {
    font-size: 72px; font-weight: 900; letter-spacing: -0.03em;
    line-height: 1.1; margin-bottom: 20px;
}
.sub-caption {
    font-size: 28px; color: rgba(250, 244, 217, 0.65);
    line-height: 1.4; margin-bottom: 44px;
}
.metrics-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 32px;
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
"""

CARDS = [
    # Card 1: Office Overload & Burden (Pinterest UserBoardProgressCard style)
    {
        "name": "pb_office_burden.png",
        "html": f"""
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>{BASE_STYLE}
.volumetric-glow {{ background: rgba(239, 68, 68, 0.16); top: 30%; }}
.main-card {{ border: 1px solid rgba(239, 68, 68, 0.3); }}
.progress-container {{ width: 100%; height: 20px; background: rgba(255,255,255,0.06); border-radius: 10px; margin: 28px 0; overflow: hidden; }}
.progress-fill {{ width: 94%; height: 100%; background: linear-gradient(90deg, #F59E0B, #EF4444); border-radius: 10px; box-shadow: 0 0 20px #EF4444; }}
</style></head>
<body>
<div class="bg-ambient"></div><div class="bg-grid"></div><div class="volumetric-glow"></div>
<div class="pill-badge"><span class="status-dot" style="background:#EF4444; box-shadow:0 0 12px #EF4444"></span>01 // CRITICAL WORKLOAD FRICTION</div>
<div class="main-card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
        <span style="font-size: 24px; color: #EF4444; font-weight: 700; letter-spacing: 0.1em; text-transform:uppercase">Cognitive Fatigue</span>
        <span style="padding: 6px 18px; border-radius: 999px; background: rgba(239, 68, 68, 0.15); color: #EF4444; font-size: 24px; font-weight: 800">STATE: OVERLOAD</span>
    </div>
    <h1 class="hero-title">DEADLINES &amp; REPORT BURDEN</h1>
    <p class="sub-caption">Manual long-form writing, corporate correspondence, and report backlog create daily friction.</p>
    <div class="progress-container"><div class="progress-fill"></div></div>
    <div style="display:flex; justify-content:space-between; font-size:24px; color:rgba(250,244,217,0.7); font-weight:600; margin-bottom: 12px">
        <span>Workload Capacity: Critical</span>
        <span style="color:#EF4444; font-weight:800">94.2%</span>
    </div>
    <div class="metrics-row">
        <div class="metric-tile">
            <div class="metric-num" style="color: #EF4444">1,420+</div>
            <div class="metric-label">Unread Inquiries &amp; Emails</div>
        </div>
        <div class="metric-tile">
            <div class="metric-num" style="color: #F59E0B">18.5 hrs</div>
            <div class="metric-label">Weekly Manual Draft Toll</div>
        </div>
    </div>
</div>
</body></html>
"""
    },

    # Card 2: Claude 3.5 Sonnet Hero (Pinterest UserBoard Center Light Beam style)
    {
        "name": "pb_claude_hero.png",
        "html": f"""
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>{BASE_STYLE}
.volumetric-glow {{ background: rgba(217, 119, 87, 0.22); top: 25%; }}
.main-card {{
    border: 2px solid #D97757;
    box-shadow: 0 35px 80px rgba(0, 0, 0, 0.8), 0 0 60px rgba(217, 119, 87, 0.35);
}}
.light-beam {{
    position: absolute; bottom: -80px; left: 50%; transform: translateX(-50%);
    width: 600px; height: 160px;
    background: radial-gradient(ellipse at 50% 100%, rgba(217, 119, 87, 0.4) 0%, transparent 70%);
    filter: blur(40px); pointer-events: none;
}}
.claude-emblem {{
    width: 140px; height: 140px; margin-bottom: 24px;
    filter: drop-shadow(0 0 30px rgba(217, 119, 87, 0.7));
}}
</style></head>
<body>
<div class="bg-ambient"></div><div class="bg-grid"></div><div class="volumetric-glow"></div>
<div class="pill-badge"><span class="status-dot" style="background:#D97757; box-shadow:0 0 12px #D97757"></span>02 // ANTHROPIC CORE REVEAL</div>
<div class="main-card">
    <div class="light-beam"></div>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 24px;">
        <svg class="claude-emblem" viewBox="0 0 100 100" fill="none">
            <path d="M50 0L54 36L90 20L64 48L100 50L64 52L90 80L54 64L50 100L46 64L10 80L36 52L0 50L36 48L10 20L46 36Z" fill="#D97757"/>
        </svg>
        <span style="padding: 8px 24px; border-radius: 999px; background: rgba(217, 119, 87, 0.15); border: 1px solid #D97757; color: #D97757; font-size: 24px; font-weight: 800">CLAUDE 3.5 SONNET</span>
    </div>
    <h1 class="hero-title" style="font-size: 88px; color: #FFF">CLAUDE</h1>
    <p class="sub-caption">The state-of-the-art intelligence model engineered for precision office synthesis.</p>
    <div class="metrics-row">
        <div class="metric-tile">
            <div class="metric-num" style="color: #D97757">200K</div>
            <div class="metric-label">Token Context Window</div>
        </div>
        <div class="metric-tile">
            <div class="metric-num" style="color: #FAF4D9">#1</div>
            <div class="metric-label">Reasoning &amp; Writing Rank</div>
        </div>
        <div class="metric-tile">
            <div class="metric-num" style="color: #FAF4D9">Artifacts</div>
            <div class="metric-label">Interactive Workspaces</div>
        </div>
        <div class="metric-tile">
            <div class="metric-num" style="color: #D97757">Instant</div>
            <div class="metric-label">Executive Output Pacing</div>
        </div>
    </div>
</div>
</body></html>
"""
    },

    # Card 3: Autonomous Synthesis Suite (Long texts, emails, reports)
    {
        "name": "pb_claude_suite.png",
        "html": f"""
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>{BASE_STYLE}
.volumetric-glow {{ background: rgba(59, 130, 246, 0.18); top: 25%; }}
.main-card {{ border: 1px solid rgba(59, 130, 246, 0.3); }}
.suite-item {{
    background: rgba(250, 244, 217, 0.04); border: 1px solid rgba(250, 244, 217, 0.1);
    border-radius: 28px; padding: 28px 32px; margin-bottom: 20px;
    display: flex; align-items: center; justify-content: space-between;
}}
.suite-left {{ display: flex; align-items: center; gap: 20px; }}
.suite-icon {{ font-size: 38px; width: 64px; height: 64px; border-radius: 18px; background: rgba(59, 130, 246, 0.15); display: flex; align-items: center; justify-content: center; }}
.suite-title {{ font-size: 30px; font-weight: 800; color: #FAF4D9; margin-bottom: 4px; }}
.suite-sub {{ font-size: 20px; color: rgba(250, 244, 217, 0.55); }}
.suite-badge {{ padding: 8px 20px; border-radius: 999px; background: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; color: #10B981; font-size: 20px; font-weight: 800; }}
</style></head>
<body>
<div class="bg-ambient"></div><div class="bg-grid"></div><div class="volumetric-glow"></div>
<div class="pill-badge"><span class="status-dot" style="background:#3B82F6; box-shadow:0 0 12px #3B82F6"></span>03 // EXECUTIVE EXECUTION ENGINE</div>
<div class="main-card">
    <h1 class="hero-title" style="font-size: 68px">AUTONOMOUS OFFICE SUITE</h1>
    <p class="sub-caption">Eliminating three major production bottlenecks in one unified workflow.</p>
    <div class="suite-item">
        <div class="suite-left">
            <div class="suite-icon">📄</div>
            <div>
                <div class="suite-title">Long-Form Texts &amp; Articles</div>
                <div class="suite-sub">10+ page structured proposals &amp; documentation</div>
            </div>
        </div>
        <div class="suite-badge">SYNTHESIZED</div>
    </div>
    <div class="suite-item">
        <div class="suite-left">
            <div class="suite-icon" style="background: rgba(16, 185, 129, 0.15)">✉️</div>
            <div>
                <div class="suite-title">Professional Executive Emails</div>
                <div class="suite-sub">High-stakes corporate tone, zero defects</div>
            </div>
        </div>
        <div class="suite-badge">EXECUTIVE TONE</div>
    </div>
    <div class="suite-item" style="margin-bottom: 0">
        <div class="suite-left">
            <div class="suite-icon" style="background: rgba(168, 85, 247, 0.15)">📊</div>
            <div>
                <div class="suite-title">Comprehensive KPI Reports</div>
                <div class="suite-sub">Automated analytics, data synthesis, charts</div>
            </div>
        </div>
        <div class="suite-badge">VERIFIED</div>
    </div>
</div>
</body></html>
"""
    },

    # Card 4: Geez Tutorials Hero (Pinterest UserBoard style)
    {
        "name": "pb_geez_lab.png",
        "html": f"""
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>{BASE_STYLE}
.volumetric-glow {{ background: rgba(245, 158, 11, 0.2); top: 25%; }}
.main-card {{
    border: 2px solid rgba(245, 158, 11, 0.5);
    box-shadow: 0 35px 80px rgba(0, 0, 0, 0.8), 0 0 60px rgba(245, 158, 11, 0.25);
}}
.geez-plate {{
    width: 140px; height: 140px; border-radius: 36px;
    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 20px 50px rgba(245, 158, 11, 0.45);
    font-size: 80px; font-weight: 900; color: #181617; font-family: 'Nyala', 'Segoe UI', sans-serif;
    margin-bottom: 24px;
}}
</style></head>
<body>
<div class="bg-ambient"></div><div class="bg-grid"></div><div class="volumetric-glow"></div>
<div class="pill-badge"><span class="status-dot" style="background:#F59E0B; box-shadow:0 0 12px #F59E0B"></span>04 // GEEZ TUTORIALS AI LAB</div>
<div class="main-card">
    <div style="display:flex; justify-content:space-between; align-items:flex-start">
        <div class="geez-plate">ግ</div>
        <span style="padding: 8px 24px; border-radius: 999px; background: rgba(245, 158, 11, 0.15); border: 1px solid #F59E0B; color: #F59E0B; font-size: 24px; font-weight: 800">SYSTEMS READY</span>
    </div>
    <h1 class="hero-title" style="font-size: 78px; color: #FFF">GEEZ TUTORIALS</h1>
    <p class="sub-caption">"ምን ይሄ ብቻ እኛ Geez Tutorials ደግሞ ለተለያዩ ፐርፐዝ የሚያገለግሉላችሁን ስኪሎች አዘጋጅተንላችኋል!"</p>
    <div class="metrics-row">
        <div class="metric-tile">
            <div class="metric-num" style="color: #F59E0B">3 Packs</div>
            <div class="metric-label">Tailored Production Skills</div>
        </div>
        <div class="metric-tile">
            <div class="metric-num" style="color: #10B981">100%</div>
            <div class="metric-label">Practical Frameworks</div>
        </div>
    </div>
</div>
</body></html>
"""
    },

    # Card 5: YouTube Script Writing (APPEARS AT 0:27!) — Trio Card 1 (Pinterest UserBoardTrioCards style)
    {
        "name": "pb_skill_youtube_027.png",
        "html": f"""
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>{BASE_STYLE}
.volumetric-glow {{ background: rgba(239, 68, 68, 0.25); top: 25%; }}
.main-card {{
    border: 2px solid #EF4444;
    box-shadow: 0 35px 80px rgba(0, 0, 0, 0.8), 0 0 60px rgba(239, 68, 68, 0.35);
}}
.yt-icon {{
    width: 120px; height: 120px; border-radius: 32px;
    background: #FF0000; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 20px 50px rgba(255, 0, 0, 0.45); margin-bottom: 24px;
}}
.yt-tri {{
    width: 0; height: 0; border-top: 24px solid transparent; border-bottom: 24px solid transparent; border-left: 40px solid #FFF; margin-left: 8px;
}}
</style></head>
<body>
<div class="bg-ambient"></div><div class="bg-grid"></div><div class="volumetric-glow"></div>
<div class="pill-badge"><span class="status-dot" style="background:#FF0000; box-shadow:0 0 12px #FF0000"></span>0:27 // SKILL PACK 01</div>
<div class="main-card">
    <div style="display:flex; justify-content:space-between; align-items:flex-start">
        <div class="yt-icon"><div class="yt-tri"></div></div>
        <span style="padding: 8px 24px; border-radius: 999px; background: rgba(239, 68, 68, 0.15); border: 1px solid #EF4444; color: #EF4444; font-size: 24px; font-weight: 800">YOUTUBE SCRIPT</span>
    </div>
    <h1 class="hero-title" style="font-size: 72px">YOUTUBE SCRIPT<br>WRITING SKILL</h1>
    <p class="sub-caption">Paced specifically for high-retention technical explainers &amp; documentary edits.</p>
    
    <!-- Retention Sparkline with animated glow -->
    <div style="margin: 20px 0; padding: 24px 28px; background: rgba(0,0,0,0.3); border-radius: 24px; border: 1px solid rgba(255,255,255,0.06)">
        <div style="display:flex; justify-content:space-between; font-size:22px; color:rgba(250,244,217,0.7); margin-bottom:12px">
            <span>Audience Retention Curve</span>
            <span style="color:#EF4444; font-weight:800">↑ 85.4% Retention</span>
        </div>
        <svg width="100%" height="70" viewBox="0 0 400 70" fill="none">
            <path d="M5 25 Q 70 8, 140 22 T 260 16 T 395 8" stroke="#EF4444" stroke-width="4" stroke-linecap="round" fill="none"/>
            <path d="M5 25 Q 70 8, 140 22 T 260 16 T 395 8 L 395 70 L 5 70 Z" fill="url(#redGrad)" opacity="0.15"/>
            <defs>
                <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#EF4444"/>
                    <stop offset="100%" stop-color="#EF4444" stop-opacity="0"/>
                </linearGradient>
            </defs>
        </svg>
    </div>

    <div class="metrics-row">
        <div class="metric-tile">
            <div class="metric-num" style="color: #EF4444">+340%</div>
            <div class="metric-label">Average View Duration</div>
        </div>
        <div class="metric-tile">
            <div class="metric-num" style="color: #FAF4D9">3-Part</div>
            <div class="metric-label">Hook &amp; CTA Architecture</div>
        </div>
    </div>
</div>
</body></html>
"""
    },

    # Card 6: Graphic Design Mastery — Trio Card 2
    {
        "name": "pb_skill_design.png",
        "html": f"""
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>{BASE_STYLE}
.volumetric-glow {{ background: rgba(168, 85, 247, 0.25); top: 25%; }}
.main-card {{
    border: 2px solid #A855F7;
    box-shadow: 0 35px 80px rgba(0, 0, 0, 0.8), 0 0 60px rgba(168, 85, 247, 0.35);
}}
.design-icon-box {{
    width: 120px; height: 120px; border-radius: 32px;
    background: linear-gradient(135deg, #A855F7 0%, #6366F1 100%);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 20px 50px rgba(168, 85, 247, 0.45); font-size: 60px; margin-bottom: 24px;
}}
</style></head>
<body>
<div class="bg-ambient"></div><div class="bg-grid"></div><div class="volumetric-glow"></div>
<div class="pill-badge"><span class="status-dot" style="background:#A855F7; box-shadow:0 0 12px #A855F7"></span>SKILL PACK 02</div>
<div class="main-card">
    <div style="display:flex; justify-content:space-between; align-items:flex-start">
        <div class="design-icon-box">🎨</div>
        <span style="padding: 8px 24px; border-radius: 999px; background: rgba(168, 85, 247, 0.15); border: 1px solid #A855F7; color: #C084FC; font-size: 24px; font-weight: 800">GRAPHIC DESIGN</span>
    </div>
    <h1 class="hero-title" style="font-size: 72px">GRAPHIC DESIGNING<br>SKILL</h1>
    <p class="sub-caption">Swiss typography hierarchies, golden ratio grids, and high-CTR visual systems.</p>
    
    <div style="margin: 20px 0; padding: 24px 28px; background: rgba(0,0,0,0.3); border-radius: 24px; border: 1px solid rgba(255,255,255,0.06)">
        <div style="display:flex; justify-content:space-between; font-size:22px; color:rgba(250,244,217,0.7); margin-bottom:12px">
            <span>Click-Through Efficiency Curve</span>
            <span style="color:#C084FC; font-weight:800">↑ 98.6% Optimal CTR</span>
        </div>
        <svg width="100%" height="70" viewBox="0 0 400 70" fill="none">
            <path d="M5 45 Q 90 35, 170 18 T 300 24 T 395 10" stroke="#C084FC" stroke-width="4" stroke-linecap="round" fill="none"/>
        </svg>
    </div>

    <div class="metrics-row">
        <div class="metric-tile">
            <div class="metric-num" style="color: #C084FC">100%</div>
            <div class="metric-label">Clean Geometric Polish</div>
        </div>
        <div class="metric-tile">
            <div class="metric-num" style="color: #FAF4D9">System</div>
            <div class="metric-label">Color Palettes &amp; Tokens</div>
        </div>
    </div>
</div>
</body></html>
"""
    },

    # Card 7: Persuasive Copywriting Mastery — Trio Card 3
    {
        "name": "pb_skill_copywriting.png",
        "html": f"""
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>{BASE_STYLE}
.volumetric-glow {{ background: rgba(16, 185, 129, 0.25); top: 25%; }}
.main-card {{
    border: 2px solid #10B981;
    box-shadow: 0 35px 80px rgba(0, 0, 0, 0.8), 0 0 60px rgba(16, 185, 129, 0.35);
}}
.copy-icon-box {{
    width: 120px; height: 120px; border-radius: 32px;
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 20px 50px rgba(16, 185, 129, 0.45); font-size: 60px; margin-bottom: 24px;
}}
</style></head>
<body>
<div class="bg-ambient"></div><div class="bg-grid"></div><div class="volumetric-glow"></div>
<div class="pill-badge"><span class="status-dot" style="background:#10B981; box-shadow:0 0 12px #10B981"></span>SKILL PACK 03</div>
<div class="main-card">
    <div style="display:flex; justify-content:space-between; align-items:flex-start">
        <div class="copy-icon-box">✍️</div>
        <span style="padding: 8px 24px; border-radius: 999px; background: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; color: #34D399; font-size: 24px; font-weight: 800">COPYWRITING</span>
    </div>
    <h1 class="hero-title" style="font-size: 72px">PERSUASIVE<br>COPYWRITING SKILL</h1>
    <p class="sub-caption">AIDA, PAS, and high-converting psychological frameworks for social selling.</p>
    
    <div style="margin: 20px 0; padding: 24px 28px; background: rgba(0,0,0,0.3); border-radius: 24px; border: 1px solid rgba(255,255,255,0.06)">
        <div style="display:flex; justify-content:space-between; font-size:22px; color:rgba(250,244,217,0.7); margin-bottom:12px">
            <span>Conversion Multiplier</span>
            <span style="color:#34D399; font-weight:800">↑ 4.2x Client Inbound</span>
        </div>
        <svg width="100%" height="70" viewBox="0 0 400 70" fill="none">
            <path d="M5 50 Q 120 45, 200 28 T 320 18 T 395 5" stroke="#10B981" stroke-width="4" stroke-linecap="round" fill="none"/>
        </svg>
    </div>

    <div class="metrics-row">
        <div class="metric-tile">
            <div class="metric-num" style="color: #10B981">4.2x</div>
            <div class="metric-label">Sales &amp; DM Conversion</div>
        </div>
        <div class="metric-tile">
            <div class="metric-num" style="color: #FAF4D9">AIDA</div>
            <div class="metric-label">Tested Hook Framework</div>
        </div>
    </div>
</div>
</body></html>
"""
    },

    # Card 8: Interactive Follow CTA (Pinterest UserBoard style)
    {
        "name": "pb_follow_cta.png",
        "html": f"""
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>{BASE_STYLE}
.volumetric-glow {{ background: rgba(37, 99, 235, 0.25); top: 25%; }}
.main-card {{
    border: 2px solid rgba(37, 99, 235, 0.5);
    box-shadow: 0 35px 80px rgba(0, 0, 0, 0.8), 0 0 60px rgba(37, 99, 235, 0.35);
    text-align: center; align-items: center;
}}
.avatar-ring {{
    width: 160px; height: 160px; border-radius: 50%;
    background: linear-gradient(135deg, #F59E0B, #EF4444);
    display: flex; align-items: center; justify-content: center;
    font-size: 72px; font-weight: 900; color: #FFF;
    border: 4px solid #FFF; box-shadow: 0 16px 40px rgba(245, 158, 11, 0.4);
    margin-bottom: 24px;
}}
.btn-follow-pill {{
    background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
    color: #FFF; font-size: 36px; font-weight: 800;
    padding: 22px 72px; border-radius: 999px;
    box-shadow: 0 20px 50px rgba(37, 99, 235, 0.5);
    display: inline-flex; align-items: center; gap: 16px; margin-top: 24px;
}}
</style></head>
<body>
<div class="bg-ambient"></div><div class="bg-grid"></div><div class="volumetric-glow"></div>
<div class="pill-badge"><span class="status-dot" style="background:#2563EB; box-shadow:0 0 12px #2563EB"></span>EXCLUSIVE COMMUNITY ACCESS</div>
<div class="main-card">
    <div class="avatar-ring">ግ</div>
    <h1 class="hero-title" style="font-size: 64px; margin-bottom: 12px">@GeezTutorials ✓</h1>
    <p class="sub-caption" style="max-width: 680px">እነዚህን ስኪሎች ደግሞ ለማግኘት ፔጁን ፎሎ ማድረግ እንዳይረሳ!</p>
    <div class="btn-follow-pill">
        <span>+ FOLLOW PAGE</span>
    </div>
    <div style="margin-top: 32px; font-size: 24px; color: #38BDF8; font-weight: 600">
        🔔 Turn on notifications for instant skill drops
    </div>
</div>
</body></html>
"""
    },

    # Card 9: Comment "SKILL" in Comments
    {
        "name": "pb_comment_skill.png",
        "html": f"""
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>{BASE_STYLE}
.volumetric-glow {{ background: rgba(6, 182, 212, 0.25); top: 25%; }}
.main-card {{
    border: 2px solid #06B6D4;
    box-shadow: 0 35px 80px rgba(0, 0, 0, 0.8), 0 0 60px rgba(6, 182, 212, 0.35);
}}
.comment-composer {{
    background: rgba(0, 0, 0, 0.45); border: 1px solid rgba(250, 244, 217, 0.15);
    border-radius: 28px; padding: 36px 32px; margin: 28px 0;
}}
.input-row {{
    display: flex; align-items: center; gap: 20px;
    border-bottom: 2px solid #06B6D4; padding-bottom: 20px;
}}
.user-avatar {{
    width: 72px; height: 72px; border-radius: 50%;
    background: #0284C7; color: #FFF; font-size: 36px; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
}}
.typed-text {{
    font-size: 44px; font-weight: 800; color: #FAF4D9; letter-spacing: 0.04em;
    flex: 1; font-family: monospace;
}}
.cursor {{
    display: inline-block; width: 4px; height: 48px; background: #06B6D4;
    vertical-align: -8px; animation: blink 1s infinite;
}}
.btn-send {{
    background: #06B6D4; color: #090A0D; font-size: 26px; font-weight: 800;
    padding: 14px 32px; border-radius: 999px; display: inline-flex; align-items: center; gap: 10px;
}}
</style></head>
<body>
<div class="bg-ambient"></div><div class="bg-grid"></div><div class="volumetric-glow"></div>
<div class="pill-badge"><span class="status-dot" style="background:#06B6D4; box-shadow:0 0 12px #06B6D4"></span>05 // INSTANT ACTION</div>
<div class="main-card">
    <span style="font-size: 22px; color: #06B6D4; font-weight: 700; letter-spacing: 0.1em; text-transform:uppercase; margin-bottom: 12px">Comment Section</span>
    <h1 class="hero-title" style="font-size: 72px">WRITE "SKILL" IN<br>THE COMMENTS</h1>
    <p class="sub-caption">እንዲሁም ኮመንት ሴክሽን ላይ ስኪል ብሎ መጻፍ እንዳይረሳ።</p>
    
    <div class="comment-composer">
        <div class="input-row">
            <div class="user-avatar">M</div>
            <div class="typed-text">SKILL<span class="cursor"></span></div>
            <div class="btn-send">SEND ✈</div>
        </div>
    </div>

    <div class="metrics-row">
        <div class="metric-tile">
            <div class="metric-num" style="color: #06B6D4">Instant</div>
            <div class="metric-label">Automated Delivery</div>
        </div>
        <div class="metric-tile">
            <div class="metric-num" style="color: #10B981">Free</div>
            <div class="metric-label">Access to All 3 Packs</div>
        </div>
    </div>
</div>
</body></html>
"""
    }
]

for card in CARDS:
    out_png = os.path.join(IMG_DIR, card["name"])
    tmp_html = os.path.join(IMG_DIR, card["name"].replace(".png", ".html"))
    with open(tmp_html, "w", encoding="utf-8") as f:
        f.write(card["html"].strip())
    
    cmd = [
        CHROME,
        "--headless",
        f"--screenshot={out_png}",
        "--window-size=1080,1920",
        tmp_html
    ]
    subprocess.run(cmd, check=True)
    print(f"Generated {card['name']} -> {out_png}")
    try:
        os.remove(tmp_html)
    except Exception:
        pass

print("All Pinterest UserBoard visual cards generated successfully!")
