import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BRAND = {
  bg: "#231F20",
  bgSubtle: "#2C2728",
  textPrimary: "#FAF4D9",
  textMuted: "rgba(250, 244, 217, 0.65)",
  accentBlue: "#1677FF",
  cardBg: "#1C191A",
  cardBorder: "rgba(250, 244, 217, 0.12)",
  fontHeadline: "'Panton Rust Black Base', sans-serif",
  fontSubtitle: "'Yolk Bold', sans-serif",
  fontPixel: "'VP Pixel', monospace",
  fontSystem: "system-ui, -apple-system, sans-serif",
};

const fontStyles = `
@font-face {
  font-family: 'Panton Rust Black Base';
  src: url('${staticFile("fonts/vantabrief/PantonRustBlack-Base.ttf")}') format('truetype');
  font-weight: 900;
  font-style: normal;
}
@font-face {
  font-family: 'Yolk Bold';
  src: url('${staticFile("fonts/vantabrief/Yolk-Bold.ttf")}') format('truetype');
  font-weight: bold;
  font-style: normal;
}
@font-face {
  font-family: 'VP Pixel';
  src: url('${staticFile("fonts/vantabrief/VPPixel-Simplified.otf")}') format('opentype');
  font-weight: normal;
  font-style: normal;
}
`;

