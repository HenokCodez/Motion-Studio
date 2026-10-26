# 02 - Scene template catalog (the ONLY visuals you may use)

A scene = `media` (upper zone) + `caption` (lower zone). Pick ONE media template and ONE caption mode per scene.
Copy the JSON snippet, replace the values. `ImgRef` = `{"src":"img/<file>","w":<px>,"h":<px>}` taken from `public/img/manifest.json`
(optional `"bg":"black"` on a logo that is white/light so its badge tile is black; optional `"alt"`).

## A. Decision table - what is the narrator saying?

| The narration... | Use media | Caption |
|---|---|---|
| opens the video / names ONE product or company ("ChatGPT can now...") | `BADGE_LINE_CARD` (logo + its page) or `HERO_CARD` | WORDS |
| talks about a website, app, dashboard, code, document | `HERO_CARD` with a real screenshot | WORDS |
| talks about a person / object / place / physical thing | `CUTOUT` (transparent object) or `HERO_CARD` (photo) | WORDS |
| names 2-4 tools that connect to / feed one main thing ("connects to Gmail, Slack, Notion") | `HUB_SPOKES` | WORDS |
| names 4-6 competitors / models / "the whole ecosystem" | `ORBIT` | WORDS |
| compares two or three named things ("DeepSeek vs Kimi") | `BADGE_ROW` | WORDS |
| lists plans/pages/versions/options ("three tiers", "many templates") | `CARD_STACK` | WORDS |
| lists 2-3 parallel facts/features/negatives ("no subscriptions, no limits, no internet") | any media (or `NONE`) | **BULLETS** |
| says a number/price/size/percent ("1400GB", "$20", "10x") | `HERO_CARD`/`BADGE_ROW`/`NONE` | **BIG_STAT** |
| describes loading / progress / "step by step" / "one layer at a time" | `PROGRESS_BAR` | WORDS |
| says a product/tool name as the hero moment ("introducing AirLLM") | `WORDMARK` | WORDS |
| asks a question / "why?" / confusion | `ICON_SCATTER` (glyph `?`) | WORDS |
| transition sentence with nothing visual ("and here is what makes it different") | `NONE` | WORDS |
| call-to-action at the end ("comment X", "follow", "link in bio") | `END_CTA` | NONE |

If two rows fit, pick the one you have NOT used in the last 2 scenes.

---------------------------------------------------------------------------------------------------

## B. Media templates

Reference frames: `frames/B_*.jpg` (cards), `C_*.jpg` (badges/diagrams), `D_*.jpg` (text/misc), `E_*.jpg` (cutouts/CTA).

### 1. `NONE` - caption only  (ref: B "NO_MEDIA")
Caption sits at the centre of the screen (y=880), the grid shows around it.
```json
{"type": "NONE"}
```
Use for short transitions. Max 2 in a row. Never as scene 1.

### 2. `HERO_CARD` - one screenshot or photo on a card  (ref: B "HERO_CARD landscape / dark UI / portrait photo")
```
        +------------------------+   landscape screenshot: 900 px wide, height by aspect
        |   screenshot / photo   |   portrait photo: max 820 px high (about 460 wide)
        +------------------------+   rounded corners, soft shadow, thin light edge
            caption below
```
```json
{"type": "HERO_CARD", "image": {"src": "img/pricing-page.jpg", "w": 1600, "h": 1000}, "tilt": "none"}
```
`tilt`: `"none"` (default), `"left"` or `"right"` (8 degrees, use at most once per video for variety).
Rules: image min short side 500 px (else soft); must be a *meaningful* crop (hero section of the page, not a tiny footer). Dark screenshots look best.
Mistakes: a screenshot with a white page edge/border (run prep_images.py - it trims it); tiny text unreadable (crop to the relevant part first - viewers cannot read small text anyway).

### 3. `CUTOUT` - transparent object (laptop, GPU, printer, phone, product box)  (ref: E "CUTOUT photo")
Object floats with a deep drop-shadow and a faint ground glow. No card, no border.
```json
{"type": "CUTOUT", "image": {"src": "img/laptop.png", "w": 1400, "h": 900}, "scale": 1}
```
`scale` 0.7-1.0 (default 1). The PNG **must have a transparent background** (use `prep_images.py --cutout`). Never use a JPG here.

