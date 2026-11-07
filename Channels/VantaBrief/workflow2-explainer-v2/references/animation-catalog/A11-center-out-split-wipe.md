# A11 — Center-Out Split Wipe
**Category:** Comparisons  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A11.png` (open it together with this file)

## Best used when
Before/after, paper vs production, two states of one thing.

## Not suitable when
Items that need to arrive separately.

## Duration and easing
- Duration: **72 frames @30fps (2.4s)**
- Easing: divider EASE.inOut f0-14; panel reveal clip grows outward from the center f10-34; text f30-48
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 8 | divider 60% drawn top→bottom |
| 16 | divider done; panels 25% revealed from center |
| 24 | panels ~60% revealed |
| 36 | panels full; labels wiping |
| 71 | rest: two 770x440 panels, right highlighted |

## Plain-English motion script
1. f0-14: cream divider line draws top to bottom at x=960.
2. f10-34: left panel unrolls leftward and right panel rightward from the divider.
3. f30-48: icons are visible; labels wipe in.

## Callouts on the filmstrip
1. (frame 8) divider draws
2. (frame 16) panels unroll outward
3. (frame 16) from the center line
4. (frame 36) labels wipe in

## Parameters
- `left`: <=22 chars
- `right`: <=22 chars

## Max content
labels <=22 chars

## Layout footprint
2 x 770x440 px, gap 60

## Color usage rules
Right panel orange focal.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A11.tsx`
```tsx
import {A11} from './animations/A11';
// registered in components/animations/index.ts, composition id "A11", 72 frames
<A11 left=... right=... />
```
