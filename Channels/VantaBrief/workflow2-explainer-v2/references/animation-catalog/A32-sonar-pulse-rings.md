# A32 — Sonar Pulse Rings
**Category:** Emphasis/State  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A32.png` (open it together with this file)

## Best used when
Signal/detection/'something is happening here' beats.

## Not suitable when
Static lists.

## Duration and easing
- Duration: **84 frames @30fps (2.8s)**
- Easing: dot spring pop f0; rings EASE.out radius 40->260 over 48f, looped, offset 14f
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | dot popping |
| 8 | dot, first ring starting |
| 20 | ring 1 mid-size, ring 2 starting |
| 36 | 2-3 rings visible, label wiping |
| 56 | rings looping |
| 83 | rest: dot + fading rings + label |

## Plain-English motion script
1. Orange dot pops.
2. Three orange rings expand from it and fade, looping every 48 frames.
3. Label wipes in below.

## Callouts on the filmstrip
1. (frame 8) dot pops
2. (frame 36) rings expand + fade
3. (frame 83) label

## Parameters
- `label`: string <=28 chars

## Max content
label <=28 chars at 56px

## Layout footprint
520 x 520 px + label

## Color usage rules
Everything orange except the label.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A32.tsx`
```tsx
import {A32} from './animations/A32';
// registered in components/animations/index.ts, composition id "A32", 84 frames
<A32 label=... />
```
