# scale-spec.md — measured from the approved video (1920x1080)

Method: 24 evenly spaced frames per video, bright-ink connected components (ffmpeg + numpy). Pixel values below are real measurements, not guesses.

## Measured: original approved vs new (broken) video
| Item | Original | New | Note |
|---|---|---|---|
| 3-card row, each card | 576x626 px (30% x 58%) | 576x626 | IDENTICAL. Row spans x80-1838 (90% of width) in both |
| 2-card compare, each box | 826x533 (43% x 49%) | same | spans x80-1838 |
| 4-icon row, each card | 337x378 (18% x 35%) | n/a | row spans x80-1484 |
| 4-up hero cards | 425x540 (22% x 50%) | n/a | |
| Single node (pill) | ~250-320 x 90 (13-17% wide) | same | |
| Hero stat ("100%") | 428x199 px glyph block, icon 181 px | 479x199 | |
| Hero icon | ~180 px | ~169 px | |
| Card icon (3-card) | ~300 px (16% x 29%) | | large |
| Card label text | line ~85-100 px tall blob incl. descender (font ~56-64 px) | | |
| Small labels/chips | ~28-40 px font | | |
| Edge margin | **80 px (4.2%)** | **80 px** and titles at 88-102 px | BOTH violate an 8% safe frame |
| Title overflow | none | **"Real World or Benchm..." clipped at x=1920** | the real P1 bug |

## Finding (changes the plan)
Original and new share card sizes. Differences that actually exist: (1) new-video titles overflow/hug the edge, (2) many new scenes are a single tiny node in empty space while hero scenes are full-width, (3) only ~5 layouts. User decision: **keep the original's proportions, enforce a safe frame, never clip, raise minimum text size to 24 px+.**

## Colors measured in original
bg #0B0B0B | card #161616 | highlight fill #6B392A | orange #FE6A34 | ink #EDEDED.
Logo: cream #FAF4D9 (exact match), lime #CBFF4D, dark ~#0F0F10.
User decision: **move ink and card to cream vibe**: ink #FAF4D9, card #231F20.

## Mandated values (used by layout-law.md)
| Item | Value |
|---|---|
| Safe frame | x 154..1766, y 86..994 (1612 x 908) |
| 3-up card | 510 x ≤520 px (26.6% wide), gap 41 px |
| 2-up box | 776 x ≤ 440 px (40% wide), gap 60 px |
| 4-up card | 370 x ≤ 400 px, gap 44 px |
| Hero icon | 160-220 px; card icon 110-150 px |
| Hero stat glyph | cap height 200-260 px |
| Fonts | see layout-law.md (min 24 px everywhere) |
