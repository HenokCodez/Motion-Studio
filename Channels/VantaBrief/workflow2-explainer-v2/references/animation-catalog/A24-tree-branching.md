# A24 — Tree / Branching
**Category:** Diagrams/systems  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A24.png` (open it together with this file)

## Best used when
Hierarchy or a plan that splits into 3 parts ('3-step strategy').

## Not suitable when
More than 3 children.

## Duration and easing
- Duration: **90 frames @30fps (3.0s)**
- Easing: root EASE.inOut f0-16; trunk f14-26; branches f24-40; children EASE.out 14f staggered 6f from f38
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 12 | root outline drawing |
| 26 | root done; trunk drawn |
| 40 | horizontal branch drawn |
| 56 | children 1-2 in |
| 89 | rest: root + 3 children, right one orange |

## Plain-English motion script
1. Root card draws, a trunk drops, a horizontal bar splits left and right, children cards appear.

## Callouts on the filmstrip
1. (frame 12) root draws
2. (frame 40) branches split
3. (frame 89) highlighted child orange

## Parameters
- `root`: string <=24 chars
- `children`: array of 3 strings <=16 chars
- `highlight`: index

## Max content
root <=24 chars, children <=16 chars at 48px

## Layout footprint
1520 x 600 px

## Color usage rules
Highlighted child orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A24.tsx`
```tsx
import {A24} from './animations/A24';
// registered in components/animations/index.ts, composition id "A24", 90 frames
<A24 root=... children=... />
```
