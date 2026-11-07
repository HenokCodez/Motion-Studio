# A35 — Numbered Photo Cards
**Category:** People/photo  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A35.png` (open it together with this file)

## Best used when
Intro of a numbered set of people/steps/episodes (Part N).

## Not suitable when
More than 5 items.

## Duration and easing
- Duration: **90 frames @30fps (3.0s)**
- Easing: cards spring pop staggered 8f from f4; banner fade f36-48; highlight f60+
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 10 | card 1 popping |
| 26 | cards 1-3 in |
| 44 | all 5 in; banner appearing |
| 62 | card 3 turning orange |
| 89 | rest: 3 + banner + 2 cards, one orange |

## Plain-English motion script
1. Five portrait cards pop in (3 on top, 2 below) with big numbers.
2. A banner appears between rows; one card highlights orange.

## Callouts on the filmstrip
1. (frame 10) cards pop in
2. (frame 44) banner
3. (frame 89) highlight orange

## Parameters
- `banner`: string <=12 chars
- `photos`: array of files in assets/photos/ (silhouette placeholders if empty)
- `highlight`: index

## Max content
5 cards, banner <=12 chars

## Layout footprint
660 x 700 px

## Color usage rules
Highlighted card orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A35.tsx`
```tsx
import {A35} from './animations/A35';
// registered in components/animations/index.ts, composition id "A35", 90 frames
<A35 banner=... photos=... />
```
