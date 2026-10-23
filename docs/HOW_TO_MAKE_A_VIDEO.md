# HOW TO MAKE A VIDEO — VantaBrief 1-Command Workflow

Follow this 10-line production checklist to produce retention-focused, broadcast-grade videos synced to your voiceover.

---

## The 10-Line Quick Checklist

1. **Create the Project**:
   ```powershell
   python studio.py new "Your Video Title" --channel VantaBrief
   ```
2. **Drop Your Voiceover**:
   Place your untouched audio file into:
   `Channels/VantaBrief/videos/<project>/assets/audio/voice/audio.mp3`
   *(Optional: drop your written script at `script.txt` in the same folder for perfect proper-noun alignment).*
3. **Run the Automated Master Pipeline**:
   ```powershell
   python studio.py new-video "Your Video Title"
   ```
   *This automatically runs local Whisper transcription, speech onset calibration, semantic beat segmentation (1.5s–3.5s), Variety Engine balancing across all 47 templates, and generates `PLACEHOLDERS.md`.*
4. **Inspect the Review Checkpoint**:
   Open `docs/beats-review.md` and verify the beat sequence, key phrases, and palette swatches.
5. **Approve & Build**:
   Confirm or run with `--auto` to proceed directly to compilation.
6. **(Optional) Add Real Footage / Screen Recordings**:
   Check `manifests/PLACEHOLDERS.md` for any slots (`slot-001`, `slot-002`, ...).
   Drop files into `projects/remotion-app/public/assets/user-footage/<slotId>.(mp4|png|jpg)`.
   *The template immediately auto-detects and displays your footage without modifying code.*
7. **Run the QA Gate**:
   ```powershell
   npx tsx scripts/qa.ts
   ```
   *Verifies audio sync (±3 frames), variety limits (<5.5% per template), palette compliance, meaning alignment, and zero audio additions.*
8. **Preview in Remotion Studio**:
   ```powershell
   cd projects/remotion-app
   npm run dev
   ```
9. **Render Final Video**:
   ```powershell
   python studio.py render-remotion <project> VantaBrief-Episode-003
   ```
10. **Render Debug Video (With Frame/Beat/Word HUD)**:
    ```powershell
    python studio.py render-remotion <project> VantaBrief-Episode-003-Debug
    ```

---

## Core Operational Rules

- **R1 (Audio)**: Never add sound effects, music, or ducking. Only the voiceover audio track is used.
- **R2 (Timing)**: Visuals adapt to voiceover timestamps; voiceover is never trimmed or re-timed.
- **R3 (Palette)**: Use only tokens from `projects/remotion-app/src/design-system/tokens.ts`.
- **R4 (Mascots)**: Do not reuse other creators' mascots or avatars.
- **R5 (Footage)**: If footage is needed and not yet supplied, use `<PlaceholderFrame>`.
- **R6 (Captions)**: Bottom captions are removed. Full emphasis is placed on large kinetic keyPhrases and visual explanations.
