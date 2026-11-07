# A56 — Logo Duel
**Category:** Logos/brand  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A56.png` (open it together with this file)

## Best used when
Two named products head to head.

## Not suitable when
More than two.

## Duration and easing
- Duration: **72 frames @30fps (2.4s)**
- Easing: tiles EASE.out f0-20 (700px travel); VS spring pop f22; winner EASE.inOut f50-62
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 8 | tiles sliding in |
| 18 | tiles in place |
| 30 | VS popping |
| 56 | right tile highlighting, left dimming |
| 71 | rest: right tile orange and 1.06x, left at 45% |

## Plain-English motion script
1. Two real logos slide in from the edges, VS pops, the right one wins (orange).

## Callouts on the filmstrip
1. (frame 8) left logo slides in
2. (frame 18) right logo slides in
3. (frame 30) VS
4. (frame 71) winner orange

## Parameters
- `left`: <=10 chars
- `right`: <=10 chars
- `leftFile`: file in assets/logos/
- `rightFile`: file in assets/logos/

## Max content
2 logos

## Layout footprint
1160 x 300 px + labels

## Color usage rules
Winner tile orange.

## Entrance from off-screen
Yes: frames before 40% of duration may be off-screen; the rest frames must be fully inside the safe frame.

## Component
`components/animations/A56.tsx`
```tsx
import {A56} from './animations/A56';
// registered in components/animations/index.ts, composition id "A56", 72 frames
<A56 left=... right=... />
```
