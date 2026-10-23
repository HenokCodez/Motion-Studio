import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface ComparisonGridProps {
  leftTitle?: string;
  leftPoints?: string[];
  rightTitle?: string;
  rightPoints?: string[];
}

export const ComparisonGrid: React.FC<ComparisonGridProps> = ({
  leftTitle = "Traditional Editing",
  leftPoints = [
    "Manual keyframing and manual transcript typing",
    "Fragile audio-visual timing sync",
    "Slow rendering and inconsistent styles",
  ],
  rightTitle = "AI-Assisted Antigravity Studio",
  rightPoints = [
    "Local faster-whisper with word-level precision",
    "Code-driven Remotion & Manim animations",
    "Instant asset discovery & zero subscription fees",
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftSpring = spring({ frame, fps, config: { damping: 14, mass: 0.7 } });
  const rightSpring = spring({ frame: frame - 10, fps, config: { damping: 14, mass: 0.7 } });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "48px",
        padding: "0 100px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Left Card */}
      <div
        style={{
          flex: 1,
          opacity: interpolate(leftSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateX(${interpolate(leftSpring, [0, 1], [-40, 0], { extrapolateRight: "clamp" })}px)`,
          padding: "44px 38px",
          borderRadius: "28px",
          backgroundColor: "rgba(30, 41, 59, 0.4)",
          border: "1px solid rgba(239, 68, 68, 0.25)",
          color: "#F8FAFC",
        }}
      >
        <div style={{ color: "#EF4444", fontWeight: 700, fontSize: "16px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          THE OLD WAY
        </div>
        <h3 style={{ fontSize: "36px", fontWeight: 800, margin: "10px 0 24px 0", color: "#FCA5A5" }}>{leftTitle}</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
          {leftPoints.map((pt, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "20px", color: "#94A3B8", lineHeight: 1.4 }}>
              <span style={{ color: "#EF4444", fontWeight: 900 }}>✕</span>
              {pt}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Card */}
      <div
        style={{
          flex: 1,
          opacity: interpolate(rightSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateX(${interpolate(rightSpring, [0, 1], [40, 0], { extrapolateRight: "clamp" })}px)`,
          padding: "44px 38px",
          borderRadius: "28px",
          backgroundColor: "rgba(30, 41, 59, 0.75)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(59, 130, 246, 0.4)",
          boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
          color: "#F8FAFC",
        }}
      >
        <div style={{ color: "#3B82F6", fontWeight: 700, fontSize: "16px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          MOTION STUDIO
        </div>
        <h3 style={{ fontSize: "36px", fontWeight: 800, margin: "10px 0 24px 0", color: "#93C5FD" }}>{rightTitle}</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
          {rightPoints.map((pt, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "20px", color: "#E2E8F0", lineHeight: 1.4 }}>
              <span style={{ color: "#10B981", fontWeight: 900 }}>✓</span>
              {pt}
            </li>
          ))}
        </ul>
      </div>
    </AbsoluteFill>
  );
};
