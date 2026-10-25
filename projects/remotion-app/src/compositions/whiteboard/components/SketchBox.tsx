import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface SketchBoxProps {
  startFrame?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  important?: boolean;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  isActive?: boolean;
}

export const SketchBox: React.FC<SketchBoxProps> = ({
  startFrame = 0,
  x = 0,
  y = 0,
  width = 460,
  height = 200,
  important = false,
  title,
  subtitle,
  children,
  isActive = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - startFrame);

  // Snappy spring entrance (~10-12 frames)
  const enter = spring({
    frame: relFrame,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.6 },
  });

  const scale = interpolate(enter, [0, 1], [0.85, 1]);
  const translateY = interpolate(enter, [0, 1], [24, 0]);

  // Idle 2% breathing when active
  const breathe = isActive ? 1 + Math.sin(frame / 14) * 0.02 : 1;

  // Colors per spec
  // Important: dark rust-brown #6B3A2A with orange #FF6B35 outline
  // Normal: plain dark #161616 with light-gray #BDBDBD outline
  const bg = important ? "#6B3A2A" : "#161616";
  const strokeColor = important ? "#FF6B35" : "#BDBDBD";
  const strokeW = important ? 3.5 : 2.5;

  // SVG sketchy wobbled rounded rect coordinates
  const p1 = `M 16 4 Q ${width / 2 + 3} 1, ${width - 16} 5 Q ${width - 1} ${height / 2 - 2}, ${width - 5} ${height - 16} Q ${width / 2 - 2} ${height - 2}, 16 ${height - 5} Q 2 ${height / 2 + 3}, 4 16 Z`;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: `translateY(${translateY}px) scale(${scale * breathe})`,
        opacity: enter,
        zIndex: 20,
      }}
    >
      {/* Hand-drawn SVG container background */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <path
          d={p1}
          fill={bg}
          stroke={strokeColor}
          strokeWidth={strokeW}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      {/* Content Container */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "26px 32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        {title && (
          <div
            style={{
              fontFamily: "'Virgil', 'Caveat', 'Kalam', sans-serif",
              fontSize: "46px", // Min 40px, typical 44-56px per spec
              fontWeight: 700,
              color: important ? "#FF6B35" : "#EDEDED",
              lineHeight: 1.2,
              marginBottom: subtitle ? "10px" : "0",
            }}
          >
            {title}
          </div>
        )}
        {subtitle && (
          <div
            style={{
              fontFamily: "'Virgil', 'Caveat', 'Kalam', sans-serif",
              fontSize: "40px", // Min 40px
              color: "#BDBDBD",
              lineHeight: 1.25,
            }}
          >
            {subtitle}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