### 4. `BADGE_LINE_CARD` - logo badge(s) on a line above a card  (ref: C "BADGE_LINE_CARD")
```
   ----(logo)----------(logo)----      1 badge: vertical line down into the card
        +--------------------+         2-3 badges: horizontal line across with badges on it
        |       card         |
        +--------------------+
```
```json
{"type": "BADGE_LINE_CARD",
 "badges": [{"src": "img/openai.png", "w": 512, "h": 512}, {"src": "img/capcut.png", "w": 512, "h": 512, "bg": "black"}],
 "card": {"src": "img/capcut-plugin.jpg", "w": 1600, "h": 1000}}
```
1-3 badges. Great for scene 1 ("X can now...") and for "X connects to Y".

### 5. `HUB_SPOKES` - one centre + 1-4 connected items  (ref: C "HUB_SPOKES (3)", "(4)", "w/ laptop")
Lines draw out from the centre to each item.
```json
{"type": "HUB_SPOKES",
 "center": {"src": "img/tool.png", "w": 512, "h": 512},
 "centerKind": "badge",
 "spokes": [{"src": "img/slack.png", "w": 512, "h": 512}, {"src": "img/gmail.png", "w": 512, "h": 512}, {"src": "img/notion.png", "w": 512, "h": 512, "bg": "black"}]}
```
`centerKind`: `"badge"` (logo tile, default) or `"cutout"` (centre is a transparent object image, e.g. a laptop with chips around it).
Spoke positions are fixed by count (1: top; 2: bottom-left/right; 3: top + bottom-left/right; 4: four corners). 1-4 spokes only.

### 6. `ORBIT` - centre badge with rings and small badges circling  (ref: C "ORBIT")
```json
{"type": "ORBIT",
 "center": {"src": "img/server.png", "w": 512, "h": 512},
 "orbiters": [{"src": "img/a.png", "w": 512, "h": 512}, {"src": "img/b.png", "w": 512, "h": 512}, {"src": "img/c.png", "w": 512, "h": 512}, {"src": "img/d.png", "w": 512, "h": 512}]}
```
3-6 orbiters (alternate between outer and inner ring). Use for "all the big models / the whole industry".

### 7. `BADGE_ROW` - logos in a row, optionally under a card  (ref: C "BADGE_ROW + card", E/C "BADGE_ROW (square)")
```json
{"type": "BADGE_ROW", "shape": "circle",
 "badges": [{"src": "img/kimi.png", "w": 512, "h": 512, "bg": "black"}, {"src": "img/deepseek.png", "w": 512, "h": 512, "bg": "black"}],
 "card": {"src": "img/app-ui.jpg", "w": 1600, "h": 1000}}
```
`shape`: `"circle"` or `"square"`. `card` optional (omit -> big badges in the middle). 1-3 badges.

### 8. `CARD_STACK` - 2-4 cards stacked with depth  (ref: B "CARD_STACK", "CARD_STACK fan")
Back cards peek up-right, dimmed. `badges` (optional) adds a line with logos on top.
```json
{"type": "CARD_STACK",
 "cards": [{"src": "img/plan1.jpg", "w": 900, "h": 1200}, {"src": "img/plan2.jpg", "w": 900, "h": 1200}, {"src": "img/plan3.jpg", "w": 900, "h": 1200}],
 "badges": [{"src": "img/cursor.png", "w": 512, "h": 512}]}
```
Last card in the list is the FRONT card. Use portrait-ish or square images (they are fitted into 640 x ~800).

### 9. `PROGRESS_BAR` - loading bar that fills while the scene(s) play  (ref: D "PROGRESS_BAR")
```json
{"type": "PROGRESS_BAR", "from": 10, "to": 90, "label": "LOADING..."}
```
Percent goes `from` -> `to` across the whole time this media stays on screen (use `mediaKey` over 2 scenes for a longer fill).

### 10. `WORDMARK` - big product name as the visual  (ref: D "WORDMARK")
```json
{"type": "WORDMARK", "text": "AirLLM"}
```
<= 12 characters. Use at the "name reveal" moment.

