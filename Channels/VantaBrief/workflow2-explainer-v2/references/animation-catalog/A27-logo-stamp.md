# A27 — Logo Stamp
**Category:** Logos/brand  |  **Status:** rendered (logo/screenshot slots show labelled placeholders until assets are fetched)  |  **Filmstrip:** `filmstrips/A27.png` (open it together with this file)

## Best used when
Introducing the channel or the main subject with its real logo; intro/outro.

## Not suitable when
Many logos at once (use A28).

## Duration and easing
- Duration: **66 frames @30fps (2.2s)**
- Easing: stamp: spring {damping:12,stiffness:140,mass:0.7} from f4, start scale 1.6; rays f10-20 fade f22-34; name EASE-linear fade f18-30
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 6 | logo scaling down from 1.6x |
| 12 | logo near 1x; blue burst rays drawing |
| 20 | rays complete |
| 36 | rays gone, name visible |
| 65 | rest: logo 320px at (960,450), name 72px below |

## Plain-English motion script
1. Logo slams in from 1.6x with a spring.
2. Ten blue burst strokes radiate and fade (channel-identity role).
3. Name fades in below.

## Callouts on the filmstrip
1. (frame 6) logo slams in
2. (frame 12) blue burst rays
3. (frame 65) name fades in

## Parameters
- `src`: path under assets/ (default brand/vanta-brief-logo.png)
- `name`: string <=20 chars

## Max content
1 logo + name <=20 chars

## Layout footprint
~560 x 520 px

## Color usage rules
Burst rays blue (identity role). Logo keeps native colors.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A27.tsx`
```tsx
import {A27} from './animations/A27';
// registered in components/animations/index.ts, composition id "A27", 66 frames
<A27 src=... name=... />
```
