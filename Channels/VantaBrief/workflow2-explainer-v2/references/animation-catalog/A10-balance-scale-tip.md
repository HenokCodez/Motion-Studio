# A10 — Balance Scale Tip
**Category:** Comparisons  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A10.png` (open it together with this file)

## Best used when
Weighing two things where one clearly outweighs ('paper metrics vs real workloads').

## Not suitable when
More than two items.

## Duration and easing
- Duration: **90 frames @30fps (3.0s)**
- Easing: build EASE.inOut f0-14; cards EASE.out f6-24; tip: spring {damping:5,stiffness:70,mass:1} from f20, final angle 7° (right side down)
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 10 | fulcrum + beam drawing |
| 20 | beam level, both pan-cards drawn |
| 30 | beam tipping, overshoots to ~9° |
| 44 | beam rebounds ~5° |
| 89 | rest: beam 7° right-down, cards upright |

## Plain-English motion script
1. f0-14: fulcrum triangle, base line and beam draw.
2. f6-24: strings and two pan-cards draw in (cards stay upright when the beam rotates).
3. f20+: the beam tips right with an under-damped spring, wobbles and settles at 7°.

## Callouts on the filmstrip
1. (frame 10) fulcrum + beam draw
2. (frame 20) left card = blue outline (contrast)
3. (frame 30) beam tips, overshoots
4. (frame 89) right (orange) side heavier

## Parameters
- `left`: <=16 chars
- `right`: <=16 chars

## Max content
each label <=16 chars at 40px

## Layout footprint
~1340 x 420 px (70% x 39%)

## Color usage rules
Right card orange (argued side), left card blue outline (contrast pair role). Beam cream.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A10.tsx`
```tsx
import {A10} from './animations/A10';
// registered in components/animations/index.ts, composition id "A10", 90 frames
<A10 left=... right=... />
```
