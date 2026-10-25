import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface UserBoardTrioCardsProps {
  accentColor?: string;
}

export const UserBoardTrioCards: React.FC<UserBoardTrioCardsProps> = ({
  accentColor = "#10B981",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for container
  const enterSpring = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const translateY = interpolate(enterSpring, [0, 1], [40, 0]);

  // Phase 1: Left Card (Photoshop) - frames 0 to 45
  const leftSpring = spring({ frame, fps, config: { damping: 14 } });
  const leftLineProg = interpolate(frame, [10, 40], [0, 1], { extrapolateRight: "clamp" });
  const leftCost = Math.round(interpolate(frame, [10, 40], [0, 239], { extrapolateRight: "clamp" }));

  // Phase 2: Right Card (Premiere Pro) - frames 35 to 80
  const rightSpring = spring({ frame: Math.max(0, frame - 35), fps, config: { damping: 14 } });
  const rightLineProg = interpolate(frame, [45, 75], [0, 1], { extrapolateRight: "clamp" });
  const rightCost = Math.round(interpolate(frame, [45, 75], [0, 239], { extrapolateRight: "clamp" }));

  // Phase 3: Center Card & Upward Light Beam - frames 75 to 135
  const centerSpring = spring({ frame: Math.max(0, frame - 70), fps, config: { damping: 12, mass: 0.7 } });
  const centerLineProg = interpolate(frame, [80, 115], [0, 1], { extrapolateRight: "clamp" });
  const beamIntensity = interpolate(frame, [70, 100], [0, 1], { extrapolateRight: "clamp" });

  // Continuous micro-motion during hold (frames 135 to 225)
  const float = Math.sin(frame / 15) * 5;
  const beamShimmer = 0.3 + Math.sin(frame / 12) * 0.08;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "28px",
          position: "relative",
        }}
      >
        {/* Top Header Pill - Font Size 26px */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 28px",
            borderRadius: "999px",
            background: "rgba(35, 31, 32, 0.85)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(250, 244, 217, 0.15)",
            color: "#FAF4D9",
            fontSize: "26px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
          }}
        >
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: accentColor,
              boxShadow: `0 0 12px ${accentColor}`,
            }}
          />
          The Software Toll vs Open Code
        </div>

        {/* 3 Horizontal Squircle Cards */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            position: "relative",
          }}
        >
          {/* Card 1: Photoshop (Perpetual Subscription) */}
          <div
            style={{
              width: "400px",
              height: "340px",
              borderRadius: "36px",
              background: "linear-gradient(145deg, rgba(35, 31, 32, 0.92) 0%, rgba(20, 18, 19, 0.96) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(250, 244, 217, 0.1)",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5)",
              padding: "36px 32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              color: "#FAF4D9",
              opacity: interpolate(leftSpring, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(leftSpring, [0, 1], [30, 0])}px)`,
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "32px", fontWeight: 800 }}>Photoshop</span>
              <span
                style={{
                  padding: "6px 16px",
                  borderRadius: "999px",
                  background: "rgba(239, 68, 68, 0.15)",
                  color: "#EF4444",
                  fontSize: "26px",
                  fontWeight: 700,
                }}
              >
                ↑ $239/yr
              </span>
            </div>

            {/* Sparkline (Descending / Toll) with Animated Dash */}
            <svg width="100%" height="45" viewBox="0 0 240 45" fill="none">
              <path
                d="M5 10 Q 50 30, 90 20 T 170 32 T 235 35"
                stroke="#EF4444"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="300"
                strokeDashoffset={300 * (1 - leftLineProg)}
                fill="none"
              />
            </svg>

            {/* Price Ticker */}
            <div>
              <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.6)", marginBottom: "4px" }}>
                Annual Recurring Toll
              </div>
              <div style={{ fontSize: "48px", fontWeight: 900, letterSpacing: "-0.03em" }}>
                ${leftCost}.88
              </div>
            </div>
          </div>

          {/* Card 2: Center (ArtCraft & Open Stack - Elevated with Upward Light Beam) */}
          <div
            style={{
              width: "440px",
              height: "380px",
              borderRadius: "40px",
              background: "linear-gradient(145deg, rgba(35, 31, 32, 0.96) 0%, rgba(18, 16, 17, 0.98) 100%)",
              backdropFilter: "blur(24px)",
              border: `2px solid ${accentColor}`,
              boxShadow: `0 35px 80px rgba(0, 0, 0, 0.7), 0 0 ${35 + beamIntensity * 25}px ${accentColor}40`,
              transform: `translateY(${float - interpolate(centerSpring, [0, 1], [0, 15])}px) scale(${interpolate(
                centerSpring,
                [0, 1],
                [0.92, 1.05]
              )})`,
              opacity: interpolate(centerSpring, [0, 1], [0, 1]),
              padding: "40px 36px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              color: "#FAF4D9",
              position: "relative",
              zIndex: 10,
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "36px", fontWeight: 900, color: "#FAF4D9" }}>ArtCraft FOSS</span>
              <span
                style={{
                  padding: "6px 18px",
                  borderRadius: "999px",
                  background: `${accentColor}25`,
                  border: `1px solid ${accentColor}60`,
                  color: accentColor,
                  fontSize: "26px",
                  fontWeight: 800,
                }}
              >
                100% Free
              </span>
            </div>

            {/* Sparkline (Ascending with Animated Dash) */}
            <svg width="100%" height="50" viewBox="0 0 240 50" fill="none">
              <path
                d="M5 42 Q 60 34, 110 22 T 180 12 T 235 6"
                stroke={accentColor}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="300"
                strokeDashoffset={300 * (1 - centerLineProg)}
                fill="none"
              />
            </svg>

            {/* Price Ticker */}
            <div>
              <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.7)", marginBottom: "4px" }}>
                Zero Subscription Fee
              </div>
              <div
                style={{
                  fontSize: "62px",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: accentColor,
                  textShadow: `0 0 25px ${accentColor}60`,
                }}
              >
                $0.00
              </div>
            </div>
          </div>

          {/* Card 3: Premiere Pro */}
          <div
            style={{
              width: "400px",
              height: "340px",
              borderRadius: "36px",
              background: "linear-gradient(145deg, rgba(35, 31, 32, 0.92) 0%, rgba(20, 18, 19, 0.96) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(250, 244, 217, 0.1)",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5)",
              padding: "36px 32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              color: "#FAF4D9",
              opacity: interpolate(rightSpring, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(rightSpring, [0, 1], [30, 0])}px)`,
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "32px", fontWeight: 800 }}>Premiere Pro</span>
              <span
                style={{
                  padding: "6px 16px",
                  borderRadius: "999px",
                  background: "rgba(239, 68, 68, 0.15)",
                  color: "#EF4444",
                  fontSize: "26px",
                  fontWeight: 700,
                }}
              >
                ↑ $239/yr
              </span>
            </div>

            {/* Sparkline (Descending) with Animated Dash */}
            <svg width="100%" height="45" viewBox="0 0 240 45" fill="none">
              <path
                d="M5 8 Q 60 22, 120 18 T 190 28 T 235 34"
                stroke="#EF4444"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="300"
                strokeDashoffset={300 * (1 - rightLineProg)}
                fill="none"
              />
            </svg>

            {/* Price Ticker */}
            <div>
              <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.6)", marginBottom: "4px" }}>
                Annual Recurring Toll
              </div>
              <div style={{ fontSize: "48px", fontWeight: 900, letterSpacing: "-0.03em" }}>
                ${rightCost}.88
              </div>
            </div>
          </div>
        </div>

        {/* Illuminated Bottom Light Slit Projecting Emerald Beam onto Center Card */}
        <div
          style={{
            position: "absolute",
            bottom: "-25px",
            width: "440px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: beamIntensity,
          }}
        >
          {/* Glowing slit line */}
          <div
            style={{
              width: "240px",
              height: "3.5px",
              borderRadius: "999px",
              background: accentColor,
              boxShadow: `0 0 25px ${accentColor}, 0 0 50px ${accentColor}`,
            }}
          />
          {/* Diffused upward radial cone */}
          <div
            style={{
              position: "absolute",
              bottom: "0",
              width: "400px",
              height: "160px",
              background: `radial-gradient(ellipse at bottom, ${accentColor}${Math.round(
                beamShimmer * 100
              )} 0%, transparent 75%)`,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
