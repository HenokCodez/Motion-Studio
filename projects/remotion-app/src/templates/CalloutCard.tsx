import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface CalloutCardProps {
  numberTarget?: number;
  numberPrefix?: string;
  numberSuffix?: string;
  title?: string;
  description?: string;
  accentColor?: string;
}

export const CalloutCard: React.FC<CalloutCardProps> = ({
  numberTarget = 94,
  numberPrefix = "",
  numberSuffix = "%",
  title = "Faster Turnaround",
  description = "Cut manual video animation and subtitle synchronization time drastically.",
  accentColor = "#10B981",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({ frame, fps, config: { damping: 14, mass: 0.7 } });
  const cardScale = interpolate(cardSpring, [0, 1], [0.85, 1], { extrapolateRight: "clamp" });
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const cardY = interpolate(cardSpring, [0, 1], [40, 0], { extrapolateRight: "clamp" });

  // Counter progress
  const countProgress = interpolate(frame, [10, 45], [0, numberTarget], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const displayCount = Math.round(countProgress);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          opacity: cardOpacity,
          transform: `translateY(${cardY}px) scale(${cardScale})`,
          width: "580px",
          padding: "48px 44px",
          borderRadius: "32px",
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.85) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
          color: "#F8FAFC",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <span
            style={{
              fontSize: "88px",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: accentColor,
              textShadow: `0 0 30px ${accentColor}40`,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {numberPrefix}{displayCount}{numberSuffix}
          </span>
        </div>

        <h3
          style={{
            fontSize: "32px",
            fontWeight: 700,
            marginTop: "12px",
            marginBottom: "8px",
            color: "#FFFFFF",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontSize: "20px",
            fontWeight: 400,
            lineHeight: 1.5,
            color: "#94A3B8",
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </AbsoluteFill>
  );
};
