# style-bible.md — LOCKED. Do not redesign the identity.

## Background
Always the real `Grid 1.mp4` (1920x1080, 30 fps, 39.8 s, loop it). Never recreate, tint, overlay, or blur it. No full-frame fills.

## Palette (non-negotiable)
| Role | Hex | Use |
|---|---|---|
| Ink | #FAF4D9 cream | all text, outlines, icons, pen strokes |
| Card | #231F20 | card/browser/node fills |
| Orange (story accent) | #FF6B35 (measured original #FE6A34) | underline, highlighted outline, key stat, ONE icon per scene |
| Highlight fill | #6B3A2E | fill of the single highlighted card |
| Blue (restricted) | #1677FF | ONLY: channel identity moments (logo, subscribe/like/bell, intro/outro/end card, chapter cards); second side of a contrast pair; chart series #2. <= 15% of frame area. Never touches orange as large fills |
| Lime (rare accent) | #CBFF4D (sampled from the channel logo) | ONLY with the Vanta Brief logo moments or one tiny "new/live" tick in a CTA. Max 1 lime element per scene, max ~2% of frame, not in more than ~1 scene in 8 |
Forbidden: green/purple/red/neon, gradients, glass, drop shadows, pure #000/#FFF, extra accent colors. Real logos/photos/screenshots keep native colors inside cream-outlined sketch frames. Cream stays the dominant color in every scene. Max one orange focal group per scene.

## Type
- Labels / subtitles / card text: **Excalifont** (the Excalidraw hand font; identified by shape match; `assets/fonts/Excalifont-Regular.woff2`, OFL). Fallback: Gochi Hand.
- Big titles and stats only: **Inter ExtraBold/Bold** (`assets/fonts/`).
- Min 24 px (see layout-law).

## Lines
Rough hand-drawn strokes (use rough.js: roughness 1.2, bowing 1, seed fixed per element), 3-5 px, round caps, flat fills. The original is Excalidraw-style, so rough.js reproduces it faithfully.

## Never
Captions/subtitles/lower-thirds of the narration; PowerPoint bullet slides; static scene > 3.5 s; text-baked images; vertical formats.

## Pinterest references: what was taken
Pins are glass/gradient/neon styles (reject those colors and effects). Motion ideas kept, redrawn as flat sketch: toggle slide (pin1) -> A02-style switch flip; sonar rings + sweeping wedge (pin2) -> pulse ring + radar wipe; area chart card with period tabs (pin3) -> sketch chart with tab hop; icon tile row with glow-up on selection (pin4) -> tile row focus hop; numbered portrait cards with banner (pin5) -> numbered photo cards; pill nav with moving highlight (pin6) -> sliding highlight pill; 3 stat cards at staggered heights with dial/curve (pin7) -> staggered stat cards; tree diagram "3-STEP STRATEGY" (pin8) -> tree/branch builder.
