import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface CountUpProps {
  startFrame?: number;
  from?: number;
  to: number;
  prefix?: string;
  suffix?: string;
  durationFrames?: number;
  color?: string;
  fontSize?: number;
}

export const CountUp: React.FC<CountUpProps> = ({
  startFrame = 0,
  from = 0,
  to,
  prefix = "",
  suffix = "",
  durationFrames = 25,
  color = "#FF6B35",
  fontSize = 110,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - startFrame);

  const currentVal = Math.round(
    interpolate(relFrame, [0, durationFrames], [from, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Tiny scale pulse upon completion (1 -> 1.08 -> 1)
  const pulseSpring = spring({
    frame: Math.max(0, relFrame - durationFrames),
    fps,
    config: { damping: 10, stiffness: 220, mass: 0.5 },
  });

  const pulseScale = interpolate(pulseSpring, [0, 0.5, 1], [1, 1.08, 1]);

  return (
    <div
      style={{
        display: "inline-block",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 900,
        fontSize: `${fontSize}px`,
        color,
        transform: `scale(${pulseScale})`,
        letterSpacing: "-0.04em",
      }}
    >
      {prefix}
      {currentVal.toLocaleString()}
      {suffix}
    </div>
  );
};
