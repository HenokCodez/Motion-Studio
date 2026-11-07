# A38 — Pen Circle Highlight
**Category:** Emphasis/State  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A38.png` (open it together with this file)

## Best used when
Circling a word/number in a sentence.

## Not suitable when
Long sentences.

## Duration and easing
- Duration: **60 frames @30fps (2.0s)**
- Easing: text fade f0-10; circle EASE.out f14-32; second pass f30-42
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 8 | sentence fading in |
| 18 | circle ~25% drawn, word orange |
| 28 | circle ~80% drawn |
| 40 | circle done, second pass drawing |
| 59 | rest: two orange passes around the word |

## Plain-English motion script
1. Sentence appears; the key word turns orange; an orange pen ellipse circles it twice.

## Callouts on the filmstrip
1. (frame 18) circle draws
2. (frame 40) second pass

## Parameters
- `before`: <=12 chars
- `word`: <=16 chars
- `after`: <=12 chars

## Max content
<=34 chars total

## Layout footprint
~1250 x 160 px

## Color usage rules
Word + circles orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A38.tsx`
```tsx
import {A38} from './animations/A38';
// registered in components/animations/index.ts, composition id "A38", 60 frames
<A38 before=... word=... />
```
