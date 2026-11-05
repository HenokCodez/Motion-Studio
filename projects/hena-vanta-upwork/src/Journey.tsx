import React from "react";
import { interpolate } from "remotion";
import { RichText } from "./RichText";
import { easeInOut, progress, softIn, visible } from "./Motion";
import { MOTION, TIER } from "./theme";
import type { Ctx } from "./Stack";
import type { JourneyEvent, Scene } from "./types";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Event x positions (px). The SAME geometry is used in every JOURNEY scene of the video, so the timeline looks like one continuous object. */
export const journeyXs = (events: JourneyEvent[], W: number): number[] => {
  const x0 = W * 0.12, x1 = W * 0.88, N = events.length;
  const even = events.map((_, i) => (N === 1 ? W / 2 : x0 + (i * (x1 - x0)) / (N - 1)));
  if (N > 1 && events.every((e) => e.date && !Number.isNaN(Date.parse(e.date)))) {
    const d = events.map((e) => Date.parse(e.date!)); const span = d[N - 1] - d[0];
    const prop = d.map((v) => x0 + ((v - d[0]) / Math.max(1, span)) * (x1 - x0));
    if (span > 0 && prop.every((v, i) => i === 0 || v - prop[i - 1] >= W * 0.1)) return prop;
  }
  return even;
};

/**
 * JOURNEY scene = one step of the story told on the single master timeline (meta.journey).
 * Only events up to `focus` exist yet; later events are NOT shown (they are revealed by later scenes).
 * With `from`, the line and events up to `from` are already on screen at frame 0 and the line extends to `focus` (continuity).
 */
export const JourneyView: React.FC<{ scene: Scene; events: JourneyEvent[]; title?: string; c: Ctx }> = ({ scene, events, title, c }) => {
  const j = scene.journey; if (!j) return null;
  const { W, H, fps, frame } = c; const t = frame / fps;
  const xs = journeyXs(events, W);
  const fi = events.findIndex((e) => e.id === j.focus);
  const pi = j.from ? events.findIndex((e) => e.id === j.from) : -1;
  if (fi < 0) return null;
  const lineY = H * 0.52, startX = W * 0.09;
  const reveal = j.revealSec ?? MOTION.lineDrawSec;
  const lineDur = Math.min(MOTION.lineDrawSec, Math.max(0.4, reveal));       // the line arrives exactly when the label appears
  const p = progress(frame, fps, 0, lineDur, easeInOut);
  const fromX = pi >= 0 ? xs[pi] : startX;
  const lineX = fromX + (xs[fi] - fromX) * p;
  const tick = (i: number) => i <= pi || lineX >= xs[i] - 2;      // earlier events already exist; new ones appear as the line reaches them
  return (
    <>
      {title && <div style={{ position: "absolute", left: 0, width: W, top: H * 0.09, transform: "translateY(-50%)", display: "flex", justifyContent: "center", zIndex: 2 }}><RichText text={title} fontSize={TIER.m} bold color={c.col} redColor={c.red} /></div>}
      <svg style={{ position: "absolute", left: 0, top: 0, width: W, height: H, zIndex: 1 }}>
        <line x1={startX} y1={lineY} x2={Math.max(startX, lineX)} y2={lineY} stroke={c.col} strokeWidth={6} strokeLinecap="round" />
        {events.map((e, i) => i <= fi && tick(i) && <line key={e.id} x1={xs[i]} x2={xs[i]} y1={lineY - (i === fi ? 40 : 28)} y2={lineY + (i === fi ? 40 : 28)} stroke={i === fi && t >= reveal ? c.red : c.col} strokeWidth={i === fi ? 8 : 6} strokeLinecap="round" />)}
      </svg>
      {events.map((e, i) => {
        if (i > fi || !tick(i)) return null;
        const isFocus = i === fi;
        const shown = isFocus ? visible(frame, fps, reveal) : true;
        if (!shown) return null;
        const half = isFocus ? W * 0.12 : W * 0.07;
        const cx = Math.min(W * 0.88, Math.max(W * 0.12, xs[i]));
        const labelW = half * 2;
        const labelLeft = Math.max(W * 0.05, Math.min(W * 0.95 - labelW, cx - half));
        const st = isFocus ? softIn(frame, fps, reveal) : (i > pi ? softIn(frame, fps, (xs[i] - fromX) / (xs[fi] - fromX || 1) * lineDur) : {});
        const noteW = W * 0.26;
        const noteLeft = Math.max(W * 0.05, Math.min(W * 0.95 - noteW, cx - noteW / 2));
        return (
          <React.Fragment key={e.id}>
            <div style={{ position: "absolute", left: labelLeft, width: labelW, top: lineY - (isFocus ? 118 : 86), display: "flex", justifyContent: "center", zIndex: 2, ...st }}>
              <RichText text={isFocus ? `**${e.label}**` : e.label} fontSize={isFocus ? TIER.m : TIER.s} bold color={isFocus ? c.col : c.gray} redColor={c.red} />
            </div>
            {isFocus && <div style={{ position: "absolute", left: noteLeft, width: noteW, top: lineY + 62, display: "flex", justifyContent: "center", zIndex: 2, ...softIn(frame, fps, reveal + 0.2) }}>
              <RichText text={e.note} fontSize={TIER.s} bold={false} color={c.col} redColor={c.red} maxWidth={noteW} />
            </div>}
          </React.Fragment>
        );
      })}
    </>
  );
};
export const _clamp = clamp; export const _i = interpolate;
