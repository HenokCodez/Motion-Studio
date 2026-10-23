import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { TOKENS } from "../../design-system/tokens";

// 19. Data Price Slider
export const DataPriceSlider: React.FC<{
  minLabel?: string;
  maxLabel?: string;
  currentValue: string;
  targetPercent: number; // 0 to 100
  durationInFrames: number;
  title?: string;
}> = ({
  minLabel = "$0 (Open Source)",
  maxLabel = "$20/mo (Proprietary)",
  currentValue,
  targetPercent,
  durationInFrames,
  title = "SUBSCRIPTION COST",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inSpring = spring({ frame, fps, config: TOKENS.motion.springs.card });
  const progress = interpolate(frame, [10, Math.min(45, durationInFrames - 10)], [0, targetPercent], {
    extrapolateLeft: "clamp",
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
        maxWidth: 1200,
        margin: "0 auto",
        padding: "60px 80px",
        background: TOKENS.colors.surface,
        borderRadius: 28,
        border: `2px solid ${TOKENS.colors.borderSubtle}`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 50px ${TOKENS.colors.glow}`,
        transform: `scale(${interpolate(inSpring, [0, 1], [0.85, 1])})`,
        opacity: interpolate(inSpring, [0, 0.4, 1], [0, 0.8, 1]),
      }}
    >
      <div
        style={{
          fontFamily: TOKENS.typography.subtitle,
          fontSize: TOKENS.typography.sizes.subtext,
          color: TOKENS.colors.accentBlue,
          letterSpacing: "4px",
          textTransform: "uppercase",
          marginBottom: 30,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: TOKENS.typography.displayHeadline,
          fontSize: 110,
          color: TOKENS.colors.textPrimary,
          marginBottom: 50,
          letterSpacing: "-2px",
        }}
      >
        {currentValue}
      </div>
      {/* Slider Track */}
      <div
        style={{
          width: "100%",
          height: 24,
          background: TOKENS.colors.backgroundSubtle,
          borderRadius: 12,
          position: "relative",
          border: `1px solid ${TOKENS.colors.borderSubtle}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${TOKENS.colors.accentBlue}, ${TOKENS.colors.accentYellow})`,
            borderRadius: 12,
          }}
        />
        {/* Slider Thumb */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${progress}%`,
            transform: "translate(-50%, -50%)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: TOKENS.colors.textPrimary,
            border: `4px solid ${TOKENS.colors.accentYellow}`,
            boxShadow: `0 0 25px ${TOKENS.colors.accentYellow}`,
          }}
        />
      </div>
      {/* Labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginTop: 25,
          fontFamily: TOKENS.typography.code,
          fontSize: TOKENS.typography.sizes.placeholder,
          color: TOKENS.colors.textMuted,
        }}
      >
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
};

// 20. Data Comparison Line
export const DataComparisonLine: React.FC<{
  title: string;
  tiers: Array<{ label: string; tag: string; score: number; isWinner?: boolean }>;
  durationInFrames: number;
}> = ({ title, tiers, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inSpring = spring({ frame, fps, config: TOKENS.motion.springs.card });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: 1300,
        margin: "0 auto",
        padding: "50px 70px",
        background: TOKENS.colors.surface,
        borderRadius: 24,
        border: `2px solid ${TOKENS.colors.borderSubtle}`,
        transform: `scale(${interpolate(inSpring, [0, 1], [0.9, 1])})`,
      }}
    >
      <div
        style={{
          fontFamily: TOKENS.typography.displayHeadline,
          fontSize: 68,
          color: TOKENS.colors.textPrimary,
          marginBottom: 50,
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%" }}>
        {tiers.map((tier, idx) => {
          const barSpring = spring({
            frame: Math.max(0, frame - idx * 6 - 5),
            fps,
            config: TOKENS.motion.springs.punchy,
          });
          const width = interpolate(barSpring, [0, 1], [0, tier.score]);

          return (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: 30, width: "100%" }}>
              <div
                style={{
                  width: 260,
                  fontFamily: TOKENS.typography.subtitle,
                  fontSize: 38,
                  color: tier.isWinner ? TOKENS.colors.accentYellow : TOKENS.colors.textPrimary,
                  textAlign: "right",
                }}
              >
                {tier.label}
              </div>
              <div
                style={{
                  flex: 1,
                  height: 36,
                  background: TOKENS.colors.backgroundSubtle,
                  borderRadius: 18,
                  overflow: "hidden",
                  position: "relative",
                  border: `1px solid ${TOKENS.colors.borderSubtle}`,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${width}%`,
                    background: tier.isWinner
                      ? `linear-gradient(90deg, ${TOKENS.colors.accentBlue}, ${TOKENS.colors.accentYellow})`
                      : TOKENS.colors.accentBlue,
                    borderRadius: 18,
                  }}
                />
              </div>
              <div
                style={{
                  width: 160,
                  fontFamily: TOKENS.typography.code,
                  fontSize: 34,
                  color: tier.isWinner ? TOKENS.colors.accentYellow : TOKENS.colors.textMuted,
                  fontWeight: 700,
                }}
              >
                {tier.tag}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 21. Data Bar Comparison
export const DataBarComparison: React.FC<{
  leftTitle: string;
  leftValue: string;
  leftPercent: number;
  rightTitle: string;
  rightValue: string;
  rightPercent: number;
  unit?: string;
  durationInFrames: number;
}> = ({ leftTitle, leftValue, leftPercent, rightTitle, rightValue, rightPercent, unit = "", durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inSpring = spring({ frame, fps, config: TOKENS.motion.springs.card });
  const h1 = interpolate(spring({ frame: Math.max(0, frame - 5), fps, config: TOKENS.motion.springs.punchy }), [0, 1], [0, leftPercent]);
  const h2 = interpolate(spring({ frame: Math.max(0, frame - 12), fps, config: TOKENS.motion.springs.punchy }), [0, 1], [0, rightPercent]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 120,
        height: 600,
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "40px 60px",
        background: TOKENS.colors.surface,
        borderRadius: 24,
        border: `2px solid ${TOKENS.colors.borderSubtle}`,
        transform: `scale(${interpolate(inSpring, [0, 1], [0.9, 1])})`,
      }}
    >
      {/* Left Bar */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 60, color: TOKENS.colors.textMuted }}>
          {leftValue}
          {unit}
        </div>
        <div
          style={{
            width: 180,
            height: `${h1 * 3.5}px`,
            background: TOKENS.colors.backgroundSubtle,
            border: `2px solid ${TOKENS.colors.borderSubtle}`,
            borderRadius: "16px 16px 4px 4px",
          }}
        />
        <div style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 36, color: TOKENS.colors.textMuted, textTransform: "uppercase" }}>
          {leftTitle}
        </div>
      </div>

      {/* Right Bar (Hero Winner) */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 80, color: TOKENS.colors.accentYellow }}>
          {rightValue}
          {unit}
        </div>
        <div
          style={{
            width: 220,
            height: `${h2 * 3.5}px`,
            background: `linear-gradient(180deg, ${TOKENS.colors.accentYellow}, ${TOKENS.colors.accentBlue})`,
            borderRadius: "16px 16px 4px 4px",
            boxShadow: `0 0 50px ${TOKENS.colors.glow}`,
          }}
        />
        <div style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 44, color: TOKENS.colors.textPrimary, textTransform: "uppercase" }}>
          {rightTitle}
        </div>
      </div>
    </div>
  );
};

