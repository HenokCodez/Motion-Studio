import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TOKENS } from "../../design-system/tokens";

export const MG09InfrastructureRings: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const translateY = interpolate(enterSpring, [0, 1], [40, 0]);

  // Sequential ring draws
  const ring1 = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 16, mass: 0.8 } });
  const ring2 = spring({ frame: Math.max(0, frame - 35), fps, config: { damping: 16, mass: 0.8 } });
  const ring3 = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 16, mass: 0.8 } });

  // Continuous subtle orbital rotation
  const rot1 = (frame * 0.4) % 360;
  const rot2 = (-frame * 0.3) % 360;
  const rot3 = (frame * 0.5) % 360;

  // Arc circumferences
  const c1 = 2 * Math.PI * 180;
  const c2 = 2 * Math.PI * 135;
  const c3 = 2 * Math.PI * 90;

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
        [09/10 // AUTONOMOUS ARCHITECTURE RINGS]
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
        HARDWARE_SYNCHRONIZED: EP64 + 3FS
      </div>

      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          width: "1280px",
          background: "#1C191A",
          border: "2px solid rgba(16, 185, 129, 0.4)",
          borderRadius: "24px",
          padding: "48px 56px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.8), 0 0 40px rgba(16, 185, 129, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "48px",
        }}
      >
        {/* Left: Concentric Telemetry Rings */}
        <div
          style={{
            position: "relative",
            width: "440px",
            height: "440px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="440" height="440" style={{ transform: "rotate(-90deg)" }}>
            {/* Background Tracks */}
            <circle cx="220" cy="220" r="180" stroke="rgba(255,255,255,0.06)" strokeWidth="18" fill="none" />
            <circle cx="220" cy="220" r="135" stroke="rgba(255,255,255,0.06)" strokeWidth="18" fill="none" />
            <circle cx="220" cy="220" r="90" stroke="rgba(255,255,255,0.06)" strokeWidth="18" fill="none" />

            {/* Ring 1 (Outer - Emerald) */}
            <circle
              cx="220"
              cy="220"
              r="180"
              stroke="#10B981"
              strokeWidth="18"
              fill="none"
              strokeDasharray={c1}
              strokeDashoffset={c1 * (1 - ring1 * 0.94)}
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 12px rgba(16, 185, 129, 0.8))" }}
            />

            {/* Ring 2 (Middle - Electric Blue) */}
            <circle
              cx="220"
              cy="220"
              r="135"
              stroke="#1677FF"
              strokeWidth="18"
              fill="none"
              strokeDasharray={c2}
              strokeDashoffset={c2 * (1 - ring2 * 0.88)}
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 12px rgba(22, 119, 255, 0.8))" }}
            />

            {/* Ring 3 (Inner - Amber) */}
            <circle
              cx="220"
              cy="220"
              r="90"
              stroke="#F59E0B"
              strokeWidth="18"
              fill="none"
              strokeDasharray={c3}
              strokeDashoffset={c3 * (1 - ring3 * 0.5)}
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 12px rgba(245, 158, 11, 0.8))" }}
            />
          </svg>

          {/* Center Core Emblem */}
          <div
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: TOKENS.typography.code,
                fontSize: "12px",
                color: TOKENS.colors.textMuted,
                letterSpacing: "1px",
              }}
            >
              CORE ENGINE
            </div>
            <div
              style={{
                fontFamily: TOKENS.typography.displayHeadline,
                fontSize: "26px",
                fontWeight: 900,
                color: TOKENS.colors.creamLight,
              }}
            >
              DeepEnphere
            </div>
            <div
              style={{
                fontFamily: TOKENS.typography.code,
                fontSize: "11px",
                color: TOKENS.colors.accentGreen,
                fontWeight: 700,
              }}
            >
              ONLINE
            </div>
          </div>
        </div>

        {/* Right: Three Ring Telemetry Cards */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
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
              TRI-TIER HARDWARE & SOFTWARE TOPOLOGY
            </div>
            <div
              style={{
                fontFamily: TOKENS.typography.displayHeadline,
                fontSize: "48px",
                fontWeight: 900,
                color: TOKENS.colors.creamLight,
                letterSpacing: "-0.5px",
              }}
            >
              Integrated Efficiency Rings
            </div>
          </div>

          {/* Ring 1 Card */}
          <div
            style={{
              background: "#252122",
              border: "1.5px solid #10B981",
              borderRadius: "14px",
              padding: "18px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 8px 24px rgba(16, 185, 129, 0.15)",
            }}
          >
            <div>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "12px", color: "#10B981", fontWeight: 700 }}>
                RING 1 // CONTEXT CACHE
              </div>
              <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "22px", fontWeight: 800, color: TOKENS.colors.creamLight }}>
                100PB 3FS NVMe SSD Storage
              </div>
              <div style={{ fontSize: "14px", color: TOKENS.colors.textMuted }}>Dedicated distributed context file system</div>
            </div>
            <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "36px", fontWeight: 900, color: "#10B981" }}>
              96% HIT
            </div>
          </div>

          {/* Ring 2 Card */}
          <div
            style={{
              background: "#252122",
              border: "1.5px solid #1677FF",
              borderRadius: "14px",
              padding: "18px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 8px 24px rgba(22, 119, 255, 0.15)",
            }}
          >
            <div>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "12px", color: "#1677FF", fontWeight: 700 }}>
                RING 2 // CLUSTER TOPOLOGY
              </div>
              <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "22px", fontWeight: 800, color: TOKENS.colors.creamLight }}>
                Wide Expert Parallelism (EP64)
              </div>
              <div style={{ fontSize: "14px", color: TOKENS.colors.textMuted }}>Distributes MoE across 64-128 GPUs</div>
            </div>
            <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "36px", fontWeight: 900, color: "#1677FF" }}>
              -88% COMM
            </div>
          </div>

          {/* Ring 3 Card */}
          <div
            style={{
              background: "#252122",
              border: "1.5px solid #F59E0B",
              borderRadius: "14px",
              padding: "18px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 8px 24px rgba(245, 158, 11, 0.15)",
            }}
          >
            <div>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "12px", color: "#F59E0B", fontWeight: 700 }}>
                RING 3 // ATTENTION KERNEL
              </div>
              <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "22px", fontWeight: 800, color: TOKENS.colors.creamLight }}>
                Causal Encoder-Decoder Split
              </div>
              <div style={{ fontSize: "14px", color: TOKENS.colors.textMuted }}>Dedicated prompt reader cuts compute in half</div>
            </div>
            <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "36px", fontWeight: 900, color: "#F59E0B" }}>
              -50% WORK
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

