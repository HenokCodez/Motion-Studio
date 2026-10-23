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

export interface VantaBrollOverlayProps {
  leadIn?: string;
  bigText: string;
  imageSrc?: string;
}

export const VantaBrollOverlay: React.FC<VantaBrollOverlayProps> = ({
  leadIn = "BUT IN REALITY",
  bigText = "WE GOTTA TRY FIRST",
  imageSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textSpring = spring({ frame, fps, config: { damping: 14, stiffness: 200 } });
  const leadSpring = spring({ frame: frame - 4, fps, config: { damping: 15, stiffness: 190 } });

  const scale = interpolate(textSpring, [0, 1], [0.92, 1], { extrapolateRight: "clamp" });
  const op = interpolate(textSpring, [0, 1], [0, 0.78], { extrapolateRight: "clamp" });

  const leadY = interpolate(leadSpring, [0, 1], [-15, 0], { extrapolateRight: "clamp" });
  const leadOp = interpolate(leadSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: VANTA_THEME.bg,
        overflow: "hidden",
      }}
    >
      {/* Background Media */}
      {imageSrc && (
        <AbsoluteFill>
          <Img
            src={imageSrc.startsWith("http") ? imageSrc : staticFile(imageSrc)}
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }}
          />
        </AbsoluteFill>
      )}

      {/* Dark Vignette Overlay */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(35, 31, 32, 0.3) 0%, rgba(35, 31, 32, 0.85) 100%)`,
        }}
      />

      {/* Centered Overlay Content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 100px",
          textAlign: "center",
        }}
      >
        {leadIn && (
          <div
            style={{
              fontFamily: VANTA_THEME.fontPixel,
              fontSize: "24px",
              color: VANTA_THEME.accent,
              letterSpacing: "3px",
              marginBottom: "16px",
              opacity: leadOp,
              transform: `translateY(${leadY}px)`,
              textShadow: "0 4px 12px rgba(0, 0, 0, 0.8)",
            }}
          >
            {leadIn}
          </div>
        )}

        <div
          style={{
            fontFamily: VANTA_THEME.fontHeadline,
            fontSize: "110px",
            lineHeight: "1.0",
            color: VANTA_THEME.textPrimary,
            textTransform: "uppercase",
            letterSpacing: "4px",
            opacity: op,
            transform: `scale(${scale})`,
            textShadow: "0 16px 40px rgba(0, 0, 0, 0.8)",
            maxWidth: "1400px",
          }}
        >
          {bigText}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
