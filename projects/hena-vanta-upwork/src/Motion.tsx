import { Easing, interpolate } from "remotion";
import type React from "react";
import { MOTION, timeToFrame } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeOut = Easing.out(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.cubic);

/** softIn: THE text/media entrance. Opacity 0->1 (0.35 s) with a 20 px rise, ease-out. Red words are red from the first frame. */
export const softIn = (frame: number, fps: number, atSec: number): React.CSSProperties => {
  const f = frame - timeToFrame(atSec, fps);
  const d = MOTION.softInSec * fps;
  return {
    opacity: interpolate(f, [0, d], [0, 1], { ...clamp, easing: easeOut }),
    transform: `translateY(${interpolate(f, [0, d * 1.15], [MOTION.softRisePx, 0], { ...clamp, easing: easeOut })}px)`,
  };
};
export const visible = (frame: number, fps: number, atSec: number) => frame >= timeToFrame(atSec, fps) - 1;
export const progress = (frame: number, fps: number, atSec: number, durSec: number, ease = easeInOut) =>
  interpolate(frame - timeToFrame(atSec, fps), [0, durSec * fps], [0, 1], { ...clamp, easing: ease });
export const countValue = (frame: number, fps: number, atSec: number, from: number, to: number, durSec = MOTION.countUpSec) =>
  from + (to - from) * progress(frame, fps, atSec, durSec, easeOut);
