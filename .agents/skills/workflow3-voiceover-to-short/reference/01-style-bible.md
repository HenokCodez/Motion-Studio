# 01 - Style bible (the numbers behind the look)

Everything here is already implemented in `template/src/theme.ts`. This file explains it so you can **judge your render**.
Source material: 3 reference videos (360x640 / 480x854, 87-102 s, 30 fps) + the user's `Grid_1.mp4` (1920x1080, 39.8 s, 30 fps).
"Measured" = taken from the frames. "Chosen" = my adaptation to the black-grid version.

## 1. The overall feel (one paragraph)
A calm, premium "tech explainer": **one idea at a time**. A big clean visual sits in the upper half (a card with soft shadow, a logo
badge, a diagram). Below it, **short bold-keyword captions appear word by word, in sync with the narrator**. A small brand name sits at the bottom.
Motion is smooth and gentle (soft springs, slow zoom, fading lines) - never flashy, no shaking, no glitch, no sound effects, no emojis.

## 2. Timing / pacing (measured)
| Thing | Value |
|---|---|
| Narration speed | ~2.6-2.9 words/second |
| Caption chunk | 4-10 words, 1.5-4.5 s, ends at a natural pause; never ends on "the/of/in/and" |
| Media change | every 2-4 s (nothing static longer than ~4 s) |
| Words per frame group | words appear one by one exactly when spoken |
| Scene count | 45 s video -> ~13-18 scenes; 30 s -> 9-12; 60 s -> 18-24 |
| Last 3-8 s | call-to-action (only if the voiceover has one) |
The reference videos are 87-102 s; ours are 30-60 s, so we use the same per-scene pace but fewer scenes.

## 3. Layout zones (canvas 1080 x 1920) - THE most important section
```
y=0     +--------------------------------------+
        |   top margin (nothing here)          |  0-170
y=170   +--------------------------------------+
        |                                      |
        |        MEDIA ZONE                    |  x 90-990 (900 wide)
        |   (cards, badges, cutouts, diagrams) |  y 170-1030 (860 high), centre (540,600)
        |                                      |
y=1030  +--------------------------------------+
        |   gap                                |
y=1060  +--------------------------------------+
        |        CAPTION ZONE                  |  centre y=1200 (62%), width 880, up to 4 lines
y=1340  +--------------------------------------+
        |   empty breathing room               |  1340-1600
y=1650  |        brand watermark               |  centre y=1650 (86%)
        +--------------------------------------+ y=1920
```
- **With media:** caption centre y = **1200**. **No media (`NONE`, `ICON_SCATTER`, `END_CTA`):** caption centre y = **880** (46%).
- Bullets start at y = 1070, x = 170. Big stat: lead words centre y = 1110, number y ~ 1215-1475.
- Side margins >= 90 px for media, >= 100 px for text. Nothing may touch the screen edge. Media never enters y > 1030 (except END_CTA).
- The caption zone and the media zone must **never overlap** (the reference frames always leave a clear gap).

## 4. Colours (chosen for black grid; layout copied from references)
| Role | Value |
|---|---|
| Background | `#0a0a0a` (grid video bg is rgb 11,11,11) |
| Caption text (settled) | `#F4F4F4` |
| Caption newest word ("ghost") | `#6B6B6B` -> animates to `#F4F4F4` |
| Secondary text | `#9A9A9A` |
| Connector lines | `rgba(255,255,255,0.42)`, 3 px, round caps |
| Badge | white tile (or black tile with white border for white logos, `"bg":"black"`) |
| Card edge | 1.5 px `rgba(255,255,255,0.16)` + deep black shadow + faint white glow |
| Watermark | `rgba(255,255,255,0.30)` |
Only ever white / grey on the black. The ONLY colours on screen come from the logos and screenshots themselves.

## 5. Typography (chosen: Inter; reference is a similar neo-grotesque)
| Thing | Size | Weight | Notes |
|---|---|---|---|
| Caption (<=26 chars) | 84 px | 500 | auto-shrinks: <=44 chars 76, <=64 chars 68, longer 60 |
| Bold keyword | same size | 800 | 1-3 per caption (numbers, brand names, the key noun/verb) |
| Bullets | 58 px | 500 (+800 for keyword) | max 3 bullets, max ~28 chars each |
| Big stat | 190 / 150 / 112 px by length | 800 | pops in with a slight overshoot |
| Wordmark | 230 / 170 / 120 px | 800 | |
| END_CTA top / keyword / bottom | 76 / 170 / 64 px | 500 / 800 / 500 | |
| Watermark | 46 px | 700 | |
Line height 1.12, letter-spacing -0.025em, centred. Sentence case (not ALL CAPS) except brand/keywords.

## 6. Caption behaviour (look at `frames/A_caption_word_by_word.jpg`)
1. All words of the chunk are laid out from frame 0 but **invisible**, so text never jumps/reflows.
2. Each word fades in (6 frames) and rises 16 px, exactly at its spoken start time.
3. A new word is **grey** (`ghost`). When the next word arrives (or ~0.5 s later) it turns white over 10 frames. So the newest 1-2 words are always dimmer.
4. Keyword words are bold (800) from the start.
5. At the end of the scene the whole caption fades out in 4 frames and the next chunk starts (hard cut, no slide).

## 7. Media motion (chosen to match the references)
- **Enter:** spring (no overshoot) 14 frames: fade 0->1, scale 0.90->1, rise 40 px.
- **Hold:** very slow zoom 1.00 -> 1.045 across the whole time the visual is on screen (Ken Burns).
- **Exit:** 6-frame fade. Skipped when the next scene has the same `mediaKey` (visual stays).
- **Lines** (hub/spokes, badge lines) draw themselves in ~14 frames, staggered 4 frames each.
- **Orbit** badges rotate 0.35 deg/frame (alternating direction on the two rings).
- Cards: radius 28 px, shadow `0 44px 90px rgba(0,0,0,.9)` + 1.5px light edge; optional 8 deg Y-tilt (`"tilt"`).
- Sizes: landscape screenshot card = full media width (900 px); portrait photo = max height 820; badges: 130 (line), 170 (spokes), 190-270 (rows), 230 (hub centre).

## 8. The grid background (from the user's Grid_1.mp4) (measured)
- 1920x1080, 39.8 s, no audio, near-static: dark `rgb(11,11,11)` with thin grey grid lines, cell ~158 px (at 1920 px), lines slightly wavy.
- A soft white glow (peak ~ rgb 79 at the centre) sits in the middle and breathes; lines near the glow are brighter. Edges are almost black.
- We rotate it 90 degrees to 1080x1920 (`ffmpeg -vf transpose=1`) so cells keep their size. File: `public/grid_vertical.mp4`.
- It loops (cross-fade at the seam) for any duration up to 60 s. Fallback `"grid": "procedural"` draws a similar grid in code.
- The grid must stay **subtle**: never brighten it, never put it behind a card at full strength (cards have solid backgrounds).

## 9. Brand watermark
Reference videos show the creator's site at the bottom in light grey. **Ours = the user's own handle** in `meta.brand`
(empty string = no watermark). Never write the reference creator's name.
