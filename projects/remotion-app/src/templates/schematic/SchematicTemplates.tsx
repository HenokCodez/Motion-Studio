import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate, Img, staticFile } from "remotion";
import { TOKENS } from "../../design-system/tokens";

// 39. Schematic Pipeline Draw (self-drawing stroke)
export const SchematicPipelineDraw: React.FC<{
  steps: string[];
  durationInFrames: number;
}> = ({ steps, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 30, width: "100%", maxWidth: 1400, margin: "0 auto" }}>
      {steps.map((step, idx) => {
        const s = spring({ frame: Math.max(0, frame - idx * 7), fps, config: TOKENS.motion.springs.card });
        return (
          <React.Fragment key={idx}>
            <div
              style={{
                padding: "36px 48px",
                background: TOKENS.colors.surface,
                borderRadius: 20,
                border: `2px solid ${TOKENS.colors.accentBlue}`,
                transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`,
                boxShadow: `0 0 30px ${TOKENS.colors.glow}`,
              }}
            >
              <div style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 36, color: TOKENS.colors.textPrimary, textTransform: "uppercase" }}>
                {step}
              </div>
            </div>
            {idx < steps.length - 1 && (
              <svg width="60" height="24">
                <line
                  x1="0"
                  y1="12"
                  x2="60"
                  y2="12"
                  stroke={TOKENS.colors.accentYellow}
                  strokeWidth="4"
                  strokeDasharray="60"
                  strokeDashoffset={interpolate(frame, [idx * 7 + 3, idx * 7 + 10], [60, 0], { extrapolateRight: "clamp" })}
                />
              </svg>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// 40. Schematic Speech Bubble
export const SchematicSpeechBubble: React.FC<{
  quote: string;
  author: string;
  durationInFrames: number;
}> = ({ quote, author, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: TOKENS.motion.springs.popIn });

  return (
    <div
      style={{
        position: "relative",
        maxWidth: 1000,
        margin: "0 auto",
        padding: "50px 70px",
        background: TOKENS.colors.surface,
        borderRadius: "32px 32px 32px 4px",
        border: `3px solid ${TOKENS.colors.accentYellow}`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.6)`,
        transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`,
      }}
    >
      <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 56, color: TOKENS.colors.textPrimary, lineHeight: 1.3 }}>
        "{quote}"
      </div>
      <div style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 32, color: TOKENS.colors.accentYellow, marginTop: 24, textAlign: "right" }}>
        — {author}
      </div>
    </div>
  );
};

// 41. Schematic Cell Grid Counter
export const SchematicCellGridCounter: React.FC<{
  totalCells: number;
  activeCells: number;
  label: string;
  durationInFrames: number;
}> = ({ totalCells = 16, activeCells = 12, label, durationInFrames }) => {
  const frame = useCurrentFrame();
  const litCount = Math.min(activeCells, Math.floor((frame / (durationInFrames * 0.7)) * activeCells));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 36 }}>
        {Array.from({ length: totalCells }).map((_, idx) => {
          const isLit = idx < litCount;
          return (
            <div
              key={idx}
              style={{
                width: 90,
                height: 90,
                borderRadius: 16,
                background: isLit ? TOKENS.colors.accentBlue : TOKENS.colors.surface,
                border: `2px solid ${isLit ? TOKENS.colors.textPrimary : TOKENS.colors.borderSubtle}`,
                boxShadow: isLit ? `0 0 25px ${TOKENS.colors.glow}` : "none",
                transition: "all 0.2s ease",
              }}
            />
          );
        })}
      </div>
      <div style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 48, color: TOKENS.colors.textPrimary, textTransform: "uppercase" }}>
        {label}: <span style={{ color: TOKENS.colors.accentYellow }}>{litCount} / {totalCells}</span>
      </div>
    </div>
  );
};

// 42. Schematic Docs Chip
export const SchematicDocsChip: React.FC<{
  docTitle: string;
  codeSnippet: string;
  chipLabel: string;
  durationInFrames: number;
}> = ({ docTitle, codeSnippet, chipLabel, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: TOKENS.motion.springs.card });
  const chipSpring = spring({ frame: Math.max(0, frame - 10), fps, config: TOKENS.motion.springs.punchy });

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "50px 60px",
        background: TOKENS.colors.surface,
        borderRadius: 24,
        border: `2px solid ${TOKENS.colors.borderSubtle}`,
        transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -24,
          right: 40,
          background: TOKENS.colors.accentYellow,
          color: TOKENS.colors.surface,
          fontFamily: TOKENS.typography.subtitle,
          fontSize: 28,
          padding: "8px 24px",
          borderRadius: 20,
          boxShadow: `0 8px 25px rgba(0,0,0,0.4)`,
          transform: `scale(${interpolate(chipSpring, [0, 1], [0, 1])})`,
          textTransform: "uppercase",
        }}
      >
        {chipLabel}
      </div>
      <div style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 36, color: TOKENS.colors.accentBlue, marginBottom: 20 }}>
        {docTitle}
      </div>
      <div style={{ fontFamily: TOKENS.typography.code, fontSize: 32, background: TOKENS.colors.backgroundSubtle, padding: "24px 30px", borderRadius: 12, color: TOKENS.colors.textPrimary }}>
        {codeSnippet}
      </div>
    </div>
  );
};

// 43. Schematic Chat Zoom
export const SchematicChatZoom: React.FC<{
  userMessage: string;
  aiResponse: string;
  durationInFrames: number;
}> = ({ userMessage, aiResponse, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = spring({ frame, fps, config: TOKENS.motion.springs.card });
  const s2 = spring({ frame: Math.max(0, frame - 10), fps, config: TOKENS.motion.springs.card });
  const zoom = interpolate(frame, [15, durationInFrames], [1.0, 1.05], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 30,
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        transform: `scale(${zoom})`,
      }}
    >
      <div
        style={{
          alignSelf: "flex-end",
          maxWidth: "75%",
          padding: "28px 40px",
          background: TOKENS.colors.surfaceElevated,
          borderRadius: "24px 24px 4px 24px",
          border: `1px solid ${TOKENS.colors.borderSubtle}`,
          fontFamily: TOKENS.typography.body,
          fontSize: 38,
          color: TOKENS.colors.textPrimary,
          transform: `scale(${interpolate(s1, [0, 1], [0.85, 1])})`,
        }}
      >
        {userMessage}
      </div>

      <div
        style={{
          alignSelf: "flex-start",
          maxWidth: "85%",
          padding: "36px 48px",
          background: TOKENS.colors.surface,
          borderRadius: "24px 24px 24px 4px",
          border: `2px solid ${TOKENS.colors.accentBlue}`,
          boxShadow: `0 0 40px ${TOKENS.colors.glow}`,
          fontFamily: TOKENS.typography.body,
          fontSize: 42,
          color: TOKENS.colors.textPrimary,
          transform: `scale(${interpolate(s2, [0, 1], [0.85, 1])})`,
        }}
      >
        <span style={{ color: TOKENS.colors.accentYellow, fontWeight: 700 }}>LLaMA: </span>
        <span>{aiResponse}</span>
      </div>
    </div>
  );
};

// 44. Schematic Bold Slam Blur
export const SchematicBoldSlamBlur: React.FC<{
  slamWord: string;
  bgImageUrl?: string;
  durationInFrames: number;
}> = ({ slamWord, bgImageUrl, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = spring({ frame, fps, config: TOKENS.motion.springs.punchy });
  const scale = interpolate(slam, [0, 1], [2.8, 1]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {bgImageUrl && (
        <div style={{ position: "absolute", inset: 0, filter: "blur(20px) brightness(0.4)", transform: "scale(1.1)" }}>
          <Img src={staticFile(bgImageUrl)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          fontFamily: TOKENS.typography.displayHeadline,
          fontSize: 160,
          color: TOKENS.colors.accentYellow,
          textTransform: "uppercase",
          letterSpacing: "-4px",
          transform: `scale(${scale})`,
          textShadow: `0 20px 60px rgba(0,0,0,0.9), 0 0 80px ${TOKENS.colors.glow}`,
        }}
      >
        {slamWord}
      </div>
    </div>
  );
};

// 45. Schematic Checklist Reveal
export const SchematicChecklistReveal: React.FC<{
  items: Array<{ text: string; enterFrame?: number }>;
  durationInFrames: number;
}> = ({ items, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, width: "100%", maxWidth: 1200, margin: "0 auto" }}>
      {items.map((item, idx) => {
        const trigger = item.enterFrame !== undefined ? item.enterFrame : idx * 8;
        if (frame < trigger) return null;
        const s = spring({ frame: frame - trigger, fps, config: TOKENS.motion.springs.punchy });

        return (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              padding: "24px 36px",
              background: TOKENS.colors.surface,
              borderRadius: 16,
              border: `2px solid ${TOKENS.colors.borderSubtle}`,
              transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: TOKENS.colors.accentGreen,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: TOKENS.colors.surface,
                fontWeight: 900,
                fontSize: 28,
              }}
            >
              ✓
            </div>
            <span style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 48, color: TOKENS.colors.textPrimary }}>
              {item.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// 46. Schematic Venn Intersection
export const SchematicVennIntersection: React.FC<{
  leftLabel: string;
  rightLabel: string;
  centerLabel: string;
  durationInFrames: number;
}> = ({ leftLabel, rightLabel, centerLabel, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inSpring = spring({ frame, fps, config: TOKENS.motion.springs.card });

  return (
    <div
      style={{
        position: "relative",
        width: 1000,
        height: 500,
        margin: "0 auto",
        transform: `scale(${interpolate(inSpring, [0, 1], [0.85, 1])})`,
      }}
    >
      {/* Left Circle */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 0,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(22, 119, 255, 0.2)",
          border: `3px solid ${TOKENS.colors.accentBlue}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: 60,
        }}
      >
        <span style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 36, color: TOKENS.colors.textPrimary, maxWidth: 160 }}>
          {leftLabel}
        </span>
      </div>

      {/* Right Circle */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 0,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(245, 158, 11, 0.2)",
          border: `3px solid ${TOKENS.colors.accentYellow}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: 60,
        }}
      >
        <span style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 36, color: TOKENS.colors.textPrimary, maxWidth: 160, textAlign: "right" }}>
          {rightLabel}
        </span>
      </div>

      {/* Center Intersection Tag */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          padding: "16px 32px",
          background: TOKENS.colors.surface,
          borderRadius: 20,
          border: `2px solid ${TOKENS.colors.textPrimary}`,
          boxShadow: `0 0 30px rgba(0,0,0,0.8)`,
        }}
      >
        <span style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 44, color: TOKENS.colors.accentYellow, textTransform: "uppercase" }}>
          {centerLabel}
        </span>
      </div>
    </div>
  );
};

// 47. Schematic Funnel Conversion
export const SchematicFunnelConversion: React.FC<{
  stages: Array<{ label: string; count: string }>;
  durationInFrames: number;
}> = ({ stages, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: "100%", maxWidth: 1000, margin: "0 auto" }}>
      {stages.map((stage, idx) => {
        const s = spring({ frame: Math.max(0, frame - idx * 6), fps, config: TOKENS.motion.springs.card });
        const width = 900 - idx * 180;

        return (
          <div
            key={idx}
            style={{
              width,
              padding: "24px 40px",
              background: idx === stages.length - 1 ? TOKENS.colors.accentYellow : TOKENS.colors.surface,
              borderRadius: 16,
              border: `2px solid ${TOKENS.colors.borderSubtle}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`,
            }}
          >
            <span style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 36, color: idx === stages.length - 1 ? TOKENS.colors.surface : TOKENS.colors.textPrimary }}>
              {stage.label}
            </span>
            <span style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 44, color: idx === stages.length - 1 ? TOKENS.colors.surface : TOKENS.colors.accentBlue }}>
              {stage.count}
            </span>
          </div>
        );
      })}
    </div>
  );
};
