# A19 — Node-Link Flow (3 nodes)
**Category:** Diagrams/systems  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A19.png` (open it together with this file)

## Best used when
A 3-step flow with one highlighted step ('Hairspring -> 3D Explode -> 3D Space').

## Not suitable when
Flows with branches or >3 nodes (use A24/A21).

## Duration and easing
- Duration: **84 frames @30fps (2.8s)**
- Easing: nodes EASE.inOut 14f at f0/22/44; arrows EASE.inOut 12f at f14/36; pulse ring EASE.out f60-84
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 10 | node 1 drawing |
| 26 | node 1 done, arrow 1 drawn, node 2 starting |
| 44 | node 2 orange, arrow 2 drawing, node 3 starting |
| 62 | all done, pulse ring starting around node 2 |
| 83 | rest: 3 nodes + 2 arrows, ring faded |

## Plain-English motion script
1. Node 1 draws with icon and label.
2. Arrow 1 draws, node 2 (orange) appears, arrow 2 draws, node 3 appears.
3. An orange ring expands around the highlighted node and fades.

## Callouts on the filmstrip
1. (frame 10) node 1 draws
2. (frame 26) arrow shoots out
3. (frame 62) orange pulse ring on highlight

## Parameters
- `nodes`: array of 3 {label<=12 chars, icon: ICONS key}
- `highlight`: index 0-2

## Max content
3 nodes, labels <=12 chars at 44px

## Layout footprint
1580 x 150 px (82% x 14%)

## Color usage rules
Highlighted node + ring orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A19.tsx`
```tsx
import {A19} from './animations/A19';
// registered in components/animations/index.ts, composition id "A19", 84 frames
<A19 nodes=... highlight=... />
```
