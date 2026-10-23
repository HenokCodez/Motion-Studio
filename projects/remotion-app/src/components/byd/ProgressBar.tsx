import React from "react";

interface ProgressBarProps {
  progress: number; // 0 to 1
  width?: number | string;
  height?: number;
  gradientStart?: string;
  gradientEnd?: string;
  glowColor?: string;
  ticks?: number;
  style?: React.CSSProperties;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  width = "100%",
  height = 6,
  gradientStart = "#00D2FF",
  gradientEnd = "#0072FF",
  glowColor = "rgba(0, 210, 255, 0.4)",
  ticks = 0,
  style,
}) => {
  const clamped = Math.max(0, Math.min(1, progress));
  const fillWidthPercent = `${(clamped * 100).toFixed(2)}%`;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderRadius: height,
        overflow: "visible",
        ...style,
      }}
    >
      {/* Ticks background if requested */}
      {ticks > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "space-between",
            padding: "0 2px",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          {Array.from({ length: ticks }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 1,
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.45)",
              }}
            />
          ))}
        </div>
      )}

      {/* Active Fill Bar */}
      <div
        style={{
          position: "relative",
          width: fillWidthPercent,
          height: "100%",
          borderRadius: height,
          background: `linear-gradient(90deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
          boxShadow: clamped > 0.02 ? `0 0 12px ${glowColor}` : "none",
          transition: "none",
        }}
      >
        {/* Leading edge light pip */}
        {clamped > 0.01 && (
          <div
            style={{
              position: "absolute",
              right: -2,
              top: "50%",
              transform: "translateY(-50%)",
              width: height + 4,
              height: height + 4,
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              boxShadow: `0 0 10px #FFFFFF, 0 0 20px ${glowColor}`,
              opacity: 0.9,
            }}
          />
        )}
      </div>
    </div>
  );
};
