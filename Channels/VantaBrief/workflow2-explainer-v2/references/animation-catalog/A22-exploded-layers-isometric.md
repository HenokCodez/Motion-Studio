# A22 — Exploded Layers (isometric)
**Category:** Diagrams/systems  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A22.png` (open it together with this file)

## Best used when
Showing internal structure/layers coming apart ('3D Explode', architecture internals).

## Not suitable when
Flat lists.

## Duration and easing
- Duration: **96 frames @30fps (3.2s)**
- Easing: explode EASE.out f22-58 (plates travel 180-200px); labels fade f50-74
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 12 | 3 plates nearly stacked, appearing |
| 26 | plates starting to separate |
| 40 | mid-explosion, guide lines fading in |
| 58 | fully exploded, dashed guides visible |
| 95 | rest: 3 diamonds at y 300/500/700 + labels right; middle orange |

## Plain-English motion script
1. Three isometric plates start stacked.
2. They separate vertically; dashed guide lines connect their corners.
3. Labels with leader lines appear on the right.

## Callouts on the filmstrip
1. (frame 12) plates start stacked
2. (frame 40) plates separate
3. (frame 95) labels + leader lines

## Parameters
- `layers`: array of 3 strings <=20 chars
- `highlight`: index

## Max content
3 plates, labels <=20 chars at 40px

## Layout footprint
~1070 x 580 px

## Color usage rules
Highlighted plate orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A22.tsx`
```tsx
import {A22} from './animations/A22';
// registered in components/animations/index.ts, composition id "A22", 96 frames
<A22 layers=... highlight=... />
```
