import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export interface MascotProps {
  pose?: "idle" | "pointing" | "thinking" | "shrugging" | "celebrating";
  startFrame?: number;
  x?: number;
  y?: number;
  flip?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({
  pose = "idle",
  startFrame = 0,
  x = 0,
  y = 0,
  flip = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - startFrame);

  // Snappy spring entrance
  const pop = spring({
    frame: relFrame,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.6 },
  });

  const scale = interpolate(pop, [0, 1], [0.85, 1]);
  const translateY = interpolate(pop, [0, 1], [24, 0]);

  // Subtle 2px idle float
  const idleFloat = Math.sin(frame / 12) * 2;

  const svgFile = staticFile(`mascot/mascot_${pose}.svg`);

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: "160px",
        height: "200px",
        transform: `translate(${flip ? "scaleX(-1)" : ""}) translateY(${translateY + idleFloat}px) scale(${scale})`,
        opacity: pop,
        zIndex: 40,
        pointerEvents: "none",
      }}
    >
      <Img src={svgFile} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};
