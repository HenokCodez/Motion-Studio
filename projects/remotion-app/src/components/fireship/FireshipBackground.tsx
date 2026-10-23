import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { TOKENS } from "../../design-system/tokens";

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

export const FireshipBackground: React.FC<{
  showGrid?: boolean;
  showStars?: boolean;
  accentGlow?: string;
}> = ({ showGrid = true, showStars = true, accentGlow }) => {
  const frame = useCurrentFrame();

  // Deterministic starfield seed
  const stars = useMemo<Star[]>(() => {
    const list: Star[] = [];
    for (let i = 0; i < 45; i++) {
      const pseudoRand1 = ((i * 1234567) % 1000) / 1000;
      const pseudoRand2 = ((i * 7654321) % 1000) / 1000;
      const pseudoRand3 = ((i * 9876543) % 1000) / 1000;
      list.push({
        x: pseudoRand1 * 1920,
        y: pseudoRand2 * 1080,
        size: 1.5 + pseudoRand3 * 2.5,
        speed: 0.3 + pseudoRand1 * 0.7,
        opacity: 0.2 + pseudoRand2 * 0.5,
      });
    }
    return list;
  }, []);

  const gridOffset = (frame * 1.5) % 60;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: TOKENS.colors.background,
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* Subtle perspective neon grid */}
      {showGrid && (
        <div
          style={{
            position: "absolute",
            inset: "-200px -200px -200px -200px",
            backgroundImage: `
              linear-gradient(to right, ${TOKENS.colors.gridColor} 1px, transparent 1px),
              linear-gradient(to bottom, ${TOKENS.colors.gridColor} 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            backgroundPosition: `0px ${gridOffset}px`,
            opacity: 0.7,
            transform: "perspective(900px) rotateX(25deg)",
            transformOrigin: "center 70%",
            maskImage: "radial-gradient(ellipse 90% 65% at 50% 50%, black 20%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 90% 65% at 50% 50%, black 20%, transparent 80%)",
          }}
        />
      )}

      {/* Floating Starfield Particles */}
      {showStars && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {stars.map((star, idx) => {
            const currentY = (star.y - frame * star.speed + 1080 * 2) % 1080;
            const flicker = Math.sin(frame * 0.1 + idx) * 0.2 + star.opacity;
            return (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  left: star.x,
                  top: currentY,
                  width: star.size,
                  height: star.size,
                  borderRadius: "50%",
                  backgroundColor: "#FFFFFF",
                  opacity: Math.max(0.1, Math.min(0.85, flicker)),
                  boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Optional cinematic accent glow */}
      {accentGlow && (
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 900,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accentGlow} 0%, transparent 70%)`,
            opacity: 0.18,
            pointerEvents: "none",
            filter: "blur(70px)",
          }}
        />
      )}
    </div>
  );
};
