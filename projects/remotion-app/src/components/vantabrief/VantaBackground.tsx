import React from "react";
import { AbsoluteFill, staticFile } from "remotion";

export const VANTA_THEME = {
  bg: "#231F20",
  bgSubtle: "#2C2728",
  surface: "#1C191A",
  surfaceElevated: "#252122",
  primary: "#1677FF",
  accent: "#1677FF",
  textPrimary: "#FAF4D9",
  textMuted: "rgba(250, 244, 217, 0.65)",
  border: "rgba(250, 244, 217, 0.12)",
  glow: "rgba(22, 119, 255, 0.35)",
  badgeBg: "rgba(22, 119, 255, 0.18)",
  fontHeadline: "'Panton Rust Black Base', sans-serif",
  fontSubtitle: "'Yolk Bold', sans-serif",
  fontPixel: "'VP Pixel', monospace",
  fontSystem: "system-ui, -apple-system, sans-serif",
};

export const VantaFontStyles: React.FC = () => {
  return (
    <style>{`
      @font-face {
        font-family: 'Panton Rust Black Base';
        src: url('${staticFile("fonts/vantabrief/PantonRustBlack-Base.ttf")}') format('truetype');
        font-weight: 900;
        font-style: normal;
      }
      @font-face {
        font-family: 'Yolk Bold';
        src: url('${staticFile("fonts/vantabrief/Yolk-Bold.ttf")}') format('truetype');
        font-weight: bold;
        font-style: normal;
      }
      @font-face {
        font-family: 'VP Pixel';
        src: url('${staticFile("fonts/vantabrief/VPPixel-Simplified.otf")}') format('opentype');
        font-weight: normal;
        font-style: normal;
      }
    `}</style>
  );
};

export interface VantaBackgroundProps {
  showGrid?: boolean;
  gridSize?: number;
}

export const VantaBackground: React.FC<VantaBackgroundProps> = ({
  showGrid = false,
  gridSize = 60,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: VANTA_THEME.bg,
        backgroundImage: `radial-gradient(circle at 50% 50%, ${VANTA_THEME.bgSubtle} 0%, ${VANTA_THEME.bg} 85%)`,
        overflow: "hidden",
      }}
    >
      {showGrid && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(to right, rgba(250, 244, 217, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(250, 244, 217, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`,
            maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
