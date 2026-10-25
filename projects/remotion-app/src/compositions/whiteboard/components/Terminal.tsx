import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface TerminalProps {
  startFrame?: number;
  x?: number;
  y?: number;
  width?: number;
  command?: string;
  outputLines?: string[];
  highlightLine?: number;
}

export const Terminal: React.FC<TerminalProps> = ({
  startFrame = 0,
  x = 0,
  y = 0,
  width = 620,
  command = "ollama run kokoro",
  outputLines = ["> Model loaded in 0.4s", "> Audio stream: 24kHz ready"],
  highlightLine = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - startFrame);

  const pop = spring({
    frame: relFrame,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.6 },
  });

  const scale = interpolate(pop, [0, 1], [0.85, 1]);
  const translateY = interpolate(pop, [0, 1], [24, 0]);

  // Typing effect
  const charsShown = Math.floor(
    interpolate(relFrame, [4, 18], [0, command.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        borderRadius: "18px",
        background: "#161616",
        border: "2px solid #333333",
        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7)",
        overflow: "hidden",
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity: pop,
        zIndex: 25,
      }}
    >
      {/* Terminal Title Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "14px 20px",
          background: "#1C1C1C",
          borderBottom: "1px solid #282828",
        }}
      >
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FF5F56" }} />
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FFBD2E" }} />
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#27C93F" }} />
        <span
          style={{
            marginLeft: "12px",
            fontSize: "26px",
            color: "#888888",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          terminal — bash
        </span>
      </div>

      {/* Terminal Body */}
      <div
        style={{
          padding: "24px 28px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "34px", // Min 34px for mono per spec
          lineHeight: 1.45,
          color: "#EDEDED",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "#FF6B35", fontWeight: 900 }}>$</span>
          <span>{command.slice(0, charsShown)}</span>
          {charsShown < command.length && (
            <span style={{ width: "10px", height: "24px", background: "#FF6B35", display: "inline-block" }} />
          )}
        </div>

        {relFrame > 18 && (
          <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {outputLines.map((line, idx) => (
              <div
                key={idx}
                style={{
                  color: idx === highlightLine ? "#FF6B35" : "#BDBDBD",
                  fontSize: "34px",
                }}
              >
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
