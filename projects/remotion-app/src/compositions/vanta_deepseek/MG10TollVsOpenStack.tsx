import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TOKENS } from "../../design-system/tokens";

export const MG10TollVsOpenStack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const translateY = interpolate(enterSpring, [0, 1], [40, 0]);

  // Card slide-in springs
  const leftCardSpring = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 14, mass: 0.8 } });
  const rightCardSpring = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 14, mass: 0.8 } });

  // Strike-through animation on left costs (frame 60+)
  const strikeProgress = interpolate(frame, [60, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Green check pop on right card (frame 95+)
  const checkPop = spring({ frame: Math.max(0, frame - 95), fps, config: { damping: 12, mass: 0.6 } });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: TOKENS.typography.fontFamily.sans,
        overflow: "hidden",
      }}
    >
      {/* Corner Chrome */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 60,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: TOKENS.colors.accentRed,
          letterSpacing: 2,
          fontWeight: 700,
        }}
      >
        [10/10 // MONOPOLY TOLL VS OPEN STACK]
      </div>
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 60,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: TOKENS.colors.creamLight,
          letterSpacing: 2,
          opacity: 0.6,
        }}
      >
        ECONOMIC_COMPARISON: 2026
      </div>

      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          width: "1280px",
          display: "flex",
          flexDirection: "column",
          gap: "36px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: TOKENS.typography.code,
              fontSize: "16px",
              color: TOKENS.colors.accentBlue,
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            ENTERPRISE PRICING PARADOX
          </div>
          <div
            style={{
              fontFamily: TOKENS.typography.displayHeadline,
              fontSize: "56px",
              fontWeight: 900,
              color: TOKENS.colors.creamLight,
              letterSpacing: "-0.5px",
            }}
          >
            The Cloud Markup Collapse
          </div>
        </div>

        {/* Dual Cards Comparison Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          {/* Left Card: Legacy Closed Cloud Toll */}
          <div
            style={{
              transform: `translateX(${interpolate(leftCardSpring, [0, 1], [-40, 0])}px)`,
              opacity: interpolate(leftCardSpring, [0, 1], [0, 1]),
              background: "#1C191A",
              border: "2px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "20px",
              padding: "40px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.7), 0 0 35px rgba(239, 68, 68, 0.15)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "420px",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: TOKENS.typography.code,
                  fontSize: "14px",
                  color: TOKENS.colors.accentRed,
                  letterSpacing: "2px",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                PROPRIETARY CLOUD HOSTING
              </div>
              <div
                style={{
                  fontFamily: TOKENS.typography.displayHeadline,
                  fontSize: "36px",
                  fontWeight: 900,
                  color: TOKENS.colors.creamLight,
                  marginBottom: "24px",
                }}
              >
                The $10/Hour Markup
              </div>

              {/* Red-flag itemized breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ position: "relative", fontSize: "18px", color: TOKENS.colors.textMuted }}>
                  <span>Enterprise GPU Cloud Rate: $5.00 – $10.00 / hr</span>
                  {strikeProgress > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        width: `${strikeProgress * 100}%`,
                        height: "2px",
                        background: "#EF4444",
                      }}
                    />
                  )}
                </div>
                <div style={{ position: "relative", fontSize: "18px", color: TOKENS.colors.textMuted }}>
                  <span>Closed Model API Toll: $15.00 – $30.00 / 1M tokens</span>
                  {strikeProgress > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        width: `${strikeProgress * 100}%`,
                        height: "2px",
                        background: "#EF4444",
                      }}
                    />
                  )}
                </div>
                <div style={{ fontSize: "18px", color: TOKENS.colors.textMuted }}>
                  <span>Result: Massive cloud burn for software startups</span>
                </div>
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(250, 244, 217, 0.1)",
                paddingTop: "20px",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "14px", color: TOKENS.colors.textMuted }}>
                ANNUAL INFRASTRUCTURE TOLL
              </div>
              <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "40px", fontWeight: 900, color: "#EF4444" }}>
                $100K+ / yr
              </div>
            </div>
          </div>

          {/* Right Card: DeepSeek Open Architecture */}
          <div
            style={{
              transform: `translateX(${interpolate(rightCardSpring, [0, 1], [40, 0])}px) scale(${1 + checkPop * 0.02})`,
              opacity: interpolate(rightCardSpring, [0, 1], [0, 1]),
              background: "#1C191A",
              border: "2px solid #10B981",
              borderRadius: "20px",
              padding: "40px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.8), 0 0 45px rgba(16, 185, 129, 0.25)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "420px",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: TOKENS.typography.code,
                  fontSize: "14px",
                  color: "#10B981",
                  letterSpacing: "2px",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                DEEPSEEK OPEN ARCHITECTURE
              </div>
              <div
                style={{
                  fontFamily: TOKENS.typography.displayHeadline,
                  fontSize: "36px",
                  fontWeight: 900,
                  color: TOKENS.colors.creamLight,
                  marginBottom: "24px",
                }}
              >
                80% Profit Margin at Scale
              </div>

              {/* Emerald checkmarks */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "18px", color: TOKENS.colors.creamLight }}>
                  <span style={{ color: "#10B981", fontWeight: 900 }}>✓</span>
                  <span>API Pricing: $0.14 – $0.28 per million tokens</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "18px", color: TOKENS.colors.creamLight }}>
                  <span style={{ color: "#10B981", fontWeight: 900 }}>✓</span>
                  <span>Single GPU Yields $38/hr in revenue during off-peak</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "18px", color: TOKENS.colors.creamLight }}>
                  <span style={{ color: "#10B981", fontWeight: 900 }}>✓</span>
                  <span>Core Production Engine 100% Free on GitHub</span>
                </div>
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(250, 244, 217, 0.1)",
                paddingTop: "20px",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "14px", color: TOKENS.colors.textMuted }}>
                GROSS PROFIT MARGIN
              </div>
              <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "40px", fontWeight: 900, color: "#10B981" }}>
                ~80% Margin
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

