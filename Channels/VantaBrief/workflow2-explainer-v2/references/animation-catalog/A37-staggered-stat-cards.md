# A37 — Staggered Stat Cards
**Category:** Data  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A37.png` (open it together with this file)

## Best used when
Three headline stats side by side.

## Not suitable when
One stat (use A07).

## Duration and easing
- Duration: **90 frames @30fps (3.0s)**
- Easing: cards EASE.out 20f staggered 10f from f4 (rise 60px); numbers count up EASE.out 36f
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 12 | card 1 rising |
| 28 | cards 1-2 up, counting |
| 44 | all 3 in, counting |
| 62 | counts finishing |
| 89 | rest: 3 cards at staggered heights, third orange |

## Plain-English motion script
1. Three cards rise in at different heights; numbers count up; the third is orange.

## Callouts on the filmstrip
1. (frame 12) cards rise in
2. (frame 44) numbers count up
3. (frame 89) orange card

## Parameters
- `stats`: 3 {v number, s suffix, l label<=16 chars}

## Max content
3 cards, labels <=16 chars

## Layout footprint
1580 x 420 px

## Color usage rules
Third card orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A37.tsx`
```tsx
import {A37} from './animations/A37';
// registered in components/animations/index.ts, composition id "A37", 90 frames
<A37 stats=... />
```
