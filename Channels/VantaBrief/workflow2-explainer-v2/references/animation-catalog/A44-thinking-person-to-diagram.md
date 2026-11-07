# A44 — Thinking Person to Diagram
**Category:** People/characters  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A44.png` (open it together with this file)

## Best used when
An idea turning into a structure ('think, then diagram').

## Not suitable when
More than 3 nodes.

## Duration and easing
- Duration: **90 frames @30fps (3.0s)**
- Easing: bubble EASE.inOut f10-30; bolt fade f24-36 out f46-54; nodes f52-72 staggered 6f
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | figure drawing |
| 10 | figure + thought dots |
| 24 | bubble drawn, orange bolt appearing |
| 40 | bolt visible |
| 58 | bolt gone, nodes appearing |
| 89 | rest: figure + bubble with 3 linked nodes |

## Plain-English motion script
1. Figure in thinking pose; thought dots then a bubble draw; an orange bolt (the idea) shows then is replaced by a 3-node diagram.

## Callouts on the filmstrip
1. (frame 10) thinking figure
2. (frame 40) bubble + idea bolt
3. (frame 89) bolt becomes diagram

## Parameters
- `nodes`: 3 strings <=8 chars

## Max content
3 nodes, labels <=8 chars at 24px

## Layout footprint
~1000 x 750 px

## Color usage rules
Bolt and middle node orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A44.tsx`
```tsx
import {A44} from './animations/A44';
// registered in components/animations/index.ts, composition id "A44", 90 frames
<A44 nodes=... />
```
