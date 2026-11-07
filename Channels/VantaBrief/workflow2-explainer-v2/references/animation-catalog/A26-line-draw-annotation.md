# A26 — Line Draw + Annotation
**Category:** Data  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A26.png` (open it together with this file)

## Best used when
A trend with one moment worth pointing at ('Real-world jump').

## Not suitable when
Category comparisons.

## Duration and easing
- Duration: **96 frames @30fps (3.2s)**
- Easing: axes f0-18; line EASE.inOut f18-64; circle EASE.out f66-78; note wipe EASE.inOut f76-92
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 14 | axes drawn |
| 30 | line ~25% drawn |
| 46 | line ~65% drawn |
| 66 | line complete; orange circle starting at last point |
| 95 | rest: circle + leader + note |

## Plain-English motion script
1. Axes draw, the line draws left to right with dots appearing as it passes them.
2. An orange pen circle draws around the last point, a leader line and note follow.

## Callouts on the filmstrip
1. (frame 14) axes draw
2. (frame 46) line draws L→R
3. (frame 95) orange circle + note

## Parameters
- `values`: array of 5-6 numbers 0-100
- `note`: string <=18 chars

## Max content
6 points, note <=18 chars at 40px

## Layout footprint
1200 x 600 px

## Color usage rules
Circle, leader and note orange; line cream.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A26.tsx`
```tsx
import {A26} from './animations/A26';
// registered in components/animations/index.ts, composition id "A26", 96 frames
<A26 values=... note=... />
```
