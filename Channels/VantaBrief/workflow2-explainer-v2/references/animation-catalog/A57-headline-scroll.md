# A57 — Headline Scroll
**Category:** Real media  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A57.png` (open it together with this file)

## Best used when
Showing press coverage/headlines about a topic.

## Not suitable when
Single article detail (use A30).

## Duration and easing
- Duration: **96 frames @30fps (3.2s)**
- Easing: frame EASE.inOut f0-16; scroll EASE.inOut f10-70 (330px); highlight EASE.out f70-84
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 12 | frame + url bar |
| 30 | headlines scrolling up |
| 50 | scrolling |
| 72 | scroll done, underline starting |
| 95 | rest: highlighted headline orange + underline |

## Plain-English motion script
1. Browser frame draws; headlines scroll up inside a clipped window; one headline is underlined and turns orange.

## Callouts on the filmstrip
1. (frame 12) frame + url bar
2. (frame 50) headlines scroll
3. (frame 95) orange underline

## Parameters
- `source`: <=28 chars
- `headlines`: 6 strings <=36 chars
- `highlight`: index

## Max content
6 headlines <=36 chars at 36px

## Layout footprint
900 x 560 px

## Color usage rules
Highlighted headline orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A57.tsx`
```tsx
import {A57} from './animations/A57';
// registered in components/animations/index.ts, composition id "A57", 96 frames
<A57 source=... headlines=... />
```
