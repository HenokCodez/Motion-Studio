> [!IMPORTANT]
> NOT FOR HENA VANTA. Never use for the Hena Vanta channel.

# Shared Motion Studio Guidelines

This rule is automatically loaded by Google Antigravity for the `motion-studio` workspace across all channels and projects.

## System Architecture
Motion Studio is an AI-assisted, reference-driven motion-graphics production system.
The user edits the complete video in Adobe Premiere Pro. Motion Studio produces standalone motion graphic clips and an exact insertion guide.

## Chat-Driven Production Workflows

### Workflow 1: Standalone Motion Graphics (Overlay Pipeline)
When the user pastes a script or provides a voiceover and says:
> **"Render all the motion graphics for <project/script>."**
- Identifies 3–5 key animation moments.
- Matches verified design references (video references first).
- Renders standalone transparent Apple ProRes 4444 `.mov` and universal `.mp4` previews into `renders/motion-graphics/`.
- Generates contact sheet (`contact_sheet.png`) and Premiere Pro Editing Guide (`editing_guide.md` & `.json`).
- User composites clips onto **Track V2/V3** in Premiere Pro over A-roll footage.

### Workflow 2: Infinite Explainer Canvas (Continuous Whiteboard Pipeline)
When the user pastes a script or provides a voiceover and says:
> **"Build the full explainer canvas for <project/script>."**
- Generates a continuous, end-to-end technical explainer video in the **Kaisplain dark infinite whiteboard aesthetic**.
- Concepts are mapped spatially across an infinite plane using Mindmap Sketch Nodes, Dark Browser Frames (`apple.com`, `github.com`), Terminal CLI Windows, Vector Hardware (Mac Mini / RTX nodes with status LEDs), and Price Sliders.
- A virtual camera rig (`panX`, `panY`, `zoom`) glides seamlessly between nodes connected by animated SVG bezier arrows.
- Enforces brand standards (`fontSize >= 24px`, channel brand palette from `channel.json`, factual script data, continuous living micro-motion).
- Renders the complete continuous explainer video into `renders/explainer-canvas/explainer_canvas.mp4`.
- Ready to publish directly, or place on **Track V1** in Premiere Pro as the visual backbone.

## Core Rules & Design Standards
1. **Clip Duration**: Any animation must be **longer than 5 seconds**; target **7 to 8 seconds** (210–240 frames @ 30fps).
2. **Continuous Living Micro-Motion**: Something must always be moving slightly throughout the entire clip (subtle 3D floating, traveling shimmer sweeps, breathing ambient glows, pulsing status badges). Never freeze statically.
3. **Understand Real Motion Dynamics**: Don't clone static image states. Choreograph multi-stage sequences (e.g. timeline rulers actively travelling year-by-year with contour spines dynamically bulging at milestones, progress bars ramping with multi-stage acceleration, cards dropping in with drawn SVG sparklines).
4. **Zero Blank Space & Zero Fake Data**: Every second of playback must have genuine, factual, script-aligned narrative and telemetry data. Never leave areas blank or use placeholder filler.
5. **Minimum Typography Scale (>= 24px)**: Every text element must have `fontSize >= 24px` across all compositions. Badges, tags, footnotes, and telemetry labels must be at least 24px–28px, and headlines/metrics scaled up proportionally (32px to 116px+). Never use fine-print or small text (< 24px).
6. **Universal Channel Support**: Works across any channel folder in `Channels/<channel>/` by dynamically loading colors, fonts, and rules from `channel.json`.
