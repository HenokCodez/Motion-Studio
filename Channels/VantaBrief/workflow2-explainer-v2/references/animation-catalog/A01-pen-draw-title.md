# A01 — Pen-Draw Title
**Category:** Reveals/intros  |  **Status:** rendered  |  **Filmstrip:** `filmstrips/A01.png` (open it together with this file)

## Best used when
Opening a topic or chapter: 'Real World or Benchmark?', 'Let's talk about X'.

## Not suitable when
Lists, comparisons, anything needing more than one headline.

## Duration and easing
- Duration: **75 frames @30fps (2.5s)**
- Easing: icon: EASE.inOut cubic-bezier(0.65,0,0.35,1) f0-26; title wipe: same f14-46; subtitle: EASE.out (0.22,1,0.36,1) f46-62
- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {damping 12, stiffness 140, mass 0.7}, SPR.settle {9,90,1}, SPR.wobble {5,70,1}

## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)
| Frame | What is on screen |
|---|---|
| 0 | empty frame, grid only |
| 12 | icon 45% drawn (top of scales + beam), title not started |
| 24 | icon fully drawn orange; title wipe 22%, nib dot at left of title |
| 36 | title 70% revealed, orange nib dot at wipe edge |
| 52 | title complete, nib gone, subtitle 25% visible, 12px below rest |
| 74 | rest: icon (960,300) 190px, title centered baseline y600, subtitle baseline y700 |

## Plain-English motion script
1. f0-26: the orange icon is pen-drawn stroke by stroke (stroke-dashoffset 1->0).
2. f14-46: the title is revealed left-to-right by a clip wipe; an orange dot (the pen nib, r=10) rides the wipe edge.
3. f46-62: subtitle fades in and rises 16px.
4. f62-74: hold.

## Callouts on the filmstrip
1. (frame 24) icon pen-draws
2. (frame 36) title wipes L→R
3. (frame 36) orange nib rides the wipe edge
4. (frame 74) subtitle rises + fades in

## Parameters
- `title`: string, <=45 chars, auto-fits to 1612 px (96px max, never below fit)
- `subtitle`: string <=60 chars
- `icon`: key of ICONS (scales, play, chip, browser, check, cube, bolt, star, search, warn)

## Max content
title <=45 chars (auto-shrinks); subtitle <=60 chars

## Layout footprint
icon 190x190 + title <=1612 wide x ~100 tall + subtitle = ~1200x520 px centered (62% x 48%)

## Color usage rules
Icon orange (the single orange focal). Title/subtitle cream. No blue.

## Entrance from off-screen
No: every frame must be inside the safe frame.

## Component
`components/animations/A01.tsx`
```tsx
import {A01} from './animations/A01';
// registered in components/animations/index.ts, composition id "A01", 75 frames
<A01 title=... subtitle=... />
```
