VANTABRIEF

Visual Style Bible

Persistent production rules for Gemini 3.8 Flash + Antigravity + Remotion

REFERENCE-LED • STORY-DRIVEN • NO GENERIC TEMPLATE • NO HUMAN CHARACTERS

0. The most important instruction

This is a visual language, not a template.Every VantaBrief video should combine the same five animation approaches from the supplied reference, but the composition, pacing, and sequence must be designed for that specific narration. Do not reuse one fixed scene layout for every video.

Character rule — strict.Do not create human characters, stick figures, mascots, cartoon people, avatars, or anthropomorphic objects. The only permitted character-like exception is a logo-headed figure if the user explicitly requests it for a specific moment. It must use the actual supplied VantaBrief logo as its head; never invent a face or substitute a generic symbol. Default: no character at all.

This document is the source of truth for the VantaBrief channel’s visual direction. It is written for Gemini 3.8 Flash working inside Antigravity with Remotion. Apply it whenever a new voiceover/script is supplied and the user asks to build a video.

What the system must achieve

Keep a recognizable visual identity across uploads without making every upload look like the same template.

Use all five reference styles as a toolkit. Select styles according to the narrative job of each moment.

Reserve Style 5 — the clean technical motion-graphics language — primarily for concept explanations, systems, comparisons, mechanisms, timelines, data, and process logic.

Use real footage, real product/software interfaces, screenshots, documents, code, and sourced imagery whenever they are the most convincing evidence.

Never fabricate footage. When footage is unavailable, leave a clean placeholder with centered, concise instructions describing exactly what the editor should insert.

Preserve the supplied voiceover exactly unless the user explicitly asks for audio/script edits.

Prioritize readability, visual meaning, and rhythm over motion for motion’s sake.

1. How to use the supplied reference

The supplied reference video is the primary authority for the visual examples in this document. The contact sheet below samples frames from it at roughly five-second intervals. The timestamp labels are approximate navigation points, not a claim that every style begins or ends exactly there.

Reference contact sheet: supplied file “combination of styles i want for Vanta Brief.mp4”. Use it to locate examples, then inspect the original video around the timestamp before copying a technique. The contact sheet is a navigation aid, not a substitute for studying the actual motion.

Reference-analysis procedure

Watch the entire reference at normal speed once before implementing anything.

Watch it again while noting how each scene enters, what moves first, what remains still, and how the scene exits.

For each selected example, capture a clean screenshot at the moment the composition is easiest to understand.

Where motion itself matters, capture 3–5 frames from the same moment: beginning, middle, end, and any important transition.

Record what is genuinely visible. Do not infer hidden timing, software, source assets, or intent that the frame does not establish.

Use the supplied reference’s technique and visual grammar, not its exact jokes, subject matter, images, words, or sequence.

2. Five-style system overview

The five styles are complementary. They are not five mandatory sections and should not be forced into every video. A 20-second sequence may use two styles; a complex explanation may use Style 5 for most of its duration; an evidence-heavy section may remain in real screenshots for several beats.

Style

Primary job

Typical ingredients

Use when…

1. Kinetic typography

Emphasize a claim, punchline, contrast, or key phrase

Large type, deliberate line breaks, sharp reveals, scale and position changes

A few words carry the emotional or argumentative weight

2. Real evidence / screen-led

Prove, demonstrate, or ground a statement

Real UI, code, terminal, browser, documents, product footage, cropped screenshots

The audience should see the thing being discussed

3. Editorial collage / visual metaphor

Make an abstract idea instantly legible

Cutouts, objects, paper-like layers, arrows, cropped stills, simple compositing

A visual analogy clarifies a concept better than text alone

4. Graphic symbols / icon-led beats

Represent a simple action, category, or repeated unit

Minimal icons, simple non-human symbols, progress markers, small illustrative objects

A lightweight symbol is clearer than a full diagram

5. Technical motion graphics

