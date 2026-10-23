# VantaBrief Master Style & Motion Guide

> Comprehensive design system, typography hierarchy, motion rules, and palette specifications for all VantaBrief productions.

---

## 1. Non-Negotiable Rules

- **Rule R1 (Audio Integrity)**: STRICTLY NO sound effects, NO background music, NO audio ducking, NO added audio of any kind. The user's original narration audio (`audio.mp3`) is the single audio source. All SFX and music logic is completely banned from code, templates, and QA.
- **Rule R2 (Untouched Voiceover)**: Do NOT trim, speed up, or re-time the voiceover. Visual timing adapts to speech onsets, never the reverse.
- **Rule R3 (Palette Single Source of Truth)**: Every color literal outside `projects/remotion-app/src/design-system/tokens.ts` is banned. QA lints for any unauthorized hex/rgba values.
- **Rule R4 (No Reused Mascots)**: Never reuse mascots, avatars, sloths, or characters from other creators' references.
- **Rule R5 (Placeholders for Real Footage)**: When footage, screen recordings, or diagrams are needed and not yet provided by the user, use the universal `<PlaceholderFrame>`. Never fill with generic stock filler.
- **Rule R6 (Clean Motion Graphics)**: Bottom full-sentence captions are removed. Full screen focus is given to high-impact key phrases (1–4 words), accent words, and clean data visualizations.

---

## 2. VantaBrief Brand Palette

Derived from channel branding and defined in `src/design-system/tokens.ts`:

| Token | Hex / RGBA | Role / Application |
|---|---|---|
| `TOKENS.colors.background` | `#231F20` | Matte Charcoal base canvas |
| `TOKENS.colors.backgroundSubtle` | `#2C2728` | Elevated matte layer, slider tracks, subtle borders |
| `TOKENS.colors.surface` | `#1C191A` | Deep Obsidian cards, terminal shells, window frames |
| `TOKENS.colors.surfaceElevated` | `#252122` | Hover cards, elevated badges |
| `TOKENS.colors.textPrimary` | `#FAF4D9` | Warm Cream headlines, prominent titles |
| `TOKENS.colors.textMuted` | `rgba(250, 244, 217, 0.65)` | Subtext, labels, mono code metadata |
| `TOKENS.colors.accentBlue` | `#1677FF` | Electric Blue primary tech glow, active strokes, node flow |
| `TOKENS.colors.accentYellow` | `#F59E0B` | Amber marker sweep highlights, metric values, handwritten script |
| `TOKENS.colors.accentRed` | `#EF4444` | Chapter ordinals (`01`, `02`), warning stamps (`COMMODITIZED`) |
| `TOKENS.colors.accentGreen` | `#10B981` | Positive metric deltas, verified checklist ticks |
| `TOKENS.colors.borderSubtle` | `rgba(250, 244, 217, 0.12)` | Structural card borders |
| `TOKENS.colors.glow` | `rgba(22, 119, 255, 0.35)` | Neon tech drop-shadow glow |

---

## 3. Typography Hierarchy

- **Display Headline**: `'Panton Rust Black Base', 'Inter', system-ui, sans-serif`
  - Large punch words: `160px`
  - Beat headlines: `110px – 140px`
  - Minimum text size on screen: `48px`
- **Subtitles & Badges**: `'Yolk Bold', system-ui, sans-serif` (`36px – 52px`)
- **Accent Handwritten**: `'Permanent Marker', 'Caveat', cursive` (`48px – 64px`) in `#F59E0B`
- **Code & Metadata**: `'VP Pixel', 'JetBrains Mono', monospace` (`26px – 36px`)

---

## 4. Variety Engine Constraints

Every video automatically satisfies the following variety engine rules:
1. **Recency**: The same template is never repeated within **8 consecutive beats**.
2. **Frequency Cap**: No template may exceed **5.5%** of total video beats.
3. **Family Balance**: No style family (Cinematic, Cutout, Data, Investigation, Schematic) may appear for more than **3 consecutive beats**.
4. **Visual Richness**: Over **70%** of all beats must feature a real visual asset (image, screenshot, founder cutout, diagram, data visualization, or footage placeholder).
5. **Pacing**: Every beat is between **1.5s and 3.5s** (~25 cuts/minute). Something is always subtly moving via smooth camera drift or push-in.
6. **No Erratic/Wacky Motion**: Camera motion uses smooth interpolation (`pushIn`, `driftLeft`, `pullOut`, `driftRight`, `breathing`). Never erratic screen shake.

---

## 5. Universal Footage Drop-In System

When footage is needed, `<PlaceholderFrame>` renders a clean, rounded dashed card with:
- Target media type (`VIDEO`, `SCREEN RECORDING`, `IMAGE`)
- What to show & search terms
- Exact timestamp and duration

To replace a placeholder, simply drop your file into:
```
projects/remotion-app/public/assets/user-footage/<slotId>.(mp4|png|jpg|gif)
```
The Remotion composition automatically detects the file and replaces the dashed guide card seamlessly!
