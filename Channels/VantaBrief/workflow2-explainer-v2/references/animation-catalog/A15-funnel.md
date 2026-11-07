# A15 — Funnel
**Category:** Lists/steps/process  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A15.png` (open it together with this file)

## Best used when
Many inputs narrowing to one result ('papers, demos, leaderboards -> real score').

## Not suitable when
More than 3 inputs.

## Duration and easing
- Duration: **90 frames @30fps (3.0s)**
- Easing: funnel outline EASE.inOut f0-16; chips drop EASE.inOut 24f staggered 12f from f10, shrink to 40%; result spring pop at f58
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 14 | funnel drawn; chip 1 falling |
| 30 | chips 1-2 falling and shrinking |
| 46 | chip 3 falling; chip 1 gone |
| 62 | all chips merged; result popping |
| 89 | rest: funnel + orange result card below spout |

## Plain-English motion script
1. The funnel outline draws.
2. Three chips drop in one after another, drift to the centre, shrink to 40% and fade out inside the funnel.
3. The orange result card pops below the spout.

## Callouts on the filmstrip
1. (frame 14) funnel outline draws
2. (frame 30) chips drop + shrink
3. (frame 62) orange result pops

## Parameters
- `chips`: array of 3 strings <=11 chars
- `result`: string <=16 chars

## Max content
3 chips <=11 chars, result <=16 chars

## Layout footprint
900 x 660 px

## Color usage rules
Result card orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A15.tsx`
```tsx
import {A15} from './animations/A15';
// registered in components/animations/index.ts, composition id "A15", 90 frames
<A15 chips=... result=... />
```
