# Adding an animation (only when no catalog entry fits)
1. Copy components/animations/A13.tsx to A<next>.tsx; keep: Stage wrapper, withFonts registration, T/Card/Pen/Icon/Arrow primitives only, text >= 24px, everything inside safe frame (x154-1766, y86-994, keep 8px for stroke wobble), palette from style-bible.
2. Add components/animations/meta/A<next>.json (copy A13.json: id, name, category, duration, keyframes[6], easing, bestFor, notSuitable, keyframeTable, script, params, maxContent, footprint, colorRules, callouts[{n,k,x,y,text}], status, entrance).
3. Register in components/animations/index.ts (import meta + component, wrap with withFonts).
4. Run: node scripts/render-boards.mjs A<next> && python3 scripts/safe-pixel-check.py && python3 scripts/make-board.py A<next> && python3 scripts/gen-specs.py
5. Open filmstrips/A<next>.png and fix anything wrong BEFORE using it in a plan.
