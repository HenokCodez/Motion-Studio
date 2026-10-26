# 03 - From transcript to storyboard (how to choose visuals)

Input: `storyboard.json` produced by `chunk.py` (each scene has `note` = spoken text, all media `NONE`).
Output: the same file with `media` (and sometimes `caption`) filled in, plus `plan.md`.

## 1. Procedure (do exactly this)
1. Read all `note` lines top to bottom like a script. Write one sentence: **what is this video about, who is it for?**
2. Find the **hook** (scene 1-2), the **core claim**, the **proof/steps**, the **twist/limitation** (if any), the **CTA** (if any).
3. For each scene ask three questions in order:
   a. *Is there a concrete thing named?* (product, company, site, number, object) -> show **that thing**.
   b. *Is it a list or a number?* -> BULLETS / BIG_STAT.
   c. *Is it only a connecting sentence?* -> `NONE` (or keep the previous visual via `mediaKey`).
4. Fill `plan.md` (table). Count templates. Fix monotony (see rules). Only then edit the JSON.

## 2. Rules (hard)
| # | Rule |
|---|---|
| R1 | Scene 1 is a visual hook (logo/badge/card). Never `NONE`. |
| R2 | A visual must *relate to the words* spoken in that scene. If you cannot name the relation in 5 words, use `NONE`. |
| R3 | >= 5 different templates in a 45 s video (>= 4 in 30 s). The same template at most 2 scenes in a row (unless it is the same `mediaKey` continuation). |
| R4 | Max 2 `NONE` in a row. At most 25% of all scenes are `NONE`. |
| R5 | Every distinct image appears once. Do not reuse an image in non-adjacent scenes unless the narrator returns to the topic. |
| R6 | `BULLETS`: only when the sentence is truly a list; max 3 items; use the narrator's words. Max 2 BULLETS scenes per video. |
| R7 | `BIG_STAT`: only for a number/price/size/short punchy word. Max 2 per video. |
| R8 | `ORBIT`, `ICON_SCATTER`, `PROGRESS_BAR`, `WORDMARK`: max 1 each per video (they are "special moments"). |
| R9 | `tilt` on at most one HERO_CARD. |
| R10 | `END_CTA` only if the narrator ends with a call to action; it is the final scene and has `"caption": {"mode":"NONE"}`. |
| R11 | Never edit `start`/`end`/word times. If a scene feels wrong, change its media, not its timing. (Merging two scenes is allowed only by re-running chunk.py with different rules - do not do it by hand.) |
| R12 | If you lack an asset after trying (04-image-handling.md), downgrade: HERO_CARD -> NONE, logo -> letter badge. Say so in the summary. |

## 3. Choosing what to show for abstract sentences
| Sentence type | Do this |
|---|---|
| "Most people have no idea what it can do" | `NONE` or keep previous visual with `mediaKey` |
| "It's changing everything" | `NONE`; or `WORDMARK` of the product if it's the reveal |
| Pain point ("costs a fortune every month") | pricing page screenshot as `HERO_CARD`/`CARD_STACK` |
| Process ("it reads, understands, writes") | `HERO_CARD` of the UI + `BULLETS` with `arrow` |
| Benefit list ("free, open source, no limits") | `BULLETS` with `sparkle`/`check` |
| Scarcity / limit ("only works on X") | `BIG_STAT` or `NONE` |
| Before/after | two scenes: `HERO_CARD` (before) then `HERO_CARD` (after); not a split screen (not available) |

## 4. Worked example (the file `examples/storyboard.example.json`, 38.7 s, 14 scenes)

| id | spoken text | media | caption | why |
|---|---|---|---|---|
| s01 | AI coding tools cost a fortune every month. | `BADGE_LINE_CARD` (2 logos + pricing page) | WORDS | hook: named products + their price page |
| s02 | But there is now a free and open source option. | `HERO_CARD` (dark app UI) | WORDS | the new thing |
| s03 | Think of it like a personal coworker on your desktop. | `HUB_SPOKES` (tool + 3 apps) | WORDS | metaphor = something connected to many apps |
| s04 | You describe a task once. | `NONE` | WORDS | short connecting sentence |
| s05+s06 | It reads your entire codebase, / catches the bugs and opens the pull request. | `HERO_CARD` (same `mediaKey`) | s05 WORDS, s06 **BULLETS** (`arrow`, 2 items) | one visual across two chunks; second is a list of actions |
| s07 | Normally this needs around 1400GB of memory. | `BADGE_ROW` (2 logos + UI card) | **BIG_STAT** `1400GB` | a number |
| s08 | Now it runs on a four gig laptop. | `CUTOUT` (laptop) | WORDS | physical object |
| s09 | Loading one layer at a time instead of the whole model. | `PROGRESS_BAR` 8->92 | WORDS | "loading" |
| s10 | It connects to Gmail, Slack and Notion. | `ORBIT` (centre + 5 logos) | WORDS | several named tools |
| s11 | Every morning it sends you a structured briefing. | `CARD_STACK` (3 cards) | WORDS | a document/briefing |
| s12 | The only limitation is speed. | `NONE` | **BIG_STAT** `Speed` | punchy word |
| s13 | But you just cut your AI costs to zero. | `HERO_CARD` portrait, `tilt:left` | WORDS | payoff |
| s14 | Comment GUIDE and I will send you the setup. | `END_CTA` | NONE | CTA |
Templates used: 10 different. This is the density to aim for (but with real images).

## 5. `plan.md` template
```
# Plan
Topic: <one sentence>   Audience: <who>   Length: <s>   Brand: <handle or none>   CTA: <keyword or none>

| scene | spoken text | template | caption | assets needed (exact) | status |
|-------|-------------|----------|---------|-----------------------|--------|
| s01 | ... | BADGE_LINE_CARD | WORDS | logo A, logo B, screenshot of A's pricing page | todo |
```
Update `status` to `ok / fallback(<what>)` as you source assets.

## 6. Timing details for BULLETS / BIG_STAT
Look up exact times in `words.json` (each word has `s`). `at` = `s` of the FIRST word of that bullet's phrase. `statAt` = `s` of the stat word.
If the stat is spoken as several words ("fourteen hundred gigabytes"), still write the digits ("1400GB") and use the first word's `s`.
