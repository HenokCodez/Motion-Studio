"""build.py — Editor V1 edit for Mekdi Host (Claude AI & Geez Tech Skills)
Keyed to the speaker's verified word onsets and user's exact timestamps:
- 0:00 - 0:03.38: Talking head with Top Text Animation Layout 1 (Glass Pill + Headline)
- 0:03.38 - 0:07.64: Office burden tile reveal & still
- 0:07.64 - 0:10: Claude Hero with silky smooth seamless zoom/dissolve transition (no harsh flash/impact)
- 0:10 - 0:13: Talking head with Top Text Animation Layout 2 (Cyber-Ruler HUD Layout)
- 0:13 - 0:17.56: Dynamic, living Motion Graphics (Claude Intelligent Workspace: 3 animated cards:
  Long-form synthesizer with progress bar, Executive email generator, and KPI report graph)
- 0:17.56 - 0:21: Talking head with Top Text Animation Layout 3 (Workflow Upgrade + 80% Time Saved)
- 0:21 - 0:23: Geez Tech dynamic animated figure with real non-AI logo & animated head at 0:22
- 0:23 - 0:26: Talking head with Top Text Animation Layout 4 (3 Skill Ticker Chips popping sequentially)
- 0:26 - 0:28: YouTube Script Writing skill
- 0:28 - 0:29: Viral Thumbnail skill
- 0:29 - 0:30: Persuasive Copywriting skill
- 0:30 - 0:35: Talking head with Top Text Animation Layout 5 (Step-1 Action Banner with bouncing down-arrow)
- 0:35 - 0:37: 3D animated Instagram card with real Geez Tech logo on profile, 3D hover, and animated follow click
- 0:37 - 38.85: Interactive comment "SKILL" typing animation
- Captions completely removed, music bed volume low and soft, rich sound design.
"""
import json, os, sys

KIT = json.load(open('kit.json'))['skill']
sys.path.insert(0, os.path.join(KIT, 'components'))
from ev1_more import *
set_vertical()  # 9:16 Vertical Short (1080x1920)
W, H = 1080, 1920

PASS = int(os.environ.get('PASS', '1'))
FINAL = os.environ.get('FINAL') == '1'

VO_END = 38.85
DUR = fr(VO_END + 1.0)  # ~39.85s master duration

A = json.load(open('work/assets.json')) if os.path.exists('work/assets.json') else {}
c = Comp(DUR)
F1 = 1 / FPS
SHOTS = []

def shot(t0, t1, name):
    SHOTS.append((fr(t0), fr(t1), name))

def face(t0, t1, punch=None, z=1):
    """The speaker on camera, RAW (no grade, no B&W, no vignette)."""
    v = broll(c, t0, t1, 'assets/media/cam_raw.mp4', z=z, rate=0.012, media_start=fr(t0),
              punches=[punch] if punch else ())
    shot(t0, t1, 'face')
    return v

# Real Geez Tech Logo SVG
LOGO_SVG = open('assets/img/geez_tech_logo.svg', encoding='utf-8').read()

# ============================================================ CUSTOM ANIMATED COMPONENTS

# --- Smooth Hero Transition (Replaces harsh flash at 0:07)
def smooth_hero(c, t0, t1, src, z=1, size=(1080, 1920)):
    """Silky smooth zoom-in reveal without harsh white flash or jarring cuts."""
    iid = c.uid('img_hero')
    w, h = size
    inner = (f'<div class="ev1-layer" style="overflow:hidden">'
             f'<img id="{iid}" src="{src}" style="position:absolute;left:{(W - w) // 2}px;top:{(H - h) // 2}px;'
             f'width:{w}px;height:{h}px;transform-origin:50% 50%">'
             f'</div>')
    cid = c.clip(t0, t1, inner, z)
    c.pre.append(f'gsap.set("#{iid}",{{scale:1.12,opacity:0}});')
    c.at(f'tl.to("#{iid}",{{scale:1.04,opacity:1,duration:0.35,ease:"power2.out"}},{fr(t0):.4f});')
    c.at(f'tl.to("#{iid}",{{scale:1.08,duration:{fr(t1) - fr(t0) - 0.35:.4f},ease:"none"}},{fr(t0) + 0.35:.4f});')
    return cid

