# Hena Vanta Skill Trigger & Control Card

## 1. Production Prompt Format
To run a video build with the Hena Vanta skill, send this exact format:

```text
Use the `hena-vanta` skill.
- Voiceover: <path to .wav/.mp3>
- Script: <path to script.txt, or the script pasted in the message>
- Format: long-form (16:9 1080p) or shorts (vertical)
- Background: <optional; a video from Branding\Bg; default = D:\Youtube\Hena Vanta\Branding\Bg\bg.mp4>
```

---

## 2. Trigger Phrases
The skill, lock rule (`hena-vanta-lock.md`), and `/hena-vanta` workflow activate when a prompt contains any of:
- `Use the \`hena-vanta\` skill` (any capitalization, with or without backticks)
- `use hena-vanta` (any capitalization)
- `/hena-vanta`
- `HV6` (or `hv6`)
- `Hena Vanta` (or `hena vanta`)
- Any file or directory path under `D:\Youtube\Hena Vanta\`

### Anti-Triggers:
- Do **NOT** activate on generic phrases alone: `"Vanta"`, `"Vanta Brief"`, `"my channel"`, `"make a video"`, `"shorts"`, or `"motion studio"` alone.
- **NEVER** activate when another channel's skill is named (e.g., `workflow2-explainer-v2`, `voiceover-to-short`, `workflow4-editor-v1`).

---

## 3. Operational Control Commands

| Command | Action |
|---|---|
| `approve this video` | Confirms the composition, visual pass, and timeline. Prepares the user for running the manual render command from `render-command.txt`. |
| `reject A## because <reason>` | Rejects animation `A##` (e.g. `reject A48 because quote text overflows frame`). Replaces it with a compliant catalog animation from `IDEA-TO-ANIMATION.md` or fixes props in `SceneView.tsx`, re-renders stills, and updates `review.json`. |
| `update the skill` | The **ONLY** authorized phrase that allows modifying files in the `hena-vanta` skill directory, `STYLE-LOCK.md`, or `hena-vanta-lock.md`. Any other edit requests must be proposed in `PLAN.md`. |

---

## 4. Input Processing & Directory Derivation

1. **Folder Derivation (`VIDEO_DIR`)**:
   - Derived from the voiceover path.
   - Searches disk layouts:
     - `D:\Youtube\Hena Vanta\Videos\<name>\` OR
     - `D:\Youtube\Hena Vanta\Project FIle\Videos\<name>\AI\`
   - If folder doesn't exist at the given path, searches both locations for `<name>`.
   - If multiple folders match, asks the user **ONE** question to clarify.
2. **Audio & Script**:
   - Voiceover: accepts `.wav` or `.mp3`.
   - Script: if pasted, saved to `VIDEO_DIR\script.txt`.
   - Timestamps: if supplied in script, imports as `supplied:`; if absent, runs alignment against voiceover and labels `aligned:`.
3. **Format**:
   - `"shorts"` = 1080x1920 vertical.
   - `"long-form"` = 1920x1080 horizontal.
   - If missing from prompt, asks the user **ONE** question to clarify.
4. **Assets & Paths**:
   - Background: `D:\Youtube\Hena Vanta\Branding\Bg\bg.mp4` -> copy to `public\hena-vanta\bg.mp4`.
   - Output: `VIDEO_DIR\output` (created automatically).
   - SFX Library: `D:\Editor 2.0\SFX + Meme sounds`.
   - Channel Logo: `D:\Youtube\Hena Vanta\Branding\logo2.png` -> copy to `public\hena-vanta\logo.png`.
5. **Non-Render Guarantee**:
   - The agent **NEVER** executes the full video render automatically.
   - It builds the Remotion scenes, executes `validate-v6.mjs` and `qa-frames.mjs`, inspects stills in `review.json`, and writes `render-command.txt` with loudness (`-14 LUFS, true peak <= -1 dBTP`) and word recovery (`>=98%`) checks.

