# A21 — Hub and Spokes
**Category:** Diagrams/systems  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A21.png` (open it together with this file)

## Best used when
One thing with 4 attributes/uses ('DeepSeek: open weights, low cost, ...').

## Not suitable when
More than 4 satellites.

## Duration and easing
- Duration: **90 frames @30fps (3.0s)**
- Easing: hub EASE.inOut f0-16; spokes EASE.inOut 14f staggered 8f from f18; satellites 14f from f28
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 10 | hub outline half drawn |
| 24 | hub orange; spoke 1-2 drawing |
| 40 | spokes 1-3 drawn; satellites 1-2 in |
| 58 | all spokes drawn; satellite 4 appearing |
| 89 | rest: orange hub center + 4 satellites in corners |

## Plain-English motion script
1. The orange hub draws in the center.
2. Four spokes draw out to the corners, each followed by its satellite card and label.

## Callouts on the filmstrip
1. (frame 10) hub draws
2. (frame 24) spokes draw to corners
3. (frame 89) satellite cards

## Parameters
- `hub`: string <=10 chars
- `spokes`: array of 4 strings <=12 chars

## Max content
hub <=10 chars at 48px; 4 satellites <=12 chars at 36px

## Layout footprint
Full safe frame (1560 x 700)

## Color usage rules
Hub orange only.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A21.tsx`
```tsx
import {A21} from './animations/A21';
// registered in components/animations/index.ts, composition id "A21", 90 frames
<A21 hub=... spokes=... />
```
