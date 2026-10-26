# 06 - Troubleshooting

| Problem | Cause / fix |
|---|---|
| `Cannot find module '../storyboard.json'` / TS error about JSON | `tsconfig.json` needs `"resolveJsonModule": true`; `storyboard.json` must sit in the project root (next to `package.json`). |
| TS error in `Root.tsx` "Type ... not assignable to Storyboard" | Keep the cast `storyboardJson as unknown as Storyboard` (already there). Real mismatch? run `validate.py`. |
| `Module not found: @remotion/google-fonts/Inter` | `npx remotion add @remotion/google-fonts` (keeps versions in sync). Offline: delete the `loadFont(...)` line in `src/Short.tsx`. |
| "Version mismatch" between remotion packages | All `remotion` / `@remotion/*` packages must have the SAME exact version: `npx remotion upgrade`. |
| Black screen, grid missing | `public/grid_vertical.mp4` absent (copy from skill `template/public/`; or `bash scripts/make_grid.sh Grid_1.mp4 public/grid_vertical.mp4`). Temporary: `"grid": "procedural"`. |
| Grid video stutters / render very slow | Lower concurrency (`--concurrency=2`), or use `"grid":"procedural"`. OffthreadVideo is used so it should be OK. |
| A visible jump in the grid every ~40 s | Expected only for videos > 40 s; it is cross-faded over 36 frames. If it bothers you use `"grid":"procedural"`. |
| Fonts look different (Arial-like) | Inter failed to load (offline). Acceptable; mention it. |
| Image does not show | Path is relative to `public/` (`"img/x.png"`, not `"public/img/x.png"`); extension case matters on Linux; `validate.py` checks it. |
| Image shows but wrong aspect | `w`/`h` in the storyboard do not match the file. Re-run prep_images.py and copy numbers from `manifest.json`. |
| No sound | `meta.audio` wrong; file must be in `public/`. Check `ffprobe out/short.mp4` lists an audio stream. |
| Captions out of sync with speech | Re-run `transcribe.py` on the SAME file used in `public/`; a trimmed/re-encoded file shifts times. Never offset times manually. |
| Whisper mis-hears a name ("Kimi" -> "Kiwi") | Fix the word's text `t` in storyboard.json (times stay). Also fix in words.json if you re-chunk. |
| Remotion render crashes (out of memory) | `--concurrency=1`, close other apps, or render in two halves (`--frames=0-600`, `--frames=601-end`) and concatenate with ffmpeg. |
| `rembg` fails/slow | Use already-transparent PNGs; or choose `HERO_CARD` for that photo. |
| `qa.py` complains "edge" but the frame looks fine | The check flags any bright pixels in the outer 34 px (e.g. a very bright logo near the edge). Look at the frame; if truly fine, note it in review.md. |
| Need a different aspect ratio (16:9) | Out of scope for this skill (zones are tuned for 9:16). Tell the user. |