Explain a mechanism or relationship step by step

Precise diagrams, nodes, boxes, connecting lines, timelines, numbers, bars, code/output comparisons

The viewer needs to understand how something works

3. Style 1 — Kinetic typography

Purpose: turn a phrase into a visual event. Text is not merely a subtitle pasted onto the screen; its scale, placement, reveal, and timing should reinforce the meaning of the spoken words.

What to reproduce from the reference

Use strong, high-contrast type on simple backgrounds when the words are the main event.

Let the key phrase arrive in a decisive way: cut, scale-in, mask reveal, short slide, or controlled stagger.

Use line breaks as part of the composition. Break phrases where the speaker naturally pauses or where the idea changes.

Emphasize only the meaningful word or number. Avoid making every word bounce, glow, shake, or change color.

Allow stillness after a strong reveal. A readable hold is part of the animation.

Use typography to create contrast: a short phrase can interrupt a busy sequence and reset attention.

Motion recipe

Start with the final composition in mind, not a preset animation.

Choose one primary motion: reveal, scale, position, rotation, or tracking. A secondary motion is allowed only if it supports the same action.

Use a brief anticipation only when it helps the reveal; avoid elastic overshoot by default.

Keep easing confident and restrained. Avoid generic spring/bounce behavior unless the reference clearly calls for it.

Hold long enough for an average viewer to read the full phrase once while listening.

Exit with a cut, a directional move, a mask, or a purposeful handoff to the next visual.

Do not

Do not turn the whole voiceover into word-by-word karaoke captions.

Do not animate every element simultaneously.

Do not use random letter scrambling, glitch, neon glow, or particles as default decoration.

Do not invent new brand colors for emphasis. Use only the established palette and neutral values.

Do not place important text so close to the edge that it is cropped on mobile.

4. Style 2 — Real evidence, screen-led visuals, and footage

Purpose: show the actual thing being discussed. This is the trust-building style. Prefer authentic interfaces, products, screenshots, terminal output, real documents, and relevant footage over decorative illustrations.

Evidence hierarchy

First choice: real captured footage or a real screen recording of the exact tool/product/action being discussed.

Second choice: a verified screenshot or official product image that genuinely shows the claim.

Third choice: a clearly labeled illustrative reconstruction, only if a real capture is unavailable and the reconstruction cannot be mistaken for evidence.

Last resort: a footage placeholder. Do not silently replace a missing real-world visual with generic stock footage.

Screen recording treatment

Crop to the relevant interface region; keep enough surrounding context that the audience knows what application/page they are seeing.

Use a subtle zoom or pan only to direct attention to a real control, result, line of code, setting, price, or visual detail.

Use a highlight rectangle, cursor, underline, or small callout only when it clarifies the target. Do not cover the evidence.

Avoid fake UI labels, fabricated metrics, invented product features, or fake comments that look authentic.

If a claim depends on a particular result, show the result—not an unrelated interface that merely looks technical.

For code, make the relevant lines readable and visually isolate them. Never show a wall of tiny code as decoration.

Footage placeholder standard

Required placeholder compositionUse a clean dark/neutral scene with one centered text block. Label it clearly as FOOTAGE NEEDED. Under that, describe the shot precisely, e.g. “Screen recording: open the model settings page and select local inference.” Optional second line: source/asset needed. Do not generate fake footage, fake screenshots, a random stock clip, or a busy animated placeholder.

Placeholder text should be an editor instruction, not part of the final audience-facing video. Make it obvious in the rendered draft so the editor can replace it. Keep the placeholder static or use only a restrained fade; it should not masquerade as a finished scene.

Recommended exact layout:

FOOTAGE NEEDED

Screen recording: [specific action or view]

Optional: [source, URL, product version, or framing requirement]

If the build system supports a separate review render, placeholders should remain visible in that review render and be listed in a missing-footage report. Do not accidentally ship a final export with placeholders without warning.

