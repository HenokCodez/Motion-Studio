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
  EditorialMetaphor,
  GraphicSymbol,
  TechnicalDiagram,
} from "../../../components/vantabrief/primitives";

// ════════════════════════════════════════════════════════════════════
// SHARED: Matte charcoal base
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
// Scene 05 — Style 1: Kinetic Typography
// "So do we eventually reach a point where everything is free?"
// ════════════════════════════════════════════════════════════════════
export const Scene005_CategoryParadox: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const questionSpr = spring({ frame: frame - 30, fps, config: TOKENS.motion.springs.punchy });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(245, 158, 11, 0.05)" />

      {/* Four category chips scroll in top left */}
      <CategoryScrollRow frame={frame} fps={fps} />

      {/* Central kinetic question */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 60,
        }}
      >
        <KineticTextReveal
          phrase="EVERYTHING COMMODITIZED"
          accentIndices={[1]}
          accentColor={TOKENS.colors.accentYellow}
          fontSize={100}
          align="center"
        />
        <div
          style={{
            marginTop: 40,
            color: TOKENS.colors.mutedGray,
            fontSize: 32,
            fontWeight: 600,
            textAlign: "center",
            transform: `translateY(${interpolate(questionSpr, [0, 1], [24, 0])}px)`,
            opacity: interpolate(questionSpr, [0, 1], [0, 1]),
            maxWidth: 900,
            lineHeight: 1.5,
          }}
        >
          OSes, databases, browsers, AI models, creative tools...
          <br />
          <span style={{ color: TOKENS.colors.accentYellow, fontWeight: 700 }}>
            Do we reach a point where everything is free?
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CategoryScrollRow: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const items = [
    { name: "Operating Systems", example: "Linux", color: TOKENS.colors.accentGreen },
    { name: "Databases", example: "PostgreSQL / Supabase", color: TOKENS.colors.accentBlue },
    { name: "Creative Suite", example: "Blender / DaVinci", color: TOKENS.colors.accentYellow },
    { name: "AI Models", example: "Llama / Mistral", color: TOKENS.colors.accentRed },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 80,
        right: 80,
        display: "flex",
        gap: 20,
        zIndex: 5,
      }}
    >
      {items.map((item, i) => {
        const spr = spring({ frame: frame - i * 10, fps, config: TOKENS.motion.springs.card });
        return (
          <div
            key={item.name}
            style={{
              flex: 1,
              background: TOKENS.colors.surfaceElevated,
              borderRadius: 10,
              border: `1px solid ${item.color}44`,
              padding: "12px 20px",
              opacity: interpolate(spr, [0, 1], [0, 0.8]),
              transform: `translateY(${interpolate(spr, [0, 1], [-16, 0])}px)`,
            }}
          >
            <div style={{ color: item.color, fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
              {item.example}
            </div>
            <div style={{ color: TOKENS.colors.creamLight, fontSize: 18, fontWeight: 800, marginTop: 2 }}>
              {item.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 06 — Style 3: Editorial Collage
// "Adobe's creative cloud subscription is ~$60/month."
// ════════════════════════════════════════════════════════════════════
export const Scene006_MonopolyTax: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stampSpr = spring({ frame: frame - 45, fps, config: TOKENS.motion.springs.punchy });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(239, 68, 68, 0.06)" />

      {/* Center: Editorial invoice card */}
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
          headline="ADOBE MONOPOLY TAX"
          subtext="Creative Cloud All Apps · Monthly commitment"
          stampText="EXHIBIT A"
          rotation={-1.8}
          tapePosition="top-left"
          highlightColor={TOKENS.colors.accentRed}
        >
          {/* Embedded pricing receipt */}
          <InvoiceReceipt frame={frame} fps={fps} />
        </EditorialMetaphor>
      </div>

      {/* Side: open source counter */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: "50%",
          transform: `translateY(-50%) translateX(${interpolate(stampSpr, [0, 1], [80, 0])}px)`,
          opacity: interpolate(stampSpr, [0, 1], [0, 1]),
        }}
      >
        <div
          style={{
            background: TOKENS.colors.surfaceElevated,
            border: `2px solid ${TOKENS.colors.accentGreen}`,
            borderRadius: 14,
            padding: "28px 40px",
            textAlign: "center",
            boxShadow: `0 16px 40px rgba(0,0,0,0.6), 0 0 24px ${TOKENS.colors.accentGreen}22`,
          }}
        >
          <div style={{ color: TOKENS.colors.accentGreen, fontSize: 16, fontWeight: 800, letterSpacing: 2 }}>
            OPEN SOURCE ALTERNATIVE
          </div>
          <div
            style={{
              fontFamily: TOKENS.typography.displayHeadline,
              fontSize: 80,
              fontWeight: 900,
              color: TOKENS.colors.accentGreen,
            }}
          >
            $0
          </div>
          <div style={{ color: TOKENS.colors.mutedGray, fontSize: 18, fontWeight: 600 }}>
            Per month. Forever.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const InvoiceReceipt: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const rows = [
    { label: "Adobe Photoshop", price: "$9.99/mo" },
    { label: "Adobe Premiere Pro", price: "$20.99/mo" },
    { label: "Adobe After Effects", price: "$20.99/mo" },
    { label: "Adobe Audition", price: "$20.99/mo" },
  ];
  return (
    <div
      style={{
        background: "#0c0a0b",
        borderRadius: 8,
        padding: "16px 24px",
        fontFamily: TOKENS.typography.code,
        fontSize: 16,
        width: 480,
      }}
    >
      {rows.map((row, i) => {
        const spr = spring({ frame: frame - 30 - i * 8, fps, config: TOKENS.motion.springs.card });
        return (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: `1px solid ${TOKENS.colors.borderSubtle}`,
              opacity: interpolate(spr, [0, 1], [0, 1]),
            }}
          >
            <span style={{ color: TOKENS.colors.mutedGray }}>{row.label}</span>
            <span style={{ color: TOKENS.colors.accentRed, fontWeight: 700 }}>{row.price}</span>
          </div>
        );
      })}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 12,
          marginTop: 4,
        }}
      >
        <span style={{ color: TOKENS.colors.creamLight, fontWeight: 800 }}>ALL APPS PLAN</span>
        <span style={{ color: TOKENS.colors.accentRed, fontWeight: 900, fontSize: 20 }}>~$60/mo</span>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 07 — Style 2: Evidence / Screen-Led
// "Blender is used on full-length feature films and major game studios."
// ════════════════════════════════════════════════════════════════════
export const Scene007_TitansProduction: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pill1 = spring({ frame: frame - 20, fps, config: TOKENS.motion.springs.card });
  const pill2 = spring({ frame: frame - 35, fps, config: TOKENS.motion.springs.card });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(245, 158, 11, 0.06)" />

      {/* Blender screenshot fullscreen with zoom */}
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
          mediaSrc="assets/screenshots/blender_site.png"
          sourceLabel="BLENDER.ORG — OFFICIAL PRODUCTION GALLERY"
          urlPill="blender.org/about/studios"
          caption=""
          width={1600}
          height={840}
          focusPoint={{ x: 50, y: 40, zoom: 1.05 }}
        />
      </div>

      {/* Production credit pills */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 100,
          display: "flex",
          gap: 20,
        }}
      >
        {[
          { label: "Feature Films", detail: "Used in major productions", color: TOKENS.colors.accentYellow, spr: pill1 },
          { label: "Game Studios", detail: "AAA pipelines worldwide", color: TOKENS.colors.accentBlue, spr: pill2 },
        ].map((p) => (
          <div
            key={p.label}
            style={{
              background: "rgba(18, 16, 17, 0.9)",
              border: `1.5px solid ${p.color}`,
              borderRadius: 10,
              padding: "12px 24px",
              transform: `translateY(${interpolate(p.spr, [0, 1], [24, 0])}px)`,
              opacity: interpolate(p.spr, [0, 1], [0, 1]),
              backdropFilter: "blur(10px)",
            }}
          >
            <div style={{ color: p.color, fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
              {p.detail}
            </div>
            <div style={{ color: TOKENS.colors.creamLight, fontSize: 24, fontWeight: 800 }}>
              {p.label}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 08 — Style 4: Graphic Symbols / Icon-Led
// "Build your own complete creative software stack from open source."
// ════════════════════════════════════════════════════════════════════
export const Scene008_BuildYourOwn: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleSpr = spring({ frame, fps, config: TOKENS.motion.springs.hook });

  const symbols: Array<{ icon: any; label: string; badge?: string; color: string; delay: number }> = [
    { icon: "cube", label: "3D / VFX", color: TOKENS.colors.accentYellow, delay: 10 },
    { icon: "terminal", label: "Code & CLI", color: TOKENS.colors.accentBlue, delay: 22 },
    { icon: "cpu", label: "Local AI", color: TOKENS.colors.accentGreen, delay: 34 },
    { icon: "database", label: "Data Layer", color: TOKENS.colors.accentBlue, delay: 46 },
    { icon: "zap", label: "Automation", badge: "OPEN", color: TOKENS.colors.accentYellow, delay: 58 },
  ];

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(16, 185, 129, 0.05)" />

      {/* Heading */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `translateY(${interpolate(titleSpr, [0, 1], [-20, 0])}px)`,
          opacity: interpolate(titleSpr, [0, 1], [0, 1]),
        }}
      >
        <div style={{ fontFamily: TOKENS.typography.code, fontSize: 16, color: TOKENS.colors.accentBlue, letterSpacing: 3, marginBottom: 8 }}>
          BUILD YOUR OWN STACK
        </div>
        <div
          style={{
            fontFamily: TOKENS.typography.displayHeadline,
            fontSize: 64,
            fontWeight: 900,
            color: TOKENS.colors.creamLight,
            textTransform: "uppercase",
          }}
        >
          Open Source. End to End.
        </div>
      </div>

      {/* Symbol row */}
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 48,
          padding: "0 80px",
        }}
      >
        {symbols.map((s) => (
          <GraphicSymbolWrapper
            key={s.icon + s.label}
            icon={s.icon}
            label={s.label}
            badge={s.badge}
            color={s.color}
            delay={s.delay}
            frame={frame}
            fps={fps}
          />
        ))}
      </div>

      {/* Bottom tagline */}
      <BottomTagline frame={frame} fps={fps} text="Zero vendor lock-in. Full sovereignty." delay={80} />
    </AbsoluteFill>
  );
};

const GraphicSymbolWrapper: React.FC<{
  icon: any;
  label: string;
  badge?: string;
  color: string;
  delay: number;
  frame: number;
  fps: number;
}> = ({ icon, label, badge, color, delay, frame, fps }) => {
  const spr = spring({ frame: frame - delay, fps, config: TOKENS.motion.springs.popIn });
  return (
    <div
      style={{
        transform: `scale(${interpolate(spr, [0, 1], [0.5, 1])})`,
        opacity: interpolate(spr, [0, 0.5, 1], [0, 0.7, 1]),
      }}
    >
      <GraphicSymbol icon={icon} label={label} badge={badge} color={color} size={160} />
    </div>
  );
};

const BottomTagline: React.FC<{ frame: number; fps: number; text: string; delay: number }> = ({
  frame,
  fps,
  text,
  delay,
}) => {
  const spr = spring({ frame: frame - delay, fps, config: TOKENS.motion.springs.card });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: TOKENS.typography.code,
        fontSize: 20,
        color: TOKENS.colors.accentGreen,
        letterSpacing: 2,
        fontWeight: 700,
        transform: `translateY(${interpolate(spr, [0, 1], [20, 0])}px)`,
        opacity: interpolate(spr, [0, 1], [0, 1]),
      }}
    >
      {text}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 09 — Style 5: Technical Diagram (workflow coverage)
// "DaVinci, Blender, Inkscape, Kdenlive — a complete pipeline."
// ════════════════════════════════════════════════════════════════════
export const Scene009_WorkflowCoverage: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(22, 119, 255, 0.07)" />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
          gap: 40,
        }}
      >
        <TechnicalDiagram
          title="OPEN SOURCE CREATIVE PIPELINE — FULL COVERAGE"
          mode="pipeline"
          staggerFrames={12}
          width={1600}
          nodes={[
            { id: "video", label: "Video Editing", sublabel: "DaVinci Resolve", status: "complete", accentColor: TOKENS.colors.accentGreen },
            { id: "3d", label: "3D & VFX", sublabel: "Blender 4.x", status: "complete", accentColor: TOKENS.colors.accentYellow },
            { id: "graphics", label: "Vector Art", sublabel: "Inkscape / GIMP", status: "complete", accentColor: TOKENS.colors.accentBlue },
            { id: "audio", label: "Audio Synthesis", sublabel: "Kokoro-82M TTS", status: "active", accentColor: TOKENS.colors.accentYellow },
            { id: "ai", label: "Local AI", sublabel: "Ollama / Llama 3", status: "active", accentColor: TOKENS.colors.accentBlue },
          ]}
        />

        <div
          style={{
            fontFamily: TOKENS.typography.code,
            fontSize: 18,
            color: TOKENS.colors.accentGreen,
            letterSpacing: 2,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Every node: $0 license · Local execution · Full ownership
        </div>
      </div>
    </AbsoluteFill>
  );
};
