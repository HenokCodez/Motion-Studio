# WORKFLOW 4: The Documentary Talking-Head & Shorts Edit (Editor V1)

> **Use when**: You have a raw talking-head recording (especially a vertical YouTube Short, Reel, or horizontal documentary explainer) and you want it edited with rapid-fire real online evidence, cinematic re-colouring, 18 frame-accurate motion devices, word-by-word kinetic captions, and device-locked sound effects & music.

---

## 1. Quick Start / How to Prompt

To edit a talking-head recording with Workflow 4, type in chat:

> **"Edit `<path/to/recording.mov>` with Workflow 4 [using script `<path/to/script.txt>`] [and music `<path/to/music.mp3>`]"**

### Examples:
- *"Edit my vertical short in `Videos/my-take.mp4` with Workflow 4. It's a 9:16 talking-head video about AI."*
- *"Use Workflow 4 to edit `Videos/deepseek-short/take1.mov`. The script is in `Videos/deepseek-short/script.txt`. Add music from `assets/music/` and use sound effects from `assets/sfx/`."*
- *"Plan the Workflow 4 edit of `Videos/take2.mp4` but show me the PLAN.md table first before building."*

---

## 2. What Workflow 4 Delivers

| Feature | Specification |
|---|---|
| **Pacing** | Fast documentary rhythm: picture changes every **0.6 to 1.5 seconds**. |
| **Speaker Ratio** | The speaker appears on camera for ~25–35% of runtime; the rest is driven by visual evidence. |
| **Visual Evidence** | Real materials sourced online: company launch pages, real GitHub repos, Wikimedia & NASA archives, product footage. |
| **Cinematic Grading** | Every found visual is recoloured to a unified look (`teal split`, `hard B&W`, `amber`, `halftone shadows`, `negative flashes`). Speaker stays raw & natural. |
| **The 18 Devices** | Tile-flash reveals, 3D perspective wall, pop & shatter card stacks, shape-matched strobes, datamoshes, and the **hero cutout device** (speaker cut out in front of a changing world with a giant red shock word behind their head). |
| **Sound Design** | Device-locked transient clicks, hits, swishes, and an automated music bed that cuts out under punchlines. Integrated with your workspace sound effects (`assets/sfx/`) and `sfx/ev1kit/`. |
| **Aspect Ratios** | **9:16 Vertical Shorts (1080x1920)** and **16:9 Landscape (1920x1080)** automatically detected from the camera input. |

---

## 3. The 6-Step Pipeline

```
[Raw Take] ──> 1. Setup & Transcribe ──> 2. Plan Evidence ──> 3. Treat & Cutout ──> 4. Build & Snapshot ──> 5. Render & Finish ──> [Final MP4]
```

### Step 1: Initialize Project & Speech Alignment
```powershell
python .agents/skills/workflow4-editor-v1/scripts/new_video.py "path/to/take.mp4" [project_name] [--vertical]
python .agents/skills/workflow4-editor-v1/scripts/transcribe.py "Videos/editor-v1/<project_name>"
python .agents/skills/workflow4-editor-v1/scripts/snap-onsets.py "Videos/editor-v1/<project_name>"
```
- Sets up project under `Videos/editor-v1/<project_name>/`.
- Transcribes speech at word level and snaps word onsets directly to waveform peaks (±1 frame accuracy).

### Step 2: Plan Evidence & Metaphors (`PLAN.md`)
- Identifies concrete things named (companies, tools, numbers) and sources the real thing via Playwright (`capture.mjs`) or footage search (`find-footage.py`).
- Pairs abstract concepts with witty visual metaphors (e.g. "leaked" → dripping tap; "new models" → 1950s motor-show cars).

### Step 3: Grade Imagery & Cutout Speaker
```powershell
# Grade imagery (teal, deep, warm, mono, vignette)
python -c "import ev1_treat as T; T.treat(im, 'assets/img/hero.jpg', 'teal', vig=0.6)"

# Optional: Cut out speaker for hero beats (transparent video plate)
python .agents/skills/workflow4-editor-v1/scripts/matte.py --plate assets/media/cam_raw.mp4 --start 12.0 --dur 3.5 --out assets/media/matte_a.webm
```

### Step 4: Build GSAP Timeline & Snapshot Review
- Connects each sentence in `build.py` to its corresponding device.
- Runs: `python build.py`
- Lints and extracts snapshots:
  ```powershell
  npx -y hyperframes@0.8.210 lint .
  npx -y hyperframes@0.8.210 snapshot . --at 0.5,1.5,3.0,5.0 --no-end -o out/snaps
  ```

### Step 5: Render & Sound Design
```powershell
# 1. Render master video frames
npx -y hyperframes@0.8.210 render . -q high -f 30 -o out/render.mp4

# 2. Mix voiceover, music bed, and SFX cues into final master
python .agents/skills/workflow4-editor-v1/scripts/finish.py "Videos/editor-v1/<project_name>"
```
- Automatically pulls sound effects from:
  - Skill synthesized kit (`sfx/ev1kit/`: clicks, clicktrains, impacts, glitches, swishes)
  - Workspace sound library (`assets/sfx/`: `whoosh.mp3`, `pop.mp3`, `punch.mp3`, `impact.wav`, `glitch.wav`, `click.mp3`)
  - Music library (`assets/music/` or user track)

---

## 4. Deliverables
- **`out/final.mp4`**: Fully mixed, finished video (1080x1920 vertical or 1920x1080 horizontal).
- **`out/snaps/`**: Review snapshots across every beat.
- **`PLAN.md`**: Verified source table with rights and license flags.
