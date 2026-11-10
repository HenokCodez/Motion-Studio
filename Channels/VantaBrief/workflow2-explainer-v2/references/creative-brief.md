# creative-brief.md (v2.1 extension)
Problem fixed: the first video reused the same catalog animations over and over and looked like a template. **The catalog is a vocabulary, not a menu. Each video must contain animations invented for that video.** The user's references show the style; they are not the only allowed ideas.
## Rules (checked by `v21-lint.py`)
1. At least **one third of the scenes** use a custom animation created for this video (ids `C01`, `C02`, ...).
2. A catalog ID is never used twice with identical params. Distinct animation IDs >= 60% of the number of scenes.
3. Never repeat the same visual metaphor in two scenes (e.g. only one "stick figure", one "balance scale", one "numbered cards" per video).
## Process (before writing scene-plan.json)
1. Write `creative-notes.md` in the video folder: for every scene one line: **narration idea -> concrete drawing (metaphor) -> composition (where things sit) -> motion (what draws/moves/changes) -> primitives used.** Prefer a drawing of the actual thing over a generic card: server racks filling up, a price tag flipping, a coin stack shrinking, lanes with racing dots, a ripple spreading across a map of nodes, a padlock opening, a torn paper revealing the true number, a meter draining, a pipeline with leaks, a stopwatch.
2. Decide per scene: custom (invent) or catalog variant. Catalog variant = change at least two of: layout side/mirroring, icon, direction, count, size within layout-law, a second animation chained in the same scene.
3. Build each custom animation: copy `components/animations/A13.tsx` to `components/custom/C##.tsx` (keep Stage, withFonts registration, primitives only, text >= 24 px, safe frame, palette); add `components/animations/meta/C##.json` (copy the shape of A13.json and set `"custom": true`); import + register in `components/custom/index.ts` with `withFonts(...)`; render `node scripts/render-boards.mjs C##`, then `python scripts/safe-pixel-check.py`, `python scripts/keyframe-check.py C##`, `python scripts/make-board.py C##`; OPEN the filmstrip and fix anything wrong before using it.
## Building blocks
Primitives: Card, Pen, T, Icon, Arrow, Stick (poses stand/point/think/wave), PhotoSlot, LogoBadge, roughLine/roughPath/roughEllipse, plainLine (for geometry that changes every frame, so it does not shimmer), EASE/SPR/prog.
Icons: scales play chip browser check cube bolt star search warn server database globe lock dollar rocket cloud clock person chart gear doc.
Motion vocabulary beyond the catalog: draw-on strokes, pen-circle, strike-through, sliding knob/pill, counting numbers, parallel lanes with moving dots, objects dropping and stacking, shrinking/growing scale, camera pan/zoom between nodes, paper flip, brush wipe, orbiting items, pulse rings.
## Real media
Screenshots: A30 with `theme` dark (default) and `region` set to the part that matters; if the page text is unreadable at that size, zoom (A30 does). Never leave a tiny white page on screen. Logos: A27/A28/A55/A56 with real files only.