5. Style 3 — Editorial collage and visual metaphor

Purpose: convert an idea into a fast, memorable image by combining real cutouts, screenshots, paper/document imagery, objects, and deliberate composition. This is not permission to insert random stock art.

Composition rules

Choose one central metaphor that maps directly to the narration.

Use two to four meaningful visual elements by default; add more only when their relationships are clear.

Establish a visual hierarchy: primary object, supporting evidence, then a small label if needed.

Overlap layers with intent. A foreground cutout may interrupt a background screenshot, but the audience should still understand the subject.

Use shadows, masks, parallax, or slight depth only to separate layers—not to make a flat scene look artificially 3D.

Keep collage motion directional. Objects should enter from plausible directions, settle, and support the next beat.

Prefer real documents, real product imagery, and accurate screenshots when the metaphor references a real thing.

Allowed visual metaphors

A subscription cost represented as repeated invoices stacking up over time.

A locked gate representing a restricted feature, provided the metaphor does not imply a false technical limitation.

A set of independent tools being connected into a workflow.

A large complex object separated into clearly labeled components.

A document, receipt, code snippet, or product screenshot placed in a physical/editorial composition.

Not allowed

No people, stick figures, cartoon humans, mascots, human-like robots, faces, or expressive anthropomorphic objects.

No generic AI-generated character scenes as filler.

No collage where the viewer cannot tell what the narration is referring to.

No decorative objects that introduce a factual implication the script does not support.

6. Style 4 — Graphic symbols and icon-led beats

Purpose: communicate a simple action, state, category, quantity, or repeated unit with a restrained symbol. This style should feel like the reference’s simple graphic language, not like a generic icon pack pasted into every scene.

Use it for

A short sequence of steps or states.

A small number of categories that need quick differentiation.

A count, progress indicator, or simple before/after contrast.

A conceptual beat that needs a symbol but not a full system diagram.

A transition between evidence footage and a more detailed technical explanation.

Icon rules

Use simple geometry, consistent stroke weights, and a small family of visual symbols.

Keep icons non-human. Do not turn them into characters with eyes, mouths, limbs, or emotions.

Do not use emoji as the default icon system.

Avoid mixing detailed 3D icons, glossy app icons, hand-drawn symbols, and thin technical line icons in the same composition unless the reference specifically uses that contrast.

A symbol must have a clear relationship to the narration. If it is not understandable, label it or use a real screenshot instead.

Use motion to clarify state changes: appear, connect, fill, turn on, move to a new position, or disappear.

7. Style 5 — Technical motion graphics (priority style for explanations)

Special ruleWhen explaining how something works, how components relate, why a comparison matters, how a process unfolds, or how a number changes, use this style first. This is the reference’s clean technical diagram language. Do not apply it indiscriminately to hooks, jokes, footage, or every sentence.

Purpose: make an invisible mechanism visible. This style should feel precise, intentional, and easy to follow: dark negative space, crisp boxes and lines, restrained accents, clear labels, measured reveals, and a single logical progression.

Visual grammar

Use a dark charcoal/near-black background when consistent with the channel palette and the reference example.

Draw components as simple outlined boxes, nodes, timelines, bars, connectors, code panels, labels, and compact data readouts.

Build the explanation progressively. The audience should see the cause before the effect, the input before the output, or the first step before the next step.

Keep connectors attached to the objects they explain. Avoid lines that pass through labels or seem to connect unrelated elements.

Use consistent corner radii, stroke weights, padding, label alignment, and spacing within a scene.

Prefer a few legible objects over a dense dashboard. Empty space is a functional part of the composition.

Use a small set of accent colors from the established VantaBrief palette. Color must encode meaning consistently, not decorate the screen.

Use numeric labels only when they are supported by the script or verified research. Never invent data to make the graphic feel complete.

Recommended explanatory sequence

Orient: establish the main object or system in a stable position.

