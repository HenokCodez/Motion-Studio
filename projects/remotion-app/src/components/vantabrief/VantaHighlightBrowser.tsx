import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VANTA_THEME } from "./VantaBackground";

export interface VantaHighlightBrowserProps {
  url?: string;
  text: string;
  highlightText: string;
  enterFrame?: number;
  highlightStartFrame?: number;
  statNumber?: string;
  statLabel?: string;
}

/**
 * macOS Browser Window with dynamic sweeping yellow highlighter.
 * Faithfully recreates the technical breakdown reference style.
 */
export const VantaHighlightBrowser: React.FC<VantaHighlightBrowserProps> = ({
  url = "github.com/vanta-brief/intelligence",
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
  const winScale = interpolate(winSpr, [0, 1], [0.92, 1], { extrapolateRight: "clamp" });
  const winOp = interpolate(winSpr, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // Highlight sweeping animation
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
        margin: "0 auto",
        transform: `scale(${winScale})`,
        opacity: winOp,
      }}
    >
      <div
        style={{
          width: "100%",
          borderRadius: "20px",
          backgroundColor: "#1E1E22",
          border: `1px solid ${VANTA_THEME.border}`,
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
              fontFamily: VANTA_THEME.fontPixel,
              color: VANTA_THEME.textMuted,
              textAlign: "center",
            }}
          >
            🔒 {url}
          </div>
        </div>

        {/* Content Body */}
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
              fontFamily: VANTA_THEME.fontHeadline,
              fontSize: "120px",
              fontWeight: 900,
              color: "#10B981",
              textShadow: "0 0 40px rgba(16, 185, 129, 0.6)",
              letterSpacing: "-2px",
            }}
          >
            {statNumber}
          </div>
          {statLabel && (
            <div
              style={{
                fontFamily: VANTA_THEME.fontSubtitle,
                fontSize: "26px",
                color: VANTA_THEME.textPrimary,
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
