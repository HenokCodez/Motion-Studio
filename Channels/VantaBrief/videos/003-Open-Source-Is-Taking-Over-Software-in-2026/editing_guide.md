# Premiere Pro Editing Guide: 003-Open-Source-Is-Taking-Over-Software-in-2026
Use this guide to position individual motion-graphics clips onto your Premiere Pro timeline.

## Timeline Insertion Table

| ID | Target Timecode (Full VO) | Duration | Filename | Spoken Script Excerpt | What It Explains | Transparent? | Reference URL |
|:---|:---|:---|:---|:---|:---|:---|:---|
| **MG-01** | `00:04.980 – 00:12.480` | `7.5s` | `MG-01_Local-AI-Stack-3D-Carousel.mov` | "*and even run AI models on your own computer without paying for a subscription.*" | Showcase local on-device AI models and open suites operating autonomously without cloud subscriptions. | Yes (ProRes 4444) | [Design Ref](https://pin.it/pGq22roa7) |
| **MG-02** | `00:27.620 – 00:35.120` | `7.5s` | `MG-02_AI-Development-Speed-and-Progress.mov` | "*with the help of AI tells you where software development is heading.*" | Illustrate exponential software velocity achieved by single developers using AI tool chains. | Yes (ProRes 4444) | [Design Ref](https://pin.it/pGq22roa7) |
| **MG-03** | `00:51.840 – 00:59.340` | `7.5s` | `MG-03_Software-Toll-vs-Open-Stack-Trio.mov` | "*Want to edit videos, pay for Premiere Pro, want to design something, pay for Photoshop,*" | Contrast the recurring Adobe tolls ($239/yr each) with ArtCraft and open code ($0.00). | Yes (ProRes 4444) | [Design Ref](https://pin.it/pGq22roa7) |
| **MG-04** | `01:21.560 – 01:29.060` | `7.5s` | `MG-04_Timeline-Milestone-Ruler.mov` | "*or charging them for an entire subscription just to get it.*" | Map the chronological timeline from 2020 through 2026 showing the paradigm shift. | Yes (ProRes 4444) | [Design Ref](https://pin.it/pGq22roa7) |
| **MG-05** | `01:43.480 – 01:50.980` | `7.5s` | `MG-05_Autonomous-Infrastructure-Rings.mov` | "*and use projects like Kokoro for text-to-speech.*" | Show how compute, weights, and software assemble into a complete local pipeline. | Yes (ProRes 4444) | [Design Ref](https://pin.it/pGq22roa7) |

## Technical Delivery Verification
- **Resolution**: 1920 × 1080
- **Frame Rate**: 30.0 fps
- **Encoding**: Apple ProRes 4444 (`yuva444p12le`) with genuine 8-bit/10-bit alpha transparency channel.
- **Audio**: No embedded music or SFX (clean visual deliverables ready for Premiere Pro mixing).

## Premiere Pro Insertion Steps
1. Open your main sequence in **Adobe Premiere Pro**.
2. Import the clips from `renders/motion-graphics/` into your project bin.
3. Drag each clip to **Video Track 2 (V2)** or **Track 3 (V3)** at the exact **Target Timecode** listed above.
4. Because alpha transparency is verified, your underlying A-roll or B-roll footage on V1 will seamlessly display beneath cards and callouts.