// Dynamic Hybrid Background Component
const DynamicBackground: React.FC<{ showGrid?: boolean }> = ({ showGrid = false }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.bg,
        backgroundImage: `radial-gradient(circle at 50% 50%, ${BRAND.bgSubtle} 0%, ${BRAND.bg} 85%)`,
        overflow: "hidden",
      }}
    >
      {showGrid && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(to right, rgba(250, 244, 217, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(250, 244, 217, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// Scene 1: High-Impact Big Hook & Highlight Pill (Refs 2, 4, 9, 24)
const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Snappy spring entrance
  const popSpring = spring({ frame, fps, config: { damping: 14, stiffness: 200 } });
  const pillSpring = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 200 } });
  const subSpring = spring({ frame: frame - 12, fps, config: { damping: 16, stiffness: 180 } });

  const scale = interpolate(popSpring, [0, 1], [0.85, 1], { extrapolateRight: "clamp" });
  const opacity = interpolate(popSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const pillScale = interpolate(pillSpring, [0, 1], [0.7, 1], { extrapolateRight: "clamp" });
  const pillOpacity = interpolate(pillSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const subY = interpolate(subSpring, [0, 1], [30, 0], { extrapolateRight: "clamp" });
  const subOpacity = interpolate(subSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 100px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: BRAND.fontHeadline,
          fontSize: "88px",
          lineHeight: "1.05",
          color: BRAND.textPrimary,
          textTransform: "uppercase",
          letterSpacing: "2px",
          opacity,
          transform: `scale(${scale})`,
          textShadow: "0 12px 36px rgba(0, 0, 0, 0.6)",
        }}
      >
        THE OPEN-SOURCE
      </div>

      <div
        style={{
          marginTop: "16px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BRAND.accentBlue,
          padding: "10px 42px",
          borderRadius: "14px",
          transform: `scale(${pillScale})`,
          opacity: pillOpacity,
          boxShadow: `0 8px 32px ${BRAND.accentBlue}55`,
        }}
      >
        <span
          style={{
            fontFamily: BRAND.fontHeadline,
            fontSize: "76px",
            color: "#FFFFFF",
            letterSpacing: "3px",
            lineHeight: 1,
          }}
        >
          BREAKTHROUGH
        </span>
      </div>

      <div
        style={{
          marginTop: "36px",
          fontFamily: BRAND.fontSubtitle,
          fontSize: "30px",
          color: BRAND.textMuted,
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          maxWidth: "960px",
          letterSpacing: "0.5px",
        }}
      >
        Actionable tech intelligence without the noise
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Staggered Multi-Line Punchlines with Selective Emphasis (Refs 3, 11, 13)
const Scene2Punchlines: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = [
    { text: "RAPID EXECUTION", tag: "SPEED", isAccent: false },
    { text: "LOCAL AI RUNTIME", tag: "ZERO API", isAccent: false },
    { text: "100% PRIVATE DATA", tag: "SECURITY", isAccent: true },
  ];

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "0 160px",
      }}
    >
      <div
        style={{
          fontFamily: BRAND.fontSubtitle,
          fontSize: "24px",
          color: BRAND.accentBlue,
          letterSpacing: "3px",
          textTransform: "uppercase",
          marginBottom: "28px",
        }}
      >
        // ARCHITECTURE ADVANTAGES
      </div>

      {lines.map((item, idx) => {
        const itemSpring = spring({
          frame: frame - idx * 7,
          fps,
          config: { damping: 14, stiffness: 210 },
        });

        const x = interpolate(itemSpring, [0, 1], [-50, 0], { extrapolateRight: "clamp" });
        const op = interpolate(itemSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
        const sc = interpolate(itemSpring, [0, 1], [0.92, 1], { extrapolateRight: "clamp" });

        return (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginBottom: "24px",
              opacity: op,
              transform: `translateX(${x}px) scale(${sc})`,
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "4px",
                backgroundColor: item.isAccent ? BRAND.accentBlue : BRAND.textPrimary,
                boxShadow: item.isAccent ? `0 0 16px ${BRAND.accentBlue}` : "none",
              }}
            />
            <div
              style={{
                fontFamily: BRAND.fontHeadline,
                fontSize: "64px",
                lineHeight: 1,
                color: item.isAccent ? BRAND.accentBlue : BRAND.textPrimary,
                letterSpacing: "1.5px",
                textShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
              }}
            >
              {item.text}
            </div>
            <div
              style={{
                fontFamily: BRAND.fontPixel,
                fontSize: "18px",
                padding: "6px 14px",
                borderRadius: "6px",
                border: `1px solid ${BRAND.cardBorder}`,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                color: BRAND.textMuted,
                letterSpacing: "1px",
              }}
            >
              {item.tag}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Scene 3: Deep-Dive Tech Architecture & Benchmark Node (Refs 16, 18, 20, 23, 35)
const Scene3Benchmark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({ frame, fps, config: { damping: 15, stiffness: 190 } });
  const gaugeSpring = spring({ frame: frame - 8, fps, config: { damping: 14, stiffness: 160 } });

  const cardScale = interpolate(cardSpring, [0, 1], [0.94, 1], { extrapolateRight: "clamp" });
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const metricVal = interpolate(gaugeSpring, [0, 1], [0, 99.8], { extrapolateRight: "clamp" }).toFixed(1);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 120px",
      }}
    >
      <div
        style={{
          width: "1100px",
          backgroundColor: BRAND.cardBg,
          border: `1px solid ${BRAND.cardBorder}`,
          borderRadius: "24px",
          padding: "50px 70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.45)",
          transform: `scale(${cardScale})`,
          opacity: cardOpacity,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: BRAND.fontPixel,
              fontSize: "18px",
              color: BRAND.accentBlue,
              letterSpacing: "2px",
              marginBottom: "12px",
            }}
          >
            BENCHMARK EVALUATION // NCM-CORE
          </div>
          <div
            style={{
              fontFamily: BRAND.fontHeadline,
              fontSize: "52px",
              lineHeight: "1.15",
              color: BRAND.textPrimary,
              marginBottom: "16px",
            }}
          >
            PARALLEL INFERENCE SPEED
          </div>
          <div
            style={{
              fontFamily: BRAND.fontSubtitle,
              fontSize: "22px",
              color: BRAND.textMuted,
              lineHeight: "1.4",
              maxWidth: "540px",
            }}
          >
            Rebuilt from lower-level C++ tensors with direct CUDA kernel mapping and zero memory leaks.
          </div>
        </div>

        {/* Circular Gauge / Node */}
        <div
          style={{
            position: "relative",
            width: "260px",
            height: "260px",
            borderRadius: "50%",
            border: `4px solid ${BRAND.accentBlue}33`,
            borderTopColor: BRAND.accentBlue,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 32px ${BRAND.accentBlue}22`,
          }}
        >
          <div
            style={{
              fontFamily: BRAND.fontHeadline,
              fontSize: "76px",
              lineHeight: 1,
              color: BRAND.accentBlue,
              letterSpacing: "-1px",
              textShadow: `0 0 20px ${BRAND.accentBlue}66`,
            }}
          >
            {metricVal}%
          </div>
          <div
            style={{
              fontFamily: BRAND.fontPixel,
              fontSize: "15px",
              color: BRAND.textMuted,
              marginTop: "8px",
              letterSpacing: "1px",
            }}
          >
            ACCURACY
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Retro Terminal & Tag Callout with VP Pixel (Refs 25, 37, 43, 44)
const Scene4Terminal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const termSpring = spring({ frame, fps, config: { damping: 14, stiffness: 200 } });
  const termScale = interpolate(termSpring, [0, 1], [0.93, 1], { extrapolateRight: "clamp" });
  const termOpacity = interpolate(termSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "980px",
          backgroundColor: BRAND.cardBg,
          border: `1px solid ${BRAND.cardBorder}`,
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow: "0 28px 70px rgba(0, 0, 0, 0.5)",
          transform: `scale(${termScale})`,
          opacity: termOpacity,
        }}
      >
        {/* Terminal Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: `1px solid ${BRAND.cardBorder}`,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#FF5F56" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#FFBD2E" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#27C93F" }} />
          </div>
          <div
            style={{
              fontFamily: BRAND.fontPixel,
              fontSize: "14px",
              color: BRAND.textMuted,
              letterSpacing: "1px",
            }}
          >
            vanta-terminal // session_01
          </div>
          <div
            style={{
              fontFamily: BRAND.fontPixel,
              fontSize: "12px",
              color: BRAND.accentBlue,
            }}
          >
            ONLINE
          </div>
        </div>

        {/* Terminal Body */}
        <div style={{ padding: "40px" }}>
          <div
            style={{
              fontFamily: BRAND.fontPixel,
              fontSize: "20px",
              color: BRAND.accentBlue,
              marginBottom: "20px",
            }}
          >
            $ studio deploy --engine=local-fast
          </div>

          <div
            style={{
              fontFamily: BRAND.fontHeadline,
              fontSize: "48px",
              lineHeight: "1.2",
              color: BRAND.textPrimary,
              marginBottom: "16px",
            }}
          >
            AUTOMATED PIPELINE READY
          </div>

          <div
            style={{
              fontFamily: BRAND.fontSubtitle,
              fontSize: "22px",
              color: BRAND.textMuted,
              marginBottom: "28px",
            }}
          >
            Loaded local models, voice alignment cues, and deterministic visual tracks.
          </div>

          <div style={{ display: "flex", gap: "14px" }}>
            <div
              style={{
                fontFamily: BRAND.fontPixel,
                fontSize: "16px",
                padding: "8px 16px",
                borderRadius: "8px",
                backgroundColor: BRAND.accentBlue,
                color: "#FFFFFF",
              }}
            >
              MEM: 63/63 BYTES
            </div>
            <div
              style={{
                fontFamily: BRAND.fontPixel,
                fontSize: "16px",
                padding: "8px 16px",
                borderRadius: "8px",
                border: `1px solid ${BRAND.cardBorder}`,
                color: BRAND.textPrimary,
              }}
            >
              STATUS: ZERO_ERRORS
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Root Preview Composition Orchestrator
export const VantaBriefPreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg }}>
      <style>{fontStyles}</style>

      {/* Scene 1: Frames 0 - 75 (2.5s) */}
      <Sequence from={0} durationInFrames={75}>
        <DynamicBackground showGrid={false} />
        <Scene1Hook />
      </Sequence>

      {/* Scene 2: Frames 75 - 150 (2.5s) */}
      <Sequence from={75} durationInFrames={75}>
        <DynamicBackground showGrid={false} />
        <Scene2Punchlines />
      </Sequence>

      {/* Scene 3: Frames 150 - 225 (2.5s) */}
      <Sequence from={150} durationInFrames={75}>
        <DynamicBackground showGrid={true} />
        <Scene3Benchmark />
      </Sequence>

      {/* Scene 4: Frames 225 - 300 (2.5s) */}
      <Sequence from={225} durationInFrames={75}>
        <DynamicBackground showGrid={false} />
        <Scene4Terminal />
      </Sequence>
    </AbsoluteFill>
  );
};
