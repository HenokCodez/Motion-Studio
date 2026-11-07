# A29 — Subscribe CTA (channel logo)
**Category:** Callouts/CTA  |  **Status:** rendered (logo/screenshot slots show labelled placeholders until assets are fetched)  |  **Filmstrip:** `filmstrips/A29.png` (open it together with this file)

## Best used when
'Subscribe to Vanta Brief' moments.

## Not suitable when
Mid-explanation beats.

## Duration and easing
- Duration: **90 frames @30fps (3.0s)**
- Easing: logo spring pop f2; channel name wipe EASE.inOut f12-34; button spring pop f28; press 0.94 at f56-64 then label switches
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 8 | logo popping at left |
| 20 | logo done; channel name wiping |
| 34 | name complete; button popping (blue) |
| 58 | button pressed (0.94) |
| 89 | rest: logo + name + dark 'Subscribed' button |

## Plain-English motion script
1. Channel logo pops in.
2. Channel name wipes in.
3. Blue Subscribe button pops, gets pressed and turns into a dark 'Subscribed' button.

## Callouts on the filmstrip
1. (frame 8) logo pops
2. (frame 34) blue button pops
3. (frame 89) press -> Subscribed

## Parameters
- `channel`: string <=14 chars

## Max content
channel name <=14 chars at 88px

## Layout footprint
~1100 x 300 px

## Color usage rules
Blue button = channel-identity role (small area). No orange needed.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A29.tsx`
```tsx
import {A29} from './animations/A29';
// registered in components/animations/index.ts, composition id "A29", 90 frames
<A29 channel=... />
```
