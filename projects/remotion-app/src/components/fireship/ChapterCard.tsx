import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { TOKENS } from "../../design-system/tokens";

export type ChapterInAnimation = "wipeUp" | "glitchZoom" | "snapPunch";
export type ChapterOutAnimation = "flashWipe" | "zoomOut" | "fastSlide";

interface ChapterCardProps {
  number: string | number; // e.g. "01" or 1
  title: string;
  subtitle?: string;
  inAnimation?: ChapterInAnimation;
  outAnimation?: ChapterOutAnimation;
  inDuration?: number;
  outDuration?: number;
  durationInFrames?: number; // max 45 frames (1.5s)
  accentColor?: string;
  style?: React.CSSProperties;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({
  number,
  title,
  subtitle,
  inAnimation = "glitchZoom",
  outAnimation = "flashWipe",
  inDuration = 7,
  outDuration = 6,
  durationInFrames = 45, // 1.5s maximum
  accentColor = TOKENS.colors.accentYellow,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const formattedNumber = typeof number === "number" ? String(number).padStart(2, "0") : number;

  // Entrance spring
  const inSpring = spring({
    frame,
    fps,
    config: TOKENS.animation.springs.punchy,
  });

  // Rapid camera push
  const pushProgress = Math.min(1, Math.max(0, frame / durationInFrames));
  const cameraScale = interpolate(pushProgress, [0, 1], [1.0, 1.15]);

  // Entrance transforms
  let enterTransform = "";
  let enterOpacity = 1;

  switch (inAnimation) {
    case "glitchZoom": {
      const glitchX = frame < 4 ? Math.sin(frame * 4) * 14 : 0;
      enterTransform = `scale(${interpolate(inSpring, [0, 1], [0.4, 1])}) translateX(${glitchX}px)`;
      enterOpacity = interpolate(inSpring, [0, 0.3, 1], [0, 0.9, 1]);
      break;
    }
    case "wipeUp":
      enterTransform = `translateY(${interpolate(inSpring, [0, 1], [200, 0])}px)`;
      enterOpacity = interpolate(inSpring, [0, 1], [0, 1]);
      break;
    case "snapPunch":
      enterTransform = `scale(${interpolate(inSpring, [0, 1], [1.5, 1])})`;
      enterOpacity = 1;
      break;
  }

  // Exit calculation
  const exitStartFrame = durationInFrames - outDuration;
  const isExiting = frame >= exitStartFrame;
  const exitProgress = isExiting
    ? Math.min(1, Math.max(0, (frame - exitStartFrame) / outDuration))
    : 0;

  let exitTransform = "";
  let exitOpacity = 1;
  let flashWhite = 0;

  if (isExiting) {
    switch (outAnimation) {
      case "flashWipe":
        flashWhite = interpolate(exitProgress, [0, 0.4, 1], [0, 0.8, 0]);
        exitOpacity = interpolate(exitProgress, [0.3, 1], [1, 0]);
        exitTransform = `scale(${interpolate(exitProgress, [0, 1], [1, 1.2])})`;
        break;
      case "zoomOut":
        exitTransform = `scale(${interpolate(exitProgress, [0, 1], [1, 0.1])})`;
        exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
        break;
      case "fastSlide":
        exitTransform = `translateX(${interpolate(exitProgress, [0, 1], [0, 600])}px)`;
        exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
        break;
    }
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${cameraScale})`,
        zIndex: 25,
        ...style,
      }}
    >
      {/* Dynamic diagonal accent slash */}
      <div
        style={{
          position: "absolute",
          width: "140%",
          height: 120,
          background: `linear-gradient(90deg, transparent, ${accentColor}22, ${accentColor}55, transparent)`,
          transform: "rotate(-12deg)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `${enterTransform} ${exitTransform}`,
          opacity: enterOpacity * exitOpacity,
          transformOrigin: "center center",
          willChange: "transform, opacity",
        }}
      >
        {/* Big glowing number */}
        <div
          style={{
            fontFamily: TOKENS.typography.headline,
            fontSize: 220,
            lineHeight: 0.9,
            color: accentColor,
            letterSpacing: "-4px",
            textShadow: `0 0 60px ${accentColor}aa, 0 10px 40px rgba(0, 0, 0, 0.9)`,
          }}
        >
          {formattedNumber}
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: TOKENS.typography.headline,
            fontSize: TOKENS.typography.sizes.headline,
            color: TOKENS.colors.text,
            textTransform: "uppercase",
            letterSpacing: "-1px",
            textAlign: "center",
            maxWidth: 1400,
            lineHeight: 1.05,
            marginTop: 10,
            textShadow: "0 8px 30px rgba(0, 0, 0, 0.9)",
          }}
        >
          {title}
        </div>

        {subtitle && (
          <div
            style={{
              fontFamily: TOKENS.typography.handwritten,
              fontSize: 48,
              color: TOKENS.colors.accentPink,
              marginTop: 12,
              letterSpacing: 1,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Screen flash on wipe exit */}
      {flashWhite > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#FFFFFF",
            opacity: flashWhite,
            pointerEvents: "none",
            zIndex: 99,
          }}
        />
      )}
    </div>
  );
};
