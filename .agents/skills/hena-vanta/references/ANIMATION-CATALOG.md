# Animation catalog — A01 … A64

Format of every entry
* **Idea** — the kind of sentence it explains. Use it ONLY for that.
* **Ref** — `frames/<file>.jpg`: 6 frames, F1..F6 (left→right, top→bottom), time offset printed in each frame's red tag.
* **Anatomy / Motion** — what is on screen, per frame, with 30 fps frame numbers (f) counted from the animation start.
* **Exit**, **Build with** (src component), **HV adaptation** (what we change vs the reference).

**BRAND RULE: the reference images come from other creators. Copy motion and layout ONLY, never names, logos, avatars, thumbnails or numbers. Channel identity = Hena Vanta + our logo (see SKILL.md).**

Global: background = our grid loop. Sizes are for 1920x1080. `sec(1)=30f`. Never show invented numbers inside mock UI (view counts, subscriber counts, prices): use a real number from the script/screenshot or hide the element. Third-party thumbnails/logos in the reference (video thumbnails, vidIQ, ViewStats, Apple icons) are NOT to be copied; use our own captured screenshots (C4) or neutral shapes.

---------------------------------------------------------------------------------------------------
## GROUP 1 — Kinetic words (the backbone; use for ~45% of runtime)

### A01 Player card + word line (opener)
**Idea**: introducing a topic that lives on a platform ("today we're talking about ideas"). Best first scene when the topic is YouTube/video.
**Ref**: `frames/01-player-card-intro.jpg`
**Anatomy**: grey rounded video card 720x405 (radius 28, fill grey, soft play triangle, thin progress bar with a red knob at 18%), below it a channel row (avatar circle 44 px, channel name 22 px, two small pills). Under the row, a single text line.
**Motion**: F1 (0 f) card at centre. F2 (+12 f) whole stack rises 90 px and card clips off the top edge (camera tilts down). F3–F5 words appear one by one on a baseline under the row ("today", "we're", "talking", "about", "ideas"); each new word enters with wordPop at the right end, and the whole line slides left so the newest word stays near centre; older words fade to 60%. The keyword ("ideas") is red. F6 (+66 f) stack blurOut + drift up-left while the next kinetic scene (A02) blurs in at centre.
**Exit**: blurOut 8 f, overlap 6 f.
**Build with**: `Card`, `WordSync mode="ticker"`.
**HV adaptation**: the channel row shows "Hena Vanta" and OUR logo (public/hena-vanta/logo.png) in the avatar circle. The reference image for this entry was redrawn as a neutral schematic (the original showed another channel). Delete the like/share counts (or show real ones); keyword red not green.

