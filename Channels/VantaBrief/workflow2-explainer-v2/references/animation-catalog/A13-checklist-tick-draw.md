# A13 — Checklist Tick-Draw
**Category:** Lists/steps/process  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A13.png` (open it together with this file)

## Best used when
Listing 2-4 short criteria or features that all get ticked off.

## Not suitable when
More than 4 items or long sentences.

## Duration and easing
- Duration: **84 frames @30fps (2.8s)**
- Easing: box EASE.inOut 10f; text wipe EASE.inOut 16f; tick EASE.back 12f; rows staggered 20f from f8
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 12 | row 1 box drawn, text wiping |
| 28 | row 1 tick being drawn; row 2 box+text appearing |
| 46 | rows 1-2 ticked; row 3 text wiping |
| 66 | all rows ticked, last tick drawing |
| 83 | rest: 3 rows x (64px box + 56px text + orange tick) |

## Plain-English motion script
1. Each row: a rough 64px box draws, the text wipes in beside it, then an orange tick draws over the box with overshoot.
2. Rows start 20 frames apart.

## Callouts on the filmstrip
1. (frame 12) box draws
2. (frame 28) orange tick draws over box
3. (frame 46) next row starts 20f later

## Parameters
- `items`: array 2-4 strings, each <=28 chars

## Max content
<=4 items, <=28 chars each at 56px

## Layout footprint
~880 x 440 px centered

## Color usage rules
Ticks orange (one group); boxes and text cream.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A13.tsx`
```tsx
import {A13} from './animations/A13';
// registered in components/animations/index.ts, composition id "A13", 84 frames
<A13 items=... />
```
