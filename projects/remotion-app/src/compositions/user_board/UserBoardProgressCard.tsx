import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface UserBoardProgressCardProps {
  title?: string;
  tag?: string;
  targetPercent?: number;
  accentColor?: string;
}

export const UserBoardProgressCard: React.FC<UserBoardProgressCardProps> = ({
  title = "AI Velocity",
  tag = "Solo Architecture",
  targetPercent = 85,
  accentColor = "#10B981",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({ frame, fps, config: { damping: 14, mass: 0.7 } });
  const cardScale = interpolate(enterSpring, [0, 1], [0.88, 1]);
  const cardOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const cardY = interpolate(enterSpring, [0, 1], [35, 0]);

  // Multi-phase progress bar & counter interpolation across 225 frames
  const progressVal = interpolate(
    frame,
    [20, 65, 80, 135],
    [0, 38, 42, targetPercent],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const counterVal = Math.round(progressVal);

  // Staggered tech chips (frames 135 to 175)
  const chip1 = spring({ frame: Math.max(0, frame - 130), fps, config: { damping: 12 } });
  const chip2 = spring({ frame: Math.max(0, frame - 142), fps, config: { damping: 12 } });
  const chip3 = spring({ frame: Math.max(0, frame - 154), fps, config: { damping: 12 } });

  // Living micro-motion during hold (frames 140 to 225)
  const subtleFloat = Math.sin(frame / 16) * 4;
  const barShimmer = (frame % 60) / 60; // 0 to 1 loop for laser shimmer
  const sparkleRotate = frame * 1.5;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          opacity: cardOpacity,
          transform: `translateY(${cardY + subtleFloat}px) scale(${cardScale})`,
          width: "860px",
          padding: "52px 60px",
          borderRadius: "44px",
          background: "linear-gradient(145deg, rgba(35, 31, 32, 0.95) 0%, rgba(20, 18, 19, 0.98) 100%)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(250, 244, 217, 0.12)",
          boxShadow: "0 35px 80px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(250, 244, 217, 0.15)",
          color: "#FAF4D9",
          display: "flex",
          flexDirection: "column",
          gap: "34px",
        }}
      >
        {/* Header Row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Sparkle Icon with Continuous Spin */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "16px",
                background: "rgba(250, 244, 217, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `rotate(${sparkleRotate}deg)`,
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FAF4D9" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <div style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.02em" }}>{title}</div>
          </div>

          {/* Pill Tag - Font Size 26px */}
          <div
            style={{
              padding: "10px 24px",
              borderRadius: "999px",
              background: "rgba(250, 244, 217, 0.08)",
              border: "1px solid rgba(250, 244, 217, 0.12)",
              fontSize: "26px",
              fontWeight: 700,
              color: "rgba(250, 244, 217, 0.85)",
            }}
          >
            {tag}
          </div>
        </div>

        {/* Big Percentage Metric with Living Bloom */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "18px" }}>
          <span
            style={{
              fontSize: "116px",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              color: "#FAF4D9",
              textShadow: counterVal >= 80 ? `0 0 35px ${accentColor}60` : "none",
              transition: "text-shadow 0.3s ease-out",
            }}
          >
            {counterVal}%
          </span>
          <span style={{ fontSize: "28px", color: "rgba(250, 244, 217, 0.65)", fontWeight: 600 }}>
            Software Build Velocity
          </span>
        </div>

        {/* Glowing Progress Track */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "58px",
            borderRadius: "999px",
            background: "rgba(250, 244, 217, 0.08)",
            padding: "6px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Animated Gradient Fill */}
          <div
            style={{
              width: `${Math.max(4, progressVal)}%`,
              height: "100%",
              borderRadius: "999px",
              background: `linear-gradient(90deg, ${accentColor} 0%, #1677FF 100%)`,
              boxShadow: `0 0 ${25 + Math.sin(frame / 10) * 8}px ${accentColor}80, 0 0 50px rgba(22, 119, 255, 0.4)`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Shimmer light sweep */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${barShimmer * 150 - 50}%`,
                width: "50px",
                background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
                transform: "skewX(-20deg)",
              }}
            />
          </div>

          {/* Trailing Label Pill - Font Size 26px */}
          <div
            style={{
              position: "absolute",
              right: "22px",
              fontSize: "26px",
              fontWeight: 700,
              color: "rgba(250, 244, 217, 0.9)",
              letterSpacing: "0.02em",
            }}
          >
            1 Dev + AI Stack
          </div>
        </div>

        {/* Footer Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "12px",
            borderTop: "1px solid rgba(250, 244, 217, 0.08)",
          }}
        >
          {/* Tech Stack Chips popping in sequentially - Font Size 26px */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.65)", fontWeight: 600 }}>
              AI Engine:
            </span>
            <div style={{ display: "flex", gap: "10px" }}>
              {[
                { name: "Claude", springVal: chip1 },
                { name: "DeepSeek", springVal: chip2 },
                { name: "ArtCraft", springVal: chip3 },
              ].map((tool, idx) => (
                <span
                  key={idx}
                  style={{
                    opacity: interpolate(tool.springVal, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(tool.springVal, [0, 1], [0.8, 1])})`,
                    padding: "6px 16px",
                    borderRadius: "10px",
                    background: "rgba(250, 244, 217, 0.06)",
                    border: "1px solid rgba(250, 244, 217, 0.12)",
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "rgba(250, 244, 217, 0.95)",
                  }}
                >
                  {tool.name}
                </span>
              ))}
            </div>
          </div>

          {/* Pill Action Button with Gentle Pulse - Font Size 26px */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 24px",
              borderRadius: "999px",
              background: "rgba(250, 244, 217, 0.1)",
              border: "1px solid rgba(250, 244, 217, 0.16)",
              fontSize: "26px",
              fontWeight: 700,
              color: "#FAF4D9",
              boxShadow: `0 0 ${Math.sin(frame / 12) * 8 + 8}px rgba(16, 185, 129, 0.2)`,
            }}
          >
            Exponential Speed →
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
