# A55 — Logo Orbit
**Category:** Logos/brand  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A55.png` (open it together with this file)

## Best used when
Subject (hub) vs several other companies orbiting it.

## Not suitable when
More than 5 logos.

## Duration and easing
- Duration: **90 frames @30fps (3.0s)**
- Easing: orbit ring EASE.inOut f4-26; satellites spring pop staggered 6f from f14; rotation 0.045 rad/frame
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | hub popping |
| 10 | hub + orbit ring drawing |
| 22 | satellites popping |
| 40 | 4 logos orbiting |
| 60 | orbiting |
| 89 | rest: 4 real logos mid-orbit around DeepSeek hub |

## Plain-English motion script
1. Hub (orange circle with its real logo) pops in; an orbit ring draws; real logos on cream badges pop in and orbit slowly.

## Callouts on the filmstrip
1. (frame 10) hub with real logo
2. (frame 40) logos orbit
3. (frame 89) orbit ring

## Parameters
- `names`: 3-5 strings
- `files`: files in assets/logos/
- `hub`: <=12 chars
- `hubFile`: file in assets/logos/

## Max content
<=5 satellites

## Layout footprint
~1180 x 600 px

## Color usage rules
Hub orange; logos keep native colors on cream badges.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A55.tsx`
```tsx
import {A55} from './animations/A55';
// registered in components/animations/index.ts, composition id "A55", 90 frames
<A55 names=... files=... />
```
