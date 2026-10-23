import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VANTA_THEME } from "./VantaBackground";

export interface KineticItem {
  text: string;
  tag?: string;
  isAccent?: boolean;
  enterFrame?: number;
}

export interface VantaKineticListProps {
  sectionTitle?: string;
  items: KineticItem[];
}

export const VantaKineticList: React.FC<VantaKineticListProps> = ({
  sectionTitle = "// ARCHITECTURE ADVANTAGES",
  items = [
    { text: "RAPID EXECUTION", tag: "SPEED", isAccent: false },
    { text: "LOCAL AI RUNTIME", tag: "ZERO API", isAccent: false },
    { text: "100% PRIVATE DATA", tag: "SECURITY", isAccent: true },
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const secSpring = spring({ frame, fps, config: { damping: 16, stiffness: 180 } });
  const secOpacity = interpolate(secSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "0 160px",
      }}
    >
      {sectionTitle && (
        <div
          style={{
            fontFamily: VANTA_THEME.fontSubtitle,
            fontSize: "24px",
            color: VANTA_THEME.accent,
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginBottom: "28px",
            opacity: secOpacity,
          }}
        >
          {sectionTitle}
        </div>
      )}

      {items.map((item, idx) => {
        const startOffset = item.enterFrame !== undefined ? item.enterFrame : 6 + idx * 7;
        if (frame < startOffset) return null;

        const itemSpring = spring({
          frame: frame - startOffset,
          fps,
          config: { damping: 13, stiffness: 210, mass: 0.6 },
        });

        const x = interpolate(itemSpring, [0, 1], [-60, 0], { extrapolateRight: "clamp" });
        const op = interpolate(itemSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
        const sc = interpolate(itemSpring, [0, 1], [0.85, 1], { extrapolateRight: "clamp" });

        return (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginBottom: "24px",
              opacity: op,
              transform: `translateX(${x}px) scale(${sc})`,
            }}
          >
            {/* Square Node Indicator */}
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "4px",
                backgroundColor: item.isAccent ? VANTA_THEME.accent : VANTA_THEME.textPrimary,
                boxShadow: item.isAccent ? `0 0 16px ${VANTA_THEME.accent}` : "none",
                flexShrink: 0,
              }}
            />

            {/* Kinetic Text */}
            <div
              style={{
                fontFamily: VANTA_THEME.fontHeadline,
                fontSize: "62px",
                lineHeight: 1,
                color: item.isAccent ? VANTA_THEME.accent : VANTA_THEME.textPrimary,
                letterSpacing: "1.5px",
                textShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
              }}
            >
              {item.text}
            </div>

            {/* VP Pixel Tag Badge */}
            {item.tag && (
              <div
                style={{
                  fontFamily: VANTA_THEME.fontPixel,
                  fontSize: "18px",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: `1px solid ${VANTA_THEME.border}`,
                  backgroundColor: "rgba(0, 0, 0, 0.35)",
                  color: VANTA_THEME.textMuted,
                  letterSpacing: "1px",
                }}
              >
                {item.tag}
              </div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
