# Motion principles (read first)

The reference video never feels like slides. Three things create that feeling. Reproduce all three in every scene.

## 1. One continuous "virtual camera"
Objects are not cut in; they travel through a camera that is always very slowly moving.
* **Drift** (`<Scene drift>`): over the whole scene translate X by a random-but-seeded value in [-24, +24] px and Y in [-16, +16] px, and scale 1.00 -> 1.04. Linear easing. Seed from the scene index so neighbouring scenes drift in different directions.
* **Hand-off, not cut.** The outgoing object blurs out while moving ~40 px in the direction of drift; the incoming object blurs in from the other side. They overlap for 6 frames. See "blurOut / blurIn" below. Never hard-cut and never fade through white.
* **Objects morph into each other**: the same window stays on screen while its contents change (A11 -> A12 -> A13 -> A14 are ONE window). Prefer reusing a persistent container to starting a new one.
* **Pan reveals**: a card larger than the frame can slide so only part is visible (A13, A21, A32). Pan on ease-in-out over 20–30 frames, ends inside the safe area.

## 2. Words arrive at the spoken time
* A word's entrance starts at `wordStartFrame - 3`.
* **Entrance "wordPop"** (12 frames): opacity 0->1 over 6f, translateY +14 -> 0 px, blur 8px -> 0, scale 0.92 -> 1. spring `{damping: 18, stiffness: 220, mass: 0.6}`.
* Previous words do not vanish: they stay until the phrase ends, shift to keep the phrase centred (spring `{damping: 20, stiffness: 160}`), and may dim to 100%->70% opacity when older than 4 words.
* **Phrase out**: all words blurOut together 4 frames after the last word was spoken, unless the next scene reuses the object.
* **Emphasis**: red keyword (`HV.red`) or italic. Never bold + red + underline together. Never more than 2 emphasised words per phrase.

## 3. Object entrances (the full vocabulary)
All frame counts at 30 fps. Use ONLY these. A scene uses at most two.
| Name | Motion |
|---|---|
| `softIn` | opacity 0->1, blur 12->0 px, translateY 24->0, scale 0.96->1; 12 f; easing out-cubic. Default for anything calm (cards, screenshots, windows). |
| `popIn` | scale 0.6 -> 1.06 -> 1 (spring damping 11, stiffness 260, mass 0.7), opacity 0->1 in first 4 f. For pills, badges, bubbles, stats (things that "land"). |
| `slideIn` | translateX +120 px -> 0 (or -120), opacity 0->1 in 6 f, blur 6->0; 14 f; out-quart. For lists and side panels. |
| `riseIn` | translateY +80 -> 0, blur 10->0, opacity 0->1; 14 f; out-cubic. For stacks that grow upward/downward (A07, A19, A40). |
| `drawOn` | stroke-dashoffset 100%->0 over N f, out-quad. For lines, circles of a diagram, S-curve, chart. |
| `typeOn` | characters appear at 1 per 2 f with no blur. Only for the search bar (A60) and typed numbers. |
| `countUp` | number eased with out-expo from 0 to target over 45 f, digits tabular; the pill is already on screen at f0. |
| `cursorGlide` | cursor moves on a quadratic bezier with ease-in-out, 18–30 f, tiny overshoot (3 px) then settles; a click = scale 1 -> 0.88 -> 1 over 6 f at the target, target pill `scale 0.97` + blur 1.5 px for 4 f ("pressed"). |
| `blurOut` | opacity 1->0, blur 0->14 px, scale 1->1.03; 8 f; in-quad. Always the exit. |
| `focusDim` | non-active items opacity 1 -> 0.3 and blur 0 -> 1.5 px over 8 f; active item scale 1.04. |

Easing: `Easing.out(Easing.cubic)` default; `Easing.inOut(Easing.cubic)` for pans; springs only for popIn and re-layout.

## 4. Timing / density
* Phrase scenes last 1.2–3.5 s. Object scenes 2–6 s. A hook scene <= 2.5 s.
* Something visibly changes every <= 3 s (a new word counts).
* Max 1 "wow" object per 3 s; do not stack a bubble, a pill and a list in the same frame.

## 5. Blur is the signature
Motion blur-in/out (CSS `filter: blur()`), not motion trails. Peak blur 14 px at 1080p. Do not exceed or the text becomes unreadable in QA stills (+0.15 s still must show the element recognisable).

## 6. Sound
None on motion. `ui` click only on screenshot cards (A11, A14, A20, A31, A36, A45, A49). `ding` only on chapter cards (A64). No music.

## 7. Never
Arrows, hand-drawn circles/X/scribbles, zoom-punches > 1.08, screen shake, glitch, spinning, bouncing text, emoji (one exception: a single emoji inside a quoted line, as in the reference), neon glow, gradients (exception: the A18 gradient word, kept tame: blue->green or red->amber), drop shadows heavier than `0 8px 24px rgba(0,0,0,.12)`.
