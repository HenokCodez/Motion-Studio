# v2.1 (additive update over v2.0; the fixed workflow, IDs A01-A57 and all commands are unchanged)
## Fixed
- Pen strokes made of several subpaths drew as detached fragments (stray arc in A14 and others). Pen now draws subpaths in order.
- Per-frame hand-drawn jitter ("wobble"): stick-figure legs, A12 rope and A33 morphing line no longer re-randomize every frame.
- A30 screenshot: dark-theme inversion, bigger sketch browser, circle on a chosen `region`, zoom into it.
## Added
- Pacing: `TimeCtx` + `SceneVideo` auto-stretch (plan.pacing auto|legacy), per-animation `delay`/`speed`; `references/pacing-rules.md`.
- Creativity: `components/custom/` registry for per-video animations, `references/creative-brief.md`, 12 new icons.
- Checks: `scripts/v21-lint.py` (timeline, branding, creativity), `scripts/content-check.py`, `scripts/frame-audit.py`.
- `SKILL.md`: appended "v2.1 extensions" section (no existing line changed).
## Compatibility
Old scene plans still work. They now get auto pacing unless they set `"pacing":"legacy"`.

## v2.1.1
- Fixed `scripts/safe-pixel-check.py` path parsing on Windows (split on '/' broke on backslash paths; now uses pathlib). All other scripts were reviewed: none parse paths with '/'.

## v2.1.2
- Fixed `safe-pixel-check.py` crash in explicit-file mode (`safe-pixel-check.py out\s*.png`, used in gate 7).