Introduce: reveal the first component or input.

Connect: draw the relationship or process line.

Transform: animate the state change, transfer, calculation, or comparison.

Resolve: reveal the outcome, conclusion, or key contrast.

Hold: leave the complete system on screen long enough to understand it.

Transition: remove, collapse, or hand off the graphic to the next style.

Motion principles

Lines should draw along their actual path and appear to connect to the correct anchors.

Boxes and nodes should enter in a logical reading order, usually following narration.

Numbers may count or update only when the underlying meaning is clear and supported.

Bars should grow from a consistent baseline. Comparisons must share the same scale unless the visual explicitly explains otherwise.

A timeline should reveal events in temporal order and use consistent spacing when spacing represents time.

A code panel should reveal the relevant line or output in a controlled way. Do not animate fake typing for an extended time unless typing itself matters.

Use a brief accent pulse only to call attention to a change. Avoid constant pulsing, spinning, floating, and looping.

The final explanatory state should be cleaner and easier to understand than the build-up.

Technical motion-graphics anti-patterns

Do not turn every sentence into the same boxes-and-lines layout.

Do not make decorative HUDs, fake terminal panels, random numbers, or fake charts.

Do not add a graph if the voiceover has no quantitative comparison to communicate.

Do not use arrows whose direction or meaning is ambiguous.

Do not animate more than one important relationship at a time when the explanation is complex.

Do not shrink labels to fit an overstuffed layout. Simplify the graphic instead.

Do not change accent colors arbitrarily between scenes.

Do not use Style 5 as a substitute for showing the actual product when the product can be shown.

8. Logo-headed figure exception

The channel should have no character system. Do not create a recurring host avatar, stick figure, mascot, or cartoon person. The only permitted exception is a logo-headed figure, and only when the user explicitly wants it for a particular beat.

Use the actual VantaBrief logo asset as the head; do not redraw, approximate, or invent a new logo.

The body, if used, must be extremely simple and secondary. It must not have a separate face or human-like expression.

Do not give it dialogue bubbles, facial emotions, or personality-driven acting unless the user explicitly requests those elements.

Do not make the figure the default narrator or place it in every video.

If the logo asset is unavailable, do not create the figure. Use typography, an object, a diagram, or a placeholder instead.

9. Brand consistency and color restrictions

The animation techniques can vary, but the channel palette must not drift. Do not add a new color because a particular scene feels empty or because a generated design looks better with another hue.

Role

Color

Rule

Core dark

#231F20

Primary dark background / brand anchor

Warm light

#FAF4D9

Primary light text or surface

Electric blue

#1677FF

Primary active/technical accent

Amber

#F59E0B

Secondary emphasis, warning, or selected metric

Crimson

#EF4444

Negative state or risk when meaning supports it

Emerald

#10B981

Positive state or success when meaning supports it

Neutral values

Black / white / grays

Allowed for contrast and interface realism; not a new accent palette

Color semantics should remain consistent inside a video. For example, if blue represents a local process and amber represents an external service in a diagram, do not reverse those meanings two scenes later without a clear reason.

When showing authentic software, screenshots, footage, or product UI, preserve their real colors where necessary for truthfulness. Do not recolor a real interface to force it into the brand palette. Use the VantaBrief palette for framing, labels, overlays, and surrounding graphics.

10. Typography, layout, and readability

Use a compact, consistent type system: one primary display family and one highly readable supporting family, unless the existing project already defines approved fonts.

Large statements should be short. Split a long sentence across scenes instead of shrinking it into tiny text.

Keep explanatory labels close to the component they describe.

Respect safe margins for 16:9 video and mobile viewing. Do not place critical text against the frame edge.

Maintain strong contrast. If a label cannot be read in a contact sheet thumbnail, test whether it is too small or too low-contrast at full playback.

Do not show every spoken word as text. Show the claim, contrast, number, term, or relationship that helps the audience follow the narration.

