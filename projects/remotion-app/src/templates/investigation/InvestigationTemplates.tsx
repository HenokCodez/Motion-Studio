import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate, Img, staticFile } from "remotion";
import { TOKENS } from "../../design-system/tokens";

// 28. Investigation Tweet Card with Sweeping Highlighter
export const InvestigationTweetCard: React.FC<{
  author: string;
  handle: string;
  avatarUrl?: string;
  textBefore: string;
  highlightText: string;
  textAfter: string;
  durationInFrames: number;
}> = ({ author, handle, avatarUrl, textBefore, highlightText, textAfter, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardSpring = spring({ frame, fps, config: TOKENS.motion.springs.card });
  const highlightProgress = interpolate(frame, [10, Math.min(30, durationInFrames - 5)], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "50px 60px",
        background: TOKENS.colors.surface,
        borderRadius: 24,
        border: `2px solid ${TOKENS.colors.borderSubtle}`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.7)`,
        transform: `scale(${interpolate(cardSpring, [0, 1], [0.88, 1])})`,
        opacity: interpolate(cardSpring, [0, 0.4, 1], [0, 0.8, 1]),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 30 }}>
        {avatarUrl ? (
          <Img
            src={staticFile(avatarUrl)}
            style={{ width: 72, height: 72, borderRadius: "50%", border: `2px solid ${TOKENS.colors.accentBlue}` }}
          />
        ) : (
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: TOKENS.colors.accentBlue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: TOKENS.typography.subtitle,
              fontSize: 32,
              color: TOKENS.colors.textPrimary,
            }}
          >
            {author[0]}
          </div>
        )}
        <div>
          <div style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 36, color: TOKENS.colors.textPrimary }}>{author}</div>
          <div style={{ fontFamily: TOKENS.typography.code, fontSize: 26, color: TOKENS.colors.textMuted }}>{handle}</div>
        </div>
      </div>
      <div style={{ fontFamily: TOKENS.typography.body, fontSize: 48, lineHeight: 1.4, color: TOKENS.colors.textPrimary }}>
        <span>{textBefore} </span>
        <span
          style={{
            position: "relative",
            display: "inline",
            color: TOKENS.colors.textPrimary,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              position: "absolute",
              left: -4,
              top: 2,
              bottom: 2,
              width: `${highlightProgress}%`,
              background: TOKENS.colors.accentYellow,
              opacity: 0.85,
              borderRadius: 6,
              zIndex: 0,
            }}
          />
          <span style={{ position: "relative", zIndex: 1, color: TOKENS.colors.surface }}>{highlightText}</span>
        </span>
        <span> {textAfter}</span>
      </div>
    </div>
  );
};

// 29. Investigation Stacked Posts
export const InvestigationStackedPosts: React.FC<{
  posts: Array<{ author: string; text: string }>;
  durationInFrames: number;
}> = ({ posts, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ position: "relative", width: 1000, height: 600, margin: "0 auto" }}>
      {posts.map((post, idx) => {
        const s = spring({ frame: Math.max(0, frame - idx * 8), fps, config: TOKENS.motion.springs.card });
        const rot = (idx - 1) * 4;
        const translateY = (idx - 1) * 35;

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              top: 80,
              left: 0,
              right: 0,
              padding: "40px 50px",
              background: TOKENS.colors.surface,
              borderRadius: 20,
              border: `2px solid ${TOKENS.colors.borderSubtle}`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.6)`,
              transform: `translateY(${translateY}px) rotate(${rot}deg) scale(${interpolate(s, [0, 1], [0.8, 1])})`,
              opacity: interpolate(s, [0, 0.3, 1], [0, 0.7, 1]),
            }}
          >
            <div style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 32, color: TOKENS.colors.accentBlue, marginBottom: 16 }}>
              {post.author}
            </div>
            <div style={{ fontFamily: TOKENS.typography.body, fontSize: 38, color: TOKENS.colors.textPrimary, lineHeight: 1.3 }}>
              {post.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 30. Investigation Timeline Scrubber
export const InvestigationTimelineScrubber: React.FC<{
  years: string[];
  activeYearIndex: number;
  label: string;
  durationInFrames: number;
}> = ({ years, activeYearIndex, label, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inSpring = spring({ frame, fps, config: TOKENS.motion.springs.card });
  const progress = interpolate(frame, [0, Math.min(45, durationInFrames)], [0, activeYearIndex], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: 1400,
        margin: "0 auto",
        padding: "60px 80px",
        background: TOKENS.colors.surface,
        borderRadius: 24,
        border: `2px solid ${TOKENS.colors.borderSubtle}`,
        transform: `scale(${interpolate(inSpring, [0, 1], [0.9, 1])})`,
      }}
    >
      <div style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 36, color: TOKENS.colors.accentBlue, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 50 }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", position: "relative" }}>
        {/* Track Line */}
        <div style={{ position: "absolute", left: 40, right: 40, height: 6, background: TOKENS.colors.backgroundSubtle, zIndex: 0 }} />
        {years.map((year, idx) => {
          const isActive = idx <= Math.round(progress);
          return (
            <div key={idx} style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: isActive ? TOKENS.colors.accentYellow : TOKENS.colors.backgroundSubtle,
                  border: `3px solid ${isActive ? TOKENS.colors.textPrimary : TOKENS.colors.borderSubtle}`,
                  boxShadow: isActive ? `0 0 20px ${TOKENS.colors.accentYellow}` : "none",
                }}
              />
              <div
                style={{
                  fontFamily: TOKENS.typography.code,
                  fontSize: 32,
                  color: isActive ? TOKENS.colors.textPrimary : TOKENS.colors.textMuted,
                  fontWeight: isActive ? 700 : 400,
                }}
              >
                {year}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 31. Investigation Date Strip
export const InvestigationDateStrip: React.FC<{
  date: string;
  headline: string;
  tag: string;
  durationInFrames: number;
}> = ({ date, headline, tag, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inSpring = spring({ frame, fps, config: TOKENS.motion.springs.hook });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: "30px 60px",
        background: TOKENS.colors.surface,
        borderRadius: 20,
        border: `2px solid ${TOKENS.colors.borderSubtle}`,
        transform: `translateY(${interpolate(inSpring, [0, 1], [40, 0])}px)`,
        opacity: interpolate(inSpring, [0, 0.3, 1], [0, 0.8, 1]),
      }}
    >
      <div style={{ fontFamily: TOKENS.typography.code, fontSize: 36, color: TOKENS.colors.accentYellow, background: TOKENS.colors.backgroundSubtle, padding: "12px 24px", borderRadius: 12 }}>
        {date}
      </div>
      <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 56, color: TOKENS.colors.textPrimary }}>
        {headline}
      </div>
      <div style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 28, color: TOKENS.colors.surface, background: TOKENS.colors.accentBlue, padding: "8px 20px", borderRadius: 20, textTransform: "uppercase" }}>
        {tag}
      </div>
    </div>
  );
};

