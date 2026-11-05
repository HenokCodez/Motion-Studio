import os, subprocess

CHROME = r"C:\Users\zakbi\.cache\hyperframes\chrome\chrome-headless-shell\win64-152.0.7977.30\chrome-headless-shell-win64\chrome-headless-shell.exe"
PROJECT_DIR = r"D:\Automations\motion-studio\.agents\Videos\editor-v1\mekdi-claude-skills"
IMG_DIR = os.path.join(PROJECT_DIR, "assets", "img")
os.makedirs(IMG_DIR, exist_ok=True)

CARDS = [
    {
        "name": "office_overload.png",
        "html": """
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
    width: 1080px; height: 1920px;
    background: #090A0D;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #F0F3F8;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 60px;
    position: relative; overflow: hidden;
}
.bg-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
}
.glow {
    position: absolute; width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%);
    top: 30%; left: 20%; filter: blur(80px);
}
.badge {
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.4);
    color: #EF4444;
    padding: 12px 28px; border-radius: 999px;
    font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    margin-bottom: 40px; display: flex; align-items: center; gap: 12px;
}
.pulse { width: 12px; height: 12px; background: #EF4444; border-radius: 50%; box-shadow: 0 0 16px #EF4444; }
.hero-title {
    font-size: 80px; font-weight: 800; line-height: 1.1; text-align: center;
    letter-spacing: -2px; margin-bottom: 24px;
    background: linear-gradient(180deg, #FFFFFF 0%, #A0AEC0 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.sub {
    font-size: 32px; color: #8E9BAE; text-align: center; max-width: 800px;
    line-height: 1.4; margin-bottom: 70px;
}
.card-stack {
    width: 100%; max-width: 960px; display: flex; flex-direction: column; gap: 24px;
}
.metric-box {
    background: rgba(20, 24, 33, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px; padding: 32px 40px;
    display: flex; justify-content: space-between; align-items: center;
    backdrop-filter: blur(20px);
}
.metric-label { font-size: 28px; color: #94A3B8; font-weight: 500; }
.metric-val { font-size: 44px; font-weight: 800; color: #EF4444; font-family: monospace; }
.progress-track {
    width: 100%; height: 12px; background: rgba(255,255,255,0.06);
    border-radius: 6px; margin-top: 16px; overflow: hidden;
}
.progress-fill { width: 88%; height: 100%; background: linear-gradient(90deg, #F59E0B, #EF4444); border-radius: 6px; }
.quote-box {
    margin-top: 40px; padding: 28px; border-radius: 20px;
    background: rgba(255,255,255,0.02); border-left: 4px solid #EF4444;
    font-size: 26px; color: #CBD5E1; font-style: italic; line-height: 1.4;
}
</style>
</head>
<body>
<div class="bg-grid"></div>
<div class="glow"></div>
<div class="badge"><div class="pulse"></div>OFFICE WORKLOAD BURDEN</div>
<h1 class="hero-title">ENDLESS DEADLINES &amp; REPORTS</h1>
<p class="sub">The daily pressure of drafting long texts, reports, and professional correspondence.</p>
<div class="card-stack">
    <div class="metric-box">
        <div>
            <div class="metric-label">Unread Inquiries &amp; Emails</div>
            <div class="progress-track"><div class="progress-fill" style="width: 92%"></div></div>
        </div>
        <div class="metric-val">1,420+</div>
    </div>
    <div class="metric-box">
        <div>
            <div class="metric-label">Weekly Report Generation Time</div>
            <div class="progress-track"><div class="progress-fill" style="width: 78%; background: #EF4444"></div></div>
        </div>
        <div class="metric-val">18.5 hrs</div>
    </div>
    <div class="metric-box">
        <div>
            <div class="metric-label">Cognitive Fatigue &amp; Stress Level</div>
            <div class="progress-track"><div class="progress-fill" style="width: 85%; background: linear-gradient(90deg, #EAB308, #EF4444)"></div></div>
        </div>
        <div class="metric-val">HIGH</div>
    </div>
    <div class="quote-box">
        "በቢሮ ውስጥ የሚገኙ የተለያዩ ጫናዎችን እና ውጥረቶችን ለመቀነስ..."
    </div>
</div>
</body>
</html>
"""
    },
    {
        "name": "claude_hero.png",
        "html": """
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
    width: 1080px; height: 1920px;
    background: #0C0D10;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #F5F5F7;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 60px; position: relative; overflow: hidden;
}
.glow {
    position: absolute; width: 750px; height: 750px;
    background: radial-gradient(circle, rgba(217, 119, 87, 0.22) 0%, transparent 70%);
    top: 28%; filter: blur(90px);
}
.claude-star {
    width: 180px; height: 180px; margin-bottom: 50px;
    filter: drop-shadow(0 0 40px rgba(217, 119, 87, 0.6));
}
.brand-pill {
    background: rgba(217, 119, 87, 0.15);
    border: 1px solid rgba(217, 119, 87, 0.5);
    color: #D97757; padding: 14px 36px; border-radius: 999px;
    font-size: 26px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
    margin-bottom: 30px;
}
.hero-title {
    font-size: 130px; font-weight: 900; letter-spacing: -4px;
    background: linear-gradient(180deg, #FFFFFF 30%, #D97757 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin-bottom: 16px;
}
.sub-title {
    font-size: 42px; font-weight: 600; color: #C5CBD5;
    margin-bottom: 70px; letter-spacing: -0.5px;
}
.spec-grid {
    width: 100%; max-width: 940px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
}
.spec-card {
    background: rgba(26, 29, 36, 0.7);
    border: 1px solid rgba(217, 119, 87, 0.2);
    border-radius: 28px; padding: 36px 32px;
    backdrop-filter: blur(24px);
}
.spec-num { font-size: 56px; font-weight: 800; color: #D97757; margin-bottom: 8px; }
.spec-label { font-size: 26px; color: #9AA4B2; font-weight: 500; }
.tag-line {
    margin-top: 60px; font-size: 32px; color: #E5E7EB;
    font-family: Georgia, serif; font-style: italic; text-align: center;
}
</style>
</head>
<body>
<div class="glow"></div>
<svg class="claude-star" viewBox="0 0 100 100" fill="none">
    <path d="M50 0L54 36L90 20L64 48L100 50L64 52L90 80L54 64L50 100L46 64L10 80L36 52L0 50L36 48L10 20L46 36Z" fill="#D97757"/>
</svg>
<div class="brand-pill">ANTHROPIC AI ENGINE</div>
<h1 class="hero-title">CLAUDE</h1>
<div class="sub-title">Claude 3.5 Sonnet // Intelligent Partner</div>
<div class="spec-grid">
    <div class="spec-card">
        <div class="spec-num">200K</div>
        <div class="spec-label">Token Context Window</div>
    </div>
    <div class="spec-card">
        <div class="spec-num">#1</div>
        <div class="spec-label">Coding &amp; Writing Benchmark</div>
    </div>
    <div class="spec-card">
        <div class="spec-num">Instant</div>
        <div class="spec-label">Long-form Document Synthesis</div>
    </div>
    <div class="spec-card">
        <div class="spec-num">Executive</div>
        <div class="spec-label">Email &amp; Report Precision</div>
    </div>
</div>
<div class="tag-line">"ክላውድ ይባላል — የእለት ተእለት ስራዎችን የሚያቀል አዲስ AI"</div>
</body>
</html>
"""
    },
    {
        "name": "claude_doc.png",
        "html": """
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
    width: 1080px; height: 1920px;
    background: #0D0E12;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #E2E8F0;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 60px; position: relative; overflow: hidden;
}
.glow {
    position: absolute; width: 800px; height: 800px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
    top: 25%; filter: blur(100px);
}
.header-tag {
    color: #60A5FA; font-size: 24px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; margin-bottom: 24px;
}
.hero-title {
    font-size: 72px; font-weight: 800; text-align: center; margin-bottom: 50px;
    letter-spacing: -2px; color: #FFFFFF;
}
.doc-window {
    width: 100%; max-width: 960px;
    background: #181920; border: 1px solid rgba(255,255,255,0.12);
    border-radius: 28px; box-shadow: 0 40px 100px rgba(0,0,0,0.8);
    overflow: hidden;
}
.window-bar {
    background: #20222B; padding: 22px 30px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,0.08);
}
.dots { display: flex; gap: 10px; }
.dot { width: 16px; height: 16px; border-radius: 50%; }
.dot.r { background: #FF5F56; } .dot.y { background: #FFBD2E; } .dot.g { background: #27C93F; }
.bar-title { font-size: 22px; color: #94A3B8; font-weight: 600; font-family: monospace; }
.doc-body { padding: 48px 44px; }
.prompt-badge {
    background: rgba(217, 119, 87, 0.15); border: 1px solid #D97757;
    color: #D97757; padding: 12px 24px; border-radius: 12px;
    font-size: 22px; font-weight: 600; margin-bottom: 32px; display: inline-block;
}
.doc-h1 { font-size: 40px; font-weight: 800; color: #FFFFFF; margin-bottom: 20px; }
.doc-p { font-size: 26px; line-height: 1.6; color: #CBD5E1; margin-bottom: 28px; }
.doc-bullet {
    display: flex; gap: 16px; margin-bottom: 18px; font-size: 24px; color: #94A3B8; line-height: 1.5;
}
.check { color: #10B981; font-weight: 800; }
.status-pill {
    margin-top: 36px; padding: 16px 28px; border-radius: 16px;
    background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3);
    color: #10B981; font-size: 24px; font-weight: 600; display: flex; align-items: center; gap: 12px;
}
</style>
</head>
<body>
<div class="glow"></div>
<div class="header-tag">LONG-FORM SYNTHESIS</div>
<h1 class="hero-title">PREPARE LONG TEXTS &amp; ARTICLES</h1>
<div class="doc-window">
    <div class="window-bar">
        <div class="dots"><div class="dot r"></div><div class="dot y"></div><div class="dot g"></div></div>
        <div class="bar-title">claude.ai / artifacts / strategy-doc.md</div>
        <div style="font-size: 20px; color: #10B981; font-weight: 600">Generated (1.4s)</div>
    </div>
    <div class="doc-body">
        <div class="prompt-badge">USER: "Generate comprehensive 12-page executive synthesis"</div>
        <div class="doc-h1">1. Strategic Operations Architecture</div>
        <p class="doc-p">This framework establishes autonomous multi-agent synchronization, eliminating 80% of repetitive editorial tasks while maintaining verified source attribution.</p>
        <div class="doc-bullet"><span class="check">✓</span><span>Deterministic layout solving with millisecond-exact word timing</span></div>
        <div class="doc-bullet"><span class="check">✓</span><span>Context synthesis with rigorous fact-checking and referencing</span></div>
        <div class="doc-bullet"><span class="check">✓</span><span>Cohesive multi-chapter documentation structure</span></div>
        <div class="status-pill">
            <span>⚡ Ready for export — 4,850 words synthesized flawlessly</span>
        </div>
    </div>
</div>
</body>
</html>
"""
    },
    {
        "name": "claude_email.png",
        "html": """
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
    width: 1080px; height: 1920px;
    background: #0A0D14;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #F8FAFC;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 60px; position: relative; overflow: hidden;
}
.glow {
    position: absolute; width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
    top: 30%; filter: blur(90px);
}
.header-tag {
    color: #34D399; font-size: 24px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; margin-bottom: 24px;
}
.hero-title {
    font-size: 76px; font-weight: 800; text-align: center; margin-bottom: 50px;
    letter-spacing: -2px; color: #FFFFFF;
}
.email-card {
    width: 100%; max-width: 960px;
    background: #151922; border: 1px solid rgba(255,255,255,0.12);
    border-radius: 28px; padding: 48px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.85);
}
.meta-row {
    display: flex; align-items: center; margin-bottom: 20px; font-size: 26px;
    border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 18px;
}
.meta-lbl { width: 140px; color: #64748B; font-weight: 600; }
.meta-val { color: #E2E8F0; font-weight: 500; }
.subj { color: #38BDF8; font-weight: 700; }
.email-body { margin-top: 36px; font-size: 26px; line-height: 1.6; color: #CBD5E1; }
.salutation { font-weight: 700; color: #FFF; margin-bottom: 20px; }
.p-block { margin-bottom: 24px; }
.sig { margin-top: 36px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px; color: #94A3B8; font-size: 22px; }
.badge-verified {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(16, 185, 129, 0.15); border: 1px solid #10B981;
    color: #10B981; padding: 10px 20px; border-radius: 999px; font-size: 20px; font-weight: 700;
    margin-top: 24px;
}
</style>
</head>
<body>
<div class="glow"></div>
<div class="header-tag">PROFESSIONAL CORRESPONDENCE</div>
<h1 class="hero-title">POLISHED EXECUTIVE EMAILS</h1>
<div class="email-card">
    <div class="meta-row">
        <span class="meta-lbl">To:</span>
        <span class="meta-val">Board of Directors &lt;board@enterprise.com&gt;</span>
    </div>
    <div class="meta-row">
        <span class="meta-lbl">Subject:</span>
        <span class="meta-val subj">Q3 Performance Update &amp; Strategic Milestones</span>
    </div>
    <div class="email-body">
        <div class="salutation">Dear Executive Leadership,</div>
        <div class="p-block">I am pleased to share our Q3 operational summary. Through the deployment of our automated workflow architectures, our department has achieved a 42% reduction in delivery turnaround times while maintaining zero quality defects.</div>
        <div class="p-block">Attached you will find the complete financial and operational breakdown for your review ahead of Thursday's plenary session.</div>
        <div class="sig">
            Warm regards,<br>
            <strong style="color: #FFF">Mekdes T.</strong> — Head of Operations<br>
            <span style="color: #64748B">Drafted with Claude AI Precision</span>
        </div>
        <div class="badge-verified">✓ TONE: EXECUTIVE &amp; PERSUASIVE</div>
    </div>
</div>
</body>
</html>
"""
    },
    {
        "name": "claude_report.png",
        "html": """
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
    width: 1080px; height: 1920px;
    background: #0B0E14;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #F8FAFC;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 60px; position: relative; overflow: hidden;
}
.glow {
    position: absolute; width: 800px; height: 800px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.16) 0%, transparent 70%);
    top: 25%; filter: blur(100px);
}
.header-tag {
    color: #C084FC; font-size: 24px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; margin-bottom: 24px;
}
.hero-title {
    font-size: 80px; font-weight: 800; text-align: center; margin-bottom: 60px;
    letter-spacing: -2px; color: #FFFFFF;
}
.report-grid {
    width: 100%; max-width: 960px; display: flex; flex-direction: column; gap: 24px;
}
.kpi-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.kpi-card {
    background: rgba(22, 27, 38, 0.85); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 24px; padding: 36px 32px; backdrop-filter: blur(20px);
}
.kpi-num { font-size: 64px; font-weight: 900; color: #A855F7; margin-bottom: 8px; }
.kpi-label { font-size: 24px; color: #94A3B8; font-weight: 500; }
.kpi-trend { font-size: 20px; color: #10B981; font-weight: 700; margin-top: 10px; }
.chart-box {
    background: rgba(22, 27, 38, 0.85); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 28px; padding: 44px; backdrop-filter: blur(20px);
}
.chart-title { font-size: 30px; font-weight: 700; margin-bottom: 28px; color: #FFF; }
.bars { display: flex; gap: 20px; height: 260px; align-items: flex-end; padding-bottom: 20px; }
.bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; }
.bar {
    width: 100%; border-radius: 12px 12px 0 0;
    background: linear-gradient(180deg, #C084FC, #7E22CE);
    transition: height 1s;
}
.bar-lbl { margin-top: 14px; font-size: 22px; color: #94A3B8; font-family: monospace; }
</style>
</head>
<body>
<div class="glow"></div>
<div class="header-tag">COMPREHENSIVE ANALYTICS</div>
<h1 class="hero-title">EXECUTIVE &amp; RESEARCH REPORTS</h1>
<div class="report-grid">
    <div class="kpi-row">
        <div class="kpi-card">
            <div class="kpi-num">98.4%</div>
            <div class="kpi-label">Report Accuracy Rate</div>
            <div class="kpi-trend">↑ +14.2% YoY</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-num">3.5x</div>
            <div class="kpi-label">Turnaround Acceleration</div>
            <div class="kpi-trend">↑ Instant Synthesis</div>
        </div>
    </div>
    <div class="chart-box">
        <div class="chart-title">Quarterly Office Efficiency Metrics</div>
        <div class="bars">
            <div class="bar-col"><div class="bar" style="height: 35%"></div><div class="bar-lbl">Q1</div></div>
            <div class="bar-col"><div class="bar" style="height: 52%"></div><div class="bar-lbl">Q2</div></div>
            <div class="bar-col"><div class="bar" style="height: 74%"></div><div class="bar-lbl">Q3</div></div>
            <div class="bar-col"><div class="bar" style="height: 96%; background: linear-gradient(180deg, #10B981, #059669)"></div><div class="bar-lbl">AI Q4</div></div>
        </div>
    </div>
</div>
</body>
</html>
"""
    },
    {
        "name": "geez_tutorials.png",
        "html": """
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
    width: 1080px; height: 1920px;
    background: #090B10;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #F8FAFC;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 60px; position: relative; overflow: hidden;
}
.glow {
    position: absolute; width: 850px; height: 850px;
    background: radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, transparent 70%);
    top: 25%; filter: blur(100px);
}
.geez-logo-box {
    width: 180px; height: 180px; border-radius: 40px;
    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 20px 60px rgba(245, 158, 11, 0.4);
    margin-bottom: 40px;
}
.geez-char { font-size: 96px; font-weight: 900; color: #000; font-family: "Nyala", "Segoe UI", sans-serif; }
.badge {
    background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.5);
    color: #F59E0B; padding: 12px 32px; border-radius: 999px;
    font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    margin-bottom: 28px;
}
.hero-title {
    font-size: 88px; font-weight: 900; text-align: center; margin-bottom: 20px;
    letter-spacing: -2px; color: #FFFFFF;
}
.sub-title {
    font-size: 34px; color: #94A3B8; text-align: center; max-width: 820px;
    line-height: 1.4; margin-bottom: 60px;
}
.pill-list {
    width: 100%; max-width: 900px; display: flex; flex-direction: column; gap: 20px;
}
.pill-item {
    background: rgba(20, 24, 34, 0.8); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px; padding: 28px 36px;
    display: flex; align-items: center; justify-content: space-between;
}
.pill-txt { font-size: 30px; font-weight: 700; color: #FFF; }
.pill-sub { font-size: 20px; color: #F59E0B; font-weight: 600; }
</style>
</head>
<body>
<div class="glow"></div>
<div class="geez-logo-box"><div class="geez-char">ግ</div></div>
<div class="badge">EXCLUSIVE AI SKILLS PACKS</div>
<h1 class="hero-title">GEEZ TUTORIALS</h1>
<div class="sub-title">"እኛ Geez Tutorials ደግሞ ለተለያዩ ፐርፐዝ የሚያገለግሉላችሁን ስኪሎች አዘጋጅተንላችኋል!"</div>
<div class="pill-list">
    <div class="pill-item">
        <span class="pill-txt">🎥 YouTube Script Writing</span>
        <span class="pill-sub">SKILL PACK 01</span>
    </div>
    <div class="pill-item">
        <span class="pill-txt">🎨 Graphic Designing</span>
        <span class="pill-sub">SKILL PACK 02</span>
    </div>
    <div class="pill-item">
        <span class="pill-txt">✍️ Copywriting Mastery</span>
        <span class="pill-sub">SKILL PACK 03</span>
    </div>
</div>
</body>
</html>
"""
    },
    {
        "name": "skill_youtube.png",
        "html": """
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
    width: 1080px; height: 1920px;
    background: #0B0C10;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #F8FAFC;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 60px; position: relative; overflow: hidden;
}
.glow {
    position: absolute; width: 800px; height: 800px;
    background: radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%);
    top: 25%; filter: blur(100px);
}
.yt-icon {
    width: 140px; height: 140px; border-radius: 36px;
    background: #FF0000; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 20px 60px rgba(255, 0, 0, 0.45); margin-bottom: 36px;
}
.yt-tri {
    width: 0; height: 0;
    border-top: 28px solid transparent;
    border-bottom: 28px solid transparent;
    border-left: 48px solid #FFF;
    margin-left: 10px;
}
.badge {
    background: rgba(239, 68, 68, 0.15); border: 1px solid #EF4444;
    color: #EF4444; padding: 12px 32px; border-radius: 999px;
    font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    margin-bottom: 24px;
}
.hero-title {
    font-size: 78px; font-weight: 900; text-align: center; margin-bottom: 40px;
    letter-spacing: -2px; color: #FFFFFF; line-height: 1.1;
}
.feature-card {
    width: 100%; max-width: 920px;
    background: rgba(24, 26, 34, 0.85); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 28px; padding: 44px; backdrop-filter: blur(20px);
}
.f-row { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 26px; }
.f-icon { font-size: 34px; }
.f-text h3 { font-size: 32px; font-weight: 700; color: #FFF; margin-bottom: 6px; }
.f-text p { font-size: 24px; color: #94A3B8; line-height: 1.4; }
</style>
</head>
<body>
<div class="glow"></div>
<div class="yt-icon"><div class="yt-tri"></div></div>
<div class="badge">SKILL PACK 01</div>
<h1 class="hero-title">YOUTUBE SCRIPT<br>WRITING SKILL</h1>
<div class="feature-card">
    <div class="f-row">
        <div class="f-icon">🎯</div>
        <div class="f-text">
            <h3>Viral Hook Architecture</h3>
            <p>Captures 85%+ retention in the first 5 seconds with psychological intrigue.</p>
        </div>
    </div>
    <div class="f-row">
        <div class="f-icon">⚡</div>
        <div class="f-text">
            <h3>Pacing &amp; Pattern Interrupts</h3>
            <p>Every beat mapped with b-roll, graphics, and sound design triggers.</p>
        </div>
    </div>
    <div class="f-row" style="margin-bottom: 0">
        <div class="f-icon">🚀</div>
        <div class="f-text">
            <h3>High-Converting CTAs</h3>
            <p>Drives exponential comment and subscriber conversion rates.</p>
        </div>
    </div>
</div>
</body>
</html>
"""
    },
    {
        "name": "skill_design.png",
        "html": """
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
    width: 1080px; height: 1920px;
    background: #0B0C12;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #F8FAFC;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 60px; position: relative; overflow: hidden;
}
.glow {
    position: absolute; width: 800px; height: 800px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, transparent 70%);
    top: 25%; filter: blur(100px);
}
.design-icon {
    width: 140px; height: 140px; border-radius: 36px;
    background: linear-gradient(135deg, #A855F7 0%, #6366F1 100%);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 20px 60px rgba(168, 85, 247, 0.45); margin-bottom: 36px;
    font-size: 64px;
}
.badge {
    background: rgba(168, 85, 247, 0.15); border: 1px solid #A855F7;
    color: #C084FC; padding: 12px 32px; border-radius: 999px;
    font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    margin-bottom: 24px;
}
.hero-title {
    font-size: 78px; font-weight: 900; text-align: center; margin-bottom: 40px;
    letter-spacing: -2px; color: #FFFFFF; line-height: 1.1;
}
.feature-card {
    width: 100%; max-width: 920px;
    background: rgba(24, 26, 36, 0.85); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 28px; padding: 44px; backdrop-filter: blur(20px);
}
.f-row { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 26px; }
.f-icon { font-size: 34px; }
.f-text h3 { font-size: 32px; font-weight: 700; color: #FFF; margin-bottom: 6px; }
.f-text p { font-size: 24px; color: #94A3B8; line-height: 1.4; }
</style>
</head>
<body>
<div class="glow"></div>
<div class="design-icon">🎨</div>
<div class="badge">SKILL PACK 02</div>
<h1 class="hero-title">GRAPHIC DESIGNING<br>SKILL</h1>
<div class="feature-card">
    <div class="f-row">
        <div class="f-icon">📐</div>
        <div class="f-text">
            <h3>Visual Hierarchy &amp; Grid</h3>
            <p>Golden-ratio layouts, Swiss typography scale, and negative space mastery.</p>
        </div>
    </div>
    <div class="f-row">
        <div class="f-icon">🌈</div>
        <div class="f-text">
            <h3>Harmonious Color Theory</h3>
            <p>Tailored HSL palettes, vibrant dark modes, and cinematic grading tokens.</p>
        </div>
    </div>
    <div class="f-row" style="margin-bottom: 0">
        <div class="f-icon">🖼️</div>
        <div class="f-text">
            <h3>Thumbnail &amp; Asset Creation</h3>
            <p>High CTR visual assets designed for maximum mobile feed impact.</p>
        </div>
    </div>
</div>
</body>
</html>
"""
    },
    {
        "name": "skill_copywriting.png",
        "html": """
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
    width: 1080px; height: 1920px;
    background: #080D11;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #F8FAFC;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 60px; position: relative; overflow: hidden;
}
.glow {
    position: absolute; width: 800px; height: 800px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%);
    top: 25%; filter: blur(100px);
}
.copy-icon {
    width: 140px; height: 140px; border-radius: 36px;
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 20px 60px rgba(16, 185, 129, 0.45); margin-bottom: 36px;
    font-size: 64px;
}
.badge {
    background: rgba(16, 185, 129, 0.15); border: 1px solid #10B981;
    color: #34D399; padding: 12px 32px; border-radius: 999px;
    font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    margin-bottom: 24px;
}
.hero-title {
    font-size: 78px; font-weight: 900; text-align: center; margin-bottom: 40px;
    letter-spacing: -2px; color: #FFFFFF; line-height: 1.1;
}
.feature-card {
    width: 100%; max-width: 920px;
    background: rgba(18, 27, 29, 0.85); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 28px; padding: 44px; backdrop-filter: blur(20px);
}
.f-row { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 26px; }
.f-icon { font-size: 34px; }
.f-text h3 { font-size: 32px; font-weight: 700; color: #FFF; margin-bottom: 6px; }
.f-text p { font-size: 24px; color: #94A3B8; line-height: 1.4; }
</style>
</head>
<body>
<div class="glow"></div>
<div class="copy-icon">✍️</div>
<div class="badge">SKILL PACK 03</div>
<h1 class="hero-title">PERSUASIVE<br>COPYWRITING SKILL</h1>
<div class="feature-card">
    <div class="f-row">
        <div class="f-icon">💰</div>
        <div class="f-text">
            <h3>AIDA &amp; PAS Frameworks</h3>
            <p>Proven psychological copy structures turning casual readers into clients.</p>
        </div>
    </div>
    <div class="f-row">
        <div class="f-icon">🔥</div>
        <div class="f-text">
            <h3>Sales Letters &amp; Ad Copy</h3>
            <p>High-converting hooks, bullet points, and irresistible offer framing.</p>
        </div>
    </div>
    <div class="f-row" style="margin-bottom: 0">
        <div class="f-icon">🤝</div>
        <div class="f-text">
            <h3>Cold Outreach Templates</h3>
            <p>Executive emails with 40%+ reply rates in corporate B2B environments.</p>
        </div>
    </div>
</div>
</body>
</html>
"""
    },
    {
        "name": "follow_cta.png",
        "html": """
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
    width: 1080px; height: 1920px;
    background: #0B0D14;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #F8FAFC;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 60px; position: relative; overflow: hidden;
}
.glow {
    position: absolute; width: 800px; height: 800px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%);
    top: 25%; filter: blur(100px);
}
.profile-card {
    width: 100%; max-width: 900px;
    background: rgba(22, 27, 38, 0.9); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 36px; padding: 56px 48px; text-align: center;
    box-shadow: 0 40px 100px rgba(0,0,0,0.8);
    display: flex; flex-direction: column; align-items: center;
}
.avatar {
    width: 180px; height: 180px; border-radius: 50%;
    background: linear-gradient(135deg, #F59E0B, #EF4444);
    display: flex; align-items: center; justify-content: center;
    font-size: 80px; font-weight: 900; color: #FFF;
    border: 4px solid #FFF; box-shadow: 0 16px 40px rgba(245, 158, 11, 0.4);
    margin-bottom: 28px;
}
.handle { font-size: 48px; font-weight: 800; color: #FFF; margin-bottom: 12px; }
.bio { font-size: 26px; color: #94A3B8; max-width: 650px; line-height: 1.4; margin-bottom: 48px; }
.btn-follow {
    background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
    color: #FFF; font-size: 38px; font-weight: 800;
    padding: 24px 80px; border-radius: 999px;
    box-shadow: 0 20px 50px rgba(37, 99, 235, 0.5);
    display: flex; align-items: center; gap: 16px;
    margin-bottom: 32px;
}
.notification-hint {
    font-size: 24px; color: #38BDF8; font-weight: 600;
}
</style>
</head>
<body>
<div class="glow"></div>
<div class="profile-card">
    <div class="avatar">ግ</div>
    <div class="handle">@GeezTutorials ✓</div>
    <div class="bio">AI Systems, Motion Graphics &amp; High-Leverage Skills for Amharic Creators</div>
    <div class="btn-follow">
        <span>+ FOLLOW PAGE</span>
    </div>
    <div class="notification-hint">🔔 Turn on notifications for the latest AI tools</div>
</div>
</body>
</html>
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

print("All visual cards generated successfully!")
