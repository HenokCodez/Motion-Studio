import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate, Img, staticFile } from "remotion";
import { TOKENS } from "../../design-system/tokens";

export type MemeInAnimation = "zoomPunch" | "whipIn" | "snapPop";
export type MemeOutAnimation = "scaleDown" | "whipOut" | "fadeGlitch";

interface MemeCardProps {
  src: string;
  alt?: string;
  captionTop?: string;
  captionBottom?: string;
  width?: number | string;
  inAnimation?: MemeInAnimation;
  outAnimation?: MemeOutAnimation;
  inDuration?: number;
  outDuration?: number;
  durationInFrames: number;
  rotation?: number;
  style?: React.CSSProperties;
}

export const MemeCard: React.FC<MemeCardProps> = ({
  src,
  alt = "Meme",
  captionTop,
  captionBottom,
  width = 620,
  inAnimation = "zoomPunch",
  outAnimation = "scaleDown",
  inDuration = 7,
  outDuration = 5,
  durationInFrames,
  rotation = -3,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance punch spring
  const inSpring = spring({
    frame,
    fps,
    config: TOKENS.animation.springs.punchy,
  });

  // Entrance shake decay
  const shakeDecay = Math.max(0, 1 - frame / 8);
  const shakeX = Math.sin(frame * 2.5) * 8 * shakeDecay;
  const shakeY = Math.cos(frame * 3.1) * 6 * shakeDecay;

  let enterTransform = "";
  let enterOpacity = 1;

  switch (inAnimation) {
    case "zoomPunch":
      enterTransform = `scale(${interpolate(inSpring, [0, 1], [0.1, 1])}) rotate(${interpolate(
        inSpring,
        [0, 1],
        [rotation * 3, rotation]
      )}deg)`;
      enterOpacity = interpolate(inSpring, [0, 0.3, 1], [0, 0.8, 1]);
      break;
    case "whipIn":
      enterTransform = `translateX(${interpolate(inSpring, [0, 1], [-400, 0])}px) rotate(${interpolate(
        inSpring,
        [0, 1],
        [-15, rotation]
      )}deg)`;
      enterOpacity = interpolate(inSpring, [0, 1], [0, 1]);
      break;
    case "snapPop":
      enterTransform = `scale(${interpolate(inSpring, [0, 1], [1.4, 1])}) rotate(${rotation}deg)`;
      enterOpacity = interpolate(inSpring, [0, 1], [0, 1]);
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

  if (isExiting) {
    switch (outAnimation) {
      case "scaleDown":
        exitTransform = `scale(${interpolate(exitProgress, [0, 1], [1, 0.1])})`;
        exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
        break;
      case "whipOut":
        exitTransform = `translateX(${interpolate(exitProgress, [0, 1], [0, 600])}px) rotate(${rotation + 20}deg)`;
        exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
        break;
      case "fadeGlitch":
        exitTransform = `scale(${interpolate(exitProgress, [0, 1], [1, 1.1])})`;
        exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
        break;
    }
  }

  const resolvedSrc = src.startsWith("http") || src.startsWith("data:")
    ? src
    : staticFile(src);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `${enterTransform} translate(${shakeX}px, ${shakeY}px) ${exitTransform}`,
        opacity: enterOpacity * exitOpacity,
        transformOrigin: "center center",
        zIndex: 20,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width,
          border: "4px solid #FFFFFF",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.85), 0 0 30px rgba(255, 77, 109, 0.3)",
          backgroundColor: "#000",
        }}
      >
        {captionTop && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: TOKENS.typography.headline,
              fontSize: 38,
              color: "#FFF",
              textTransform: "uppercase",
              textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
              zIndex: 5,
              padding: "0 10px",
            }}
          >
            {captionTop}
          </div>
        )}

        <Img
          src={resolvedSrc}
          alt={alt}
          style={{
            width: "100%",
            maxHeight: 520,
            objectFit: "contain",
            display: "block",
          }}
        />

        {captionBottom && (
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: TOKENS.typography.headline,
              fontSize: 38,
              color: "#FFF",
              textTransform: "uppercase",
              textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
              zIndex: 5,
              padding: "0 10px",
            }}
          >
            {captionBottom}
          </div>
        )}
      </div>
    </div>
  );
};
