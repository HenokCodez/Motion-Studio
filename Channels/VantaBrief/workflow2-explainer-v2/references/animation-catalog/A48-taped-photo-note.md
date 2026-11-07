# A48 — Taped Photo + Note
**Category:** People/photo  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A48.png` (open it together with this file)

## Best used when
Showing one real photo (person/hardware/event) with an annotation.

## Not suitable when
Several photos (use A49/A35).

## Duration and easing
- Duration: **72 frames @30fps (2.4s)**
- Easing: photo spring pop {damping:12,stiffness:140,mass:0.7} f0; tape EASE.back f14-24; arrow f40-54; note wipe f50-66
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | photo growing |
| 8 | photo ~1x |
| 18 | tape strips popping |
| 30 | caption wiping |
| 46 | arrow drawing |
| 71 | rest: tilted photo frame, orange arrow + note |

## Plain-English motion script
1. Tilted photo frame pops in with two tape strips; caption fades; orange arrow and note appear.

## Callouts on the filmstrip
1. (frame 8) photo frame pops
2. (frame 30) tape strips
3. (frame 71) orange arrow + note

## Parameters
- `src`: file in assets/photos/ (placeholder silhouette if empty)
- `caption`: <=18 chars
- `note`: <=14 chars

## Max content
caption <=18 chars, note <=14 chars

## Layout footprint
520 x 460 px + note

## Color usage rules
Arrow + note orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A48.tsx`
```tsx
import {A48} from './animations/A48';
// registered in components/animations/index.ts, composition id "A48", 72 frames
<A48 src=... caption=... />
```
