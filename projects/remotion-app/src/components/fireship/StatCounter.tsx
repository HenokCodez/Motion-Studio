import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { TOKENS } from "../../design-system/tokens";

export type CounterInAnimation = "springScale" | "slideUp" | "flashPop";
export type CounterOutAnimation = "scaleDown" | "slideDown" | "fadeOut";

interface StatCounterProps {
  fromValue?: number;
  toValue: number;
  durationFrames?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label?: string;
  inAnimation?: CounterInAnimation;
  outAnimation?: CounterOutAnimation;
  inDuration?: number;
  outDuration?: number;
  durationInFrames: number;
  color?: string;
  style?: React.CSSProperties;
}

export const StatCounter: React.FC<StatCounterProps> = ({
  fromValue = 0,
  toValue,
  durationFrames = 25,
  prefix = "",
  suffix = "",
  decimals = 0,
  label,
  inAnimation = "springScale",
  outAnimation = "scaleDown",
  inDuration = TOKENS.animation.inFrames,
  outDuration = TOKENS.animation.outFrames,
  durationInFrames,
  color = TOKENS.colors.accentYellow,
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

  // Count progress
  const countProgress = Math.min(1, Math.max(0, frame / Math.max(1, durationFrames)));
  // Eased count progression (easeOutExpo)
  const easedProgress = 1 - Math.pow(2, -10 * countProgress);
  const currentValue = fromValue + (toValue - fromValue) * (countProgress === 1 ? 1 : easedProgress);

  const formattedNumber = decimals > 0
    ? currentValue.toFixed(decimals)
    : Math.round(currentValue).toLocaleString();

  // Entrance transforms
  let enterTransform = "";
  let enterOpacity = 1;

  switch (inAnimation) {
    case "springScale":
      enterTransform = `scale(${interpolate(inSpring, [0, 1], [0.3, 1])})`;
      enterOpacity = interpolate(inSpring, [0, 0.4, 1], [0, 0.8, 1]);
      break;
    case "slideUp":
      enterTransform = `translateY(${interpolate(inSpring, [0, 1], [100, 0])}px)`;
      enterOpacity = interpolate(inSpring, [0, 1], [0, 1]);
      break;
    case "flashPop":
      enterTransform = `scale(${interpolate(inSpring, [0, 1], [1.3, 1])})`;
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

  if (isExiting) {
    switch (outAnimation) {
      case "scaleDown":
        exitTransform = `scale(${interpolate(exitProgress, [0, 1], [1, 0.2])})`;
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `${enterTransform} ${exitTransform}`,
        opacity: enterOpacity * exitOpacity,
        transformOrigin: "center center",
        zIndex: 10,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: TOKENS.typography.headline,
          fontSize: 160,
          lineHeight: 1.0,
          color,
          letterSpacing: "-2px",
          textShadow: `0 0 50px ${color}88, 0 10px 40px rgba(0, 0, 0, 0.9)`,
        }}
      >
        {prefix}
        {formattedNumber}
        {suffix}
      </div>

      {label && (
        <div
          style={{
            fontFamily: TOKENS.typography.headline,
            fontSize: TOKENS.typography.sizes.supporting,
            color: TOKENS.colors.text,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            marginTop: 10,
            textShadow: "0 4px 20px rgba(0, 0, 0, 0.8)",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
