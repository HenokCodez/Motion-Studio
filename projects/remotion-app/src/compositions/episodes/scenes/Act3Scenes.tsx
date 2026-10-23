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
  EvidenceFrame,
  GraphicSymbol,
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
// Scene 10 — Style 1: Kinetic Typography
// "The old AI oligopoly — proprietary cloud APIs — is cracking."
// ════════════════════════════════════════════════════════════════════
export const Scene010_OligopolyCracks: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const subSpr = spring({ frame: frame - 40, fps, config: TOKENS.motion.springs.card });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(239, 68, 68, 0.06)" />

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
          phrase="THE PAYWALL IS CRACKING"
          accentIndices={[3]}
          accentColor={TOKENS.colors.accentRed}
          fontSize={110}
          align="center"
        />

        {/* Two-column: old guard vs open weights */}
        <div
          style={{
            display: "flex",
            gap: 60,
            marginTop: 20,
            transform: `translateY(${interpolate(subSpr, [0, 1], [30, 0])}px)`,
            opacity: interpolate(subSpr, [0, 1], [0, 1]),
          }}
        >
          {[
            { label: "Proprietary Cloud APIs", detail: "Pay-per-token · Vendor lock-in", color: TOKENS.colors.accentRed, cross: true },
            { label: "Open Weights Models", detail: "Run locally · Zero metering", color: TOKENS.colors.accentGreen, cross: false },
          ].map((col) => (
            <div
              key={col.label}
              style={{
                background: TOKENS.colors.surfaceElevated,
                borderRadius: 14,
                border: `1.5px solid ${col.color}44`,
                padding: "24px 36px",
                textAlign: "center",
                minWidth: 340,
              }}
            >
              {col.cross && (
                <div style={{ color: TOKENS.colors.accentRed, fontSize: 28, fontWeight: 900, marginBottom: 8 }}>✕</div>
              )}
              {!col.cross && (
                <div style={{ color: TOKENS.colors.accentGreen, fontSize: 28, fontWeight: 900, marginBottom: 8 }}>✓</div>
              )}
              <div style={{ color: TOKENS.colors.creamLight, fontSize: 24, fontWeight: 800 }}>{col.label}</div>
              <div style={{ color: col.color, fontSize: 16, fontWeight: 600, marginTop: 6 }}>{col.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 11 — Style 2: Evidence / Screen-Led
// "Krea and Kokoro are examples of capable open or low-cost local AI."
// ════════════════════════════════════════════════════════════════════
export const Scene011_KreaKokoro: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rightSpr = spring({ frame: frame - 25, fps, config: TOKENS.motion.springs.card });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(22, 119, 255, 0.07)" />

      {/* Left: Kokoro evidence */}
      <div style={{ position: "absolute", top: 60, bottom: 60, left: 60, right: 600 }}>
        <EvidenceFrame
          mediaSrc="assets/screenshots/kokoro_github.png"
          sourceLabel="KOKORO-82M — HUGGING FACE / GITHUB"
          urlPill="huggingface.co/hexgrad/Kokoro-82M"
          caption="Open-weights TTS · <1GB VRAM · Local execution"
          width="100%"
          height="100%"
          style={{ height: "100%" }}
        />
      </div>

      {/* Right: Spec card */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 560,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 60px 80px 40px",
          gap: 20,
          transform: `translateX(${interpolate(rightSpr, [0, 1], [40, 0])}px)`,
          opacity: interpolate(rightSpr, [0, 1], [0, 1]),
        }}
      >
        <div style={{ fontFamily: TOKENS.typography.code, fontSize: 14, color: TOKENS.colors.accentBlue, letterSpacing: 3, marginBottom: 4 }}>
          LOCAL AI ALTERNATIVES
        </div>

        {[
          { name: "Kokoro-82M", tag: "Text-To-Speech", detail: "<1 GB VRAM · Open weights", color: TOKENS.colors.accentBlue },
          { name: "Ollama + Llama 3", tag: "Language Model", detail: "Fully offline · Zero cloud telemetry", color: TOKENS.colors.accentGreen },
        ].map((item) => (
          <div
            key={item.name}
            style={{
              background: TOKENS.colors.surfaceElevated,
              borderRadius: 14,
              border: `1.5px solid ${item.color}44`,
              padding: "20px 28px",
              boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ color: TOKENS.colors.creamLight, fontSize: 26, fontWeight: 900 }}>{item.name}</div>
            <div style={{ color: item.color, fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{item.tag}</div>
            <div style={{ color: TOKENS.colors.mutedGray, fontSize: 16, marginTop: 8 }}>{item.detail}</div>
          </div>
        ))}

        <div
          style={{
            marginTop: 8,
            padding: "14px 20px",
            background: "rgba(16, 185, 129, 0.1)",
            border: `1px solid ${TOKENS.colors.accentGreen}44`,
            borderRadius: 10,
            fontFamily: TOKENS.typography.code,
            fontSize: 14,
            color: TOKENS.colors.accentGreen,
            letterSpacing: 1,
          }}
        >
          ⚠ Note: Krea AI image generation runs via hosted service — not purely local.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 12 — Style 4: Graphic Symbol (Local Sovereignty)
// "You can download a model, run it on your local hardware, and own it."
// ════════════════════════════════════════════════════════════════════
export const Scene012_LocalSovereignty: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const terminalSpr = spring({ frame: frame - 40, fps, config: TOKENS.motion.springs.card });
  const sub1Spr = spring({ frame: frame - 55, fps, config: TOKENS.motion.springs.card });
  const sub2Spr = spring({ frame: frame - 70, fps, config: TOKENS.motion.springs.card });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(16, 185, 129, 0.08)" />

      {/* Left: big symbol */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 80,
          width: 480,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
        }}
      >
        <GraphicSymbol icon="lock" label="LOCAL SOVEREIGNTY" color={TOKENS.colors.accentGreen} size={220} />
      </div>

      {/* Right: terminal + labels */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 600,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 80px 80px 40px",
          gap: 24,
        }}
      >
        {/* Terminal */}
        <div
          style={{
            background: "#0c0a0b",
            borderRadius: 10,
            border: `1px solid ${TOKENS.colors.accentBlue}33`,
            padding: "20px 28px",
            fontFamily: TOKENS.typography.code,
            fontSize: 17,
            lineHeight: 1.8,
            transform: `translateX(${interpolate(terminalSpr, [0, 1], [40, 0])}px)`,
            opacity: interpolate(terminalSpr, [0, 1], [0, 1]),
          }}
        >
          <div style={{ color: TOKENS.colors.accentBlue }}>$ ollama pull llama3</div>
          <div style={{ color: TOKENS.colors.mutedGray }}>pulling manifest...</div>
          <div style={{ color: TOKENS.colors.accentBlue }}>$ ollama run llama3 --offline</div>
          <div style={{ color: TOKENS.colors.accentGreen }}>
            ✓ Loaded 8.0B parameters · Local · Zero telemetry
          </div>
        </div>

        {/* Status pills */}
        {[
          { text: "No cloud API calls", spr: sub1Spr, color: TOKENS.colors.accentGreen },
          { text: "No metering. No subscription.", spr: sub2Spr, color: TOKENS.colors.accentYellow },
        ].map((p) => (
          <div
            key={p.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              transform: `translateX(${interpolate(p.spr, [0, 1], [30, 0])}px)`,
              opacity: interpolate(p.spr, [0, 1], [0, 1]),
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
            <div style={{ color: p.color, fontFamily: TOKENS.typography.code, fontSize: 18, fontWeight: 700 }}>
              {p.text}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 13 — Style 1: Kinetic Typography (Brand beat)
// VantaBrief brand moment — channel name reveal
// ════════════════════════════════════════════════════════════════════
export const Scene013_VantaBriefBrand: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineSpr = spring({ frame: frame - 30, fps, config: TOKENS.motion.springs.card });

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
          gap: 24,
          padding: 80,
        }}
      >
        <KineticTextReveal
          phrase="VANTABRIEF INSIGHT"
          accentIndices={[0]}
          accentColor={TOKENS.colors.accentBlue}
          fontSize={108}
          align="center"
        />

        {/* Rule */}
        <div
          style={{
            width: 500,
            height: 2,
            background: `linear-gradient(to right, transparent, ${TOKENS.colors.accentBlue}, transparent)`,
            opacity: interpolate(lineSpr, [0, 1], [0, 1]),
          }}
        />

        <div
          style={{
            fontFamily: TOKENS.typography.code,
            fontSize: 22,
            color: TOKENS.colors.mutedGray,
            textAlign: "center",
            letterSpacing: 1,
            transform: `translateY(${interpolate(lineSpr, [0, 1], [16, 0])}px)`,
            opacity: interpolate(lineSpr, [0, 1], [0, 1]),
            maxWidth: 800,
          }}
        >
          The open-source movement isn't just about free software.
          <br />
          It's about who controls the tools of production.
        </div>
      </div>
    </AbsoluteFill>
  );
};
