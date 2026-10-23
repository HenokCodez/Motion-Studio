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
  EditorialMetaphor,
  GraphicSymbol,
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
// Scene 14 — Style 3: Editorial Collage
// "Making software isn't free, even when downloading it is."
// ════════════════════════════════════════════════════════════════════
export const Scene014_EconomicReality: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(245, 158, 11, 0.07)" />

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
          headline="FREE TO DOWNLOAD ≠ FREE TO BUILD"
          subtext="Server costs. Engineering salaries. CI/CD runners. Legal. Support."
          stampText="ECONOMIC REALITY"
          rotation={-1}
          tapePosition="top-center"
          highlightColor={TOKENS.colors.accentYellow}
        >
          <CostBreakdownBar />
        </EditorialMetaphor>
      </div>
    </AbsoluteFill>
  );
};

const CostBreakdownBar: React.FC = () => {
  const frame = useCurrentFrame();

  const items = [
    { label: "Server Compute", pct: 0.28, color: TOKENS.colors.accentBlue },
    { label: "Engineering", pct: 0.42, color: TOKENS.colors.accentYellow },
    { label: "Support & Legal", pct: 0.18, color: TOKENS.colors.accentRed },
    { label: "Other", pct: 0.12, color: TOKENS.colors.mutedGray },
  ];

  const progress = interpolate(frame, [20, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ width: "100%", maxWidth: 700 }}>
      <div style={{ display: "flex", height: 20, borderRadius: 6, overflow: "hidden", marginBottom: 14 }}>
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              flex: item.pct * progress,
              background: item.color,
              transition: "flex 0.3s ease",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
        {items.map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color }} />
            <span style={{ color: TOKENS.colors.mutedGray, fontSize: 14, fontFamily: TOKENS.typography.code }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 15A — Style 4: Graphic Symbol
// "Paid convenience tier — hosted SaaS on top of open-source."
// ════════════════════════════════════════════════════════════════════
export const Scene015A_PaidConvenience: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpr = spring({ frame, fps, config: TOKENS.motion.springs.hook });
  const sym1Spr = spring({ frame: frame - 20, fps, config: TOKENS.motion.springs.popIn });
  const sym2Spr = spring({ frame: frame - 36, fps, config: TOKENS.motion.springs.popIn });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(22, 119, 255, 0.07)" />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 48,
          padding: 80,
        }}
      >
        {/* Headline */}
        <div
          style={{
            textAlign: "center",
            transform: `translateY(${interpolate(titleSpr, [0, 1], [-20, 0])}px)`,
            opacity: interpolate(titleSpr, [0, 1], [0, 1]),
          }}
        >
          <div style={{ fontFamily: TOKENS.typography.code, fontSize: 16, color: TOKENS.colors.accentBlue, letterSpacing: 3, marginBottom: 10 }}>
            SUSTAINABILITY MODEL 1
          </div>
          <div
            style={{
              fontFamily: TOKENS.typography.displayHeadline,
              fontSize: 72,
              fontWeight: 900,
              color: TOKENS.colors.creamLight,
              textTransform: "uppercase",
            }}
          >
            Paid Convenience
          </div>
          <div style={{ color: TOKENS.colors.accentBlue, fontSize: 22, fontWeight: 600, marginTop: 8 }}>
            Hosted SaaS on top of open-source core
          </div>
        </div>

        {/* Two symbols side by side */}
        <div style={{ display: "flex", gap: 100, alignItems: "center" }}>
          <div style={{ transform: `scale(${interpolate(sym1Spr, [0, 1], [0.5, 1])})`, opacity: interpolate(sym1Spr, [0, 1], [0, 1]) }}>
            <GraphicSymbol icon="server" label="OPEN SOURCE CORE" color={TOKENS.colors.accentBlue} size={170} />
          </div>
          <div style={{ color: TOKENS.colors.accentYellow, fontSize: 40, fontWeight: 900 }}>+</div>
          <div style={{ transform: `scale(${interpolate(sym2Spr, [0, 1], [0.5, 1])})`, opacity: interpolate(sym2Spr, [0, 1], [0, 1]) }}>
            <GraphicSymbol icon="zap" label="MANAGED HOSTING" badge="$" color={TOKENS.colors.accentYellow} size={170} />
          </div>
        </div>

        <div style={{ fontFamily: TOKENS.typography.code, fontSize: 16, color: TOKENS.colors.mutedGray, letterSpacing: 1, textAlign: "center" }}>
          Examples: Supabase · Vercel · MongoDB Atlas
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 15B — Style 5: Technical Diagram
// "Enterprise support contracts — the real revenue engine."
// ════════════════════════════════════════════════════════════════════
export const Scene015B_EnterpriseSupport: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(245, 158, 11, 0.05)" />

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
          SUSTAINABILITY MODEL 2 — ENTERPRISE SUPPORT
        </div>

        <TechnicalDiagram
          title="HOW RED HAT / CANONICAL MAKE REVENUE"
          mode="pipeline"
          staggerFrames={14}
          width={1500}
          nodes={[
            { id: "oss", label: "Open Source Core", sublabel: "Linux · Kubernetes · Free", status: "complete", accentColor: TOKENS.colors.accentGreen },
            { id: "support", label: "Enterprise Contract", sublabel: "SLA · Certified builds · Security patches", status: "active", accentColor: TOKENS.colors.accentYellow },
            { id: "training", label: "Training & Services", sublabel: "Professional services · Migration", status: "active", accentColor: TOKENS.colors.accentBlue },
            { id: "rev", label: "Sustainable Revenue", sublabel: "Funds continued OSS development", status: "highlight", accentColor: TOKENS.colors.accentGreen },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 15C — Style 3: Editorial Collage
// "Professional services — consulting, deployment, custom integrations."
// ════════════════════════════════════════════════════════════════════
export const Scene015C_ProfessionalServices: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(22, 119, 255, 0.05)" />

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
          headline="PROFESSIONAL SERVICES MODEL"
          subtext="Deployment · Custom integrations · Consulting"
          stampText="MODEL 3"
          rotation={1.2}
          tapePosition="top-right"
          highlightColor={TOKENS.colors.accentBlue}
        >
          <ServicesGrid />
        </EditorialMetaphor>
      </div>
    </AbsoluteFill>
  );
};

const ServicesGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const services = [
    { label: "Custom Deployment", color: TOKENS.colors.accentBlue },
    { label: "Security Hardening", color: TOKENS.colors.accentRed },
    { label: "Migration Support", color: TOKENS.colors.accentYellow },
    { label: "Training Programs", color: TOKENS.colors.accentGreen },
  ];
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 600 }}>
      {services.map((s, i) => {
        const spr = spring({ frame: frame - 25 - i * 8, fps, config: TOKENS.motion.springs.card });
        return (
          <div
            key={s.label}
            style={{
              background: TOKENS.colors.surface,
              border: `1px solid ${s.color}44`,
              borderRadius: 8,
              padding: "10px 20px",
              color: s.color,
              fontSize: 16,
              fontWeight: 700,
              fontFamily: TOKENS.typography.code,
              opacity: interpolate(spr, [0, 1], [0, 1]),
              transform: `scale(${interpolate(spr, [0, 1], [0.85, 1])})`,
            }}
          >
            {s.label}
          </div>
        );
      })}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 15D — Style 4: Graphic Symbol
// "Foundation model — grants, donations, and sponsorships."
// ════════════════════════════════════════════════════════════════════
export const Scene015D_FoundationSponsorship: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpr = spring({ frame, fps, config: TOKENS.motion.springs.hook });
  const symSpr = spring({ frame: frame - 20, fps, config: TOKENS.motion.springs.popIn });
  const subSpr = spring({ frame: frame - 50, fps, config: TOKENS.motion.springs.card });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <MatteBase accentGlow="rgba(16, 185, 129, 0.06)" />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 36,
          padding: 80,
        }}
      >
        <div
          style={{
            transform: `translateY(${interpolate(titleSpr, [0, 1], [-20, 0])}px)`,
            opacity: interpolate(titleSpr, [0, 1], [0, 1]),
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: TOKENS.typography.code, fontSize: 16, color: TOKENS.colors.accentGreen, letterSpacing: 3, marginBottom: 8 }}>
            SUSTAINABILITY MODEL 4
          </div>
          <div
            style={{
              fontFamily: TOKENS.typography.displayHeadline,
              fontSize: 72,
              fontWeight: 900,
              color: TOKENS.colors.creamLight,
              textTransform: "uppercase",
            }}
          >
            Foundation & Sponsorships
          </div>
        </div>

        <div style={{ transform: `scale(${interpolate(symSpr, [0, 1], [0.5, 1])})`, opacity: interpolate(symSpr, [0, 1], [0, 1]) }}>
          <GraphicSymbol icon="network" label="COMMUNITY FUNDED" color={TOKENS.colors.accentGreen} size={200} />
        </div>

        <div
          style={{
            fontFamily: TOKENS.typography.code,
            fontSize: 18,
            color: TOKENS.colors.mutedGray,
            textAlign: "center",
            transform: `translateY(${interpolate(subSpr, [0, 1], [16, 0])}px)`,
            opacity: interpolate(subSpr, [0, 1], [0, 1]),
          }}
        >
          Examples: Blender Foundation · Mozilla · Linux Foundation · Apache
        </div>
      </div>
    </AbsoluteFill>
  );
};
