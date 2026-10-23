import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { TOKENS } from "../../design-system/tokens";

export type InAnimationType = "pop" | "slideUp" | "scaleUp" | "flash";
export type OutAnimationType = "scaleDown" | "slideDown" | "fadeOut" | "whipRight";

export interface WordConfig {
  text: string;
  isAccent?: boolean;
  accentColor?: string; // e.g. TOKENS.colors.accentPink or TOKENS.colors.accentYellow
  underline?: boolean;
  circle?: boolean;
  startFrameOffset?: number; // relative frame offset when word pops in
}

interface BigTextProps {
  words: (string | WordConfig)[];
  fontSize?: number;
  inAnimation?: InAnimationType;
  outAnimation?: OutAnimationType;
  inDuration?: number;
  outDuration?: number;
  durationInFrames: number;
  staggerFrames?: number;
  textAlign?: "center" | "left" | "right";
  maxWidth?: number;
  style?: React.CSSProperties;
}

export const BigText: React.FC<BigTextProps> = ({
  words,
  fontSize = TOKENS.typography.sizes.headline,
  inAnimation = "pop",
  outAnimation = "scaleDown",
  inDuration = TOKENS.animation.inFrames,
  outDuration = TOKENS.animation.outFrames,
  durationInFrames,
  staggerFrames = 3,
  textAlign = "center",
  maxWidth = 1600,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Normalize words
  const parsedWords: WordConfig[] = words.map((w) =>
    typeof w === "string" ? { text: w } : w
  );

  // Exit animation calculation
  const exitStartFrame = durationInFrames - outDuration;
  const isExiting = frame >= exitStartFrame;
  const exitProgress = isExiting
    ? Math.min(1, Math.max(0, (frame - exitStartFrame) / outDuration))
    : 0;

  let containerExitTransform = "";
  let containerExitOpacity = 1;

  if (isExiting) {
    switch (outAnimation) {
      case "scaleDown":
        containerExitTransform = `scale(${interpolate(exitProgress, [0, 1], [1, 0.4])})`;
        containerExitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
        break;
      case "slideDown":
        containerExitTransform = `translateY(${interpolate(exitProgress, [0, 1], [0, 120])}px)`;
        containerExitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
        break;
      case "whipRight":
        containerExitTransform = `translateX(${interpolate(exitProgress, [0, 1], [0, 400])}px) rotate(6deg)`;
        containerExitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
        break;
      case "fadeOut":
      default:
        containerExitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
        break;
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: textAlign === "center" ? "center" : textAlign === "left" ? "flex-start" : "flex-end",
        alignItems: "center",
        columnGap: "26px",
        rowGap: "16px",
        maxWidth,
        margin: "0 auto",
        textAlign,
        transform: containerExitTransform,
        opacity: containerExitOpacity,
        zIndex: 10,
        ...style,
      }}
    >
      {parsedWords.map((item, idx) => {
        const wordDelay = item.startFrameOffset ?? idx * staggerFrames;
        const wordFrame = Math.max(0, frame - wordDelay);

        const wordSpring = spring({
          frame: wordFrame,
          fps,
          config: TOKENS.animation.springs.popIn,
        });

        let wordTransform = "scale(1)";
        let wordOpacity = 1;

        if (wordFrame < inDuration + 4) {
          switch (inAnimation) {
            case "pop":
              wordTransform = `scale(${interpolate(wordSpring, [0, 1], [0.3, 1])}) rotate(${interpolate(
                wordSpring,
                [0, 1],
                [-8, 0]
              )}deg)`;
              wordOpacity = interpolate(wordSpring, [0, 0.5, 1], [0, 0.9, 1]);
              break;
            case "slideUp":
              wordTransform = `translateY(${interpolate(wordSpring, [0, 1], [80, 0])}px)`;
              wordOpacity = interpolate(wordSpring, [0, 1], [0, 1]);
              break;
            case "scaleUp":
              wordTransform = `scale(${interpolate(wordSpring, [0, 1], [0, 1])})`;
              wordOpacity = interpolate(wordSpring, [0, 1], [0, 1]);
              break;
            case "flash":
              wordTransform = `scale(${interpolate(wordSpring, [0, 1], [1.3, 1])})`;
              wordOpacity = wordFrame < 2 ? 0.3 : 1;
              break;
          }
        }

        // Wobble for handwritten accent words
        const wobble = item.isAccent
          ? Math.sin((frame + idx * 10) * 0.12) * 2.5
          : 0;

        const isHandwritten = item.isAccent;
        const fontColor = item.isAccent
          ? (item.accentColor ?? TOKENS.colors.accentPink)
          : TOKENS.colors.text;

        // Animated underline progress
        const underlineProgress = spring({
          frame: Math.max(0, frame - wordDelay - 2),
          fps,
          config: { damping: 14, mass: 0.5, stiffness: 200 },
        });

        return (
          <span
            key={idx}
            style={{
              display: "inline-block",
              position: "relative",
              fontFamily: isHandwritten
                ? TOKENS.typography.handwritten
                : TOKENS.typography.headline,
              fontSize: isHandwritten ? fontSize * 1.08 : fontSize,
              fontWeight: isHandwritten ? 700 : 900,
              textTransform: isHandwritten ? "none" : "uppercase",
              letterSpacing: isHandwritten ? "1px" : "-1.5px",
              lineHeight: 1.0,
              color: fontColor,
              transform: `${wordTransform} rotate(${wobble}deg)`,
              opacity: wordOpacity,
              textShadow: isHandwritten
                ? `0 4px 20px ${fontColor}66`
                : "0 8px 30px rgba(0, 0, 0, 0.8)",
              willChange: "transform, opacity",
            }}
          >
            {item.text}

            {/* Hand-drawn SVG underline accent */}
            {item.underline && (
              <svg
                width="110%"
                height="16"
                viewBox="0 0 100 12"
                fill="none"
                style={{
                  position: "absolute",
                  left: "-5%",
                  bottom: "-10px",
                  pointerEvents: "none",
                }}
              >
                <path
                  d="M2 9 C 25 3, 75 11, 98 5"
                  stroke={fontColor}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="100"
                  strokeDashoffset={interpolate(underlineProgress, [0, 1], [100, 0])}
                />
              </svg>
            )}

            {/* Hand-drawn circle around word */}
            {item.circle && (
              <svg
                width="130%"
                height="140%"
                viewBox="0 0 130 80"
                fill="none"
                style={{
                  position: "absolute",
                  left: "-15%",
                  top: "-20%",
                  pointerEvents: "none",
                }}
              >
                <path
                  d="M15 40 C 15 15, 115 10, 115 40 C 115 70, 10 65, 25 45"
                  stroke={fontColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="300"
                  strokeDashoffset={interpolate(underlineProgress, [0, 1], [300, 0])}
                />
              </svg>
            )}
          </span>
        );
      })}
    </div>
  );
};
