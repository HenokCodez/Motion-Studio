import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface SketchArrowProps {
  startFrame?: number;
  d: string;
  headX: number;
  headY: number;
  angleDeg?: number;
  color?: string;
  length?: number;
  important?: boolean;
}

export const SketchArrow: React.FC<SketchArrowProps> = ({
  startFrame = 0,
  d,
  headX,
  headY,
  angleDeg = 0,
  color,
  length = 350,
  important = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - startFrame);

  // Arrow draws over 14 frames
  const drawProgress = interpolate(relFrame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Arrowhead pops after the shaft reaches the tip (frames 12-18)
  const headPop = spring({
    frame: Math.max(0, relFrame - 12),
    fps,
    config: { damping: 10, stiffness: 240, mass: 0.5 },
  });

  const arrowColor = color || (important ? "#FF6B35" : "#BDBDBD");

  return (
    <g style={{ pointerEvents: "none" }}>
      {/* Hand-drawn curved shaft */}
      <path
        d={d}
        fill="none"
        stroke={arrowColor}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={length}
        strokeDashoffset={length * (1 - drawProgress)}
        style={{
          filter: important ? "drop-shadow(0 0 6px rgba(255, 107, 53, 0.4))" : "none",
        }}
      />

      {/* Open 'V' Arrowhead popping at the end */}
      {headPop > 0.05 && (
        <g
          transform={`translate(${headX}, ${headY}) rotate(${angleDeg}) scale(${headPop})`}
        >
          <path
            d="M -16 -12 L 0 0 L -16 12"
            fill="none"
            stroke={arrowColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
    </g>
  );
};