// 32. Investigation Article Highlight
export const InvestigationArticleHighlight: React.FC<{
  title: string;
  source: string;
  highlightPhrase: string;
  durationInFrames: number;
}> = ({ title, source, highlightPhrase, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardSpring = spring({ frame, fps, config: TOKENS.motion.springs.card });
  const w = interpolate(frame, [8, Math.min(35, durationInFrames - 5)], [0, 100], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "50px 70px",
        background: TOKENS.colors.surface,
        borderRadius: 24,
        border: `2px solid ${TOKENS.colors.borderSubtle}`,
        transform: `scale(${interpolate(cardSpring, [0, 1], [0.9, 1])})`,
      }}
    >
      <div style={{ fontFamily: TOKENS.typography.code, fontSize: 26, color: TOKENS.colors.accentBlue, textTransform: "uppercase", marginBottom: 16 }}>
        {source}
      </div>
      <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 52, color: TOKENS.colors.textPrimary, marginBottom: 30 }}>
        {title}
      </div>
      <div style={{ position: "relative", display: "inline-block", padding: "16px 20px", background: TOKENS.colors.backgroundSubtle, borderRadius: 12 }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${w}%`, background: TOKENS.colors.accentYellow, opacity: 0.35, borderRadius: 12 }} />
        <div style={{ position: "relative", zIndex: 1, fontFamily: TOKENS.typography.body, fontSize: 44, color: TOKENS.colors.textPrimary, fontStyle: "italic" }}>
          "{highlightPhrase}"
        </div>
      </div>
    </div>
  );
};

// 33. Investigation Dashboard Stats
export const InvestigationDashboardStats: React.FC<{
  metrics: Array<{ label: string; value: string; change?: string }>;
  durationInFrames: number;
}> = ({ metrics, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${metrics.length}, 1fr)`, gap: 30, width: "100%", maxWidth: 1400, margin: "0 auto" }}>
      {metrics.map((m, idx) => {
        const s = spring({ frame: Math.max(0, frame - idx * 5), fps, config: TOKENS.motion.springs.card });
        return (
          <div
            key={idx}
            style={{
              padding: "40px",
              background: TOKENS.colors.surface,
              borderRadius: 20,
              border: `2px solid ${TOKENS.colors.borderSubtle}`,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`,
            }}
          >
            <div style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 28, color: TOKENS.colors.textMuted, textTransform: "uppercase" }}>{m.label}</div>
            <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 72, color: TOKENS.colors.textPrimary }}>{m.value}</div>
            {m.change && (
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: 26, color: TOKENS.colors.accentGreen, fontWeight: 700 }}>
                {m.change}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// 34. Investigation Toggle Switch
export const InvestigationToggleSwitch: React.FC<{
  leftLabel: string;
  rightLabel: string;
  isRightActive: boolean;
  durationInFrames: number;
}> = ({ leftLabel, rightLabel, isRightActive, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const toggleSpring = spring({ frame: Math.max(0, frame - 10), fps, config: TOKENS.motion.springs.punchy });
  const x = interpolate(toggleSpring, [0, 1], [0, isRightActive ? 120 : 0]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40 }}>
      <span style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 52, color: isRightActive ? TOKENS.colors.textMuted : TOKENS.colors.accentYellow }}>
        {leftLabel}
      </span>
      <div style={{ width: 240, height: 100, background: TOKENS.colors.surface, borderRadius: 50, padding: 10, border: `3px solid ${TOKENS.colors.borderSubtle}`, position: "relative" }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: TOKENS.colors.accentBlue,
            boxShadow: `0 0 30px ${TOKENS.colors.glow}`,
            transform: `translateX(${x}px)`,
          }}
        />
      </div>
      <span style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 52, color: isRightActive ? TOKENS.colors.accentYellow : TOKENS.colors.textMuted }}>
        {rightLabel}
      </span>
    </div>
  );
};

// 35. Investigation Node Flow
export const InvestigationNodeFlow: React.FC<{
  nodes: string[];
  durationInFrames: number;
}> = ({ nodes, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40, width: "100%", maxWidth: 1400, margin: "0 auto" }}>
      {nodes.map((node, idx) => {
        const s = spring({ frame: Math.max(0, frame - idx * 6), fps, config: TOKENS.motion.springs.popIn });
        return (
          <React.Fragment key={idx}>
            <div
              style={{
                padding: "30px 40px",
                background: TOKENS.colors.surface,
                borderRadius: 16,
                border: `2px solid ${TOKENS.colors.accentBlue}`,
                transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`,
                boxShadow: `0 0 25px ${TOKENS.colors.glow}`,
              }}
            >
              <span style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 36, color: TOKENS.colors.textPrimary }}>{node}</span>
            </div>
            {idx < nodes.length - 1 && (
              <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 44, color: TOKENS.colors.accentYellow }}>
                ➔
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// 36. Investigation Stamp Overlay
export const InvestigationStampOverlay: React.FC<{
  stamp: string;
  subtext?: string;
  durationInFrames: number;
}> = ({ stamp, subtext, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = spring({ frame, fps, config: TOKENS.motion.springs.punchy });
  const scale = interpolate(slam, [0, 1], [3.0, 1]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `rotate(-10deg) scale(${scale})`,
      }}
    >
      <div
        style={{
          fontFamily: TOKENS.typography.displayHeadline,
          fontSize: 140,
          color: TOKENS.colors.accentRed,
          border: `10px solid ${TOKENS.colors.accentRed}`,
          padding: "20px 60px",
          borderRadius: 24,
          letterSpacing: "6px",
          textTransform: "uppercase",
          boxShadow: `0 0 60px rgba(239, 68, 68, 0.4)`,
        }}
      >
        {stamp}
      </div>
      {subtext && (
        <div style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 40, color: TOKENS.colors.textPrimary, marginTop: 20 }}>
          {subtext}
        </div>
      )}
    </div>
  );
};

