import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export interface LogoIntroProps {
  logoSrc?: string;
  brandName?: string;
  tagline?: string;
  accentColor?: string;
}

export const LogoIntro: React.FC<LogoIntroProps> = ({
  logoSrc,
  brandName = "MOTION STUDIO",
  tagline = "AI-Driven Motion Design",
  accentColor = "#3B82F6",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const textSpring = spring({ frame: frame - 10, fps, config: { damping: 14, mass: 0.7 } });

  const scale = interpolate(logoSpring, [0, 1], [0.6, 1], { extrapolateRight: "clamp" });
  const opacity = interpolate(logoSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const glow = interpolate(logoSpring, [0, 1], [0, 40], { extrapolateRight: "clamp" });

  const textY = interpolate(textSpring, [0, 1], [20, 0], { extrapolateRight: "clamp" });
  const textOpacity = interpolate(textSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Logo Container / Glow Ring */}
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          width: "140px",
          height: "140px",
          borderRadius: "36px",
          background: `linear-gradient(135deg, ${accentColor} 0%, #1D4ED8 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 ${glow}px ${accentColor}80`,
          marginBottom: "32px",
        }}
      >
        {logoSrc ? (
          <Img src={staticFile(logoSrc)} style={{ maxWidth: "80px", maxHeight: "80px", objectFit: "contain" }} />
        ) : (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </div>

      {/* Brand Name */}
      <h2
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          fontSize: "52px",
          fontWeight: 900,
          letterSpacing: "-0.02em",
          color: "#FFFFFF",
          margin: 0,
        }}
      >
        {brandName}
      </h2>

      {/* Tagline */}
      <p
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          fontSize: "22px",
          color: "#94A3B8",
          marginTop: "12px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {tagline}
      </p>
    </AbsoluteFill>
  );
};
