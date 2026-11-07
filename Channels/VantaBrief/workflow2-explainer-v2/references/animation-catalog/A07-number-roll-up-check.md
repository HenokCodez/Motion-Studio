# A07 — Number Roll-Up + Check
**Category:** Data  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A07.png` (open it together with this file)

## Best used when
A single headline statistic ('130+', '96%', '$38/hr').

## Not suitable when
Several stats at once.

## Duration and easing
- Duration: **75 frames @30fps (2.5s)**
- Easing: check draw EASE.inOut f0-18; count EASE.out (0.22,1,0.36,1) f8-52; label fade f40-56
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 10 | check ~55% drawn; number reads 26+ |
| 22 | check done; number reads 111+ |
| 36 | number reads 129+ |
| 52 | number final 130+, label starting |
| 74 | rest: check y250, number 300px y650, label 52px, sub 32px |

## Plain-English motion script
1. f0-18: orange check pen-draws.
2. f8-52: the number counts from 0 to value with an ease-out; suffix is always shown so width is stable.
3. f40-62: label then sub-label fade in.

## Callouts on the filmstrip
1. (frame 10) check pen-draws
2. (frame 22) number rolls up
3. (frame 74) label + sub fade in

## Parameters
- `value`: number <=999
- `label`: string <=36 chars
- `sub`: string <=36 chars (>=32px)

## Max content
number <=4 chars incl suffix

## Layout footprint
~900 x 640 px centered

## Color usage rules
Check + number orange; labels cream.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A07.tsx`
```tsx
import {A07} from './animations/A07';
// registered in components/animations/index.ts, composition id "A07", 75 frames
<A07 value=... label=... />
```
