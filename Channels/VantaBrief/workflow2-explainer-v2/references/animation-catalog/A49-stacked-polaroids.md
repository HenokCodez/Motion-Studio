# A49 — Stacked Polaroids
**Category:** People/photo  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A49.png` (open it together with this file)

## Best used when
A sequence of 3 moments/versions as photos.

## Not suitable when
One photo (A48).

## Duration and easing
- Duration: **84 frames @30fps (2.8s)**
- Easing: cards spring settle {9,90,1} staggered 10f, drop 500px
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 8 | first card dropping |
| 20 | cards 1-2 in |
| 34 | third card dropping |
| 50 | settling |
| 83 | rest: 3 fanned cards, last outlined orange |

## Plain-English motion script
1. Three polaroid-style cards drop in one by one, fanned at -10, 0 and +8 degrees.

## Callouts on the filmstrip
1. (frame 8) cards drop in
2. (frame 34) fan settles
3. (frame 83) last card orange

## Parameters
- `captions`: 3 strings <=8 chars
- `photos`: files in assets/photos/

## Max content
3 cards, captions <=8 chars

## Layout footprint
~800 x 400 px

## Color usage rules
Last card outline + caption orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A49.tsx`
```tsx
import {A49} from './animations/A49';
// registered in components/animations/index.ts, composition id "A49", 84 frames
<A49 captions=... photos=... />
```
