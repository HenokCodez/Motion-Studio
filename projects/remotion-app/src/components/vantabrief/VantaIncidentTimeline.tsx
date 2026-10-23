import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VANTA_THEME } from "./VantaBackground";

export interface VantaIncidentTimelineProps {
  timelineTime?: string;
  sourceBadge?: string;
  headline?: string;
  reportContent?: string;
  highlightWords?: string[];
}

export const VantaIncidentTimeline: React.FC<VantaIncidentTimelineProps> = ({
  timelineTime = "00:30 UTC",
  sourceBadge = "INCIDENT DISCLOSURE",
  headline = "UNAUTHORIZED PROVIDER ACCESS",
  reportContent = "Third party API credentials were compromised due to legacy decommissioning exposure. All affected keys invalidated within 4 hours.",
  highlightWords = ["compromised", "invalidated within 4 hours"],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardSpring = spring({ frame: frame - 6, fps, config: { damping: 15, stiffness: 190 } });

  const scrubProgress = interpolate(frame, [0, 60], [15, 65], { extrapolateRight: "clamp" });
  const cardScale = interpolate(cardSpring, [0, 1], [0.94, 1], { extrapolateRight: "clamp" });
  const cardOp = interpolate(cardSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 140px",
      }}
    >
      {/* Horizontal Timeline Bar */}
      <div
        style={{
          width: "100%",
          maxWidth: "1080px",
          position: "relative",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            height: "4px",
            backgroundColor: "rgba(250, 244, 217, 0.15)",
            borderRadius: "2px",
            position: "relative",
          }}
        >
          {/* Active progress */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${scrubProgress}%`,
              backgroundColor: VANTA_THEME.accent,
              boxShadow: `0 0 12px ${VANTA_THEME.accent}`,
            }}
          />

          {/* Scrub Playhead Node */}
          <div
            style={{
              position: "absolute",
              left: `${scrubProgress}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              border: `3px solid ${VANTA_THEME.accent}`,
              boxShadow: `0 0 16px ${VANTA_THEME.accent}`,
            }}
          />
        </div>

        {/* Time Badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "12px",
            fontFamily: VANTA_THEME.fontPixel,
            fontSize: "14px",
            color: VANTA_THEME.textMuted,
          }}
        >
          <span>OCT 17 // 00:00</span>
          <span style={{ color: VANTA_THEME.accent, fontWeight: "bold" }}>{timelineTime}</span>
          <span>OCT 18 // 00:00</span>
        </div>
      </div>

      {/* Incident Disclosure Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "1080px",
          backgroundColor: VANTA_THEME.surface,
          border: `1px solid ${VANTA_THEME.border}`,
          borderRadius: "20px",
          padding: "44px 50px",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.45)",
          transform: `scale(${cardScale})`,
          opacity: cardOp,
        }}
      >
        {sourceBadge && (
          <div
            style={{
              display: "inline-block",
              fontFamily: VANTA_THEME.fontPixel,
              fontSize: "14px",
              color: "#FFFFFF",
              backgroundColor: VANTA_THEME.accent,
              padding: "4px 14px",
              borderRadius: "6px",
              letterSpacing: "1px",
              marginBottom: "16px",
            }}
          >
            {sourceBadge}
          </div>
        )}

        <div
          style={{
            fontFamily: VANTA_THEME.fontHeadline,
            fontSize: "44px",
            lineHeight: "1.15",
            color: VANTA_THEME.textPrimary,
            marginBottom: "16px",
          }}
        >
          {headline}
        </div>

        <div
          style={{
            fontFamily: VANTA_THEME.fontSubtitle,
            fontSize: "22px",
            color: VANTA_THEME.textMuted,
            lineHeight: "1.5",
          }}
        >
          {reportContent}
        </div>
      </div>
    </AbsoluteFill>
  );
};
