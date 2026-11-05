import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const MG01CausalEncoderDecoder: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({ frame, fps, config: { damping: 14, mass: 0.8, stiffness: 180 } });
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const translateY = interpolate(enterSpring, [0, 1], [40, 0]);

  // Cleavage split: frames 45-80
  const splitProgress = interpolate(frame, [45, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const readerOffset = splitProgress * 30;
  const writerOffset = -splitProgress * 30;

  // Compute reduction counter: frames 85-150
  const counterVal = Math.round(
    interpolate(frame, [85, 140], [0, 50], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Living micro-motion
  const float = Math.sin(frame / 16) * 4;
  const laserSweep = (frame * 6) % 900;
  const pulseGlow = 0.25 + Math.sin(frame / 12) * 0.1;

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
      {/* Corner Chrome Anchors */}
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
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1677FF", boxShadow: "0 0 10px #1677FF" }} />
        <span>[ARCH // CED-TRANSFORMER-V4.1]</span>
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
        [ACTIVE PREFILL LAYERS: 20/40]
      </div>

      {/* Main Graphic Container */}
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
        {/* Hero Headline */}
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
          Causal Encoder-Decoder Layer Split
        </div>

        {/* Transformer Stack Visualization */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            width: "100%",
            alignItems: "center",
          }}
        >
          {/* Top Half: Decoder (Writer) */}
          <div
            style={{
              width: "100%",
              height: 140,
              borderRadius: 20,
              background: "#252122",
              border: `1.5px solid ${splitProgress > 0.5 ? "rgba(250, 244, 217, 0.15)" : "rgba(22, 119, 255, 0.4)"}`,
              transform: `translateY(${writerOffset}px)`,
              opacity: splitProgress > 0.5 ? 0.35 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 40px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
              transition: "opacity 0.3s ease",
            }}
          >
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#FAF4D9" }}>TOP 20 LAYERS: AUTOREGRESSIVE WRITER</div>
              <div style={{ fontSize: 22, color: "rgba(250, 244, 217, 0.6)", marginTop: 6, fontFamily: "monospace" }}>
                Token Generation Only • Bypassed During Reading Phase
              </div>
            </div>
            <div
              style={{
                padding: "8px 18px",
                borderRadius: 10,
                background: "rgba(250, 244, 217, 0.08)",
                color: "#FAF4D9",
                fontFamily: "monospace",
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {splitProgress > 0.5 ? "[SLEEPING]" : "[IDLE]"}
            </div>
          </div>

          {/* Cleavage / Split Boundary Line */}
          <div
            style={{
              width: "100%",
              height: 4,
              background: `linear-gradient(90deg, transparent, #1677FF, #10B981, transparent)`,
              opacity: splitProgress,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: laserSweep,
                width: 120,
                height: 4,
                background: "#FAF4D9",
                boxShadow: "0 0 15px #FAF4D9",
              }}
            />
          </div>

          {/* Bottom Half: Causal Encoder (Reader) */}
          <div
            style={{
              width: "100%",
              height: 140,
              borderRadius: 20,
              background: "#1C191A",
              border: "2px solid #1677FF",
              transform: `translateY(${readerOffset}px)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 40px",
              boxShadow: `0 0 40px rgba(22, 119, 255, ${pulseGlow})`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#1677FF" }}>BOTTOM 20 LAYERS: DEDICATED CAUSAL READER</div>
              <div style={{ fontSize: 22, color: "rgba(250, 244, 217, 0.8)", marginTop: 6, fontFamily: "monospace" }}>
                Parallel Prompt Prefill • Cuts Heavy Reading Compute by 50%
              </div>
            </div>
            <div
              style={{
                padding: "8px 18px",
                borderRadius: 10,
                background: "rgba(22, 119, 255, 0.2)",
                border: "1px solid #1677FF",
                color: "#1677FF",
                fontFamily: "monospace",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              [ACTIVE PREFILL]
            </div>
          </div>
        </div>

        {/* Telemetry Footer Callout */}
        <div
          style={{
            marginTop: 44,
            display: "flex",
            alignItems: "center",
            gap: 24,
            background: "rgba(35, 31, 32, 0.85)",
            border: "1px solid rgba(250, 244, 217, 0.15)",
            borderRadius: 16,
            padding: "16px 36px",
          }}
        >
          <div style={{ fontSize: 26, color: "rgba(250, 244, 217, 0.75)" }}>PREFILL COMPUTE WORKLOAD:</div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "#10B981",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            -{counterVal}% FLOPs
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

