# Phase 0: V1 Project Technical & Retention Audit

> **Video Title**: *Open Source Is Taking Over Software in 2026*  
> **Source Audio**: `Channels/VantaBrief/videos/003-Open-Source-Is-Taking-Over-Software-in-2026/assets/audio/voice/audio.mp3`  
> **Source Timeline**: `Channels/VantaBrief/videos/003-Open-Source-Is-Taking-Over-Software-in-2026/timeline/scenes.json`  
> **Duration**: 264.85 seconds (8,030 frames @ 30fps / ~4m 25s)  
> **Target Audience & Style**: Fireship-style fast-paced technical breakdown (high visual density, punchy typography, sticker cutouts, real app captures).

---

## 1. Measured Baseline Metrics (v1 vs. Fireship Standards)

| Metric | Measured V1 Baseline | Target Standard (Fireship Style) | Deficit / Problem |
| :--- | :--- | :--- | :--- |
| **Total Visual Cuts** | 20 scenes | 90–120 beats (one per 1.5–3s) | **-78% fewer cuts** |
| **Cuts Per Minute (CPM)** | **4.53 CPM** | **25–35 CPM** | **5.5x too slow** |
| **Longest Static Hold** | **21.43 seconds** (643 frames) | **< 3.0 seconds max** | **7x over maximum** |
| **Static Frame Ratio** | **~83%** | **< 30%** (continuous camera/idle) | **Severe viewer drop-off risk** |
| **Audio Loudness (LUFS)**| **-24.2 LUFS** | **-16.0 to -14.0 LUFS** | **8.2 to 10.2 dB too quiet** |
| **Audio True Peak** | **-8.9 dBFS** | **-1.0 dBFS** | Lacks dynamic impact |
| **Text Density** | Long sentences (15–25 words) | Single short phrase (max 7 words) | Cognitive overload |
| **Real Media Ratio** | < 25% (Mostly plain shapes/cards) | > 70% (Real screenshots, cutouts, memes) | Looks synthetic |

---

## 2. Complete Scene-by-Scene Audit of V1

The initial V1 assembly consisted of 20 monolithic layout blocks:

| # | Scene ID | Frame Range | Duration | Layout Type | Element Count | Animated vs. Static Behavior |
| :- | :--- | :--- | :--- | :--- | :-: | :--- |
| **01** | `scene-01-intro-hook` | `0 – 253` | 8.43s | `vanta-title-hook` | 3 | Static headline after 15-frame initial spring. Frozen for 7.9s. |
| **02** | `scene-02-real-replacements`| `253 – 440` | 6.23s | `vanta-kinetic-list` | 5 | Staggered text entrance, then completely static for 4.5s. |
| **03** | `scene-03-artcraft-split` | `440 – 730` | 9.67s | `vanta-asymmetric-split` | 4 | Two cards held side-by-side with no camera drift or push-in. |
| **04** | `scene-04-camera-artcraft` | `730 – 998` | 8.93s | `footage-placeholder` | 2 | Black studio placeholder card; completely static 8.9s hold. |
| **05** | `scene-05-spatial-categories`| `998 – 1380` | 12.73s | `vanta-spatial-callout` | 5 | 3 static category boxes with zero camera animation for 11s. |
| **06** | `scene-06-chapter-pay-settle`| `1380 – 1765` | 12.83s | `vanta-chapter-card` | 2 | Flat background chapter title held static for nearly 13 seconds. |
| **07** | `scene-07-comparison-tools` | `1765 – 2130` | 12.17s | `vanta-comparison` | 6 | Static 2-column table comparing proprietary vs open source. |
| **08** | `scene-08-terminal-build-tools`| `2130 – 2530` | 13.33s | `vanta-terminal` | 3 | Code block typed once, then held motionless for 10+ seconds. |
| **09** | `scene-09-broll-90-percent` | `2530 – 2700` | 5.67s | `vanta-broll-overlay` | 3 | Simple invoice card held static. |
| **10** | `scene-10-chapter-open-models`| `2700 – 3030` | 11.00s | `vanta-chapter-card` | 2 | Flat chapter card held motionless for 11 seconds. |
| **11** | `scene-11-benchmark-models`| `3030 – 3450` | 14.00s | `vanta-benchmark` | 4 | Static horizontal progress bars; no counter animation. |
| **12** | `scene-12-camera-local-demo` | `3450 – 3880` | 14.33s | `footage-placeholder` | 2 | Black studio placeholder card held static for 14.3 seconds. |
| **13** | `scene-13-cta-subscribe` | `3880 – 4080` | 6.67s | `vanta-title-hook` | 3 | Mid-roll subscribe card with static bell icon. |
| **14** | `scene-14-chapter-business-models`| `4080 – 4650` | 19.00s | `vanta-chapter-card` | 2 | Flat chapter slide held motionless for 19 full seconds. |
| **15** | `scene-15-kinetic-monetization`| `4650 – 5250` | 20.00s | `vanta-kinetic-list` | 4 | Bullet list revealed once, then frozen motionless for 16 seconds. |
| **16** | `scene-16-timeline-enterprise`| `5250 – 5730` | 16.00s | `vanta-timeline` | 5 | Static timeline path with no camera pan or progressive reveals. |
| **17** | `scene-17-asymmetric-pressure`| `5730 – 6300` | 19.00s | `vanta-asymmetric-split` | 4 | Two cards held motionless for 19 seconds. |
| **18** | `scene-18-camera-license-weights`| `6300 – 6780` | 16.00s | `footage-placeholder` | 2 | Black studio placeholder card held static for 16 seconds. |
| **19** | `scene-19-benchmark-hardware-shift`| `6780 – 7320` | 18.00s | `vanta-benchmark` | 4 | Static chip cards held motionless for 18 seconds. |
| **20** | `scene-20-outro-choice` | `7320 – 7963` | 21.43s | `vanta-title-hook` | 4 | Outro held static for over 21 seconds without camera motion. |

---

## 3. Audio & Timing Source of Truth

- **Word-Level Transcript**: Generated with `faster-whisper` and reconciled with the official script in `aligned_script.json`. Contains **944 words** across **116 segments** with microsecond-precision audio start/end timestamps.
- **Audio Profile**:
  - Duration: 04:24.85
  - Integrated Loudness: **-24.2 LUFS**
  - Loudness Range (LRA): **1.6 LU**
  - True Peak: **-8.9 dBFS**
- **Required Audio Treatment**:
  - Normalize to **-16 LUFS** (target gain: **+8.2 dB**).
  - True peak ceiling clamped at **-1.0 dBFS**.
  - Background music ducked to **-24 dB** under speech.
  - Sound effects layered at **-16 dB to -12 dB** (whooshes, pops, impacts, counter ticks).

---

## 4. Key Takeaways for the Rebuild

1. **Break down 20 scenes into 90–110 rapid beats**: Each beat must span 1.5s to 3.0s maximum.
2. **Apply Camera wrapper to every frame**: Continuous push-in, subtle breathing drift, or shake.
3. **Sticker Cutouts & Real App Captures**: Eliminate generic grey boxes; use high-res web captures with yellow highlighter and sticker-bordered founder cutouts (Linus, Altman, Nadella, Gates, Jensen).
4. **Synchronized Kinetic Text**: Maximum 7 words per phrase, headline text 140px+, per-word spring pop-ins timed directly to `transcript.json`.
