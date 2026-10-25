import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface UserBoardTimelineRulerProps {
  accentColor?: string;
}

interface MilestoneStage {
  year: string;
  tag: string;
  tagColor: string;
  title: string;
  description: string;
  stat1Label: string;
  stat1Val: string;
  stat1Color: string;
  stat2Label: string;
  stat2Val: string;
  stat2Color: string;
  startFrame: number;
  endFrame: number;
}

export const UserBoardTimelineRuler: React.FC<UserBoardTimelineRulerProps> = ({
  accentColor = "#10B981",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for main container
  const enterSpring = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const containerOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const containerY = interpolate(enterSpring, [0, 1], [30, 0]);

  // Year positions (Y in SVG coordinates)
  // 2020: 30
  // 2022: 135
  // 2024: 240
  // 2026: 345
  const nodeY = interpolate(
    frame,
    [0, 35, 60, 95, 120, 155, 180, 225],
    [30, 30, 135, 135, 240, 240, 345, 345],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Protrusion bump expansion at 2026
  const bumpExpansion = interpolate(frame, [155, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bumpX = 24 + bumpExpansion * 30; // 24 -> 54
  const nodeX = 24 + bumpExpansion * 30;

  // Active year indicator on the ruler
  const activeYearIndex = frame < 50 ? 0 : frame < 110 ? 1 : frame < 170 ? 2 : 3;

  // Pulse on 2026 arrival
  const arrivalPulse = spring({
    frame: Math.max(0, frame - 175),
    fps,
    config: { damping: 12, mass: 0.5 },
  });

  // Dynamic ambient glow pulse
  const ambientGlowPulse = 0.2 + Math.sin(frame / 12) * 0.08;
  const subtleFloat = Math.sin(frame / 16) * 3;

  // 4 Concrete, Factual Milestones matching the script narrative
  const milestones: MilestoneStage[] = [
    {
      year: "2020",
      tag: "PROPRIETARY LOCK-IN",
      tagColor: "#EF4444",
      title: "The Cloud Toll Era",
      description:
        "Creative tools required mandatory Adobe subscriptions ($600+/yr). No production-ready free tools existed for mainstream video or design work.",
      stat1Label: "Annual Software Toll",
      stat1Val: "$600+ / yr",
      stat1Color: "#EF4444",
      stat2Label: "Compute Autonomy",
      stat2Val: "0% Local SaaS",
      stat2Color: "#EF4444",
      startFrame: 0,
      endFrame: 42,
    },
    {
      year: "2022",
      tag: "OPEN SUITES EMERGE",
      tagColor: "#F59E0B",
      title: "Early Open Disruption",
      description:
        "Blender 3.0 and DaVinci Resolve prove free tools handle Hollywood work. Stable Diffusion and Whisper prove local GPUs can run deep learning.",
      stat1Label: "Production FOSS",
      stat1Val: "Blender • DaVinci",
      stat1Color: "#F59E0B",
      stat2Label: "First Open Weights",
      stat2Val: "SD 1.5 • Whisper",
      stat2Color: "#F59E0B",
      startFrame: 40,
      endFrame: 102,
    },
    {
      year: "2024",
      tag: "AI-ASSISTED CODING",
      tagColor: "#1677FF",
      title: "The AI Acceleration",
      description:
        "Coding agents and open-weight models enable solo developers to build software at corporate scale without multi-million dollar engineering budgets.",
      stat1Label: "Developer Velocity",
      stat1Val: "10x Solo Build",
      stat1Color: "#1677FF",
      stat2Label: "Model Weights",
      stat2Val: "Llama 3 • Mistral",
      stat2Color: "#1677FF",
      startFrame: 100,
      endFrame: 160,
    },
    {
      year: "2026",
      tag: "ZERO-SUBSCRIPTION SHIFT",
      tagColor: "#10B981",
      title: "2026: Complete Open Stack",
      description:
        "ArtCraft, DaVinci, Kokoro TTS, and on-device models replace monthly software rent with 100% private, free execution on consumer hardware.",
      stat1Label: "Software Subscription",
      stat1Val: "$0 / month",
      stat1Color: "#10B981",
      stat2Label: "Execution Privacy",
      stat2Val: "100% On-Device",
      stat2Color: "#10B981",
      startFrame: 160,
      endFrame: 225,
    },
  ];

  const currentAccent = milestones[activeYearIndex].tagColor;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          opacity: containerOpacity,
          transform: `translateY(${containerY + subtleFloat}px)`,
          width: "1140px",
          height: "600px",
          borderRadius: "44px",
          background: "linear-gradient(145deg, rgba(35, 31, 32, 0.96) 0%, rgba(18, 16, 17, 0.98) 100%)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(250, 244, 217, 0.12)",
          boxShadow: "0 35px 80px rgba(0, 0, 0, 0.65)",
          display: "flex",
          alignItems: "center",
          padding: "52px 64px",
          gap: "54px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dynamic Volumetric Radial Ambient Glow on the Right */}
        <div
          style={{
            position: "absolute",
            right: "-40px",
            top: "20px",
            width: "560px",
            height: "560px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${currentAccent}${Math.round(
              ambientGlowPulse * 100
            )} 0%, rgba(22, 119, 255, 0.08) 45%, transparent 70%)`,
            pointerEvents: "none",
            filter: "blur(40px)",
            transition: "all 0.3s ease-out",
          }}
        />

        {/* Left Side: Vertical Ruler & Milestones */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            width: "230px",
            height: "440px",
          }}
        >
          {/* Year Labels Column - Font Size 28px (Active 36px) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "360px",
              paddingRight: "26px",
              textAlign: "right",
              fontSize: "28px",
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {["2020", "2022", "2024", "2026"].map((yr, idx) => {
              const isActive = activeYearIndex === idx;
              return (
                <span
                  key={yr}
                  style={{
                    color: isActive ? "#FAF4D9" : "rgba(250, 244, 217, 0.35)",
                    fontSize: isActive ? "36px" : "28px",
                    fontWeight: isActive ? 900 : 700,
                    textShadow: isActive ? `0 0 15px ${milestones[idx].tagColor}90` : "none",
                    transform: isActive ? "scale(1.15)" : "scale(1)",
                    transition: "all 0.2s ease-out",
                  }}
                >
                  {yr}
                </span>
              );
            })}
          </div>

          {/* Vertical Ruler SVG with Progressive Ticks and Dynamic Spine */}
          <div style={{ position: "relative", width: "90px", height: "400px" }}>
            <svg width="90" height="400" viewBox="0 0 90 400" fill="none">
              {/* Minor Tick Marks */}
              {[40, 65, 90, 115, 160, 185, 210, 265, 290, 315].map((y, idx) => {
                const isPassed = nodeY >= y;
                return (
                  <line
                    key={idx}
                    x1="18"
                    y1={y}
                    x2="26"
                    y2={y}
                    stroke={isPassed ? currentAccent : "rgba(250, 244, 217, 0.15)"}
                    strokeWidth="1.5"
                    style={{
                      filter: isPassed ? `drop-shadow(0 0 4px ${currentAccent})` : "none",
                    }}
                  />
                );
              })}

              {/* Major Tick Marks */}
              {[30, 135, 240, 345].map((y, idx) => {
                const isPassed = nodeY >= y;
                return (
                  <line
                    key={idx}
                    x1="12"
                    y1={y}
                    x2="30"
                    y2={y}
                    stroke={isPassed ? currentAccent : "rgba(250, 244, 217, 0.35)"}
                    strokeWidth="2.5"
                  />
                );
              })}

              {/* Dynamic Ruler Spine that bulges out when node arrives at 2026 */}
              <path
                d={
                  bumpExpansion > 0.05
                    ? `M 24 15 L 24 300 C 24 320, ${bumpX} 328, ${bumpX} 345 C ${bumpX} 362, 24 370, 24 390`
                    : "M 24 15 L 24 390"
                }
                stroke={currentAccent}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                style={{
                  filter: `drop-shadow(0 0 8px ${currentAccent}80)`,
                }}
              />
            </svg>

            {/* Traveling Circular Milestone Dial Node */}
            <div
              style={{
                position: "absolute",
                left: `${nodeX - 22}px`,
                top: `${nodeY - 22}px`,
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(35, 31, 32, 0.98) 0%, rgba(15, 14, 15, 1) 100%)",
                border: `2px solid ${currentAccent}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 ${15 + arrivalPulse * 20}px ${currentAccent}, inset 0 0 10px ${currentAccent}50`,
                transform: `scale(${1 + arrivalPulse * 0.15})`,
                transition: "left 0.1s ease-out, top 0.05s ease-out, border-color 0.2s ease-out",
                zIndex: 10,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={currentAccent} strokeWidth="3">
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side: Milestone Narrative & Telemetry (Dynamic for Each Year) */}
        <div style={{ flex: 1, position: "relative", height: "460px" }}>
          {milestones.map((m, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === milestones.length - 1;

            let stageOpacity = 0;
            let stageX = 0;

            const trans = 8;
            if (isFirst) {
              stageOpacity = interpolate(frame, [0, m.endFrame - trans, m.endFrame], [1, 1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              stageX = interpolate(frame, [m.endFrame - trans, m.endFrame], [0, -18], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
            } else if (isLast) {
              stageOpacity = interpolate(frame, [m.startFrame, m.startFrame + trans], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              stageX = interpolate(frame, [m.startFrame, m.startFrame + trans], [18, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
            } else {
              stageOpacity = interpolate(
                frame,
                [m.startFrame, m.startFrame + trans, m.endFrame - trans, m.endFrame],
                [0, 1, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              stageX = interpolate(
                frame,
                [m.startFrame, m.startFrame + trans, m.endFrame - trans, m.endFrame],
                [18, 0, 0, -18],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
            }

            if (stageOpacity <= 0.01) return null;

            return (
              <div
                key={m.year}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "22px",
                  opacity: stageOpacity,
                  transform: `translateX(${stageX}px)`,
                  pointerEvents: stageOpacity > 0.5 ? "auto" : "none",
                }}
              >
                {/* Year Pill Tag - Font Size 26px */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 22px",
                    borderRadius: "999px",
                    background: `${m.tagColor}20`,
                    border: `1px solid ${m.tagColor}50`,
                    color: m.tagColor,
                    fontSize: "26px",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    width: "fit-content",
                  }}
                >
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: m.tagColor }} />
                  {m.tag} • {m.year}
                </div>

                {/* Heading - Font Size 44px */}
                <div
                  style={{
                    fontSize: "44px",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    color: "#FAF4D9",
                    lineHeight: 1.15,
                  }}
                >
                  {m.title}
                </div>

                {/* Concrete Factual Script Description - Font Size 26px */}
                <div
                  style={{
                    fontSize: "26px",
                    color: "rgba(250, 244, 217, 0.75)",
                    lineHeight: 1.45,
                    maxWidth: "680px",
                  }}
                >
                  {m.description}
                </div>

                {/* Telemetry Metric Badges - Font Size 26px and 34px */}
                <div style={{ display: "flex", gap: "20px", marginTop: "6px" }}>
                  <div
                    style={{
                      padding: "16px 26px",
                      borderRadius: "20px",
                      background: "rgba(250, 244, 217, 0.06)",
                      border: "1px solid rgba(250, 244, 217, 0.12)",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                      minWidth: "200px",
                    }}
                  >
                    <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.6)", marginBottom: "4px" }}>
                      {m.stat1Label}
                    </div>
                    <div style={{ fontSize: "34px", fontWeight: 900, color: m.stat1Color }}>
                      {m.stat1Val}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "16px 26px",
                      borderRadius: "20px",
                      background: "rgba(250, 244, 217, 0.06)",
                      border: "1px solid rgba(250, 244, 217, 0.12)",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                      minWidth: "200px",
                    }}
                  >
                    <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.6)", marginBottom: "4px" }}>
                      {m.stat2Label}
                    </div>
                    <div style={{ fontSize: "34px", fontWeight: 900, color: m.stat2Color }}>
                      {m.stat2Val}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
