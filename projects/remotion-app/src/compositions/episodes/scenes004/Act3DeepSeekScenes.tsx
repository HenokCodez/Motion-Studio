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
// Scene 09: Architectural Breakthrough: Causal Encoder-Decoder Layer Split
// ════════════════════════════════════════════════════════════════════
export const Scene009_CausalEncoderDecoder: React.FC<{ durationInFrames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 5, fps, config: TOKENS.motion.springs.hook });
  const pulse = Math.sin(frame / 15) * 4;

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <VantaMatteOverlay accentGlow="rgba(22, 119, 255, 0.12)" />

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
        [09/15 // CORE ARCHITECTURAL MECHANISM]
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
        LAYER_SPLIT: 50/50
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
          padding: "0 80px",
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
            SOLVED AT THE ARCHITECTURAL LEVEL
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
            Causal Encoder / Decoder Split
          </div>
        </div>

        {/* Dual Layer Split Visual */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", width: "100%", maxWidth: "1280px" }}>
          {/* Top Half: Dedicated Writer Layers */}
          <div
            style={{
              transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])}) translateY(${pulse}px)`,
              opacity: interpolate(enter, [0, 1], [0, 1]),
              background: "#1C191A",
              border: "2px solid #1677FF",
              borderRadius: "20px",
              padding: "44px 48px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.7), 0 0 35px rgba(22, 119, 255, 0.25)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "360px",
            }}
          >
            <div>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "14px", color: TOKENS.colors.accentBlue, fontWeight: 700, letterSpacing: "2px" }}>
                TOP 50% LAYERS // AUTOREGRESSIVE WRITER
              </div>
              <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "36px", fontWeight: 900, color: TOKENS.colors.creamLight, marginTop: "8px", marginBottom: "16px" }}>
                Token Generation Phase
              </div>
              <div style={{ fontSize: "18px", color: TOKENS.colors.textMuted, lineHeight: "1.5" }}>
                Dedicated purely to token-by-token output writing. Unburdened by initial prompt processing overhead.
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(250,244,217,0.1)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: TOKENS.typography.code, fontSize: "14px", color: TOKENS.colors.textMuted }}>FUNCTION</span>
              <span style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "32px", fontWeight: 900, color: TOKENS.colors.accentBlue }}>Fast Output Writer</span>
            </div>
          </div>

          {/* Bottom Half: Dedicated Reader Layers */}
          <div
            style={{
              transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])}) translateY(${-pulse}px)`,
              opacity: interpolate(enter, [0, 1], [0, 1]),
              background: "#1C191A",
              border: "2px solid #10B981",
              borderRadius: "20px",
              padding: "44px 48px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.7), 0 0 35px rgba(16, 185, 129, 0.25)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "360px",
            }}
          >
            <div>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "14px", color: TOKENS.colors.accentGreen, fontWeight: 700, letterSpacing: "2px" }}>
                BOTTOM 50% LAYERS // DEDICATED PROMPT READER
              </div>
              <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "36px", fontWeight: 900, color: TOKENS.colors.creamLight, marginTop: "8px", marginBottom: "16px" }}>
                Prompt Token Compression
              </div>
              <div style={{ fontSize: "18px", color: TOKENS.colors.textMuted, lineHeight: "1.5" }}>
                When your prompt comes in, it only runs through half the layers, cutting heavy reading compute in half before servers break a sweat.
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(250,244,217,0.1)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: TOKENS.typography.code, fontSize: "14px", color: TOKENS.colors.textMuted }}>COMPUTE REDUCTION</span>
              <span style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "32px", fontWeight: 900, color: TOKENS.colors.accentGreen }}>-50% Reading Load</span>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 10: Wide Expert Parallelism (EP64 / EP128 Cluster)
