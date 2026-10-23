import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { TOKENS } from "../../../design-system/tokens";

export type SymbolIconType =
  | "lock"
  | "database"
  | "server"
  | "cpu"
  | "code"
  | "shield"
  | "terminal"
  | "network"
  | "zap"
  | "cube";

export interface GraphicSymbolProps {
  icon: SymbolIconType;
  label?: string;
  badge?: string;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}

const renderSvgPath = (icon: SymbolIconType, color: string) => {
  switch (icon) {
    case "lock":
      return (
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case "database":
      return (
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      );
    case "server":
      return (
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      );
    case "cpu":
      return (
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" />
          <line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" />
          <line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" />
          <line x1="20" y1="14" x2="23" y2="14" />
          <line x1="1" y1="9" x2="4" y2="9" />
          <line x1="1" y1="14" x2="4" y2="14" />
        </svg>
      );
    case "shield":
      return (
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case "network":
      return (
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="3" />
          <circle cx="5" cy="19" r="3" />
          <circle cx="19" cy="19" r="3" />
          <line x1="12" y1="8" x2="5" y2="16" />
          <line x1="12" y1="8" x2="19" y2="16" />
        </svg>
      );
    case "zap":
      return (
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "cube":
    default:
      return (
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
  }
};

export const GraphicSymbol: React.FC<GraphicSymbolProps> = ({
  icon,
  label,
  badge,
  color = TOKENS.colors.primary,
  size = 180,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    config: TOKENS.motion.springs.popIn,
  });

  const scale = interpolate(spr, [0, 1], [0.6, 1]);
  const opacity = interpolate(spr, [0, 0.5, 1], [0, 0.8, 1]);

  // Subtle breathing pulse
  const pulse = Math.sin(frame / 12) * 0.04;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale + pulse})`,
        opacity,
        ...style,
      }}
    >
      {/* Symbol Container (Strictly Non-Human Geometric Form) */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.22,
          backgroundColor: TOKENS.colors.surfaceElevated,
          border: `2px solid ${color}`,
          boxShadow: `0 16px 40px ${TOKENS.colors.stickerShadow}, 0 0 32px ${color}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {renderSvgPath(icon, color)}

        {badge && (
          <div
            style={{
              position: "absolute",
              top: -12,
              right: -12,
              backgroundColor: TOKENS.colors.accentRed,
              color: TOKENS.colors.textPrimary,
              fontFamily: TOKENS.typography.code,
              fontSize: 12,
              fontWeight: 800,
              padding: "2px 8px",
              borderRadius: 6,
              letterSpacing: 1,
            }}
          >
            {badge}
          </div>
        )}
      </div>

      {label && (
        <div
          style={{
            marginTop: 16,
            fontFamily: TOKENS.typography.code,
            fontSize: 20,
            color: TOKENS.colors.textPrimary,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
