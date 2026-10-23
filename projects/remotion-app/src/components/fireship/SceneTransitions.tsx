import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { TOKENS } from "../../design-system/tokens";

export type TransitionType =
  | "whipPan"
  | "zoomThrough"
  | "glitch"
  | "swipe"
  | "flashCut";

interface SceneTransitionProps {
  type: TransitionType;
  durationInFrames?: number; // typically 6-10 frames
  direction?: "left" | "right" | "up" | "down";
  accentColor?: string;
  style?: React.CSSProperties;
}

export const SceneTransition: React.FC<SceneTransitionProps> = ({
  type,
  durationInFrames = 8,
  direction = "right",
  accentColor = TOKENS.colors.accentYellow,
  style,
}) => {
  const frame = useCurrentFrame();
  if (frame >= durationInFrames) return null;

  const progress = frame / durationInFrames;

  switch (type) {
    case "flashCut": {
      // 2-3 frame white flash
      const opacity = interpolate(progress, [0, 0.2, 1], [0.85, 1, 0]);
      return (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#FFFFFF",
            opacity,
            pointerEvents: "none",
            zIndex: 99,
            ...style,
          }}
        />
      );
    }

    case "whipPan": {
      // Fast horizontal wipe with motion blur
      const wipeX = interpolate(progress, [0, 1], [-1920, 1920]);
      return (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 99,
            overflow: "hidden",
            ...style,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: wipeX,
              width: 1920,
              height: "100%",
              background: `linear-gradient(90deg, transparent, ${TOKENS.colors.background} 40%, ${TOKENS.colors.background} 60%, transparent)`,
              boxShadow: `0 0 80px ${accentColor}`,
            }}
          />
        </div>
      );
    }

    case "zoomThrough": {
      // Fast camera punch zoom through
      const scale = interpolate(progress, [0, 0.5, 1], [1, 2.5, 5]);
      const opacity = interpolate(progress, [0, 0.4, 0.8, 1], [0, 0.9, 0.4, 0]);
      return (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 99,
            ...style,
          }}
        >
          <div
            style={{
              width: 400,
              height: 400,
              borderRadius: "50%",
              border: `12px solid ${accentColor}`,
              transform: `scale(${scale})`,
              opacity,
              boxShadow: `0 0 100px ${accentColor}`,
            }}
          />
        </div>
      );
    }

    case "glitch": {
      // 3-frame RGB split glitch
      const glitchActive = frame < 6;
      if (!glitchActive) return null;
      const offset = (Math.sin(frame * 5) * 20).toFixed(0);
      return (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 99,
            mixBlendMode: "screen",
            opacity: 0.8,
            ...style,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(255, 77, 109, 0.25)",
              transform: `translateX(${offset}px)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(47, 128, 255, 0.25)",
              transform: `translateX(-${offset}px)`,
            }}
          />
        </div>
      );
    }

    case "swipe": {
      // Bold diagonal color swipe
      const swipeProgress = interpolate(progress, [0, 1], [-120, 120]);
      return (
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 99,
            ...style,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50%",
              left: `${swipeProgress}%`,
              width: "40%",
              height: "200%",
              backgroundColor: accentColor,
              transform: "rotate(-15deg)",
              boxShadow: `0 0 60px ${accentColor}`,
              opacity: 0.95,
            }}
          />
        </div>
      );
    }
  }
};