# --- Viral Short Kinetic Text Component (NO BOX, Floating Viral Typography)
def viral_text_overlay(c, t0, t1, line1, line2, theme='cyan', pos='stomach', top_offset=None, z=15):
    """Viral Short kinetic typography matching reference showcase:
    - Pure floating text with heavy stroke and multi-layer drop shadows (NO BOX / NO CAPSULE)
    - Primary line: Bold white Inter-900 (96px) with clean black stroke
    - Punch line: Flowing Yellowtail script (136px) in distinct vibrant themes
    - Dynamic kinetic entrance with staggered rotation bounce, living wave, and smooth fade
    """
    t0, t1 = fr(t0), fr(t1)
    wrap_id = c.uid('vtow')
    l1_id = c.uid('vto1')
    l2_id = c.uid('vto2')
    
    if top_offset is not None:
        y_pos = top_offset
    elif pos == 'above_head':
        y_pos = 240  # generous 240px padding from top ceiling, comfortably above seated head
    else:  # stomach
        y_pos = 1200 # centered right across stomach / waist
        
    script_class = f'ref-script-float {theme}'
    
    inner = (f'<div id="{wrap_id}" class="ref-floating-wrap" style="top:{y_pos}px;z-index:{z}">'
             f'<div id="{l1_id}" class="ref-sans-float">{line1}</div>'
             f'<div id="{l2_id}" class="{script_class}">{line2}</div>'
             f'</div>')
             
    c.clip(t0, t1, inner, z)
    
    c.pre.append(f'gsap.set("#{wrap_id}",{{opacity:0}});')
    c.pre.append(f'gsap.set("#{l1_id}",{{y:40,scale:0.92,opacity:0}});')
    c.pre.append(f'gsap.set("#{l2_id}",{{scale:0.75,rotation:-6,opacity:0,transformOrigin:"50% 50%"}});')
    
    # Smooth group reveal
    c.at(f'tl.to("#{wrap_id}",{{opacity:1,duration:0.12}},{t0 + 0.08:.4f});')
    
    # Line 1 smooth slide up & fade
    c.at(f'tl.to("#{l1_id}",{{y:0,scale:1,opacity:1,duration:0.35,ease:"power3.out"}},{t0 + 0.10:.4f});')
    
    # Line 2 cursive script explodes in with rotation overshoot
    c.at(f'tl.to("#{l2_id}",{{scale:1,rotation:0,opacity:1,duration:0.42,ease:"back.out(2.0)"}},{t0 + 0.22:.4f});')
    
    # Subtle smooth organic floating hold
    hold_dur = max(0.4, (t1 - t0) - 0.70)
    c.at(f'tl.to("#{wrap_id}",{{y:-8,rotationZ:0.8,duration:{hold_dur:.4f},ease:"sine.inOut"}},{t0 + 0.45:.4f});')
    
    # Smooth kinetic exit
    c.at(f'tl.to("#{wrap_id}",{{y:-24,scale:1.04,opacity:0,duration:0.22,ease:"power2.in"}},{t1 - 0.22:.4f});')



# --- Kinetic Camera Whip-Zoom Transition at 0:19
def whip_zoom_transition(c, t_at=18.90, vid_id=None, z=8):
    """Cinematic camera whip-zoom transition at 0:19:
    - Rapid camera snap zoom with power4.out
    - Optical directional blur pulse
    - Subtle chromatic bloom flash
    - Punchy whoosh + impact sound
    """
    t = fr(t_at)
    fid = c.uid('wzt_flash')
    inner = f'<div id="{fid}" style="position:absolute;inset:0;background:radial-gradient(circle,rgba(255,255,255,0.4) 0%,rgba(16,185,129,0.18) 50%,transparent 80%);pointer-events:none;z-index:{z}"></div>'
    c.clip(t - 2 * F1, t + 10 * F1, inner, z)
    
    c.pre.append(f'gsap.set("#{fid}",{{opacity:0}});')
    c.at(f'tl.to("#{fid}",{{opacity:0.7,duration:0.06,ease:"power1.in"}},{t - 2 * F1:.4f});')
    c.at(f'tl.to("#{fid}",{{opacity:0,duration:0.22,ease:"power2.out"}},{t:.4f});')
    
    if vid_id:
        c.at(f'tl.to("#{vid_id}",{{scale:1.18,filter:"blur(10px) contrast(1.15)",duration:0.08,ease:"power4.out"}},{t:.4f});')
        c.at(f'tl.to("#{vid_id}",{{filter:"blur(0px) contrast(1.0)",duration:0.22,ease:"power2.out"}},{t + 0.08:.4f});')
        
    sfx(c, t - 0.05, 'swish', 0.85)
    sfx(c, t, 'train_tile', 0.6)



