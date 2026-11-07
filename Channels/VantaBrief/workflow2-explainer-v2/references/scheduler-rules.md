# scheduler-rules.md (enforced by scripts/variety-lint.py)
1. Scene plan = JSON validated by schemas/scene-plan.schema.json. Each scene: id, start, end (s), narration, intent, intensity, assets, animations[{id, params}].
2. No animation ID repeats within 6 consecutive scenes. No ID more than 2x in a video < 6 min (3x for 6-12 min, 4x above).
3. No two consecutive scenes whose animations all share one category.
4. >= 15 distinct IDs in a ~4.5 min video (aim 20+). >= 5 scenes with intensity "hero". Exactly one CTA scene using A29.
5. Pacing: (scene seconds / number of animations in the scene) must be <= 3.5. Longer narration = chain 2+ animations in the scene (SceneVideo splits time evenly). Never hold one animation > 3.5 s.
6. Calm beats between hero beats; never two hero scenes in a row.
7. Named company/model -> scene must include its logo (A27 single, A28 group). Named product/site/benchmark/leaderboard -> A30 screenshot scene (or A25/A26 if numbers). Group "other closed-tier models" -> A28 with real logos.
8. DeepSeek (main subject) must appear in varied logo animations (A27, A28 highlight, A21 hub), never the same one twice.

## Intent -> candidate animations
| Intent | Use |
|---|---|
| title / topic intro | A01, A03, A04 |
| emphasize a phrase / word | A02, A08, A38 |
| punchline (3-7 words) | A05 |
| myth vs reality / correction | A06 |
| big number | A07 |
| several stats | A37, A33 (metric over time/variants) |
| compare two things | A09, A10, A11, A12, A56 (logos head to head), A31 (off/on) |
| list 2-4 criteria | A13, A34 |
| ordered steps | A14, A16, A17, A36 |
| many inputs -> one result | A15 |
| process / transformation | A18, A23, A19 |
| layers / architecture / internals | A20, A22 |
| one subject with attributes | A21, A55 (subject with other companies orbiting) |
| hierarchy / plan splits | A24 |
| compare values | A25 |
| trend with a moment | A26, A33 |
| main subject / channel intro | A27 |
| group of companies | A28, A55 |
| subscribe / CTA | A29 |
| website / product / leaderboard shown | A30, A57 (press coverage) |
| person / presenter / explainer character | A43, A46 |
| idea turning into a diagram | A44 |
| question and answer / dialogue | A47 |
| "many people / testers" | A45, A35 |
| single photo with annotation | A48 |
| sequence of moments as photos | A49 |
| warning / pitfall | A39 |
| signal / detection / alert | A32 |
| key sticker / ranking / "new" | A40, A42 |
| point at one thing | A41, A38 |
| camera move between nodes | A50 |
| transition between statements | A51, A53 |
| chapter change | A52 |
| enter a topic | A54 |
Missing a fit? Create a new catalog entry first (references/new-animation-template.md).
