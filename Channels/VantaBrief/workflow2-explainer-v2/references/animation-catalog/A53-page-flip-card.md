# A53 — Page Flip Card
**Category:** Camera/transitions  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A53.png` (open it together with this file)

## Best used when
Switching between two states/pages of one card.

## Not suitable when
Unrelated scenes.

## Duration and easing
- Duration: **72 frames @30fps (2.4s)**
- Easing: squash EASE.inOut f12-30 (scaleX 1->0), expand EASE.back f30-48; lift sin() -24px
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | card drawing |
| 8 | front face |
| 18 | card squashing |
| 30 | edge-on (nearly invisible) |
| 40 | back face expanding (orange) |
| 71 | rest: back face, orange |

## Plain-English motion script
1. The card squashes horizontally to an edge, swaps face, expands again as an orange card.

## Callouts on the filmstrip
1. (frame 8) front face
2. (frame 30) flips edge-on
3. (frame 71) orange back

## Parameters
- `front`: <=12 chars
- `back`: <=12 chars

## Max content
<=12 chars at 96px

## Layout footprint
700 x 420 px

## Color usage rules
Back face orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A53.tsx`
```tsx
import {A53} from './animations/A53';
// registered in components/animations/index.ts, composition id "A53", 72 frames
<A53 front=... back=... />
```
