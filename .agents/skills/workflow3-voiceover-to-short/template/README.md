# Remotion project template (copy into your Remotion project)

```
src/            <- copy over the project's src/ (index.ts, Root.tsx, Short.tsx, theme.ts, types.ts, hooks.ts, Caption.tsx, GridBackground.tsx, Watermark.tsx, media/*)
public/         <- grid_vertical.mp4, voiceover.mp3, img/*
storyboard.json <- the ONE file the model edits for every new video
```

## One-time setup
```bash
npx create-video@latest --blank            # choose TypeScript, no Tailwind, no skills prompt needed
cd <project>
npx remotion add @remotion/google-fonts    # installs the version that matches remotion
# copy src/, public/grid_vertical.mp4, storyboard.json from this template over the new project
# tsconfig.json must contain:  "resolveJsonModule": true
npx remotion still src/index.ts Short out/test.png --frame=60      # smoke test (example storyboard has a silent voiceover)
```
System tools needed: node 18+, ffmpeg + ffprobe, python3 with `pip install pillow numpy faster-whisper`
(optional: `pip install rembg` for object cutouts, `npm i -D playwright` for screenshots).

Fonts: `@remotion/google-fonts/Inter` downloads Inter at render time. If the machine is offline, remove the loadFont()
line in src/Short.tsx; the font stack falls back to SF Pro / Helvetica / Arial (looks slightly different).