# --- Dynamic Living Motion Graphics Component (0:13 - 0:17.56)
def claude_workstation_animation(c, t0=13.00, t1=17.56, z=5):
    """Dynamic, living motion graphics demonstrating Claude 3.7 synthesizing documents,
    drafting executive emails, and generating KPI reports with 3 animated cards and live metrics."""
    t0, t1 = fr(t0), fr(t1)
    wrap_id = c.uid('cwa_w')
    bar_id = c.uid('cwa_b')
    cur_id = c.uid('cwa_cur')
    c2_id = c.uid('cwa_c2')
    c3_id = c.uid('cwa_c3')
    svg_line = c.uid('cwa_l')
    
    inner = (f'<div class="ev1-layer" style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;background:#090606;position:absolute;left:0;top:0;perspective:1200px">'
             f'<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 38%,rgba(217,119,87,0.22) 0%,#090606 75%)"></div>'
             f'<div style="position:absolute;inset:0;background-image:linear-gradient(rgba(217,119,87,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(217,119,87,0.05) 1px,transparent 1px);background-size:64px 64px"></div>'
             
             # 3D Animated Wrapper
             f'<div id="{wrap_id}" style="position:relative;z-index:5;display:flex;flex-direction:column;align-items:center;width:960px;transform-style:preserve-3d">'
             
             # Top Badge
             f'<div style="display:inline-flex;align-items:center;gap:12px;padding:12px 28px;border-radius:999px;background:rgba(30,18,14,0.9);backdrop-filter:blur(16px);border:1px solid rgba(217,119,87,0.4);color:#D97757;font:800 22px var(--ev1-sans);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:28px;box-shadow:0 0 25px rgba(217,119,87,0.3)">'
             f'<span style="width:10px;height:10px;border-radius:50%;background:#D97757;box-shadow:0 0 12px #D97757"></span>01 // CLAUDE 3.7 AI ENGINE</div>'
             
             # Title Block
             f'<div style="text-align:center;margin-bottom:32px">'
             f'<div style="font:900 58px/1.05 var(--ev1-sans);background:linear-gradient(90deg,#FFFFFF 0%,#FAF4D9 50%,#D97757 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-0.02em">INTELLIGENT WORKSPACE</div>'
             f'<div style="font:600 22px var(--ev1-sans);color:rgba(250,244,217,0.65);margin-top:8px;letter-spacing:0.04em">Autonomous Office Production Pipeline</div></div>'
             
             # Card 1: Long-Form Synthesis & Documents
             f'<div style="width:100%;border-radius:32px;background:linear-gradient(145deg,rgba(32,20,16,0.95),rgba(18,12,10,0.98));border:1px solid rgba(217,119,87,0.35);padding:32px 36px;box-shadow:0 20px 50px rgba(0,0,0,0.7),0 0 35px rgba(217,119,87,0.15);margin-bottom:20px">'
             f'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">'
             f'<div style="display:flex;align-items:center;gap:14px">'
             f'<div style="width:44px;height:44px;border-radius:12px;background:rgba(217,119,87,0.2);display:flex;align-items:center;justify-content:center;border:1px solid rgba(217,119,87,0.4)">'
             f'<svg viewBox="0 0 24 24" style="width:24px;height:24px;fill:#D97757"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg></div>'
             f'<span style="font:800 26px var(--ev1-sans);color:#FAF4D9">Long-Form Document Synthesis</span></div>'
             f'<span style="font:800 17px var(--ev1-mono);color:#10B981;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.35);padding:6px 16px;border-radius:999px">STREAMING 12,450 WORDS</span></div>'
             
             # Animated Progress Track
             f'<div style="position:relative;width:100%;height:14px;border-radius:7px;background:rgba(255,255,255,0.06);overflow:hidden;margin-bottom:14px">'
             f'<div id="{bar_id}" style="position:absolute;left:0;top:0;height:100%;width:15%;border-radius:7px;background:linear-gradient(90deg,#D97757,#FAF4D9);box-shadow:0 0 16px rgba(217,119,87,0.8)"></div></div>'
             f'<div style="display:flex;justify-content:space-between;font:600 18px var(--ev1-sans);color:rgba(250,244,217,0.6)">'
             f'<span>Generating 12-page comprehensive brief<span id="{cur_id}" style="display:inline-block;width:3px;height:18px;background:#D97757;vertical-align:-2px;margin-left:4px"></span></span>'
             f'<span style="color:#D97757;font-weight:700">100% Coherent</span></div></div>'
             
             # Card 2: Executive Communication Draft (Pops in at 14.30s)
             f'<div id="{c2_id}" style="width:100%;border-radius:32px;background:linear-gradient(145deg,rgba(32,20,16,0.95),rgba(18,12,10,0.98));border:1px solid rgba(217,119,87,0.35);padding:30px 36px;box-shadow:0 20px 50px rgba(0,0,0,0.7),0 0 35px rgba(217,119,87,0.15);margin-bottom:20px">'
             f'<div style="display:flex;justify-content:space-between;align-items:center">'
             f'<div style="display:flex;align-items:center;gap:14px">'
             f'<div style="width:44px;height:44px;border-radius:12px;background:rgba(217,119,87,0.2);display:flex;align-items:center;justify-content:center;border:1px solid rgba(217,119,87,0.4)">'
             f'<svg viewBox="0 0 24 24" style="width:24px;height:24px;fill:#D97757"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></div>'
             f'<div><div style="font:800 26px var(--ev1-sans);color:#FAF4D9">Executive Email Generator</div>'
             f'<div style="font:600 17px var(--ev1-mono);color:rgba(250,244,217,0.55);margin-top:2px">to: board@enterprise.ai</div></div></div>'
             f'<div style="font:800 17px var(--ev1-sans);color:#10B981;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.35);padding:8px 18px;border-radius:999px">POLISHED TONE &#10003;</div></div></div>'
             
             # Card 3: Quarterly Analytics & KPI Reports (Pops in at 15.60s)
             f'<div id="{c3_id}" style="width:100%;border-radius:32px;background:linear-gradient(145deg,rgba(32,20,16,0.95),rgba(18,12,10,0.98));border:1px solid rgba(217,119,87,0.35);padding:30px 36px;box-shadow:0 20px 50px rgba(0,0,0,0.7),0 0 35px rgba(217,119,87,0.15)">'
             f'<div style="display:flex;justify-content:space-between;align-items:center">'
             f'<div style="display:flex;align-items:center;gap:14px">'
             f'<div style="width:44px;height:44px;border-radius:12px;background:rgba(217,119,87,0.2);display:flex;align-items:center;justify-content:center;border:1px solid rgba(217,119,87,0.4)">'
             f'<svg viewBox="0 0 24 24" style="width:24px;height:24px;fill:#D97757"><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/></svg></div>'
             f'<div><div style="font:800 26px var(--ev1-sans);color:#FAF4D9">Quarterly KPI & Report Synthesis</div>'
             f'<div style="font:600 17px var(--ev1-mono);color:rgba(250,244,217,0.55);margin-top:2px">Zero Manual Data Entry</div></div></div>'
             
             # Sparkline SVG with rising curve
             f'<div style="display:flex;align-items:center;gap:16px">'
             f'<svg width="120" height="42" viewBox="0 0 120 42" style="overflow:visible">'
             f'<path id="{svg_line}" d="M 0,38 Q 30,35 55,20 T 115,4" fill="none" stroke="#10B981" stroke-width="4" stroke-linecap="round"/>'
             f'<circle cx="115" cy="4" r="5" fill="#10B981" style="filter:drop-shadow(0 0 8px #10B981)"/>'
             f'</svg>'
             f'<div style="font:900 34px/1 var(--ev1-sans);color:#10B981">+94.8%</div></div></div></div>'
             
             f'</div></div>')
    c.clip(t0, t1, inner, z)
    
    # Pre-sets
    c.pre.append(f'gsap.set("#{wrap_id}",{{rotationY:-4,rotationX:2,scale:0.94,opacity:0}});')
    c.pre.append(f'gsap.set("#{bar_id}",{{width:"15%"}});')
    c.pre.append(f'gsap.set("#{c2_id}",{{y:35,opacity:0}});')
    c.pre.append(f'gsap.set("#{c3_id}",{{y:35,opacity:0}});')
    c.pre.append(f'gsap.set("#{svg_line}",{{strokeDasharray:140,strokeDashoffset:140}});')
    
    # Main Entrance at 13.00s
    c.at(f'tl.to("#{wrap_id}",{{scale:1,opacity:1,duration:0.35,ease:"power3.out"}},{t0:.4f});')
    
    # Continuous Living 3D Float
    c.at(f'tl.to("#{wrap_id}",{{rotationY:4,rotationX:-2,y:-10,duration:2.0,ease:"sine.inOut",yoyo:true,repeat:1}},{t0 + 0.35:.4f});')
    
    # Progress Bar Fill on Card 1 (13.1s -> 16.5s)
    c.at(f'tl.to("#{bar_id}",{{width:"100%",duration:3.2,ease:"power1.inOut"}},{t0 + 0.15:.4f});')
    
    # Card 2 Slide-in at 14.30s
    c.at(f'tl.to("#{c2_id}",{{y:0,opacity:1,duration:0.32,ease:"back.out(1.4)"}},14.30);')
    sfx(c, 14.30, 'click', 0.6)
    
    # Card 3 Slide-in at 15.60s + SVG Sparkline Draw
    c.at(f'tl.to("#{c3_id}",{{y:0,opacity:1,duration:0.32,ease:"back.out(1.4)"}},15.60);')
    c.at(f'tl.to("#{svg_line}",{{strokeDashoffset:0,duration:0.7,ease:"power2.out"}},15.75);')
    sfx(c, 15.60, 'click', 0.6)


