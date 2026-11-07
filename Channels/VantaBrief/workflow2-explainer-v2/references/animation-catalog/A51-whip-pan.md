# A51 — Whip Pan
**Category:** Camera/transitions  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A51.png` (open it together with this file)

## Best used when
Fast cut between two statements/chapters.

## Not suitable when
Calm continuity.

## Duration and easing
- Duration: **72 frames @30fps (2.4s)**
- Easing: exit/enter EASE.inOut f14-34 (2300px travel); speed lines f12-24 fade f26-36
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | first word centered |
| 16 | speed lines ~35% drawn, first word starting to move |
| 22 | first word flying left, second flying in, lines complete |
| 32 | second word almost centered, lines fading |
| 44 | settling |
| 71 | rest: second word (orange) centered |

## Plain-English motion script
1. First title whips off left while speed lines flash; second title whips in from the right.

## Callouts on the filmstrip
1. (frame 16) speed lines
2. (frame 22) title 1 exits left
3. (frame 32) title 2 enters right

## Parameters
- `from`: <=10 chars
- `to`: <=10 chars

## Max content
titles <=10 chars at 120px

## Layout footprint
~700 x 160 px

## Color usage rules
Second title orange.

## Entrance from off-screen
Yes: frames before 40% of duration may be off-screen; the rest frames must be fully inside the safe frame.

## Component
`components/animations/A51.tsx`
```tsx
import {A51} from './animations/A51';
// registered in components/animations/index.ts, composition id "A51", 72 frames
<A51 from=... to=... />
```
