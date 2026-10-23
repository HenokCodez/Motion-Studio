import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { VANTA_THEME } from "./VantaBackground";

/**
 * 3D Perspective Grid Floor (from VantaBrief Reference Images)
 */
export const Grid3DFloor: React.FC<{ glowColor?: string; opacity?: number }> = ({
  glowColor = VANTA_THEME.accent,
  opacity = 0.35,
}) => {
  return (
    <AbsoluteFill
      style={{
        perspective: "600px",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "200%",
          height: "120%",
          left: "-50%",
          bottom: "-40%",
          backgroundImage: `
            linear-gradient(to right, ${glowColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${glowColor} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: "rotateX(75deg)",
          transformOrigin: "center bottom",
          opacity,
          maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)",
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Pop-In Badge with Spring Overshoot
 */
export const PopBadge: React.FC<{
  text: string;
  enterFrame?: number;
  color?: string;
  bgColor?: string;
  fontSize?: number;
  fontFamily?: string;
  icon?: string;
}> = ({
  text,
  enterFrame = 0,
  color = VANTA_THEME.accent,
  bgColor = "rgba(22, 119, 255, 0.18)",
  fontSize = 20,
  fontFamily = VANTA_THEME.fontPixel,
  icon,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < enterFrame) return null;

  const spr = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 12, stiffness: 220, mass: 0.6 },
  });

  const scale = interpolate(spr, [0, 1], [0.3, 1], { extrapolateRight: "clamp" });
  const opacity = interpolate(spr, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 18px",
        borderRadius: "999px",
        backgroundColor: bgColor,
        border: `1px solid ${color}60`,
        color,
        fontSize: `${fontSize}px`,
        fontFamily,
        fontWeight: 700,
        letterSpacing: "2px",
        textTransform: "uppercase",
        boxShadow: `0 0 20px ${color}30`,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {icon && <span>{icon}</span>}
      <span>{text}</span>
    </div>
  );
};

/**
 * Pop-In SVG Logo Card with Brand Glow & Directional Motion
 */
export const LogoCard: React.FC<{
  svgName: string;
  title: string;
  subtitle?: string;
  enterFrame?: number;
  accentColor?: string;
  direction?: "left" | "right" | "top" | "bottom" | "zoom";
  badgeText?: string;
}> = ({
  svgName,
  title,
  subtitle,
  enterFrame = 0,
  accentColor = VANTA_THEME.accent,
  direction = "zoom",
  badgeText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < enterFrame) return null;

  const spr = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 13, stiffness: 200, mass: 0.7 },
  });

  let transform = `scale(${interpolate(spr, [0, 1], [0.7, 1])})`;
  if (direction === "left") {
    transform = `translateX(${interpolate(spr, [0, 1], [-100, 0])}px) scale(${interpolate(spr, [0, 1], [0.85, 1])})`;
  } else if (direction === "right") {
    transform = `translateX(${interpolate(spr, [0, 1], [100, 0])}px) scale(${interpolate(spr, [0, 1], [0.85, 1])})`;
  } else if (direction === "top") {
    transform = `translateY(${interpolate(spr, [0, 1], [-80, 0])}px) scale(${interpolate(spr, [0, 1], [0.85, 1])})`;
  } else if (direction === "bottom") {
    transform = `translateY(${interpolate(spr, [0, 1], [80, 0])}px) scale(${interpolate(spr, [0, 1], [0.85, 1])})`;
  }

  const opacity = interpolate(spr, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        padding: "20px 28px",
        borderRadius: "18px",
        backgroundColor: VANTA_THEME.surface,
        border: `1px solid ${accentColor}60`,
        boxShadow: `0 16px 36px rgba(0,0,0,0.5), 0 0 24px ${accentColor}25`,
        transform,
        opacity,
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "12px",
          backgroundColor: "rgba(255,255,255,0.05)",
          padding: "8px",
        }}
      >
        <Img
          src={svgName.startsWith("http") || svgName.startsWith("/") ? svgName : staticFile(`images/${svgName}`)}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontFamily: VANTA_THEME.fontSubtitle,
              fontSize: "24px",
              color: VANTA_THEME.textPrimary,
              fontWeight: 800,
            }}
          >
            {title}
          </span>
          {badgeText && (
            <span
              style={{
                fontFamily: VANTA_THEME.fontPixel,
                fontSize: "14px",
                color: accentColor,
                backgroundColor: `${accentColor}20`,
                padding: "3px 8px",
                borderRadius: "6px",
              }}
            >
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && (
          <span
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "16px",
              color: VANTA_THEME.textMuted,
              marginTop: "4px",
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Image / UI Card with Float & Tilt
 */
export const ImagePreviewCard: React.FC<{
  imageName: string;
  title?: string;
  badge?: string;
  enterFrame?: number;
  maxWidth?: number;
  accentColor?: string;
}> = ({
  imageName,
  title,
  badge,
  enterFrame = 0,
  maxWidth = 1000,
  accentColor = VANTA_THEME.accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < enterFrame) return null;

  const spr = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.8 },
  });

  const scale = interpolate(spr, [0, 1], [0.85, 1], { extrapolateRight: "clamp" });
  const opacity = interpolate(spr, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(spr, [0, 1], [40, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: `${maxWidth}px`,
        transform: `translateY(${y}px) scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          width: "100%",
          borderRadius: "20px",
          overflow: "hidden",
          border: `1px solid ${accentColor}50`,
          boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 30px ${accentColor}25`,
          backgroundColor: VANTA_THEME.surface,
        }}
      >
        <Img
          src={imageName.startsWith("http") || imageName.startsWith("/") ? imageName : staticFile(`images/${imageName}`)}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
      {(title || badge) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "16px",
            padding: "0 8px",
          }}
        >
          {title && (
            <span
              style={{
                fontFamily: VANTA_THEME.fontSubtitle,
                fontSize: "22px",
                color: VANTA_THEME.textPrimary,
              }}
            >
              {title}
            </span>
          )}
          {badge && (
            <span
              style={{
                fontFamily: VANTA_THEME.fontPixel,
                fontSize: "16px",
                color: accentColor,
                backgroundColor: `${accentColor}20`,
                padding: "4px 12px",
                borderRadius: "8px",
              }}
            >
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
