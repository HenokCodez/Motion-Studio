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

## What has and has not been verified

Verified (run in the authoring sandbox):
- Layout solver, planner, linter, build script: run on `beats.example.json`; 11 guardrail tests pass (`npm test`),
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
