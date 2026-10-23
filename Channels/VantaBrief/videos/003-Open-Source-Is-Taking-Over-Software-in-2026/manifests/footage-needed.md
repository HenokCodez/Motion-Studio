# Recording Checklist & Missing Footage Needed

This checklist identifies all footage placeholders where on-camera demonstration or host footage is needed for **003-Open-Source-Is-Taking-Over-Software-in-2026**.

| Scene ID | Time Range | Target File Path | Recording Prompt & Instruction |
| :--- | :--- | :--- | :--- |
| **`scene-04-camera-artcraft`** | 00:24 -> 00:33 (Frames 730–998) | `assets/video/host_artcraft.mp4` | **Host Talking-Head**: Discuss how a single developer with AI assistance can now challenge multi-billion-dollar enterprise suites like Adobe. |
| **`scene-12-camera-local-demo`** | 01:55 -> 02:09 (Frames 3450–3880) | `assets/video/local_demo.mp4` | **Screen Recording / Hands-on**: Demonstrate offline local generation (Kokoro TTS / Krita AI / Ollama) running on your workstation with zero internet and instant latency. |
| **`scene-18-camera-license-weights`** | 03:30 -> 03:46 (Frames 6300–6780) | `assets/video/host_licensing.mp4` | **Host Commentary**: Break down the critical difference between open-source code vs open model weights (commercial restrictions, training datasets, licenses). |

---

### How to Supply Footage
Place your recorded video files into:
`Channels/VantaBrief/videos/003-Open-Source-Is-Taking-Over-Software-in-2026/assets/video/<filename>.mp4`

Once placed, Remotion's `FootagePlaceholder` component will automatically detect the video file and play the real video instead of the camera graphic!
