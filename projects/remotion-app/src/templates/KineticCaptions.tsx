import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface WordTimestamp {
  word: string;
  start: number; // in seconds
  end: number;   // in seconds
  probability?: number;
}

export interface KineticCaptionsProps {
  words: WordTimestamp[];
  highlightColor?: string;
  textColor?: string;
  fontSize?: number;
  positionBottom?: number;
}

export const KineticCaptions: React.FC<KineticCaptionsProps> = ({
  words = [],
  highlightColor = "#38BDF8",
  textColor = "#F8FAFC",
  fontSize = 48,
  positionBottom = 120,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find active word
  let targetIndex = words.findIndex(
    (w) => currentTime >= w.start && currentTime <= w.end
  );

  if (targetIndex === -1) {
    // Check if we are in a short pause after a spoken word
    let lastSpoken = -1;
    for (let i = 0; i < words.length; i++) {
      if (currentTime >= words[i].end) {
        lastSpoken = i;
      } else {
        break;
      }
    }
    if (lastSpoken >= 0) {
      const gap = currentTime - words[lastSpoken].end;
      if (gap < 0.8) {
        targetIndex = lastSpoken;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  // Take a sliding window of words (e.g. 5 words)
  const windowSize = 5;
  const startIndex = Math.max(0, targetIndex - 2);
  const visibleWords = words.slice(startIndex, startIndex + windowSize);

  if (visibleWords.length === 0) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: `${positionBottom}px`,
        pointerEvents: "none",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "14px",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          padding: "16px 36px",
          borderRadius: "24px",
          backgroundColor: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        }}
      >
        {visibleWords.map((item, idx) => {
          const isActive = currentTime >= item.start && currentTime <= item.end;
          const isPast = currentTime > item.end;

          // Word entrance bounce when active
          const wordFrame = Math.max(0, frame - Math.floor(item.start * fps));
          const scaleSpring = spring({
            frame: wordFrame,
            fps,
            config: { damping: 12, mass: 0.5 },
          });
          const scale = isActive ? interpolate(scaleSpring, [0, 1], [0.95, 1.1]) : 1.0;

          return (
            <span
              key={`${item.word}-${item.start}`}
              style={{
                fontSize: `${fontSize}px`,
                fontWeight: isActive ? 800 : 600,
                color: isActive ? highlightColor : isPast ? "rgba(248, 250, 252, 0.6)" : textColor,
                transform: `scale(${scale})`,
                transition: "color 0.15s ease",
                textShadow: isActive ? `0 0 20px ${highlightColor}80` : "none",
              }}
            >
              {item.word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
