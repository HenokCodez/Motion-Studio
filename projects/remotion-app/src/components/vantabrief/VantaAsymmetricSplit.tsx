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

export interface VantaAsymmetricSplitProps {
  leftLines?: string[];
  accentLines?: string[];
  imageSrc?: string;
}

export const VantaAsymmetricSplit: React.FC<VantaAsymmetricSplitProps> = ({
  leftLines = ["BUT", "SOMEONE", "WHO'S", "ACTUALLY", "BUILDING", "SYSTEMS"],
  accentLines = ["IMMEDIATELY", "RUNS INTO", "BOTTLENECKS"],
  imageSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({ frame, fps, config: { damping: 15, stiffness: 190 } });
  const leftSpring = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 200 } });
  const rightSpring = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 210 } });

  const cardScale = interpolate(cardSpring, [0, 1], [0.92, 1], { extrapolateRight: "clamp" });
  const cardOp = interpolate(cardSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const leftX = interpolate(leftSpring, [0, 1], [-40, 0], { extrapolateRight: "clamp" });
  const leftOp = interpolate(leftSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const rightX = interpolate(rightSpring, [0, 1], [40, 0], { extrapolateRight: "clamp" });
  const rightOp = interpolate(rightSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1540px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {/* Left-side stacked right-aligned text (Ref 50) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            paddingRight: "50px",
            opacity: leftOp,
            transform: `translateX(${leftX}px)`,
          }}
        >
          {leftLines.map((line, idx) => (
            <div
              key={idx}
              style={{
                fontFamily: VANTA_THEME.fontHeadline,
                fontSize: "44px",
                lineHeight: "1.1",
                color: VANTA_THEME.textPrimary,
                letterSpacing: "1px",
                textAlign: "right",
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Central media card with rounded corners */}
        <div
          style={{
            width: "580px",
            height: "440px",
            backgroundColor: VANTA_THEME.surface,
            border: `1px solid ${VANTA_THEME.border}`,
            borderRadius: "28px",
            overflow: "hidden",
            boxShadow: "0 28px 70px rgba(0, 0, 0, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${cardScale})`,
            opacity: cardOp,
            position: "relative",
          }}
        >
          {imageSrc ? (
            <Img
              src={imageSrc.startsWith("http") ? imageSrc : staticFile(imageSrc)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                padding: "30px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: VANTA_THEME.fontPixel,
                  fontSize: "18px",
                  color: VANTA_THEME.accent,
                  letterSpacing: "2px",
                }}
              >
                // FOOTAGE_PLACEHOLDER
              </div>
              <div
                style={{
                  fontFamily: VANTA_THEME.fontHeadline,
                  fontSize: "32px",
                  color: VANTA_THEME.textPrimary,
                }}
              >
                SYSTEM WORKFLOW DEMO
              </div>
            </div>
          )}
        </div>

        {/* Top-right accent text (Ref 50) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            paddingLeft: "50px",
            opacity: rightOp,
            transform: `translateX(${rightX}px)`,
          }}
        >
          {accentLines.map((line, idx) => (
            <div
              key={idx}
              style={{
                fontFamily: VANTA_THEME.fontHeadline,
                fontSize: "44px",
                lineHeight: "1.1",
                color: VANTA_THEME.accent,
                letterSpacing: "1px",
                textAlign: "left",
                textShadow: `0 0 20px ${VANTA_THEME.accent}55`,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
