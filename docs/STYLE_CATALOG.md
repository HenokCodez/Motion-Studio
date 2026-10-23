# VantaBrief Master Style Catalog & Template Architecture

> Single Source of Truth for visual styles, animation dynamics, and layout structures extracted from the 57 reference images.  
> All components strictly adhere to Rule R1 (NO SFX/music) and Rule R3 (VantaBrief Brand Palette: `#231F20` Charcoal, `#FAF4D9` Cream, `#1677FF` Electric Blue, `#F59E0B` Amber Marker, `#EF4444` Crimson Punch).

---

## Catalog Index by Family

### Family A: Cinematic Footage & Framing (Templates 01–09)
1. **`cinematic-single-word`**: Single high-contrast punch word centered on pure dark canvas or dimmed footage.
2. **`cinematic-chapter-solid`**: Left-aligned high-mass chapter card with bold ordinal number (`01`, `02`).
3. **`cinematic-fullbleed-headline`**: Full-bleed background footage with giant 20% opacity background headline and typewriter mono caption.
4. **`cinematic-bw-subject-labels`**: Desaturated B&W footage plane with floating directional connector labels around focal subjects.
5. **`cinematic-framed-columns`**: Rounded-corner framed video card centered with asymmetrical text columns left and right (one in `#1677FF`).
6. **`cinematic-tinted-overlay`**: Color-graded dark charcoal clip with large centered sans statement and animated underline.
7. **`cinematic-tilted-polaroid`**: Floating polaroid frame tilted `±6°` with shadow hovering above supporting text.
8. **`cinematic-split-focus`**: 50/50 vertical division with motion footage on one side and bold editorial statement on the other.
9. **`cinematic-letterbox-scope`**: 2.39:1 widescreen matte letterbox bars with kinetic type expanding within safe margins.

### Family B: Meme, Sticker Cutout & Parallax (Templates 10–18)
10. **`cutout-slam-keyword`**: Transparent founder/creator sticker cutout with thick `#FAF4D9` border entering on spring overshoot alongside a slammed keyword.
11. **`cutout-stacked-emoji`**: Cutout persona flanked by a vertical kinetic ladder of big emoji graphics revealing on spoken syllables.
12. **`cutout-vintage-handwritten`**: Person cutout paired with a cursive handwritten phrase (`'Permanent Marker'`) in `#F59E0B` and a heavy caps punchline.
13. **`cutout-floating-logo-cluster`**: Parallax cloud of official tech SVGs drifting at varying sinusoidal frequencies behind a foreground card.
14. **`cutout-meme-diagram-interrupt`**: Full-screen reaction meme card overlaid on top of a low-opacity technical diagram.
15. **`cutout-film-word-overlay`**: Movie/pop-culture clip paired with a single stark white impact noun.
16. **`cutout-photo-top-bottom`**: Classical top/bottom impact typography layout over a sticker-outlined media asset.
17. **`cutout-emoji-bold-phrase`**: Oversized animated emoji pop accompanied by a short 3-word bold headline.
18. **`cutout-duo-faceoff`**: Two opposing sticker cutouts (e.g., Closed SaaS CEO vs Open Source Creator) on opposing sides of the screen.

### Family C: Data, Metrics & Price Explainers (Templates 19–27)
19. **`data-price-slider`**: Horizontal track with an animated indicator sliding from proprietary high-tier pricing down to `$0`.
20. **`data-comparison-line`**: Clean horizontal baseline with tagged pill markers showing price-to-performance tiers.
21. **`data-bar-comparison`**: Side-by-side or stacked vertical bar charts comparing speed, tokens/sec, or licensing freedom.
22. **`data-byte-segment-layout`**: Memory/hardware block diagram highlighting local RAM allocations (e.g., 8-bit quantized weights).
23. **`data-product-card`**: Elegant macOS/VantaBrief SaaS product invoice card displaying annual subscription cost.
24. **`data-tokens-per-sec`**: Glowing speed gauge bar with real-time dynamic number readout.
25. **`data-stat-counter`**: Glowing numerical counter counting up via `easeOutExpo` with prefix/suffix formatting.
26. **`data-ring-percentage`**: Radial SVG progress arc drawing `0% ➔ 99.4%` parity score with central metric display.
27. **`data-countdown-clock`**: Digital flip clock or countdown timer marking technical release dates and milestones.

### Family D: Investigation, Glow-Grid & UI Systems (Templates 28–38)
28. **`investigation-tweet-card`**: Social post / GitHub issue card with sweeping yellow highlighter across the crucial revelation phrase.
29. **`investigation-stacked-posts`**: Cascading deck of 3 staggered community cards fanning out in sequence.
30. **`investigation-timeline-scrubber`**: Horizontal progression track with a glowing scrubber head and synchronized date pins.
31. **`investigation-date-strip`**: Horizontal chronological pill strip with a bracketed milestone callout.
32. **`investigation-article-highlight`**: Full-bleed research paper / blog screenshot with an expanding left-to-right yellow marker bar.
33. **`investigation-dashboard-stats`**: High-DPI application analytics dashboard with glowing callout badges.
34. **`investigation-toggle-switch`**: Interactive UI toggle flipping from "Closed API" to "Local Offline".
35. **`investigation-node-flow`**: Multi-server infrastructure grid with glowing animated electrical pulses between nodes.
36. **`investigation-stamp-overlay`**: High-impact diagonal warning/status stamp (e.g., "COMMODITIZED", "DEPRECATED").
37. **`investigation-terminal-window`**: macOS dark terminal typing out CLI commands with syntax-highlighted code.
38. **`investigation-two-parts`**: Two-column architectural split comparing "Open Weights" vs "Closed Infrastructure".

### Family E: Hand-Drawn & Schematic Explainers (Templates 39–47)
39. **`schematic-pipeline-draw`**: Boxes-and-arrows data pipeline self-drawing via `strokeDashoffset` on exact spoken timestamps.
40. **`schematic-speech-bubble`**: Hand-drawn comic speech bubble or thought callout pinning to a cutout persona.
41. **`schematic-cell-grid-counter`**: Grid of modular compute cells illuminating sequentially as compute scales.
42. **`schematic-docs-chip`**: Technical documentation view with an animated pointer label chip.
43. **`schematic-chat-zoom`**: Message conversation interface with a smooth camera push into the critical chat response.
44. **`schematic-bold-slam-blur`**: Giant 160px keyword slammed in foreground over a 20px blurred app screenshot.
45. **`schematic-checklist-reveal`**: Staggered listicle with glowing checkmark icons triggering on spoken words.
46. **`schematic-venn-intersection`**: Two overlapping neon circular sets revealing common engineering advantages.
47. **`schematic-funnel-conversion`**: Architectural funnel illustrating compute migration from cloud APIs to local hardware.

---

## Universal Template Parametrization Engine
Every single template implements the `TemplateProps` interface allowing infinite procedural variety:
- `position`: `'left' | 'center' | 'right'`
- `mirror`: `boolean` (horizontal flip of layout geometry)
- `scale`: `number` (0.8 to 1.25)
- `bgVariant`: `'charcoal' | 'grid3d' | 'starfield' | 'subtleRadial' | 'blurredAsset'`
- `cameraMove`: `'pushIn' | 'pullOut' | 'driftLeft' | 'driftRight' | 'shake' | 'breathing'`
- `typographyPreset`: `'punchSlam' | 'editorialSplit' | 'headlineAccent' | 'codeMono'`
- `inVariant`: `'springPop' | 'slideUp' | 'wipeLeft' | 'snapScale'`
- `outVariant`: `'scaleDown' | 'slideDown' | 'flashWipe' | 'fade'`