# --- Geez Tech Animated Figure (0:21 - 0:23)
def geez_tech_animated_figure(c, t0=21.00, t1=23.00, z=5):
    """Dynamic Geez Tech figure with real non-AI logo and animated head movement at 0:22."""
    t0, t1 = fr(t0), fr(t1)
    card_id = c.uid('gtc')
    head_id = c.uid('gth')
    eye_l = c.uid('gtel')
    eye_r = c.uid('gter')
    star_l = c.uid('gtsl')
    star_r = c.uid('gtsr')
    
    inner = (f'<div class="ev1-layer" style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;background:#080507;position:absolute;left:0;top:0">'
             f'<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 45%,#3B0813 0%,#150307 55%,#050203 100%)"></div>'
             f'<div style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,77,109,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,77,109,0.04) 1px,transparent 1px);background-size:64px 64px"></div>'
             f'<div style="position:absolute;width:800px;height:800px;border-radius:50%;background:radial-gradient(circle,rgba(255,51,85,0.22) 0%,rgba(220,20,60,0.08) 50%,transparent 75%);filter:blur(80px);top:320px"></div>'
             
             f'<div style="position:relative;z-index:5;display:flex;flex-direction:column;align-items:center">'
             f'<div style="display:inline-flex;align-items:center;gap:12px;padding:12px 28px;border-radius:999px;background:rgba(30,10,15,0.85);backdrop-filter:blur(16px);border:1px solid rgba(255,77,109,0.35);color:#FF758F;font:700 22px var(--ev1-sans);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:30px;box-shadow:0 0 25px rgba(255,77,109,0.25)">'
             f'<span style="width:10px;height:10px;border-radius:50%;background:#FF4D6D;box-shadow:0 0 12px #FF4D6D"></span>02 // GEEZ TECH AI LABS</div>'
             
             f'<div id="{card_id}" style="width:940px;padding:48px 48px;border-radius:40px;background:linear-gradient(160deg,rgba(26,8,12,0.94) 0%,rgba(14,4,7,0.98) 100%);border:1px solid rgba(255,77,109,0.3);box-shadow:0 40px 90px rgba(0,0,0,0.85),0 0 50px rgba(255,77,109,0.15);display:flex;flex-direction:column;align-items:center">'
             
             # Logo Row with real Geez Tech logo
             f'<div style="display:flex;align-items:center;gap:20px;margin-bottom:32px">'
             f'<div style="width:76px;height:76px;flex:none">{LOGO_SVG}</div>'
             f'<div style="display:flex;flex-direction:column">'
             f'<span style="font:900 50px/1 var(--ev1-sans);background:linear-gradient(90deg,#FFFFFF 0%,#FFB3C1 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-0.02em">GEEZ TECH</span>'
             f'<span style="font:700 18px var(--ev1-sans);letter-spacing:0.16em;color:#FF758F;text-transform:uppercase;margin-top:6px">Engineered AI Skills</span></div></div>'
             
             # Entity Stage
             f'<div style="position:relative;width:420px;height:310px;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:6px 0 26px">'
             f'<svg id="{star_l}" viewBox="0 0 24 24" fill="#FF758F" style="position:absolute;left:20px;top:90px;width:44px;height:44px;filter:drop-shadow(0 0 16px #FF4D6D)">'
             f'<path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z"/></svg>'
             
             f'<svg id="{star_r}" viewBox="0 0 24 24" fill="#FF4D6D" style="position:absolute;right:25px;top:45px;width:38px;height:38px;filter:drop-shadow(0 0 16px #FF4D6D)">'
             f'<path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z"/></svg>'
             
             # Head with glowing eyes
             f'<div id="{head_id}" style="width:160px;height:160px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FF4D6D 0%,#C9184A 45%,#800F2F 75%,#300410 100%);box-shadow:0 0 50px rgba(255,77,109,0.6),inset 0 0 25px rgba(255,200,215,0.4);position:relative;z-index:2;margin-bottom:-15px;display:flex;align-items:center;justify-content:center;gap:26px;transform-origin:50% 85%">'
             f'<div id="{eye_l}" style="width:20px;height:32px;border-radius:50%;background:#FFFFFF;box-shadow:0 0 16px #FFFFFF,0 0 28px rgba(255,255,255,0.8)"></div>'
             f'<div id="{eye_r}" style="width:20px;height:32px;border-radius:50%;background:#FFFFFF;box-shadow:0 0 16px #FFFFFF,0 0 28px rgba(255,255,255,0.8)"></div>'
             f'</div>'
             
             # Body
             f'<div style="width:250px;height:150px;border-radius:125px 125px 40px 40px;background:radial-gradient(circle at 40% 25%,#E5383B 0%,#A4161A 50%,#660708 80%,#200305 100%);box-shadow:0 0 60px rgba(229,56,59,0.5),inset 0 0 30px rgba(255,180,190,0.3);position:relative;z-index:1"></div>'
             f'</div>'
             
             # Skills Chips Row
             f'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;width:100%">'
             f'<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,77,109,0.2);border-radius:20px;padding:18px 14px;text-align:center"><div style="font:800 15px var(--ev1-sans);color:#FF758F;margin-bottom:4px">PACK 01</div><div style="font:800 19px var(--ev1-sans);color:#FAF4D9">YouTube Script</div></div>'
             f'<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,77,109,0.2);border-radius:20px;padding:18px 14px;text-align:center"><div style="font:800 15px var(--ev1-sans);color:#FF758F;margin-bottom:4px">PACK 02</div><div style="font:800 19px var(--ev1-sans);color:#FAF4D9">Thumbnails</div></div>'
             f'<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,77,109,0.2);border-radius:20px;padding:18px 14px;text-align:center"><div style="font:800 15px var(--ev1-sans);color:#FF758F;margin-bottom:4px">PACK 03</div><div style="font:800 19px var(--ev1-sans);color:#FAF4D9">Copywriting</div></div>'
             f'</div>'
             
             f'<div style="display:flex;justify-content:space-between;align-items:center;width:100%;padding-top:22px;margin-top:22px;border-top:1px solid rgba(255,77,109,0.15)">'
             f'<span style="font:600 19px var(--ev1-sans);color:rgba(250,244,217,0.6)">Active Pipeline Status</span>'
             f'<span style="padding:6px 18px;border-radius:999px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.35);color:#10B981;font:800 17px var(--ev1-sans)">3 PACKS READY</span></div>'
             
             f'</div></div></div>')
    c.clip(t0, t1, inner, z)
    
    # Animations
    c.pre.append(f'gsap.set("#{card_id}",{{scale:0.94,opacity:0}});')
    c.pre.append(f'gsap.set("#{head_id}",{{x:0,y:0,rotation:0}});')
    c.pre.append(f'gsap.set(["#{eye_l}","#{eye_r}"],{{x:0,y:0,scaleY:1}});')
    c.pre.append(f'gsap.set("#{star_l}",{{y:0,scale:1}});')
    c.pre.append(f'gsap.set("#{star_r}",{{y:0,scale:0.9}});')
    
    # Card entrance
    c.at(f'tl.to("#{card_id}",{{scale:1,opacity:1,duration:0.3,ease:"back.out(1.4)"}},{t0:.4f});')
    
    # Head movement at 0:22 (moves up, left, right, and center)
    # 21.75s: Up
    c.at(f'tl.to("#{head_id}",{{y:-18,duration:0.28,ease:"power2.out"}},21.75);')
    c.at(f'tl.to(["#{eye_l}","#{eye_r}"],{{y:-6,duration:0.25}},21.75);')
    # 22.05s: Left
    c.at(f'tl.to("#{head_id}",{{x:-26,y:-10,rotation:-7,duration:0.3,ease:"power2.inOut"}},22.05);')
    c.at(f'tl.to(["#{eye_l}","#{eye_r}"],{{x:-12,y:0,duration:0.26}},22.05);')
    # 22.38s: Right
    c.at(f'tl.to("#{head_id}",{{x:26,y:-10,rotation:7,duration:0.3,ease:"power2.inOut"}},22.38);')
    c.at(f'tl.to(["#{eye_l}","#{eye_r}"],{{x:12,y:0,duration:0.26}},22.38);')
    # 22.70s: Center with friendly nod
    c.at(f'tl.to("#{head_id}",{{x:0,y:0,rotation:0,duration:0.22,ease:"back.out(1.5)"}},22.70);')
    c.at(f'tl.to(["#{eye_l}","#{eye_r}"],{{x:0,y:0,duration:0.18}},22.70);')
    # 22.85s: Quick blink
    c.at(f'tl.to(["#{eye_l}","#{eye_r}"],{{scaleY:0.1,duration:0.06,yoyo:true,repeat:1}},22.85);')
    
    # Floating stars
    c.at(f'tl.to("#{star_l}",{{y:-15,scale:1.15,duration:0.7,ease:"sine.inOut",yoyo:true,repeat:2}},{t0:.4f});')
    c.at(f'tl.to("#{star_r}",{{y:14,scale:1.05,duration:0.65,ease:"sine.inOut",yoyo:true,repeat:2}},{t0:.4f});')


