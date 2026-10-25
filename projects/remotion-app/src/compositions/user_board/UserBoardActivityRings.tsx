import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface UserBoardActivityRingsProps {
  accentColor?: string;
}

export const UserBoardActivityRings: React.FC<UserBoardActivityRingsProps> = ({
  accentColor = "#1677FF",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const translateY = interpolate(enterSpring, [0, 1], [35, 0]);

  // Sequential ring arc animations across 225 frames
  // Ring 1 (Blue): frames 25 to 75
  const ring1Prog = interpolate(frame, [25, 75], [0, 0.88], { extrapolateRight: "clamp" });
  const row1Prog = interpolate(frame, [25, 75], [0, 88], { extrapolateRight: "clamp" });

  // Ring 2 (Emerald): frames 70 to 120
  const ring2Prog = interpolate(frame, [70, 120], [0, 0.76], { extrapolateRight: "clamp" });
  const row2Prog = interpolate(frame, [70, 120], [0, 76], { extrapolateRight: "clamp" });

  // Ring 3 (Amber): frames 115 to 160
  const ring3Prog = interpolate(frame, [115, 160], [0, 0.65], { extrapolateRight: "clamp" });
  const row3Prog = interpolate(frame, [115, 160], [0, 65], { extrapolateRight: "clamp" });

  // Center badge unlock burst (frame 160+)
  const badgeBurst = spring({
    frame: Math.max(0, frame - 158),
    fps,
    config: { damping: 12, mass: 0.6 },
  });

  // Continuous micro-motion during hold
  const subtleFloat = Math.sin(frame / 16) * 4;
  const ringShimmer = Math.sin(frame / 12) * 4;

  const r1 = 110;
  const c1 = 2 * Math.PI * r1;
  const r2 = 86;
  const c2 = 2 * Math.PI * r2;
  const r3 = 62;
  const c3 = 2 * Math.PI * r3;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY + subtleFloat}px)`,
          width: "1060px",
          height: "440px",
          borderRadius: "48px",
          background: "linear-gradient(145deg, rgba(35, 31, 32, 0.95) 0%, rgba(18, 16, 17, 0.98) 100%)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(250, 244, 217, 0.12)",
          boxShadow: "0 35px 80px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(250, 244, 217, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "48px 60px",
          color: "#FAF4D9",
        }}
      >
        {/* Left Side: Telemetry Metrics with Sequential Illumination */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Header - Font Size 36px */}
          <div style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Open Infrastructure
          </div>

          {/* Metric 1 (Blue) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              opacity: frame >= 25 ? 1 : 0.4,
              transition: "opacity 0.2s ease-out",
            }}
          >
            <span
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#1677FF",
                boxShadow: frame >= 25 ? "0 0 14px #1677FF" : "none",
              }}
            />
            <div style={{ minWidth: "290px" }}>
              <div style={{ fontSize: "28px", fontWeight: 700 }}>24GB VRAM Compute</div>
              <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.6)" }}>Local RTX Hardware</div>
            </div>
            <span
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                background: "rgba(22, 119, 255, 0.15)",
                color: "#1677FF",
                fontSize: "26px",
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {Math.round(row1Prog)}%
            </span>
          </div>

          {/* Metric 2 (Emerald) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              opacity: frame >= 70 ? 1 : 0.4,
              transition: "opacity 0.2s ease-out",
            }}
          >
            <span
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#10B981",
                boxShadow: frame >= 70 ? "0 0 14px #10B981" : "none",
              }}
            />
            <div style={{ minWidth: "290px" }}>
              <div style={{ fontSize: "28px", fontWeight: 700 }}>Open Weights Pipeline</div>
              <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.6)" }}>DeepSeek & Llama Stack</div>
            </div>
            <span
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                background: "rgba(16, 185, 129, 0.15)",
                color: "#10B981",
                fontSize: "26px",
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {Math.round(row2Prog)}%
            </span>
          </div>

          {/* Metric 3 (Amber) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              opacity: frame >= 115 ? 1 : 0.4,
              transition: "opacity 0.2s ease-out",
            }}
          >
            <span
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#F59E0B",
                boxShadow: frame >= 115 ? "0 0 14px #F59E0B" : "none",
              }}
            />
            <div style={{ minWidth: "290px" }}>
              <div style={{ fontSize: "28px", fontWeight: 700 }}>Ecosystem Tooling</div>
              <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.6)" }}>ArtCraft & DaVinci</div>
            </div>
            <span
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                background: "rgba(245, 158, 11, 0.15)",
                color: "#F59E0B",
                fontSize: "26px",
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {Math.round(row3Prog)}%
            </span>
          </div>
        </div>

        {/* Right Side: 3 Concentric Activity Rings with Sequential Arc Draws */}
        <div style={{ position: "relative", width: "280px", height: "280px" }}>
          <svg
            width="280"
            height="280"
            viewBox="0 0 280 280"
            style={{ transform: `rotate(${-90 + ringShimmer}deg)` }}
          >
            {/* Background Tracks */}
            <circle cx="140" cy="140" r={r1} fill="none" stroke="rgba(250, 244, 217, 0.08)" strokeWidth="15" />
            <circle cx="140" cy="140" r={r2} fill="none" stroke="rgba(250, 244, 217, 0.08)" strokeWidth="15" />
            <circle cx="140" cy="140" r={r3} fill="none" stroke="rgba(250, 244, 217, 0.08)" strokeWidth="15" />

            {/* Active Rings with Round Caps & Glow */}
            {/* Ring 1: Blue */}
            <circle
              cx="140"
              cy="140"
              r={r1}
              fill="none"
              stroke="#1677FF"
              strokeWidth="15"
              strokeLinecap="round"
              strokeDasharray={c1}
              strokeDashoffset={c1 * (1 - ring1Prog)}
              style={{ filter: "drop-shadow(0 0 10px #1677FF)" }}
            />
            {/* Ring 2: Emerald */}
            <circle
              cx="140"
              cy="140"
              r={r2}
              fill="none"
              stroke="#10B981"
              strokeWidth="15"
              strokeLinecap="round"
              strokeDasharray={c2}
              strokeDashoffset={c2 * (1 - ring2Prog)}
              style={{ filter: "drop-shadow(0 0 10px #10B981)" }}
            />
            {/* Ring 3: Amber */}
            <circle
              cx="140"
              cy="140"
              r={r3}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="15"
              strokeLinecap="round"
              strokeDasharray={c3}
              strokeDashoffset={c3 * (1 - ring3Prog)}
              style={{ filter: "drop-shadow(0 0 10px #F59E0B)" }}
            />
          </svg>

          {/* Center Pill Badge - Bursting on completion - Font Size 36px and 26px */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${0.88 + badgeBurst * 0.22})`,
              width: "82px",
              height: "82px",
              borderRadius: "50%",
              background: frame >= 158 ? "#FAF4D9" : "rgba(250, 244, 217, 0.2)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: frame >= 158 ? "0 0 25px rgba(250, 244, 217, 0.6)" : "none",
              transition: "background 0.3s ease-out",
            }}
          >
            <div style={{ fontSize: "30px", fontWeight: 900, color: "#231F20", lineHeight: 1 }}>$0</div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: "#231F20", opacity: 0.85, lineHeight: 1 }}>FEE</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