// 22. Data Byte Segment Layout
export const DataByteSegmentLayout: React.FC<{
  title: string;
  segments: Array<{ label: string; size: string; color?: string }>;
  durationInFrames: number;
}> = ({ title, segments, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inSpring = spring({ frame, fps, config: TOKENS.motion.springs.card });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: 1300,
        margin: "0 auto",
        padding: "60px 80px",
        background: TOKENS.colors.surface,
        borderRadius: 28,
        border: `2px solid ${TOKENS.colors.borderSubtle}`,
        transform: `scale(${interpolate(inSpring, [0, 1], [0.9, 1])})`,
      }}
    >
      <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 72, color: TOKENS.colors.textPrimary, marginBottom: 50, textTransform: "uppercase" }}>
        {title}
      </div>
      <div style={{ display: "flex", gap: 20, width: "100%", height: 120 }}>
        {segments.map((seg, idx) => {
          const s = spring({ frame: Math.max(0, frame - idx * 5), fps, config: TOKENS.motion.springs.popIn });
          return (
            <div
              key={idx}
              style={{
                flex: 1,
                background: seg.color || TOKENS.colors.surfaceElevated,
                border: `2px solid ${TOKENS.colors.accentBlue}`,
                borderRadius: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`,
                boxShadow: `0 0 20px ${TOKENS.colors.glow}`,
              }}
            >
              <div style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 32, color: TOKENS.colors.textPrimary }}>{seg.label}</div>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: 28, color: TOKENS.colors.accentYellow }}>{seg.size}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 23. Data Product Card
export const DataProductCard: React.FC<{
  productName: string;
  tagline: string;
  price: string;
  features: string[];
  durationInFrames: number;
}> = ({ productName, tagline, price, features, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inSpring = spring({ frame, fps, config: TOKENS.motion.springs.card });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        padding: "60px 70px",
        background: TOKENS.colors.surface,
        borderRadius: 24,
        border: `2px solid ${TOKENS.colors.accentBlue}`,
        boxShadow: `0 25px 70px rgba(0,0,0,0.6), 0 0 40px ${TOKENS.colors.glow}`,
        transform: `scale(${interpolate(inSpring, [0, 1], [0.85, 1])})`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `2px solid ${TOKENS.colors.borderSubtle}`, paddingBottom: 24 }}>
        <div>
          <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 64, color: TOKENS.colors.textPrimary }}>{productName}</div>
          <div style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 32, color: TOKENS.colors.textMuted }}>{tagline}</div>
        </div>
        <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 72, color: TOKENS.colors.accentYellow }}>{price}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 30 }}>
        {features.map((feat, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: TOKENS.typography.body, fontSize: 34, color: TOKENS.colors.textPrimary }}>
            <span style={{ color: TOKENS.colors.accentGreen, fontSize: 36 }}>✓</span>
            <span>{feat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 24. Data Tokens Per Second
export const DataTokensPerSec: React.FC<{
  rate: number;
  model: string;
  durationInFrames: number;
}> = ({ rate, model, durationInFrames }) => {
  const frame = useCurrentFrame();
  const count = Math.round(interpolate(frame, [0, Math.min(30, durationInFrames)], [0, rate], { extrapolateRight: "clamp" }));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: 1000,
        margin: "0 auto",
        padding: "60px 80px",
        background: TOKENS.colors.surface,
        borderRadius: 24,
        border: `2px solid ${TOKENS.colors.accentBlue}`,
      }}
    >
      <div style={{ fontFamily: TOKENS.typography.code, fontSize: 36, color: TOKENS.colors.accentBlue, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 20 }}>
        {model} INFERENCE SPEED
      </div>
      <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 150, color: TOKENS.colors.textPrimary, lineHeight: 1.0 }}>
        {count}
      </div>
      <div style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 44, color: TOKENS.colors.accentYellow, marginTop: 15, textTransform: "uppercase" }}>
        TOKENS / SECOND
      </div>
    </div>
  );
};

// 25. Data Stat Counter
export const DataStatCounter: React.FC<{
  targetNumber: number;
  prefix?: string;
  suffix?: string;
  label: string;
  durationInFrames: number;
}> = ({ targetNumber, prefix = "", suffix = "", label, durationInFrames }) => {
  const frame = useCurrentFrame();
  const current = Math.round(interpolate(frame, [0, Math.min(35, durationInFrames)], [0, targetNumber], { extrapolateRight: "clamp" }));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 160, color: TOKENS.colors.textPrimary, letterSpacing: "-3px", lineHeight: 1.0 }}>
        {prefix}{current.toLocaleString()}{suffix}
      </div>
      <div style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 52, color: TOKENS.colors.accentYellow, marginTop: 20, textTransform: "uppercase", letterSpacing: "2px" }}>
        {label}
      </div>
    </div>
  );
};

// 26. Data Ring Percentage
export const DataRingPercentage: React.FC<{
  percentage: number;
  label: string;
  durationInFrames: number;
}> = ({ percentage, label, durationInFrames }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, Math.min(40, durationInFrames)], [0, percentage], { extrapolateRight: "clamp" });
  const radius = 180;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (p / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: 440, height: 440 }}>
        <svg width="440" height="440" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="220" cy="220" r={radius} stroke={TOKENS.colors.surfaceElevated} strokeWidth="24" fill="transparent" />
          <circle
            cx="220"
            cy="220"
            r={radius}
            stroke={TOKENS.colors.accentYellow}
            strokeWidth="24"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 96, color: TOKENS.colors.textPrimary }}>
            {Math.round(p)}%
          </span>
        </div>
      </div>
      <div style={{ fontFamily: TOKENS.typography.subtitle, fontSize: 44, color: TOKENS.colors.textMuted, marginTop: 24, textTransform: "uppercase" }}>
        {label}
      </div>
    </div>
  );
};

// 27. Data Countdown Clock
export const DataCountdownClock: React.FC<{
  targetDate: string;
  title: string;
  durationInFrames: number;
}> = ({ targetDate, title, durationInFrames }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "50px 80px",
        background: TOKENS.colors.surface,
        borderRadius: 24,
        border: `2px solid ${TOKENS.colors.borderSubtle}`,
      }}
    >
      <div style={{ fontFamily: TOKENS.typography.code, fontSize: 36, color: TOKENS.colors.accentBlue, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 20 }}>
        {title}
      </div>
      <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 110, color: TOKENS.colors.textPrimary, letterSpacing: "4px" }}>
        {targetDate}
      </div>
    </div>
  );
};
