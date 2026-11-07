# A17 — Timeline Marker
**Category:** Lists/steps/process  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A17.png` (open it together with this file)

## Best used when
History/milestones across time (3 points).

## Not suitable when
More than 3 milestones.

## Duration and easing
- Duration: **84 frames @30fps (2.8s)**
- Easing: line EASE.inOut f0-20; marker EASE.inOut f30-70; chips spring pop at f34/52/70
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 12 | line 60% drawn |
| 36 | marker near milestone 1; chip 1 popping |
| 52 | marker mid-way; chip 2 popping |
| 70 | marker at milestone 3; chip 3 (orange) popping |
| 83 | rest: 3 chips + years, marker on last |

## Plain-English motion script
1. A baseline draws left to right.
2. An orange marker slides along it; each milestone chip + year pops as the marker arrives.
3. Final milestone is orange.

## Callouts on the filmstrip
1. (frame 12) baseline draws
2. (frame 36) chip pops when marker arrives
3. (frame 83) last milestone orange

## Parameters
- `items`: array of 3 {label<=12 chars, year<=6 chars}

## Max content
3 milestones

## Layout footprint
1420 x 300 px

## Color usage rules
Last chip + marker orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A17.tsx`
```tsx
import {A17} from './animations/A17';
// registered in components/animations/index.ts, composition id "A17", 84 frames
<A17 items=... />
```
