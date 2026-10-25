import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export interface LogoProps {
  startFrame?: number;
  name: string; // e.g. "photoshop.svg"
  x?: number;
  y?: number;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({
  startFrame = 0,
  name,
  x = 0,
  y = 0,
  size = 90,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - startFrame);

  const pop = spring({
    frame: relFrame,
    fps,
    config: { damping: 12, stiffness: 220, mass: 0.5 },
  });

  const scale = interpolate(pop, [0, 1], [0.8, 1]);
  const translateY = interpolate(pop, [0, 1], [16, 0]);

  // Subtle 1-2px float
  const idleFloat = Math.sin(frame / 14) * 2;

  const src = staticFile(name.startsWith("logos/") ? name : `logos/${name}`);

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        transform: `translateY(${translateY + idleFloat}px) scale(${scale})`,
        opacity: pop,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          filter: "drop-shadow(0 6px 16px rgba(0, 0, 0, 0.6))",
        }}
      />
    </div>
  );
};
