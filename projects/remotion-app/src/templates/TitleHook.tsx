import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface TitleHookProps {
  title?: string;
  subtitle?: string;
  tag?: string;
  accentColor?: string;
}

export const TitleHook: React.FC<TitleHookProps> = ({
  title = "Scale Your Content Workflow",
  subtitle = "High-velocity motion graphics powered by local AI and code",
  tag = "AUTOMATION STUDIO",
  accentColor = "#3B82F6",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring animations
  const tagSpring = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  const titleSpring = spring({ frame: frame - 6, fps, config: { damping: 13, mass: 0.7 } });
  const subSpring = spring({ frame: frame - 14, fps, config: { damping: 15, mass: 0.8 } });

  const tagOpacity = interpolate(tagSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const tagY = interpolate(tagSpring, [0, 1], [25, 0], { extrapolateRight: "clamp" });

  const titleScale = interpolate(titleSpring, [0, 1], [0.92, 1], { extrapolateRight: "clamp" });
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(titleSpring, [0, 1], [30, 0], { extrapolateRight: "clamp" });

  const subOpacity = interpolate(subSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const subY = interpolate(subSpring, [0, 1], [20, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 120px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#F8FAFC",
        textAlign: "center",
      }}
    >
      {/* Badge / Tag */}
      <div
        style={{
          opacity: tagOpacity,
          transform: `translateY(${tagY}px)`,
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 16px",
          borderRadius: "9999px",
          backgroundColor: "rgba(59, 130, 246, 0.12)",
          border: `1px solid ${accentColor}40`,
          color: accentColor,
          fontSize: "14px",
          fontWeight: 700,
          letterSpacing: "0.15em",
          marginBottom: "24px",
          textTransform: "uppercase",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: accentColor,
            boxShadow: `0 0 10px ${accentColor}`,
          }}
        />
        {tag}
      </div>

      {/* Main Title */}
      <h1
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px) scale(${titleScale})`,
          fontSize: "76px",
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          margin: 0,
          maxWidth: "1200px",
          background: "linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        style={{
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          fontSize: "28px",
          fontWeight: 400,
          lineHeight: 1.4,
          color: "#94A3B8",
          marginTop: "24px",
          maxWidth: "900px",
        }}
      >
        {subtitle}
      </p>
    </AbsoluteFill>
  );
};
