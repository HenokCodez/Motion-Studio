# AGENTS.md — Video Project Guide: byd-qin-plus

You are working on the video project `byd-qin-plus` located at `Videos/byd-qin-plus/`.
Follow the Motion Studio rules and these project-specific instructions.

## Project Structure
- `project.json`: Project resolution, frame rate, aspect ratio, audio and render metadata.
- `brief.md`: Objective, target audience, key message, and narrative outline.
- `style.md`: Visual identity, color palette, typography, motion curves, and transitions.
- `frames.md`: Scene-by-scene timing aligned to narration timestamps.
- `assets/audio/voice/`: Narration audio provided manually by the user.
- `transcripts/`: Word-level and segment-level timestamps generated locally by faster-whisper.
- `manifests/`: Provenance, attribution, and license details for all imported assets.
- `renders/`: Output video files.

## Production Workflow
1. **Narration & Transcripts**: Check `assets/audio/voice/` and `transcripts/transcript.json`.
   Do not generate voices or call voice APIs. Use the word timestamps in `transcripts/word-timestamps.json`
   to precisely synchronize graphics and cuts.
2. **Visual Planning**: Read `brief.md` and `style.md`. Keep `frames.md` updated with exact timestamps.
3. **Asset Sourcing**: Check existing libraries first (`python studio.py search-assets`). Record imported assets
   in `manifests/assets.json`.
4. **Composition**: Build in `projects/remotion-app/src/` or `projects/manim-app/scenes/`.
5. **Validation & Render**:
   - Validate: `python studio.py validate byd-qin-plus`
   - Render Remotion: `python studio.py render-remotion byd-qin-plus <CompositionId>`
   - Render Manim: `python studio.py render-manim byd-qin-plus <file.py> <SceneName>`
