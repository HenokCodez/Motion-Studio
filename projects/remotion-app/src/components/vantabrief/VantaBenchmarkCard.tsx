import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VANTA_THEME } from "./VantaBackground";

export interface VantaBenchmarkCardProps {
  tag?: string;
  title: string;
  description?: string;
  metricValue?: number;
  metricSuffix?: string;
  metricLabel?: string;
}

export const VantaBenchmarkCard: React.FC<VantaBenchmarkCardProps> = ({
  tag = "BENCHMARK EVALUATION // NCM-CORE",
  title = "PARALLEL INFERENCE SPEED",
  description = "Rebuilt from lower-level C++ tensors with direct CUDA kernel mapping and zero memory leaks.",
  metricValue = 99.8,
  metricSuffix = "%",
  metricLabel = "ACCURACY",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({ frame, fps, config: { damping: 15, stiffness: 190 } });
  const gaugeSpring = spring({ frame: frame - 8, fps, config: { damping: 14, stiffness: 160 } });

  const cardScale = interpolate(cardSpring, [0, 1], [0.94, 1], { extrapolateRight: "clamp" });
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const currentVal = interpolate(gaugeSpring, [0, 1], [0, metricValue], {
    extrapolateRight: "clamp",
  }).toFixed(1);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 120px",
      }}
    >
      <div
        style={{
          width: "1120px",
          backgroundColor: VANTA_THEME.surface,
          border: `1px solid ${VANTA_THEME.border}`,
          borderRadius: "24px",
          padding: "54px 72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.45)",
          transform: `scale(${cardScale})`,
          opacity: cardOpacity,
        }}
      >
        <div style={{ flex: 1, paddingRight: "40px" }}>
          {tag && (
            <div
              style={{
                fontFamily: VANTA_THEME.fontPixel,
                fontSize: "17px",
                color: VANTA_THEME.accent,
                letterSpacing: "2px",
                marginBottom: "14px",
              }}
            >
              {tag}
            </div>
          )}

          <div
            style={{
              fontFamily: VANTA_THEME.fontHeadline,
              fontSize: "52px",
              lineHeight: "1.15",
              color: VANTA_THEME.textPrimary,
              marginBottom: "16px",
            }}
          >
            {title}
          </div>

          {description && (
            <div
              style={{
                fontFamily: VANTA_THEME.fontSubtitle,
                fontSize: "22px",
                color: VANTA_THEME.textMuted,
                lineHeight: "1.4",
                maxWidth: "560px",
              }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Circular Gauge / Node */}
        <div
          style={{
            position: "relative",
            width: "260px",
            height: "260px",
            borderRadius: "50%",
            border: `4px solid ${VANTA_THEME.accent}33`,
            borderTopColor: VANTA_THEME.accent,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 32px ${VANTA_THEME.accent}22`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: VANTA_THEME.fontHeadline,
              fontSize: "76px",
              lineHeight: 1,
              color: VANTA_THEME.accent,
              letterSpacing: "-1px",
              textShadow: `0 0 20px ${VANTA_THEME.accent}66`,
            }}
          >
            {currentVal}
            {metricSuffix}
          </div>
          {metricLabel && (
            <div
              style={{
                fontFamily: VANTA_THEME.fontPixel,
                fontSize: "15px",
                color: VANTA_THEME.textMuted,
                marginTop: "8px",
                letterSpacing: "1px",
              }}
            >
              {metricLabel}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
