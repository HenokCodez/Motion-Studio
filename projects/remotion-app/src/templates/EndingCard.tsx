import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface EndingCardProps {
  callToAction?: string;
  website?: string;
  socials?: string[];
  accentColor?: string;
}

export const EndingCard: React.FC<EndingCardProps> = ({
  callToAction = "Ready to Automate Your Video Production?",
  website = "motion-studio.local",
  socials = ["@antigravity", "github.com/motion-studio"],
  accentColor = "#3B82F6",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, mass: 0.7 } });
  const scale = interpolate(entrance, [0, 1], [0.9, 1], { extrapolateRight: "clamp" });
  const opacity = interpolate(entrance, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(entrance, [0, 1], [30, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 100px",
        fontFamily: "'Inter', sans-serif",
        textAlign: "center",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${y}px) scale(${scale})`,
          padding: "60px 80px",
          borderRadius: "36px",
          backgroundColor: "rgba(30, 41, 59, 0.75)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.5)",
          maxWidth: "1000px",
        }}
      >
        <h2
          style={{
            fontSize: "56px",
            fontWeight: 800,
            lineHeight: 1.15,
            color: "#FFFFFF",
            margin: 0,
            marginBottom: "32px",
          }}
        >
          {callToAction}
        </h2>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 36px",
            borderRadius: "16px",
            backgroundColor: accentColor,
            color: "#FFFFFF",
            fontSize: "24px",
            fontWeight: 700,
            boxShadow: `0 10px 25px ${accentColor}60`,
            marginBottom: "36px",
          }}
        >
          {website}
        </div>

        <div style={{ display: "flex", gap: "24px", justifyContent: "center" }}>
          {socials.map((s, idx) => (
            <span key={idx} style={{ color: "#94A3B8", fontSize: "18px", fontWeight: 500 }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
