# Premiere Pro Editing Guide: 004-DeepSeek-Inference-Engine
Use this guide to position individual motion-graphics clips onto your Premiere Pro timeline.

## Timeline Insertion Table

| ID | Target Timecode (Full VO) | Duration | Filename | Spoken Script Excerpt | What It Explains | Transparent? | Reference URL |
|:---|:---|:---|:---|:---|:---|:---|:---|
| **MG-01** | `03:05.480 – 03:13.480` | `8.0s` | `MG-01_Causal-Encoder-Decoder-Layer-Split.mov` | "*DeepSeek solved this at the architectural level by splitting their layers in half using a causal encoder/decoder design. The bottom layers act as a dedicated reader while the top layers act as a writer.*" | Visualizes 40-layer transformer splitting into reader prefill layer and writer decode layer, reducing prefill active compute by 50%. | Yes (ProRes 4444) | [Pinterest Board](https://pin.it/1SGPBNbAk) |
| **MG-02** | `03:24.360 – 03:32.360` | `8.0s` | `MG-02_Wide-Expert-Parallelism-Cluster.mov` | "*Instead of forcing one GPU to carry all the weight, they distribute the AI's experts across clusters of 64 to 128 graphics cards. Memory traffic drops by nearly 88%.*" | Visualizes 128 GPU matrix dispatching sparse queries, showing memory bus traffic dropping by 88%. | Yes (ProRes 4444) | [Pinterest Board](https://pin.it/1SGPBNbAk) |
| **MG-03** | `03:49.320 – 03:57.320` | `8.0s` | `MG-03_Context-Storage-100PB-3FS.mov` | "*DeepSeek built an insane storage infrastructure using a custom distributed file system with 100 petabytes of SSD storage dedicated purely to caching context. Their cache hit rate reaches an incredible 96%.*" | Visualizes 100PB NVMe storage cluster delivering 96% cache hit rate with precomputed KV cache reuse. | Yes (ProRes 4444) | [Pinterest Board](https://pin.it/1SGPBNbAk) |
| **MG-04** | `04:36.280 – 04:44.280` | `8.0s` | `MG-04_Hardware-Matrix-Blackwell-Ascend-Hopper.mov` | "*Deep Infer explicitly supports two hardware platforms: Nvidia's brand-new Blackwell architecture and Huawei's domestic Ascend 950 chips. Notice who's completely missing? Nvidia's older Hopper chips like the H100.*" | Visualizes native support for Blackwell & Ascend 950 while striking Hopper H100 as bypassed. | Yes (ProRes 4444) | [Pinterest Board](https://pin.it/1SGPBNbAk) |
| **MG-05** | `00:46.000 – 00:54.000` | `8.0s` | `MG-05_Unit-Economics-Gross-Profit-Margin.mov` | "*When an enterprise AI chip typically costs $5 to $10 an hour to run, DeepSeek isn't losing money at all. They are operating at an estimated 80% gross profit margin.*" | Visualizes $38/hr revenue against $5-$10 cloud cost yielding 80% net margin. | Yes (ProRes 4444) | [Pinterest Board](https://pin.it/1SGPBNbAk) |
| **MG-06** | `00:22.000 – 00:29.500` | `7.5s` | `MG-06_DeepSeek-Stack-3D-CoverFlow.mov` | "*Well, a few weeks ago, DeepSeek quietly dropped an update that changed everything. They released DeepSeek V4.1 Flash and opened source their core production engine...*" | 3D perspective cover-flow card carousel cycling through DeepSeek V4.1 Flash, DeepEnphere, 3FS, and EP64. | Yes (ProRes 4444) | [Pinterest Board](https://pin.it/1SGPBNbAk) |
| **MG-07** | `02:35.000 – 02:42.500` | `7.5s` | `MG-07_Raw-Inference-Velocity-Gauge.mov` | "*When you turn off reasoning and just look at text output, it flies at over 125 to 150 tokens per second, with optimized cloud providers pushing past 800 tokens per second.*" | Multi-stage velocity surge gauge ramping from 24 to 150 to 800+ tokens per second with glowing laser shimmer. | Yes (ProRes 4444) | [Pinterest Board](https://pin.it/1SGPBNbAk) |
| **MG-08** | `04:58.000 – 05:05.500` | `7.5s` | `MG-08_Inference-Evolution-Timeline-Ruler.mov` | "*For the last two years, the narrative in tech has been simple: whoever spends the most money buying the most GPUs wins. But DeepSeek keeps showing us that systems engineering beats brute force spending...*" | Chronological timeline ruler traveling 2023 -> 2024 -> 2025 -> 2026 showing the paradigm shift from brute force to systems engineering. | Yes (ProRes 4444) | [Pinterest Board](https://pin.it/1SGPBNbAk) |
| **MG-09** | `03:58.000 – 04:05.500` | `7.5s` | `MG-09_Autonomous-Architecture-Rings.mov` | "*When you combine that with their system, their cache hit rate reaches an incredible 96%. Most of the compute it serves has already been calculated...*" | Triple concentric glowing activity rings: 100PB 3FS NVMe Storage, 64-GPU Wide MoE, and Causal Attention Kernel. | Yes (ProRes 4444) | [Pinterest Board](https://pin.it/1SGPBNbAk) |
| **MG-10** | `00:08.000 – 00:15.500` | `7.5s` | `MG-10_Cloud-Toll-vs-Open-Stack.mov` | "*It was how they managed to sell access to them for pennies while Western companies burned through billions in cloud bills.*" | Contrasting the $5-$10/hr cloud GPU toll with DeepSeek's $0.14/M token open architecture yielding 80% margins. | Yes (ProRes 4444) | [Pinterest Board](https://pin.it/1SGPBNbAk) |

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
