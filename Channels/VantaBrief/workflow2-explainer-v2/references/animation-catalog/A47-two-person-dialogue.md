# A47 — Two-Person Dialogue
**Category:** People/characters  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A47.png` (open it together with this file)

## Best used when
Question/answer or myth/reply exchanges.

## Not suitable when
Monologues.

## Duration and easing
- Duration: **84 frames @30fps (2.8s)**
- Easing: bubble 1 EASE.back f12-26; bubble 2 EASE.back f40-54
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | figures drawing |
| 10 | two figures |
| 24 | bubble 1 popping |
| 40 | bubble 1 done, bubble 2 starting |
| 54 | bubble 2 popping (orange) |
| 83 | rest: two figures, two bubbles |

## Plain-English motion script
1. Two figures face each other; the left asks in a cream bubble, the right answers in an orange bubble.

## Callouts on the filmstrip
1. (frame 10) left figure
2. (frame 40) question bubble
3. (frame 83) orange answer bubble

## Parameters
- `a`: <=16 chars
- `b`: <=16 chars

## Max content
bubbles <=16 chars at 44px

## Layout footprint
~1300 x 640 px

## Color usage rules
Answer bubble orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A47.tsx`
```tsx
import {A47} from './animations/A47';
// registered in components/animations/index.ts, composition id "A47", 84 frames
<A47 a=... b=... />
```
