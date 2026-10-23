# Motion Studio Quick Guide
**Use Remotion and Manim yourself, with ChatGPT or DeepSeek in the browser instead of the Antigravity agent**

Assumes `D:\Automations\motion-studio` is already open in Antigravity (File > Open Folder). You use Antigravity only as a code editor and terminal.

---

## 1. Open the terminal

- Menu: **Terminal > New Terminal**, or press `` Ctrl + ` ``.
- It opens inside `motion-studio`. The line before the cursor shows where you are:
  `PS D:\Automations\motion-studio>`
- Click the **+** in the terminal bar to open a second terminal. Handy because the preview keeps one terminal busy.

### 6 commands that are enough to navigate

| Command | What it does |
|---|---|
| `dir` | Lists files in the current folder |
| `cd projects\remotion-app` | Go into a folder |
| `cd ..` | Go up one folder |
| `cd D:\Automations\motion-studio` | Jump straight back to the studio folder |
| `cls` | Clear the screen |
| Up arrow | Repeat your previous command |

Tip: type the first letters of a folder and press **Tab** to auto-complete.

---

## 2. Run Remotion and open it in your browser

```powershell
cd projects\remotion-app
npm run dev
```

1. Wait a few seconds. The terminal prints a link, usually `http://localhost:3000`.
2. **Ctrl + click** the link, or paste it into your browser.
3. This is **Remotion Studio**. Pick your composition in the left sidebar and press play. Drag the timeline to scrub.
4. **Leave the terminal running while you work.** Every time you save a file (`Ctrl + S`), the browser updates by itself.
5. To stop it: click the terminal and press `Ctrl + C`.

If the page doesn't load, check the terminal for the real port number (it can be 3001 if 3000 is busy).

---

## 3. Create a new animation using ChatGPT or DeepSeek (browser)

### Step A: Tell the chatbot your setup (once per chat)

Paste this first, then describe what you want:

```text
I use Remotion (React + TypeScript) in a project with this layout:
- src/Root.tsx registers compositions
- my animations go in src/compositions/<Name>/<Name>.tsx
Rules: all animation must use useCurrentFrame(), useVideoConfig(), spring() and
interpolate(). No CSS transitions, no setTimeout. Put editable text, numbers and
colors in constants at the top of the file.
When I ask for an animation, give me:
1. The COMPLETE code for src/compositions/<Name>/<Name>.tsx
2. The exact lines to add to src/Root.tsx (the import and the <Composition ...> tag)
3. Any npm package I must install, as a command.
My Remotion version is: (paste it, see below)
```

Find your version with:

```powershell
npm ls remotion
```

### Step B: Put the code in the project

1. In the Antigravity **Explorer**, open `projects\remotion-app\src`.
2. Right-click `src` > **New Folder** > `compositions`. Inside it, new folder named after your animation (for example `StatCard`).
3. Right-click that folder > **New File** > `StatCard.tsx`.
4. Paste the chatbot's code and press `Ctrl + S`.
5. Open `src\Root.tsx`, paste the import line at the top and the `<Composition ... />` tag inside the component, and save.
6. Look at the browser preview. Your new composition appears in the left sidebar.

### Step C: Install extra packages (only if the chatbot says so)

Run it in a **second terminal** (click +), inside `projects\remotion-app`:

```powershell
npx remotion add @remotion/google-fonts
```

