import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { TOKENS } from "../../../design-system/tokens";

export interface EditorialMetaphorProps {
  headline: string;
  subtext?: string;
  stampText?: string;
  rotation?: number; // e.g. -2 to 2 degrees
  tapePosition?: "top-left" | "top-right" | "top-center" | "none";
  highlightColor?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const EditorialMetaphor: React.FC<EditorialMetaphorProps> = ({
  headline,
  subtext,
  stampText,
  rotation = -1.5,
  tapePosition = "top-right",
  highlightColor = TOKENS.colors.accentYellow,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: TOKENS.motion.springs.hook,
  });

  const scale = interpolate(enterSpring, [0, 1], [0.88, 1]);
  const translateY = interpolate(enterSpring, [0, 1], [50, 0]);
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotation}deg)`,
        opacity,
        zIndex: 10,
        ...style,
      }}
    >
      {/* Editorial Card Surface */}
      <div
        style={{
          position: "relative",
          backgroundColor: TOKENS.colors.surfaceElevated,
          borderRadius: 12,
          padding: "48px 56px",
          border: `2px solid ${TOKENS.colors.borderSubtle}`,
          boxShadow: `0 24px 60px ${TOKENS.colors.stickerShadow}`,
          maxWidth: 960,
          textAlign: "center",
        }}
      >
        {/* Washi Tape Accent */}
        {tapePosition !== "none" && (
          <div
            style={{
              position: "absolute",
              top: -16,
              ...(tapePosition === "top-left"
                ? { left: 40 }
                : tapePosition === "top-right"
                ? { right: 40 }
                : { left: "50%", transform: "translateX(-50%)" }),
              width: 140,
              height: 32,
              backgroundColor: "rgba(250, 244, 217, 0.25)",
              backdropFilter: "blur(4px)",
              border: "1px dashed rgba(250, 244, 217, 0.4)",
              transform: "rotate(-3deg)",
              zIndex: 20,
            }}
          />
        )}

        {/* Optional Editorial Stamp (e.g. "EXHIBIT A", "DOCUMENTED") */}
        {stampText && (
          <div
            style={{
              display: "inline-block",
              marginBottom: 16,
              fontFamily: TOKENS.typography.code,
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: TOKENS.colors.accentRed,
              border: `2px solid ${TOKENS.colors.accentRed}`,
              padding: "4px 14px",
              borderRadius: 4,
              transform: "rotate(-2deg)",
            }}
          >
            {stampText}
          </div>
        )}

        {/* Primary Headline */}
        <div
          style={{
            fontFamily: TOKENS.typography.displayHeadline,
            fontSize: 64,
            fontWeight: 900,
            color: TOKENS.colors.textPrimary,
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            textTransform: "uppercase",
          }}
        >
          {headline}
        </div>

        {/* Subtext with Highlight */}
        {subtext && (
          <div
            style={{
              marginTop: 18,
              fontFamily: TOKENS.typography.body,
              fontSize: 26,
              color: highlightColor,
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            {subtext}
          </div>
        )}

        {/* Embedded Visual Slot */}
        {children && <div style={{ marginTop: 28 }}>{children}</div>}
      </div>
    </div>
  );
};
