# Hena Vanta Style Lock

STATUS: DRAFT

## 1. Skill Version
- **Version**: 6.0 (final)
- **Engine**: Remotion (Antigravity)
- **Resolution**: 1920x1080 (shorts: 1080x1920) @ 30 fps

## 2. Palette Tokens
- **Ink (Text & Dark Accents)**: `#0B0B0F`
- **Paper (Base White)**: `#FFFFFF`
- **Red (Hero Keyword / Alert)**: `#E01E2D`
- **Blue (Telemetry / Accent)**: `#1673FF`
- **Green (Success / Positive Metric)**: `#27C75A`
- **Amber (Warning / Neutral)**: `#FFB020`
- **Grey (Subtle Fills & Backgrounds)**: `#EDEDF0`
- **Mute (Secondary Text & Labels)**: `#8C8C93`
- **Card (Card Surfaces)**: `#F6F6F8`
- **Line (Dividers & Connectors)**: `#D7D7DD`
- **Background**: Light white grid loop (`public/hena-vanta/bg.mp4`), muted.

## 3. Typography
- **Font Stack**: `Inter, 'Inter Variable', -apple-system, 'Segoe UI', Arial, sans-serif`
- **Hierarchy**:
  - Hero Words / Punch Titles: 80px–120px, bold/extra-bold
  - Object Text / Cards / Windows: 36px–56px, semi-bold
  - Minor Telemetry / Tags: 24px–32px, medium
  - FootageNote: 20px, centred, regular

## 4. Motion Vocabulary (Exact from references/MOTION-PRINCIPLES.md)

### 1. One continuous "virtual camera"
Objects are not cut in; they travel through a camera that is always very slowly moving.
* **Drift** (`<Scene drift>`): over the whole scene translate X by a random-but-seeded value in [-24, +24] px and Y in [-16, +16] px, and scale 1.00 -> 1.04. Linear easing. Seed from the scene index so neighbouring scenes drift in different directions.
* **Hand-off, not cut.** The outgoing object blurs out while moving ~40 px in the direction of drift; the incoming object blurs in from the other side. They overlap for 6 frames. See "blurOut / blurIn" below. Never hard-cut and never fade through white.
* **Objects morph into each other**: the same window stays on screen while its contents change (A11 -> A12 -> A13 -> A14 are ONE window). Prefer reusing a persistent container to starting a new one.
* **Pan reveals**: a card larger than the frame can slide so only part is visible (A13, A21, A32). Pan on ease-in-out over 20–30 frames, ends inside the safe area.

### 2. Words arrive at the spoken time
* A word's entrance starts at `wordStartFrame - 3`.
* **Entrance "wordPop"** (12 frames): opacity 0->1 over 6f, translateY +14 -> 0 px, blur 8px -> 0, scale 0.92 -> 1. spring `{damping: 18, stiffness: 220, mass: 0.6}`.
* Previous words do not vanish: they stay until the phrase ends, shift to keep the phrase centred (spring `{damping: 20, stiffness: 160}`), and may dim to 100%->70% opacity when older than 4 words.
* **Phrase out**: all words blurOut together 4 frames after the last word was spoken, unless the next scene reuses the object.
* **Emphasis**: red keyword (`HV.red`) or italic. Never bold + red + underline together. Never more than 2 emphasised words per phrase.

### 3. Object entrances (the full vocabulary)
All frame counts at 30 fps. Use ONLY these. A scene uses at most two.

| Name | Motion |
|---|---|
| `softIn` | opacity 0->1, blur 12->0 px, translateY 24->0, scale 0.96->1; 12 f; easing out-cubic. Default for anything calm (cards, screenshots, windows). |
| `popIn` | scale 0.6 -> 1.06 -> 1 (spring damping 11, stiffness 260, mass 0.7), opacity 0->1 in first 4 f. For pills, badges, bubbles, stats (things that "land"). |
| `slideIn` | translateX +120 px -> 0 (or -120), opacity 0->1 in 6 f, blur 6->0; 14 f; out-quart. For lists and side panels. |
| `riseIn` | translateY +80 -> 0, blur 10->0, opacity 0->1; 14 f; out-cubic. For stacks that grow upward/downward (A07, A19, A40). |
| `drawOn` | stroke-dashoffset 100%->0 over N f, out-quad. For lines, circles of a diagram, S-curve, chart. |
| `typeOn` | characters appear at 1 per 2 f with no blur. Only for the search bar (A60) and typed numbers. |
| `countUp` | number eased with out-expo from 0 to target over 45 f, digits tabular; the pill is already on screen at f0. |
| `cursorGlide` | cursor moves on a quadratic bezier with ease-in-out, 18–30 f, tiny overshoot (3 px) then settles; a click = scale 1 -> 0.88 -> 1 over 6 f at the target, target pill `scale 0.97` + blur 1.5 px for 4 f ("pressed"). |
| `blurOut` | opacity 1->0, blur 0->14 px, scale 1->1.03; 8 f; in-quad. Always the exit. |
| `focusDim` | non-active items opacity 1 -> 0.3 and blur 0 -> 1.5 px over 8 f; active item scale 1.04. |

