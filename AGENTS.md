# AGENTS.md — Motion Studio Workspace Guidelines

You are working inside the `motion-studio` workspace on Windows 11.
Your role is to build, animate, and orchestrate retention-focused tech videos under the brand **VANTABRIEF** using Remotion, Python, faster-whisper, and automated motion graphics.

## Authoritative Channel Directive: VantaBrief Visual Style Bible
All VantaBrief video production is strictly governed by the **[VantaBrief Visual Style Bible](file:///D:/Automations/motion-studio/Channels/VantaBrief/style/VantaBrief_Visual_Style_Bible.md)** (`VantaBrief_Visual_Style_Bible_Gemini_Remotion.docx`).
Whenever you are asked to create, revise, or render a VantaBrief video, you MUST load and adhere to this document as the single source of truth for visual direction, pacing, asset handling, and quality control.

### The Five Visual Styles (Toolkit, Not a Rigid Template)
1. **Style 1: Kinetic Typography** — Bold claims, punchlines, contrasts, key phrases. Large high-contrast type, natural speech line breaks, sharp reveals, hold long enough to read once. NO word-by-word karaoke captions, NO bouncy elastic overshoots.
2. **Style 2: Real Evidence / Screen-Led** — Authentic product UI, code snippets, terminal execution, documentation, official screenshots. Subtle camera zoom/pan to direct attention. NO fabricated UI, fake metrics, or invented features.
3. **Style 3: Editorial Collage / Visual Metaphor** — Paper-like layers, receipts, stacking invoices, real object cutouts, directional motion with subtle depth. NO generic stock art filler or cartoon scenes.
4. **Style 4: Graphic Symbols / Icon-Led Beats** — Minimalist geometric non-human icons, state changes (connected, filled, active), progress indicators.
5. **Style 5: Technical Motion Graphics (Primary Explanation Style)** — **RESERVED PRIMARILY FOR EXPLAINING HOW THINGS WORK**: system mechanisms, architecture, comparisons, timelines, and process logic. Crisp outlined nodes, directed connectors, code/output panels, progressive builds (Orient -> Introduce -> Connect -> Transform -> Resolve -> Hold) on dark matte canvas (`#231F20`). Do NOT turn every scene into a diagram.

### Non-Negotiable Operational Rules
1. **Rule R1 (Audio Integrity)**: STRICTLY NO sound effects, NO background music, NO audio ducking, NO added audio of any kind. The user's original narration audio (`audio.mp3`) is the single audio source. All SFX and music logic is completely banned.
2. **Rule R2 (Untouched Voiceover)**: Visuals adapt to voiceover timestamps; never trim, speed up, or re-time the voiceover.
3. **Rule R3 (VantaBrief Palette Single Source of Truth)**: Authored graphics must strictly use the official palette:
   - Charcoal Base: `#231F20`
   - Warm Cream Text: `#FAF4D9`
   - Electric Blue (Active / Tech Accent): `#1677FF`
   - Amber (Emphasis / Metric / Warning): `#F59E0B`
   - Crimson (Negative State / Risk / Strike): `#EF4444`
   - Emerald (Positive State / Success): `#10B981`
   Real UI and authentic footage preserve their native colors; the VantaBrief palette governs surrounding graphics and typography.
4. **Rule R4 (Strict Character Ban)**: STRICTLY NO human characters, stick figures, mascots, cartoon people, generic avatars, human-like robots, or anthropomorphic objects with faces/eyes. Default = NO characters. The only permitted exception is a figure whose head is the actual official VantaBrief logo, and ONLY when the user explicitly requests it for a specific beat.
5. **Rule R5 (Standardized Footage Placeholders)**: When required footage or demonstrations are not yet supplied, use a clean centered placeholder labeled `FOOTAGE NEEDED` with exact editor instructions (action, URL/product version, timecode). Never replace missing footage with generic stock filler or fake mockups. All missing footage must be tracked in `manifests/footage-needed.md`.
6. **Rule R6 (Clean Motion Graphics, No Captions)**: Bottom full-sentence subtitles are removed. Screen focus is placed on kinetic key phrases (1–4 words), accent words, and clean data visualizations.
7. **Rule R7 (Factual Integrity)**: Never invent statistics, benchmarks, prices, or release dates. All numbers must cite verifiable sources or be clearly labeled. Metaphors must never be presented as literal data.

## Variety Engine Rules
- No template repeated within 8 beats.
- No template exceeds 5.5% of total video beats.
- No style family consecutive for more than 3 beats.
- Over 70% of shots contain a real visual asset (image, screenshot, cutout, diagram, data chart, or footage placeholder).
- Pacing: 1.5s–3.5s per cut (~25 cuts/minute).
- Camera motion is continuous, subtle, and cinematic (`pushIn`, `driftLeft`, `pullOut`, `driftRight`, `breathing`). Never erratic screen shake.

## CLI Quick Reference
```powershell
python studio.py new "Title" --channel VantaBrief    # Create next numbered episode for channel
python studio.py transcribe <project>                # Local faster-whisper transcription
python studio.py align-script <project>              # Align human script with Whisper timestamps
projects/manim-app/.venv/Scripts/python.exe scripts/build_beats.py  # Segment beats & run Variety Engine
npx tsx scripts/qa.ts                                # Run all 7 Production QA gates
python studio.py render-remotion <project> VantaBrief-Episode-003        # Render final clean MP4
python studio.py render-remotion <project> VantaBrief-Episode-003-Debug  # Render debug MP4 with HUD
```