# --- 3D Instagram Follow Animation (0:35 - 0:37)
def instagram_3d_follow(c, t0=35.00, t1=37.00, z=5):
    """3D animated Instagram follow card with real Geez Tech logo on profile and interactive follow click."""
    t0, t1 = fr(t0), fr(t1)
    card_id = c.uid('igc')
    ring_id = c.uid('igr')
    btn_id = c.uid('igb')
    cur_id = c.uid('igcur')
    heart_id = c.uid('igh')
    
    inner = (f'<div class="ev1-layer" style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;background:#0A0A0A;position:absolute;left:0;top:0;perspective:1200px">'
             f'<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(35,20,28,0.7) 0%,#050505 100%)"></div>'
             
             # 3D Card Wrapper
             f'<div id="{card_id}" style="position:relative;border-radius:46px;padding:4px;background:linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);box-shadow:0 35px 90px rgba(220,39,67,0.35),0 0 60px rgba(240,148,51,0.2);transform-style:preserve-3d;transform-origin:50% 50%">'
             
             f'<div style="width:820px;background:#121212;border-radius:42px;padding:65px 60px;display:flex;flex-direction:column;align-items:center;position:relative">'
             
             # Instagram script title
             f'<div style="font-family:Brush Script MT,Grand Hotel,cursive,sans-serif;font-size:76px;font-weight:500;color:#FFFFFF;margin-bottom:45px">Instagram</div>'
             
             # Avatar with Real Geez Tech Logo & Glowing Rotating Story Ring
             f'<div style="position:relative;width:240px;height:240px;display:flex;align-items:center;justify-content:center;margin-bottom:24px">'
             f'<div id="{ring_id}" style="position:absolute;inset:0;border-radius:50%;border:4px solid transparent;background:linear-gradient(45deg,#f09433,#dc2743,#bc1888) border-box;-webkit-mask:linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;box-shadow:0 0 25px rgba(220,39,67,0.4)"></div>'
             f'<div style="width:216px;height:216px;border-radius:50%;overflow:hidden;background:#121316;display:flex;align-items:center;justify-content:center;border:3px solid #121212;box-shadow:inset 0 0 20px rgba(0,0,0,0.8)">'
             f'<div style="width:160px;height:160px">{LOGO_SVG}</div>'
             f'</div></div>'
             
             # Profile Name
             f'<div style="display:flex;align-items:center;gap:10px;margin-bottom:44px">'
             f'<span style="font:700 32px var(--ev1-sans);color:#FFFFFF">geeztech.ai</span>'
             f'<svg viewBox="0 0 24 24" style="width:26px;height:26px;fill:#0095F6"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></div>'
             
             # Follow Button Container
             f'<div style="position:relative;width:100%;max-width:520px">'
             f'<div id="{btn_id}" style="width:100%;padding:22px 0;border-radius:20px;background:#0095F6;color:#FFFFFF;font:700 32px var(--ev1-sans);text-align:center;box-shadow:0 12px 35px rgba(0,149,246,0.4);display:flex;align-items:center;justify-content:center;gap:12px;transform-origin:50% 50%">'
             f'Follow</div>'
             
             # Floating Heart SVG
             f'<div id="{heart_id}" style="position:absolute;left:50%;top:-30px;opacity:0;pointer-events:none">'
             f'<svg viewBox="0 0 24 24" style="width:44px;height:44px;fill:#FF3366;filter:drop-shadow(0 0 12px #FF3366)"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div>'
             
             # Mouse Cursor Pointer
             f'<svg id="{cur_id}" viewBox="0 0 24 24" style="position:absolute;width:48px;height:48px;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.7));pointer-events:none">'
             f'<path d="M4 0l16 12-7 1.5 4 8.5-3 1.5-4-8.5-4 4.5z" fill="#FFFFFF" stroke="#000" stroke-width="1.5"/></svg>'
             
             f'</div></div></div></div>')
    c.clip(t0, t1, inner, z)
    
    # 3D transforms & animations
    c.pre.append(f'gsap.set("#{card_id}",{{rotationY:-18,rotationX:10,z:-120,scale:0.92,opacity:0}});')
    c.pre.append(f'gsap.set("#{cur_id}",{{x:380,y:120,opacity:0}});')
    c.pre.append(f'gsap.set("#{heart_id}",{{xPercent:-50,y:0,scale:0.5,opacity:0}});')
    
    # 3D swoop entrance at 35.00s
    c.at(f'tl.to("#{card_id}",{{rotationY:-3,rotationX:2,z:0,scale:1,opacity:1,duration:0.45,ease:"power3.out"}},{t0:.4f});')
    
    # Continuous living 3D floating movement
    c.at(f'tl.to("#{card_id}",{{rotationY:3,rotationX:-2,duration:1.5,ease:"sine.inOut",yoyo:true,repeat:1}},{t0 + 0.45:.4f});')
    
    # Rotating story ring
    c.at(f'tl.to("#{ring_id}",{{rotation:360,duration:2.0,ease:"none"}},{t0:.4f});')
    
    # Cursor gliding in at 35.40s
    c.at(f'tl.to("#{cur_id}",{{x:240,y:25,opacity:1,duration:0.4,ease:"power2.out"}},35.40);')
    
    # Click at 35.85s
    c.at(f'tl.to("#{cur_id}",{{scale:0.85,duration:0.08,yoyo:true,repeat:1}},35.85);')
    c.at(f'tl.to("#{btn_id}",{{scale:0.92,duration:0.08,yoyo:true,repeat:1}},35.85);')
    
    # Button state changes to "Following ✓"
    c.at(f'tl.set("#{btn_id}",{{backgroundColor:"#262626",border:"1px solid rgba(255,255,255,0.2)",boxShadow:"0 8px 20px rgba(0,0,0,0.6)",innerHTML:"Following &#10003;"}},35.85);')
    
    # Heart burst
    c.at(f'tl.to("#{heart_id}",{{opacity:1,xPercent:-50,y:-40,scale:1.2,duration:0.4,ease:"back.out(2)"}},35.85);')
    c.at(f'tl.to("#{heart_id}",{{opacity:0,duration:0.3}},36.35);')
    
    # Cursor moves away
    c.at(f'tl.to("#{cur_id}",{{x:320,y:100,opacity:0,duration:0.4,ease:"power2.in"}},36.20);')


