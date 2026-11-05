import React from "react";
import { interpolate } from "remotion";
import { RichText } from "./RichText";
import { easeOut, progress, softIn, visible } from "./Motion";
import { MOTION, TIER } from "./theme";
import type { Ctx } from "./Stack";
import type { Scene } from "./types";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** STEPS: 2-5 boxes in one centred row. Revealed one by one on their spoken cue (connector draws, border draws, text fades in). No camera moves. */
export const StepsView: React.FC<{ scene: Scene; c: Ctx }> = ({ scene, c }) => {
  const st = scene.steps; if (!st) return null;
  const { W, H, fps, frame } = c; const t = frame / fps; const items = st.items; const N = items.length;
  const heading = typeof st.heading === "string" ? { text: st.heading, atSec: 0 } : st.heading;
  const gap = W * 0.035, bw = (W * 0.88 - (N - 1) * gap) / N, bh = H * 0.22, by = H * 0.52 - bh / 2;
  const bx = (i: number) => W * 0.06 + i * (bw + gap);
  const active = items.reduce((a, it, i) => (t >= it.atSec ? i : a), -1);
  const fs = N >= 5 ? TIER.xs : N >= 4 ? 36 : TIER.s;
  return (
    <>
      {heading && <div style={{ position: "absolute", left: 0, width: W, top: H * 0.15, transform: "translateY(-50%)", display: "flex", justifyContent: "center", zIndex: 2, ...softIn(frame, fps, heading.atSec ?? 0) }}><RichText text={heading.text} fontSize={TIER.m} bold color={c.col} redColor={c.red} /></div>}
      <svg style={{ position: "absolute", left: 0, top: 0, width: W, height: H, zIndex: 1, overflow: "visible" }}>
        {items.map((it, i) => {
          const draw = progress(frame, fps, it.atSec, MOTION.stepBorderSec, easeOut);
          const isActive = i === active;
          return (
            <g key={i}>
              <rect x={bx(i)} y={by} width={bw} height={bh} rx={22} fill="none" stroke={isActive ? c.red : c.col} strokeWidth={isActive ? 9 : 6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
              {i > 0 && (() => { const a = bx(i - 1) + bw, b = bx(i); const p = interpolate(t, [it.atSec - MOTION.stepConnectorSec, it.atSec], [0, 1], clamp); return <line x1={a} y1={by + bh / 2} x2={a + (b - a) * p} y2={by + bh / 2} stroke={c.col} strokeWidth={6} strokeLinecap="round" />; })()}
            </g>
          );
        })}
      </svg>
      {items.map((it, i) => !visible(frame, fps, it.atSec) ? null : (
        <React.Fragment key={i}>
          <div style={{ position: "absolute", left: bx(i), width: bw, top: by - 52, display: "flex", justifyContent: "center", zIndex: 2, ...softIn(frame, fps, it.atSec + 0.05) }}><RichText text={`Step ${i + 1}`} fontSize={TIER.s} bold color={c.col} redColor={c.red} /></div>
          <div style={{ position: "absolute", left: bx(i) + 16, width: bw - 32, top: by, height: bh, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, ...softIn(frame, fps, it.atSec + 0.15) }}><RichText text={it.text} fontSize={fs} bold color={c.col} redColor={c.red} /></div>
        </React.Fragment>
      ))}
    </>
  );
};
