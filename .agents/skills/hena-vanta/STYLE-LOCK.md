# Hena Vanta Style Lock

STATUS: LOCKED (Approved 2026-11-09)

> [!IMPORTANT]
> The Hena Vanta visual style is officially **LOCKED** based on the approved benchmark production `projects\hena-vanta-v6-upwork-365`.
> From now on, these specifications may change **ONLY** if the user explicitly says the exact phrase: **"update the skill"**.

---

## 1. Approval Record & Reference Benchmark
- **Status**: `LOCKED`
- **Approval Date**: `2026-11-09`
- **Approved Video**: `projects\hena-vanta-v6-upwork-365` ("1. I tried Upwork for 365 days...is it worth it")
- **Final Timeline Path**: `projects/hena-vanta-v6-upwork-365/src/timeline.v6.json`
- **Approved Snapshot**: `.agents/skills/hena-vanta/reference/approved-upwork-365/` (`timeline.v6.json`, `SceneView.tsx`)
- **Key Metrics**: 171 scenes, 903.84s runtime (15m 03s), 24 distinct animation IDs, 14.7% text-only runtime, 6.5% bare footage (13 FootageNotes), 100% factual number agreement (48/48 stats passed), H1 Experiment hook recipe (6/6 sequence match, score: 1.00), worst no-change gap 1.34s (target $\le 3.0$s).

---

## 2. Animation IDs Actually Used (24 Distinct Catalog IDs)
Only catalog animations are allowed. The approved video verified and used the following 24 distinct IDs:
- **Text & Kinetic Voice**: `A02` (kinetic word stack), `A05` (single word swap with red keyword).
- **Numbers, Metrics & Milestones**: `A03` (count-up stat pill with sparkline), `A10` (metric pill with delta / percentage), `A14` (window card with price tag & proof capture), `A36` (journey milestone progress bar), `A56` (checklist card with dynamic ticks), `A63` (terminal window with timestamp badge).
- **Dialogue & Objections**: `A06` (iMessage bubble with strike-through), `A07` (dual dialogue reply bubble stack).
- **Lists & Architecture**: `A08` (3 list cards staggered entrance with number badges), `A11` (clean browser window with titlebar dots), `A22` (interactive folder / player view), `A27` (split terminal & editor view), `A38` (workflow steps sequencer), `A39` (overlapping Venn diagram), `A45` (screenshot card with italic mute footnote), `A47` (dual workspace compare panel), `A50` (macOS system notification card), `A53` (master journey roadmap), `A54` (split side-by-side comparison), `A60` (search bar typing with question).
- **Footage Slots**: `A52` (FootageNote text on grid, 0 black boxes).

---

## 3. Motion Numbers Actually Used
All motion follows these strict mathematical parameters:
- **Camera Drift** (`<Scene>`):
  - Translate X in `[-24, +24]` px (seeded by scene index).
  - Translate Y in `[-16, +16]` px.
  - Scale: `1.00 -> 1.04` over scene duration.
  - Easing: Linear.
- **Blur Hand-Off & Overlap**:
  - `softIn`: opacity `0 -> 1`, blur `12 -> 0` px, translateY `24 -> 0` px, scale `0.96 -> 1.0` over 8–12 frames (cubic-out).
  - `blurOut`: opacity `1 -> 0`, blur `0 -> 14` px, scale `1.0 -> 1.03` over 8 frames (quad-in).
  - Scene hand-off overlap: 6 frames between outgoing and incoming scenes. Never hard-cut, never dip to white/black.
- **Word-Sync Offset**:
  - Words arrive at `wordStartFrame - 3` (-0.10s at 30 fps).
  - Entrance `wordPop`: 12 frames, spring `{damping: 18, stiffness: 220, mass: 0.6}`.
  - Centering shift: spring `{damping: 20, stiffness: 160}`.

---

## 4. Palette Tokens
Strictly enforced; `#FF0000` is banned:
- **Ink**: `#0B0B0F` (Text, diagram strokes, high-contrast marks)
- **Paper**: `#FFFFFF` (Base cards, surfaces, clean canvas)
- **Red**: `#E01E2D` (HV.red — hero keyword, strike-through, alerts, trap warnings)
- **Blue**: `#1673FF` (Telemetry, count-up stat pill, active dialogue bubble)
- **Green**: `#27C75A` (Growth, positive delta, verified badges)
- **Amber**: `#FFB020` (Caution, 1x tags, milestone accents)
- **Grey**: `#EDEDF0` (Secondary bubble, subtle fills, skeleton bars)
- **Mute**: `#8C8C93` (FootageNote, footnotes, ghost labels)
- **Card**: `#F6F6F8` (Elevated card background)
- **Line**: `#D7D7DD` (Dividers, borders, connectors)

---

## 5. Typography Standards
- **Font Family**: `Inter, 'Inter Variable', -apple-system, 'Segoe UI', Arial, sans-serif`
- **Case Rule**: Sentence case everywhere. ALL CAPS is strictly forbidden except for the warning tag in `A48`.
- **Weights & Scales**:
  - Hero Words / Punch Titles: 80px–120px, bold/extra-bold (600–800)
  - Object Text / Cards / Windows: 36px–56px, semi-bold
  - Minor Telemetry / Tags: 24px–32px, medium
  - Footnote: 20px–24px, italic 400
  - FootageNote: 20px, medium (500)

---

## 6. Background File & Rendering Pipeline
- **Source**: `D:\Youtube\Hena Vanta\Branding\Bg\bg.mp4` (copied to `public/hena-vanta/bg.mp4`).
- **Characteristics**: 1920x1080 @ 60fps (30.0s loop), flat orthogonal clean white grid, zero lens/barrel distortion.
- **Rendering Architecture**: Mounted in `Background.tsx` using Remotion's `<OffthreadVideo>` inside a `<Loop durationInFrames={900}>`.
  - Muted, full-bleed 1920x1080 (`objectFit: 'cover'`).
  - Isolated from scene drift and transforms so the grid stays completely planar and undistorted.
  - Off-thread extraction bypasses Chrome HTML5 media decoder to prevent timeout hangs during high-concurrency renders.

---

## 7. Channel Logo
- **Source**: `D:\Youtube\Hena Vanta\Branding\logo2.png` -> `public/hena-vanta/logo.png`.
- **Usage**: Small avatar size in channel headers (`A33`), player rows (`A01`), and chapter cards (`A64`). Never watermarked across full frames.

---

## 8. FootageNote Rule (Missing Footage Slots)
- **Constraint**: NO black boxes, NO dark fills, NO outlines, NO drawn shapes.
- **Specification**: Exactly ONE line of 20px text, centred at the slot centre (`(960, 540)` for full frame), coloured Mute (`#8C8C93`).
- **Label Format**: `"TYPE: what to show"` where TYPE must be strictly one of: `GAMEPLAY | SCREEN REC | B-ROLL | PHOTO | FACE CAM | CHART`.
- **Budget**: Bare footage $\le 25\%$ of runtime, $\le 6.0$s consecutively.
- **Export**: Exported to `output/placeholders.csv` for Premiere Pro timeline assembly.

---

## 9. Governance & Change Control
- **LOCKED Status**: Active.
- Modifying any rule, token, component, or parameter in this file or `.agents/skills/hena-vanta/` requires the user to explicitly say: **"update the skill"**.
