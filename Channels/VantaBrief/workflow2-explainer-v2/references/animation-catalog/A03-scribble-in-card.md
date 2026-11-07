# A03 — Scribble-In Card
**Category:** Reveals/intros  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A03.png` (open it together with this file)

## Best used when
Introducing the highlighted option / key idea as a single hero card ('Heavy-Duty Tasks').

## Not suitable when
When 2+ things must appear together.

## Duration and easing
- Duration: **66 frames @30fps (2.2s)**
- Easing: scribble EASE.inOut f0-30; outline EASE.inOut f24-44; fill linear-ish EASE.out f26-38; content EASE.back (0.34,1.56,0.64,1) f44-60
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty |
| 8 | first 3 zig-zag passes of brown-orange scribble |
| 18 | scribble covers ~60% of the card area |
| 26 | scribble complete; orange outline starting to draw |
| 38 | outline nearly complete, fill solid, no icon/label yet |
| 65 | rest: highlighted card 700x360 at (610,360), chip icon 150px, label 56px |

## Plain-English motion script
1. f0-30: a fat 40px brown-orange (#6B3A2E) pen zig-zags back and forth down the card area, 10 passes.
2. f24-44: orange outline draws around the scribbled area.
3. f26-38: solid #6B3A2E fill fades in, hiding gaps.
4. f44-60: icon + label pop in with overshoot and 20px rise.

## Callouts on the filmstrip
1. (frame 8) fat scribble zig-zags down
2. (frame 26) scribble completes, outline starts
3. (frame 38) orange outline completes, fill solid
4. (frame 65) icon + label pop in

## Parameters
- `label`: string <=24 chars
- `icon`: ICONS key

## Max content
label <=24 chars

## Layout footprint
700x360 px (36% x 33%)

## Color usage rules
Whole card is the orange focal group (hi fill + orange outline + orange icon).

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A03.tsx`
```tsx
import {A03} from './animations/A03';
// registered in components/animations/index.ts, composition id "A03", 66 frames
<A03 label=... icon=... />
```
