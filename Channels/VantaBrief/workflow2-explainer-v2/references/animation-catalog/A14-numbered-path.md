# A14 — Numbered Path
**Category:** Lists/steps/process  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A14.png` (open it together with this file)

## Best used when
Sequential 3-step process told left to right.

## Not suitable when
More than 3 steps or branching flows.

## Duration and easing
- Duration: **90 frames @30fps (3.0s)**
- Easing: path EASE.inOut f6-62; stop pops: spring pop when path reaches each stop
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 10 | path starting, stop 1 popped |
| 24 | path ~35% drawn, approaching stop 2 |
| 40 | stop 2 popped at top of the curve |
| 62 | path complete; stop 3 popped (orange) |
| 89 | rest: S-curve with 3 numbered stops + labels |

## Plain-English motion script
1. An S-curved line draws from the lower left to the right.
2. Each numbered circle springs in as the line reaches it; its label appears with it.
3. The last stop is orange.

## Callouts on the filmstrip
1. (frame 10) stop 1 pops first
2. (frame 24) line draws toward stop 2
3. (frame 62) last stop = orange

## Parameters
- `labels`: array of 3 strings <=16 chars

## Max content
3 stops, labels <=16 chars at 40px

## Layout footprint
~1450 x 480 px

## Color usage rules
Last stop orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A14.tsx`
```tsx
import {A14} from './animations/A14';
// registered in components/animations/index.ts, composition id "A14", 90 frames
<A14 labels=... />
```
