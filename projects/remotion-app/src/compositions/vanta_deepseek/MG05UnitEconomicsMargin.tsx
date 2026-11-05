import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const MG05UnitEconomicsMargin: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({ frame, fps, config: { damping: 14, mass: 0.8, stiffness: 180 } });
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const translateY = interpolate(enterSpring, [0, 1], [40, 0]);

  // Margin counter: frames 50 to 120
  const marginCounter = Math.round(
    interpolate(frame, [50, 120], [0, 80], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Micro-motion
  const float = Math.sin(frame / 16) * 4;
  const pulseEmerald = 0.25 + Math.sin(frame / 12) * 0.12;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', system-ui, sans-serif",
        background: "transparent",
      }}
    >
      {/* Corner Chrome */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          fontFamily: "'JetBrains Mono', 'VP Pixel', monospace",
          fontSize: 24,
          color: "rgba(250, 244, 217, 0.65)",
          letterSpacing: "0.08em",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 10px #10B981" }} />
        <span>[FINANCIAL MODEL // GPU UNIT RUN-RATE]</span>
      </div>

      <div
        style={{
          position: "absolute",
          top: 60,
          right: 80,
          fontFamily: "'JetBrains Mono', 'VP Pixel', monospace",
          fontSize: 24,
          color: "rgba(250, 244, 217, 0.65)",
          letterSpacing: "0.08em",
        }}
      >
        [ESTIMATED GROSS MARGIN: 80%+]
      </div>

      {/* Main Container */}
      <div
        style={{
          opacity,
          transform: `translateY(${translateY + float}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 1100,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#FAF4D9",
            marginBottom: 36,
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}
        >
          Single GPU Production Economics
        </div>

        {/* Dual Columns: Operational Cost vs Off-Peak Revenue */}
        <div style={{ display: "flex", gap: 28, width: "100%" }}>
          {/* Left: Typical Enterprise Cost */}
          <div
            style={{
              flex: 1,
              background: "#1C191A",
              border: "1.5px solid rgba(250, 244, 217, 0.12)",
              borderRadius: 20,
              padding: 36,
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 22, color: "#F59E0B", fontFamily: "monospace", fontWeight: 700 }}>
                OPERATIONAL COST
              </div>
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  color: "#FAF4D9",
                  fontFamily: "'JetBrains Mono', monospace",
                  marginTop: 12,
                }}
              >
                $5 – $10
              </div>
              <div style={{ fontSize: 20, color: "rgba(250, 244, 217, 0.6)", marginTop: 4 }}>
                Per GPU Hour (Western Cloud Baseline)
              </div>
            </div>
            <div
              style={{
                marginTop: 24,
                padding: "10px 18px",
                borderRadius: 10,
                background: "rgba(245, 158, 11, 0.1)",
                color: "#F59E0B",
                fontFamily: "monospace",
                fontSize: 18,
              }}
            >
              Hardware amortisation, power & cooling
            </div>
          </div>

          {/* Right: DeepSeek Revenue */}
          <div
            style={{
              flex: 1,
              background: "#252122",
              border: "1.5px solid #1677FF",
              borderRadius: 20,
              padding: 36,
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 22, color: "#1677FF", fontFamily: "monospace", fontWeight: 700 }}>
                OFF-PEAK REVENUE
              </div>
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  color: "#1677FF",
                  fontFamily: "'JetBrains Mono', monospace",
                  marginTop: 12,
                }}
              >
                ~$38.00
              </div>
              <div style={{ fontSize: 20, color: "rgba(250, 244, 217, 0.8)", marginTop: 4 }}>
                Per GPU Hour Generated By Deep Infer
              </div>
            </div>
            <div
              style={{
                marginTop: 24,
                padding: "10px 18px",
                borderRadius: 10,
                background: "rgba(22, 119, 255, 0.15)",
                color: "#1677FF",
                fontFamily: "monospace",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              High concurrency & massive token throughput
            </div>
          </div>
        </div>

        {/* Elevated Profit Delta Result */}
        <div
          style={{
            marginTop: 36,
            width: "100%",
            background: "#1C191A",
            border: "2px solid #10B981",
            borderRadius: 20,
            padding: "24px 44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: `0 0 50px rgba(16, 185, 129, ${pulseEmerald})`,
          }}
        >
          <div>
            <div style={{ fontSize: 24, color: "rgba(250, 244, 217, 0.7)", fontFamily: "monospace" }}>
              RESULTING GROSS PROFIT MARGIN
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#FAF4D9", marginTop: 4 }}>
              Not losing money — highly profitable at scale
            </div>
          </div>

          <div
            style={{
              fontSize: 84,
              fontWeight: 900,
              color: "#10B981",
              fontFamily: "'JetBrains Mono', monospace",
              lineHeight: 1,
            }}
          >
            ~{marginCounter}%
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

