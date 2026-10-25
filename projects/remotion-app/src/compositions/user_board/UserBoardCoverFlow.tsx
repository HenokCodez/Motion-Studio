import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface UserBoardCoverFlowProps {
  title?: string;
  subtitle?: string;
  accentColor?: string;
}

export const UserBoardCoverFlow: React.FC<UserBoardCoverFlowProps> = ({
  title = "Local AI Stack",
  subtitle = "Run high-performance models locally without subscriptions",
  accentColor = "#1677FF",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const translateY = interpolate(enterSpring, [0, 1], [40, 0]);

  // Carousel transition phase: Shift between tools (frames 30 to 90)
  const carouselShift = interpolate(frame, [30, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Center card activation pulse (frame 85+)
  const heroActivation = spring({
    frame: Math.max(0, frame - 80),
    fps,
    config: { damping: 12, mass: 0.6 },
  });

  // Continuous subtle 3D breathing & floating
  const float = Math.sin(frame / 14) * 6;
  const tiltY = Math.sin(frame / 22) * 2.5;

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
          perspective: "1200px",
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
          VantaBrief Intel • Reference UI
        </div>

        {/* 3D Cover-Flow Card Carousel */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            transformStyle: "preserve-3d",
            transform: `rotateY(${tiltY}deg)`,
          }}
        >
          {/* Left Card: ArtCraft */}
          <div
            style={{
              width: "360px",
              height: "480px",
              borderRadius: "32px",
              background: "linear-gradient(145deg, rgba(35, 31, 32, 0.92) 0%, rgba(20, 18, 19, 0.95) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(250, 244, 217, 0.1)",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
              transform: `rotateY(${22 + (1 - carouselShift) * 6}deg) scale(${0.86 + (1 - carouselShift) * 0.08}) translateZ(${
                -60 + (1 - carouselShift) * 40
              }px)`,
              opacity: 0.65 + (1 - carouselShift) * 0.25,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "36px 24px",
              color: "#FAF4D9",
              transition: "transform 0.1s ease-out",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", marginTop: "16px" }}>
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "24px",
                  background: "rgba(250, 244, 217, 0.06)",
                  border: "1px solid rgba(250, 244, 217, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FAF4D9" strokeWidth="1.8">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div style={{ fontSize: "34px", fontWeight: 800, letterSpacing: "-0.02em" }}>ArtCraft</div>
              <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.65)" }}>Open Suite</div>
            </div>
            <div
              style={{
                padding: "8px 20px",
                borderRadius: "999px",
                background: "rgba(250, 244, 217, 0.08)",
                fontSize: "26px",
                fontWeight: 700,
                color: "rgba(250, 244, 217, 0.85)",
              }}
            >
              Adobe Alternative
            </div>
          </div>

          {/* Center Card: Local Models (Hero Focus, Elevated, Living Glow) */}
          <div
            style={{
              width: "440px",
              height: "540px",
              borderRadius: "36px",
              background: "linear-gradient(145deg, rgba(35, 31, 32, 0.96) 0%, rgba(18, 16, 17, 0.98) 100%)",
              backdropFilter: "blur(24px)",
              border: `${2 + heroActivation * 0.5}px solid ${accentColor}`,
              boxShadow: `0 35px 80px rgba(0, 0, 0, 0.7), 0 0 ${35 + heroActivation * 25}px ${accentColor}50`,
              transform: `translateY(${float}px) scale(${1.0 + carouselShift * 0.06}) translateZ(${
                20 + carouselShift * 70
              }px)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "40px 32px",
              color: "#FAF4D9",
              position: "relative",
              zIndex: 10,
            }}
          >
            {/* Top Badge - Font Size 26px */}
            <div
              style={{
                padding: "8px 22px",
                borderRadius: "999px",
                background: `${accentColor}25`,
                border: `1px solid ${accentColor}60`,
                fontSize: "26px",
                fontWeight: 800,
                color: accentColor,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                transform: `scale(${1 + heroActivation * 0.05})`,
              }}
            >
              Active System
            </div>

            {/* Emblem / Geometric Icon with Shimmer */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
              <div
                style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "28px",
                  background: `linear-gradient(135deg, ${accentColor}20 0%, rgba(250, 244, 217, 0.05) 100%)`,
                  border: `1px solid ${accentColor}80`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 0 ${25 + heroActivation * 20}px ${accentColor}40`,
                }}
              >
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8">
                  <rect x="4" y="4" width="16" height="16" rx="4" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="M15 9h.01M9 15h.01M15 15h.01" />
                  <path d="M4 12h16M12 4v16" strokeOpacity="0.3" />
                </svg>
              </div>

              <div style={{ fontSize: "40px", fontWeight: 900, letterSpacing: "-0.03em" }}>Local Models</div>
              <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.75)", textAlign: "center" }}>
                Zero Subscriptions • Private
              </div>
            </div>

            {/* Status Pill with Pulsing Dot - Font Size 26px */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 24px",
                borderRadius: "999px",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                color: "#10B981",
                fontSize: "26px",
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#10B981",
                  boxShadow: `0 0 ${6 + Math.sin(frame / 8) * 4}px #10B981`,
                }}
              />
              100% On-Device
            </div>
          </div>

          {/* Right Card: DaVinci / Blender */}
          <div
            style={{
              width: "360px",
              height: "480px",
              borderRadius: "32px",
              background: "linear-gradient(145deg, rgba(35, 31, 32, 0.92) 0%, rgba(20, 18, 19, 0.95) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(250, 244, 217, 0.1)",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
              transform: `rotateY(-22deg) scale(0.88) translateZ(-60px)`,
              opacity: 0.7,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "36px 24px",
              color: "#FAF4D9",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", marginTop: "16px" }}>
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "24px",
                  background: "rgba(250, 244, 217, 0.06)",
                  border: "1px solid rgba(250, 244, 217, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FAF4D9" strokeWidth="1.8">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                  <line x1="12" y1="22" x2="12" y2="12" />
                  <line x1="22" y1="8.5" x2="12" y2="12" />
                  <line x1="2" y1="8.5" x2="12" y2="12" />
                </svg>
              </div>
              <div style={{ fontSize: "34px", fontWeight: 800, letterSpacing: "-0.02em" }}>Open 3D</div>
              <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.65)" }}>Blender / FOSS</div>
            </div>
            <div
              style={{
                padding: "8px 20px",
                borderRadius: "999px",
                background: "rgba(250, 244, 217, 0.08)",
                fontSize: "26px",
                fontWeight: 700,
                color: "rgba(250, 244, 217, 0.85)",
              }}
            >
              Production Ready
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
