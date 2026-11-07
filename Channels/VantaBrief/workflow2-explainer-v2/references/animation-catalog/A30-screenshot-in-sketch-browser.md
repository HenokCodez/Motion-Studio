# A30 — Screenshot in Sketch Browser
**Category:** Real media  |  **Status:** rendered (logo/screenshot slots show labelled placeholders until assets are fetched)  |  **Filmstrip:** `filmstrips/A30.png` (open it together with this file)

## Best used when
Showing a real site/product/leaderboard screenshot with a pointer to the key area.

## Not suitable when
Photos of people (use photo animations).

## Duration and easing
- Duration: **84 frames @30fps (2.8s)**
- Easing: frame EASE.inOut f0-16; bar f10-20; content fade f16-26; circle EASE.out f40-56; note wipe EASE.inOut f54-70
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 10 | frame outline drawing |
| 20 | frame + url bar + dots visible |
| 42 | screenshot visible, orange circle just starting |
| 52 | circle nearly complete, note starting to wipe |
| 83 | rest: frame 900x520, circle, note below |

## Plain-English motion script
1. Browser frame draws with url bar.
2. Screenshot (assets/screenshots/<file>) fades in.
3. Orange pen circle draws over the key region, note wipes in below.

## Callouts on the filmstrip
1. (frame 10) frame draws
2. (frame 20) url bar + dots
3. (frame 52) orange circle
4. (frame 83) note

## Parameters
- `src`: filename in assets/screenshots/
- `url`: string <=28 chars
- `note`: string <=20 chars

## Max content
1 screenshot, note <=20 chars

## Layout footprint
900 x 520 px + note

## Color usage rules
Circle + note orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A30.tsx`
```tsx
import {A30} from './animations/A30';
// registered in components/animations/index.ts, composition id "A30", 84 frames
<A30 src=... url=... />
```
