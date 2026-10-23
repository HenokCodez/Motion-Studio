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
import { TOKENS } from "../../../design-system/tokens";
import {
  KineticTextReveal,
  EvidenceFrame,
  TechnicalDiagram,
} from "../../../components/vantabrief/primitives";

// ════════════════════════════════════════════════════════════════════
// SHARED: Matte charcoal background with subtle ambient radial depth
// ════════════════════════════════════════════════════════════════════
const MatteBase: React.FC<{ accentGlow?: string }> = ({ accentGlow }) => (
  <>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: TOKENS.colors.charcoal,
      }}
    />
    {accentGlow && (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 900px 600px at 50% 50%, ${accentGlow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
    )}
    {/* Faint grid texture */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
        pointerEvents: "none",
      }}
    />
  </>
);

// ════════════════════════════════════════════════════════════════════
// Scene 01 — Style 3: Editorial Collage opening
// "In 2026, you can run a complete creative and technical stack
//  without paying for a single subscription."
// ════════════════════════════════════════════════════════════════════
export const Scene001_DesktopWorkflow: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Three stacked editorial receipts sliding in
  const card1 = spring({ frame: frame - 0, fps, config: TOKENS.motion.springs.hook });
  const card2 = spring({ frame: frame - 12, fps, config: TOKENS.motion.springs.hook });
  const card3 = spring({ frame: frame - 24, fps, config: TOKENS.motion.springs.hook });
  const stamp = spring({ frame: frame - 60, fps, config: TOKENS.motion.springs.punchy });

  const tools = [
    { name: "DaVinci Resolve", label: "Video Editing", cost: "$0", color: TOKENS.colors.accentGreen, spr: card1, rot: -2.5 },
    { name: "Blender 4.x", label: "3D / VFX", cost: "$0", color: TOKENS.colors.accentBlue, spr: card2, rot: 1.0 },
    { name: "Kokoro-82M", label: "Local AI TTS", cost: "$0", color: TOKENS.colors.accentYellow, spr: card3, rot: -1.2 },
  ];

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(16, 185, 129, 0.06)" />

      {/* Top eyebrow label */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: TOKENS.colors.accentBlue,
          letterSpacing: 3,
          textTransform: "uppercase",
          fontWeight: 700,
          opacity: interpolate(card1, [0, 1], [0, 1]),
        }}
      >
        THE 2026 SHIFT
      </div>

      {/* Stacked editorial receipt cards */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 80,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {tools.map((tool, i) => (
          <div
            key={tool.name}
            style={{
              transform: `translateX(${interpolate(tool.spr, [0, 1], [-60, 0])}px) rotate(${tool.rot}deg)`,
              opacity: interpolate(tool.spr, [0, 1], [0, 1]),
              background: TOKENS.colors.surfaceElevated,
              border: `1.5px solid ${tool.color}`,
              borderRadius: 12,
              padding: "18px 32px",
              display: "flex",
              alignItems: "center",
              gap: 28,
              boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 0 20px ${tool.color}22`,
              width: 620,
            }}
          >
            {/* Washi tape */}
            <div
              style={{
                position: "absolute",
                top: -10,
                left: 24,
                width: 70,
                height: 20,
                background: "rgba(250,244,217,0.18)",
                border: "1px dashed rgba(250,244,217,0.3)",
                borderRadius: 3,
                transform: "rotate(-4deg)",
              }}
            />
            <div
              style={{
                fontFamily: TOKENS.typography.displayHeadline,
                fontSize: 36,
                fontWeight: 900,
                color: TOKENS.colors.creamLight,
                letterSpacing: -0.5,
              }}
            >
              {tool.name}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: TOKENS.colors.mutedGray, fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
                {tool.label}
              </div>
            </div>
            <div
              style={{
                fontFamily: TOKENS.typography.displayHeadline,
                fontSize: 40,
                fontWeight: 900,
                color: tool.color,
                letterSpacing: 1,
              }}
            >
              {tool.cost}
            </div>
          </div>
        ))}
      </div>

      {/* Right side: Big kinetic statement */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 680,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 80px 80px 40px",
        }}
      >
        <KineticTextReveal
          phrase="ZERO SUBSCRIPTION STACK"
          accentIndices={[1]}
          accentColor={TOKENS.colors.accentGreen}
          fontSize={68}
          align="right"
        />
        <div
          style={{
            marginTop: 24,
            textAlign: "right",
            color: TOKENS.colors.mutedGray,
            fontSize: 22,
            fontWeight: 600,
            opacity: interpolate(stamp, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(stamp, [0, 1], [20, 0])}px)`,
          }}
        >
          Complete creative pipeline.
          <br />
          Local. Private. Perpetual.
        </div>
      </div>

      {/* Bottom horizontal rule */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 80,
          right: 80,
          height: 1,
          background: `linear-gradient(to right, ${TOKENS.colors.accentGreen}, transparent)`,
          opacity: interpolate(stamp, [0, 1], [0, 0.6]),
        }}
      />
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 02 — Style 2: Evidence / Screen-Led
// "DaVinci Resolve was used on actual Hollywood productions."
// ════════════════════════════════════════════════════════════════════
export const Scene002_QualityMacro: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelSpr = spring({ frame: frame - 20, fps, config: TOKENS.motion.springs.card });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(22, 119, 255, 0.05)" />

      {/* Full-canvas evidence frame */}
      <div
        style={{
          position: "absolute",
          inset: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <EvidenceFrame
          mediaSrc="assets/screenshots/davinci_resolve.png"
          sourceLabel="DAVINCI RESOLVE — OFFICIAL WEBSITE"
          urlPill="blackmagicdesign.com/products/davinci-resolve"
          caption="Used on major Hollywood feature films. Zero license cost."
          width={1600}
          height={820}
          focusPoint={{ x: 50, y: 60, zoom: 1.04 }}
        />
      </div>

      {/* Floating accent pill */}
      <div
        style={{
          position: "absolute",
          top: 80,
          right: 100,
          background: "rgba(16, 185, 129, 0.15)",
          border: `1.5px solid ${TOKENS.colors.accentGreen}`,
          borderRadius: 24,
          padding: "8px 24px",
          fontFamily: TOKENS.typography.code,
          fontSize: 16,
          fontWeight: 800,
          color: TOKENS.colors.accentGreen,
          letterSpacing: 2,
          transform: `translateY(${interpolate(labelSpr, [0, 1], [-16, 0])}px)`,
          opacity: interpolate(labelSpr, [0, 1], [0, 1]),
        }}
      >
        STUDIO PRODUCTION GRADE · $0 LICENSE
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 03 — Style 2: Evidence (ArtCraft vs Adobe)
// "ArtCraft is challenging Photoshop, Premiere, and After Effects."
// ════════════════════════════════════════════════════════════════════
export const Scene003_ArtCraftAdobe: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const psEntry = spring({ frame: frame - 10, fps, config: TOKENS.motion.springs.card });
  const prEntry = spring({ frame: frame - 24, fps, config: TOKENS.motion.springs.card });
  const aeEntry = spring({ frame: frame - 38, fps, config: TOKENS.motion.springs.card });

  const targets = [
    { name: "Photoshop", logo: "assets/logos/photoshop.svg", color: TOKENS.colors.accentBlue, spr: psEntry },
    { name: "Premiere Pro", logo: "assets/logos/premiere.svg", color: TOKENS.colors.accentYellow, spr: prEntry },
    { name: "After Effects", logo: "assets/logos/aftereffects.svg", color: TOKENS.colors.accentRed, spr: aeEntry },
  ];

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(22, 119, 255, 0.07)" />

      {/* Left: ArtCraft evidence frame */}
      <div
        style={{
          position: "absolute",
          top: 60,
          bottom: 60,
          left: 60,
          right: 540,
        }}
      >
        <EvidenceFrame
          mediaSrc="assets/screenshots/artcraft_editor.png"
          sourceLabel="ARTCRAFT — OPEN-SOURCE SUITE"
          urlPill="artcraft.org"
          width="100%"
          height="100%"
          style={{ height: "100%" }}
        />
      </div>

      {/* Right: displacement targets */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 500,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px 60px",
          gap: 24,
        }}
      >
        <div
          style={{
            fontFamily: TOKENS.typography.code,
            fontSize: 14,
            color: TOKENS.colors.accentBlue,
            letterSpacing: 3,
            marginBottom: 8,
          }}
        >
          OPEN SOURCE VS ADOBE
        </div>

        {targets.map((t) => (
          <div
            key={t.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              background: TOKENS.colors.surfaceElevated,
              borderRadius: 12,
              border: `1.5px solid ${t.color}44`,
              padding: "16px 24px",
              width: "100%",
              transform: `translateX(${interpolate(t.spr, [0, 1], [40, 0])}px)`,
              opacity: interpolate(t.spr, [0, 1], [0, 1]),
            }}
          >
            <Img src={staticFile(t.logo)} style={{ width: 36, height: 36 }} />
            <div style={{ flex: 1 }}>
              <div style={{ color: TOKENS.colors.creamLight, fontSize: 22, fontWeight: 800 }}>
                {t.name}
              </div>
              <div style={{ color: t.color, fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>
                TARGETED BY ARTCRAFT
              </div>
            </div>
            {/* Strikethrough: paid → free */}
            <div style={{ textAlign: "right" }}>
              <div style={{ color: TOKENS.colors.accentRed, fontSize: 14, textDecoration: "line-through", opacity: 0.7 }}>
                Subscription
              </div>
              <div style={{ color: TOKENS.colors.accentGreen, fontSize: 18, fontWeight: 900 }}>
                Open Source
              </div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 04 — Style 5: Technical Diagram
// "One developer with AI assistance can now build what used to take
//  entire engineering departments."
// ════════════════════════════════════════════════════════════════════
export const Scene004_DevLeverage: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(22, 119, 255, 0.08)" />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          gap: 48,
        }}
      >
        <TechnicalDiagram
          title="AI-ACCELERATED DEVELOPMENT LEVERAGE"
          mode="comparison"
          staggerFrames={10}
          width={1500}
          nodes={[
            {
              id: "solo-dev",
              label: "1 Developer + AI",
              sublabel: "High-velocity autonomous coding",
              status: "active",
              accentColor: TOKENS.colors.accentBlue,
            },
            {
              id: "vs",
              label: "→",
              sublabel: "replaces",
              status: "highlight",
              accentColor: TOKENS.colors.accentYellow,
            },
            {
              id: "legacy-team",
              label: "50+ Engineering Teams",
              sublabel: "Multi-year roadmaps · Massive budgets",
              status: "pending",
              accentColor: TOKENS.colors.mutedGray,
            },
          ]}
        />

        {/* Code snippet panel — bottom */}
        <CodeStreamPanel />
      </div>
    </AbsoluteFill>
  );
};

const CodeStreamPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spr = spring({ frame: frame - 40, fps, config: TOKENS.motion.springs.card });

  const lines = [
    { text: "import { VideoEngine } from '@artcraft/core';", color: TOKENS.colors.creamLight, delay: 0 },
    { text: "const timeline = new VideoEngine.Timeline({ fps: 30, resolution: '4K' });", color: TOKENS.colors.creamLight, delay: 0.25 },
    { text: "await timeline.compileGPUAcceleratedFilters();", color: TOKENS.colors.accentBlue, delay: 0.55 },
    { text: "✓ Full suite pipeline. Single developer sprint.", color: TOKENS.colors.accentGreen, delay: 0.85 },
  ];

  const progress = interpolate(frame, [50, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        background: "#0c0a0b",
        borderRadius: 12,
        border: `1px solid ${TOKENS.colors.accentBlue}33`,
        padding: "24px 36px",
        fontFamily: TOKENS.typography.code,
        fontSize: 17,
        lineHeight: 1.8,
        width: 1000,
        transform: `translateY(${interpolate(spr, [0, 1], [30, 0])}px)`,
        opacity: interpolate(spr, [0, 1], [0, 1]),
        boxShadow: "0 16px 40px rgba(0,0,0,0.7)",
      }}
    >
      <div style={{ color: TOKENS.colors.accentYellow, fontSize: 13, marginBottom: 10, letterSpacing: 2 }}>
        // AI CODE GENERATION IN PROGRESS...
      </div>
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            color: line.color,
            opacity: progress >= line.delay ? 1 : 0.08,
            transition: "opacity 0.2s",
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
};