# --- Comment Box (0:37 - 38.85)
def comment_box_vertical(c, t0, t1, z=5, placeholder='Add a comment…', avatar_letter='M', type_text='SKILL', type_at=37.3, fpc=2):
    """Sleek vertical comment composer with zero Amharic script, character typing, and active button."""
    t0, t1 = fr(t0), fr(t1)
    bid, cur, kid = c.uid('cb'), c.uid('cc'), c.uid('ck')
    ph_id = c.uid('cph')
    chars = []
    for j, ch in enumerate(type_text):
        sid = c.uid('ct')
        chars.append(f'<span id="{sid}" style="opacity:0">{esc(ch)}</span>')
        c.at(f'tl.set("#{sid}",{{opacity:1}},{fr(type_at) + j * fpc * F1:.4f});')
        sfx(c, fr(type_at) + j * fpc * F1, 'click_soft', 0.5)
    inner = (f'<div class="ev1-layer" style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;background:rgba(10,10,12,0.92);backdrop-filter:blur(24px);position:absolute;left:0;top:0">'
             f'<div id="{bid}" style="width:920px;border-radius:36px;transform-origin:center center;'
             f'background:linear-gradient(150deg,rgba(30,30,35,0.95),rgba(15,15,18,0.98));'
             f'border:1px solid rgba(255,255,255,0.18);box-shadow:0 30px 80px rgba(0,0,0,0.8),0 0 40px rgba(0,149,246,0.15);padding:50px 46px">'
             f'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:38px">'
             f'<span style="font:700 36px var(--ev1-sans);color:#FAF4D9;letter-spacing:-0.01em">Comments</span>'
             f'<span style="font:600 20px var(--ev1-sans);color:rgba(250,244,217,0.5);letter-spacing:0.08em;text-transform:uppercase">DIRECT ACTION</span></div>'
             f'<div style="display:flex;gap:24px;align-items:center;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:24px;padding:22px 28px">'
             f'<div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#0095F6,#0060DF);color:#fff;font:700 36px/72px var(--ev1-sans);text-align:center;flex:none;box-shadow:0 0 20px rgba(0,149,246,0.4)">{esc(avatar_letter)}</div>'
             f'<div style="flex:1;font:500 38px/1.2 var(--ev1-sans);color:#FFFFFF;position:relative">'
             f'<span id="{ph_id}" style="color:rgba(255,255,255,0.4);position:absolute;left:0">{esc(placeholder)}</span>{"".join(chars)}'
             f'<span id="{cur}" style="display:inline-block;width:3px;height:42px;background:#0095F6;vertical-align:-6px;box-shadow:0 0 8px #0095F6"></span></div></div>'
             f'<div style="display:flex;justify-content:flex-end;gap:20px;margin-top:36px">'
             f'<div style="font:600 30px/64px var(--ev1-sans);color:rgba(255,255,255,0.6);padding:0 30px">Cancel</div>'
             f'<div id="{kid}" style="font:700 30px/64px var(--ev1-sans);color:#717171;background:#272727;border-radius:32px;padding:0 46px;box-shadow:0 8px 24px rgba(0,0,0,0.4)">Comment</div></div>'
             f'</div><div class="ev1-vignette"></div></div>')
    c.clip(t0, t1, inner, z)
    t = t0; on = True
    while t < t1:
        c.at(f'tl.set("#{cur}",{{opacity:{1 if on else 0}}},{t:.4f});'); t += 6 * F1; on = not on
    if type_text:
        c.at(f'tl.set("#{ph_id}",{{opacity:0}},{fr(type_at):.4f});'
             f'tl.set("#{kid}",{{backgroundColor:"#0095F6",color:"#FFFFFF",boxShadow:"0 0 30px rgba(0,149,246,0.6)"}},{fr(type_at + len(type_text) * fpc * F1):.4f});')
        sfx(c, fr(type_at + len(type_text) * fpc * F1), 'click', 0.8)
    c.pre.append(f'gsap.set("#{bid}",{{scale:0.92,opacity:0}});')
    c.at(f'tl.to("#{bid}",{{scale:1,opacity:1,duration:0.25,ease:"back.out(1.5)"}},{t0:.4f});')
    c.at(f'tl.to("#{bid}",{{scale:1.03,duration:{t1 - t0 - 0.25:.4f},ease:"none"}},{t0 + 0.25:.4f});')


