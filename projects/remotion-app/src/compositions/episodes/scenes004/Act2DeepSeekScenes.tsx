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
import { VantaMatteOverlay } from "./Act1DeepSeekScenes";

// ════════════════════════════════════════════════════════════════════
// Scene 05: Benchmark Skepticism & Frontier Parity (CoverFlow Carousel)
// ════════════════════════════════════════════════════════════════════
export const Scene005_FrontierSkepticism: React.FC<{ durationInFrames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 5, fps, config: TOKENS.motion.springs.hook });
  const shift = interpolate(frame, [25, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const models = [
    { name: "Claude 3.5 Sonnet", provider: "Anthropic (Closed)", cost: "$15.00 / 1M", color: "#F59E0B", stat: "Frontier Coding" },
    { name: "DeepSeek V4.1 Flash", provider: "DeepSeek (Open)", cost: "$0.14 / 1M", color: "#1677FF", stat: "800 Tok/s Engine" },
    { name: "GPT-4o Omnimodal", provider: "OpenAI (Closed)", cost: "$10.00 / 1M", color: "#10B981", stat: "Closed Frontier" },
  ];

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <VantaMatteOverlay accentGlow="rgba(22, 119, 255, 0.1)" />

      {/* Corner Chrome */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 70,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: TOKENS.colors.accentBlue,
          letterSpacing: 3,
          fontWeight: 700,
        }}
      >
        [05/15 // BENCHMARK EVALUATIONS]
      </div>
      <div
        style={{
          position: "absolute",
          top: 50,
          right: 70,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: TOKENS.colors.creamLight,
          letterSpacing: 2,
          opacity: 0.6,
        }}
      >
        FRONTIER PARITY CHECK
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "40px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: TOKENS.typography.code,
              fontSize: "16px",
              color: TOKENS.colors.accentBlue,
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            CAN AN OPEN MODEL MATCH CLOSED FRONTIER LABS?
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
            The Frontier Showdown
          </div>
        </div>

        {/* 3D Cards CoverFlow */}
        <div
          style={{
            position: "relative",
            width: "1200px",
            height: "380px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            perspective: "1200px",
          }}
        >
          {models.map((m, idx) => {
            const offset = idx - shift * (models.length - 1) * 0.5;
            const isCenter = Math.abs(offset) < 0.6;
            const cardX = offset * 360;
            const cardZ = isCenter ? 60 : -140;
            const rotY = isCenter ? 0 : offset > 0 ? -24 : 24;

            return (
              <div
                key={m.name}
                style={{
                  position: "absolute",
                  width: "480px",
                  height: "340px",
                  background: isCenter ? "#1C191A" : "#181516",
                  border: isCenter ? `2px solid ${m.color}` : "1.5px solid rgba(250,244,217,0.12)",
                  borderRadius: "20px",
                  padding: "36px 40px",
                  boxShadow: isCenter ? `0 24px 60px rgba(0,0,0,0.8), 0 0 40px ${m.color}35` : "none",
                  transform: `translateX(${cardX}px) translateZ(${cardZ}px) rotateY(${rotY}deg) scale(${isCenter ? 1.05 : 0.88})`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontFamily: TOKENS.typography.code, fontSize: "13px", color: m.color, letterSpacing: "1px", fontWeight: 700 }}>
                    {m.provider}
                  </div>
                  <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "36px", fontWeight: 900, color: TOKENS.colors.creamLight, marginTop: "8px", marginBottom: "8px" }}>
                    {m.name}
                  </div>
                  <div style={{ fontSize: "18px", color: TOKENS.colors.textMuted }}>
                    {m.stat}
                  </div>
                </div>
                <div style={{ borderTop: "1px solid rgba(250,244,217,0.1)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: TOKENS.typography.code, fontSize: "14px", color: TOKENS.colors.textMuted }}>API PRICING</span>
                  <span style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "32px", fontWeight: 900, color: m.color }}>{m.cost}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 06: Agentic Coding Harness & 3D Interactive Mechanical Watch
// ════════════════════════════════════════════════════════════════════
export const Scene006_Agentic3DWatch: React.FC<{ durationInFrames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 5, fps, config: TOKENS.motion.springs.hook });
  const gearRot = (frame * 1.5) % 360;
  const explodeOffset = interpolate(frame, [60, 110], [0, 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <VantaMatteOverlay accentGlow="rgba(22, 119, 255, 0.1)" />

      {/* Corner Chrome */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 70,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: TOKENS.colors.accentBlue,
          letterSpacing: 3,
          fontWeight: 700,
        }}
      >
        [06/15 // COMPLEX AGENTIC GENERATION TEST]
      </div>
      <div
        style={{
          position: "absolute",
          top: 50,
          right: 70,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: TOKENS.colors.accentGreen,
          letterSpacing: 2,
          fontWeight: 700,
        }}
      >
        TEST: 3D_MECHANICAL_WATCH
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          gap: "48px",
        }}
      >
        {/* Left: Agent Harness Specs */}
        <div
          style={{
            flex: 1,
            transform: `translateX(${interpolate(enter, [0, 1], [-40, 0])}px)`,
            opacity: interpolate(enter, [0, 1], [0, 1]),
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div>
            <div style={{ fontFamily: TOKENS.typography.code, fontSize: "15px", color: TOKENS.colors.accentBlue, letterSpacing: "3px", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>
              LONG-HORIZON SPATIAL REASONING
            </div>
            <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "56px", fontWeight: 900, color: TOKENS.colors.creamLight, letterSpacing: "-1px", lineHeight: "1.1" }}>
              Interactive 3D Mechanical Watch
            </div>
          </div>
          <div style={{ fontSize: "20px", color: TOKENS.colors.textMuted, lineHeight: "1.5" }}>
            Instead of writing toy code snippets, DeepSeek generated a complete interactive 3D mechanical watch from scratch: calculating spatial geometry, lighting angles, rotating hairspring physics, and exploded layer separations.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid rgba(250,244,217,0.1)", paddingTop: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "17px", color: TOKENS.colors.creamLight }}>
              <span style={{ color: "#1677FF", fontWeight: 900 }}>•</span>
              <span>Spatial geometry & gear tooth mesh calculations</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "17px", color: TOKENS.colors.creamLight }}>
              <span style={{ color: "#10B981", fontWeight: 900 }}>•</span>
              <span>Dynamic shadow maps as camera rotates</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "17px", color: TOKENS.colors.creamLight }}>
              <span style={{ color: "#F59E0B", fontWeight: 900 }}>•</span>
              <span>Interactive hover inspection: Hairspring, Balance Wheel, Escapement</span>
            </div>
          </div>
        </div>

        {/* Right: Technical Diagram Card (Wireframe + Explode) */}
        <div
          style={{
            width: "560px",
            height: "480px",
            background: "#1C191A",
            border: "2px solid rgba(22, 119, 255, 0.5)",
            borderRadius: "24px",
            padding: "36px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.8), 0 0 45px rgba(22, 119, 255, 0.2)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Wireframe Rotating Watch Blueprint */}
          <div style={{ position: "relative", width: "280px", height: "280px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Outer Case Ring */}
            <div style={{ position: "absolute", width: "260px", height: "260px", borderRadius: "50%", border: "2px dashed rgba(22,119,255,0.6)", transform: `rotate(${gearRot * 0.2}deg)` }} />
            {/* Middle Escapement Gear */}
            <div style={{ position: "absolute", width: "190px", height: "190px", borderRadius: "50%", border: "2px solid #10B981", transform: `translateY(${-explodeOffset}px) rotate(${-gearRot}deg)` }} />
            {/* Inner Hairspring Core */}
            <div style={{ position: "absolute", width: "110px", height: "110px", borderRadius: "50%", border: "2px solid #F59E0B", transform: `translateY(${explodeOffset}px) rotate(${gearRot * 2}deg)` }} />

            {/* Hairspring Callout Tag */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                right: "-60px",
                background: "rgba(245, 158, 11, 0.2)",
                border: "1px solid #F59E0B",
                borderRadius: "6px",
                padding: "6px 14px",
                fontFamily: TOKENS.typography.code,
                fontSize: "13px",
                color: "#F59E0B",
                fontWeight: 700,
              }}
            >
              HAIRSPRING INSPECT: OK
            </div>

            {/* Explode Mode Tag */}
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "-50px",
                background: "rgba(16, 185, 129, 0.2)",
                border: "1px solid #10B981",
                borderRadius: "6px",
                padding: "6px 14px",
                fontFamily: TOKENS.typography.code,
                fontSize: "13px",
                color: "#10B981",
                fontWeight: 700,
              }}
            >
              EXPLODE LAYER MODE: ACTIVE
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 07: Heavy Multimodal Reasoning (Bakery 130+ Pastries Count)
// ════════════════════════════════════════════════════════════════════
export const Scene007_MultimodalBakery: React.FC<{ durationInFrames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 5, fps, config: TOKENS.motion.springs.hook });
  const pastryCount = Math.round(interpolate(frame, [15, 80], [12, 134], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <VantaMatteOverlay accentGlow="rgba(245, 158, 11, 0.1)" />

      {/* Corner Chrome */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 70,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: TOKENS.colors.accentYellow,
          letterSpacing: 3,
          fontWeight: 700,
        }}
      >
        [07/15 // HEAVY MULTIMODAL VISION EVAL]
      </div>
      <div
        style={{
          position: "absolute",
          top: 50,
          right: 70,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: TOKENS.colors.creamLight,
          letterSpacing: 2,
          opacity: 0.6,
        }}
      >
        OCCLUSION_REASONING: PASSED
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          gap: "48px",
        }}
      >
        {/* Left: Text & Analysis */}
        <div
          style={{
            flex: 1,
            transform: `translateX(${interpolate(enter, [0, 1], [-40, 0])}px)`,
            opacity: interpolate(enter, [0, 1], [0, 1]),
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div>
            <div style={{ fontFamily: TOKENS.typography.code, fontSize: "15px", color: TOKENS.colors.accentYellow, letterSpacing: "3px", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>
              HIGH-RESOLUTION MULTIMODAL TEST
            </div>
            <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "56px", fontWeight: 900, color: TOKENS.colors.creamLight, letterSpacing: "-1px", lineHeight: "1.1" }}>
              130+ Pastries Detected
            </div>
          </div>
          <div style={{ fontSize: "20px", color: TOKENS.colors.textMuted, lineHeight: "1.5" }}>
            Fed a dense, high-resolution photo of a packed bakery counter. The model cropped, analyzed layer occlusions, and successfully counted and categorized over 130 individual pastries including items hidden behind stacks.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", borderTop: "1px solid rgba(250,244,217,0.1)", paddingTop: "20px" }}>
            <div style={{ background: "#252122", padding: "16px", borderRadius: "12px", border: "1px solid rgba(250,244,217,0.08)" }}>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "12px", color: TOKENS.colors.textMuted }}>DETECTION COUNT</div>
              <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "36px", fontWeight: 900, color: TOKENS.colors.accentYellow }}>{pastryCount} Items</div>
            </div>
            <div style={{ background: "#252122", padding: "16px", borderRadius: "12px", border: "1px solid rgba(250,244,217,0.08)" }}>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "12px", color: TOKENS.colors.textMuted }}>OCCLUSION ACCURACY</div>
              <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "36px", fontWeight: 900, color: TOKENS.colors.accentGreen }}>98.4%</div>
            </div>
          </div>
        </div>

        {/* Right: Vision Bounding Box UI Plate */}
        <div
          style={{
            width: "560px",
            height: "440px",
            background: "#1C191A",
            border: "2px solid rgba(245, 158, 11, 0.4)",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.8), 0 0 45px rgba(245, 158, 11, 0.15)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Scanning Box Graphic */}
          <div style={{ position: "relative", width: "100%", height: "300px", background: "rgba(0,0,0,0.4)", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(250,244,217,0.1)" }}>
            {/* Bounding box grid simulations */}
            <div style={{ position: "absolute", top: "40px", left: "60px", width: "90px", height: "70px", border: "2px solid #10B981", borderRadius: "6px" }} />
            <div style={{ position: "absolute", top: "50px", left: "180px", width: "85px", height: "80px", border: "2px solid #F59E0B", borderRadius: "6px" }} />
            <div style={{ position: "absolute", top: "140px", left: "100px", width: "110px", height: "85px", border: "2px solid #1677FF", borderRadius: "6px" }} />
            <div style={{ position: "absolute", top: "150px", left: "280px", width: "95px", height: "75px", border: "2px solid #10B981", borderRadius: "6px" }} />

            {/* Scanning line */}
            <div style={{ position: "absolute", left: 0, right: 0, top: `${(frame * 3) % 300}px`, height: "2px", background: "linear-gradient(90deg, transparent, #F59E0B, transparent)", boxShadow: "0 0 10px #F59E0B" }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: TOKENS.typography.code, fontSize: "14px", color: TOKENS.colors.creamLight }}>
            <span style={{ color: TOKENS.colors.accentYellow }}>MULTIMODAL_DEEP_THINKING</span>
            <span>CROPPING & REASONING: COMPLETE</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 08: Output Velocity (150 to 800 Tokens/Sec)
// ════════════════════════════════════════════════════════════════════
export const Scene008_OutputVelocity800Tok: React.FC<{ durationInFrames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 5, fps, config: TOKENS.motion.springs.hook });
  const speed = Math.round(interpolate(frame, [10, 80], [125, 840], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <VantaMatteOverlay accentGlow="rgba(16, 185, 129, 0.12)" />

      {/* Corner Chrome */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 70,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: TOKENS.colors.accentGreen,
          letterSpacing: 3,
          fontWeight: 700,
        }}
      >
        [08/15 // RAW GENERATION VELOCITY]
      </div>
      <div
        style={{
          position: "absolute",
          top: 50,
          right: 70,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: TOKENS.colors.creamLight,
          letterSpacing: 2,
          opacity: 0.6,
        }}
      >
        TURBO_PEAK: 800+ TOK/S
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "40px",
        }}
      >
        <div style={{ textAlign: "center" }}>
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
            LIGHTNING INFERENCE WITH REASONING BYPASSED
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
            Up to 800 Tokens / Second
          </div>
        </div>

        {/* Speedometer Card */}
        <div
          style={{
            transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
            opacity: interpolate(enter, [0, 1], [0, 1]),
            width: "1140px",
            background: "#1C191A",
            border: "2px solid #10B981",
            borderRadius: "24px",
            padding: "48px 56px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.8), 0 0 50px rgba(16, 185, 129, 0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "40px",
          }}
        >
          <div>
            <div style={{ fontFamily: TOKENS.typography.code, fontSize: "16px", color: TOKENS.colors.accentGreen, fontWeight: 700, marginBottom: "8px" }}>
              CLOUD PROVIDER BENCHMARK
            </div>
            <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "40px", fontWeight: 900, color: TOKENS.colors.creamLight, marginBottom: "12px" }}>
              Unmatched Output Velocity
            </div>
            <div style={{ fontSize: "18px", color: TOKENS.colors.textMuted, maxWidth: "560px", lineHeight: "1.5" }}>
              Standard generation flies at 125 to 150 tokens per second. Optimized enterprise clusters push beyond 800 tokens per second around the clock.
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "108px", fontWeight: 900, color: "#10B981", letterSpacing: "-3px" }}>
              {speed}
            </div>
            <div style={{ fontFamily: TOKENS.typography.code, fontSize: "24px", color: TOKENS.colors.creamLight, fontWeight: 700 }}>
              TOKENS / SEC
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

