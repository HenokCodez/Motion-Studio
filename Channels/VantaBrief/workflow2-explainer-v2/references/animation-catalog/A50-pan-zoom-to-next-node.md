# A50 — Pan-Zoom to Next Node
**Category:** Camera/transitions  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A50.png` (open it together with this file)

## Best used when
Moving attention from one node to the next on an infinite-canvas feel.

## Not suitable when
Single-object scenes.

## Duration and easing
- Duration: **90 frames @30fps (3.0s)**
- Easing: zoom EASE.inOut f20-30 to 1.2x; pan EASE.inOut f30-54; zoom-out f54-76 back to 1.0 centered
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | nodes drawing, camera 1.0 |
| 16 | both nodes + arrow visible |
| 30 | camera at 1.2x on left node |
| 46 | camera panning right |
| 60 | camera on right node, starting to zoom out |
| 89 | rest: camera 1.0, both nodes inside safe frame |

## Plain-English motion script
1. Two nodes with an arrow build. The camera zooms to 1.2x on the left node, pans to the right (orange) node, then zooms out so both rest inside the safe frame.

## Callouts on the filmstrip
1. (frame 16) nodes build
2. (frame 46) zoom in on node 1
3. (frame 60) pan right
4. (frame 89) zoom out to rest

## Parameters
- `left`: <=12 chars
- `right`: <=12 chars

## Max content
2 nodes <=12 chars at 48px

## Layout footprint
rest: 1380 x 140 px

## Color usage rules
Right node orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A50.tsx`
```tsx
import {A50} from './animations/A50';
// registered in components/animations/index.ts, composition id "A50", 90 frames
<A50 left=... right=... />
```
