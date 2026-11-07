# A25 — Bar Grow
**Category:** Data  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A25.png` (open it together with this file)

## Best used when
Comparing 3-4 values ('Model A/B/C vs Ours').

## Not suitable when
Time series.

## Duration and easing
- Duration: **90 frames @30fps (3.0s)**
- Easing: axes EASE.inOut f0-18; bars EASE.out 24f staggered 8f from f20; value labels fade in as each bar ends
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 14 | axes nearly drawn, category labels fading in |
| 30 | bars 1-2 growing |
| 46 | bars 1-3 up; bar 4 growing |
| 62 | all bars near full; labels appearing |
| 89 | rest: 4 bars, tallest orange, values above |

## Plain-English motion script
1. Hand-drawn axes draw.
2. Bars grow from the baseline one after another.
3. Value labels appear above each bar; the last bar is orange.

## Callouts on the filmstrip
1. (frame 14) axes draw
2. (frame 30) bars grow
3. (frame 89) tallest bar = orange

## Parameters
- `values`: array of 3-4 numbers 0-100
- `labels`: array of strings <=8 chars

## Max content
<=4 bars, labels <=8 chars

## Layout footprint
1200 x 680 px

## Color usage rules
Last bar orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A25.tsx`
```tsx
import {A25} from './animations/A25';
// registered in components/animations/index.ts, composition id "A25", 90 frames
<A25 values=... labels=... />
```
