import React from "react";

interface BatteryIconProps {
  chargeLevel: number; // 0 to 1
  size?: number;
  glowColor?: string;
  accentColor?: string;
}

export const BatteryIcon: React.FC<BatteryIconProps> = ({
  chargeLevel,
  size = 54,
  glowColor = "rgba(0, 210, 255, 0.45)",
  accentColor = "#00D2FF",
}) => {
  const width = size * 1.6;
  const height = size;
  const clamped = Math.max(0, Math.min(1, chargeLevel));

  // 4 internal segments
  const segments = 4;
  const segmentWidth = 14;
  const segmentGap = 3;
  const startX = 6;
  const innerY = 6;
  const innerHeight = height - 12;

  return (
    <div
      style={{
        position: "relative",
        width: width + 6,
        height,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        filter: clamped > 0.1 ? `drop-shadow(0 0 14px ${glowColor})` : "none",
      }}
    >
      <svg
        width={width + 6}
        height={height}
        viewBox={`0 0 ${width + 6} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Battery Shell */}
        <rect
          x="1"
          y="1"
          width={width - 2}
          height={height - 2}
          rx="6"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="2"
          fill="rgba(10, 15, 24, 0.65)"
        />

        {/* Positive Terminal Nub */}
        <path
          d={`M ${width} ${height * 0.32} Q ${width + 4} ${height * 0.32} ${width + 4} ${height * 0.38} L ${width + 4} ${height * 0.62} Q ${width + 4} ${height * 0.68} ${width} ${height * 0.68} Z`}
          fill="rgba(255, 255, 255, 0.4)"
        />

        {/* 4 Charge Level Segments */}
        {Array.from({ length: segments }).map((_, i) => {
          const segFill = Math.max(0, Math.min(1, (clamped - (i / segments)) * segments));
          const opacity = segFill > 0 ? 0.3 + 0.7 * segFill : 0.08;
          const x = startX + i * (segmentWidth + segmentGap);

          return (
            <rect
              key={i}
              x={x}
              y={innerY}
              width={segmentWidth}
              height={innerHeight}
              rx="3"
              fill={segFill > 0 ? accentColor : "rgba(255, 255, 255, 0.15)"}
              opacity={opacity}
            />
          );
        })}

        {/* Electric Bolt Icon in center */}
        <path
          d={`M ${width * 0.48} ${height * 0.22} L ${width * 0.38} ${height * 0.52} L ${width * 0.49} ${height * 0.52} L ${width * 0.44} ${height * 0.8} L ${width * 0.56} ${height * 0.45} L ${width * 0.46} ${height * 0.45} Z`}
          fill="#FFFFFF"
          opacity={0.35 + 0.65 * clamped}
        />
      </svg>
    </div>
  );
};
