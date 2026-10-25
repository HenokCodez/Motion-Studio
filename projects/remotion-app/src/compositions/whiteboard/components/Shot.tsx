import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export interface ShotProps {
  startFrame?: number;
  src: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  caption?: string;
  highlightLineY?: number; // Relative Y position to draw orange marker
}

export const Shot: React.FC<ShotProps> = ({
  startFrame = 0,
  src,
  x = 0,
  y = 0,
  width = 720,
  height = 420,
  caption,
  highlightLineY,
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

  // Marker highlight wipe across the key line (starts at frame 14)
  const markerWipe = interpolate(relFrame, [14, 26], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: "18px",
        overflow: "hidden",
        border: "2px solid #333333",
        boxShadow: "0 25px 65px rgba(0, 0, 0, 0.75)",
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity: pop,
        zIndex: 22,
        backgroundColor: "#161616",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />

      {/* Marker Highlight Line if specified */}
      {highlightLineY !== undefined && markerWipe > 0 && (
        <div
          style={{
            position: "absolute",
            left: "40px",
            top: `${highlightLineY}px`,
            height: "36px",
            width: `${markerWipe * 0.8}%`,
            background: "#FF6B35",
            opacity: 0.5,
            borderRadius: "4px",
            mixBlendMode: "color-dodge",
            pointerEvents: "none",
          }}
        />
      )}

      {caption && (
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "20px",
            background: "rgba(22, 22, 22, 0.9)",
            border: "1px solid #FF6B35",
            padding: "6px 16px",
            borderRadius: "8px",
            fontFamily: "'Virgil', 'Caveat', sans-serif",
            fontSize: "36px",
            color: "#FF6B35",
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
};
