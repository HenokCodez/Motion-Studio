---
name: workflow4-editor-v1
description: >-
  The documentary edit (Workflow 4) for talking-head recordings, vertical YouTube Shorts, and horizontal explainers. Sourced online evidence (pages, archives, NASA, Wikimedia), re-coloured with cinematic grades (teal split, hard B&W, amber), and cut at a rapid 0.6–1.5s pace using 18 frame-measured devices (tile reveals, cut-out hero with mega shock word behind head, cards popping per word, 3D wall sweeps, datamoshes). Automated sound design with device-locked clicks, hits, swishes, ducked/cut music bed, and workspace SFX library integration. Renders natively with HyperFrames (HTML to MP4) on Windows.
---

> [!IMPORTANT]
> NOT FOR HENA VANTA. Never use for the Hena Vanta channel.

# WORKFLOW 4: EDITOR V1 — The Documentary Talking-Head Edit

You record; the edit finds the evidence. Hand a raw talking-head recording (or vertical Short take):
Workflow 4 sources real evidence online for every spoken line, re-colours it to a cohesive cinematic grade,
and cuts it into a rapid-fire documentary edit (a new picture every 0.6–1.5 seconds) rendered with HyperFrames.
The speaker's face is one more picture in the stream (~25-35% screen time), not the permanent background.

> **Where the look comes from.** Three documentary-style short-form reels (REF-1 a founders
> story, 78.4 s; REF-2 a game-theory explainer, 93.6 s; REF-3 a company-origin story, 70.5 s)
> were taken apart frame by frame; the voice was split from the music and effects and the sound
> measured on its own. `reference/reference-log.md` has the method and every number,
> `reference/edl/REF-1..3.md` the shot-by-shot breakdowns, `reference/edl/SOUND.md` the sound.
> The references are faceless voice-over; this kit adds the speaker on camera (~25–35% of
> runtime) and the cut-out hero device. That share is a choice, not a measurement.

**Before building anything, read:** `reference/devices.md` (the library, read first) ·
`reference/look.md` (treatments, type, rhythm, the face) · `reference/sound-design.md` +
`reference/edl/SOUND.md` · `reference/sourcing.md` · `template/example/` (a real 45 s build).

---

## ⭐ The eight things a first draft gets wrong

A first draft built from stills, screenshots and synthetic ticks looked nothing like the
references. The frame-by-frame breakdowns are the spec; where `devices.md`'s first pass and
the `edl/` files disagree, the `edl/` files win.

1. **Moving footage, not stills.** 75% (REF-1), 62% (REF-2), 50% (REF-3) of runtime is moving
   clips. `scripts/find-footage.py` (Mixkit, archive.org Prelinger, Wikimedia Commons, NASA) and
   `scripts/ev1_clip.py` (cut + re-colour + 30 fps CFR) exist for this.
2. **Metaphors and puns on most lines.** 15% (REF-1) / 59% by time (REF-2) / 31% (REF-3).
   "new models" → 1950s motor-show cars; "leaked" → a dripping tap; "nothing" → a tumbleweed;
   "slap captions on" → a label-slapping machine. Names, companies and claims are always the
   real thing.
3. **Everything moves:** a steady 4–7.5%/s zoom on 62/79 shots (`broll(rate=…)`), new cuts open
   defocused and sharpen over ~9 frames (`focus_in=9`), hard punch-ins on the stressed word
   (`punches=`), windows that grow in hard steps 40% → 63% → full.
4. **Pace:** ~60 (REF-1) to ~180 (REF-3) images a minute. A 4-second hold is a mistake.
5. **Strobes are shape-matched**: every image in a burst shares one shape (all circles, all
   banknotes, all blades), 2–4 frames each, one click each. Random page crops are not a strobe.
6. **Captions change character:** 62 px base, italic serif for a stressed phrase, 2.3× bold for
   the key word, ink on light pages (`captions(..., mode)`, `captions_switch`).
7. **Sound on every change, at the references' levels:** clicks only 2–7 dB under the voice,
   landing 4–14 ms after the picture. The devices write the cues; `sfx/ev1kit` is synthesised to
   the measured length, transient and level of each reference sound. No booms on flashes, no
   whoosh on the wall, no typing sound.
8. **The bed carries the cuts.** It runs from frame 0 ~5.5 LU under the voice, is NOT ducked,
   CUTS OUT under the punchline (it plays dry) and slams back on the next line, pulls down under
   black/UI cards. Never put a drop or an impact ON a name: it masks the consonant ("Claude did."
   re-transcribed as "Flaw dead"). Re-transcribe the final to prove no word got masked.

## ⛔ Hard rules

1. **Real material on every beat.** The company's own photo/page/post/film, a NASA/Wikimedia/
   public-domain image or clip, a rebuilt UI fed with real data. Typeset-only beats are the
   black "nothing." card and the typewriter, and they are rare. **Look at every capture**:
   consent walls, scroll-reveals and bot checks return plausible blank pages
   (`scripts/capture.mjs` handles the first two; a bot-checked page you drop).
