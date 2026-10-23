import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { TOKENS } from "../../../design-system/tokens";

export interface KineticTextRevealProps {
  phrase: string;
  accentIndices?: number[];
  accentColor?: string;
  fontSize?: number;
  letterSpacing?: number;
  align?: "center" | "left" | "right";
  staggerFrames?: number;
  containerStyle?: React.CSSProperties;
}

export const KineticTextReveal: React.FC<KineticTextRevealProps> = ({
  phrase,
  accentIndices = [0],
  accentColor = TOKENS.colors.accentYellow,
  fontSize = 96,
  letterSpacing = -1,
  align = "center",
  staggerFrames = 2,
  containerStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = phrase.trim().split(/\s+/);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        alignItems: "center",
        gap: `${fontSize * 0.22}px`,
        maxWidth: 1600,
        margin: "0 auto",
        lineHeight: 1.1,
        ...containerStyle,
      }}
    >
      {words.map((word, idx) => {
        const wordDelay = idx * staggerFrames;
        const wordFrame = Math.max(0, frame - wordDelay);
        const spr = spring({
          frame: wordFrame,
          fps,
          config: TOKENS.motion.springs.punchy,
        });

        const scale = interpolate(spr, [0, 1], [0.75, 1]);
        const translateY = interpolate(spr, [0, 1], [40, 0]);
        const opacity = interpolate(spr, [0, 0.4, 1], [0, 0.95, 1]);
        const isAccent = accentIndices.includes(idx);

        return (
          <span
            key={`${word}-${idx}`}
            style={{
              fontFamily: TOKENS.typography.displayHeadline,
              fontSize,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: `${letterSpacing}px`,
              color: isAccent ? accentColor : TOKENS.colors.textPrimary,
              transform: `translateY(${translateY}px) scale(${scale})`,
              opacity,
              display: "inline-block",
              textShadow: isAccent
                ? `0 0 40px ${accentColor}44, 0 8px 24px rgba(0,0,0,0.8)`
                : "0 8px 30px rgba(0,0,0,0.8)",
              willChange: "transform, opacity",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
