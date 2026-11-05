import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";
import { TOKENS } from "../../../design-system/tokens";

// ════════════════════════════════════════════════════════════════════
// SHARED: Matte Charcoal Surface with Subtle Radial Depth
// ════════════════════════════════════════════════════════════════════
export const VantaMatteOverlay: React.FC<{ accentGlow?: string }> = ({ accentGlow }) => (
  <>
    {accentGlow && (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 1100px 750px at 50% 50%, ${accentGlow} 0%, transparent 75%)`,
          pointerEvents: "none",
        }}
      />
    )}
  </>
);

// ════════════════════════════════════════════════════════════════════
// Scene 01: Silicon Valley Subscription Monopoly vs Pennies
// ════════════════════════════════════════════════════════════════════
export const Scene001_SubscriptionMonopoly: React.FC<{ durationInFrames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const card1 = spring({ frame: frame - 5, fps, config: TOKENS.motion.springs.hook });
  const card2 = spring({ frame: frame - 25, fps, config: TOKENS.motion.springs.hook });
  const float = Math.sin(frame / 18) * 4;

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <VantaMatteOverlay accentGlow="rgba(22, 119, 255, 0.08)" />

      {/* Corner Chrome */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 70,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: TOKENS.colors.accentBlue,
          letterSpacing: 3,
          fontWeight: 700,
        }}
      >
        [01/15 // THE SILICON VALLEY MYSTERY]
      </div>
      <div
        style={{
          position: "absolute",
          top: 50,
          right: 70,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: TOKENS.colors.creamLight,
          letterSpacing: 2,
          opacity: 0.6,
        }}
      >
        PRICING_DIVIDE: 2026
      </div>

      {/* Main Container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "40px",
          padding: "0 80px",
        }}
      >
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
            BILLIONS IN CLOUD BILLS VS OPEN WEIGHTS
          </div>
          <div
            style={{
              fontFamily: TOKENS.typography.displayHeadline,
              fontSize: "64px",
              fontWeight: 900,
              color: TOKENS.colors.creamLight,
              letterSpacing: "-1px",
            }}
          >
            The Subscriptions Wall
          </div>
        </div>

        {/* Dual Stack Comparison */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", width: "100%", maxWidth: "1280px" }}>
          {/* Card 1: Silicon Valley Closed Toll */}
          <div
            style={{
              transform: `translateX(${interpolate(card1, [0, 1], [-50, 0])}px) translateY(${float}px)`,
              opacity: interpolate(card1, [0, 1], [0, 1]),
              background: "#1C191A",
              border: "2px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "20px",
              padding: "44px 48px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.7), 0 0 35px rgba(239, 68, 68, 0.12)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "380px",
            }}
          >
            <div>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "14px", color: TOKENS.colors.accentRed, fontWeight: 700, letterSpacing: "2px" }}>
                WESTERN TECH MONOPOLY
              </div>
              <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "36px", fontWeight: 900, color: TOKENS.colors.creamLight, marginTop: "8px", marginBottom: "16px" }}>
                Locked Behind Paywalls
              </div>
              <div style={{ fontSize: "18px", color: TOKENS.colors.textMuted, lineHeight: "1.5" }}>
                Silicon Valley spent billions locking frontier intelligence behind expensive $20-$200 monthly subscriptions and private cloud gates.
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(250,244,217,0.1)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: TOKENS.typography.code, fontSize: "14px", color: TOKENS.colors.textMuted }}>SUBSCRIPTION COST</span>
              <span style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "36px", fontWeight: 900, color: TOKENS.colors.accentRed }}>$240 – $2,400/yr</span>
            </div>
          </div>

          {/* Card 2: The Chinese Labs Reality */}
          <div
            style={{
              transform: `translateX(${interpolate(card2, [0, 1], [50, 0])}px) translateY(${-float}px)`,
              opacity: interpolate(card2, [0, 1], [0, 1]),
              background: "#1C191A",
              border: "2px solid rgba(16, 185, 129, 0.4)",
              borderRadius: "20px",
              padding: "44px 48px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.7), 0 0 35px rgba(16, 185, 129, 0.12)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "380px",
            }}
          >
            <div>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "14px", color: TOKENS.colors.accentGreen, fontWeight: 700, letterSpacing: "2px" }}>
                DEEPSEEK REALITY
              </div>
              <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "36px", fontWeight: 900, color: TOKENS.colors.creamLight, marginTop: "8px", marginBottom: "16px" }}>
                Sold for Pennies
              </div>
              <div style={{ fontSize: "18px", color: TOKENS.colors.textMuted, lineHeight: "1.5" }}>
                Industry assumed massive financial losses to undercut rivals. In reality, radical systems engineering made it wildly profitable.
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(250,244,217,0.1)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: TOKENS.typography.code, fontSize: "14px", color: TOKENS.colors.textMuted }}>EFFECTIVE PRICING</span>
              <span style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "36px", fontWeight: 900, color: TOKENS.colors.accentGreen }}>$0.14 / 1M Tokens</span>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 02: DeepSeek V4.1 Flash & DeepEnphere GitHub Drop
// ════════════════════════════════════════════════════════════════════
export const Scene002_TheQuietDrop: React.FC<{ durationInFrames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 5, fps, config: TOKENS.motion.springs.hook });
  const pulse = 0.6 + Math.sin(frame / 12) * 0.4;

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <VantaMatteOverlay accentGlow="rgba(22, 119, 255, 0.1)" />

      {/* Corner Chrome */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 70,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: TOKENS.colors.accentBlue,
          letterSpacing: 3,
          fontWeight: 700,
        }}
      >
        [02/15 // THE GITHUB RELEASE]
      </div>
      <div
        style={{
          position: "absolute",
          top: 50,
          right: 70,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: TOKENS.colors.accentGreen,
          letterSpacing: 2,
          fontWeight: 700,
        }}
      >
        TAG: v4.1-flash-1017
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "36px",
        }}
      >
        <div
          style={{
            transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])}) translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
            opacity: interpolate(enter, [0, 1], [0, 1]),
            width: "1140px",
            background: "#1C191A",
            border: "2px solid rgba(22, 119, 255, 0.5)",
            borderRadius: "24px",
            padding: "48px 56px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.8), 0 0 50px rgba(22, 119, 255, 0.25)",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
          }}
        >
          {/* Release Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  background: "#EDEDED",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px",
                }}
              >
                <Img src={staticFile("assets/logos/github.svg")} style={{ width: "100%", height: "100%" }} />
              </div>
              <div>
                <div style={{ fontFamily: TOKENS.typography.code, fontSize: "14px", color: TOKENS.colors.accentBlue, fontWeight: 700, letterSpacing: "2px" }}>
                  OPEN SOURCE REPOSITORY
                </div>
                <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "28px", fontWeight: 800, color: TOKENS.colors.creamLight }}>
                  deepseek-ai / DeepEnphere
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.5)",
                borderRadius: "999px",
                padding: "8px 20px",
              }}
            >
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10B981", opacity: pulse }} />
              <span style={{ fontFamily: TOKENS.typography.code, fontSize: "13px", color: "#10B981", fontWeight: 700 }}>
                PRODUCTION RELEASE LIVE
              </span>
            </div>
          </div>

          {/* Headline */}
          <div>
            <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "52px", fontWeight: 900, color: TOKENS.colors.creamLight, letterSpacing: "-0.5px", marginBottom: "12px" }}>
              DeepSeek V4.1 Flash + DeepEnphere Engine
            </div>
            <div style={{ fontSize: "22px", color: TOKENS.colors.textMuted, lineHeight: "1.5" }}>
              Instead of keeping their proprietary inference optimizations behind closed doors, DeepSeek released their core production cluster engine directly to the open source community.
            </div>
          </div>

          {/* Telemetry Chips */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", borderTop: "1px solid rgba(250,244,217,0.1)", paddingTop: "24px" }}>
            <div style={{ background: "#252122", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(250,244,217,0.08)" }}>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "12px", color: TOKENS.colors.textMuted }}>MODEL ARCHITECTURE</div>
              <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "26px", fontWeight: 800, color: TOKENS.colors.accentBlue }}>Causal Enc/Dec</div>
            </div>
            <div style={{ background: "#252122", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(250,244,217,0.08)" }}>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "12px", color: TOKENS.colors.textMuted }}>CLUSTER TOPOLOGY</div>
              <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "26px", fontWeight: 800, color: TOKENS.colors.accentGreen }}>EP64 Wide MoE</div>
            </div>
            <div style={{ background: "#252122", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(250,244,217,0.08)" }}>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "12px", color: TOKENS.colors.textMuted }}>LICENSING</div>
              <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "26px", fontWeight: 800, color: TOKENS.colors.accentYellow }}>100% Free / MIT</div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 03: Astronomical Throughput Telemetry (155T Tokens / Day)
// ════════════════════════════════════════════════════════════════════
export const Scene003_Throughput155Trillion: React.FC<{ durationInFrames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 5, fps, config: TOKENS.motion.springs.hook });
  const tokenCount = Math.round(interpolate(frame, [10, 80], [10, 155], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const wordCount = (interpolate(frame, [15, 85], [0.2, 1.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })).toFixed(1);

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <VantaMatteOverlay accentGlow="rgba(16, 185, 129, 0.1)" />

      {/* Corner Chrome */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 70,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: TOKENS.colors.accentGreen,
          letterSpacing: 3,
          fontWeight: 700,
        }}
      >
        [03/15 // DATA CENTER THROUGHPUT]
      </div>
      <div
        style={{
          position: "absolute",
          top: 50,
          right: 70,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: TOKENS.colors.creamLight,
          letterSpacing: 2,
          opacity: 0.6,
        }}
      >
        CLUSTER_METRICS: 24/7/365
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "40px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: TOKENS.typography.code,
              fontSize: "16px",
              color: TOKENS.colors.accentGreen,
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            ASTRONOMICAL SCALE IN A SINGLE CLUSTER
          </div>
          <div
            style={{
              fontFamily: TOKENS.typography.displayHeadline,
              fontSize: "64px",
              fontWeight: 900,
              color: TOKENS.colors.creamLight,
              letterSpacing: "-1px",
            }}
          >
            155 Trillion Tokens Daily
          </div>
        </div>

        {/* Dual Massive Metric Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", width: "1160px" }}>
          <div
            style={{
              transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
              opacity: interpolate(enter, [0, 1], [0, 1]),
              background: "#1C191A",
              border: "2px solid rgba(16, 185, 129, 0.45)",
              borderRadius: "20px",
              padding: "44px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.7), 0 0 35px rgba(16, 185, 129, 0.15)",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: TOKENS.typography.code, fontSize: "15px", color: TOKENS.colors.accentGreen, fontWeight: 700, letterSpacing: "2px", marginBottom: "8px" }}>
              DAILY TOKEN VOLUME
            </div>
            <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "88px", fontWeight: 900, color: TOKENS.colors.creamLight, letterSpacing: "-2px" }}>
              {tokenCount}T
            </div>
            <div style={{ fontSize: "18px", color: TOKENS.colors.textMuted, marginTop: "8px" }}>
              Tokens processed every single day in production
            </div>
          </div>

          <div
            style={{
              transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
              opacity: interpolate(enter, [0, 1], [0, 1]),
              background: "#1C191A",
              border: "2px solid rgba(22, 119, 255, 0.45)",
              borderRadius: "20px",
              padding: "44px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.7), 0 0 35px rgba(22, 119, 255, 0.15)",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: TOKENS.typography.code, fontSize: "15px", color: TOKENS.colors.accentBlue, fontWeight: 700, letterSpacing: "2px", marginBottom: "8px" }}>
              GLOBAL REAL-TIME SPEED
            </div>
            <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "88px", fontWeight: 900, color: TOKENS.colors.creamLight, letterSpacing: "-2px" }}>
              {wordCount}B
            </div>
            <div style={{ fontSize: "18px", color: TOKENS.colors.textMuted, marginTop: "8px" }}>
              Words generated every second around the clock
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 04: The GPU Unit Economics Disruption ($38/hr vs 80% Margin)
// ════════════════════════════════════════════════════════════════════
export const Scene004_GPUProfitMargin: React.FC<{ durationInFrames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 5, fps, config: TOKENS.motion.springs.hook });
  const marginProgress = interpolate(frame, [20, 80], [0, 80], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <VantaMatteOverlay accentGlow="rgba(16, 185, 129, 0.12)" />

      {/* Corner Chrome */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 70,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: TOKENS.colors.accentGreen,
          letterSpacing: 3,
          fontWeight: 700,
        }}
      >
        [04/15 // UNIT ECONOMICS BREAKDOWN]
      </div>
      <div
        style={{
          position: "absolute",
          top: 50,
          right: 70,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: TOKENS.colors.creamLight,
          letterSpacing: 2,
          opacity: 0.6,
        }}
      >
        GPU_REVENUE: $38/HR
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "36px",
        }}
      >
        <div
          style={{
            transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
            opacity: interpolate(enter, [0, 1], [0, 1]),
            width: "1140px",
            background: "#1C191A",
            border: "2px solid #10B981",
            borderRadius: "24px",
            padding: "48px 56px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.8), 0 0 50px rgba(16, 185, 129, 0.25)",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
          }}
        >
          <div>
            <div style={{ fontFamily: TOKENS.typography.code, fontSize: "16px", color: TOKENS.colors.accentGreen, letterSpacing: "3px", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>
              ENTERPRISE CHIP REVENUE VS CLOUD COST
            </div>
            <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "52px", fontWeight: 900, color: TOKENS.colors.creamLight, letterSpacing: "-0.5px" }}>
              80% Gross Profit Margin
            </div>
            <div style={{ fontSize: "20px", color: TOKENS.colors.textMuted, marginTop: "8px" }}>
              When an enterprise AI chip typically costs $5 to $10 an hour to run, DeepSeek generates roughly $38/hour even during discounted off-peak hours.
            </div>
          </div>

          {/* Progress Margin Bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontFamily: TOKENS.typography.code, fontSize: "18px", color: TOKENS.colors.creamLight }}>
              <span>Operating Profit Margin</span>
              <span style={{ color: "#10B981", fontWeight: 900 }}>{Math.round(marginProgress)}% Net Margin</span>
            </div>
            <div style={{ width: "100%", height: "32px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden", border: "1px solid rgba(250,244,217,0.12)" }}>
              <div style={{ width: `${marginProgress}%`, height: "100%", background: "linear-gradient(90deg, #1677FF 0%, #10B981 100%)", borderRadius: "999px", boxShadow: "0 0 24px rgba(16,185,129,0.7)" }} />
            </div>
          </div>

          {/* Three Data Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", borderTop: "1px solid rgba(250,244,217,0.1)", paddingTop: "24px" }}>
            <div style={{ background: "#252122", padding: "18px 24px", borderRadius: "12px", border: "1px solid rgba(250,244,217,0.08)" }}>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "13px", color: TOKENS.colors.textMuted }}>GPU OPERATING COST</div>
              <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "32px", fontWeight: 900, color: TOKENS.colors.accentRed }}>$5 – $10 / hr</div>
            </div>
            <div style={{ background: "#252122", padding: "18px 24px", borderRadius: "12px", border: "1px solid rgba(250,244,217,0.08)" }}>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "13px", color: TOKENS.colors.textMuted }}>OFF-PEAK REVENUE</div>
              <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "32px", fontWeight: 900, color: TOKENS.colors.accentGreen }}>$38.20 / hr</div>
            </div>
            <div style={{ background: "#252122", padding: "18px 24px", borderRadius: "12px", border: "1px solid rgba(250,244,217,0.08)" }}>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "13px", color: TOKENS.colors.textMuted }}>NET HOURLY PROFIT</div>
              <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "32px", fontWeight: 900, color: TOKENS.colors.creamLight }}>+$28.20 / hr</div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

