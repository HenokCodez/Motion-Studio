# A45 — Crowd Builder
**Category:** People/characters  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A45.png` (open it together with this file)

## Best used when
'Many people/testers/users' counts.

## Not suitable when
Individual stories.

## Duration and easing
- Duration: **84 frames @30fps (2.8s)**
- Easing: figures spring pop staggered 3f from f4; label fade f50-66
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 10 | first figures popping |
| 24 | two rows partly filled |
| 38 | all 18 popped |
| 56 | label fading in |
| 83 | rest: 3 rows of 6 figures, last waves in orange |

## Plain-English motion script
1. Mini stick figures pop in one by one filling a 6x3 grid; the last one is orange and waves.

## Callouts on the filmstrip
1. (frame 10) figures pop in
2. (frame 38) grid fills
3. (frame 83) last figure orange

## Parameters
- `count`: number <=18
- `label`: string <=24 chars

## Max content
<=18 figures, label <=24 chars

## Layout footprint
960 x 560 px

## Color usage rules
Last figure orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A45.tsx`
```tsx
import {A45} from './animations/A45';
// registered in components/animations/index.ts, composition id "A45", 84 frames
<A45 count=... label=... />
```
