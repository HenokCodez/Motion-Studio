# 05 - Watch your own video and fix it (mandatory, max 3 passes)

You are the editor. After every render you must **look at the pictures**, not just trust the scripts.

## 1. What `scripts/qa.py` gives you
- `qa/sheet_01.png ...` - 6 scenes per sheet, **3 frames per scene** (at 22%, 55%, 90% of the scene) with the scene id, template, time and spoken text above them. Red title = automatic ERROR, yellow = warning, green = clean.
- `qa/report.json` - the automatic flags. `qa/review.md` - a checklist you fill in.
- `qa/frames/sNN_a|b|c.png` - the full-size frames behind the sheets.
- Extra full-res frame at any time: `bash scripts/frame_at.sh out/short.mp4 12.4 qa/look.png`

Automatic checks (they only catch the obvious): wrong resolution/fps, missing audio, length mismatch, frozen stretch > 3.5 s,
bright content touching the screen edge, caption touching the side margins, empty media zone, blank frame, no caption pixels at scene end.
**Green does not mean good.** You must still look.

## 2. How to look (do this for EVERY sheet)
1. Open the sheet with the image viewer.
2. For each scene compare against the reference frame of the same template (`reference/frames/*.jpg`). Ask the 10 questions below.
3. Write PASS/FAIL + the exact fix into `qa/review.md`.
4. If a frame looks odd but you cannot tell why, open the full-size frame (`qa/frames/...`) or grab one with `frame_at.sh`.

## 3. The 10 questions (per scene)
| # | Question | Frame to check |
|---|---|---|
| 1 | Is the media visible, complete, not cropped, not stretched, not tiny? | b |
| 2 | Is the media inside the upper zone and clearly separated from the caption? | b |
| 3 | Is the picture sharp (no blur/pixelation) and relevant to the spoken words? | b |
| 4 | Is the caption fully readable: white on black, max 4 lines, no word cut off at the edges, no overlap with media? | c |
| 5 | Are the right words bold (numbers, names, key noun/verb)? Is the newest word dimmer in frame a/b? | a, b |
| 6 | At frame a (22%) are only the first words visible, at c (90%) all of them? (words appear in sync with speech) | a, c |
| 7 | Does the layout look like the reference for this template (positions, sizes, lines/badges placed correctly)? | b |
| 8 | Is the grid background visible and subtle behind everything (not covered, not too bright)? | any |
| 9 | Is the watermark present at the bottom (if brand set), not overlapped by anything? | any |
| 10 | Is this scene visually different from the previous one (or intentionally the same `mediaKey`)? | a vs previous c |

Also look at the WHOLE video once: take frames from every sheet and ask: *Is there variety? Does it feel like the references (calm, clean, one idea per screen)? Is the first scene a strong hook? Is the end clear?*

## 4. Symptom -> fix table (edit storyboard.json FIRST)
| Symptom | Fix |
|---|---|
| Image looks blurry/soft | Replace by a larger source (re-run prep_images), or crop to the important part and re-prep; or use a smaller template (BADGE_ROW card). |
| Text in screenshot unreadable | Crop the screenshot to the relevant area (bigger text), re-prep, update `w`/`h`. |
| White logo invisible on tile | Add `"bg": "black"` to that ImgRef. Black logo invisible -> remove `bg`. |
| Logo tiny / has wide empty margin | Re-run `prep_images.py --logos` (trims + squares it). |
| Cutout has white/grey halo or hard edge | Re-cut with `--cutout`, or use another photo, or switch to `HERO_CARD`. |
| Cutout shows white box | The file is a JPG or has no alpha: needs a transparent PNG. |
| Media missing (empty upper area) | Path/size wrong: run validate.py; check the file exists in `public/img` and `w`,`h` > 0. |
| Caption has 5+ lines or touches edges | The chunk is too long: re-run `chunk.py` after lowering MAXW/MAXC in the script (e.g. MAXW=8, MAXC=48) and re-do media for changed scenes; or shorten bold usage. Do NOT edit words by hand. |
| Caption overlaps the media | The media is taller than the zone: use a smaller image aspect / template (HERO portrait is capped at 820 px; check BADGE_ROW card etc.). If a custom edit moved it, revert. |
| Wrong word emphasised | Set `"b": true` on the right word objects and remove it from the wrong ones. |
| Same visual twice in a row looks repetitive | Give the scenes a shared `mediaKey` (continue) or change the second one's template (R3). |
| Scene feels static / too long (> 4.5 s) | Change media to a template with motion (HUB_SPOKES, ORBIT, PROGRESS_BAR) or accept; or re-chunk with a smaller MAXDUR. |
| BULLETS appear too early/late | Fix `at` values to the word's `s` in `words.json`. |
| BIG_STAT pops at wrong time | Fix `statAt`; make sure the lead `words` do not include the stat word. |
| Lines in HUB_SPOKES point to wrong places | Do not edit; check the spoke count (1-4) and that you used the right template. |
| Grid not visible / black | `public/grid_vertical.mp4` missing or wrong path; or set `"grid":"procedural"`. See 06. |
| No audio in render | `meta.audio` file missing in `public/`; renderer needs `--audio-codec=aac` (render.sh has it). |
| Video length differs from audio | `meta.durationSec` must equal the audio length (take it from `words.json`.duration); last scene `end` too. |
| First 1 s is empty | First scene must start at 0 and have a visual (R1). |

## 5. When you must touch code (rare)
Only for real component bugs (text clipped by a component, wrong layout for a count). Rules:
1. Change ONE file, the smallest possible edit; re-render the single affected frame first:
   `npx remotion still src/index.ts Short out/check.png --frame=<N>` and look at it.
2. Never change `theme.ts` zone numbers to "make it fit" - fix the content instead.
3. Write the change in your final summary.

## 6. Loop control
```
render -> qa.py -> LOOK at all sheets -> fill review.md -> apply fixes -> render      (pass 1)
repeat up to 2 more times (pass 2, pass 3)
stop early when every scene is PASS
After pass 3: deliver anyway, but list every remaining FAIL honestly.
```
Speed tips: while iterating you may render a low-quality draft (`--crf=28 --scale=0.5`) and only do the final full render at the end (crf 18).
The final deliverable must be rendered with `bash scripts/render.sh`, and the last QA run must correspond to the delivered file.

## 7. Final self-check before telling the user "done"
Re-read `SKILL.md` section 4 (Definition of DONE) and tick every box with evidence (command output / sheet you looked at).
