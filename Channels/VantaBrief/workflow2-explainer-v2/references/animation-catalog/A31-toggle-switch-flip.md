# A31 — Toggle Switch Flip
**Category:** Emphasis/State  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A31.png` (open it together with this file)

## Best used when
A setting/mode flipping from off to on ('Agent mode').

## Not suitable when
Anything that is not a binary state.

## Duration and easing
- Duration: **72 frames @30fps (2.4s)**
- Easing: track draw EASE.inOut f0-14; knob spring pop f26+; label fade f6-18
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 10 | track drawing |
| 24 | track done, knob left, OFF label |
| 30 | knob moving right, track turning orange |
| 38 | knob overshoots near right end |
| 71 | rest: orange track, knob right, ON on the left |

## Plain-English motion script
1. Pill track draws; label fades in.
2. At f26 the knob springs from left to right; the track fills #6B3A2E with orange outline; OFF becomes ON.

## Callouts on the filmstrip
1. (frame 10) track draws
2. (frame 30) knob springs across
3. (frame 71) ON label

## Parameters
- `label`: string <=24 chars

## Max content
label <=24 chars

## Layout footprint
520 x 200 px + label

## Color usage rules
Track orange only after flip.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A31.tsx`
```tsx
import {A31} from './animations/A31';
// registered in components/animations/index.ts, composition id "A31", 72 frames
<A31 label=... />
```
