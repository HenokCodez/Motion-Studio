# A20 — Layered Stack
**Category:** Diagrams/systems  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A20.png` (open it together with this file)

## Best used when
Stacks/tiers/architecture layers with a 'you are here' layer.

## Not suitable when
Non-hierarchical relations.

## Duration and easing
- Duration: **84 frames @30fps (2.8s)**
- Easing: layers EASE.out 14f, built bottom to top, staggered 12f; note arrow EASE.out f64-76
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 10 | bottom layer dropping in |
| 24 | bottom two layers in place |
| 38 | all four layers in place |
| 60 | stack complete; note not yet |
| 83 | rest: stack + orange arrow + note at highlighted layer |

## Plain-English motion script
1. Layers drop in from above one by one, starting with the bottom layer.
2. An orange arrow and note point at the highlighted layer.

## Callouts on the filmstrip
1. (frame 10) bottom layer first
2. (frame 38) top layer last
3. (frame 83) orange arrow + note

## Parameters
- `layers`: array of 3-4 strings <=24 chars
- `highlight`: index
- `note`: string <=16 chars

## Max content
<=4 layers, labels <=24 chars

## Layout footprint
700 x 460 px + note (1100 wide)

## Color usage rules
Highlighted layer, arrow, note orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A20.tsx`
```tsx
import {A20} from './animations/A20';
// registered in components/animations/index.ts, composition id "A20", 84 frames
<A20 layers=... highlight=... />
```
