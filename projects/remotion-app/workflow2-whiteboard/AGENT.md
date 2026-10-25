# Instructions for the coding agent (Gemini / Claude Code / Antigravity / Cursor)

You are NOT designing this video. A framework already decides every position, font size, camera move
and timing. **Your only job is to write `beats.json`** (content), then run the checks and LOOK at the previews.

## Hard rules
1. Edit ONLY `beats.json` and drop asset files into `assets/`. NEVER edit `src/`, `remotion/`, `scripts/`.
2. Never write coordinates, pixel sizes, colors, fonts, easing, frame numbers, or **durations**. They do not exist
   in the schema. Scene start/length come from the voiceover transcript automatically.
3. After every change run `npm run w2:plan` (or `npm run build:plan`). It must print `LINT PASSED`.
   On ERROR / LAYOUT ERROR / TIMING ERROR fix the CONTENT (shorter labels, fewer nodes, split the scene,
   correct the narration). Never work around the linter.
4. Run the preview and LOOK at `previews/*.png`. The preview also measures the rendered text; "OVERFLOW" = shorten text.
5. Render only after 3 and 4 are clean.
6. Never fake a logo, icon or screenshot. If something is missing, STOP and ask the user for it.

## Workflow
```
node scripts/transcript-to-text.mjs words.json     # numbered, timestamped voiceover. Copy narration from HERE.
node scripts/find-icon.mjs phone drone server      # find icon names (synonyms work: phone, desktop, ai, money ...)
npm run assets          # real logos + real screenshots (+ measured highlight positions)
npm run build:plan      # beats.json + words.json -> plan.json, lint
npm run preview         # LOOK at every PNG
npm run render
python3 scripts/audit-video.py out/video.mp4   # AFTER rendering: blank canvas <3%, last item visible >=1s, no static hold >3.3s
```

## Reading order = speaking order (v2.1). Nothing ever animates right-to-left or from the middle.
- The framework reveals items in the order the eye reads them: left to right, top to bottom
  (stat: icon+value -> label -> note; title: title -> subtitle -> tag -> chips; compare: A -> B, with "vs" arriving WITH B;
  flow: parent -> children top to bottom; timeline: node + date together). It never reorders them to match the audio.
- Therefore **you must order the items in beats.json in the order they are spoken**. If the narration says
  "Local AI ... your laptop ... a drone", the cards are [Local AI, laptop, drone] left to right. A mismatch is a lint ERROR
  ("X is spoken BEFORE Y but sits after it"). Fix it by reordering the items, never by ignoring it.
- The first item of every scene appears 0.25s after the scene starts, whatever its cue. Pick the sentence's opening
  subject for item 1 so picture and voice agree from the first second. No scene may open on an empty screen.
- Every item stays visible; the LAST item must have >= 1.3s on screen before the scene exits. Do not put cues on the last
  word of a scene; if you must, the framework shows it early and warns (W_EARLY). Prefer an earlier cue word.
- Visuals lead the word by 0.4s (the eye reads first, the voice confirms). Do not try to change this.
- No numbers counting up. No character/mascot (do not set meta.mascot).
- Quiet stretches get a visible hand-drawn underline/marker automatically; more than 3 means the scene is too sparse. Add items.
- Dark logos (GitHub, Notion, Ps/Pr/Ae) are put on a light plate automatically.

## Timing (voiceover sync) - the part that must be exact
- `narration` = the words spoken in that scene, copied **VERBATIM** from the transcript. 8-30 words. Scenes must be
  consecutive and together cover the whole voiceover (97%+). The framework aligns each narration to `words.json`
  and sets the scene's start/length from it.
- Every item needs a `cue`: a word (or 2-3 word phrase) **that is actually spoken in that same scene**. The visual
  appears 0.12s before that word. A cue that is not spoken in the scene is an ERROR. If a word is spoken twice, write
  `"drone#2"` for the second one. Use distinctive words (names, numbers), not "the" or "and".
- If the transcript says "600" write the cue `"600"` (not "six hundred"). Always check the transcript text.

## Visuals: this is a diagram video, not slides
- At least **60% of scenes must contain an icon, logo or screenshot** (lint enforces it). Aim for 80%+.
- Devices and things: use `icon` (desktop, phone, laptop, tablet, tv, drone, server, cloud, database, robot, ai,
  money, lock, shield, rocket, code, terminal, world, camera, ...). Run `find-icon.mjs` for the rest (6,000 more with
  `@iconify-json/tabler` installed).
- Named products/companies: `logo` (simple-icons slug, e.g. "github", "notion", "openai"). Never a plain text box.
- Cited pages (repo, tweet, docs, pricing): a real screenshot via `url`, with `frame` ("browser" | "laptop" | "phone").
- Use the right scene type: `iconrow` for devices/options (2-5 big illustrated cards, `arrows:true` for a pipeline),
  `flow` for how things connect, `shot` for evidence, `stat` for a number (+ `icon`), `compare`, `timeline`, `title`.
- Never 3 scenes of the same type in a row.

## Highlights (screenshots)
- Write `highlights:[{ "text": "MIT license", "cue": "license" }]`. The text must really be on the page;
  `npm run assets` finds its exact position on the live page. Do NOT invent `{x,y,w,h}` numbers (they are guesses, lint warns).
- A highlight always appears AFTER its screenshot is on screen (the framework enforces >= 0.7s). Don't fight it.

## Camera
- It is STILL by default. It only zooms into a highlight on a lone screenshot when the on-page text is small.
  You do nothing. Set `"zoom": false` on a scene to disable even that.

## Scene types (all fields)
```
common:   id, type, narration, title?, titleLogo?, titleCue?
title:    title, subtitle?, tag?, icon?, chips?[{label,cue?}], command?, cue?, iconCue?, subtitleCue?, tagCue?, commandCue?
iconrow:  cards[{id,icon,label,sub?,emphasis?,cue}] (2-5), arrows?
flow:     nodes[{id,label,sub?,icon?,logo?,emphasis?,kind?("bubble"),cue}] (<=7), edges[[from,to]]
shot:     shots[{id,asset,url?,selector?,frame?,label?,labelLogo?,cue,highlights?[{text,cue}]}] (1-2), caption?, captionCue?, zoom?
stat:     value, label, note?, icon?, cue, labelCue?, noteCue?, iconCue?
compare:  a{title,icon?,logo?,bullets[<=4],emphasis?,cue}, b{...}, vsCue?
timeline: points[{id,label,date,detail?,logo?,emphasis?,cue}] (2-4)
```
`emphasis:true` = the ONE orange-accent thing on the screen (at most once per scene). Labels <= 6 words.
