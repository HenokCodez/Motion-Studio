# A36 — Sliding Pill Nav
**Category:** Lists/steps/process  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A36.png` (open it together with this file)

## Best used when
Walking through 4 steps/modes where one is active at a time.

## Not suitable when
Unordered content.

## Duration and easing
- Duration: **90 frames @30fps (3.0s)**
- Easing: pill EASE.inOut f0-14; highlight hops EASE.inOut f38-50 and f58-74
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 12 | pill drawing |
| 30 | icons in, highlight on icon 1 |
| 46 | highlight sliding to icon 2 |
| 66 | highlight sliding to icon 4 |
| 89 | rest: highlight on icon 4, label below |

## Plain-English motion script
1. Pill track + 4 icons draw.
2. An orange-outlined highlight slides to icon 2 then icon 4; the label below changes.

## Callouts on the filmstrip
1. (frame 12) pill + icons
2. (frame 46) highlight slides
3. (frame 89) ends on icon 4

## Parameters
- `icons`: 4 ICONS keys
- `labels`: 4 strings <=10 chars

## Max content
4 icons, labels <=10 chars

## Layout footprint
760 x 140 px + label

## Color usage rules
Highlight, active icon and label orange.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A36.tsx`
```tsx
import {A36} from './animations/A36';
// registered in components/animations/index.ts, composition id "A36", 90 frames
<A36 icons=... labels=... />
```
