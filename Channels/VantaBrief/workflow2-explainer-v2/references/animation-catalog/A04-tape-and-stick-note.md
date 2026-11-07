# A04 — Tape-and-Stick Note
**Category:** Reveals/intros  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A04.png` (open it together with this file)

## Best used when
A takeaway / reminder / definition delivered as a pinned note.

## Not suitable when
Anything needing a diagram or >3 text lines.

## Duration and easing
- Duration: **66 frames @30fps (2.2s)**
- Easing: drop: spring {damping:9,stiffness:90,mass:1}; tape: EASE.back f14-24; text lines: EASE.inOut starting f24/38/48
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | note 800px above, rotated -15° (off-screen) |
| 6 | note falling, still tilted ~-11° |
| 14 | note overshoots into place near centre, tape strips start popping |
| 24 | note settled at -3°, both tape strips visible, first line starting to wipe |
| 40 | title line complete, bullet 1 wiping |
| 65 | rest: note 640x380 rotated -3°, title + 2 bullets |

## Plain-English motion script
1. f0-20: the note drops from above with a spring and rotates from -15° to -3°.
2. f14-24: two cream tape strips pop onto the top corners.
3. f24-40: title is wiped in; f38-58: the two bullets wipe in one after the other.

## Callouts on the filmstrip
1. (frame 6) note drops in with spring
2. (frame 24) tape strips pop on
3. (frame 65) text wipes in line by line

## Parameters
- `title`: string <=24 chars
- `lines`: array <=2 strings, each <=22 chars

## Max content
title <=24 chars, 2 bullets <=22 chars

## Layout footprint
640x380 px (33% x 35%)

## Color usage rules
Cream outline, dark fill. No orange needed (add orange to ONE word only if it is the key idea).

## Entrance from off-screen
Yes: frames before 40% of duration may be off-screen; the rest frames must be fully inside the safe frame.

## Component
`components/animations/A04.tsx`
```tsx
import {A04} from './animations/A04';
// registered in components/animations/index.ts, composition id "A04", 66 frames
<A04 title=... lines=... />
```
