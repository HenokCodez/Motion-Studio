# A40 — Spark Burst Badge
**Category:** Emphasis/State  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A40.png` (open it together with this file)

## Best used when
'New/Breaking/Key' sticker moments.

## Not suitable when
Long text.

## Duration and easing
- Duration: **60 frames @30fps (2.0s)**
- Easing: badge spring pop {damping:12,stiffness:140,mass:0.7} f4; rays EASE.out f10-22, fade f24-36
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 8 | badge popping |
| 14 | badge 1.1x, rays drawing |
| 22 | rays complete |
| 34 | rays gone |
| 59 | rest: orange-outlined badge with label |

## Plain-English motion script
1. A circular badge pops in; 12 orange rays burst around it and fade.

## Callouts on the filmstrip
1. (frame 8) badge pops
2. (frame 22) rays burst

## Parameters
- `label`: string <=6 chars uppercase

## Max content
label <=6 chars at 120px

## Layout footprint
430 x 430 px

## Color usage rules
Badge outline, label and rays orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A40.tsx`
```tsx
import {A40} from './animations/A40';
// registered in components/animations/index.ts, composition id "A40", 60 frames
<A40 label=... />
```