# ============================================================ BEATS (EXACT USER TIMESTAMPS)

# Beat 1: 0.00 – 3.38s ("That's it. The solution is this simple.")
sfx(c, 0.05, 'subtone', 0.5)
face(0.0, 3.38, punch=(2.3, 1.14), z=1)
viral_text_overlay(c, 0.25, 3.25, "THE SOLUTION IS", "this simple", theme="cyan", pos="above_head", z=15)
sfx(c, 0.35, 'swish', 0.45)

# Beat 2: 3.38 – 7.64s ("Let me introduce you to a new AI that can help you reduce the various pressures...")
sfx(c, 3.25, 'swish', 0.7)
sfx(c, 3.38, 'train_tile', 0.8)
tile_reveal(c, 3.38, A['office_burden'], z=2, size=(1080, 1920))
still(c, 3.38, 7.64, A['office_burden'], z=1, size=(1080, 1920), push=1.06)
shot(3.38, 7.64, 'pb_office_burden')

# Beat 3: 7.64 – 10.00s ("It's called Claude." - Silky smooth seamless transition, NO harsh white flash/impact)
sfx(c, 7.50, 'swish', 0.5)
smooth_hero(c, 7.64, 10.00, A['claude_hero'], z=1, size=(1080, 1920))
shot(7.64, 10.00, 'pb_claude_hero')

