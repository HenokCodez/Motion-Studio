# WORKFLOW (for the human)

```
 you                                   Antigravity (Gemini + this skill)
 ---                                   ---------------------------------
 1. drop voiceover.mp3 in the project  ->  transcribe.py     word-level timestamps (real audio timing)
    (+ optional logos/screenshots,     ->  chunk.py          caption chunks + scene times (automatic, deterministic)
    your handle, CTA keyword)          ->  plan.md           model decides what to show per scene (catalog + decision table)
                                       ->  assets            screenshots / logos -> prep_images.py (clean, size, cutouts)
                                       ->  storyboard.json   the only file it edits  -> validate.py (blocks mistakes)
                                       ->  remotion render   1080x1920 on the black grid, with your voiceover
                                       ->  qa.py             contact sheets + automatic checks
                                       ->  LOOKS at sheets, fixes storyboard, re-renders (max 3 passes)
 2. get out/short.mp4  <-------------      summary of what could not be sourced
```

## Prompt to give Antigravity each time
> Use the skill `voiceover-to-short`. My voiceover is `<path>`. Brand/handle for the watermark: `<@handle or none>`.
> CTA keyword (if the voiceover has one): `<WORD>`. Extra images/logos are in `<folder>` (optional). Follow the skill steps in order
> and do not skip validate/QA. Show me the final `out/short.mp4` path and a summary.

## Install
1. Copy the folder `voiceover-to-short/` into your workspace skills folder (Antigravity: `<workspace>/.agent/skills/` or your global skills folder - check your version's docs).
2. Create the Remotion project once (see `template/README.md`).
3. Install tools: node 18+, ffmpeg, python3 + `pip install pillow numpy faster-whisper` (optional `rembg`, `playwright`).

## Honest limits
- The Remotion code was type-checked against stubs but **not rendered** by the author (no network/Remotion in the build sandbox). Run the smoke test in `template/README.md` first; fix any version-specific error with `reference/06-troubleshooting.md`.
- Visual quality depends on the images the agent can find. Provide your own logos/screenshots for best results.
- The reference videos are 87-102 s; this skill targets 30-60 s using the same per-scene pace.
- The reference videos carry another creator's watermark and CTA; this skill uses YOUR handle (`meta.brand`) and YOUR CTA.
