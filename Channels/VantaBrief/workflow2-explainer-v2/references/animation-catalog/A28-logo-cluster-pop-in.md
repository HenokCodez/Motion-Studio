# A28 — Logo Cluster Pop-in
**Category:** Logos/brand  |  **Status:** rendered (logo/screenshot slots show labelled placeholders until assets are fetched)  |  **Filmstrip:** `filmstrips/A28.png` (open it together with this file)

## Best used when
A group of real logos ('other closed-tier models' -> ChatGPT, Claude, Gemini, Grok...), then one highlighted.

## Not suitable when
Single logo (use A27).

## Duration and easing
- Duration: **84 frames @30fps (2.8s)**
- Easing: tiles: spring pop {12,140,0.7} staggered 6f from f4; dim others EASE-linear f54-66
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 10 | tiles 1-2 popping |
| 22 | tiles 1-4 in |
| 40 | all 6 tiles in |
| 60 | others dimming, highlight turning orange |
| 83 | rest: highlighted tile orange, others at 45% |

## Plain-English motion script
1. Tiles (240x200) spring in one by one.
2. Tile content = real logo from assets/logos/<file> (placeholder circle + initial if file missing).
3. Then all but the highlighted tile dim and the highlighted tile turns orange.

## Callouts on the filmstrip
1. (frame 10) tiles pop in
2. (frame 40) real logo per tile
3. (frame 83) others dim, one turns orange

## Parameters
- `names`: array 3-6 strings <=12 chars
- `files`: array of filenames in assets/logos/ (same order)
- `highlight`: index or -1

## Max content
<=6 tiles, names <=12 chars at 28px

## Layout footprint
840 x 460 px

## Color usage rules
Highlighted tile orange only. Logos keep native colors.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A28.tsx`
```tsx
import {A28} from './animations/A28';
// registered in components/animations/index.ts, composition id "A28", 84 frames
<A28 names=... files=... />
```
