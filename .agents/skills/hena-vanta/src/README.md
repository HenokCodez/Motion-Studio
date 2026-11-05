# Remotion starter (v6)

Copy `src/` into your Remotion project (`src/hv/`). Put the supplied background at `public/bg.mp4`. Install the font with
`npx remotion add @remotion/google-fonts` and load Inter (weights 400–800, italic) once in `Root.tsx`.

Status: written against Remotion 4.x (`useCurrentFrame`, `interpolate`, `spring`, `Easing`, `Video loop muted`). It was
type-checked in isolation only (syntax + internal types), NOT compiled against the real Remotion typings. Run `npx tsc --noEmit`
once in your project and fix any import-level differences (e.g. `Video` -> `Html5Video` in the newest Remotion).

Typical scene:

```tsx
<Sequence from={sec(2.4)} durationInFrames={sec(2.8)}>
  <Scene duration={sec(2.8)} seed={3}>
    <WordSync mode="stack" words={[
      {text: 'killer', frame: 0}, {text: 'ideas', frame: 8},
      {text: 'is', frame: 20, line: 1}, {text: 'all', frame: 26, line: 1},
      {text: 'you', frame: 31, line: 1}, {text: 'need', frame: 36, line: 1, color: HV.red},
    ]} />
  </Scene>
</Sequence>
```
Footage slot (outside `<Scene>` so it never drifts):
```tsx
<Sequence from={sec(30)} durationInFrames={sec(5)}><FootageNote label="SCREEN REC: Upwork proposal being sent" /></Sequence>
```
Component -> catalog map: WordSync A02 A05 A01(ticker) · Bubble A06 A07 · StatPill A03 A55 · Pill A30 A31 A54 A59 · ListCards A08 A09 ·
Window A11 A12 A14 A27 A32 · Cursor A10 A17 A19 A22 A26 A28 A30 · Beam A04 · Venn A39 · Journey A53 · FootageNote A52.
All other animations are compositions of these plus `softIn/riseIn/slideIn/drawOn` from `motion.ts`, following the catalog entry.
