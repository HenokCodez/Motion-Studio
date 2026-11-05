import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const MG04HardwareSupportMatrix: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({ frame, fps, config: { damping: 14, mass: 0.8, stiffness: 180 } });
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const translateY = interpolate(enterSpring, [0, 1], [40, 0]);

  // Card 3 strike: frames 70 to 110
  const strikeProgress = interpolate(frame, [70, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Micro-motion
  const float = Math.sin(frame / 16) * 4;

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
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1677FF", boxShadow: "0 0 10px #1677FF" }} />
        <span>[HARDWARE TARGETS // CANN 8.0 & CUDA-X]</span>
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
        [SILICON SOVEREIGNTY: CONFIRMED]
      </div>

      {/* Main Container */}
      <div
        style={{
          opacity,
          transform: `translateY(${translateY + float}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 1200,
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
          Silicon Architecture Support Matrix
        </div>

        {/* 3 Hardware Cards */}
        <div style={{ display: "flex", gap: 24, width: "100%" }}>
          {/* Card 1: Nvidia Blackwell */}
          <div
            style={{
              flex: 1,
              background: "#1C191A",
              border: "1.5px solid #1677FF",
              borderRadius: 20,
              padding: "32px 24px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: 260,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: 8,
                  background: "rgba(22, 119, 255, 0.2)",
                  color: "#1677FF",
                  fontFamily: "monospace",
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 16,
                }}
              >
                NATIVE SUPPORT
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#FAF4D9" }}>NVIDIA BLACKWELL</div>
              <div style={{ fontSize: 20, color: "rgba(250, 244, 217, 0.7)", marginTop: 8 }}>
                B200 / GB200 Cluster Scale
              </div>
            </div>
            <div style={{ fontSize: 18, color: "#10B981", fontFamily: "monospace", fontWeight: 600 }}>
              ✓ High-Throughput Production
            </div>
          </div>

          {/* Card 2: Huawei Ascend 950 */}
          <div
            style={{
              flex: 1,
              background: "#1C191A",
              border: "1.5px solid #10B981",
              borderRadius: 20,
              padding: "32px 24px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: 260,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: 8,
                  background: "rgba(16, 185, 129, 0.2)",
                  color: "#10B981",
                  fontFamily: "monospace",
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 16,
                }}
              >
                DOMESTIC CHINESE SILICON
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#FAF4D9" }}>HUAWEI ASCEND 950</div>
              <div style={{ fontSize: 20, color: "rgba(250, 244, 217, 0.7)", marginTop: 8 }}>
                Native CANN 8.0 Kernel Stack
              </div>
            </div>
            <div style={{ fontSize: 18, color: "#10B981", fontFamily: "monospace", fontWeight: 600 }}>
              ✓ Sanction-Resilient Architecture
            </div>
          </div>

          {/* Card 3: Hopper Bypass */}
          <div
            style={{
              flex: 1,
              background: "#252122",
              border: `1.5px solid ${strikeProgress > 0.5 ? "#EF4444" : "rgba(250, 244, 217, 0.15)"}`,
              borderRadius: 20,
              padding: "32px 24px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: 260,
              opacity: strikeProgress > 0.5 ? 0.65 : 1,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: 8,
                  background: strikeProgress > 0.5 ? "rgba(239, 68, 68, 0.2)" : "rgba(250, 244, 217, 0.08)",
                  color: strikeProgress > 0.5 ? "#EF4444" : "rgba(250, 244, 217, 0.6)",
                  fontFamily: "monospace",
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 16,
                }}
              >
                {strikeProgress > 0.5 ? "BYPASSED" : "PREVIOUS GEN"}
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#FAF4D9" }}>NVIDIA HOPPER</div>
              <div style={{ fontSize: 20, color: "rgba(250, 244, 217, 0.6)", marginTop: 8 }}>
                H100 / H800 Architecture
              </div>
            </div>
            <div
              style={{
                fontSize: 18,
                color: strikeProgress > 0.5 ? "#EF4444" : "rgba(250, 244, 217, 0.5)",
                fontFamily: "monospace",
                fontWeight: 600,
              }}
            >
              {strikeProgress > 0.5 ? "✗ Skipped Entire Generation" : "Standard Enterprise"}
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div
          style={{
            marginTop: 36,
            background: "rgba(35, 31, 32, 0.9)",
            border: "1px solid rgba(250, 244, 217, 0.15)",
            borderRadius: 16,
            padding: "16px 40px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 22,
            color: "#FAF4D9",
            letterSpacing: "0.04em",
          }}
        >
          FRONTIER AI OPERATIONS RUN COMPLETELY INDEPENDENT OF WESTERN SILICON
        </div>
      </div>
    </AbsoluteFill>
  );
};

