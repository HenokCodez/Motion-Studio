import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TOKENS } from "../../design-system/tokens";

interface Milestone {
  year: string;
  title: string;
  desc: string;
  tag: string;
  color: string;
}

const MILESTONES: Milestone[] = [
  {
    year: "2023",
    title: "Brute Force Dense",
    desc: "Cloud monopolies charge $20-$200/mo burning massive GPU power",
    tag: "CLOSED WALL",
    color: "#EF4444",
  },
  {
    year: "2024",
    title: "Sparse MoE Era",
    desc: "Initial mixture-of-experts routing proves early compute leverage",
    tag: "FIRST CRACKS",
    color: "#F59E0B",
  },
  {
    year: "2025",
    title: "DeepSeek V3 / R1",
    desc: "Training efficiency shakes Silicon Valley valuation models",
    tag: "PARADIGM SHIFT",
    color: "#1677FF",
  },
  {
    year: "2026",
    title: "DeepEnphere & V4.1",
    desc: "Causal encoder/decoder + 3FS 100PB rewrite production inference",
    tag: "OPEN PLAYBOOK",
    color: "#10B981",
  },
];

export const MG08TimelineRuler: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const translateY = interpolate(enterSpring, [0, 1], [40, 0]);

  // Node travel progression across milestones (0 to 3)
  const nodeProgress = interpolate(frame, [15, 120], [0, 3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final 2026 milestone organic bump pop (frame 120+)
  const finalPop = spring({
    frame: Math.max(0, frame - 120),
    fps,
    config: { damping: 12, mass: 0.6 },
  });

  // Spine width
  const totalWidth = 1100;
  const stepWidth = totalWidth / 3;
  const runnerX = nodeProgress * stepWidth;

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
          color: TOKENS.colors.accentYellow,
          letterSpacing: 2,
          fontWeight: 700,
        }}
      >
        [08/10 // INFERENCE PARADIGM TIMELINE]
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
        CHRONOLOGY: 2023 - 2026
      </div>

      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          width: "1280px",
          background: "#1C191A",
          border: "2px solid rgba(245, 158, 11, 0.4)",
          borderRadius: "24px",
          padding: "48px 56px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.8), 0 0 40px rgba(245, 158, 11, 0.15)",
          display: "flex",
          flexDirection: "column",
          gap: "44px",
        }}
      >
        {/* Title Row */}
        <div>
          <div
            style={{
              fontFamily: TOKENS.typography.code,
              fontSize: "16px",
              color: TOKENS.colors.accentYellow,
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            HISTORICAL SHIFT TO OPEN INFRASTRUCTURE
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
            How Silicon Valley Lost the Edge
          </div>
        </div>

        {/* Timeline Ruler Spine */}
        <div style={{ position: "relative", width: "100%", height: "240px" }}>
          {/* Main Horizontal Spine Track */}
          <div
            style={{
              position: "absolute",
              top: "50px",
              left: "40px",
              right: "40px",
              height: "4px",
              background: "rgba(250, 244, 217, 0.15)",
            }}
          />

          {/* Active Highlight Spine Track */}
          <div
            style={{
              position: "absolute",
              top: "50px",
              left: "40px",
              width: `${runnerX}px`,
              height: "4px",
              background: "linear-gradient(90deg, #EF4444 0%, #1677FF 60%, #10B981 100%)",
              boxShadow: "0 0 16px rgba(16, 185, 129, 0.8)",
            }}
          />

          {/* Traveling Node Runner */}
          <div
            style={{
              position: "absolute",
              top: "40px",
              left: `${40 + runnerX - 12}px`,
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              background: "#FAF4D9",
              border: "3px solid #10B981",
              boxShadow: "0 0 20px #10B981, 0 0 40px #10B981",
              transform: `scale(${1 + finalPop * 0.4})`,
              zIndex: 10,
            }}
          />

          {/* Milestones */}
          <div
            style={{
              position: "absolute",
              top: "0px",
              left: "40px",
              right: "40px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {MILESTONES.map((m, idx) => {
              const isActive = nodeProgress >= idx;
              const isCurrent = Math.round(nodeProgress) === idx;

              return (
                <div
                  key={m.year}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "260px",
                    textAlign: "center",
                  }}
                >
                  {/* Year Tag */}
                  <div
                    style={{
                      fontFamily: TOKENS.typography.displayHeadline,
                      fontSize: "36px",
                      fontWeight: 900,
                      color: isActive ? m.color : TOKENS.colors.textMuted,
                      marginBottom: "28px",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {m.year}
                  </div>

                  {/* Node Anchor Point */}
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: isActive ? m.color : "#2C2728",
                      border: `2px solid ${isActive ? m.color : "rgba(250,244,217,0.2)"}`,
                      marginBottom: "24px",
                      zIndex: 2,
                    }}
                  />

                  {/* Card Content */}
                  <div
                    style={{
                      background: isCurrent ? "#252122" : "rgba(255,255,255,0.02)",
                      border: isCurrent
                        ? `1.5px solid ${m.color}`
                        : "1px solid rgba(250,244,217,0.06)",
                      borderRadius: "14px",
                      padding: "16px 20px",
                      width: "100%",
                      boxShadow: isCurrent ? `0 10px 24px ${m.color}20` : "none",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: TOKENS.typography.code,
                        fontSize: "12px",
                        color: m.color,
                        letterSpacing: "1px",
                        fontWeight: 700,
                        marginBottom: "4px",
                      }}
                    >
                      {m.tag}
                    </div>
                    <div
                      style={{
                        fontFamily: TOKENS.typography.displayHeadline,
                        fontSize: "20px",
                        fontWeight: 800,
                        color: TOKENS.colors.creamLight,
                        marginBottom: "6px",
                      }}
                    >
                      {m.title}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: TOKENS.colors.textMuted,
                        lineHeight: "1.35",
                      }}
                    >
                      {m.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

