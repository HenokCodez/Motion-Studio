import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TOKENS } from "../../design-system/tokens";

export const MG07VelocityGauge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const translateY = interpolate(enterSpring, [0, 1], [40, 0]);

  // Phase 1: Baseline ramp (frames 15 to 45) -> 24 tok/s to 125 tok/s
  // Phase 2: Micro-pause (frames 45 to 65)
  // Phase 3: Turbo acceleration surge (frames 65 to 130) -> 800+ tok/s
  const tokenSpeed = Math.round(
    interpolate(
      frame,
      [15, 45, 65, 120, 180],
      [24, 125, 150, 800, 842],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    )
  );

  const progressPercent = Math.min(
    100,
    Math.round(
      interpolate(
        frame,
        [15, 50, 70, 130],
        [12, 45, 55, 96],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    )
  );

  // Traveling laser shimmer sweep across track
  const shimmerOffset = (frame * 5) % 100;

  // Active status blink
  const pulseOpacity = 0.5 + Math.sin(frame / 6) * 0.5;

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
          color: TOKENS.colors.accentGreen,
          letterSpacing: 2,
          fontWeight: 700,
        }}
      >
        [07/10 // INFERENCE SPEED TELEMETRY]
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
        STREAM_LATENCY: 18ms
      </div>

      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          width: "1080px",
          background: "#1C191A",
          border: "2px solid rgba(16, 185, 129, 0.45)",
          borderRadius: "24px",
          padding: "48px 56px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.8), 0 0 45px rgba(16, 185, 129, 0.2)",
          display: "flex",
          flexDirection: "column",
          gap: "36px",
        }}
      >
        {/* Header row with status chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: TOKENS.typography.code,
                fontSize: "16px",
                color: TOKENS.colors.accentGreen,
                letterSpacing: "3px",
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: "6px",
              }}
            >
              REAL-TIME THROUGHPUT SURGE
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
              Raw Inference Velocity
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
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: TOKENS.colors.accentGreen,
                opacity: pulseOpacity,
              }}
            />
            <span
              style={{
                fontFamily: TOKENS.typography.code,
                fontSize: "14px",
                color: TOKENS.colors.accentGreen,
                fontWeight: 700,
                letterSpacing: "1px",
              }}
            >
              LIVE BENCHMARK
            </span>
          </div>
        </div>

        {/* Speedometer Primary Metric */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(250, 244, 217, 0.08)",
            borderRadius: "16px",
            padding: "24px 36px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "20px",
                color: TOKENS.colors.textMuted,
                marginBottom: "4px",
              }}
            >
              Generation Velocity
            </div>
            <div
              style={{
                fontFamily: TOKENS.typography.code,
                fontSize: "15px",
                color: TOKENS.colors.accentBlue,
              }}
            >
              Optimized cluster stream
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
            <span
              style={{
                fontFamily: TOKENS.typography.displayHeadline,
                fontSize: "96px",
                fontWeight: 900,
                color: TOKENS.colors.accentGreen,
                letterSpacing: "-2px",
              }}
            >
              {tokenSpeed}
            </span>
            <span
              style={{
                fontFamily: TOKENS.typography.code,
                fontSize: "28px",
                color: TOKENS.colors.creamLight,
                fontWeight: 700,
              }}
            >
              TOKENS / SEC
            </span>
          </div>
        </div>

        {/* Thick Pill Progress Track with Glowing Gradient & Laser Shimmer */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px",
              fontFamily: TOKENS.typography.code,
              fontSize: "16px",
              color: TOKENS.colors.creamLight,
            }}
          >
            <span>Standard Baseline (24 tok/s)</span>
            <span style={{ color: TOKENS.colors.accentGreen, fontWeight: 700 }}>
              Peak Acceleration: {progressPercent}% of Theoretical Max
            </span>
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              height: "36px",
              background: "rgba(255, 255, 255, 0.06)",
              borderRadius: "999px",
              overflow: "hidden",
              border: "1px solid rgba(250, 244, 217, 0.12)",
            }}
          >
            {/* Fill Bar */}
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                background: "linear-gradient(90deg, #1677FF 0%, #10B981 100%)",
                borderRadius: "999px",
                boxShadow: "0 0 24px rgba(16, 185, 129, 0.6)",
                position: "relative",
              }}
            />
            {/* Traveling Laser Shimmer */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${shimmerOffset}%`,
                width: "80px",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
                transform: "skewX(-25deg)",
              }}
            />
          </div>
        </div>

        {/* Bottom Hardware Telemetry Badges */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "20px",
            borderTop: "1px solid rgba(250, 244, 217, 0.1)",
            paddingTop: "24px",
          }}
        >
          <div style={{ background: "#252122", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(250,244,217,0.08)" }}>
            <div style={{ fontFamily: TOKENS.typography.code, fontSize: "13px", color: TOKENS.colors.textMuted }}>TIME TO FIRST TOKEN</div>
            <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "28px", fontWeight: 800, color: TOKENS.colors.creamLight }}>18.4 ms</div>
          </div>
          <div style={{ background: "#252122", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(250,244,217,0.08)" }}>
            <div style={{ fontFamily: TOKENS.typography.code, fontSize: "13px", color: TOKENS.colors.textMuted }}>COMPUTE REDUCTION</div>
            <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "28px", fontWeight: 800, color: TOKENS.colors.accentBlue }}>-50% Prompt</div>
          </div>
          <div style={{ background: "#252122", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(250,244,217,0.08)" }}>
            <div style={{ fontFamily: TOKENS.typography.code, fontSize: "13px", color: TOKENS.colors.textMuted }}>CLUSTER EFFICIENCY</div>
            <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "28px", fontWeight: 800, color: TOKENS.colors.accentGreen }}>94.2% FLOPs</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

