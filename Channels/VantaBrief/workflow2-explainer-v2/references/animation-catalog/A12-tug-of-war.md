# A12 — Tug of War
**Category:** Comparisons  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A12.png` (open it together with this file)

## Best used when
Two forces competing; 'closed vs open', 'cost vs capability'.

## Not suitable when
Neutral comparisons with no winner.

## Duration and easing
- Duration: **96 frames @30fps (3.2s)**
- Easing: rope EASE.out f0-12; shake sin(f*1.6)*6px f14-64; knot sin(f*0.55)*45px; win slide EASE.out f64-86 to +220px
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 10 | two cards and sagging rope drawing |
| 24 | rope taut; cards jitter; knot oscillating |
| 40 | knot swinging left of center |
| 66 | knot starts sliding right (winner) |
| 95 | rest: knot at x≈1180, left card dimmed + tilted |

## Plain-English motion script
1. f0-12: both cards and the rope draw in; rope sags 30px then tightens.
2. f14-64: cards shake in opposition, knot oscillates around center.
3. f64-86: orange side wins: knot slides 220px right, left card dims to 60% and tilts -3°.

## Callouts on the filmstrip
1. (frame 10) cards + rope draw in
2. (frame 24) knot oscillates
3. (frame 24) cards jitter
4. (frame 95) orange wins: knot slides right

## Parameters
- `left`: <=16 chars
- `right`: <=16 chars

## Max content
labels <=16 chars

## Layout footprint
~1612 x 170 px full safe width, 1 row

## Color usage rules
Right card + knot orange. Left cream.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A12.tsx`
```tsx
import {A12} from './animations/A12';
// registered in components/animations/index.ts, composition id "A12", 96 frames
<A12 left=... right=... />
```
