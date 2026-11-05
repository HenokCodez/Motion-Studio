import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const MG02WideExpertParallelism: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({ frame, fps, config: { damping: 14, mass: 0.8, stiffness: 180 } });
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const translateY = interpolate(enterSpring, [0, 1], [40, 0]);

  // Traffic drop animation (frames 50 to 110)
  const trafficDrop = interpolate(frame, [50, 110], [100, 12.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const trafficReduction = Math.round(100 - trafficDrop);

  // Micro-motion
  const float = Math.sin(frame / 16) * 4;
  const pulseNode = Math.sin(frame / 8) * 0.3;

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
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 10px #10B981" }} />
        <span>[CLUSTER FABRIC // 128-GPU WIDE-EP]</span>
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
        [BUS CONGESTION: NOMINAL]
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
        {/* Headline */}
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
          Wide Expert Parallelism (Wide-EP)
        </div>

        {/* 64-128 GPU Cluster Matrix Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(16, 1fr)",
            gap: 8,
            width: "100%",
            background: "#1C191A",
            padding: 24,
            borderRadius: 20,
            border: "1.5px solid rgba(250, 244, 217, 0.12)",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5)",
          }}
        >
          {Array.from({ length: 64 }).map((_, i) => {
            const isActive = (i * 7 + Math.floor(frame / 4)) % 11 === 0;
            return (
              <div
                key={i}
                style={{
                  height: 36,
                  borderRadius: 6,
                  background: isActive ? "#1677FF" : "rgba(250, 244, 217, 0.06)",
                  border: isActive ? "1px solid #FAF4D9" : "1px solid rgba(250, 244, 217, 0.08)",
                  boxShadow: isActive ? `0 0 12px rgba(22, 119, 255, 0.8)` : "none",
                  transition: "background 0.2s ease",
                }}
              />
            );
          })}
        </div>

        {/* Telemetry Comparison Readout */}
        <div
          style={{
            marginTop: 36,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#252122",
            border: "1px solid rgba(250, 244, 217, 0.15)",
            borderRadius: 16,
            padding: "20px 40px",
          }}
        >
          <div>
            <div style={{ fontSize: 24, color: "rgba(250, 244, 217, 0.7)", fontFamily: "monospace" }}>INTER-NODE MEMORY BUS TRAFFIC</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#FAF4D9", marginTop: 4 }}>
              Distributed MoE Expert Routing
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 60,
                fontWeight: 900,
                color: "#10B981",
                fontFamily: "'JetBrains Mono', monospace",
                lineHeight: 1,
              }}
            >
              -{trafficReduction}%
            </div>
            <div style={{ fontSize: 20, color: "rgba(250, 244, 217, 0.6)", fontFamily: "monospace", marginTop: 4 }}>
              BUS CONGESTION COLLAPSE
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

