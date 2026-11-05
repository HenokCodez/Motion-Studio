# Production Plan: Hena Vanta — 365 Days on Upwork

## 1. Project Specifications
- **Channel**: Hena Vanta
- **Title**: I tried Upwork for 365 days... is it worth it?
- **Duration**: 905.056s (15 min 05 s) @ 30 fps (27,152 frames)
- **Resolution**: 1920x1080
- **Background**: `bg.mp4` (Light white grid, mean luminance 0.94)
- **Voiceover**: `vo_norm.wav` (904.556s normalized, -14 LUFS)
- **Timing Source**: `script.txt` (Imported into `timeline.raw.json` as `supplied:script.txt`, refined with `refine-timing.mjs`, verified by `check-timing.mjs` -> TIMING OK)

---

## 2. Structural Metrics & Scene Breakdown
- **Total Scenes**: 244
- **Bare Footage Runtime**: 131.28 s (14.5% of total runtime, strictly $\le 25\%$)
- **Annotated Runtime**: 773.78 s (85.5% of total runtime, strictly $\ge 75\%$)
- **Maximum Bare Run**: 3.43 s (strictly $\le 6.0$ s)
- **Static Hold Constraint**: 0 frames $> 5.2$ s hold across all annotated scenes
- **Typography**: Bold italic Arial on white grid, high-contrast black text with `#FF0000` red keywords red from frame 1
- **Sound Design**: Pure voiceover + 6 UI sound cues on screenshot cards. ZERO music tracks.

### Scene Layout Distribution
| Layout | Count | % of Video | Description |
|:---|:---:|:---:|:---|
| `STACK` | 235 | 96.3% | Centred distilled takeaway statements (2-4 words), screenshot cards, and footage placeholders |
| `JOURNEY` | 6 | 2.5% | Master milestone timeline revealed progressively across 6 distinct scenes |
| `STEPS` | 2 | 0.8% | Step-by-step numbered breakdown (s030 proposal blueprint, s201 client retention) |
| `LIST` | 1 | 0.4% | Bulleted list of non-negotiable freelance criteria (s116) |

---

## 3. Verified Screenshot Sources & Audit Table
All 6 screenshots were captured, inspected for challenge walls, verified for zero error pages, and approved:

| Image File | Target Subject | Scene | Spoken Cue | Timestamp | Source URL | Verification Date | Status |
|:---|:---|:---:|:---:|:---:|:---|:---:|:---:|
| `shots/wise.png` | Wise Currency Exchange | s012 | `"dollars"` | 48.37s | `https://wise.com` | 2026-11-03 | **PASS** |
| `shots/premiere.png` | Adobe Premiere Pro | s058 | `"editing"` | 239.50s | `https://www.adobe.com/products/premiere.html` | 2026-11-03 | **PASS** |
| `shots/telegram.png` | Telegram Messenger App | s094 | `"turn"` | 373.60s | `https://telegram.org` | 2026-11-03 | **PASS** |
| `shots/google.png` | Google Search Engine | s114 | `"matches"` | 453.60s | `https://google.com` | 2026-11-03 | **PASS** |
| `shots/youtube.png` | YouTube Platform | s130 | `"style"` | 514.60s | `https://youtube.com` | 2026-11-03 | **PASS** |
| `shots/stripe.png` | Stripe Financial Platform | s192 | `"outside"` | 722.03s | `https://stripe.com` | 2026-11-03 | **PASS** |

*Note: Captures for internal Upwork client dashboards, CapCut editor timelines, and client contracts require user-specific login or are proprietary; these are accurately represented as labelled footage placeholders per Rule C5.*

---

## 4. Master Journey Progression (`meta.journey`)
The video tells a single continuous story across 6 chronological milestones:
1. **Scene s009** (31.57s): `focus: "day1"` (`day 1: account setup`) — Cue `"Day"`
2. **Scene s022** (87.87s): `from: "day1"`, `focus: "day30"` (`day 30: 40 proposals sent`) — Cue `"proposals"`
3. **Scene s071** (290.67s): `from: "day30"`, `focus: "day60"` (`day 60: first $10 contract landed`) — Cue `"first"`
4. **Scene s093** (368.00s): `from: "day60"`, `focus: "day120"` (`day 120: rising talent badge`) — Cue `"badge"`
5. **Scene s142** (558.00s): `from: "day120"`, `focus: "day240"` (`day 240: top rated status`) — Cue `"top"`
6. **Scene s222** (818.13s): `from: "day240"`, `focus: "day365"` (`day 365: annual earnings and verdict`) — Cue `"worth"`

---

## 5. Footage Placeholders & Track Assembly
- **Exported Deliverable**: `out/placeholders.csv` and `out/placeholders.edl.txt`
- Total placeholders: 26
- All placeholders follow strict instruction format (`TYPE: what to show`), with zero placeholder labels reused more than 2 times.

---

## 6. Review & Verification Flags
| ID | Topic | Reviewer | Decision | Status |
|:---|:---|:---|:---|:---:|
| FL-01 | Milestone 3 earnings accuracy ($10 vs $15) | Skeptic | Verified with voiceover ($10 website job). Fixed. | RESOLVED |
| FL-02 | Blender screenshot relevance | Editor / Rights | Replaced with authentic Premiere Pro screenshot. Fixed. | RESOLVED |
| FL-03 | Template phrase repetition | First-Time Viewer | Purged all instances of "mastering freelance". Fixed. | RESOLVED |
| FL-04 | Structural layout diversity | Editor | Added STEPS and LIST layouts (s030, s116, s201). Fixed. | RESOLVED |
| FL-05 | Safe area and font adherence | QA Frames | 6,537 lint checks passed with 0 failures. Fixed. | RESOLVED |
