# A42 — Sticker Pop
**Category:** Emphasis/State  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A42.png` (open it together with this file)

## Best used when
'#1', 'Top pick', ranking stickers.

## Not suitable when
Long text.

## Duration and easing
- Duration: **60 frames @30fps (2.0s)**
- Easing: sticker spring pop {damping:12,stiffness:140,mass:0.7} f0; wobble sin(0.4f)*4deg decaying; sparks f12-24, fade f26-40
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 6 | sticker growing, tilted |
| 12 | sticker overshoots, wobbling |
| 20 | sparks drawn |
| 30 | sparks fading |
| 59 | rest: sticker tilted -12 deg with orange label |

## Plain-English motion script
1. Circle sticker pops in with a wobble; four spark strokes flash at the corners.

## Callouts on the filmstrip
1. (frame 6) sticker pops + wobbles
2. (frame 20) sparks

## Parameters
- `text`: string <=4 chars

## Max content
text <=4 chars at 120px

## Layout footprint
260 x 260 px

## Color usage rules
Label orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A42.tsx`
```tsx
import {A42} from './animations/A42';
// registered in components/animations/index.ts, composition id "A42", 60 frames
<A42 text=... />
```
