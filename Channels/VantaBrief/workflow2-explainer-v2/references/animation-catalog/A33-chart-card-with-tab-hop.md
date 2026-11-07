# A33 — Chart Card with Tab Hop
**Category:** Data  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A33.png` (open it together with this file)

## Best used when
A metric that changes by period/variant, with a big number and a trend.

## Not suitable when
Many series.

## Duration and easing
- Duration: **96 frames @30fps (3.2s)**
- Easing: card EASE.inOut f0-14; line EASE.inOut f12-36; tab hop EASE.inOut f40-52; data morph f44-64
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 12 | card drawing, title and tabs fading in |
| 30 | line drawing |
| 46 | tab selector hopping from 24H to 7D |
| 62 | line morphing to new data, value changed |
| 95 | rest: card, value 94.2, orange line + area, tab 2 selected |

## Plain-English motion script
1. Card draws with title, big number and three tabs.
2. Orange line and area draw.
3. The selector hops to the second tab, the line morphs and the number updates.

## Callouts on the filmstrip
1. (frame 12) tabs
2. (frame 46) selector hops
3. (frame 95) line morphs

## Parameters
- `tabs`: 3 strings <=4 chars
- `values`: 3 numbers
- `title`: string <=20 chars

## Max content
3 tabs, title <=20 chars

## Layout footprint
900 x 520 px

## Color usage rules
Line, area, selected tab orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A33.tsx`
```tsx
import {A33} from './animations/A33';
// registered in components/animations/index.ts, composition id "A33", 96 frames
<A33 tabs=... values=... />
```
