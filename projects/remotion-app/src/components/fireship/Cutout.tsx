import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate, Img, staticFile } from "remotion";
import { TOKENS } from "../../design-system/tokens";

export type CutoutInAnimation = "springPop" | "slideFromBottom" | "slideFromLeft" | "slideFromRight";
export type CutoutOutAnimation = "scaleOut" | "slideDown" | "whipOut";

interface CutoutProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  label?: string;
  role?: string;
  inAnimation?: CutoutInAnimation;
  outAnimation?: CutoutOutAnimation;
  inDuration?: number;
  outDuration?: number;
  durationInFrames: number;
  initialRotation?: number; // e.g. -4 or 5
  stickerColor?: string;
  showStickerBorder?: boolean;
  style?: React.CSSProperties;
}

export const Cutout: React.FC<CutoutProps> = ({
  src,
  alt = "Cutout",
  width = 520,
  height,
  label,
  role,
  inAnimation = "springPop",
  outAnimation = "scaleOut",
  inDuration = TOKENS.animation.inFrames,
  outDuration = TOKENS.animation.outFrames,
  durationInFrames,
  initialRotation = -4,
  stickerColor = TOKENS.colors.stickerBorder,
  showStickerBorder = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const inSpring = spring({
    frame,
    fps,
    config: TOKENS.animation.springs.popIn,
  });

  // Idle floating breathing animation
  const floatY = Math.sin(frame * 0.08) * 10;
  const floatRotate = Math.cos(frame * 0.06) * 1.5;

  // In animation transforms
  let enterTransform = "";
  let enterOpacity = 1;

  switch (inAnimation) {
    case "springPop":
      enterTransform = `scale(${interpolate(inSpring, [0, 1], [0.3, 1])}) rotate(${interpolate(
        inSpring,
        [0, 1],
        [initialRotation * 2.5, initialRotation]
      )}deg)`;
      enterOpacity = interpolate(inSpring, [0, 0.4, 1], [0, 0.9, 1]);
      break;
    case "slideFromBottom":
      enterTransform = `translateY(${interpolate(inSpring, [0, 1], [300, 0])}px) rotate(${initialRotation}deg)`;
      enterOpacity = interpolate(inSpring, [0, 1], [0, 1]);
      break;
    case "slideFromLeft":
      enterTransform = `translateX(${interpolate(inSpring, [0, 1], [-300, 0])}px) rotate(${initialRotation}deg)`;
      enterOpacity = interpolate(inSpring, [0, 1], [0, 1]);
      break;
    case "slideFromRight":
      enterTransform = `translateX(${interpolate(inSpring, [0, 1], [300, 0])}px) rotate(${initialRotation}deg)`;
      enterOpacity = interpolate(inSpring, [0, 1], [0, 1]);
      break;
  }

  // Exit animation calculation
  const exitStartFrame = durationInFrames - outDuration;
  const isExiting = frame >= exitStartFrame;
  const exitProgress = isExiting
    ? Math.min(1, Math.max(0, (frame - exitStartFrame) / outDuration))
    : 0;

  let exitTransform = "";
  let exitOpacity = 1;

  if (isExiting) {
    switch (outAnimation) {
      case "scaleOut":
        exitTransform = `scale(${interpolate(exitProgress, [0, 1], [1, 0.2])})`;
        exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
        break;
      case "slideDown":
        exitTransform = `translateY(${interpolate(exitProgress, [0, 1], [0, 350])}px)`;
        exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
        break;
      case "whipOut":
        exitTransform = `translateX(${interpolate(exitProgress, [0, 1], [0, 500])}px) rotate(${initialRotation + 15}deg)`;
        exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
        break;
    }
  }

  // Pure CSS sticker border using layered drop-shadows
  const stickerFilter = showStickerBorder
    ? `
      drop-shadow(4px 0px 0px ${stickerColor})
      drop-shadow(-4px 0px 0px ${stickerColor})
      drop-shadow(0px 4px 0px ${stickerColor})
      drop-shadow(0px -4px 0px ${stickerColor})
      drop-shadow(3px 3px 0px ${stickerColor})
      drop-shadow(-3px -3px 0px ${stickerColor})
      drop-shadow(0px 24px 35px ${TOKENS.colors.stickerShadow})
    `
    : `drop-shadow(0px 20px 30px ${TOKENS.colors.stickerShadow})`;

  const resolvedSrc = src.startsWith("http") || src.startsWith("data:")
    ? src
    : staticFile(src);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `${enterTransform} translateY(${floatY}px) rotate(${floatRotate}deg) ${exitTransform}`,
        opacity: enterOpacity * exitOpacity,
        transformOrigin: "bottom center",
        zIndex: 15,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      <div style={{ position: "relative" }}>
        <Img
          src={resolvedSrc}
          alt={alt}
          style={{
            width,
            height: height ?? "auto",
            maxHeight: 700,
            objectFit: "contain",
            filter: stickerFilter,
            display: "block",
          }}
        />

        {/* Sticker Pin / Highlight Badge */}
        {label && (
          <div
            style={{
              position: "absolute",
              bottom: 15,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: TOKENS.colors.background,
              color: TOKENS.colors.text,
              border: `3px solid ${TOKENS.colors.accentYellow}`,
              borderRadius: 30,
              padding: "8px 24px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.7)",
              whiteSpace: "nowrap",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: TOKENS.typography.headline,
                fontSize: 28,
                letterSpacing: 0.5,
                lineHeight: 1.1,
              }}
            >
              {label}
            </div>
            {role && (
              <div
                style={{
                  fontFamily: TOKENS.typography.body,
                  fontSize: 18,
                  fontWeight: 600,
                  color: TOKENS.colors.accentYellow,
                  marginTop: 2,
                }}
              >
                {role}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
