import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const MG03ContextCache: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({ frame, fps, config: { damping: 14, mass: 0.8, stiffness: 180 } });
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const translateY = interpolate(enterSpring, [0, 1], [40, 0]);

  // Hit rate meter: frames 40 to 110
  const hitRate = Math.round(
    interpolate(frame, [40, 110], [0, 96], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Micro-motion
  const float = Math.sin(frame / 16) * 4;
  const pulseRings = 0.3 + Math.sin(frame / 10) * 0.15;

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
        <span>[STORAGE // 100 PETABYTE 3FS CLUSTER]</span>
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
        [LATENCY: SUB-MILLISECOND]
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
          100PB Distributed Context Storage
        </div>

        {/* Dual Cards: Storage Tier + Cache Hit Rate */}
        <div style={{ display: "flex", gap: 28, width: "100%" }}>
          {/* Card 1: 3FS Storage Cluster */}
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
              <div style={{ fontSize: 22, color: "#1677FF", fontFamily: "monospace", fontWeight: 700 }}>
                CUSTOM DISTRIBUTED FILE SYSTEM
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#FAF4D9", marginTop: 8 }}>
                3FS Storage Fabric
              </div>
              <div style={{ fontSize: 20, color: "rgba(250, 244, 217, 0.7)", marginTop: 12, lineHeight: 1.5 }}>
                100 Petabytes of NVMe SSD storage dedicated entirely to caching precomputed prompt states.
              </div>
            </div>

            <div
              style={{
                marginTop: 28,
                padding: "12px 20px",
                background: "rgba(22, 119, 255, 0.12)",
                border: "1px solid rgba(22, 119, 255, 0.3)",
                borderRadius: 12,
                fontFamily: "monospace",
                fontSize: 22,
                color: "#1677FF",
                fontWeight: 600,
              }}
            >
              100,000,000 GB CAPACITY
            </div>
          </div>

          {/* Card 2: Cache Hit Telemetry */}
          <div
            style={{
              flex: 1,
              background: "#252122",
              border: "1.5px solid #10B981",
              borderRadius: 20,
              padding: 36,
              boxShadow: `0 0 50px rgba(16, 185, 129, ${pulseRings})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 22, color: "rgba(250, 244, 217, 0.7)", fontFamily: "monospace" }}>
              ACTIVE CACHE HIT RATE
            </div>

            <div
              style={{
                fontSize: 100,
                fontWeight: 900,
                color: "#10B981",
                fontFamily: "'JetBrains Mono', monospace",
                lineHeight: 1,
                margin: "18px 0",
              }}
            >
              {hitRate}%
            </div>

            <div style={{ fontSize: 22, color: "#FAF4D9", fontWeight: 600 }}>
              Reuses Prior Computations Instantly
            </div>
            <div style={{ fontSize: 18, color: "rgba(250, 244, 217, 0.5)", fontFamily: "monospace", marginTop: 6 }}>
              Only 4% Diverts to Active GPU Recompute
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

