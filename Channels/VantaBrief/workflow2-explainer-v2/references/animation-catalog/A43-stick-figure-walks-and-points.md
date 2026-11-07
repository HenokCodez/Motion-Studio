# A43 — Stick Figure Walks and Points
**Category:** People/characters  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A43.png` (open it together with this file)

## Best used when
Introducing a concept via a character presenting it.

## Not suitable when
Dense content.

## Duration and easing
- Duration: **96 frames @30fps (3.2s)**
- Easing: walk EASE.inOut f0-40 (370px); pose switch at f40; card EASE.inOut f44-60; text wipe f56-76
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | figure drawing at left |
| 10 | figure walking right |
| 24 | walking, legs swinging |
| 40 | arrives, switches to pointing pose |
| 60 | card drawn, pointing |
| 95 | rest: figure points at orange card with text |

## Plain-English motion script
1. A stick figure draws, walks 370px right with swinging legs, stops and points at a card that draws in with a label.

## Callouts on the filmstrip
1. (frame 10) figure walks
2. (frame 40) stops and points
3. (frame 95) orange card + label

## Parameters
- `text`: string <=18 chars

## Max content
text <=18 chars at 56px

## Layout footprint
~1400 x 520 px

## Color usage rules
Card orange; figure cream.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A43.tsx`
```tsx
import {A43} from './animations/A43';
// registered in components/animations/index.ts, composition id "A43", 96 frames
<A43 text=... />
```