Use consistent alignment and spacing within a composition; break the grid intentionally only when it improves the story.

Do not center every composition by default. Use centered layouts for impact and placeholders; use left/right alignment when it supports hierarchy or comparison.

11. How the five styles should combine

The goal is a coherent rhythm, not a rigid rotation. Choose the style that best serves the narrative beat.

Narrative beat

Preferred style(s)

Reason

Hook / surprising claim

1 + 2

Typography creates impact; real evidence earns attention.

Show a product, website, tool, or result

2

Authenticity is more persuasive than an invented graphic.

Explain a process or architecture

5, then 2 if a real demo exists

Diagram the mechanism, then ground it in the real product.

Explain a simple idea quickly

3 or 4

A visual metaphor or symbol may communicate faster than a complex diagram.

Compare options, prices, performance, or trade-offs

5 + 2

Use accurate data/relationships, then show sources or real interfaces where possible.

Punchline / rhetorical reversal

1 or 3

A sharp phrase or unexpected visual composition can create contrast.

Sequence of steps

4 or 5

Use icons for simple stages; use a diagram when relationships matter.

Transition to a new chapter

1, 3, or a purposeful cut

Reset attention without using a generic transition on every cut.

Missing real footage

Placeholder

Clearly tells the editor what to capture instead of pretending the footage exists.

A sample rhythm (not a fixed template)

Start with a bold statement or a surprising real image.

Show the real evidence, interface, product, or example behind the claim.

If the concept is abstract, use a short visual metaphor to make it intuitive.

When the viewer needs to understand the mechanism, switch to Style 5 and build the explanation step by step.

Return to real evidence, a concise text beat, or a collage to give the viewer a change of visual texture.

Use the style best suited to the next sentence. Do not follow this sequence mechanically.

12. Voiceover-to-scene planning

Before writing Remotion components, create a narration map. Every scene should have a reason to exist.

Split the voiceover into thought units, not arbitrary equal-length blocks.

Identify the job of each unit: hook, claim, evidence, explanation, comparison, example, consequence, joke, transition, or conclusion.

Mark which facts need real proof, screenshots, or footage.

Mark which concepts are abstract and require Style 3, 4, or 5.

Choose one primary style per scene. A secondary style may be layered in when it helps, but avoid a cluttered blend of all five.

Identify every asset that must be supplied by the user or captured externally.

Keep scene duration driven by speech and comprehension. Do not cut away before the viewer can read a key label or understand a relationship.

Preserve the voiceover wording, order, and audio timing unless the user authorizes changes.

13. Footage and asset manifest

The workflow must produce a manifest of every external asset needed. For each item, record: scene ID, timestamp range, narration excerpt, asset type, exact shot/request, source URL or capture instruction if known, status, and replacement notes.

Field

Example

Rule

Asset type

Screen recording / product footage / archival image

Be specific.

Shot instruction

Show the settings page, then enable local mode

Write for an editor who has not read the script.

Status

Available / Needs capture / Needs source verification

Never label an asset verified merely because a filename exists.

Source

Official URL or user-provided asset path

Do not invent links or claim a source was checked when it was not.

Fallback

Centered FOOTAGE NEEDED placeholder

Keep it visible in the review render until replaced.

14. Gemini 3.8 Flash + Antigravity + Remotion workflow

These instructions are specifically intended for the user’s current setup. Gemini should act as a careful implementer inside the existing repository, not as a free-form designer that improvises new visual rules every run.

Persistent channel-level integration

Find the existing VantaBrief project and its current Remotion entry point before editing files.

Read existing project instructions, package scripts, design tokens, scene manifests, and any current workflow documentation.

Store this Visual Style Bible in a permanent channel-level location that the build workflow reads every time. Do not keep it only in the current prompt or only in a one-off video folder.

Add a short pointer to the style bible in the highest-level project instruction file that Gemini/Antigravity actually reads. Verify that the agent’s normal workflow loads it.