2. **Every found image is treated** (`scripts/ev1_treat.py`): 58–68% of held reference shots
   carry a grade, the rest are at least pushed and vignetted. Never a raw screenshot edge to edge.
   **The speaker's camera is the exception: RAW on every face beat** — no grade, no B&W, no LUT,
   no vignette. The found material carries the colour. The cut-out's RGB comes from the raw plate.
3. **Every word on screen was said.** Captions are the speaker's words at their onsets, ±1 frame.
   Titles are the thing named (a real name, a real number), never a slogan.
4. **Verify every fact while sourcing.** Numbers and claims from the real page, quoted exactly,
   dated. Where two first-party pages disagree, say which one you used.
5. **No emojis on screen.** `capture.mjs` hides emoji images on posts; a quote full of emoji is
   re-typed with the typewriter instead.
6. **No random people.** A person appears only when they are the subject of the line.
7. **Tokens only.** Colours and fonts come from `assets/tokens.css` (copied into each video's
   `assets/ev1/`). Animate transforms and opacity (plus `filter`), never top/left/width/height.
8. **Rights are flagged before the render.** Every source goes in PLAN.md's table with its
   licence; anything unclear (a company's film, a news photo, someone's clip) is marked FLAG and
   the person decides. Bring your own music.
9. **Nothing publishes.** Render, mix, open `out/final.mp4` for review, stop. Never upload or post.

## 1 · The look in one paragraph

Real pictures, edge to edge, each one changed: a headquarters in a teal split with a halftone
in its shadows, a pricing page in hard B&W, an aurora recoloured red then green then blue. A
thin thirds grid over the stills. Small white words arriving one at a time in the middle of the
frame, exactly when they're said. Every so often one word gets big: white sans, chrome italic
serif, red Didone capitals, or a huge red word behind the speaker's head. Between pictures:
one-frame white boxes, two-frame negatives, four-frame datamoshes, panes of a 3×3 grid flashing
in one by one with a click each. Under it, a bed a few dB below the voice and clicks you feel
more than hear.

## 2 · The devices

`components/ev1_devices.py` (the measured core) and `components/ev1_more.py` (added on the first
full edit; `from ev1_more import *` gives you both). Every device snaps to the frame grid, sets
an explicit z-index, and writes its own sound cues. Full specs: `reference/devices.md`.

| device | use it when the line… | measured |
|---|---|---|
| `tile_reveal` | opens a chapter / swaps a world | 9 panes, 1/frame, white 1f then picture, a click each (REF-1) |
| `cutout_world` + `scripts/matte.py` | names a list of variants; the hero line | speaker persists, the world swaps by tile reveal; `mega=` the huge red word BEHIND the head |
| `pop_collage` / `pop_shatter` | says a number of things | 1 card per word, a white box 1f before each, then the stack pulls out and shatters (REF-2) |
| `seq` / `vseq` | a run of stills / clips cut on the words | a push on every image, a click per cut |
| `strobe` | lands one abstract word | 2–3 frame images, shape-matched, a hopping square, a click each (REF-2) |
| `wall3d` | "everyone / everywhere / every leaderboard" | perspective plane, 0.8–3.5 s sweep, blur on the move, silent (REF-1) |
| `page_card` / `focus_card` / `paper_card` | quotes a page, post or document | rack focus in, highlighter swept over OCR/DOM-measured boxes |
| `calendar` | "every few weeks", a cadence | the real dates, each item lands on its day with a click |
| `terminal` / `code_scroll` / `typewriter` | "the API", "the code", a quoted line | real text, scrolls and stops, markers sweep |
| `comment_box` | "tell me in the comments" | a generic composer, caret blinking; never fake comments |
| `slap_caps` | mocks generic auto-captions | the cliché look, made for this video, labelled as such by context |
| `silence_cut` / `edit_timeline` / `filmstrip` / `player_window` / `bed_wave` | the video talks about editing itself | the take's real waveform and silences, this build's real shots, cues and song (two-pass build) |
| `triptych` | three people of one line | three panels, each racks in |
| `frames` + `ev1_treat.glitch_frames` | "broke / leaked / glitch", any hard turn | 3–4 frame datamosh, a glitch sound |
| `neg_flash` / `double_neg` / `white_flash` / `whip_out` | out of a title, into a chapter, a fast carry | 1–2 frame negatives, a white frame, an accelerating zoom |
| `keyword(kind=key / title / shock / mega)` | the one word of the line | 132 px sans · 136 px chrome serif · 176 px red Didone · 560 px red behind the head |
| `img_mark` / `svg_mark` | a company's mark | its real logo, its own colours |
| black card (`keyword` on `ev1-black`) | "nothing", "no one", a beat of silence | a small word alone on black, the bed pulls down |
| `captions` / `captions_switch` | every beat | white word-by-word; ink with a paper halo on light pages |

**Layer order:** ground → tile panes → display word → **the speaker's matte** → captions →
finish (grid + vignette) → flashes.