// ════════════════════════════════════════════════════════════════════
export const Scene010_WideExpertParallelism: React.FC<{ durationInFrames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 5, fps, config: TOKENS.motion.springs.hook });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <VantaMatteOverlay accentGlow="rgba(139, 92, 246, 0.12)" />

      {/* Corner Chrome */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 70,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: "#8B5CF6",
          letterSpacing: 3,
          fontWeight: 700,
        }}
      >
        [10/15 // CLUSTER MEMORY OPTIMIZATION]
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
        CLUSTER_SCALE: 64-128 GPUS
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
              color: "#8B5CF6",
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            CROSS-NODE MEMORY BOTTLENECK ELIMINATED
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
            Wide Expert Parallelism
          </div>
        </div>

        {/* 88% Drop Showcase Card */}
        <div
          style={{
            transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
            opacity: interpolate(enter, [0, 1], [0, 1]),
            width: "1140px",
            background: "#1C191A",
            border: "2px solid #8B5CF6",
            borderRadius: "24px",
            padding: "48px 56px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.8), 0 0 50px rgba(139, 92, 246, 0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "40px",
          }}
        >
          <div>
            <div style={{ fontFamily: TOKENS.typography.code, fontSize: "16px", color: "#8B5CF6", fontWeight: 700, marginBottom: "8px" }}>
              DISTRIBUTED MoE CLUSTER ROUTING
            </div>
            <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "40px", fontWeight: 900, color: TOKENS.colors.creamLight, marginBottom: "12px" }}>
              Zero-Bottleneck Memory Flow
            </div>
            <div style={{ fontSize: "18px", color: TOKENS.colors.textMuted, maxWidth: "560px", lineHeight: "1.5" }}>
              Instead of forcing one GPU to carry all experts, DeepSeek distributes specialists across clusters of 64 to 128 graphics cards, preventing cross-node choking.
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "108px", fontWeight: 900, color: "#8B5CF6", letterSpacing: "-3px" }}>
              -88%
            </div>
            <div style={{ fontFamily: TOKENS.typography.code, fontSize: "22px", color: TOKENS.colors.creamLight, fontWeight: 700 }}>
              MEMORY TRAFFIC DROP
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 11: 100 Petabyte 3FS Distributed NVMe Context Storage
// ════════════════════════════════════════════════════════════════════
export const Scene011_ContextStorage3FS: React.FC<{ durationInFrames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 5, fps, config: TOKENS.motion.springs.hook });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <VantaMatteOverlay accentGlow="rgba(245, 158, 11, 0.12)" />

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
        [11/15 // CONTEXT CACHE REVOLUTION]
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
        CACHE_CAPACITY: 100PB SSD
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
              color: TOKENS.colors.accentYellow,
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            CUSTOM 3FS DISTRIBUTED NVMe CLUSTERS
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
            100 Petabytes of Context
          </div>
        </div>

        {/* Dual Cards: 100PB Capacity + 96% Hit Rate */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", width: "1160px" }}>
          <div
            style={{
              transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
              opacity: interpolate(enter, [0, 1], [0, 1]),
              background: "#1C191A",
              border: "2px solid rgba(245, 158, 11, 0.45)",
              borderRadius: "20px",
              padding: "44px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.7), 0 0 35px rgba(245, 158, 11, 0.15)",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: TOKENS.typography.code, fontSize: "15px", color: TOKENS.colors.accentYellow, fontWeight: 700, letterSpacing: "2px", marginBottom: "8px" }}>
              DISTRIBUTED 3FS STORAGE
            </div>
            <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "88px", fontWeight: 900, color: TOKENS.colors.creamLight, letterSpacing: "-2px" }}>
              100 PB
            </div>
            <div style={{ fontSize: "18px", color: TOKENS.colors.textMuted, marginTop: "8px" }}>
              Ultra-fast SSD pool purely dedicated to caching prompt context
            </div>
          </div>

          <div
            style={{
              transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
              opacity: interpolate(enter, [0, 1], [0, 1]),
              background: "#1C191A",
              border: "2px solid #10B981",
              borderRadius: "20px",
              padding: "44px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.7), 0 0 35px rgba(16, 185, 129, 0.25)",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: TOKENS.typography.code, fontSize: "15px", color: "#10B981", fontWeight: 700, letterSpacing: "2px", marginBottom: "8px" }}>
              CACHE HIT EFFICIENCY
            </div>
            <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "88px", fontWeight: 900, color: "#10B981", letterSpacing: "-2px" }}>
              96%
            </div>
            <div style={{ fontSize: "18px", color: TOKENS.colors.textMuted, marginTop: "8px" }}>
              Almost all compute serves pre-calculated tokens without re-computation
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 12: The Catch: What Stayed Closed
// ════════════════════════════════════════════════════════════════════
export const Scene012_TheCatchClosedBakery: React.FC<{ durationInFrames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 5, fps, config: TOKENS.motion.springs.hook });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <VantaMatteOverlay accentGlow="rgba(239, 68, 68, 0.1)" />

      {/* Corner Chrome */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 70,
          fontFamily: TOKENS.typography.code,
          fontSize: 18,
          color: TOKENS.colors.accentRed,
          letterSpacing: 3,
          fontWeight: 700,
        }}
      >
        [12/15 // CRITICAL PREREQUISITES & LIMITS]
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
        THE_CATCH: CLUSTERS_REQUIRED
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
          padding: "0 80px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: TOKENS.typography.code,
              fontSize: "16px",
              color: TOKENS.colors.accentRed,
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            TRANSPARENT BOUNDARIES IN THE CODEBASE
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
            The Catch You Need to Know
          </div>
        </div>

        {/* Boundary Card */}
        <div
          style={{
            transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
            opacity: interpolate(enter, [0, 1], [0, 1]),
            width: "1140px",
            background: "#1C191A",
            border: "2px solid rgba(239, 68, 68, 0.45)",
            borderRadius: "24px",
            padding: "48px 56px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.8), 0 0 50px rgba(239, 68, 68, 0.15)",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "40px", fontWeight: 900, color: TOKENS.colors.creamLight }}>
            They Gave the Engine — Not the Entire Bakery
          </div>
          <div style={{ fontSize: "20px", color: TOKENS.colors.textMuted, lineHeight: "1.5" }}>
            Deepinfer gives you the raw inference engine, but running it at production scale requires serious enterprise infrastructure: 128 high-end GPUs, custom network switching, and massive storage racks.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", borderTop: "1px solid rgba(250,244,217,0.1)", paddingTop: "20px" }}>
            <div style={{ background: "#252122", padding: "18px 24px", borderRadius: "12px", border: "1px solid rgba(16,185,129,0.3)" }}>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "13px", color: "#10B981", fontWeight: 700 }}>WHAT YOU GET FOR FREE</div>
              <div style={{ fontSize: "16px", color: TOKENS.colors.creamLight, marginTop: "8px", lineHeight: "1.4" }}>
                Full model weights, Causal Attention Kernels, EP64 routing code, and local harness.
              </div>
            </div>
            <div style={{ background: "#252122", padding: "18px 24px", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.3)" }}>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "13px", color: "#EF4444", fontWeight: 700 }}>WHAT YOU MUST PROVIDE</div>
              <div style={{ fontSize: "16px", color: TOKENS.colors.creamLight, marginTop: "8px", lineHeight: "1.4" }}>
                High-end enterprise clusters (minimum 128 GPUs), custom NVMe SSD SAN, and global load balancers.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 13: Hardware Support Matrix: Blackwell + Huawei Silicon
// ════════════════════════════════════════════════════════════════════
export const Scene013_HardwareMatrixBlackwellHuawei: React.FC<{ durationInFrames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 5, fps, config: TOKENS.motion.springs.hook });
  const strikeProgress = interpolate(frame, [35, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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
        [13/15 // HARDWARE COMPATIBILITY MATRIX]
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
        HOPPER_H100: BYPASSED
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
          padding: "0 80px",
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
            DUAL-SILICON PRODUCTION MATRIX
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
            Blackwell + Huawei Ascend Native
          </div>
        </div>

        {/* 3 Hardware Columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "32px", width: "100%", maxWidth: "1280px" }}>
          {/* Card 1: NVIDIA Blackwell */}
          <div
            style={{
              transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
              opacity: interpolate(enter, [0, 1], [0, 1]),
              background: "#1C191A",
              border: "2px solid #10B981",
              borderRadius: "20px",
              padding: "36px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.7), 0 0 35px rgba(16, 185, 129, 0.2)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "360px",
            }}
          >
            <div>
              <div style={{ width: "48px", height: "48px", background: "#EDEDED", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", marginBottom: "16px" }}>
                <Img src={staticFile("assets/logos/nvidia.svg")} style={{ width: "100%", height: "100%" }} />
              </div>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "13px", color: "#10B981", fontWeight: 700 }}>FIRST-CLASS SUPPORT</div>
              <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "32px", fontWeight: 900, color: TOKENS.colors.creamLight, marginTop: "4px", marginBottom: "12px" }}>
                Nvidia Blackwell
              </div>
              <div style={{ fontSize: "16px", color: TOKENS.colors.textMuted }}>
                GB200 architecture running natively with Tensor Core kernel acceleration.
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(250,244,217,0.1)", paddingTop: "14px", fontFamily: TOKENS.typography.code, fontSize: "14px", color: "#10B981", fontWeight: 700 }}>
              STATUS: FULLY SUPPORTED
            </div>
          </div>

          {/* Card 2: Huawei Ascend Domestic */}
          <div
            style={{
              transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
              opacity: interpolate(enter, [0, 1], [0, 1]),
              background: "#1C191A",
              border: "2px solid #1677FF",
              borderRadius: "20px",
              padding: "36px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.7), 0 0 35px rgba(22, 119, 255, 0.2)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "360px",
            }}
          >
            <div>
              <div style={{ width: "48px", height: "48px", background: "#EDEDED", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", marginBottom: "16px" }}>
                <Img src={staticFile("assets/logos/huawei.svg")} style={{ width: "100%", height: "100%" }} />
              </div>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "13px", color: "#1677FF", fontWeight: 700 }}>DOMESTIC SILICON</div>
              <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "32px", fontWeight: 900, color: TOKENS.colors.creamLight, marginTop: "4px", marginBottom: "12px" }}>
                Huawei Ascend 950
              </div>
              <div style={{ fontSize: "16px", color: TOKENS.colors.textMuted }}>
                Independent of Western export bans with native hardware optimization.
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(250,244,217,0.1)", paddingTop: "14px", fontFamily: TOKENS.typography.code, fontSize: "14px", color: "#1677FF", fontWeight: 700 }}>
              STATUS: FULLY SUPPORTED
            </div>
          </div>

          {/* Card 3: Hopper H100 Bypassed */}
          <div
            style={{
              transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
              opacity: interpolate(enter, [0, 1], [0, 1]),
              background: "#1C191A",
              border: "2px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "20px",
              padding: "36px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "360px",
              position: "relative",
            }}
          >
            <div>
              <div style={{ width: "48px", height: "48px", background: "#3A3335", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", marginBottom: "16px" }}>
                <Img src={staticFile("assets/logos/nvidia.svg")} style={{ width: "100%", height: "100%", opacity: 0.4 }} />
              </div>
              <div style={{ fontFamily: TOKENS.typography.code, fontSize: "13px", color: "#EF4444", fontWeight: 700 }}>PREVIOUS GENERATION</div>
              <div style={{ position: "relative", fontFamily: TOKENS.typography.displayHeadline, fontSize: "32px", fontWeight: 900, color: TOKENS.colors.textMuted, marginTop: "4px", marginBottom: "12px" }}>
                <span>Nvidia Hopper H100</span>
                {strikeProgress > 0 && (
                  <div style={{ position: "absolute", top: "50%", left: 0, width: `${strikeProgress * 100}%`, height: "3px", background: "#EF4444" }} />
                )}
              </div>
              <div style={{ fontSize: "16px", color: TOKENS.colors.textMuted }}>
                Completely bypassed in the new production engine code.
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(250,244,217,0.1)", paddingTop: "14px", fontFamily: TOKENS.typography.code, fontSize: "14px", color: "#EF4444", fontWeight: 700 }}>
              STATUS: BYPASSED ENTIRELY
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 14: Systems Engineering Beats Brute Force
// ════════════════════════════════════════════════════════════════════
export const Scene014_SystemsEngineeringVerdict: React.FC<{ durationInFrames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 5, fps, config: TOKENS.motion.springs.hook });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <VantaMatteOverlay accentGlow="rgba(22, 119, 255, 0.12)" />

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
        [14/15 // THE VERDICT]
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
        PARADIGM: SYSTEMS &gt; BRUTE FORCE
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "36px",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
            opacity: interpolate(enter, [0, 1], [0, 1]),
            width: "1160px",
            background: "#1C191A",
            border: "2px solid rgba(22, 119, 255, 0.5)",
            borderRadius: "24px",
            padding: "52px 64px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.8), 0 0 50px rgba(22, 119, 255, 0.25)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: TOKENS.typography.code,
              fontSize: "16px",
              color: TOKENS.colors.accentBlue,
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            THE NEW RULES OF ARTIFICIAL INTELLIGENCE
          </div>
          <div
            style={{
              fontFamily: TOKENS.typography.displayHeadline,
              fontSize: "60px",
              fontWeight: 900,
              color: TOKENS.colors.creamLight,
              letterSpacing: "-1px",
              lineHeight: "1.15",
              marginBottom: "20px",
            }}
          >
            Smart Systems Engineering Beats Brute Force Spending Every Single Time
          </div>
          <div
            style={{
              fontSize: "22px",
              color: TOKENS.colors.textMuted,
              lineHeight: "1.5",
              maxWidth: "880px",
              margin: "0 auto",
            }}
          >
            The competition isn't just about who can buy the most GPUs anymore. It's about who can deliver intelligence at the lowest possible cost. And right now, DeepSeek is writing the playbook.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// Scene 15: Outro & The Playbook Discussion
// ════════════════════════════════════════════════════════════════════
export const Scene015_OutroPlaybook: React.FC<{ durationInFrames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 5, fps, config: TOKENS.motion.springs.hook });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: TOKENS.typography.fontFamily.sans }}>
      <VantaMatteOverlay accentGlow="rgba(16, 185, 129, 0.1)" />

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
        [15/15 // DISCUSSION & OUTRO]
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
        VANTABRIEF // 2026
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
        <div
          style={{
            transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
            opacity: interpolate(enter, [0, 1], [0, 1]),
            width: "1100px",
            background: "#1C191A",
            border: "2px solid rgba(250, 244, 217, 0.2)",
            borderRadius: "24px",
            padding: "48px 56px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.8)",
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: TOKENS.typography.code, fontSize: "16px", color: TOKENS.colors.accentGreen, letterSpacing: "3px", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>
            WHAT DO YOU THINK?
          </div>
          <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "52px", fontWeight: 900, color: TOKENS.colors.creamLight, letterSpacing: "-0.5px", marginBottom: "16px" }}>
            Will Western Labs Lower Their Prices?
          </div>
          <div style={{ fontSize: "20px", color: TOKENS.colors.textMuted, maxWidth: "760px", margin: "0 auto", lineHeight: "1.5", marginBottom: "32px" }}>
            Let me know in the comments below. If you enjoyed this engineering breakdown, subscribe to VantaBrief for more concise software and AI deep dives.
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "16px", background: "rgba(22, 119, 255, 0.2)", border: "1.5px solid #1677FF", borderRadius: "999px", padding: "12px 32px" }}>
            <span style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: "22px", fontWeight: 800, color: TOKENS.colors.creamLight }}>
              VANTA BRIEF
            </span>
            <span style={{ fontFamily: TOKENS.typography.code, fontSize: "14px", color: TOKENS.colors.accentBlue }}>
              // CONCISE INTELLIGENCE
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
