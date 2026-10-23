import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate, Img, staticFile } from "remotion";
import { TOKENS } from "../../design-system/tokens";

export interface LogoItem {
  src: string;
  name?: string;
  size?: number;
  x: number; // percentage or px from center
  y: number; // percentage or px from center
  staggerDelay?: number;
  rotation?: number;
}

export type ClusterInAnimation = "staggerPop" | "convergeCenter" | "slideFromBottom";
export type ClusterOutAnimation = "scatterOut" | "scaleDown" | "fadeOut";

interface LogoClusterProps {
  logos: LogoItem[];
  inAnimation?: ClusterInAnimation;
  outAnimation?: ClusterOutAnimation;
  inDuration?: number;
  outDuration?: number;
  durationInFrames: number;
  staggerInterval?: number;
  style?: React.CSSProperties;
}

export const LogoCluster: React.FC<LogoClusterProps> = ({
  logos,
  inAnimation = "staggerPop",
  outAnimation = "scatterOut",
  inDuration = 10,
  outDuration = 6,
  durationInFrames,
  staggerInterval = 3,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exitStartFrame = durationInFrames - outDuration;
  const isExiting = frame >= exitStartFrame;
  const exitProgress = isExiting
    ? Math.min(1, Math.max(0, (frame - exitStartFrame) / outDuration))
    : 0;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        ...style,
      }}
    >
      {logos.map((logo, idx) => {
        const delay = logo.staggerDelay ?? idx * staggerInterval;
        const logoFrame = Math.max(0, frame - delay);

        const inSpring = spring({
          frame: logoFrame,
          fps,
          config: TOKENS.animation.springs.popIn,
        });

        // Parallax drift per item
        const driftSpeed = 0.05 + (idx % 3) * 0.02;
        const driftX = Math.sin(frame * driftSpeed + idx) * (12 + idx * 2);
        const driftY = Math.cos(frame * driftSpeed * 0.8 + idx) * (10 + idx * 2);

        let itemTransform = "";
        let itemOpacity = 1;

        switch (inAnimation) {
          case "staggerPop":
            itemTransform = `scale(${interpolate(inSpring, [0, 1], [0.2, 1])}) rotate(${interpolate(
              inSpring,
              [0, 1],
              [(logo.rotation ?? 0) * 3, logo.rotation ?? 0]
            )}deg)`;
            itemOpacity = interpolate(inSpring, [0, 0.4, 1], [0, 0.8, 1]);
            break;
          case "convergeCenter":
            itemTransform = `translate(${interpolate(inSpring, [0, 1], [logo.x * 2, logo.x])}px, ${interpolate(
              inSpring,
              [0, 1],
              [logo.y * 2, logo.y]
            )}px) scale(${interpolate(inSpring, [0, 1], [0.4, 1])})`;
            itemOpacity = interpolate(inSpring, [0, 1], [0, 1]);
            break;
          case "slideFromBottom":
            itemTransform = `translateY(${interpolate(inSpring, [0, 1], [300, 0])}px) scale(${interpolate(
              inSpring,
              [0, 1],
              [0.5, 1]
            )})`;
            itemOpacity = interpolate(inSpring, [0, 1], [0, 1]);
            break;
        }

        // Out animation
        let exitItemTransform = "";
        let exitItemOpacity = 1;

        if (isExiting) {
          const itemExitProgress = Math.min(1, Math.max(0, (frame - (exitStartFrame + idx * 1.5)) / (outDuration - 2)));
          switch (outAnimation) {
            case "scatterOut":
              exitItemTransform = `translate(${driftX * 8}px, ${driftY * 8}px) scale(${interpolate(
                itemExitProgress,
                [0, 1],
                [1, 0.1]
              )})`;
              exitItemOpacity = interpolate(itemExitProgress, [0, 1], [1, 0]);
              break;
            case "scaleDown":
              exitItemTransform = `scale(${interpolate(exitProgress, [0, 1], [1, 0.1])})`;
              exitItemOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
              break;
            case "fadeOut":
              exitItemOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
              break;
          }
        }

        const size = logo.size ?? 160;
        const resolvedSrc = logo.src.startsWith("http") || logo.src.startsWith("data:")
          ? logo.src
          : staticFile(logo.src);

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: `calc(50% + ${logo.x}px)`,
              top: `calc(50% + ${logo.y}px)`,
              transform: `translate(-50%, -50%) ${itemTransform} translate(${driftX}px, ${driftY}px) ${exitItemTransform}`,
              opacity: itemOpacity * exitItemOpacity,
              transformOrigin: "center center",
              willChange: "transform, opacity",
            }}
          >
            <div
              style={{
                width: size,
                height: size,
                backgroundColor: TOKENS.colors.surfaceDark,
                borderRadius: 24,
                border: "2px solid rgba(255, 255, 255, 0.15)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(47, 128, 255, 0.2)",
              }}
            >
              <Img
                src={resolvedSrc}
                alt={logo.name ?? "logo"}
                style={{
                  width: "75%",
                  height: "75%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
              {logo.name && (
                <div
                  style={{
                    fontFamily: TOKENS.typography.headline,
                    fontSize: 20,
                    color: TOKENS.colors.text,
                    marginTop: 8,
                    textAlign: "center",
                  }}
                >
                  {logo.name}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
