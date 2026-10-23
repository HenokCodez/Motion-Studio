import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VANTA_THEME } from "./VantaBackground";

export interface VantaTerminalWindowProps {
  sessionName?: string;
  command?: string;
  headline?: string;
  description?: string;
  badges?: Array<{ text: string; isAccent?: boolean }>;
}

export const VantaTerminalWindow: React.FC<VantaTerminalWindowProps> = ({
  sessionName = "vanta-terminal // session_01",
  command = "$ studio deploy --engine=local-fast",
  headline = "AUTOMATED PIPELINE READY",
  description = "Loaded local models, voice alignment cues, and deterministic visual tracks.",
  badges = [
    { text: "MEM: 63/63 BYTES", isAccent: true },
    { text: "STATUS: ZERO_ERRORS", isAccent: false },
  ],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const termSpring = spring({ frame, fps, config: { damping: 14, stiffness: 200 } });
  const termScale = interpolate(termSpring, [0, 1], [0.93, 1], { extrapolateRight: "clamp" });
  const termOpacity = interpolate(termSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "1020px",
          backgroundColor: VANTA_THEME.surface,
          border: `1px solid ${VANTA_THEME.border}`,
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 28px 70px rgba(0, 0, 0, 0.5)",
          transform: `scale(${termScale})`,
          opacity: termOpacity,
        }}
      >
        {/* Terminal Title Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: `1px solid ${VANTA_THEME.border}`,
            backgroundColor: "rgba(0, 0, 0, 0.25)",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#FF5F56" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#FFBD2E" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#27C93F" }} />
          </div>

          <div
            style={{
              fontFamily: VANTA_THEME.fontPixel,
              fontSize: "14px",
              color: VANTA_THEME.textMuted,
              letterSpacing: "1px",
            }}
          >
            {sessionName}
          </div>

          <div
            style={{
              fontFamily: VANTA_THEME.fontPixel,
              fontSize: "12px",
              color: VANTA_THEME.accent,
            }}
          >
            ● ONLINE
          </div>
        </div>

        {/* Terminal Content Body */}
        <div style={{ padding: "44px" }}>
          {command && (
            <div
              style={{
                fontFamily: VANTA_THEME.fontPixel,
                fontSize: "20px",
                color: VANTA_THEME.accent,
                marginBottom: "22px",
                letterSpacing: "1px",
              }}
            >
              {command}
            </div>
          )}

          {headline && (
            <div
              style={{
                fontFamily: VANTA_THEME.fontHeadline,
                fontSize: "48px",
                lineHeight: "1.2",
                color: VANTA_THEME.textPrimary,
                marginBottom: "16px",
              }}
            >
              {headline}
            </div>
          )}

          {description && (
            <div
              style={{
                fontFamily: VANTA_THEME.fontSubtitle,
                fontSize: "22px",
                color: VANTA_THEME.textMuted,
                marginBottom: "28px",
                lineHeight: "1.4",
              }}
            >
              {description}
            </div>
          )}

          {badges && badges.length > 0 && (
            <div style={{ display: "flex", gap: "14px" }}>
              {badges.map((b, idx) => (
                <div
                  key={idx}
                  style={{
                    fontFamily: VANTA_THEME.fontPixel,
                    fontSize: "16px",
                    padding: "8px 18px",
                    borderRadius: "8px",
                    backgroundColor: b.isAccent ? VANTA_THEME.accent : "transparent",
                    border: b.isAccent ? "none" : `1px solid ${VANTA_THEME.border}`,
                    color: b.isAccent ? "#FFFFFF" : VANTA_THEME.textPrimary,
                    boxShadow: b.isAccent ? `0 4px 16px ${VANTA_THEME.accent}44` : "none",
                  }}
                >
                  {b.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
