# A39 — Shake Alert
**Category:** Emphasis/State  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A39.png` (open it together with this file)

## Best used when
Warning/pitfall/'wait, is this legit?' beats.

## Not suitable when
Calm explanations.

## Duration and easing
- Duration: **66 frames @30fps (2.2s)**
- Easing: card EASE.back f0-14; shake sin(f*2.2)*14px decaying over 30f from f14; sparks f14-26
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 8 | card growing |
| 16 | card shaking, sparks drawing |
| 24 | shaking, sparks fading |
| 36 | shake decaying |
| 65 | rest: orange warning card, still |

## Plain-English motion script
1. Card with warning icon pops in, shakes left-right with decay while 4 spark strokes flash.

## Callouts on the filmstrip
1. (frame 8) warn icon
2. (frame 16) card shakes
3. (frame 24) spark strokes

## Parameters
- `text`: string <=16 chars

## Max content
text <=16 chars at 48px

## Layout footprint
640 x 300 px

## Color usage rules
Whole card orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A39.tsx`
```tsx
import {A39} from './animations/A39';
// registered in components/animations/index.ts, composition id "A39", 66 frames
<A39 text=... />
```
