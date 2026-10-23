import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VANTA_THEME } from "./VantaBackground";

export interface VantaTitleHookProps {
  tag?: string;
  headline: string;
  highlightWord?: string;
  subtitle?: string;
}

export const VantaTitleHook: React.FC<VantaTitleHookProps> = ({
  tag = "AI BREAKDOWN",
  headline = "THE OPEN-SOURCE",
  highlightWord = "BREAKTHROUGH",
  subtitle = "Actionable tech intelligence without the noise",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Snappy tech spring physics
  const tagSpring = spring({ frame, fps, config: { damping: 15, stiffness: 210 } });
  const titleSpring = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 200 } });
  const pillSpring = spring({ frame: frame - 9, fps, config: { damping: 14, stiffness: 200 } });
  const subSpring = spring({ frame: frame - 15, fps, config: { damping: 16, stiffness: 180 } });

  const tagOpacity = interpolate(tagSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const tagY = interpolate(tagSpring, [0, 1], [-20, 0], { extrapolateRight: "clamp" });

  const titleScale = interpolate(titleSpring, [0, 1], [0.88, 1], { extrapolateRight: "clamp" });
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const pillScale = interpolate(pillSpring, [0, 1], [0.72, 1], { extrapolateRight: "clamp" });
  const pillOpacity = interpolate(pillSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const subY = interpolate(subSpring, [0, 1], [25, 0], { extrapolateRight: "clamp" });
  const subOpacity = interpolate(subSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 100px",
        textAlign: "center",
      }}
    >
      {/* Tag Badge */}
      {tag && (
        <div
          style={{
            fontFamily: VANTA_THEME.fontPixel,
            fontSize: "16px",
            color: VANTA_THEME.accent,
            backgroundColor: VANTA_THEME.badgeBg,
            border: `1px solid ${VANTA_THEME.accent}44`,
            padding: "6px 16px",
            borderRadius: "9999px",
            marginBottom: "20px",
            letterSpacing: "2px",
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
          }}
        >
          // {tag}
        </div>
      )}

      {/* Main Headline */}
      <div
        style={{
          fontFamily: VANTA_THEME.fontHeadline,
          fontSize: "84px",
          lineHeight: "1.05",
          color: VANTA_THEME.textPrimary,
          textTransform: "uppercase",
          letterSpacing: "2px",
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          textShadow: "0 12px 36px rgba(0, 0, 0, 0.6)",
        }}
      >
        {headline}
      </div>

      {/* Highlight Pill */}
      {highlightWord && (
        <div
          style={{
            marginTop: "16px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: VANTA_THEME.accent,
            padding: "10px 42px",
            borderRadius: "14px",
            transform: `scale(${pillScale})`,
            opacity: pillOpacity,
            boxShadow: `0 8px 32px ${VANTA_THEME.accent}55`,
          }}
        >
          <span
            style={{
              fontFamily: VANTA_THEME.fontHeadline,
              fontSize: "74px",
              color: "#FFFFFF",
              letterSpacing: "3px",
              lineHeight: 1,
            }}
          >
            {highlightWord}
          </span>
        </div>
      )}

      {/* Subtitle */}
      {subtitle && (
        <div
          style={{
            marginTop: "32px",
            fontFamily: VANTA_THEME.fontSubtitle,
            fontSize: "28px",
            color: VANTA_THEME.textMuted,
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            maxWidth: "960px",
            letterSpacing: "0.5px",
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};
