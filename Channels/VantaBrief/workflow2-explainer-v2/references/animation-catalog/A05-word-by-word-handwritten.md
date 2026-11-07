# A05 — Word-by-Word Handwritten
**Category:** Typography/kinetic  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A05.png` (open it together with this file)

## Best used when
Narration punchlines of 3-7 words, one idea ('Real tasks break paper scores').

## Not suitable when
More than 7 words; lists.

## Duration and easing
- Duration: **90 frames @30fps (3.0s)**
- Easing: each word: spring pop {damping:12,stiffness:140,mass:0.7}, one word every 7 frames starting f6
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 10 | word 1 popping in (scale 0.8->1.1->1) |
| 24 | words 1-3 visible, 'break' in orange |
| 38 | line 1 complete, line 2 word 1 popping |
| 56 | all words visible |
| 89 | rest: 2 centered lines, 96px, one orange word |

## Plain-English motion script
1. Words appear every 7 frames; each scales up with a small spring and un-rotates from a random ±3° tilt.
2. Line break happens automatically at 1300 px.
3. The emphasized word index renders orange.

## Callouts on the filmstrip
1. (frame 10) word pops in
2. (frame 24) emphasis word = orange
3. (frame 56) auto 2-line wrap

## Parameters
- `text`: string 3-7 words
- `emphasis`: array of word indexes (max 1)

## Max content
<=7 words, <=34 chars total

## Layout footprint
<=1300 x 240 px

## Color usage rules
One orange word max.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A05.tsx`
```tsx
import {A05} from './animations/A05';
// registered in components/animations/index.ts, composition id "A05", 90 frames
<A05 text=... emphasis=... />
```
