import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { TOKENS } from "../../design-system/tokens";

export interface CaptionWord {
  word: string;
  start: number; // in seconds
  end: number;   // in seconds
}

interface CaptionProps {
  words: CaptionWord[];
  activeColor?: string;
  inactiveColor?: string;
  fontSize?: number;
  maxWordsOnScreen?: number;
  style?: React.CSSProperties;
}

export const Caption: React.FC<CaptionProps> = ({
  words,
  activeColor = TOKENS.colors.accentYellow,
  inactiveColor = TOKENS.colors.text,
  fontSize = 52,
  maxWordsOnScreen = 3,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find the currently active word index
  let activeIndex = -1;
  for (let i = 0; i < words.length; i++) {
    if (currentTime >= words[i].start && currentTime <= words[i].end) {
      activeIndex = i;
      break;
    }
  }

  // If between words, find the nearest upcoming word or previous
  if (activeIndex === -1) {
    for (let i = 0; i < words.length; i++) {
      if (currentTime < words[i].start) {
        activeIndex = Math.max(0, i - 1);
        break;
      }
    }
  }

  if (activeIndex === -1 && words.length > 0) {
    if (currentTime > words[words.length - 1].end) {
      // past end
      return null;
    }
    activeIndex = 0;
  }

  // Window of 2-4 words around active index
  const groupIndex = Math.floor(activeIndex / maxWordsOnScreen);
  const startIdx = groupIndex * maxWordsOnScreen;
  const currentChunk = words.slice(startIdx, startIdx + maxWordsOnScreen);

  if (currentChunk.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 50,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: "12px 28px",
        backgroundColor: "rgba(10, 10, 15, 0.75)",
        borderRadius: 24,
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
        zIndex: 50,
        maxWidth: 1400,
        ...style,
      }}
    >
      {currentChunk.map((item, idx) => {
        const globalIdx = startIdx + idx;
        const isActive = globalIdx === activeIndex;

        return (
          <span
            key={globalIdx}
            style={{
              fontFamily: TOKENS.typography.headline,
              fontSize,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.5px",
              color: isActive ? activeColor : inactiveColor,
              transform: isActive ? "scale(1.08)" : "scale(1)",
              textShadow: isActive
                ? `0 0 20px ${activeColor}88, 0 4px 10px rgba(0, 0, 0, 0.9)`
                : "0 4px 10px rgba(0, 0, 0, 0.8)",
              transition: "transform 0.08s ease, color 0.08s ease",
              willChange: "transform, color",
            }}
          >
            {item.word}
          </span>
        );
      })}
    </div>
  );
};