# Beat 3b: 10.00 – 13.00s (Talking head: Flame Coral / Terracotta Theme)
face(10.00, 13.00, z=1)
viral_text_overlay(c, 10.15, 12.85, "MEET CLAUDE", "the smartest AI", theme="coral", pos="stomach", z=15)
sfx(c, 10.25, 'swish', 0.45)
shot(10.00, 13.00, 'face_10_13')

# Beat 4: 13.00 – 17.56s (DYNAMIC LIVING MOTION GRAPHICS: Claude Intelligent Workspace)
sfx(c, 12.92, 'swish', 0.65)
claude_workstation_animation(c, 13.00, 17.56, z=5)
shot(13.00, 17.56, 'claude_workstation_animated')

# Beat 5: 17.56 – 21.00s (Talking head: Neon Emerald Theme with Whip-Zoom Transition at 0:19)
sfx(c, 17.45, 'swish', 0.6)
v5 = face(17.56, 21.00, z=1)
# USER REQUIREMENT: Good transition at 0:19 (18.90s)
whip_zoom_transition(c, t_at=18.90, vid_id=v5, z=8)
viral_text_overlay(c, 18.95, 20.85, "SAVE HOURS", "every single day", theme="emerald", pos="stomach", z=15)
sfx(c, 19.00, 'swish', 0.45)

# Beat 6: 21.00 – 23.00s (USER REQUIREMENT: GEEZ TECH REAL LOGO & ANIMATED FIGURE MOVING HEAD AT 0:22)
sfx(c, 20.90, 'swish', 0.7)
geez_tech_animated_figure(c, 21.00, 23.00, z=5)
shot(21.00, 23.00, 'geez_tech_animated')

# Beat 6b: 23.00 – 26.00s (Talking head: Hot Pink Theme)
face(23.00, 26.00, z=1)
viral_text_overlay(c, 23.15, 25.85, "3 CUSTOM SKILLS", "ready to use", theme="pink", pos="stomach", z=15)
sfx(c, 23.25, 'swish', 0.45)
shot(23.00, 26.00, 'face_23_26')

# Beat 7: 26.00 – 28.00s (USER REQUIREMENT: AT 0:26 YOUTUBE SCRIPT)
sfx(c, 25.92, 'click', 0.65)
still(c, 26.00, 28.00, A['skill_youtube'], z=1, size=(1080, 1920), push=1.04)
shot(26.00, 28.00, 'pb_skill_youtube_026')

# Beat 8: 28.00 – 29.00s (USER REQUIREMENT: AT 0:28 THUMBNAIL DESIGN ANIMATION)
sfx(c, 27.92, 'click', 0.65)
still(c, 28.00, 29.00, A['skill_thumbnail'], z=1, size=(1080, 1920), push=1.04)
shot(28.00, 29.00, 'pb_skill_thumbnail_028')

# Beat 9: 29.00 – 30.00s (USER REQUIREMENT: AT 0:29 COPYWRITING ANIMATION)
sfx(c, 28.92, 'click', 0.65)
still(c, 29.00, 30.00, A['skill_copywriting'], z=1, size=(1080, 1920), push=1.04)
shot(29.00, 30.00, 'pb_skill_copywriting_029')

# Beat 9b: 30.00 – 35.00s (Talking head: Solar Gold & Electric Blue Themes)
sfx(c, 29.95, 'swish', 0.6)
face(30.00, 35.00, z=1)
viral_text_overlay(c, 30.15, 32.50, "WANT ACCESS?", "here's how", theme="gold", pos="stomach", z=15)
sfx(c, 30.25, 'swish', 0.45)
viral_text_overlay(c, 32.65, 34.85, "STEP 01", "follow the page", theme="blue", pos="stomach", z=15)
sfx(c, 32.75, 'swish', 0.45)
shot(30.00, 35.00, 'face_30_35')

# Beat 10: 35.00 – 37.00s (USER REQUIREMENT: 0:35 3D ANIMATION, GEEZ TECH LOGO ON PROFILE, MOVEMENT & FOLLOW CLICK)
sfx(c, 34.92, 'swish', 0.65)
sfx(c, 35.85, 'click', 0.8)
instagram_3d_follow(c, 35.00, 37.00, z=5)
shot(35.00, 37.00, 'instagram_3d_follow')

# Beat 11: 37.00 – 38.85s (USER REQUIREMENT: 0:37 COMMENT SKILL INTERACTIVE ANIMATION, DONT CHANGE ANYTHING ELSE)
sfx(c, 36.92, 'swish', 0.6)
comment_box_vertical(c, 37.00, 38.85, z=5, placeholder='Add a comment…', avatar_letter='M', type_text='SKILL', type_at=37.3, fpc=2)
shot(37.00, 38.85, 'cb_comment_skill')

# Beat 12: End blackout card
c.clip(fr(VO_END), DUR, '<div class="ev1-layer ev1-black"></div>', z=1)
sfx(c, fr(VO_END), 'outro', 0.85)

# Overall finish layer (vignette on top)
finish(c, 0, DUR, z=80, grid=False, vignette=True)

c.write('index.html', 'assets/ev1/tokens.css', title='Mekdi Host - Claude and Geez Tech (Editor V1)')
c.write_cues('sfx-cues.txt')
json.dump(sorted(SHOTS), open('work/shots.json', 'w'), indent=2)

print('PASS', PASS, 'dur', DUR, 'cues', len(c.cues), 'shots', len(SHOTS))
