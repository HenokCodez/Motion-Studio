# A23 — Pipeline with Packets
**Category:** Diagrams/systems  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A23.png` (open it together with this file)

## Best used when
Data/requests moving through stages ('Ingest, Route, Compute, Serve').

## Not suitable when
Non-sequential systems.

## Duration and easing
- Duration: **96 frames @30fps (3.2s)**
- Easing: stages EASE.out 14f staggered 6f; packets (r=24) linear 36f each, one every 12f from f22; packets turn orange after the highlighted stage
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 14 | stages 1-3 built, arrows drawing |
| 30 | all stages built; packet 1 leaves stage 1 |
| 46 | packet 1 behind stage 2; packet 2 out |
| 62 | packet 1 orange after stage 3; packet 3 out |
| 95 | rest: pipeline, packets gone |

## Plain-English motion script
1. Four stage boxes build left to right with arrows between them.
2. Three packets travel along the line (hidden when inside boxes) and turn orange after the highlighted stage.

## Callouts on the filmstrip
1. (frame 14) stages build
2. (frame 30) packet travels
3. (frame 62) packet turns orange

## Parameters
- `stages`: array of 4 strings <=10 chars
- `highlight`: index

## Max content
4 stages <=10 chars at 40px

## Layout footprint
1590 x 110 px

## Color usage rules
Highlighted stage orange; packets orange after it.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A23.tsx`
```tsx
import {A23} from './animations/A23';
// registered in components/animations/index.ts, composition id "A23", 96 frames
<A23 stages=... highlight=... />
```
