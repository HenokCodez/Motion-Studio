import React from "react";
import { AbsoluteFill, Video, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export interface FootagePlaceholderProps {
  id: string;
  instruction: string;
  targetPath: string; // Project-relative path in assets/video/
  orientation?: "landscape" | "portrait";
  actionPrompt?: string;
  sceneLabel?: string;
  mediaAvailable?: boolean;
  accentColor?: string;
}

export const FootagePlaceholder: React.FC<FootagePlaceholderProps> = ({
  id,
  instruction,
  targetPath,
  orientation = "landscape",
  actionPrompt,
  sceneLabel = "FOOTAGE NEEDED",
  mediaAvailable = false,
  accentColor = "#EF4444",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // If real footage has been provided, render the video file!
  if (mediaAvailable && targetPath) {
    try {
      return (
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
          <Video
            src={staticFile(targetPath)}
            style={{ width: "100%", height: "100%" }}
          />
        </AbsoluteFill>
      );
    } catch {
      // Fallback to placeholder if staticFile fails
    }
  }

  const currentSeconds = (frame / fps).toFixed(1);
  const totalSeconds = (durationInFrames / fps).toFixed(1);

  // Subtle pulsing recording light
  const pulseOpacity = 0.6 + 0.4 * Math.sin((frame / fps) * Math.PI * 2);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#070A11",
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.4) 0%, rgba(7, 10, 17, 0.95) 100%),
          linear-gradient(45deg, rgba(255, 255, 255, 0.02) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.02) 75%),
          linear-gradient(45deg, rgba(255, 255, 255, 0.02) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.02) 75%)
        `,
        backgroundSize: "100% 100%, 60px 60px, 60px 60px",
        backgroundPosition: "0 0, 0 0, 30px 30px",
        fontFamily: "'Inter', -apple-system, sans-serif",
        color: "#F8FAFC",
        padding: "60px",
      }}
    >
      {/* Viewfinder crosshairs */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          width: "30px",
          height: "30px",
          borderTop: "2px solid rgba(255, 255, 255, 0.3)",
          borderLeft: "2px solid rgba(255, 255, 255, 0.3)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40px",
          right: "40px",
          width: "30px",
          height: "30px",
          borderTop: "2px solid rgba(255, 255, 255, 0.3)",
          borderRight: "2px solid rgba(255, 255, 255, 0.3)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "40px",
          width: "30px",
          height: "30px",
          borderBottom: "2px solid rgba(255, 255, 255, 0.3)",
          borderLeft: "2px solid rgba(255, 255, 255, 0.3)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "40px",
          width: "30px",
          height: "30px",
          borderBottom: "2px solid rgba(255, 255, 255, 0.3)",
          borderRight: "2px solid rgba(255, 255, 255, 0.3)",
        }}
      />

      {/* Main Studio Placeholder Card */}
      <div
        style={{
          maxWidth: "860px",
          width: "100%",
          padding: "40px 48px",
          borderRadius: "24px",
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7)",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Top Header Badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: accentColor,
                boxShadow: `0 0 12px ${accentColor}`,
                opacity: pulseOpacity,
              }}
            />
            <span
              style={{
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: accentColor,
                textTransform: "uppercase",
              }}
            >
              {sceneLabel} • ID: {id}
            </span>
          </div>

          <div
            style={{
              padding: "6px 14px",
              borderRadius: "999px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              fontSize: "13px",
              fontFamily: "'JetBrains Mono', monospace",
              color: "#94A3B8",
            }}
          >
            {currentSeconds}s / {totalSeconds}s ({durationInFrames} frames)
          </div>
        </div>

        {/* Primary Instruction */}
        <div>
          <h2
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: "#FFFFFF",
              margin: "0 0 10px 0",
              lineHeight: 1.3,
            }}
          >
            {instruction}
          </h2>
          {actionPrompt && (
            <p
              style={{
                fontSize: "16px",
                color: "#CBD5E1",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: "#38BDF8" }}>Action / Narration: </strong>
              "{actionPrompt}"
            </p>
          )}
        </div>

        {/* File Target Path Box */}
        <div
          style={{
            padding: "16px 20px",
            borderRadius: "14px",
            backgroundColor: "rgba(2, 6, 23, 0.7)",
            border: "1px dashed rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748B", marginBottom: "4px" }}>
              Target Replacement Path
            </div>
            <code style={{ fontSize: "14px", color: "#38BDF8", fontFamily: "'JetBrains Mono', monospace" }}>
              {targetPath}
            </code>
          </div>

          <span
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              color: "#FCA5A5",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {orientation.toUpperCase()}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
