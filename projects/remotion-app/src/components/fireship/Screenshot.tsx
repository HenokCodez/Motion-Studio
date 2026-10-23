import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate, Img, staticFile } from "remotion";
import { TOKENS } from "../../design-system/tokens";

export interface HighlightBox {
  x: number; // percentage (0-100) or pixels
  y: number; // percentage (0-100) or pixels
  width: number; // percentage or pixels
  height: number;
  triggerFrame?: number; // relative frame to start highlight draw
  color?: string;
}

export type ScreenshotInAnimation = "springPop" | "slideUp" | "scaleUp";
export type ScreenshotOutAnimation = "scaleDown" | "slideDown" | "fadeOut";

interface ScreenshotProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  browserFrame?: boolean;
  browserUrl?: string;
  zoomRange?: [number, number];
  panTarget?: { x: number; y: number }; // target pan percentage (-50 to 50)
  highlights?: HighlightBox[];
  inAnimation?: ScreenshotInAnimation;
  outAnimation?: ScreenshotOutAnimation;
  inDuration?: number;
  outDuration?: number;
  durationInFrames: number;
  style?: React.CSSProperties;
}

export const MarkerHighlight: React.FC<{
  box: HighlightBox;
  parentFrame: number;
  fps: number;
}> = ({ box, parentFrame, fps }) => {
  const trigger = box.triggerFrame ?? 6;
  const highlightSpring = spring({
    frame: Math.max(0, parentFrame - trigger),
    fps,
    config: { damping: 16, mass: 0.6, stiffness: 180 },
  });

  const progress = interpolate(highlightSpring, [0, 1], [0, 1]);
  const highlightColor = box.color ?? TOKENS.colors.accentYellow;

  const left = typeof box.x === "number" && box.x <= 100 ? `${box.x}%` : `${box.x}px`;
  const top = typeof box.y === "number" && box.y <= 100 ? `${box.y}%` : `${box.y}px`;
  const maxWidth = typeof box.width === "number" && box.width <= 100 ? `${box.width}%` : `${box.width}px`;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: maxWidth,
        height: box.height,
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: "100%",
          backgroundColor: highlightColor,
          opacity: 0.45,
          borderRadius: 4,
          mixBlendMode: "multiply",
          boxShadow: `0 0 16px ${highlightColor}66`,
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
};

export const Screenshot: React.FC<ScreenshotProps> = ({
  src,
  alt = "Screenshot",
  width = 1200,
  height,
  browserFrame = true,
  browserUrl = "https://github.com",
  zoomRange = [1.0, 1.08],
  panTarget = { x: 0, y: 0 },
  highlights = [],
  inAnimation = "springPop",
  outAnimation = "scaleDown",
  inDuration = TOKENS.animation.inFrames,
  outDuration = TOKENS.animation.outFrames,
  durationInFrames,
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

  // Slow continuous push-in
  const pushInProgress = Math.min(1, Math.max(0, frame / Math.max(1, durationInFrames)));
  const cameraZoom = interpolate(pushInProgress, [0, 1], zoomRange);
  const cameraPanX = interpolate(pushInProgress, [0, 1], [0, panTarget.x]);
  const cameraPanY = interpolate(pushInProgress, [0, 1], [0, panTarget.y]);

  // Entrance transform
  let enterTransform = "";
  let enterOpacity = 1;

  switch (inAnimation) {
    case "springPop":
      enterTransform = `scale(${interpolate(inSpring, [0, 1], [0.85, 1])})`;
      enterOpacity = interpolate(inSpring, [0, 1], [0, 1]);
      break;
    case "slideUp":
      enterTransform = `translateY(${interpolate(inSpring, [0, 1], [150, 0])}px)`;
      enterOpacity = interpolate(inSpring, [0, 1], [0, 1]);
      break;
    case "scaleUp":
      enterTransform = `scale(${interpolate(inSpring, [0, 1], [0.4, 1])})`;
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
        exitTransform = `scale(${interpolate(exitProgress, [0, 1], [1, 0.6])})`;
        exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
        break;
      case "slideDown":
        exitTransform = `translateY(${interpolate(exitProgress, [0, 1], [0, 200])}px)`;
        exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
        break;
      case "fadeOut":
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
        width,
        margin: "0 auto",
        position: "relative",
        transform: `${enterTransform} ${exitTransform}`,
        opacity: enterOpacity * exitOpacity,
        transformOrigin: "center center",
        zIndex: 12,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      <div
        style={{
          borderRadius: browserFrame ? 16 : 8,
          overflow: "hidden",
          border: `1px solid ${TOKENS.colors.borderSubtle}`,
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.75), 0 0 40px rgba(47, 128, 255, 0.15)",
          backgroundColor: TOKENS.colors.surfaceDark,
        }}
      >
        {/* macOS dark browser title bar */}
        {browserFrame && (
          <div
            style={{
              height: 44,
              backgroundColor: "#161622",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              padding: "0 18px",
              gap: 12,
            }}
          >
            {/* Traffic lights */}
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FF5F56" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FFBD2E" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#27C93F" }} />
            </div>

            {/* URL bar */}
            <div
              style={{
                flex: 1,
                maxWidth: 550,
                margin: "0 auto",
                height: 28,
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 12px",
                fontFamily: TOKENS.typography.code,
                fontSize: 13,
                color: "rgba(255, 255, 255, 0.65)",
                letterSpacing: 0.3,
              }}
            >
              🔒 {browserUrl}
            </div>
          </div>
        )}

        {/* Inner screenshot container with continuous push-in and pan */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            width: "100%",
            height: height ?? "auto",
            maxHeight: 680,
            transform: `scale(${cameraZoom}) translate(${cameraPanX}%, ${cameraPanY}%)`,
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          <Img
            src={resolvedSrc}
            alt={alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Yellow highlighter overlays */}
          {highlights.map((box, idx) => (
            <MarkerHighlight
              key={idx}
              box={box}
              parentFrame={frame}
              fps={fps}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
