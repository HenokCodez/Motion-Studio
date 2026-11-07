# A16 — Staircase Climb
**Category:** Lists/steps/process  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A16.png` (open it together with this file)

## Best used when
Progression or maturity levels, 3-4 stages ('Test, Tune, Ship, Scale').

## Not suitable when
Non-ordered items.

## Duration and easing
- Duration: **90 frames @30fps (3.0s)**
- Easing: steps EASE.out 14f staggered 12f from f10; marker hops EASE.inOut 8f each from f54 (arc 80px)
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 16 | step 1 drawn, step 2 drawing |
| 30 | steps 1-3 drawn |
| 46 | all 4 steps drawn, last one orange; marker appears on step 1 |
| 62 | marker mid-hop towards step 3 |
| 89 | rest: marker on top of step 4 |

## Plain-English motion script
1. Four blocks of rising height build left to right.
2. An orange ball appears on step 1 and hops up one step at a time.

## Callouts on the filmstrip
1. (frame 16) steps build left→right
2. (frame 46) orange marker appears
3. (frame 62) marker hops up

## Parameters
- `steps`: array of 4 strings <=10 chars

## Max content
4 steps, labels <=10 chars at 40px

## Layout footprint
1200 x 480 px

## Color usage rules
Top step and marker orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A16.tsx`
```tsx
import {A16} from './animations/A16';
// registered in components/animations/index.ts, composition id "A16", 90 frames
<A16 steps=... />
```
