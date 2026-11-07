# A46 — Presenter at Board
**Category:** People/characters  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A46.png` (open it together with this file)

## Best used when
Explaining a short list with a presenter.

## Not suitable when
Long lists.

## Duration and easing
- Duration: **90 frames @30fps (3.0s)**
- Easing: figure draw f0-14; board EASE.inOut f10-28; title wipe f26-42; bullets wipe 14f staggered 14f from f40
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | figure drawing |
| 10 | figure pointing, board starting |
| 24 | board nearly drawn |
| 40 | title wiping |
| 58 | bullet 1 done, bullet 2 wiping |
| 89 | rest: figure + board with title and 3 bullets |

## Plain-English motion script
1. Figure points at a board that draws in; title then three bullets wipe in.

## Callouts on the filmstrip
1. (frame 10) presenter
2. (frame 40) board draws
3. (frame 89) bullets wipe in

## Parameters
- `title`: <=20 chars
- `bullets`: 3 strings <=22 chars

## Max content
title <=20, bullets <=22 chars

## Layout footprint
1000 x 500 px

## Color usage rules
Title orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A46.tsx`
```tsx
import {A46} from './animations/A46';
// registered in components/animations/index.ts, composition id "A46", 90 frames
<A46 title=... bullets=... />
```
