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
import { TOKENS } from "../../design-system/tokens";

export interface CoverFlowCard {
  tag: string;
  title: string;
  subtitle: string;
  badge: string;
  color: string;
  stat: string;
  statLabel: string;
}

const CARDS: CoverFlowCard[] = [
  {
    tag: "PRODUCTION MODEL",
    title: "DeepSeek V4.1 Flash",
    subtitle: "Frontier multimodal & agentic reasoning with 128K context",
    badge: "OPEN WEIGHTS",
    color: "#1677FF",
    stat: "155T",
    statLabel: "Tokens Processed / Day",
  },
  {
    tag: "INFERENCE ENGINE",
    title: "DeepEnphere Core",
    subtitle: "Causal encoder/decoder layer split cutting read compute by 50%",
    badge: "GITHUB RELEASE",
    color: "#10B981",
    stat: "800+",
    statLabel: "Peak Output Tokens/Sec",
  },
  {
    tag: "STORAGE INFRASTRUCTURE",
    title: "3FS Custom Cluster",
    subtitle: "Distributed NVMe SSD caching infrastructure reaching 96% cache hits",
    badge: "100 PETABYTES",
    color: "#F59E0B",
    stat: "96%",
    statLabel: "Context Cache Hit Rate",
  },
  {
    tag: "CLUSTER TOPOLOGY",
    title: "Wide Expert Parallelism",
    subtitle: "EP64 to EP128 cross-GPU MoE routing with 88% memory traffic reduction",
    badge: "64-128 GPUS",
    color: "#8B5CF6",
    stat: "-88%",
    statLabel: "Memory Traffic Drop",
  },
];

export const MG06CoverFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const translateY = interpolate(enterSpring, [0, 1], [40, 0]);

  // Carousel transition phase: Cycle through cards (frames 45 to 110)
  const carouselShift = interpolate(frame, [45, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Hero activation pulse (frame 95+)
  const heroPulse = spring({
    frame: Math.max(0, frame - 95),
    fps,
    config: { damping: 12, mass: 0.6 },
  });

  // Continuous subtle 3D floating & breathing
  const float = Math.sin(frame / 14) * 5;
  const tiltY = Math.sin(frame / 22) * 2;

  // Active index transitions from 0 to 1
  const activeIdx = carouselShift < 0.5 ? 0 : 1;
  const activeCard = CARDS[activeIdx];

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
          color: TOKENS.colors.accentBlue,
          letterSpacing: 2,
          fontWeight: 700,
        }}
      >
        [06/10 // DEEPSEEK ARCHITECTURE SUITE]
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
        PROD_CLUSTER // EP64
      </div>

      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "36px",
          perspective: "1200px",
          width: "100%",
          maxWidth: "1400px",
        }}
      >
        {/* Header Eyebrow & Title */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: TOKENS.typography.code,
              fontSize: "18px",
              color: activeCard.color,
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            {activeCard.tag}
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
            The Open Production Stack
          </div>
        </div>

        {/* 3D Cover-Flow Card Carousel */}
        <div
          style={{
            position: "relative",
            width: "1100px",
            height: "440px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transformStyle: "preserve-3d",
          }}
        >
          {CARDS.map((card, idx) => {
            // Distance from active center
            const offset = idx - (carouselShift * (CARDS.length - 1) * 0.4);
            const isCenter = Math.abs(offset) < 0.6;
            const cardX = offset * 320;
            const cardZ = isCenter ? 60 + heroPulse * 30 : -Math.abs(offset) * 160;
            const rotY = isCenter ? tiltY : offset > 0 ? -28 : 28;
            const cardScale = isCenter ? 1.05 + heroPulse * 0.04 : 0.85;
            const cardOpacity = Math.max(0.3, 1 - Math.abs(offset) * 0.45);

            return (
              <div
                key={card.title}
                style={{
                  position: "absolute",
                  width: "520px",
                  height: "380px",
                  background: isCenter ? "#1C191A" : "#181516",
                  border: isCenter
                    ? `2px solid ${card.color}`
                    : "1.5px solid rgba(250, 244, 217, 0.12)",
                  borderRadius: "20px",
                  padding: "36px 40px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: isCenter
                    ? `0 24px 60px rgba(0,0,0,0.8), 0 0 40px ${card.color}35`
                    : "0 16px 40px rgba(0,0,0,0.6)",
                  transform: `translateX(${cardX}px) translateZ(${cardZ}px) rotateY(${rotY}deg) translateY(${isCenter ? float : 0}px) scale(${cardScale})`,
                  transformStyle: "preserve-3d",
                  opacity: cardOpacity,
                  transition: "border 0.3s ease",
                  overflow: "hidden",
                }}
              >
                {/* Washi tape accent tag */}
                <div
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "32px",
                    padding: "4px 14px",
                    background: `${card.color}25`,
                    border: `1px solid ${card.color}80`,
                    borderRadius: "4px",
                    fontFamily: TOKENS.typography.code,
                    fontSize: "13px",
                    color: card.color,
                    letterSpacing: "1px",
                    fontWeight: 700,
                  }}
                >
                  {card.badge}
                </div>

                {/* Top Section */}
                <div>
                  <div
                    style={{
                      fontFamily: TOKENS.typography.displayHeadline,
                      fontSize: "38px",
                      fontWeight: 900,
                      color: TOKENS.colors.creamLight,
                      letterSpacing: "-0.5px",
                      marginBottom: "12px",
                      marginTop: "8px",
                    }}
                  >
                    {card.title}
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      color: TOKENS.colors.textMuted,
                      lineHeight: "1.4",
                    }}
                  >
                    {card.subtitle}
                  </div>
                </div>

                {/* Bottom Telemetry Metric */}
                <div
                  style={{
                    borderTop: "1px solid rgba(250, 244, 217, 0.1)",
                    paddingTop: "20px",
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: TOKENS.typography.code,
                        fontSize: "14px",
                        color: TOKENS.colors.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}
                    >
                      {card.statLabel}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: TOKENS.typography.displayHeadline,
                      fontSize: "44px",
                      fontWeight: 900,
                      color: card.color,
                    }}
                  >
                    {card.stat}
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

