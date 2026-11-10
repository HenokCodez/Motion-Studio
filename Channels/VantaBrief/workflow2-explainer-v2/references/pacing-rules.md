# pacing-rules.md (v2.1 extension; adds to scheduler-rules.md, replaces nothing)
Problem fixed: animations ran at their own speed and finished before the narrator had explained the idea.
1. **Cut on the narration.** Scene boundaries fall on sentence/clause ends of the timestamped script, never mid-sentence. Minimum scene 2.5 s (transition scenes 1.2 s). Each animation slot >= 1.8 s. `v21-lint.py` enforces this.
2. **Sync the reveal to the words.** For every scene find the timestamp where the narrator first says the thing the animation shows. Set `"delay": <that time - scene.start>` (seconds) on that animation. The first stroke must start when the word is spoken, not before.
3. **Auto-stretch.** `plan.pacing` defaults to `"auto"`: SceneVideo slows each animation so it finishes at ~75% of its slot (min speed 0.45x) and holds the finished picture for the rest. Set `"pacing": "legacy"` only to reproduce a v2.0 render. A per-animation `"speed"` (<= 1) overrides auto; never above 1.
4. **Read time.** Text-heavy scenes (lists, cards with bullets) need >= 0.35 s per word shown after the animation has finished building. Budget it: slot >= build time + 0.35 s x words.
5. **One new idea per scene.** If the narration introduces two things, use two animations in the scene (`animations` array) with the second having a `delay`.
6. **Finished-state hold:** the complete picture must be visible >= 1.0 s before the cut (auto-stretch gives this).
7. **No dead air:** no empty or near-empty frame for >= 1.5 s, and the video never ends on an empty frame (`frame-audit.py`).
Example scene: narration "Inference cost fell to pennies" 00:12.0-00:16.5, the word "pennies" spoken at 00:14.1 -> `{"id":"s05","start":12,"end":16.5,"animations":[{"id":"A02","params":{...},"delay":2.1}]}`.
