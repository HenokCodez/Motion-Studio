# whiteboard-kit

A Remotion framework for fast, hand-drawn, dark-canvas tech explainers (the "REA" style):
real logos, real screenshots, one idea per screen, something new every ~2 seconds.

## Why a framework instead of a prompt

LLMs writing Remotion directly place every element with absolute x/y and invent sizes, camera
moves and timing blind. That produces overlaps, clipped text, tiny fonts and a slowly drifting
camera over one giant canvas. Prompts cannot fix spatial reasoning without feedback.

So the split is:

| Who | Decides |
|---|---|
| **LLM** | Content only: `beats.json` (scenes, labels, which logo/screenshot, which spoken word triggers which item) |
| **Layout solver** (`src/core/layout.mjs`) | Every position and size. One cleared screen per scene. Text scales UP to fill space, never below the floor. Throws if it can't fit. |
| **Planner** (`src/core/plan.mjs`) | Reveal times from narration word timestamps, snappy camera punch-ins clamped to the canvas, filler pulses so no gap > 2 s |
| **Linter** (`src/core/lint.mjs`) | Fails the build on overlap, off-screen, font < 32/40px, scene > 12 s, missing logo/screenshot, camera leaving the canvas, mascot overlapping content |
| **Renderer** (`remotion/Video.tsx`) | Draws the plan. Contains no layout decisions. |

## v2 changes (from the first real video review)

| Problem seen in the first real render | Cause | v2 fix |
|---|---|---|
| Animations did not match the voiceover | Scene start = sum of AI-guessed `dur`; cue words searched only inside that guessed window | Scenes are **aligned to words.json** from their verbatim `narration`; `dur` is ignored. Cue not spoken in scene = error. Uncovered narration = error. |
| Highlights started before the thing appeared | Highlight cue could precede its screenshot; renderer drew it independently | Parent-before-child ordering (screenshot pulled earlier; highlight >= 0.7s after). Renderer refuses to draw a highlight before its parent. |
| Highlights in the wrong place | AI guessed {x,y,w,h} on images it cannot see | `highlights:[{text}]`: the exact text range is measured on the live page (`<asset>.boxes.json`). |
| Text only, no diagrams | No diagram vocabulary | 113 bundled hand-drawn icons (drone, desktop, phone, server...), `iconrow` scene, icons in nodes/titles/stats/compare, browser/laptop/phone frames, lint refuses videos where <60% of scenes have a visual. |
| Unnecessary, clipping zooms; wacky motion | Camera moved on every reveal; bouncy springs; scale pulses; constant drift | Camera still by default; max 2 zooms, only into a highlight on a lone screenshot; everything else fades during a zoom. Critically damped springs, no drift, pulses are stroke-only. |
| Text spilling out of boxes | Character-width guess vs. real font | `measure-font.mjs` measures the real fonts; `preview.mjs` renders in a real browser and FAILS on any text outside its box. |

## v2.1 changes (from a frame-by-frame review of a real 268 s render)

| Measured in the render | Fix |
|---|---|
| 32% of the video (84.8 s) was an empty canvas, and the narrator was talking over 88% of it | First item guaranteed at 0.25 s; DEAD AIR is a lint error; `scripts/audit-video.py` measures it from the finished mp4 |
| 19 of 31 scenes showed their last item < 1 s before exiting | Tail guard: last item >= 1.3 s on screen, lint error otherwise; visuals lead the word by 0.4 s |
| Items appeared right-to-left / middle-first (compare panels, flow nodes, stat labels before the number) | Reveal order is reading order (L->R, T->B). Speaking order that contradicts it is a lint error that tells the author to reorder |
| Text appeared before its box; arrows appeared before their target | Box draws in 8 frames, its text follows after 3; arrows draw for 9 frames and land exactly as the target appears; items slide in from the left |
| Counters showed wrong numbers ("0 Dev + AI", "64% Fit", "1 Options") | Count-up removed; values pop in final |
| 12 static holds > 3 s (the filler "pulse" was invisible) | Filler is now a visible hand-drawn underline then marker; lint counts only visible events |
| Timeline had no line or dots (renderer omission) | Line draws left to right, dots pop with their points |
| Photoshop/Premiere/GitHub logos nearly invisible | Dark logos auto-detected (sharp) and placed on a light plate |
| Mascot | Removed (opt-in only) |

## Quick start

```bash
npm install
npx playwright install chromium
# 1. narration audio -> public/audio/narration.mp3 ; word timings:
whisper public/audio/narration.mp3 --word_timestamps True --output_format json --output_dir out
node scripts/words-from-whisper.mjs out/narration.json > words.json
# 2. let the agent write beats.json (give it AGENT.md), then:
npm run assets        # real logos + screenshots (fails loudly on anything it can't get)
npm run build:plan    # beats.json -> plan.json + lint
npm run preview       # previews/*.png: LOOK at them
npm run studio        # or: npm run render
npm test              # guardrail tests
```

Add to `beats.json` meta: `"audio": "audio/narration.mp3"` and optionally
`"mascot": ["point","think","shrug","cheer"]` with sprites in `assets/mascot/<pose>.png`.

## Other tools (when to use them)
- **Lottie** (`@remotion/lottie`, files from LottieFiles): drop-in premium *animated* icons/characters if you want them
  instead of drawn icons. Not a replacement for the framework (it does not solve layout or voiceover sync).
- **Motion Canvas**: code-driven vector animation + audio sync editor; a different engine, would mean rewriting the renderer.
- **Iconify / Tabler**: `npm i @iconify-json/tabler` unlocks ~6,000 icons with no other change.

## What has and has not been verified

Verified (run in the authoring sandbox):
- Layout solver, planner, aligner, linter, build script: run on `beats.example.json`; 34 guardrail tests pass (`npm test`),
  including that bad input is REJECTED (9-node flow, cycles, too-wide flow, 15 s scene, overlap, off-screen,
  tiny font, camera leaving canvas, mascot overlap, missing assets).
- Static previews of all 6 scene types render with no overlap/clipping.
- Remotion files pass a TypeScript syntax check.

NOT verified (no network in the sandbox):
- `npm install`, `remotion render`, and the Remotion components running against real Remotion.
  Expect to fix small API/typing nits on first run. They are in `remotion/Video.tsx` only.
- `scripts/fetch-assets.mjs` (needs network). Adobe logos are not in simple-icons: drop them into `assets/logos/` yourself.
- Text width uses a conservative character-width model, not real font metrics. It over-estimates on purpose,
  but if a specific font renders wider, bump the factors in `cw()` in `layout.mjs`, or wire in `@remotion/layout-utils` `measureText`.
- The preview uses fallback fonts. Excalifont/Virgil (the true hand-drawn look) must be added via `@font-face`
  in `public/fonts`; the Remotion layer defaults to Kalam.

v2 specifically verified in the sandbox: transcript alignment (wrong authored durations change nothing), cue timing
(visual lands 0.12 s before its word), highlight-after-screenshot ordering, still camera, icon loading + synonyms,
real-font width measurement + render-based overflow check (using a stand-in font), exact on-page text measurement
(Playwright on a local page), and rough.js hand-drawn icon rendering (rendered and inspected).
NOT verified: Remotion rendering of v2 (`remotion/Video.tsx` only syntax-checked), `fetch-assets.mjs` against live
websites, behaviour with your real Virgil font (run `node scripts/measure-font.mjs` once), real Whisper transcripts.
