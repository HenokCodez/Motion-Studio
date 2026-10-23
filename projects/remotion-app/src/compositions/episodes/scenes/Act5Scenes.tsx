import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TOKENS } from "../../../design-system/tokens";
import {
  KineticTextReveal,
  EditorialMetaphor,
  TechnicalDiagram,
} from "../../../components/vantabrief/primitives";

// ════════════════════════════════════════════════════════════════════
// SHARED: Matte base
// ════════════════════════════════════════════════════════════════════
const MatteBase: React.FC<{ accentGlow?: string }> = ({ accentGlow }) => (
  <>
    <div style={{ position: "absolute", inset: 0, background: TOKENS.colors.charcoal }} />
    {accentGlow && (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 800px 500px at 50% 50%, ${accentGlow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
    )}
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
// Scene 16 — Style 1: Kinetic Typography
// "Individual micro-tools built by solo developers."
// ════════════════════════════════════════════════════════════════════
export const Scene016_MicroTools: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const subSpr = spring({ frame: frame - 35, fps, config: TOKENS.motion.springs.card });

  const microTools = [
    { name: "yt-dlp", desc: "YouTube downloader — Solo dev" },
    { name: "FFmpeg", desc: "Universal media codec · BSD" },
    { name: "Whisper.cpp", desc: "OpenAI Whisper — community port" },
    { name: "HTMX", desc: "Hypertext as engine of app state" },
    { name: "Bun", desc: "All-in-one JS runtime · Zig" },
  ];

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(22, 119, 255, 0.06)" />

      {/* Heading */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <KineticTextReveal
          phrase="THE MICRO-TOOL ECONOMY"
          accentIndices={[1]}
          accentColor={TOKENS.colors.accentBlue}
          fontSize={88}
          align="center"
        />
        <div
          style={{
            color: TOKENS.colors.mutedGray,
            fontSize: 22,
            fontWeight: 600,
            transform: `translateY(${interpolate(subSpr, [0, 1], [16, 0])}px)`,
            opacity: interpolate(subSpr, [0, 1], [0, 1]),
          }}
        >
          Solo developers building tools that power the entire industry
        </div>
      </div>

      {/* Scrolling micro-tools list */}
      <div
        style={{
          position: "absolute",
          top: 260,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {microTools.map((tool, i) => {
          const spr = spring({ frame: frame - 40 - i * 10, fps, config: TOKENS.motion.springs.card });
          return (
            <div
              key={tool.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                background: TOKENS.colors.surfaceElevated,
                borderRadius: 10,
                border: `1px solid ${TOKENS.colors.borderSubtle}`,
                padding: "16px 28px",
                transform: `translateX(${interpolate(spr, [0, 1], [-40, 0])}px)`,
                opacity: interpolate(spr, [0, 1], [0, 1]),
              }}
            >
              <div
                style={{
                  fontFamily: TOKENS.typography.code,
                  fontSize: 22,
                  fontWeight: 900,
                  color: TOKENS.colors.accentBlue,
                  minWidth: 160,
                }}
              >
                {tool.name}
              </div>
              <div
                style={{
                  width: 1,
                  height: 28,
                  background: TOKENS.colors.borderSubtle,
                }}
              />
              <div style={{ color: TOKENS.colors.mutedGray, fontSize: 18, flex: 1 }}>
                {tool.desc}
              </div>
              <div
                style={{
                  fontFamily: TOKENS.typography.code,
                  fontSize: 14,
                  color: TOKENS.colors.accentGreen,
                  fontWeight: 700,
                  letterSpacing: 1,
                  padding: "4px 12px",
                  background: "rgba(16, 185, 129, 0.1)",
                  borderRadius: 6,
                }}
              >
                FREE
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 17 — Style 5: Technical Diagram
// "Licensing nuance — MIT, GPL, BSL, AGPL are different contracts."
// ════════════════════════════════════════════════════════════════════
export const Scene017_NuanceLicensing: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(239, 68, 68, 0.05)" />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          gap: 40,
        }}
      >
        <div style={{ fontFamily: TOKENS.typography.code, fontSize: 16, color: TOKENS.colors.accentYellow, letterSpacing: 3, textAlign: "center" }}>
          LICENSING IS NOT A BINARY — IT'S A SPECTRUM
        </div>

        <TechnicalDiagram
          title="OPEN SOURCE LICENSE SPECTRUM"
          mode="pipeline"
          staggerFrames={12}
          width={1600}
          nodes={[
            { id: "mit", label: "MIT / Apache", sublabel: "Use commercially · No restrictions", status: "complete", accentColor: TOKENS.colors.accentGreen },
            { id: "lgpl", label: "LGPL", sublabel: "Link freely · Share changes", status: "active", accentColor: TOKENS.colors.accentBlue },
            { id: "gpl", label: "GPL v3", sublabel: "Copyleft · Derivatives must be OSS", status: "active", accentColor: TOKENS.colors.accentYellow },
            { id: "agpl", label: "AGPL", sublabel: "Network use = distribution", status: "highlight", accentColor: TOKENS.colors.accentRed },
            { id: "bsl", label: "BSL / SSPL", sublabel: "Source available · Not truly open", status: "pending", accentColor: TOKENS.colors.accentRed },
          ]}
        />

        <div
          style={{
            fontFamily: TOKENS.typography.code,
            fontSize: 16,
            color: TOKENS.colors.mutedGray,
            letterSpacing: 1,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Always verify the license before integrating into commercial products.
          <br />
          <span style={{ color: TOKENS.colors.accentYellow }}>
            HashiCorp (Terraform), Redis, and Elasticsearch all changed licenses in 2023–24.
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 18A — Style 3: Editorial Collage
// "The value stack — community, not just the code."
// ════════════════════════════════════════════════════════════════════
export const Scene018A_ValueStack: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(22, 119, 255, 0.06)" />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <EditorialMetaphor
          headline="THE VALUE IS THE COMMUNITY"
          subtext="Plugins · Forums · Extensions · Tutorials · Forks · Bug reports"
          stampText="THE REAL MOAT"
          rotation={-0.8}
          tapePosition="top-left"
          highlightColor={TOKENS.colors.accentBlue}
        >
          <StackedLayers />
        </EditorialMetaphor>
      </div>
    </AbsoluteFill>
  );
};

const StackedLayers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const layers = [
    { label: "Raw Code (Free)", color: TOKENS.colors.accentBlue },
    { label: "+ Documentation (Free)", color: TOKENS.colors.accentGreen },
    { label: "+ Community Support (Free)", color: TOKENS.colors.accentYellow },
    { label: "+ Plugin Ecosystem (Free)", color: TOKENS.colors.accentGreen },
    { label: "= Immense Combined Value", color: TOKENS.colors.creamLight },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 640 }}>
      {layers.map((layer, i) => {
        const spr = spring({ frame: frame - 20 - i * 8, fps, config: TOKENS.motion.springs.card });
        return (
          <div
            key={layer.label}
            style={{
              background: TOKENS.colors.surface,
              border: `1px solid ${layer.color}44`,
              borderRadius: 7,
              padding: "10px 20px",
              fontFamily: TOKENS.typography.code,
              fontSize: 16,
              color: layer.color,
              fontWeight: layer.label.startsWith("=") ? 900 : 600,
              opacity: interpolate(spr, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(spr, [0, 1], [-30, 0])}px)`,
              borderLeft: `3px solid ${layer.color}`,
            }}
          >
            {layer.label}
          </div>
        );
      })}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 18B — Style 2: Evidence (Moat Erosion)
// "The economic moat of proprietary software is eroding."
// ════════════════════════════════════════════════════════════════════
export const Scene018B_MoatErosion: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accentSpr = spring({ frame: frame - 20, fps, config: TOKENS.motion.springs.card });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(239, 68, 68, 0.06)" />

      {/* Central kinetic statement */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          gap: 32,
        }}
      >
        <KineticTextReveal
          phrase="THE MOAT IS ERODING"
          accentIndices={[2, 3]}
          accentColor={TOKENS.colors.accentRed}
          fontSize={112}
          align="center"
        />

        <div
          style={{
            display: "flex",
            gap: 40,
            marginTop: 16,
            transform: `translateY(${interpolate(accentSpr, [0, 1], [24, 0])}px)`,
            opacity: interpolate(accentSpr, [0, 1], [0, 1]),
          }}
        >
          {[
            { label: "AI reduces development barrier", color: TOKENS.colors.accentBlue },
            { label: "OSS matches proprietary quality", color: TOKENS.colors.accentGreen },
            { label: "License changes spark forks", color: TOKENS.colors.accentYellow },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: TOKENS.colors.surfaceElevated,
                borderRadius: 10,
                border: `1px solid ${item.color}44`,
                padding: "16px 24px",
                textAlign: "center",
                maxWidth: 320,
              }}
            >
              <div style={{ color: item.color, fontSize: 14, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>→</div>
              <div style={{ color: TOKENS.colors.creamLight, fontSize: 18, fontWeight: 700, lineHeight: 1.4 }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 19 — Style 1: Kinetic Typography (Verdict Outro)
// Final verdict — open source isn't just a trend, it's the infrastructure
// ════════════════════════════════════════════════════════════════════
export const Scene019_VerdictOutro: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line2Spr = spring({ frame: frame - 30, fps, config: TOKENS.motion.springs.card });
  const endSpr = spring({ frame: frame - 90, fps, config: TOKENS.motion.springs.gentle });

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
          padding: "80px 120px",
          gap: 36,
        }}
      >
        {/* Verdict stamp */}
        <div
          style={{
            fontFamily: TOKENS.typography.code,
            fontSize: 16,
            color: TOKENS.colors.accentBlue,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          VantaBrief Verdict
        </div>

        <KineticTextReveal
          phrase="OPEN SOURCE IS THE INFRASTRUCTURE"
          accentIndices={[4, 5]}
          accentColor={TOKENS.colors.accentBlue}
          fontSize={84}
          align="center"
        />

        {/* Rule */}
        <div
          style={{
            width: 600,
            height: 1,
            background: `linear-gradient(to right, transparent, ${TOKENS.colors.accentBlue}, transparent)`,
            opacity: interpolate(line2Spr, [0, 1], [0, 0.6]),
          }}
        />

        <div
          style={{
            color: TOKENS.colors.mutedGray,
            fontSize: 26,
            fontWeight: 600,
            textAlign: "center",
            maxWidth: 980,
            lineHeight: 1.6,
            transform: `translateY(${interpolate(line2Spr, [0, 1], [20, 0])}px)`,
            opacity: interpolate(line2Spr, [0, 1], [0, 1]),
          }}
        >
          The question isn't whether open source will dominate.
          <br />
          It's which business models survive on top of it.
        </div>

        {/* Final VANTABRIEF wordmark line */}
        <div
          style={{
            fontFamily: TOKENS.typography.code,
            fontSize: 18,
            color: TOKENS.colors.accentBlue,
            letterSpacing: 4,
            transform: `translateY(${interpolate(endSpr, [0, 1], [16, 0])}px)`,
            opacity: interpolate(endSpr, [0, 1], [0, 1]),
          }}
        >
          VANTABRIEF — Concise Intelligence & Software Engineering Breakdowns
        </div>
      </div>
    </AbsoluteFill>
  );
};