Easing: `Easing.out(Easing.cubic)` default; `Easing.inOut(Easing.cubic)` for pans; springs only for popIn and re-layout.

## 5. FootageNote Rule (Missing Footage Slots)
- **Constraint**: NO black boxes, NO fills, NO outlines, NO drawn shapes.
- **Specification**: Exactly ONE line of 20px text, centred at the slot centre (`960, 540 ± 2px`), coloured Mute (`#8C8C93`).
- **Label Format**: `"TYPE: what to show"` where TYPE must be strictly one of: `GAMEPLAY | SCREEN REC | B-ROLL | PHOTO | FACE CAM | CHART`.
- **Purpose**: Zero visual clutter so the editor's B-roll / A-roll in Premiere Pro completely covers the note without letterbox artifacts.

## 5.1. v6 Architecture, Schema & Isolation Rules
- **Project Isolation**: Every v6 build lives in a fresh folder `projects/hena-vanta-v6-<slug>/`. Reusing previous project components, `timeline.json`, `PLAN.md`, `review.json`, or stills is strictly prohibited.
- **Timeline Schema**: `src/timeline.v6.json` using valid catalog IDs (`A01`–`A64`). The legacy v5 layouts (`STACK`, `LIST`, `STEPS`, `JOURNEY`) and `PlaceholderBox` are strictly forbidden.
- **Palette Enforcement**: Red is `#E01E2D` (`HV.red`). `#FF0000` is an automatic failure.
- **Auditing & Gates**:
  - `scripts/validate-v6.mjs` enforces E1–E8 numbers, palette, density ($\le 20\%$ text-only), and repetition limits.
  - D2 still review requires the agent to actually view and record observations for 10+ stills in `qa/review.json`.

## 6. Brand & Reference Integrity Rule
- **Channel Identity**: "Hena Vanta" only.
- **Logo**: Genuine channel logo from `public/hena-vanta/logo.png`. Used small (avatar size) in channel rows, headers, and chapter cards.
- **Forbidden Reference Strings**: Grep check must return 0 hits for `"ItsProger"`, `"Proger"`, `"5.5M"`, `"346,154"`, `"vidIQ"`, `"ViewStats"`, `"MrBeast"`, `"Wifies"`, `"Noob"`.
- **Zero Invention**: Real screenshots and metrics only. Never invent placeholder numbers or copy numbers from catalog reference images.

---

## 7. Style Lock Lifecycle & Behaviour
- **While DRAFT**: Build videos normally with the v6 skill.
- **Approval Trigger**: When the user says **"approve this video"** (exact words):
  1. Set status to `LOCKED`.
  2. Record the video name and date.
  3. Fill **Approved animation IDs** with the IDs used in that video and their per-scene timings and durations.
  4. Record average words-per-scene, scene length, text-only %, distinct IDs, and hook recipe used.
  5. Save 8 approved stills into `references/approved/<video-name>/`.
- **When LOCKED**:
  1. Every new video must follow those approved numbers and prefer the approved animation IDs.
  2. New IDs may be added only if the sentence has no approved match, and must be listed in `PLAN.md` as "new, needs approval".
  3. When the user says **"reject <ID> because <reason>"**, add it to the rejected list and never use it again.
  4. Modifying a LOCKED rule requires the exact words **"update the skill"**.

---

## 8. Approved Animation IDs
*(Empty while in DRAFT status — populated upon user approval)*

---

## 9. Rejected Animation IDs and Why
*(Empty while in DRAFT status — populated upon user rejection)*