### 11. `ICON_SCATTER` - four giant glyphs around centred caption  (ref: D "ICON_SCATTER")
```json
{"type": "ICON_SCATTER", "glyph": "?"}
```
Glyph is one character (`?`, `!`, `$`, `%`, `+`). Caption automatically moves to the centre. Use once at most.

### 12. `END_CTA` - final call to action  (ref: E "END_CTA comment keyword", "follow")
Staggered: top line -> big "KEYWORD" -> image -> bottom line. **Caption mode must be NONE.** Must be the last scene, 3.5-6 s.
```json
{"type": "END_CTA", "top": "Comment", "keyword": "GUIDE",
 "image": {"src": "img/guide-cover.png", "w": 900, "h": 1100},
 "bottom": "and I will send you the setup", "bottomBold": "setup"}
```
`image` optional (product mockup: transparent PNG looks best). `keyword` <= 10 chars (it is shown in quotes). For a follow CTA use
`"top": "Make sure you follow"`, `"keyword": "@yourhandle"` (<= 10 chars looks bigger; longer is shrunk), `"bottom": "so the system sends it to you"`.

---------------------------------------------------------------------------------------------------

## C. Caption modes

### WORDS (default; already filled by chunk.py)
Do not edit times. You may change which words are bold (`"b": true`). Keep 1-3 bold words (numbers, brand, key noun/verb).

### BULLETS - replaces the words caption with 1-3 icon lines (ref: D "BULLETS")
Use when the sentence is a list. Each bullet appears at the moment the narrator starts that phrase (`at` = absolute seconds from words.json).
```json
"caption": {"mode": "BULLETS", "icon": "x",
  "items": [{"text": "No subscriptions.", "at": 3.2},
            {"text": "No usage limits.",   "at": 4.4, "bold": "limits"},
            {"text": "No internet.",       "at": 5.5}]}
```
`icon`: `"x"` (negatives), `"check"` (positives), `"arrow"` (steps/what it does), `"sparkle"` (features/benefits). Max 3 items, <= 28 chars each, `bold` = a substring to embolden.
Write bullets from the narrator's actual words (shortened), not new text. Pair with a visual media (screenshot/cutout), or `NONE`.

### BIG_STAT - small lead words + one huge number/word (ref: D "BIG_STAT")
`words` = the words BEFORE the stat (copy from the scene's WORDS, drop the stat word), `stat` = the number/word (<= 12 chars), `statAt` = when it is spoken.
```json
"caption": {"mode": "BIG_STAT",
  "words": [{"t": "normally", "s": 16.1, "e": 16.5}, {"t": "requires", "s": 16.5, "e": 17.0}, {"t": "around", "s": 17.0, "e": 17.4}],
  "stat": "1400GB", "statAt": 17.5}
```

### NONE - no caption (only with END_CTA)

---------------------------------------------------------------------------------------------------

## D. Keeping a visual on screen across scenes (`mediaKey`)
When the narrator continues about the same thing for 2-3 chunks, give those scenes an identical `mediaKey` and identical `media`:
```json
{"id":"s05", "mediaKey":"codebase", "media":{ ...HERO_CARD... }, ...},
{"id":"s06", "mediaKey":"codebase", "media":{ ...same HERO_CARD... }, ...}
```
The visual does not re-enter or fade between them; the slow zoom and progress bar continue smoothly. Max 3 scenes (about 8 s) per key.

## E. Letter badge (when no real logo exists)
`{"src": "", "w": 512, "h": 512, "alt": "Slack"}` shows a white tile with the letter "S". Use sparingly; mention it in your final summary.

## F. Copy-ready scene (complete)
```json
{
  "id": "s03", "start": 6.0, "end": 9.3,
  "media": {"type": "HUB_SPOKES", "center": {"src": "img/tool.png", "w": 512, "h": 512},
            "spokes": [{"src": "img/slack.png", "w": 512, "h": 512}, {"src": "img/gmail.png", "w": 512, "h": 512}]},
  "caption": {"mode": "WORDS", "words": [ {"t": "Think", "s": 6.15, "e": 6.4}, "... (from chunk.py, do not edit times)" ]}
}
```
