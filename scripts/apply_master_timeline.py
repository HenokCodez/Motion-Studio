import json

project_dir = r"D:\Automations\motion-studio\Channels\VantaBrief\videos\003-Open-Source-Is-Taking-Over-Software-in-2026"

with open(f"{project_dir}/timeline/scenes.json", "r", encoding="utf-8") as f:
    orig = json.load(f)

scenes = [
    {
        "id": "scene-01-intro-hook",
        "type": "vanta-title-hook",
        "startFrame": 0,
        "endFrame": 253,
        "durationInFrames": 253,
        "title": "OPEN SOURCE IS TAKING OVER",
        "subtitle": "IN 2026",
        "narration": "In 2026, you can edit videos, design graphics, build apps, generate images, clone voices, and even run AI models on your own computer without paying for a subscription.",
    },
    {
        "id": "scene-02-real-replacements",
        "type": "vanta-kinetic-list",
        "startFrame": 253,
        "endFrame": 440,
        "durationInFrames": 187,
        "title": "// REAL REPLACEMENTS",
        "leftItems": [
            "NO CHEAP KNOCKOFFS",
            "PRODUCTION QUALITY FIDELITY",
            "ZERO MONTHLY SUBSCRIPTIONS",
        ],
        "narration": "And the alternatives aren't just cheap knockoffs anymore. Some are genuinely good enough to replace the software people have been paying for for years.",
    },
    {
        "id": "scene-03-artcraft-split",
        "type": "vanta-asymmetric-split",
        "startFrame": 440,
        "endFrame": 730,
        "durationInFrames": 290,
        "leftItems": ["TAKE ARTCRAFT", "RECREATING", "ADOBE'S ENTIRE", "CREATIVE SUITE"],
        "rightItems": ["PHOTOSHOP", "PREMIERE PRO", "AFTER EFFECTS"],
        "narration": "Take ArtCraft, for example. It's an open-source project trying to recreate major Adobe applications, including Photoshop, Premiere Pro, and After Effects.",
    },
    {
        "id": "scene-04-camera-artcraft",
        "type": "footage-placeholder",
        "startFrame": 730,
        "endFrame": 998,
        "durationInFrames": 268,
        "instruction": "RECORD: Host talking-head analysis on ArtCraft and AI-assisted development",
        "actionPrompt": "Discuss how a single developer with AI assistance can now challenge multi-billion-dollar enterprise suites.",
        "targetPath": "assets/video/host_artcraft.mp4",
        "mediaAvailable": False,
        "narration": "It's still early, and it can't replace Adobe for everyone. But the fact that one developer can even attempt something like this with the help of AI tells you where software development is heading.",
    },
    {
        "id": "scene-05-spatial-categories",
        "type": "vanta-spatial-callout",
        "startFrame": 998,
        "endFrame": 1380,
        "durationInFrames": 382,
        "leftLabel": {"line1": "EVERY CATEGORY", "line2": "DISRUPTED"},
        "centerTopLabel": {"line1": "AI DEVELOPMENT", "line2": "ACCELERATOR"},
        "rightLabel": {"line1": "WHO MAKES", "line2": "THE MONEY?"},
        "narration": "And this isn't just happening with video editors. Almost every category of software has free open-source alternatives now, and AI is making it easier to build even more of them. So do we eventually reach a point where almost all software is free? And if nobody's paying for the software, who's actually making money? Let's look at what's happening.",
    },
    {
        "id": "scene-06-chapter-pay-settle",
        "type": "vanta-chapter-card",
        "startFrame": 1380,
        "endFrame": 1765,
        "durationInFrames": 385,
        "subtitle": "CHAPTER 01 :",
        "title": "PAY OR SETTLE FOR WORSE",
        "isAccentBg": True,
        "narration": "For years, if you wanted professional software, you usually had two options, pay for it or settle for something worse. Want to edit videos, pay for Premiere Pro, want to design something, pay for Photoshop, need office software, buy Microsoft Office, or get a subscription.",
    },
    {
        "id": "scene-07-comparison-tools",
        "type": "vanta-comparison",
        "startFrame": 1765,
        "endFrame": 2130,
        "durationInFrames": 365,
        "title": "EXPENSIVE SUITES VS MODERN OPEN TOOLS",
        "leftItems": [
            "Premiere Pro ($240+/yr)",
            "Photoshop ($240+/yr)",
            "Maya / 3ds Max ($1,875/yr)",
            "Microsoft 365 ($70+/yr)",
        ],
        "rightItems": [
            "DaVinci Resolve (Free core)",
            "Krita & Photopea (Free)",
            "Blender 3D (100% Free)",
            "LibreOffice (100% Free)",
        ],
        "narration": "But today, you can use tools like DaVinci Resolve for video editing, Blender for 3D, and LibreOffice for documents without paying for the software itself. And these aren't new experiments anymore. Some have been around for years and are used for serious work.",
    },
    {
        "id": "scene-08-terminal-build-tools",
        "type": "vanta-terminal",
        "startFrame": 2130,
        "endFrame": 2530,
        "durationInFrames": 400,
        "subtitle": "vanta-studio // dev_workflow",
        "actionPrompt": "$ studio build --custom-tools --no-vendor-lockin",
        "title": "CUSTOM TOOLS ON DEMAND",
        "narration": "Now AI is accelerating this even further. Projects like ArtCraft are using AI-assisted development to recreate expensive applications. Developers can also build their own tools instead of waiting for a company to add a feature or charging them for an entire subscription just to get it.",
    },
    {
        "id": "scene-09-broll-90-percent",
        "type": "vanta-broll-overlay",
        "startFrame": 2530,
        "endFrame": 2700,
        "durationInFrames": 170,
        "subtitle": "THE 90% RULE",
        "title": "HUNDREDS A YEAR BECOMES NONSENSE",
        "narration": "And if an open-source alternative does 90% of what you need, paying hundreds of dollars a year for the original becomes nonsense.",
    },
    {
        "id": "scene-10-chapter-open-models",
        "type": "vanta-chapter-card",
        "startFrame": 2700,
        "endFrame": 3030,
        "durationInFrames": 330,
        "subtitle": "CHAPTER 02 :",
        "title": "THE RISE OF LOCAL WEIGHTS",
        "isAccentBg": False,
        "narration": "But software is only half of the story. A few years ago, generating high-quality images, realistic voices, or useful AI responses usually meant relying on a handful of major companies. Now, there are open models for all of these things.",
    },
    {
        "id": "scene-11-benchmark-models",
        "type": "vanta-benchmark",
        "startFrame": 3030,
        "endFrame": 3450,
        "durationInFrames": 420,
        "subtitle": "LOCAL RUNTIME // KOKORO & KRITA AI",
        "title": "CONSUMER HARDWARE INFERENCE",
        "statNumber": 99.4,
        "statSuffix": "%",
        "narration": "You can generate images with models like Cria and use projects like Kokoro for text-to-speech. And you don't necessarily need an expensive workstation or a cloud subscription for every task. Smaller models can run on ordinary consumer hardware depending on their size and the memory available.",
    },
    {
        "id": "scene-12-camera-local-demo",
        "type": "footage-placeholder",
        "startFrame": 3450,
        "endFrame": 3880,
        "durationInFrames": 430,
        "instruction": "RECORD: Hands-on screen recording of Kokoro TTS or local Ollama running on your workstation",
        "actionPrompt": "Demonstrate offline local generation running with zero internet and instant playback.",
        "targetPath": "assets/video/local_demo.mp4",
        "mediaAvailable": False,
        "narration": "The biggest change is that you're no longer limited to whatever a company decides to offer. You can download a model, run it locally, connect it to your own applications, and build something around it. If a company changes its prices, removes a feature, or shuts down a service, you may have another option. That's a big deal.",
    },
    {
        "id": "scene-13-cta-subscribe",
        "type": "vanta-title-hook",
        "startFrame": 3880,
        "endFrame": 4080,
        "durationInFrames": 200,
        "title": "ACTIONABLE INTELLIGENCE",
        "subtitle": "SUBSCRIBE TO VANTABRIEF",
        "narration": "And if you're into AI and tech, subscribe to VantaBrief. I cover the tools and developments that are actually changing how we use technology.",
    },
    {
        "id": "scene-14-chapter-business-models",
        "type": "vanta-chapter-card",
        "startFrame": 4080,
        "endFrame": 4650,
        "durationInFrames": 570,
        "subtitle": "CHAPTER 03 :",
        "title": "WHO ACTUALLY MAKES MONEY?",
        "isAccentBg": True,
        "narration": "But this freedom creates a problem for companies that have built their businesses around selling software. So how do open-source developers make money? Because here's the thing, making software isn't free even when downloading it is. Developers still need time, hardware, and money to maintain their projects. And successful open-source businesses have figured out how to make money without charging everyone for the basic software.",
    },
    {
        "id": "scene-15-kinetic-monetization",
        "type": "vanta-kinetic-list",
        "startFrame": 4650,
        "endFrame": 5250,
        "durationInFrames": 600,
        "title": "// 4 PROVEN REVENUE ENGINES",
        "leftItems": [
            "1. PAID HOSTING & CLOUD CONVENIENCE",
            "2. ENTERPRISE SSO & SECURITY AUDITS",
            "3. CUSTOM ARCHITECTURE CONSULTING",
            "4. CORPORATE SPONSORSHIP GRANTS",
        ],
        "narration": "The first model is paid convenience. Take an open-source project and let people use it for free. Then charge for hosting, cloud access, automatic updates, or the infrastructure needed to run it. The second is enterprise features and support.",
    },
    {
        "id": "scene-16-timeline-enterprise",
        "type": "vanta-timeline",
        "startFrame": 5250,
        "endFrame": 5730,
        "durationInFrames": 480,
        "actionPrompt": "ENTERPRISE SLA",
        "subtitle": "INCIDENT MANAGEMENT & SSO",
        "title": "WHY ENTERPRISES PAY MILLIONS",
        "narration": "A regular user might be happy with the free version, but a company managing thousands of employees may need advanced security, access controls, compliance tools, and someone to call when something breaks. The third is selling services. Companies can build open-source software and then charge for installation, customization, consulting, and maintenance. And some projects survive through sponsorships, donations, or funding from companies that depend on them. So the software can be free while the business around it still makes money.",
    },
    {
        "id": "scene-17-asymmetric-pressure",
        "type": "vanta-asymmetric-split",
        "startFrame": 5730,
        "endFrame": 6300,
        "durationInFrames": 570,
        "leftItems": ["AI MAKES CODE", "FASTER TO BUILD", "CUSTOM WORKFLOWS", "REPLACE SAAS"],
        "rightItems": ["PRESSURE ON", "TRADITIONAL", "PRICING MODELS"],
        "narration": "But here's where things could get interesting. If AI keeps making software cheaper and easier to build, I think we'll see more pressure on traditional software companies. Instead of paying for dozens of separate applications, people may increasingly build small tools that do exactly what they need, and companies will have to compete on more than just access to features.",
    },
    {
        "id": "scene-18-camera-license-weights",
        "type": "footage-placeholder",
        "startFrame": 6300,
        "endFrame": 6780,
        "durationInFrames": 480,
        "instruction": "RECORD: Host commentary on the difference between open-source code and open weights licenses",
        "actionPrompt": "Break down why open weights still have license terms, commercial restrictions, and closed training datasets.",
        "targetPath": "assets/video/host_licensing.mp4",
        "mediaAvailable": False,
        "narration": "But I wouldn't expect paid software to disappear completely. Professional support, reliability, collaboration, and specialized features still have value, and open-source doesn't automatically mean better security or a better product. There's also a difference between open-source software and AI models that merely let you download their weights, the license, and what's actually available still matter.",
    },
    {
        "id": "scene-19-benchmark-hardware-shift",
        "type": "vanta-benchmark",
        "startFrame": 6780,
        "endFrame": 7320,
        "durationInFrames": 540,
        "subtitle": "CAPITAL MIGRATION // CHIPS & CLOUD",
        "title": "THE HARDWARE ADVANTAGE",
        "statNumber": 88.5,
        "statSuffix": "%",
        "narration": "The bigger change is where the money goes. If software becomes easier to reproduce, the advantage may shift toward the hardware, computing power, and services needed to run it. Companies could find more value in selling cloud computing, specialized chips, and devices than in charging for basic software features. That doesn't mean hardware prices will automatically rise, or that every company will abandon subscriptions. But it does mean the old model becomes harder to defend when free alternatives keep improving, so I don't think every paid application is going away.",
    },
    {
        "id": "scene-20-outro-choice",
        "type": "vanta-title-hook",
        "startFrame": 7320,
        "endFrame": 7963,
        "durationInFrames": 643,
        "title": "PAYING FOR SOFTWARE IS",
        "subtitle": "NOW A CHOICE",
        "narration": "But I do think we're moving toward a world where paying for software becomes a choice rather than a requirement for more and more tasks. And with AI making development faster, that choice could expand into categories we haven't even considered yet. Let me know what you think in the comments.",
    },
]

orig["scenes"] = scenes
with open(f"{project_dir}/timeline/scenes.json", "w", encoding="utf-8") as f:
    json.dump(orig, f, indent=2)

print("Updated scenes.json with 20 master scenes successfully!")

# Also generate updated manifests/footage-needed.md
checklist_md = """# Recording Checklist & Missing Footage Needed

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
"""

with open(f"{project_dir}/manifests/footage-needed.md", "w", encoding="utf-8") as f:
    f.write(checklist_md)

print("Updated manifests/footage-needed.md successfully!")
