> [!IMPORTANT]
> NOT FOR HENA VANTA. Never use for the Hena Vanta channel.

# Motion Graphics Rules

## Layout
- Tools live in `D:/Automations/motion-studio`.
  - Remotion app: `projects/remotion-app/src/` (components under `src/compositions/` and reusable templates under `src/templates/`)
  - Manim scenes: `projects/manim-app/scenes/`
  - Scripts: `scripts/` (transcribe.py, asset_indexer.py, media_inspector.py)
- User video projects live in `Videos/<project-name>/`
  (`assets/`, `transcripts/`, `manifests/`, `renders/`, `brief.md`, `style.md`, `frames.md`, `project.json`, `AGENTS.md`).
  *(Legacy projects in `D:/Automations/video-projects/<name>/` remain accessible for backwards compatibility).*

## Workflow
1. Create project: `python studio.py new <project>` (creates `Videos/<project>/`)
2. Place manual voiceover: `Videos/<project>/assets/audio/voice/`
3. Transcribe locally: `python studio.py transcribe <project>` (faster-whisper with word timestamps)
4. Plan scenes & timing in `Videos/<project>/frames.md` based on `transcripts/word-timestamps.json`
5. Index / import assets: `python studio.py search-assets "<keyword>"` or `python studio.py import-asset <project> <file>`
6. Build composition: Remotion (`projects/remotion-app/`) or Manim (`projects/manim-app/scenes/`)
7. Validate: `python studio.py validate <project>`
8. Render: `python studio.py render-remotion <project> <CompositionId>` or `python studio.py render-manim ...`

## Standards
- Remotion: use `spring()` with natural overshoot for UI, badges, and counters.
  Drive all timing from `useCurrentFrame()` and `fps`; never use CSS transitions or setTimeout.
  Use `<Sequence>` for staging and `interpolate()` with `extrapolateRight: "clamp"`.
  For transparent output, leave the composition background unset (no solid background color).
- Manim: scenes extend `Scene`; keep one scene per class; transparent export is done by the helper.
- Voiceover: never call voice generation APIs or synthesize voices. User generates narration manually.
- Transcripts: generated offline with faster-whisper. Never use paid transcription APIs.
- After editing, run validation or a render to check for errors before declaring complete.