(`npx remotion add` installs the version that matches your Remotion. Don't use plain `npm install` for `@remotion/...` packages unless the versions match exactly.) Restart the preview afterwards: `Ctrl + C`, then `npm run dev`.

### If something is wrong

- The browser shows a red error, or the terminal prints one. **Copy the whole error text**, paste it into the chatbot and say "fix this, give me the full updated file".
- "Composition not found": the `id` in `Root.tsx` must exactly match what you type when rendering.

---

## 4. Change an animation you already made

### Quick manual edits (no chatbot needed)

Open the animation file in the editor, change the value, save (`Ctrl + S`). The preview updates instantly.

| I want to change | Where to look |
|---|---|
| Text, numbers | The constants at the top of the file |
| Colors | Hex values like `#6a2fc0` (search with `Ctrl + F`) |
| Video length | `durationInFrames` in `src/Root.tsx`. Frames = seconds x fps (5 s at 30 fps = 150) |
| Size or fps | `width`, `height`, `fps` in the `<Composition>` tag in `Root.tsx` |
| Timing of an effect | The frame numbers inside `interpolate(...)`, or `delay` in `spring(...)` |
| Bounciness | In `spring(...)`: lower `damping` = more bounce, higher = less |

### Bigger changes with the chatbot

1. Open the animation file, press `Ctrl + A` then `Ctrl + C` to copy everything.
2. In the chatbot, paste it and write: *"Here is my current Remotion file. Change: (what you want). Return the COMPLETE updated file."*
3. In the editor: `Ctrl + A` in the file, paste the new code, `Ctrl + S`.
4. Check the preview. If it's worse, `Ctrl + Z` undoes it.

**Safety habit:** before a big change, copy the file and rename the copy (`StatCard_v1.tsx`). Then you can always go back.

**One change per request** gives the best results.

---

## 5. Render the final video

Stop nothing, open a **second terminal**, then:

```powershell
cd D:\Automations\motion-studio
python studio.py render-remotion my-video StatCard
```

- Replace `my-video` with your project name and `StatCard` with your composition id.
- Transparent overlay (no background): add `--transparent` (gives a `.mov`).
- Result: `Videos\my-video\renders\`
- First time for a new project: `python studio.py new my-video`

---

## 6. Switch from Remotion to Manim

Nothing to uninstall. They are two separate projects in different folders.

| | Remotion | Manim |
|---|---|---|
| Best for | UI cards, counters, text, lower thirds, overlays | Flowcharts, graphs, data, math, technical explainers |
| Language | TypeScript / React | Python |
| Files live in | `projects\remotion-app\src\compositions\` | `projects\manim-app\scenes\` |
| Preview | Live in browser (`npm run dev`) | Render a quick low-quality video, then open it |

### How to switch

1. Stop the Remotion preview if it's running: `Ctrl + C`.
2. Make the code in the Manim folder instead. Tell the chatbot:

```text
I use Manim Community Edition (Python, `from manim import *`). Give me the COMPLETE
code for scenes/<name>.py with one Scene class called <SceneName>. Use Text(), not
MathTex, unless a formula is needed. Put labels and data in a list at the top.
```

3. In the Explorer, open `projects\manim-app\scenes`, create `flow.py`, paste the code, save.
4. Preview with a fast draft render:

```powershell
cd D:\Automations\motion-studio
python studio.py render-manim my-video flow.py SceneName --quality l
```

5. Open the video it made:
   `Videos\my-video\renders\manim\videos\flow\480p15\SceneName.mp4`
6. Edit the file, run the same command again, watch again. Repeat until happy.
7. Final quality: change `--quality l` to `--quality h`. Transparent: add `--transparent`.

For changes, use the same method as Remotion: paste the whole file into the chatbot, ask for one change, replace the file, run again.

To go back to Remotion later: `cd projects\remotion-app` and `npm run dev`.

---

## 7. Common problems

| Problem | Fix |
|---|---|
| Browser page won't open | Use the exact link printed in the terminal |
| Terminal seems stuck | The preview is running. Press `Ctrl + C` to stop it, or open a second terminal with **+** |
| Red error in browser | Copy the full error to the chatbot, ask for the full fixed file |
| Preview doesn't update | Make sure you saved (`Ctrl + S`). Check the filename tab has no dot |
| New composition not in the sidebar | It isn't registered in `src\Root.tsx` yet, or the file has an error |
| Manim: "No module named manim" | Use `python studio.py render-manim ...` (don't run `manim` directly) |
| Manim LaTeX error | Ask the chatbot to use `Text()` instead of `MathTex()` |
| Chatbot code uses CSS transitions or `setTimeout` | Tell it: "use only frame-based animation with useCurrentFrame, spring and interpolate" |

---

## Cheat sheet

```powershell
# Remotion preview (leave running)
cd D:\Automations\motion-studio\projects\remotion-app
npm run dev                         # open the link, Ctrl+C to stop

# New video project folder
cd D:\Automations\motion-studio
python studio.py new my-video

# Final renders
python studio.py render-remotion my-video CompositionId
python studio.py render-remotion my-video CompositionId --transparent
python studio.py render-manim my-video file.py SceneName --quality l
python studio.py render-manim my-video file.py SceneName --quality h
```
