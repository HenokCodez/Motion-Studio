import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VANTA_THEME } from "./VantaBackground";

export interface VantaSpatialCalloutProps {
  leftLabel?: { line1: string; line2: string };
  centerTopLabel?: { line1: string; line2: string };
  rightLabel?: { line1: string; line2: string };
}

export const VantaSpatialCallout: React.FC<VantaSpatialCalloutProps> = ({
  leftLabel = { line1: "INDUSTRY", line2: "STANDARD" },
  centerTopLabel = { line1: "LOCAL", line2: "PIPELINE" },
  rightLabel = { line1: "ZERO CLOUD", line2: "DEPENDENCY" },
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp1 = spring({ frame, fps, config: { damping: 14, stiffness: 200 } });
  const sp2 = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 200 } });
  const sp3 = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 200 } });

  const renderLabel = (lines: { line1: string; line2: string }, sp: number, isAccent = false) => {
    const sc = interpolate(sp, [0, 1], [0.85, 1], { extrapolateRight: "clamp" });
    const op = interpolate(sp, [0, 1], [0, 1], { extrapolateRight: "clamp" });

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          opacity: op,
          transform: `scale(${sc})`,
        }}
      >
        <div
          style={{
            fontFamily: VANTA_THEME.fontHeadline,
            fontSize: "48px",
            lineHeight: "1.05",
            color: isAccent ? VANTA_THEME.accent : VANTA_THEME.textPrimary,
            letterSpacing: "1px",
            textShadow: "0 8px 24px rgba(0, 0, 0, 0.7)",
          }}
        >
          {lines.line1}
        </div>
        <div
          style={{
            fontFamily: VANTA_THEME.fontHeadline,
            fontSize: "48px",
            lineHeight: "1.05",
            color: isAccent ? VANTA_THEME.accent : VANTA_THEME.textPrimary,
            letterSpacing: "1px",
            textShadow: "0 8px 24px rgba(0, 0, 0, 0.7)",
          }}
        >
          {lines.line2}
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "100px 140px",
        position: "relative",
      }}
    >
      {/* Left quadrant */}
      <div style={{ position: "absolute", left: "140px", top: "50%", transform: "translateY(-50%)" }}>
        {leftLabel && renderLabel(leftLabel, sp1, false)}
      </div>

      {/* Center top quadrant */}
      <div style={{ position: "absolute", left: "50%", top: "140px", transform: "translateX(-50%)" }}>
        {centerTopLabel && renderLabel(centerTopLabel, sp2, true)}
      </div>

      {/* Right quadrant */}
      <div style={{ position: "absolute", right: "140px", top: "50%", transform: "translateY(-50%)" }}>
        {rightLabel && renderLabel(rightLabel, sp3, false)}
      </div>
    </AbsoluteFill>
  );
};
