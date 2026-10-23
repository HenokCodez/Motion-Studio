import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VANTA_THEME } from "./VantaBackground";

export interface ComparisonColumn {
  tag?: string;
  title: string;
  subtitle?: string;
  points: string[];
  isWinner?: boolean;
}

export interface VantaComparisonSplitProps {
  sectionTitle?: string;
  left: ComparisonColumn;
  right: ComparisonColumn;
}

export const VantaComparisonSplit: React.FC<VantaComparisonSplitProps> = ({
  sectionTitle = "HEAD-TO-HEAD BREAKDOWN",
  left = {
    tag: "CLOUD PROPRIETARY",
    title: "Closed API Model",
    subtitle: "High recurring fees and data telemetry",
    points: [
      "Pay-per-token API metering",
      "Telemetry & rate limiting",
      "Network dependency & latency",
      "Vendor lock-in",
    ],
    isWinner: false,
  },
  right = {
    tag: "OPEN SOURCE",
    title: "Local DeepSeek / Qwen",
    subtitle: "Full control on your own GPU hardware",
    points: [
      "Zero API token costs",
      "100% private data security",
      "Deterministic offline speed",
      "Unlimited custom weights",
    ],
    isWinner: true,
  },
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 16, stiffness: 180 } });
  const leftSpring = spring({ frame: frame - 6, fps, config: { damping: 15, stiffness: 190 } });
  const rightSpring = spring({ frame: frame - 12, fps, config: { damping: 15, stiffness: 190 } });

  const titleOp = interpolate(titleSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const leftScale = interpolate(leftSpring, [0, 1], [0.94, 1], { extrapolateRight: "clamp" });
  const leftOp = interpolate(leftSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const rightScale = interpolate(rightSpring, [0, 1], [0.94, 1], { extrapolateRight: "clamp" });
  const rightOp = interpolate(rightSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const renderCard = (col: ComparisonColumn, scale: number, op: number) => {
    return (
      <div
        style={{
          flex: 1,
          backgroundColor: VANTA_THEME.surface,
          border: col.isWinner ? `2px solid ${VANTA_THEME.accent}` : `1px solid ${VANTA_THEME.border}`,
          borderRadius: "22px",
          padding: "44px 40px",
          display: "flex",
          flexDirection: "column",
          boxShadow: col.isWinner
            ? `0 24px 60px rgba(0, 0, 0, 0.4), 0 0 32px ${VANTA_THEME.accent}22`
            : "0 24px 60px rgba(0, 0, 0, 0.4)",
          transform: `scale(${scale})`,
          opacity: op,
        }}
      >
        {col.tag && (
          <div
            style={{
              fontFamily: VANTA_THEME.fontPixel,
              fontSize: "15px",
              color: col.isWinner ? VANTA_THEME.accent : VANTA_THEME.textMuted,
              letterSpacing: "2px",
              marginBottom: "12px",
            }}
          >
            {col.tag}
          </div>
        )}

        <div
          style={{
            fontFamily: VANTA_THEME.fontHeadline,
            fontSize: "40px",
            lineHeight: "1.1",
            color: VANTA_THEME.textPrimary,
            marginBottom: "8px",
          }}
        >
          {col.title}
        </div>

        {col.subtitle && (
          <div
            style={{
              fontFamily: VANTA_THEME.fontSubtitle,
              fontSize: "18px",
              color: VANTA_THEME.textMuted,
              marginBottom: "28px",
              lineHeight: "1.3",
            }}
          >
            {col.subtitle}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "auto" }}>
          {col.points.map((pt, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: col.isWinner ? VANTA_THEME.accent : VANTA_THEME.textMuted,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontFamily: VANTA_THEME.fontSubtitle,
                  fontSize: "20px",
                  color: col.isWinner ? VANTA_THEME.textPrimary : VANTA_THEME.textMuted,
                }}
              >
                {pt}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 140px",
      }}
    >
      {sectionTitle && (
        <div
          style={{
            fontFamily: VANTA_THEME.fontHeadline,
            fontSize: "44px",
            color: VANTA_THEME.textPrimary,
            letterSpacing: "2px",
            marginBottom: "40px",
            opacity: titleOp,
          }}
        >
          {sectionTitle}
        </div>
      )}

      <div style={{ display: "flex", gap: "36px", width: "100%", maxWidth: "1240px" }}>
        {renderCard(left, leftScale, leftOp)}
        {renderCard(right, rightScale, rightOp)}
      </div>
    </AbsoluteFill>
  );
};