### A02 Word stack (kinetic two-line phrase)
**Idea**: any short claim, said word by word ("killer ideas is all you need").
**Ref**: `frames/02-word-stack-kinetic.jpg`
**Anatomy**: text only, 72 px Inter 600, line 1 centred, line 2 centred under it offset 36 px left and 10 px lower (the "stagger" is what makes it feel hand-placed).
**Motion**: F1 (+0 f) "killer" appears alone, centred. F2 "ideas" joins; both slide 40 px left to stay balanced (re-layout spring). F3 (+27 f) "is" lands on line 2 below-left. F4–F6 "all", "you", "need" append on line 2; the line re-centres each time. Each word = wordPop. Line 1 stays, 100% opacity; line 2 words grow by one, never wrap.
**Exit**: whole block blurOut as the stat pill (A03) pops in over it (6 f overlap) — the text visibly dissolves INTO the pill.
**Build with**: `WordSync mode="stack"`.
**HV adaptation**: one red keyword max (the claim's key noun).

### A03 Stat pill count-up + sparkline
**Idea**: a big number the viewer must feel (views, dollars, days, proposals).
**Ref**: `frames/03-stat-pill-countup.jpg`
**Anatomy**: rounded rectangle (radius 44, fill `blue`, subtle top highlight), white text 56 px weight 800 "NNN Views" or "$N". Behind it, offset low-left, a faint green zig-zag line chart rising to the right (blurred 2 px, 40% opacity).
**Motion**: pill popIn at f0 (scale from the previous text, 6 f overlap). Digits countUp 0 -> target over 45 f (tabular numerals, no layout shift). The sparkline drawOn left to right over 40 f, same period, ending off-frame to the right. At f50 pill stays; at f60 blurOut.
**Build with**: `StatPill value={n} suffix=" views"`.
**HV adaptation**: ONLY a number that was said or sourced. Pill colour by meaning: `blue` neutral, `green` money/growth, `red` loss/zero.

### A04 Spotlight beam words
**Idea**: attention / what the viewer sees first / eye-catching / noticing ("crazy editing, eye-catching thumbnails").
**Ref**: `frames/04-beam-radar-words.jpg`
**Anatomy**: a green dot (radius 18 with 10 px halo ring) at lower-left of centre. From the dot a translucent cone (gradient green 35% -> 0%, 28° wide, ~600 px long) points to upper-right. Words appear INSIDE the cone, 36 px weight 600, stacked.
**Motion**: dot+cone popIn (f0..10), cone sweeps ±6° like a flashlight over the scene (drift). Words appear one per beat, stacking up inside the cone ("crazy", "editing"); when the cone changes direction (F4->F5) the previous words blur out and new ones continue. At scene end the dot dims to 30% and the cone fades.
**Exit**: blurOut both dot and cone.
**Build with**: `Beam`, `WordSync mode="stack"` (inside beam).
**HV adaptation**: keep green (it means "attention/ok"); use red cone if the sentence is a warning.

### A05 Single-word swap
**Idea**: fast list-like narration, 1 word per beat ("you put your videos…", "break down every step"). The workhorse.
**Ref**: `frames/05-single-word-swap.jpg`
**Anatomy**: ONE word at a time at exact centre (or at a fixed offset when paired with an object), 64–88 px weight 700.
**Motion**: at each word start: previous word blurOut (4 f, drifts 12 px up) while new word wordPop (8 f) at the same position. A word held longer than 0.6 s gets a micro-scale 1 -> 1.03.
**Variants**: *left-anchored* (word sits left of a persistent object, A08/A40); *dim* (word at 60% opacity when the object is the focus).
**Build with**: `WordSync mode="swap"`.
**Rules**: max 12 consecutive words in this mode, then change composition (insert A06/A07/A15 etc.). Red keyword allowed.

### A06 iMessage bubble with strike-through
**Idea**: a claim, myth or sentence the narrator says out loud, esp. one he then corrects ("bad ideas don't matter" struck out; the true line replaces it).
**Ref**: `frames/06-imessage-bubble-strike.jpg`
**Anatomy**: blue bubble (radius 44, tail bottom-right, fill `blue`), white 40 px text weight 600; text grows word by word, bubble width grows with it (re-layout spring). A red strike line (4 px) is drawn across the *first line* when it is negated.
**Motion**: f0 bubble popIn at its first word (small, upper right of centre). Each further word: wordPop inside, bubble expands, wraps to 2–3 lines max. Strike: drawOn left->right over 10 f on the negated line, red. Italic style on the key word ("bad" -> "bad ideas" in italic 700).
**Exit**: next bubble A07 enters below; this one slides up 80 px and fades to 70%.
**Build with**: `Bubble tone="me"`.
**HV adaptation**: use for myth-busting ("make $5k/month with clipping" struck out). Text must be a real claim that was said.

### A07 Reply bubble stack
**Idea**: a back-and-forth / reaction / the audience's objection ("WHAT!").
**Ref**: `frames/07-reply-bubble-stack.jpg`
**Anatomy**: grey bubble (tail bottom-left, fill `grey`, text `mute`->ink) at lower left; a second blue bubble below the first blue one; stack of 2–3 bubbles alternating sides.
**Motion**: reply bubble popIn from the side (slideIn -80 px + rotate -4° -> 0), 12 f. Earlier bubbles push upward 90 px and dim to 70%. After 1.5 s the whole stack blurOut together (F5 shows blurred stack drifting down-right) and a new bubble (blue) rises from the bottom.
**Build with**: `Bubble tone="them" | "me"`.

### A08 List cards slide-in
**Idea**: a 3–5 item framework or checklist introduced item by item ("viral ideas steps": know your audience, use outliers…). NOT used for a wall of text.
**Ref**: `frames/08-list-cards-slide-in.jpg`
**Anatomy**: right-aligned column (or centred for Shorts): heading 30 px weight 600 above 5 rounded cards 440x64, radius 18, fill off-white `#F6F6F8` with 1 px border, each with a coloured rounded-square icon (44 px; blue, green, orange, red, yellow) + 22 px label (max 4 words). Left half shows the kinetic words (A05).
**Motion**: heading softIn f0; cards riseIn staggered 6 f apart, each with its coloured icon (popIn) — item appears at the moment it is spoken (not all at once). Cards beyond the spoken one stay hidden.
**Exit**: see A09.
**Build with**: `ListCards items=[{label,color}] revealed={n}`.
**HV adaptation**: <=5 items, labels <=4 words, each is a takeaway. Icon squares carry no glyphs.

### A09 List focus-dim
**Idea**: "now step 2": narrow attention onto one list item while the others recede.
**Ref**: `frames/09-list-cards-dim-focus.jpg`
**Motion**: focusDim: all cards except the active drop to 30% + 1.5 px blur over 8 f, active card scale 1.04 and its icon pulses once (scale 1.12). Camera drifts so the active card moves toward centre (translateX -120 px over 20 f). Then the list exits via blurOut while the next scene's window (A11) blurs in at the same spot.
**Build with**: `ListCards active={i}`.

### A10 Folder row + cursor
**Idea**: step-by-step process, "five steps, one folder each" — before diving into each step.
**Ref**: `frames/10-folder-row-cursor.jpg`
**Anatomy**: 5 blue folder icons (64x52) in a tight row centred, label under each (20 px "Step 1…5", white text on grid -> use ink). A hand-cursor enters from below.
**Motion**: folders riseIn staggered 4 f; cursor cursorGlide from bottom to folder 1, hovers, "double-click" (scale pulse x2). The clicked folder expands into a window (A11) by scaling 1->18x while others blur out. 
**HV adaptation**: folder colour `blue`; labels = real step names, not "Step n", when the voiceover names them.

### A11 Window opens (morph from folder) with ghost title
**Idea**: opening a tool/page/topic; a container that will hold the next several beats.
**Ref**: `frames/11-window-open-ghost-title.jpg`
**Anatomy**: white window 1100x620, radius 18, 24 px light-grey title bar with three dots (red/amber/green 10 px), soft shadow. Title text in the top-left of the body ("Know your audience") 34 px weight 500, at 40% ghost opacity first.
**Motion**: f0 window scales from the folder (0.1 -> 1, out-expo, 14 f) with the title already visible at 100% by f18; the previous scene fades inside it (cross-dissolve, 10 f). Camera continues drifting.
**Build with**: `Window title="Know your audience"`.
**Rule**: windows are ONE persistent container across A11–A14; do not re-create.

### A12 Skeleton grid in window
**Idea**: "the platform's feed / a page of videos / many options".
**Ref**: `frames/12-skeleton-grid-window.jpg`
**Anatomy**: inside the window: a brand mark top-left (use a neutral 'play' logo, not YouTube's, unless a captured screenshot), then a 2x3 grid of grey rounded rects 300x170 (radius 14).
**Motion**: the grid scrolls vertically (translateY -40 px per second, looping, 6 rows) — never static; cards riseIn staggered by column. Cursor optional.
**HV adaptation**: when the viewer must see the REAL page, replace the grey rects with the captured screenshot (A14).

### A13 Avatar carousel with centre scale
**Idea**: "lots of creators/channels/people" and then picking one.
**Ref**: `frames/13-avatar-carousel-center-scale.jpg`
**Anatomy**: vertical list inside a window: coloured circles (96 px; blue, green, orange; one real avatar photo allowed ONLY if licensed/captured) with name (28 px weight 600) and 18 px grey description line.
**Motion**: list scrolls upward (translateY -180 px/s) with ease-in-out; the item nearest the vertical centre scales 1 -> 1.35 and its text brightens; others dim to 60%. The scroll slows and stops with the chosen item at centre (F4–F6), window slightly zooms (1 -> 1.12) toward it. Then the next scene blurs through it.
**Build with**: `Window` + `AvatarCarousel` (compose from `Card`).

### A14 Dark screenshot inside window + zoom
**Idea**: PROOF — a real page, dashboard or tool. The "show me" beat.
**Ref**: `frames/14-dark-screenshot-in-window-zoom.jpg`
**Anatomy**: the captured screenshot fills the window body, edge to edge (radius 0 inside window). Dark screenshots are fine ONLY inside the white window.
**Motion**: F1 the previous list (A13) blurs into the screenshot (cross-dissolve, 10 f, with blur peak 10 px). F2->F6: slow push-in 1.00 -> 1.18 toward the region being discussed (transform-origin = that region), 60–90 f, ease-in-out. A white cursor-arrow may appear and glide to the element ("a click point"), and the target region gets a 1 px highlight ONLY by enlarging (zoom) — no drawn marks. 
**SFX**: `ui` at f0.
**Build with**: `Window` + `<Img>` with `transformOrigin`.
**Rule**: C4 real screenshot, verified. If capture failed -> A52 FootageNote inside the window.

### A15 Phone mockup with quote
**Idea**: a quote, a note, a message, a short-form/mobile moment ("Shorts"), or a saved idea.
**Ref**: `frames/15-phone-mockup-quote.jpg`
**Anatomy**: black phone frame 460x940 (radius 64, bezel 12) rising from the bottom edge; screen white with status bar (time, signal, battery), a back chip and a "Done" chip in `amber`, then a big open-quote mark and the quote 40 px italic 600, author 34 px italic 300 grey.
**Motion**: riseIn from below (translateY 400 -> 0, 20 f, out-quart) with blur 12 -> 0; once settled it keeps creeping upward at about 0.15 px per frame. Quote lines wordPop line by line at spoken time. F3->F6: camera creeps up; phone clips at bottom edge (intentional).
**Exit**: phone slides up and out while next scene (A16 text selection) blurs in on the white canvas.
**HV adaptation**: only real quotes with attribution. For a Short, use this as the main frame (vertical).

### A16 Selected text with handles
**Idea**: "this word/idea is the thing" — selecting a single concept ("IDEA") to act on it.
**Ref**: `frames/16-text-selection-handles.jpg`
**Anatomy**: one huge word 160 px weight 800 ink, tinted selection rectangle (`blue` 16%), two blue handle dots (14 px) at top-left and bottom-right with 2 px stems.
**Motion**: word popIn; selection rect drawOn left to right over 10 f; handles popIn at its ends (spring). Then the context menu A17 appears.

### A17 Context-menu cursor
**Idea**: an action applied to the selected idea — copy, paste, delete (steal-and-adapt, remove, replace).
**Ref**: `frames/17-context-menu-cursor.jpg`
**Anatomy**: white menu 220x260, radius 12, soft shadow, items: Undo, Redo, | Cut, Copy, Paste, Delete, Select All (20 px). Use only the items needed; the item that matches the narration is highlighted `blue` 20%.
**Motion**: menu softIn at the right of the word (f0, scale 0.96->1 from top-left); cursor enters from lower right, cursorGlide to "Paste" (or the named action) in 24 f, highlight row follows the cursor; click pulse; menu blurOut, the word reacts (A18).
**HV adaptation**: keep the OS-menu verbs and highlight only the one the narration implies (copy / paste / delete). Do not invent custom menu items; if the narration needs other verbs use A30 (pill press) instead.

### A18 Gradient word morph (transformation)
**Idea**: change/transformation/upgrade/"turn X into Y".
**Ref**: `frames/18-gradient-word-morph.jpg`
**Anatomy**: a single word 120 px weight 800 with a horizontal gradient (blue -> green; red -> amber for "failure -> fix"), cursor resting at the right end.
**Motion**: the old word (grey, small) blurs out; the new word enters from the right with 24 px horizontal motion blur streak (blur-x 20 px -> 0 over 14 f), then the gradient slides left->right across the letters once over 40 f. The cursor sits at the end and nudges 6 px on landing.
**Build with**: `GradientWord`.

### A19 Dock tap
**Idea**: "you open the app / go to the platform" — a literal tap/choose.
**Ref**: `frames/19-dock-icon-tap.jpg`
**Anatomy**: rounded dock (radius 40, fill grey 80%) with 4 neutral rounded-square icons (green, red, green, blue circle) 88 px; cursor on the second.
**Motion**: dock riseIn from bottom (16 f); cursor glides over, tap pulse; tapped icon scales 1.12 and everything else dims (focusDim); then the icon expands into the next scene (scale 1 -> 8, blur) — a "zoom-through" hand-off.
**HV adaptation**: NO real app logos unless a real captured screenshot; use coloured neutral squares or the actual brand icon from a licensed capture.

### A20 Thumbnail card with green-highlighted caption word
**Idea**: an example of a real video/product/post; the highlighted word is the lesson ("Strongest", "100 Days", "24 Hours").
**Ref**: `frames/20-thumbnail-highlight-word.jpg`
**Anatomy**: image card 640x360 radius 20 (real image only), caption below 36 px weight 700; ONE word/phrase has a `green` highlight box (radius 6, behind text) that wipes in.
**Motion**: card riseIn; caption wordPop; the highlight wipes left->right behind the keyword over 8 f at its spoken time. Cards change every ~2 s via slide (A21).
**SFX**: `ui` at f0 (image card).
**HV adaptation**: highlight = `green` for "what works", `red` for "what fails" — same shape.

### A21 Thumbnail slide / pan
**Idea**: "look at several examples" in sequence.
**Ref**: `frames/21-thumbnail-slide-pan.jpg`
**Motion**: card slides left ~900 px (ease-in-out, 22 f) while the next card slides in from the right with 6 f overlap; the caption words ride with their card; cursor enters top-left and glides off (it indicates browsing). Max 3 cards in a row, then switch composition.

### A22 Ghost → sharp (loading) player
**Idea**: something being prepared, about to be revealed, or "an idea that hasn't become a video yet".
**Ref**: `frames/22-ghost-to-sharp-player.jpg`
**Motion**: object appears at 10% opacity + 14 px blur (a "ghost"), then focuses over 20 f (opacity 1, blur 0) while the progress knob scrubs 0 -> 100% under a cursor (cursorGlide along the bar, 30 f). Small, 60–70% of the frame width.
**Build with**: `Card` + `softIn` with `from="ghost"`.

### A23 Notification banners
**Idea**: a *metaphor* for an event notice ("your channel got upgraded", "access unlocked") — never a claim about reality.
**Ref**: `frames/23-notification-banners.jpg`
**Anatomy**: banner 560x84 radius 24 white 92%, tiny source label in 14 px caps ("HENA VANTA" + "now"), message 34 px 500. Up to 3 stacked, spacing 8 px.
**Motion**: first banner riseIn from the top (translateY -120 -> 0, 14 f, out-quart, overshoot 6 px); each new banner pushes older ones down 78 px and dims them to 70%; stack blurOut together.
**Rule**: message text is OUR invented line; never impersonate a platform.

### A24 Pastel squares → big tile
**Idea**: "several options/ideas" collapsing into one answer.
**Ref**: `frames/24-pastel-squares-to-tile.jpg`
**Anatomy**: 3 rounded squares 220 px in pastel (green, blue, peach 60%) overlapping loosely (blurred 2 px).
**Motion**: squares float in with different delays (riseIn, 6 f stagger), orbit ±20 px; at the keyword they merge into one tile (scale/position lerp 14 f) that becomes A25.

### A25 Percent tile
**Idea**: a single percentage / ratio / grade (0%, 3%).
**Ref**: `frames/25-percent-tile.jpg`
**Anatomy**: rounded square 280x280 radius 56 fill `grey`-mauve `#D7BEC5`, number 160 px weight 800 ink centred.
**Motion**: tile popIn; the number countUp to target in 24 f; on change (0% -> 3%) the old digits blurOut vertically (translateY -30) while new ones riseIn from below (slot-machine). Swap colour to `red`/`green` tint when meaning is negative/positive.

### A26 Folder sweep cursor
**Idea**: scanning through steps/files; "go through each one".
**Ref**: `frames/26-folders-cursor-sweep.jpg`
**Motion**: same folder row as A10, cursor sweeps left→right over the row in 30 f (ease-in-out), each folder lifts 8 px as the cursor passes and drops back (wave). End on the folder named in the narration.

### A27 Window with italic emphasis sentence
**Idea**: a definition ("Outliers are videos that performed better than other videos on the channel"). The ONLY allowed multi-line sentence, max 12 words.
**Ref**: `frames/27-window-italic-emphasis.jpg`
**Anatomy**: window (A11) body, sentence 44 px weight 400 left-aligned inside, defined terms in *bold italic*.
**Motion**: words wordPop at spoken time (not pre-laid-out); bold-italic terms switch to weight 700 italic as they land. Sentence stays; window drifts. The next beat (A28 chart) replaces the text inside the same window with cross-dissolve.
**HV adaptation**: each definition term gets `red` (max 2). This is the replacement for the old "text part": short, spoken-time, inside an object.

### A28 Line chart drawn live with cursor
**Idea**: performance over time; baseline vs. change; "most videos look like this".
**Ref**: `frames/28-line-chart-draw-cursor.jpg`
**Anatomy**: window body with 6 faint horizontal grid lines (1 px, 8%), a blue line + 14% fill under it, no axis labels, small hand cursor at the leading tip.
**Motion**: drawOn left->right following the speech (frames mapped to word times), cursor locked to the tip; the line is noisy-flat (±8 px). Use real data if you have it; else flat/synthetic AND labelled in PLAN.md as "illustrative" (a visible footnote is mandatory: italic 18 px "illustrative").
**Build with**: `LineChart points=[…]`.

### A29 Spike + multiplier badge
**Idea**: an outlier — one result far above normal ("10x").
**Ref**: `frames/29-spike-and-10x-badge.jpg`
**Motion**: the chart tip suddenly shoots up (a 12 f ease-out-expo rise to 4–5x baseline height), the area under it fills pale blue; then a green circular badge (112 px, "10x" 44 px 800 white) popIn at centre-left with spring overshoot; cursor lingers at the peak, then at the baseline. Exit: whole window dims, badge fades last.
**Rule**: multiplier must be said or computed from shown data.

### A30 Pill button press ("Pay")
**Idea**: a transaction, a CTA, a paywall, "you click and…".
**Ref**: `frames/30-pay-pill-press.jpg`
**Anatomy**: pill 300x120 radius 60 fill `red` (money-out) or `blue`/`green`, white 64 px weight 800 label.
**Motion**: popIn, cursor rises from below-right, glides to the pill (24 f), press: pill scale 0.97 + blur 1.5 px for 4 f, cursor scale 0.88; release; pill glows to 100% brightness. Use pill colour semantics: `red` pay/lose, `green` free/gain, `blue` neutral action.

### A31 Pill + logo stack
**Idea**: tools/options compared by price or access ("Free" / "Download" + tool names).
**Ref**: `frames/31-pill-button-logo-stack.jpg`
**Motion**: green "Free" pill at top (popIn) -> scrolls up and out; blue "Download" pill takes the centre with cursor press; below it a tool logo wordmark riseIn (f+8), then a second wordmark riseIn (f+16). Each wordmark must be a real captured logo (licence/source) or plain 40 px text of the tool's name.
**HV adaptation**: only tools that were named; no affiliate sign unless the script says so.

### A32 Badge zoom-pan on a video card
**Idea**: compare performance numbers inside a feed — "this one got 8x its channel's normal".
**Ref**: `frames/32-badge-zoom-pan.jpg`
**Anatomy**: window with a video card (grey 16:9, radius 22), a channel row (avatar + two grey lines) and a green badge ("8x") at the right end of the row.
**Motion**: camera pushes in (scale 1 -> 1.7) toward the badge (ease-in-out 36 f), cursor clicks it; then pans left along the row to the avatar (translateX +520 px, 24 f) — a guided tour: video -> badge -> creator. Each pan step happens on a cue word.

### A33 Channel → thumbnails with multiplier badges
**Idea**: inspect a creator's catalogue and spot outliers vs. normal.
**Ref**: `frames/33-channel-to-thumbs-badges.jpg`
**Anatomy**: channel header (avatar 72, name 40 px, "1k" 26 px grey), three thumbnail placeholders (or real captures) with labels: `100x` green pill, `1x` amber pill, and tiny view counts.
**Motion**: header softIn; thumbnails riseIn 6 f stagger; badges popIn after each thumbnail lands; camera pans right across the row. Counts must be real or hidden.

### A34 S-curve with words on the path
**Idea**: the parts of one thing ("theme, character, plot, setting, conflict") or steps along a route; a story arc.
**Ref**: `frames/34-s-curve-word-path.jpg`
**Anatomy**: black S-shaped line (stroke 4, ink) running top to bottom; words (44 px 700) placed alternately left and right of the line at the bends.
**Motion**: the curve drawOn top->bottom over the whole beat; each word wordPop when the line reaches its bend (the word spoken time drives the draw progress). Camera tilts down following the tip. Exit: all blurOut.
**Rule**: 4–6 words; this is a diagram, not decoration (the order is the point).

### A35 Three colour bars (stagger)
**Idea**: three categories/lengths/amounts (compare, rank, "the three things").
**Ref**: `frames/35-three-bars-stagger.jpg`
**Anatomy**: three horizontal pills (height 44, widths 360/320/300; green, red, blue) stacked with offsets (x ±40) overlapping slightly.
**Motion**: each bar wipes in left->right (drawOn on width, 10 f) one per cue, staggered 8 f, with a tiny overshoot; they then slide into alignment (re-layout) or morph into a chart. Add labels (28 px) INSIDE the bars only when needed.

### A36 Thumbnail pop-expand (from a pill)
**Idea**: reveal a specific example from nowhere ("this video: 'Searching for a world that doesn't exist'").
**Ref**: `frames/36-thumb-pop-expand.jpg`
**Motion**: a small grey pill (320x44) at centre; cursor arrives; the pill morphs (width/height lerp 16 f, radius 22 -> 20) into an image card (640x360) with the image blurring in from 18 px; title riseIn below (28 px 600) then a second line (e.g. "*25M views") weight 700. Cursor moves down to the caption.
**SFX**: `ui` at morph.
**HV adaptation**: real capture; title copied exactly from the page; the stat line only if shown on page.

### A37 Dark screenshot blur-in (cinematic)
**Idea**: scene change into proof, full-bleed dark analytics page (channel page, grid of videos).
**Ref**: `frames/37-dark-screenshot-blur-in.jpg`
**Motion**: from a blurred (24 px) and over-zoomed (1.4) version of the screenshot, focus pulls to sharp while scale eases to 1.0 over 24 f; second screenshot slides in from the right over the first (slideIn). The dark image keeps a 24 px white margin of grid visible (rounded 18) so it never becomes a black screen.
**Rule**: never full-bleed black; keep margin.

### A38 Blurred-word background
**Idea**: a single huge concept word said slowly ("greatest", "exist") that needs weight.
**Ref**: `frames/38-blurred-word-background.jpg`
**Anatomy**: sharp word 72 px weight 800 centred; behind it a copy of the previous scene's content at 24 px blur, 20% opacity (leftover depth).
**Motion**: the previous scene dissolves into a blurred wash (blur 4 -> 24 over 14 f) and the word swaps in sharp on top; drift continues.

### A39 Two circles → Venn
**Idea**: an intersection: "viral = idea AND skill", "X + Y = Z", two ingredients and their overlap.
**Ref**: `frames/39-two-circles-venn.jpg`
**Anatomy**: two circles 360 px diameter (stroke 5 ink, no fill, tiny blur-shadow), labels 56 px weight 400 centred in each ("Idea", "Skill"); the overlap holds a vertical (rotated -90°) word 44 px 700 ("Viral"), `red` if it is the answer.
**Motion**: circles slide in from the screen edges (blurIn, 16 f, out-cubic) from far left and right and settle apart; labels wordPop at spoken time. On the third word the circles slide toward each other (translateX ±90 px, 20 f, ease-in-out) until they overlap ~25%; the overlap word wordPops, rotated -90°, squeezed to the lens width. Then hold with drift.
**Build with**: `Venn labelA labelB overlap`.
**HV adaptation**: use for "idea + skill", "views + trust", "effort + reach"; never > 2 circles.

### A40 Heading + card stack (explainer column)
**Idea**: a category with examples ("Stakes", "Money", "Time", "Comparison"): the heading names the pattern, cards show instances one at a time.
**Ref**: `frames/40-heading-plus-card-stack.jpg`
**Anatomy**: heading word top-right (56 px 800, at x=1380,y=120); image cards (real) with captions (24 px 600), first card at left-top, the next ones stack downward/right at 16 px gap; card width 300–520.
**Motion**: heading softIn first; card 1 riseIn at its cue; at the next cue card 2 riseIn beside/below, card 1 stays at 100%; after 3 cards the group blurOut and a new heading swaps (the word blurs while the cards do). Camera pans slightly so new cards come into the safe area.
**SFX**: `ui` per card.
**Exception**: this is the one non-centred layout; keep heading/cards inside the 96 px safe area.

### A41 Two cards (compare / contrast)
**Idea**: two examples of one pattern ("money" vs "money").
**Ref**: `frames/41-two-cards-money.jpg`
**Motion**: card A riseIn at left, card B riseIn at the right after 20 f with a different height; heading stays; both dim 30% when the next heading arrives.

### A42 Comparison pair (4-up)
**Idea**: four things in one frame ("The Ultimate AI Battle"), a roster.
**Ref**: `frames/42-comparison-pair.jpg`
**Motion**: image card A (centre-left) riseIn; card B riseIn; two small cards below; each appears when named; heading "Comparison" top-right (A40 rule).

### A43 Credit caption ("not mine")
**Idea**: honesty beat — attribute borrowed footage; anti-hype channel signature.
**Ref**: `frames/43-credit-caption-not-mine.jpg`
**Anatomy**: media card (real video still or loop) rounded 22, and an italic 34 px caption at bottom-right, `mute`, e.g. "not mine" or "source: <site>".
**Motion**: card softIn; caption wordPop 12 f after; card keeps playing (video loop) while the caption holds; blurOut both.
**HV rule**: use whenever the footage/screenshot is not ours (B4).

---------------------------------------------------------------------------------------------------
## GROUP 2 — The earlier style, upgraded (kept because they work)

### A44 Stick figure + italic caption
**Idea**: relatable beginner moment ("when you make a new channel").
**Ref**: `frames/44-stickman-italic-caption.jpg`
**Anatomy**: stick figure (rounded strokes 6 px, ink, head 90 px with simple expression) at left; italic caption 44 px right of it with the keyword in `red`.
**Motion**: figure softIn; caption wordPop; the expression swaps between 2 SVG faces (neutral -> sad -> thinking) at cue words; optional prop (phone, name tag) popIn. In the next beat the figure slides left while a screenshot card enters at the right (A45).
**HV adaptation**: the figure is the user's recurring character; keep it vector, no drop shadow.

### A45 Screenshot card + italic footnote
**Idea**: proof with honest sourcing. ("*not my screenshots")
**Ref**: `frames/45-screenshot-italic-footnote.jpg`
**Motion**: screenshot card (dark allowed inside a white rounded frame with 16 px padding) softIn with a slow 1.00 -> 1.06 push; footnote italic 22 px `mute` under it wordPop; when the next idea arrives the screenshot dims (focusDim) and an idea text replaces the footnote. **SFX** `ui`.
**Rule**: C4; footnote required if not ours.

### A46 Nested list (title + dash lines + small notes)
**Idea**: a tiny set of requirements/fixes. **Replaces the old text wall — now it is built one line at a time with a light object around it**.
**Ref**: `frames/46-how-to-fix-nested-list.jpg`
**Anatomy**: heading 64 px italic 700, then up to 3 lines "- label" 44 px with a 22 px grey parenthesis note below each.
**Motion**: heading wordPop; each line appears ONLY on its cue (riseIn 12 f), previous lines shrink to 60% scale and 60% opacity to make room (re-layout); the last line is the focus: larger (56 px), keyword `red`, its note appears 10 f later. Max 3 lines; never all at once.
**HV rule**: this is the only allowed small-text paragraph; notes <= 12 words; prefer A08 when items are parallel.

### A47 Red keyword one-liner
**Idea**: a single sentence where one word is the point ("then they'll **push** your videos out", "typically looks the **same**").
**Ref**: `frames/47-red-keyword-oneliner.jpg`
**Motion**: the sentence is italic 700 52 px, centred; words wordPop at spoken time; the keyword lands in `red` already (from its first frame). Hold 0.3 s after the last word, then blurOut.
**HV rule**: use as a CALM interlude between busy scenes; <=18 words.

### A48 Brain / quote + "trap" warning
**Idea**: a common wrong thought the viewer has ("my last 10 shorts all got 30k views :( ") followed by a correction ("DON'T FALL FOR THIS TRAP").
**Ref**: `frames/48-brain-quote-trap-warning.jpg`
**Anatomy**: an icon at left (brain illustration, or any symbol that fits: use a plain vector, licensed), quote in italic 40 px, then a bold-italic 56 px all-caps warning line in ink with the footnote explanation in 22 px below.
**Motion**: icon softIn; quote wordPop; 0.4 s later the quote dims 50% and moves up 60 px while the warning riseIn with `red` on "TRAP" (the one place caps are allowed); footnote riseIn last. No shake.

### A49 Two screenshots offset
**Idea**: two states of one thing: before/after or "same video, different tab".
**Ref**: `frames/49-two-screenshots-offset.jpg`
**Motion**: shot 1 softIn left-low; shot 2 slideIn from the right at upper-right, overlapping 12% (z-order on top) — 14 f; caption below both, bold italic 44 px, keyword `red`. Slow opposite drift (shot 1 right, shot 2 left) so they feel alive. **SFX** `ui` x2.

### A50 Side heading + screenshot
**Idea**: a screenshot with a spoken label ("this happens naturally").
**Ref**: `frames/50-side-heading-screenshot.jpg`
**Anatomy**: screenshot card left (width 560), heading right 64 px 800 italic stacked in 3 lines.
**Motion**: card softIn; words of the heading appear one per line at their cue (wordPop), left-aligned at x=1000. Card pushes in 1.00 -> 1.05.

### A51 Bold-italic bullets (verdict list)
**Idea**: reasons or verdict for a result ("Low quality short / Low trust score / Oversaturated niche").
**Ref**: `frames/51-bold-italic-bullets.jpg`
**Motion**: a screenshot above (A45), then 3–4 lines 48 px bold italic appear one per cue (riseIn), each preceded by a dash; the previous lines stay 100% until the last (all remain readable). Red on the single worst reason.
**Limit**: max once per video; it is the closest to a "text part" and must follow a proof screenshot.

---------------------------------------------------------------------------------------------------
## GROUP 3 — New Hena Vanta animations (built from the same grammar; no frame from the references, so each has a schematic `frames/…jpg` generated for you)

### A52 Footage note slot (no black box)
**Idea**: where the editor will place gameplay / screen recording / b-roll.
**Ref**: `frames/52-footage-note-slot.jpg`
**Anatomy**: grid background only + ONE text line 20 px, Inter 500, `#8C8C93`, centred at the slot centre. Nothing else.
**Motion**: opacity 0 -> 1 over 6 f (no blur, no move, no drift on this element so a centred clip hides it exactly). A small overlay word (A05) may run above ONLY if the script asks; the note itself never moves.
**Build with**: `FootageNote label="GAMEPLAY: Subway Surfers run, no HUD"`.

### A53 Master journey timeline
**Idea**: the story over time (e.g. 360 days on Upwork): 3–8 events, each with label + note.
**Ref**: `frames/53-journey-timeline.jpg`
**Anatomy**: horizontal line at y=540 (stroke 4, ink), event dots 28 px; label 40 px 700 above the dot, note 24 px 400 below (<=10 words); the active dot is `blue` with halo, past dots ink, future dots not yet drawn. The whole line is centred; camera pans to keep the active event at the centre.
**Motion**: scene 1: line drawOn from dot 1 to dot 1 (point) + label softIn. Each following scene: line extends to the next dot (drawOn 20 f, ease-in-out), camera pans (translateX), the active dot popIn, label riseIn, note softIn 6 f later. Past events dim to 60%. NEVER show future events. Last scene: pan out (scale 0.6) to reveal the full journey for 2 s (this is the only reveal-all moment, on the verdict).
**Build with**: `Journey events activeIndex`.
**Rule**: one scene per event, the same journey object across scenes (persistent).

### A54 Before / after split with pills
**Idea**: expectation vs. result, $0 -> $X, day 1 vs. day 30.
**Ref**: `frames/54-before-after-split.jpg`
**Anatomy**: two pills side by side, left grey "Day 1", right `blue`/`green` "Day 30", a thin vertical divider (ink 2 px) between; under each a value in 96 px 800.
**Motion**: left pill popIn, its value countUp; divider drawOn top->bottom; right pill popIn, value countUp with a longer duration; the winning side scales 1.06, the other dims. Values real.

### A55 Number drops to zero
**Idea**: an expectation collapsing: revenue/views falling to 0 ("0 views jail").
**Ref**: `frames/55-number-drops-to-zero.jpg`
**Motion**: pill (A03) with a large number counts DOWN with ease-in-quad to 0 over 40 f; at 0 the pill colour crossfades `blue` -> `red` (6 f), a 6 px inset pulse once; label "views" stays. No shake.

### A56 Checklist ticks (steps one at a time)
**Idea**: tutorial steps / requirements / "do these 3 things first".
**Ref**: `frames/56-checklist-ticks.jpg`
**Anatomy**: up to 4 rows (card 720x72 radius 20); left a 36 px circle, middle label 30 px 600 (<=4 words), right empty.
**Motion**: row riseIn at its step cue; circle drawOn tick (green stroke, 8 f) when the step is DONE (second cue); current row scale 1.03, previous ticked rows dim to 60%. Never reveal rows early.
**Difference from A08**: A08 = parallel items with icons; A56 = ordered actions with completion.

### A57 Myth vs truth flip
**Idea**: anti-hype core: a claim then the reality.
**Ref**: `frames/57-myth-vs-truth-flip.jpg`
**Anatomy**: card 900x240 radius 28. Front: grey chip "MYTH" (22 px caps `mute`), claim 56 px 700 ink. Back: green chip "TRUTH", statement 56 px 700 with one `red` word? (use `green` chip, ink text, red keyword).
**Motion**: front softIn; red strike line drawOn across the claim (10 f); card rotates about X axis 0 -> 90° (8 f, in-quad), swaps face, 90° -> 0° (8 f, out-quad) — a *flip*, once only. Perspective 1200 px.
**Rule**: the truth line must be supported by the script/source (B4).

### A58 Meter: views vs money
**Idea**: relationship between two quantities (views ≠ income).
**Ref**: `frames/58-meter-views-vs-money.jpg`
**Anatomy**: two horizontal bars with labels left ("Views", "Money" 30 px 600): top bar `blue` long; bottom bar `green` very short; values at the right end (countUp).
**Motion**: top bar drawOn to 100% (30 f, ease-out), value countUp; 8 f later bottom bar drawOn to its real proportion (tiny) — the contrast IS the point; a ratio chip popIn between ("1 : N") only if computable from said numbers.

### A59 Expected vs actual columns
**Idea**: what people claim vs what happened.
**Ref**: `frames/59-expected-vs-actual.jpg`
**Anatomy**: two stacked pills: "Expected" `grey` 420x84 with value 64 px; "Actual" `blue`/`red` pill with value 64 px; vertical gap 36.
**Motion**: Expected popIn; Actual popIn from below 12 f later; the difference chip ("-92%") popIn only if computed from shown values; then Expected dims and shrinks 15%.

### A60 Search-bar question
**Idea**: the viewer's question, literally searched ("Is Upwork worth it?") — good for the HOOK -> QUESTIONS function.
**Ref**: `frames/60-search-bar-question.jpg`
**Anatomy**: wide pill search bar 900x88 radius 44 (white, 1 px border, shadow), magnifier glyph left, text 40 px 500; a blinking caret.
**Motion**: bar softIn; typeOn the question at 1 char / 2 f (synced to the spoken question), caret blinks 15 f; at the last char the bar pulses (scale 1.02) and the first result card (A20) slides in beneath (riseIn).

### A61 30-day calendar fill
**Idea**: effort over time in an experiment (30 days of clipping, 360 days).
**Ref**: `frames/61-calendar-fill.jpg`
**Anatomy**: 10x3 grid of 56 px rounded squares (radius 12, grey); filled squares `blue`; one `green` for a good day, one `red` for a failed day.
**Motion**: squares fill left->right at 2 f each (a fast "tick" wave), pausing on notable days (they popIn bigger 1.2 then settle) in sync with the narration; counter beneath ("Day N") swap-words (A05). For 360 days use 24x15 dots 16 px.

### A62 Funnel bars
**Idea**: conversion: 100 proposals -> 12 replies -> 2 clients.
**Ref**: `frames/62-funnel-bars.jpg`
**Anatomy**: 3 centred bars narrowing (widths proportional to values; min 120 px), labels inside, values 56 px 800.
**Motion**: bar 1 drawOn from centre outward (12 f), then bar 2, bar 3 each 10 f after its cue; the conversion % chip popIn between bars (only if computed from the real values). Final bar `green`/`red` by outcome.

### A63 Time-cost stopwatch
**Idea**: time/effort invested ("I spent 6 hours on this").
**Ref**: `frames/63-time-cost-stopwatch.jpg`
**Anatomy**: a circle ring (stroke 10 `grey`) with progress arc `blue`, digital time 96 px 800 inside (00:00:00 tabular).
**Motion**: ring drawOn to the target proportion while the clock countUp runs; at the end the ring flashes `green` once. Not a loop: it is the spoken amount.

### A64 Chapter card
**Idea**: a major section change; the ONLY place for the `ding` SFX.
**Ref**: `frames/64-chapter-card.jpg`
**Anatomy**: big number 220 px 800 `mute` 30% ghost at left-of-centre, chapter title 96 px 800 ink centred, a thin 4 px `red` bar (width 160) under it.
**Motion**: number softIn (scale 1.1->1), title riseIn 6 f later, bar drawOn 10 f; hold 1.2 s; blurOut with drift. SFX `ding` at f0. Max 6 chapter cards per long-form video; none in Shorts.
