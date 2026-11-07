# A54 — Zoom Through Portal
**Category:** Camera/transitions  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A54.png` (open it together with this file)

## Best used when
Entering a topic ('inside the model').

## Not suitable when
Calm beats.

## Duration and easing
- Duration: **72 frames @30fps (2.4s)**
- Easing: zoom 1->23x cubic f10-42; portal fades f36-44; new title EASE.out f40-56
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | ring drawing |
| 10 | ring + label, zoom starting |
| 24 | ring growing |
| 36 | ring filling the frame |
| 48 | new title appearing |
| 71 | rest: orange title centered |

## Plain-English motion script
1. A ring with a label draws; the camera zooms through it (cubic) and the next title appears.

## Callouts on the filmstrip
1. (frame 10) portal ring
2. (frame 36) zoom through
3. (frame 71) new title

## Parameters
- `portal`: <=8 chars
- `title`: <=20 chars

## Max content
title <=20 chars at 100px

## Layout footprint
rest: ~1100 x 120 px

## Color usage rules
Title orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A54.tsx`
```tsx
import {A54} from './animations/A54';
// registered in components/animations/index.ts, composition id "A54", 72 frames
<A54 portal=... title=... />
```
