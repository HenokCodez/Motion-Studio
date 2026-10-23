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

export const VANTA_COLORS = {
  bg: "#231F20",
  bgSubtle: "#2C2728",
  surface: "#1C191A",
  surfaceElevated: "#252122",
  primary: "#1677FF",
  accent: "#1677FF",
  textPrimary: "#FAF4D9",
  textMuted: "rgba(250, 244, 217, 0.65)",
  border: "rgba(250, 244, 217, 0.12)",
  borderActive: "rgba(22, 119, 255, 0.6)",
  glow: "rgba(22, 119, 255, 0.35)",
  badgeBg: "rgba(22, 119, 255, 0.18)",
  redAccent: "#EF4444",
  greenAccent: "#10B981",
  yellowAccent: "#F59E0B",
};

/**
 * Continuous Camera Motion Wrapper (Ensures NO scene is ever static!)
 */
export const ContinuousMotion: React.FC<{
  children: React.ReactNode;
  scaleRange?: [number, number];
  panRange?: [number, number];
}> = ({ children, scaleRange = [1, 1.05], panRange = [0, -15] }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, durationInFrames], scaleRange, {
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [0, durationInFrames], panRange, {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale}) translateY(${translateY}px)`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * 3D Perspective Grid Floor (from VantaBrief Reference Images)
 */
export const Grid3DFloor: React.FC<{ glowColor?: string; opacity?: number }> = ({
  glowColor = VANTA_COLORS.primary,
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
 * Transparent Founder / CEO Cutout (Inspired by Reference 1 & 6)
 */
export const CutoutPerson: React.FC<{
  imageName: string;
  name: string;
  title: string;
  enterFrame?: number;
  position?: "bottom-left" | "bottom-right" | "center-right" | "center-left";
  height?: number;
  accentColor?: string;
}> = ({
  imageName,
  name,
  title,
  enterFrame = 0,
  position = "bottom-right",
  height = 700,
  accentColor = VANTA_COLORS.primary,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < enterFrame) return null;

  const spr = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 13, stiffness: 180, mass: 0.6 },
  });

  const translateY = interpolate(spr, [0, 1], [300, 0]);
  const scale = interpolate(spr, [0, 1], [0.8, 1]);
  const opacity = interpolate(spr, [0, 1], [0, 1]);
  // Subtle breathing floating hover
  const floatY = Math.sin((frame - enterFrame) / 18) * 8;

  let posStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "0px",
    right: "120px",
  };
  if (position === "bottom-left") {
    posStyle = { position: "absolute", bottom: "0px", left: "120px" };
  } else if (position === "center-right") {
    posStyle = { position: "absolute", top: "50%", right: "120px", transform: "translateY(-50%)" };
  } else if (position === "center-left") {
    posStyle = { position: "absolute", top: "50%", left: "120px", transform: "translateY(-50%)" };
  }

  return (
    <div
      style={{
        ...posStyle,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 20,
        transform: `translateY(${translateY + floatY}px) scale(${scale})`,
        opacity,
      }}
    >
      <div style={{ position: "relative" }}>
        <Img
          src={imageName.startsWith("http") || imageName.startsWith("/") ? imageName : staticFile(`images/${imageName}`)}
          style={{
            height: `${height}px`,
            width: "auto",
            display: "block",
            filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.8)) drop-shadow(0 0 35px ${accentColor}40)`,
          }}
        />
        {/* Name Badge */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(28, 25, 26, 0.9)",
            border: `1px solid ${accentColor}80`,
            padding: "8px 20px",
            borderRadius: "999px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: `0 8px 24px rgba(0,0,0,0.6), 0 0 20px ${accentColor}30`,
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              fontFamily: "'Yolk Bold', sans-serif",
              fontSize: "18px",
              color: VANTA_COLORS.textPrimary,
              fontWeight: 800,
            }}
          >
            {name}
          </span>
          <span
            style={{
              fontFamily: "'VP Pixel', monospace",
              fontSize: "13px",
              color: accentColor,
              backgroundColor: `${accentColor}25`,
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            {title}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Falling Money Animation (Reference 1: Dario Amodei & Sam Altman with money raining)
 */
export const RainingMoney: React.FC<{ count?: number }> = ({ count = 8 }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none", zIndex: 5 }}>
      {Array.from({ length: count }).map((_, i) => {
        const speed = 4 + (i % 4) * 2;
        const xPos = 80 + i * 220;
        const yPos = ((frame * speed + i * 180) % 1300) - 200;
        const rotation = Math.sin((frame + i * 40) / 20) * 25 + (i * 35) % 360;
        const scale = 0.6 + (i % 3) * 0.2;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${xPos}px`,
              top: `${yPos}px`,
              transform: `rotate(${rotation}deg) scale(${scale})`,
              opacity: 0.85,
              filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
            }}
          >
            <Img
              src={staticFile("images/falling_dollar.png")}
              style={{ width: "240px", height: "auto" }}
            />
          </div>
        );
      })}
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
  color = VANTA_COLORS.primary,
  bgColor = VANTA_COLORS.badgeBg,
  fontSize = 20,
  fontFamily = "'VP Pixel', monospace",
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
 * Pop-In SVG Logo Card with Brand Glow
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
  accentColor = VANTA_COLORS.primary,
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
        backgroundColor: VANTA_COLORS.surface,
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
              fontFamily: "'Yolk Bold', sans-serif",
              fontSize: "24px",
              color: VANTA_COLORS.textPrimary,
              fontWeight: 800,
            }}
          >
            {title}
          </span>
          {badgeText && (
            <span
              style={{
                fontFamily: "'VP Pixel', monospace",
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
              color: VANTA_COLORS.textMuted,
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
 * Real Website Capture in macOS Browser Window (with optional sweeping highlighter)
 */
export const RealBrowserFrame: React.FC<{
  imageName: string;
  url: string;
  title?: string;
  badge?: string;
  enterFrame?: number;
  highlightText?: string;
  maxWidth?: number;
}> = ({
  imageName,
  url,
  title,
  badge,
  enterFrame = 0,
  highlightText,
  maxWidth = 1380,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < enterFrame) return null;

  const spr = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  const scale = interpolate(spr, [0, 1], [0.92, 1], { extrapolateRight: "clamp" });
  const opacity = interpolate(spr, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(spr, [0, 1], [30, 0], { extrapolateRight: "clamp" });

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
          backgroundColor: "#1E1E22",
          border: `1px solid ${VANTA_COLORS.border}`,
          boxShadow: "0 28px 60px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
      >
        {/* Browser Top Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "14px 20px",
            backgroundColor: "#28282D",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#EF4444" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#F59E0B" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#10B981" }} />
          </div>
          <div
            style={{
              flex: 1,
              maxWidth: "520px",
              margin: "0 auto",
              backgroundColor: "rgba(0,0,0,0.3)",
              borderRadius: "8px",
              padding: "6px 16px",
              fontSize: "14px",
              fontFamily: "'VP Pixel', monospace",
              color: VANTA_COLORS.textMuted,
              textAlign: "center",
            }}
          >
            🔒 {url}
          </div>
        </div>

        {/* Real Screenshot Body */}
        <div style={{ position: "relative", width: "100%", maxHeight: "640px", overflow: "hidden" }}>
          <Img
            src={imageName.startsWith("http") || imageName.startsWith("/") ? imageName : staticFile(`images/${imageName}`)}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
          {highlightText && (
            <div
              style={{
                position: "absolute",
                bottom: "30px",
                left: "40px",
                right: "40px",
                backgroundColor: "rgba(35, 31, 32, 0.92)",
                border: `1px solid ${VANTA_COLORS.primary}`,
                borderRadius: "14px",
                padding: "16px 24px",
                color: "#FAF4D9",
                fontFamily: "system-ui, sans-serif",
                fontSize: "24px",
                fontWeight: 600,
                boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
              }}
            >
              <span style={{ backgroundColor: "rgba(245, 158, 11, 0.4)", padding: "2px 8px", borderRadius: "4px" }}>
                {highlightText}
              </span>
            </div>
          )}
        </div>
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
                fontFamily: "'Yolk Bold', sans-serif",
                fontSize: "24px",
                color: VANTA_COLORS.textPrimary,
              }}
            >
              {title}
            </span>
          )}
          {badge && (
            <span
              style={{
                fontFamily: "'VP Pixel', monospace",
                fontSize: "16px",
                color: VANTA_COLORS.primary,
                backgroundColor: `${VANTA_COLORS.primary}20`,
                padding: "4px 14px",
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

/**
 * Highlighting macOS Browser Window (sweeping yellow highlight bar)
 */
export const HighlightBrowserWindow: React.FC<{
  url: string;
  text: string;
  highlightText: string;
  enterFrame?: number;
  highlightStartFrame?: number;
  statNumber?: string;
  statLabel?: string;
}> = ({
  url,
  text,
  highlightText,
  enterFrame = 0,
  highlightStartFrame = 15,
  statNumber,
  statLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < enterFrame) return null;

  const winSpr = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });
  const winScale = interpolate(winSpr, [0, 1], [0.9, 1], { extrapolateRight: "clamp" });
  const winOp = interpolate(winSpr, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const hlSpr = spring({
    frame: Math.max(0, frame - highlightStartFrame),
    fps,
    config: { damping: 16, stiffness: 140 },
  });
  const hlWidth = interpolate(hlSpr, [0, 1], [0, 100], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "1280px",
        transform: `scale(${winScale})`,
        opacity: winOp,
      }}
    >
      <div
        style={{
          width: "100%",
          borderRadius: "20px",
          backgroundColor: "#1E1E22",
          border: `1px solid ${VANTA_COLORS.border}`,
          boxShadow: "0 28px 60px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "14px 20px",
            backgroundColor: "#28282D",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#EF4444" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#F59E0B" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#10B981" }} />
          </div>
          <div
            style={{
              flex: 1,
              maxWidth: "520px",
              margin: "0 auto",
              backgroundColor: "rgba(0,0,0,0.3)",
              borderRadius: "8px",
              padding: "6px 16px",
              fontSize: "14px",
              fontFamily: "'VP Pixel', monospace",
              color: VANTA_COLORS.textMuted,
              textAlign: "center",
            }}
          >
            🔒 {url}
          </div>
        </div>

        <div style={{ padding: "48px 56px", backgroundColor: "#FAF4D9", color: "#1C191A" }}>
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "32px",
              lineHeight: 1.5,
              fontWeight: 500,
              margin: 0,
            }}
          >
            {text}{" "}
            <span
              style={{
                position: "relative",
                display: "inline",
                fontWeight: 800,
                color: "#000",
                zIndex: 1,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: "10%",
                  bottom: "5%",
                  width: `${hlWidth}%`,
                  backgroundColor: "rgba(245, 158, 11, 0.45)",
                  zIndex: -1,
                  borderRadius: "4px",
                }}
              />
              {highlightText}
            </span>
          </p>
        </div>
      </div>

      {statNumber && (
        <div
          style={{
            marginTop: "36px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Panton Rust Black Base', sans-serif",
              fontSize: "120px",
              fontWeight: 900,
              color: VANTA_COLORS.greenAccent,
              textShadow: `0 0 40px ${VANTA_COLORS.greenAccent}60`,
              letterSpacing: "-2px",
            }}
          >
            {statNumber}
          </div>
          {statLabel && (
            <div
              style={{
                fontFamily: "'Yolk Bold', sans-serif",
                fontSize: "26px",
                color: VANTA_COLORS.textPrimary,
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              {statLabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * 99.8% Glowing Circular Gauge (Reference 20)
 */
export const CircularGauge: React.FC<{
  metricValue?: number;
  metricLabel?: string;
  subtext?: string;
  enterFrame?: number;
}> = ({ metricValue = 99.8, metricLabel = "ACCURACY SCORE", subtext = "REBUILT FROM ITS LAYERS, EXACTLY", enterFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < enterFrame) return null;

  const spr = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 14, stiffness: 160 },
  });

  const animatedValue = interpolate(spr, [0, 1], [0, metricValue], { extrapolateRight: "clamp" });
  const pulse = Math.sin(frame / 8) * 8;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          border: `6px solid rgba(22, 119, 255, 0.2)`,
          borderTop: `6px solid ${VANTA_COLORS.primary}`,
          borderRight: `6px solid ${VANTA_COLORS.greenAccent}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 ${40 + pulse}px rgba(22, 119, 255, 0.4), inset 0 0 30px rgba(22, 119, 255, 0.2)`,
          backgroundColor: "rgba(28, 25, 26, 0.8)",
        }}
      >
        <span
          style={{
            fontFamily: "'Panton Rust Black Base', sans-serif",
            fontSize: "76px",
            fontWeight: 900,
            color: VANTA_COLORS.textPrimary,
            letterSpacing: "-2px",
          }}
        >
          {animatedValue.toFixed(1)}%
        </span>
        <span
          style={{
            fontFamily: "'VP Pixel', monospace",
            fontSize: "14px",
            color: VANTA_COLORS.greenAccent,
            letterSpacing: "2px",
            marginTop: "4px",
          }}
        >
          {metricLabel}
        </span>
      </div>
      <p
        style={{
          fontFamily: "'Yolk Bold', sans-serif",
          fontSize: "24px",
          color: VANTA_COLORS.textMuted,
          marginTop: "24px",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        {subtext}
      </p>
    </div>
  );
};

/**
 * Digital Flip Clock Card (Reference 21: "2:00 AM Eastern Time October 17")
 */
export const FlipClockCard: React.FC<{
  timeText: string;
  badgeText: string;
  subtext: string;
  enterFrame?: number;
}> = ({ timeText, badgeText, subtext, enterFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < enterFrame) return null;

  const spr = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${interpolate(spr, [0, 1], [0.85, 1])})`,
        opacity: interpolate(spr, [0, 1], [0, 1]),
      }}
    >
      <div
        style={{
          fontFamily: "'Panton Rust Black Base', sans-serif",
          fontSize: "130px",
          fontWeight: 900,
          color: VANTA_COLORS.textPrimary,
          letterSpacing: "4px",
          textShadow: "0 20px 40px rgba(0,0,0,0.8)",
        }}
      >
        {timeText}
      </div>
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <span
          style={{
            fontFamily: "'VP Pixel', monospace",
            fontSize: "18px",
            color: VANTA_COLORS.yellowAccent,
            backgroundColor: "rgba(245, 158, 11, 0.2)",
            padding: "6px 16px",
            borderRadius: "6px",
            border: `1px solid ${VANTA_COLORS.yellowAccent}60`,
          }}
        >
          {badgeText}
        </span>
        <span
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "18px",
            color: VANTA_COLORS.textMuted,
          }}
        >
          {subtext}
        </span>
      </div>
    </div>
  );
};

/**
 * Bold Chapter Punch Screen (Reference 24 & 46: Full-frame bold impact)
 */
export const BoldChapterPunch: React.FC<{
  part: string;
  title: string;
  bgColor?: string;
}> = ({ part, title, bgColor = VANTA_COLORS.primary }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 240, mass: 0.5 },
  });

  const scale = interpolate(spr, [0, 1], [1.2, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 120px",
        textAlign: "center",
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          fontFamily: "'VP Pixel', monospace",
          fontSize: "32px",
          color: "rgba(255,255,255,0.75)",
          letterSpacing: "4px",
          textTransform: "uppercase",
          marginBottom: "18px",
        }}
      >
        {part}
      </div>
      <div
        style={{
          fontFamily: "'Panton Rust Black Base', sans-serif",
          fontSize: "96px",
          fontWeight: 900,
          color: "#FFFFFF",
          lineHeight: 1.05,
          letterSpacing: "-2px",
          textTransform: "uppercase",
          textShadow: "0 12px 30px rgba(0,0,0,0.4)",
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};
