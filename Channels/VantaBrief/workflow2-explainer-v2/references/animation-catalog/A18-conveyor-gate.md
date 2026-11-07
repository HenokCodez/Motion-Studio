# A18 — Conveyor Gate
**Category:** Lists/steps/process  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A18.png` (open it together with this file)

## Best used when
A process that transforms inputs ('raw -> agent -> result').

## Not suitable when
Static comparisons.

## Duration and easing
- Duration: **96 frames @30fps (3.2s)**
- Easing: belt EASE.inOut f0-14; boxes EASE.inOut 54f staggered 14f from f10; box turns orange after crossing x=960
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 14 | belt + gate drawn, box 1 entering left |
| 30 | boxes 1-2 on the belt left of the gate, box 1 approaching it |
| 46 | box 1 has passed the gate and is orange on the right; boxes 2-3 left of the gate |
| 66 | boxes 1-2 orange on the right; box 3 entering the gate |
| 95 | rest: three orange boxes (150px, 50px gaps) right of the gate |

## Plain-English motion script
1. The belt and an orange gate draw.
2. Three cream boxes travel left to right, pass behind the gate, and come out orange.

## Callouts on the filmstrip
1. (frame 14) gate (orange)
2. (frame 30) cream boxes enter
3. (frame 66) boxes exit orange

## Parameters
- `gate`: string <=10 chars

## Max content
3 boxes, gate label <=10 chars

## Layout footprint
1550 x 270 px

## Color usage rules
Gate and exited boxes orange; entering boxes cream.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A18.tsx`
```tsx
import {A18} from './animations/A18';
// registered in components/animations/index.ts, composition id "A18", 96 frames
<A18 gate=... />
```
