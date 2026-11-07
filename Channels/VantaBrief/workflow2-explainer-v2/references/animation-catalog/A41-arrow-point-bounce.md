# A41 — Arrow Point Bounce
**Category:** Emphasis/State  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A41.png` (open it together with this file)

## Best used when
Pointing at a specific item ('this one').

## Not suitable when
Several targets.

## Duration and easing
- Duration: **66 frames @30fps (2.2s)**
- Easing: card EASE.inOut f0-14; arrow EASE.out f10-28; bounce sin(0.55f)*16px along arrow, decaying from f30
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 8 | card drawing |
| 14 | arrow ~25% drawn |
| 26 | arrow complete |
| 40 | arrow bouncing toward card |
| 65 | rest: arrow resting near card corner |

## Plain-English motion script
1. Target card draws; a big orange arrow draws in from the lower left and bounces toward it.

## Callouts on the filmstrip
1. (frame 8) target card
2. (frame 14) arrow draws
3. (frame 40) arrow bounces

## Parameters
- `target`: string <=14 chars

## Max content
target <=14 chars at 48px

## Layout footprint
~800 x 480 px

## Color usage rules
Arrow orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A41.tsx`
```tsx
import {A41} from './animations/A41';
// registered in components/animations/index.ts, composition id "A41", 66 frames
<A41 target=... />
```
