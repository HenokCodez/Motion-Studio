# A08 — Stacked Emphasis Slam
**Category:** Typography/kinetic  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A08.png` (open it together with this file)

## Best used when
'It's not X, it's Y' / one keyword that must land hard.

## Not suitable when
Sentences >25 chars on the big line.

## Duration and easing
- Duration: **60 frames @30fps (2.0s)**
- Easing: line1/3 slide: EASE.out f0-14 / f18-32; big word: spring pop f10+; burst strokes f14-24, fade f24-34
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 8 | top line sliding in from left |
| 14 | top line in place; big word slams in at 1.7x scale |
| 20 | big word at ~1.1x, burst strokes drawing |
| 30 | burst fading, bottom line sliding in from right |
| 59 | rest: 3 stacked lines centered |

## Plain-English motion script
1. Top line slides in from the left; big orange word slams in from 1.7x with a spring; ten short burst strokes radiate around it then fade; bottom line slides in from the right.

## Callouts on the filmstrip
1. (frame 8) top line slides in
2. (frame 14) big word slams in
3. (frame 20) burst strokes radiate
4. (frame 30) bottom line slides in

## Parameters
- `top`: <=22 chars
- `big`: <=8 chars uppercase
- `bottom`: <=30 chars

## Max content
big word <=8 chars at 220px

## Layout footprint
~900 x 560 px (47% x 52%)

## Color usage rules
Big word orange; burst + lines cream.

## Entrance from off-screen
Yes: frames before 40% of duration may be off-screen; the rest frames must be fully inside the safe frame.

## Component
`components/animations/A08.tsx`
```tsx
import {A08} from './animations/A08';
// registered in components/animations/index.ts, composition id "A08", 60 frames
<A08 top=... big=... />
```
