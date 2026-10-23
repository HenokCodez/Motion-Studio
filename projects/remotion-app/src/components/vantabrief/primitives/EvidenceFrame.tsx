import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate, Img, staticFile } from "remotion";
import { TOKENS } from "../../../design-system/tokens";

export interface EvidenceFrameProps {
  mediaSrc?: string;
  sourceLabel?: string;
  urlPill?: string;
  caption?: string;
  aspectRatio?: "16:9" | "4:3" | "custom";
  width?: number | string;
  height?: number | string;
  focusPoint?: { x: number; y: number; zoom?: number };
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const EvidenceFrame: React.FC<EvidenceFrameProps> = ({
  mediaSrc,
  sourceLabel = "AUTHENTIC INTERFACE EVIDENCE",
  urlPill,
  caption,
  width = 1280,
  height = 720,
  focusPoint,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: TOKENS.motion.springs.card,
  });

  const scale = interpolate(enterSpring, [0, 1], [0.92, 1]);
  const translateY = interpolate(enterSpring, [0, 1], [30, 0]);
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);

  // Subtle continuous push-in
  const continuousZoom = interpolate(frame, [0, 150], [1.0, 1.03], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      {/* Evidence Frame Container */}
      <div
        style={{
          width,
          maxWidth: "92%",
          height,
          backgroundColor: TOKENS.colors.surface,
          borderRadius: 16,
          border: `1px solid ${TOKENS.colors.borderSubtle}`,
          boxShadow: `0 20px 50px ${TOKENS.colors.stickerShadow}, 0 0 30px rgba(22, 119, 255, 0.15)`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Chrome Bar / Status Header */}
        <div
          style={{
            height: 44,
            backgroundColor: TOKENS.colors.backgroundSubtle,
            borderBottom: `1px solid ${TOKENS.colors.borderSubtle}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
          }}
        >
          {/* Window control dots */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: TOKENS.colors.accentRed, opacity: 0.85 }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: TOKENS.colors.accentYellow, opacity: 0.85 }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: TOKENS.colors.accentGreen, opacity: 0.85 }} />
            <span
              style={{
                fontFamily: TOKENS.typography.code,
                fontSize: 13,
                color: TOKENS.colors.textMuted,
                marginLeft: 10,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {sourceLabel}
            </span>
          </div>

          {/* URL / Source Pill */}
          {urlPill && (
            <div
              style={{
                fontFamily: TOKENS.typography.code,
                fontSize: 13,
                color: TOKENS.colors.primary,
                backgroundColor: "rgba(22, 119, 255, 0.1)",
                padding: "3px 12px",
                borderRadius: 12,
                border: "1px solid rgba(22, 119, 255, 0.25)",
                maxWidth: 420,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              🔒 {urlPill}
            </div>
          )}
        </div>

        {/* Viewport Content */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `scale(${continuousZoom * (focusPoint?.zoom ?? 1.0)})`,
              transformOrigin: focusPoint ? `${focusPoint.x}% ${focusPoint.y}%` : "center center",
              transition: "transform 0.1s linear",
            }}
          >
            {mediaSrc ? (
              <Img
                src={mediaSrc.startsWith("http") ? mediaSrc : staticFile(mediaSrc)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              children
            )}
          </div>
        </div>
      </div>

      {/* Optional Editorial Sub-Caption */}
      {caption && (
        <div
          style={{
            marginTop: 16,
            fontFamily: TOKENS.typography.code,
            fontSize: 18,
            color: TOKENS.colors.accentYellow,
            letterSpacing: 0.5,
            textAlign: "center",
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
};
