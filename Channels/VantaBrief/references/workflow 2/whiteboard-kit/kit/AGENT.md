# Instructions for the coding agent (Gemini / Claude Code / Cursor)

You are NOT designing this video. A framework already decides every position, font size,
camera move and timing. **Your only job is to write `beats.json`.**

## Hard rules
1. Edit ONLY `beats.json` (and drop asset files into `assets/`). NEVER edit `src/`, `remotion/`, `scripts/`.
2. Never write x/y coordinates, pixel sizes, colors, fonts, easing or frame numbers. They don't exist in the schema.
3. After every change run `npm run build:plan`. It must print `LINT PASSED`.
   If it prints an ERROR or LAYOUT ERROR, fix the CONTENT (shorter labels, fewer nodes, split the scene).
   Do not try to work around the linter.
4. Then run `npm run preview` and LOOK at `previews/*.png` (and `*_cam.png`). Fix anything ugly by changing content.
5. Render with `npm run render` only after steps 3 and 4 are clean.
6. Never fake a logo or a screenshot. If `npm run assets` reports something missing, STOP and ask the user for it.

## Writing good beats (this is where the "fast YouTube" feel comes from)
- One idea per scene. 2-4 items on screen. 3-9 seconds per scene (hard max 12).
- One scene per sentence or two. If narration has 5 ideas, make 5 scenes.
- Every item gets a `cue`: the word in the narration that should make it appear
  (the product name when it's named, the number when it's said). Needs `words.json`.
- Labels <= 6 words. If you need a paragraph, it should be a screenshot with a `highlights` box, not text.
- Name every product -> give it its real `logo` (lowercase simple-icons slug, e.g. "github", "notion", "openai").
- Any tweet / repo / docs page / pricing page you cite -> a real screenshot (`shots[].url` so it can be captured).
- Mix scene types; never use the same type 3 times in a row.

## Scene types (all fields)
```
common:   id, type, dur(sec, 2-12), narration, title?, titleLogo?, titleCue?
flow:     nodes[{id,label,sub?,logo?,emphasis?,kind?("bubble"),cue?}], edges[[fromId,toId]]   (<=7 nodes)
shot:     shots[{id,asset,url?,selector?,label?,labelLogo?,cue?,highlights?[{x,y,w,h (0-1 fractions),cue?}]}] (1-2), caption?, captionCue?
stat:     value("$600+","205,197"), label, note?, cue?, labelCue?, noteCue?
compare:  a{title,logo?,bullets[<=4],emphasis?,cue?}, b{...}, vsCue?
timeline: points[{id,label,date,detail?,logo?,emphasis?,cue?}]   (2-4)
title:    title, subtitle?, tag?, chips?[{label,cue?}], command?, cue?, subtitleCue?, tagCue?, commandCue?
```
`emphasis:true` = the one orange-accent thing on the screen (use at most once per scene).
`highlights` zoom the camera onto that region automatically: use them on screenshots instead of reading text aloud.

## Loop
`npm run assets` -> `npm run build:plan` -> `npm run preview` (look) -> fix beats.json -> `npm run render`
