import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export interface MarkerProps {
  startFrame?: number;
  children: React.ReactNode;
  color?: string;
  durationFrames?: number;
}

export const Marker: React.FC<MarkerProps> = ({
  startFrame = 0,
  children,
  color = "#FF6B35",
  durationFrames = 12,
}) => {
  const frame = useCurrentFrame();
  const relFrame = Math.max(0, frame - startFrame);

  // Marker wipe left-to-right over 10-12 frames
  const wipe = interpolate(relFrame, [0, durationFrames], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        padding: "0 6px",
      }}
    >
      {/* Marker wipe layer behind text */}
      <span
        style={{
          position: "absolute",
          left: 0,
          bottom: "12%",
          height: "75%",
          width: `${wipe}%`,
          background: color,
          opacity: 0.85,
          borderRadius: "4px",
          transform: "rotate(-0.8deg)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <span style={{ position: "relative", zIndex: 1, color: wipe > 50 ? "#FFFFFF" : "inherit" }}>
        {children}
      </span>
    </span>
  );
};
