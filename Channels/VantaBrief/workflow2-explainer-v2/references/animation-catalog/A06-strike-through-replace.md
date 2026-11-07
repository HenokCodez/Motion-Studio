# A06 — Strike-Through → Replace
**Category:** Typography/kinetic  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A06.png` (open it together with this file)

## Best used when
Myth vs reality; 'it's not X, it's Y'; correcting a claim.

## Not suitable when
Neutral lists.

## Duration and easing
- Duration: **72 frames @30fps (2.4s)**
- Easing: strike EASE.inOut f6-22; old text fade f22-34 (EASE.out); new text EASE.back f28-46
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | old text centered at y470, nothing else |
| 10 | strike stroke ~25% across the old text |
| 18 | strike ~75% across |
| 26 | strike complete; old text dimming and rising |
| 40 | old text at ~40% opacity above; new orange text settling |
| 71 | rest: old dimmed+struck at y~430, new orange at y650 |

## Plain-English motion script
1. f6-22: a cream pen stroke (8px) is drawn through the old text, slightly sloped.
2. f22-34: old text dims to 40% and rises 40px.
3. f28-46: new text slides up 60px with overshoot, in orange.

## Callouts on the filmstrip
1. (frame 18) pen strikes through
2. (frame 26) old text dims + rises
3. (frame 71) new text slides up

## Parameters
- `oldText`: string <=24 chars
- `newText`: string <=24 chars

## Max content
each <=24 chars

## Layout footprint
<=1000 x 380 px

## Color usage rules
New text orange (the true side). Old text/strike cream.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A06.tsx`
```tsx
import {A06} from './animations/A06';
// registered in components/animations/index.ts, composition id "A06", 72 frames
<A06 oldText=... newText=... />
```