// 37. Investigation Terminal Window
export const InvestigationTerminalWindow: React.FC<{
  command: string;
  outputLines: string[];
  durationInFrames: number;
}> = ({ command, outputLines, durationInFrames }) => {
  const frame = useCurrentFrame();
  const typedLength = Math.min(command.length, Math.floor(frame * 1.5));
  const currentCommand = command.slice(0, typedLength);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        background: TOKENS.colors.surface,
        borderRadius: 20,
        border: `2px solid ${TOKENS.colors.borderSubtle}`,
        overflow: "hidden",
        boxShadow: `0 30px 80px rgba(0,0,0,0.7)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 24px", background: TOKENS.colors.surfaceElevated }}>
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: TOKENS.colors.accentRed }} />
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: TOKENS.colors.accentYellow }} />
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: TOKENS.colors.accentGreen }} />
        <span style={{ marginLeft: 20, fontFamily: TOKENS.typography.code, fontSize: 22, color: TOKENS.colors.textMuted }}>
          terminal — bash
        </span>
      </div>
      <div style={{ padding: "40px", fontFamily: TOKENS.typography.code, fontSize: 32, lineHeight: 1.6, color: TOKENS.colors.textPrimary }}>
        <div>
          <span style={{ color: TOKENS.colors.accentGreen }}>$ </span>
          <span>{currentCommand}</span>
          <span style={{ opacity: frame % 15 < 8 ? 1 : 0, color: TOKENS.colors.accentYellow }}>_</span>
        </div>
        {frame > 25 &&
          outputLines.map((line, idx) => (
            <div key={idx} style={{ color: TOKENS.colors.textMuted, marginTop: 8 }}>
              {line}
            </div>
          ))}
      </div>
    </div>
  );
};

// 38. Investigation Two Parts
export const InvestigationTwoParts: React.FC<{
  leftTitle: string;
  leftDesc: string;
  rightTitle: string;
  rightDesc: string;
  durationInFrames: number;
}> = ({ leftTitle, leftDesc, rightTitle, rightDesc, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = spring({ frame, fps, config: TOKENS.motion.springs.card });
  const s2 = spring({ frame: Math.max(0, frame - 5), fps, config: TOKENS.motion.springs.card });

  return (
    <div style={{ display: "flex", gap: 50, width: "100%", maxWidth: 1300, margin: "0 auto" }}>
      <div
        style={{
          flex: 1,
          padding: "50px",
          background: TOKENS.colors.surface,
          borderRadius: 24,
          border: `2px solid ${TOKENS.colors.borderSubtle}`,
          transform: `scale(${interpolate(s1, [0, 1], [0.88, 1])})`,
        }}
      >
        <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 52, color: TOKENS.colors.textMuted, marginBottom: 20 }}>
          {leftTitle}
        </div>
        <div style={{ fontFamily: TOKENS.typography.body, fontSize: 34, color: TOKENS.colors.textMuted, lineHeight: 1.4 }}>
          {leftDesc}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: "50px",
          background: TOKENS.colors.surface,
          borderRadius: 24,
          border: `2px solid ${TOKENS.colors.accentBlue}`,
          boxShadow: `0 0 40px ${TOKENS.colors.glow}`,
          transform: `scale(${interpolate(s2, [0, 1], [0.88, 1])})`,
        }}
      >
        <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 52, color: TOKENS.colors.accentYellow, marginBottom: 20 }}>
          {rightTitle}
        </div>
        <div style={{ fontFamily: TOKENS.typography.body, fontSize: 34, color: TOKENS.colors.textPrimary, lineHeight: 1.4 }}>
          {rightDesc}
        </div>
      </div>
    </div>
  );
};
