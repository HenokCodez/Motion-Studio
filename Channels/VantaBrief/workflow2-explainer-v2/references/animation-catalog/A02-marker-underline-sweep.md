# A02 — Marker Underline Sweep
**Category:** Reveals/intros  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A02.png` (open it together with this file)

## Best used when
Emphasizing one key phrase inside a sentence ('real failures').

## Not suitable when
Long sentences (>34 chars) or more than one emphasized phrase.

## Duration and easing
- Duration: **60 frames @30fps (2.0s)**
- Easing: text fade: EASE.out f0-10; underline 1 EASE.out f14-30; underline 2 EASE.out f30-42
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 8 | line of text 80% opaque, 4px low, all cream |
| 16 | text settled; keyword turned orange; underline 1 starts at left of keyword |
| 24 | underline 1 ~60% drawn (thick 10px) |
| 36 | underline 1 complete, underline 2 (thin, shorter, 22px lower) 50% drawn |
| 59 | rest: both strokes complete under the keyword |

## Plain-English motion script
1. f0-10: sentence fades in and rises 20px.
2. f14: keyword switches from cream to orange.
3. f14-30: thick orange marker stroke sweeps left→right under the keyword.
4. f30-42: thinner second stroke draws underneath, slightly shorter (the double underline).

## Callouts on the filmstrip
1. (frame 16) keyword turns orange
2. (frame 8) thick marker stroke sweeps
3. (frame 8) thin second stroke (double underline)

## Parameters
- `before`: string <=22 chars
- `keyword`: string <=22 chars

## Max content
before+keyword total <=34 chars at 88px

## Layout footprint
~1230 x 170 px centered (64% x 16%)

## Color usage rules
Keyword + both strokes orange; everything else cream.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A02.tsx`
```tsx
import {A02} from './animations/A02';
// registered in components/animations/index.ts, composition id "A02", 60 frames
<A02 before=... keyword=... />
```
