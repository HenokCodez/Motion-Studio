import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VANTA_THEME } from "./VantaBackground";

export interface VantaChapterCardProps {
  partNumber?: string;
  title: string;
  isAccentBg?: boolean;
}

export const VantaChapterCard: React.FC<VantaChapterCardProps> = ({
  partNumber = "PART ONE :",
  title = "START BEFORE YOU'RE READY",
  isAccentBg = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 220 } });
  const textX = interpolate(entrance, [0, 1], [-60, 0], { extrapolateRight: "clamp" });
  const textOp = interpolate(entrance, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const bg = isAccentBg ? VANTA_THEME.accent : VANTA_THEME.bg;
  const partColor = isAccentBg ? "#FFFFFF" : VANTA_THEME.accent;
  const titleColor = isAccentBg ? "#FFFFFF" : VANTA_THEME.textPrimary;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "0 160px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          opacity: textOp,
          transform: `translateX(${textX}px)`,
        }}
      >
        <div
          style={{
            fontFamily: VANTA_THEME.fontHeadline,
            fontSize: "64px",
            lineHeight: "1.1",
            color: partColor,
            letterSpacing: "3px",
            marginBottom: "12px",
          }}
        >
          {partNumber}
        </div>

        <div
          style={{
            fontFamily: VANTA_THEME.fontHeadline,
            fontSize: "88px",
            lineHeight: "1.0",
            color: titleColor,
            letterSpacing: "2px",
            maxWidth: "1300px",
            textShadow: isAccentBg ? "0 10px 30px rgba(0, 0, 0, 0.4)" : "0 12px 36px rgba(0, 0, 0, 0.6)",
          }}
        >
          {title}
        </div>
      </div>
    </AbsoluteFill>
  );
};
