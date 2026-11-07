# A09 — A-vs-B Slide-In
**Category:** Comparisons  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A09.png` (open it together with this file)

## Best used when
Comparing two things ('Standard Webchat vs Agentic Workflows').

## Not suitable when
Three or more options.

## Duration and easing
- Duration: **78 frames @30fps (2.6s)**
- Easing: boxes EASE.out f0-20 / f4-24 (700px travel); highlight EASE.out f26-38; text wipes EASE.inOut f28-64
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty (boxes off-screen) |
| 10 | both boxes almost in place, still sliding (left box x≈100, right box x≈1060) |
| 22 | boxes in place, empty; 'vs' starts popping at f24 |
| 34 | right box fully orange; titles half-wiped ('Stand', 'Agent') |
| 50 | titles done; first bullet of each box done; second bullets not started |
| 77 | rest: two 770x420 boxes, right highlighted, 2 bullets each |

## Plain-English motion script
1. f0-24: left box slides from the left, right box from the right.
2. f22-30: 'vs' pops in the gap.
3. f26-38: right box fills #6B3A2E and its outline draws in orange.
4. f28-64: titles and bullets wipe in.

## Callouts on the filmstrip
1. (frame 10) left box slides in
2. (frame 10) right box slides in
3. (frame 34) right fills + orange outline
4. (frame 77) bullets wipe in

## Parameters
- `left`: {title<=22 chars, bullets<=2 x 24 chars}
- `right`: same

## Max content
title <=22 chars, bullets <=2 x 24 chars

## Layout footprint
2 x 770x420 px, gap 60 (40% each)

## Color usage rules
Right box = orange focal. Left cream.

## Entrance from off-screen
Yes: frames before 40% of duration may be off-screen; the rest frames must be fully inside the safe frame.

## Component
`components/animations/A09.tsx`
```tsx
import {A09} from './animations/A09';
// registered in components/animations/index.ts, composition id "A09", 78 frames
<A09 left=... right=... />
```