If the repository uses a video-specific folder, keep project assets and scene manifests there while the channel-wide style rules remain shared.

Do not overwrite unrelated projects, folders, scripts, or previous video versions.

If there are multiple instruction systems, document which file is authoritative and avoid contradictory duplicate rules.

Recommended build stages

Stage A — Inspect: read the style bible, inspect the repo, inspect the voiceover, and inventory available assets.

Stage B — Plan: create a timestamped scene manifest with narration, purpose, primary style, visual description, animation beats, evidence requirements, and placeholder requirements.

Stage C — Review: produce a storyboard/contact sheet before full implementation. Check for character violations, repeated layouts, palette drift, unsupported claims, and poor visual variety.

Stage D — Build: implement scenes in Remotion using reusable primitives where useful, but not reusable fixed compositions that force every scene into the same layout.

Stage E — Render review: render a draft with missing-footage placeholders intact. Produce a contact sheet and a list of unresolved assets.

Stage F — QA: inspect the actual rendered frames and playback, not just the code or a statement that the render succeeded.

Stage G — Finalize: export the requested version, retain a prior version, and report the render path, missing assets, warnings, and checks performed.

15. Scene manifest requirements

Use a structured scene manifest (JSON or the repository’s established format). At minimum, each scene should contain:

scene_id and start/end time or frame range

exact voiceover excerpt or stable reference to the audio timeline

narrative purpose

primary style (1–5) and optional secondary style

what the viewer should understand by the end of the scene

visual composition in plain language

ordered animation beats, including entrance, main action, hold, and exit

assets required and their verification status

exact placeholder text if footage is missing

text content and data source for every factual number or chart

transition intent

QA notes: readability, safe margins, color semantics, and character-rule compliance

16. Remotion implementation principles

Use deterministic frame-based animation. The same input and frame should render the same result.

Use the repository’s existing conventions and compatible Remotion APIs. Inspect package versions before introducing a new dependency.

Build small reusable primitives (text reveal, line draw, node, label, image crop, highlight box, placeholder), but compose them differently for each story.

Avoid building a universal SceneTemplate that forces every scene into the same title/subtitle/three-card structure.

Keep voiceover timing and visual timing linked to the scene manifest or audio timeline rather than hardcoding arbitrary durations throughout many files.

Use actual assets and transparent backgrounds where appropriate. Preserve source aspect ratios unless a crop is intentional.

Make the footage placeholder a first-class scene type, so it cannot accidentally disappear from the review render.

If an animation requires a complicated effect, prefer a clear simpler implementation over a fragile effect that is difficult to QA.

Do not add external fonts, packages, assets, or services without checking whether they already exist and whether the project can render offline.

17. Factual and editorial integrity

Never invent product features, benchmarks, prices, release dates, user quotes, UI states, or statistics.

Distinguish confirmed facts from estimates, metaphors, hypothetical examples, and illustrative coverage.

If a number appears on screen, track its source in the scene manifest or research notes.

Do not use a metaphor in a way that viewers could mistake for literal data.

Do not let the motion graphic imply a stronger claim than the narration supports.

If a claim cannot be verified from supplied material, flag it for review instead of silently polishing it into certainty.

Use real screenshots as evidence only when they actually support the sentence being narrated.

18. Quality-control checklist

☐ The style bible was loaded from the persistent VantaBrief workflow.

☐ No human characters, stick figures, mascots, generic avatars, or anthropomorphic objects appear.

☐ Any logo-headed figure is explicitly requested and uses the actual supplied logo.

☐ The five styles are used according to narrative purpose, not forced into a fixed rotation.

☐ Style 5 is primarily reserved for explanations, systems, comparisons, and process logic.

☐ The video does not use one repeated template for every scene.

☐ Only the approved palette is used for authored graphics.

☐ Real interfaces, product imagery, screenshots, and footage remain truthful.

