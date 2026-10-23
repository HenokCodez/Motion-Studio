import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export interface LiquidBackgroundProps {
  color1?: string;
  color2?: string;
  color3?: string;
  colorBase?: string;
}

export const LiquidBackground: React.FC<LiquidBackgroundProps> = ({
  color1 = "rgba(59, 130, 246, 0.45)",  // Blue
  color2 = "rgba(139, 92, 246, 0.4)",   // Purple
  color3 = "rgba(236, 72, 153, 0.35)",  // Pink
  colorBase = "#0B0F19",                 // Obsidian
}) => {
  const frame = useCurrentFrame();

  // Smooth periodic movements using sin/cos based on frame
  const t1 = frame * 0.03;
  const t2 = frame * 0.025;
  const t3 = frame * 0.02;

  const x1 = 50 + 25 * Math.sin(t1);
  const y1 = 40 + 20 * Math.cos(t1 * 0.8);

  const x2 = 70 + 20 * Math.cos(t2);
  const y2 = 60 + 25 * Math.sin(t2 * 1.1);

  const x3 = 30 + 20 * Math.sin(t3 * 0.9);
  const y3 = 70 + 18 * Math.cos(t3);

  const scalePulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.95, 1.05]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colorBase,
        overflow: "hidden",
      }}
    >
      {/* Orb 1 */}
      <div
        style={{
          position: "absolute",
          top: `${y1}%`,
          left: `${x1}%`,
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color1} 0%, rgba(0,0,0,0) 70%)`,
          filter: "blur(90px)",
          transform: `translate(-50%, -50%) scale(${scalePulse})`,
          pointerEvents: "none",
        }}
      />

      {/* Orb 2 */}
      <div
        style={{
          position: "absolute",
          top: `${y2}%`,
          left: `${x2}%`,
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color2} 0%, rgba(0,0,0,0) 70%)`,
          filter: "blur(110px)",
          transform: `translate(-50%, -50%) scale(${1.1 - (scalePulse - 1)})`,
          pointerEvents: "none",
        }}
      />

      {/* Orb 3 */}
      <div
        style={{
          position: "absolute",
          top: `${y3}%`,
          left: `${x3}%`,
          width: "650px",
          height: "650px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color3} 0%, rgba(0,0,0,0) 70%)`,
          filter: "blur(95px)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      {/* Subtle Grid Overlay for tech / modern feel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
