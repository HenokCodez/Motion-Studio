# A34 — Icon Tile Focus Row
**Category:** Lists/steps/process  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A34.png` (open it together with this file)

## Best used when
Choosing one of 4 options/tools; one gets selected.

## Not suitable when
More than 4 items.

## Duration and easing
- Duration: **84 frames @30fps (2.8s)**
- Easing: tiles EASE.out 16f staggered 5f; focus ring appears f28-36; hop EASE.inOut f46-58
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 12 | tiles 1-3 drawing |
| 28 | all tiles in; focus not yet |
| 40 | focus on tile 2, tile filled |
| 56 | focus hopping to target |
| 83 | rest: focus on target tile (orange fill) |

## Plain-English motion script
1. Four tiles build.
2. An orange focus ring lands on tile 2 then hops to the target tile, which fills and turns orange.

## Callouts on the filmstrip
1. (frame 12) tiles build
2. (frame 40) focus ring lands
3. (frame 83) hops to target

## Parameters
- `icons`: 4 ICONS keys
- `labels`: 4 strings <=10 chars
- `target`: index 0-3

## Max content
4 tiles, labels <=10 chars at 36px

## Layout footprint
1360 x 280 px

## Color usage rules
Focused tile orange only.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A34.tsx`
```tsx
import {A34} from './animations/A34';
// registered in components/animations/index.ts, composition id "A34", 84 frames
<A34 icons=... labels=... />
```