## 3 · Rhythm

Held shots median **0.79 s** (REF-1) / **0.56 s** (REF-2); 4–13% of runtime in strobe/flash
bursts; cuts land on caption onsets. For long-form, keep the cold open and every chapter open at
reference pace and let the body breathe to **1.2–2.0 s** with internal motion (push, sweep,
typing). `reference/look.md` §3.

## 4 · Sound

`reference/sound-design.md`. The devices cue the clicks, trains, hits and glitches into
`sfx-cues.txt`; never hand-edit it. A video that repeats one click file 80 times sounds like a
metronome: rotate `click_1..4` (see `rotate_clicks()` in the example). Bed: `scripts/bed-mix.py`
— `--under 5.5`, `--ramp a,b,-70,0.012` to cut it under a punchline, `--ramp a,b,-8` under a
black card; line the song's drop up with the line AFTER the punchline. No music ships with the
kit: use a track you have the rights to (`assets/music/`). The sound kit in `sfx/` is
synthesised in code and free to use; drop your own licensed sounds into `sfx/ev1kit/` under the
same names to change the voice of the kit.

## 5 · Workflow Execution in Motion Studio

Workflow 4 runs natively on Windows using Python, HyperFrames (`npx -y hyperframes@0.8.210`), and ffmpeg.
All workspace sound libraries (`assets/sfx/`, `assets/music/`) are automatically resolved alongside the built-in `ev1kit`.

### Step-by-Step Pipeline:

0. **Set up a video:**
   ```powershell
   python .agents/skills/workflow4-editor-v1/scripts/new_video.py "<path/to/take.mov>" [project-name] [--vertical]
   ```
   *Note: If the input recording is a vertical Short (height > width), 9:16 (1080x1920) is automatically detected and configured!*

1. **Transcribe & Snap Onsets:**
   ```powershell
   python .agents/skills/workflow4-editor-v1/scripts/transcribe.py "<project-dir>"
   python .agents/skills/workflow4-editor-v1/scripts/snap-onsets.py "<project-dir>"
   ```
   *Snaps the first word after each pause directly onto the audio waveform transient.*

2. **Plan & Source Evidence:**
   - Read `PLAN.md` and `reference/sourcing.md`.
   - For every line, source the real evidence (product website, launch tweet, GitHub commit, archival footage, or NASA imagery) and metaphors (cars, printing press, dripping tap).
   - Capture clean dark screenshots via `node .agents/skills/workflow4-editor-v1/scripts/capture.mjs <url> assets/captures/<name>.png`.

3. **Treat Imagery & Speaker Cutout:**
   - Grade found footage with `ev1_treat.py` (teal split, deep, warm, mono).
   - If using the hero cutout device (speaker in front of changing world + mega shock word behind head):
     `python .agents/skills/workflow4-editor-v1/scripts/matte.py --plate assets/media/cam_raw.mp4 --start S --dur D --out assets/media/matte_a.webm`.

4. **Build the Composition:**
   - Edit `<project-dir>/build.py` connecting each sentence to its corresponding device (`tile_reveal`, `pop_collage`, `strobe`, `wall3d`, `keyword`, `cutout_world`).
   - Run: `python build.py` (generates `index.html` and `sfx-cues.txt`).

5. **Lint, Snapshot & Render:**
   ```powershell
   npx -y hyperframes@0.8.210 lint .
   npx -y hyperframes@0.8.210 snapshot . --at 0.5,1.5,3.0 --no-end -o out/snaps
   npx -y hyperframes@0.8.210 render . -q high -f 30 -o out/render.mp4
   ```

6. **Mix Sound & Music Bed:**
   ```powershell
   python .agents/skills/workflow4-editor-v1/scripts/finish.py "<project-dir>"
   ```
   *Automatically muxes voiceover, cuts music bed under punchlines, aligns SFX cues with -1 dBFS peak limiter, and outputs `out/final.mp4`.*

## Files

- `SKILL.md` (this) · `reference/` (the measurements and device specs)
- `components/ev1_devices.py`, `components/ev1_more.py` — the device library
- `scripts/` — `env.sh`, `doctor.sh` (setup), `preview.py` (7 s self-test), `new-video.sh`,
  `transcribe.py`, `snap-onsets.py`, `capture.mjs`, `find-footage.py`, `clipsheet.py`,
  `ev1_treat.py`, `ev1_clip.py`, `matte.py`, `bed-mix.py`, `mix-sfx.py`, `finish.sh`,
  `synth-sfx.py`
- `assets/` — `tokens.css`, `fonts/` (Inter, Playfair Display, Bodoni Moda, Arimo, JetBrains
  Mono; all SIL OFL, licences beside them), `vendor/gsap.min.js` (downloaded by doctor.sh)
- `sfx/` — the synthesised sound kit (`ev1kit/*`, `ev1/*`, `peaks.json`)
- `template/` — `build.py` + `PLAN.md` for a new video; `example/` the worked 45 s build
