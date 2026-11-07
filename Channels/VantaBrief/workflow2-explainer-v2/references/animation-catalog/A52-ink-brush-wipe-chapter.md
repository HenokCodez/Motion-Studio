# A52 — Ink Brush Wipe + Chapter
**Category:** Camera/transitions  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A52.png` (open it together with this file)

## Best used when
Chapter changes.

## Not suitable when
Mid-scene beats.

## Duration and easing
- Duration: **84 frames @30fps (2.8s)**
- Easing: brush strokes EASE.inOut 20f staggered 3f from f10; fade f34-48; new title f40-52; blue underline f50-64
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | first chapter title |
| 12 | brush strokes starting |
| 22 | strokes crossing |
| 34 | full coverage |
| 46 | strokes fading, new title appearing |
| 83 | rest: new title with blue underline |

## Plain-English motion script
1. Five thick cream brush strokes sweep left to right covering the title, fade away, and reveal the new chapter title with a blue underline (chapter-card identity role).

## Callouts on the filmstrip
1. (frame 12) brush strokes sweep
2. (frame 34) cover title
3. (frame 83) blue underline

## Parameters
- `from`: <=14 chars
- `to`: <=14 chars

## Max content
titles <=14 chars at 110px

## Layout footprint
~1600 x 500 px

## Color usage rules
Underline blue (chapter card role); strokes/titles cream.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A52.tsx`
```tsx
import {A52} from './animations/A52';
// registered in components/animations/index.ts, composition id "A52", 84 frames
<A52 from=... to=... />
```