☐ No fabricated UI, data, or visual evidence appears.

☐ Every missing external shot has a centered FOOTAGE NEEDED placeholder in the review render.

☐ Every placeholder is listed in the asset manifest.

☐ Typography is readable on a full-screen frame and in a contact sheet.

☐ Technical diagrams have a clear reading order, correct connectors, and enough hold time.

☐ Motion has a purpose; there is no constant floating, pulsing, or decorative movement.

☐ Voiceover wording, order, and audio are preserved unless changes were requested.

☐ The actual render was inspected; the report does not rely only on code review.

☐ The final response reports unresolved footage, factual questions, and known render limitations.

19. Failure conditions — stop and fix before final export

Any human/character-like figure appears without explicit approval.

The scene introduces an unapproved accent color.

A diagram is visually attractive but does not accurately explain the narration.

A screenshot or footage clip is fabricated or presented as real evidence.

A missing footage placeholder is removed without the real asset being supplied.

The same composition is repeated across scenes merely because it is easy to code.

Text is unreadable, clipped, too dense, or too brief to understand.

The video changes the supplied voiceover or adds unapproved sound/audio.

The render was not inspected at all.

A file or project outside the VantaBrief task is modified unexpectedly.

20. Copy-paste master instruction for Gemini

Use this as the persistent workflow promptYou are building videos for VantaBrief in Antigravity using Remotion. Before each build, load and follow the VantaBrief Visual Style Bible. Treat the supplied reference video and its screenshots as the authority for animation technique. The goal is a consistent visual language, not a template. Use the five styles according to the narrative purpose of each beat. Use Style 5 primarily for explaining concepts, systems, comparisons, mechanisms, data, and processes. Use real footage and authentic screen captures when they provide evidence. If footage is missing, show a centered FOOTAGE NEEDED placeholder with an exact shot instruction and list it in the asset manifest. Never fabricate footage or screenshots. Never add human characters, stick figures, mascots, avatars, or anthropomorphic objects. The only exception is a logo-headed figure explicitly requested for that specific video, using the actual supplied VantaBrief logo. Do not invent or add colors outside the approved palette. Do not force scenes into one repeated layout. Preserve the supplied voiceover exactly. First inspect the repository, then plan scenes, show a storyboard/contact sheet, build, render a review version, inspect the actual frames, fix issues, and report missing assets and unresolved claims. Do not claim an asset or result is verified unless you actually checked it.

21. Reference screenshot pack — what to capture next

The included contact sheet gives a broad overview of the supplied video. For better reproduction, create a curated screenshot pack from the original video. The strongest pack is not dozens of random stills; it is a small set of examples that demonstrate each style clearly.

Screenshot group

Capture

What Gemini should learn

A. Typography

2–4 frames of one text reveal, including start and final hold

Scale, line breaks, timing, hierarchy, contrast

B. Real evidence

A screen recording or screenshot with a visible focus target

Authentic evidence, crop, highlight, and camera movement

C. Collage

One frame with layered real imagery / paper / cutouts

Layering, overlap, visual metaphor, negative space

D. Symbols

One simple symbol-led explanation with no character

Stroke, simplicity, semantic meaning, restrained motion

E. Technical diagrams

3–5 consecutive frames of one diagram building and resolving

Order of reveal, connectors, data hierarchy, final explanatory state

F. Transition

Frames immediately before and after a style change

How the visual handoff preserves rhythm without a generic transition

G. Placeholder example

A sample centered FOOTAGE NEEDED slate

How missing footage should appear in a review render

22. Final principle

The channel should feel like the same thoughtful editor made every video, not like the same template generated every video. Keep the visual grammar, palette, restraint, and animation quality consistent. Let the composition, evidence, metaphor, and timing change to serve each specific idea. No characters by default. Real evidence when possible. Technical motion graphics when they genuinely explain. Clear placeholders when footage is missing.

End of Visual Style Bible.