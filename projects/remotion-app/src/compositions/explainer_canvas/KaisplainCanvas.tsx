import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface KaisplainCanvasProps {
  channelName?: string;
}

export const KaisplainCanvas: React.FC<KaisplainCanvasProps> = ({
  channelName = "VantaBrief",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // -------------------------------------------------------------
  // Camera Physics (Infinite Whiteboard Navigation)
  // Phase 1 (0-80): Focus on Node 1 (Mindmap Origin)
  // Phase 2 (80-180): Pan & zoom smoothly to Node 2 (Browser / GitHub UI)
  // Phase 3 (180-300): Zoom out to reveal Node 3 (Hardware Vector) & full architecture
  // -------------------------------------------------------------
  const camProgressPhase1to2 = spring({
    frame: Math.max(0, frame - 75),
    fps,
    config: { damping: 18, mass: 0.9, stiffness: 85 },
  });

  const camProgressPhase2to3 = spring({
    frame: Math.max(0, frame - 170),
    fps,
    config: { damping: 18, mass: 1.0, stiffness: 75 },
  });

  // Camera translation & zoom coordinates (Relative to Canvas Center)
  // Node 1 center: (-380, -40)
  // Node 2 center: (420, -120)
  // Node 3 center: (120, 360)
  const targetX = interpolate(
    camProgressPhase1to2,
    [0, 1],
    [320, -380] // Inverts to translate canvas: camera moves from Node 1 to Node 2
  );
  const targetXFinal = interpolate(
    camProgressPhase2to3,
    [0, 1],
    [targetX, -40] // Camera centers out to show the full connected map
  );

  const targetY = interpolate(
    camProgressPhase1to2,
    [0, 1],
    [40, 100]
  );
  const targetYFinal = interpolate(
    camProgressPhase2to3,
    [0, 1],
    [targetY, -140] // Moves down to capture the hardware base
  );

  const targetZoom = interpolate(
    camProgressPhase1to2,
    [0, 1],
    [1.15, 1.1]
  );
  const targetZoomFinal = interpolate(
    camProgressPhase2to3,
    [0, 1],
    [targetZoom, 0.88] // Zooms out to 0.88 to showcase the cumulative system
  );

  // Continuous subtle living canvas breathing (Rule 2)
  const subtleCanvasFloatX = Math.sin(frame / 24) * 3;
  const subtleCanvasFloatY = Math.cos(frame / 20) * 3;

  // Arrow 1 Draw Progress (Node 1 -> Node 2)
  const arrow1Draw = interpolate(frame, [65, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Arrow 2 Draw Progress (Node 2 -> Node 3)
  const arrow2Draw = interpolate(frame, [160, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Entrance springs for the nodes
  const node1Spring = spring({ frame, fps, config: { damping: 14, mass: 0.7 } });
  const node2Spring = spring({ frame: Math.max(0, frame - 80), fps, config: { damping: 14, mass: 0.8 } });
  const node3Spring = spring({ frame: Math.max(0, frame - 175), fps, config: { damping: 14, mass: 0.8 } });

  // LED and shimmer continuous oscillations
  const ledGlow = 0.5 + Math.sin(frame / 8) * 0.5;
  const shimmerSweep = (frame * 6) % 900;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#231F20", // VantaBrief Charcoal Brand Canvas
        overflow: "hidden",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* 1. Subtle Infinite Technical Grid Background */}
      <div
        style={{
          position: "absolute",
          inset: "-1000px",
          backgroundImage: `
            radial-gradient(circle, rgba(250, 244, 217, 0.08) 1.5px, transparent 1.5px)
          `,
          backgroundSize: "48px 48px",
          pointerEvents: "none",
          transform: `translate(${targetXFinal * 0.2}px, ${targetYFinal * 0.2}px)`,
        }}
      />

      {/* 2. Top Channel Status Bar (Fixed HUD overlay) */}
      <div
        style={{
          position: "absolute",
          top: "36px",
          left: "48px",
          right: "48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 50,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 24px",
            borderRadius: "999px",
            background: "rgba(35, 31, 32, 0.85)",
            border: "1px solid rgba(250, 244, 217, 0.15)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#1677FF",
              boxShadow: "0 0 10px #1677FF",
            }}
          />
          <span
            style={{
              fontSize: "26px", // >= 24px Rule
              fontWeight: 800,
              color: "#FAF4D9",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {channelName} • SYSTEM ARCHITECTURE CANVAS
          </span>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "14px",
            padding: "10px 24px",
            borderRadius: "999px",
            background: "rgba(35, 31, 32, 0.85)",
            border: "1px solid rgba(250, 244, 217, 0.15)",
            backdropFilter: "blur(12px)",
          }}
        >
          <span style={{ fontSize: "26px", fontWeight: 700, color: "rgba(250, 244, 217, 0.7)" }}>
            STAGE:
          </span>
          <span style={{ fontSize: "26px", fontWeight: 800, color: "#10B981" }}>
            {frame < 80 ? "01 / FOSS DILEMMA" : frame < 180 ? "02 / OPEN STACK" : "03 / COMPUTE SHIFT"}
          </span>
        </div>
      </div>

      {/* 3. The Infinite Whiteboard Plane (Camera-Controlled Transform) */}
      <div
        style={{
          position: "absolute",
          width: "3840px",
          height: "2160px",
          left: "-960px",
          top: "-540px",
          transformOrigin: "1920px 1080px",
          transform: `translate(${targetXFinal + subtleCanvasFloatX}px, ${
            targetYFinal + subtleCanvasFloatY
          }px) scale(${targetZoomFinal})`,
          transition: "transform 0.05s linear",
        }}
      >
        {/* ============================================================ */}
        {/* SVG CONNECTOR ARROWS (Hand-drawn path style with arrowheads) */}
        {/* ============================================================ */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 5,
          }}
        >
          <defs>
            <marker
              id="arrowhead-blue"
              markerWidth="12"
              markerHeight="12"
              refX="9"
              refY="6"
              orient="auto"
            >
              <polygon points="0 0, 12 6, 0 12" fill="#1677FF" />
            </marker>
            <marker
              id="arrowhead-amber"
              markerWidth="12"
              markerHeight="12"
              refX="9"
              refY="6"
              orient="auto"
            >
              <polygon points="0 0, 12 6, 0 12" fill="#F59E0B" />
            </marker>
          </defs>

          {/* Connector 1: Node 1 (right edge ~1800, 1020) to Node 2 (left edge ~2080, 960) */}
          <path
            d="M 1830 1040 C 1930 1040, 1980 970, 2080 970"
            fill="none"
            stroke="#1677FF"
            strokeWidth="4"
            strokeDasharray="400"
            strokeDashoffset={400 * (1 - arrow1Draw)}
            strokeLinecap="round"
            markerEnd={arrow1Draw > 0.95 ? "url(#arrowhead-blue)" : undefined}
            style={{
              filter: "drop-shadow(0 0 8px rgba(22, 119, 255, 0.6))",
            }}
          />

          {/* Connector 2: Node 2 (bottom edge ~2440, 1260) to Node 3 (top edge ~2200, 1460) */}
          <path
            d="M 2440 1260 C 2440 1380, 2340 1460, 2220 1460"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="4"
            strokeDasharray="450"
            strokeDashoffset={450 * (1 - arrow2Draw)}
            strokeLinecap="round"
            markerEnd={arrow2Draw > 0.95 ? "url(#arrowhead-amber)" : undefined}
            style={{
              filter: "drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))",
            }}
          />
        </svg>

        {/* ============================================================ */}
        {/* NODE 1: The FOSS Monetization Paradox (Whiteboard Sketch Card) */}
        {/* Position: Center around (1520, 1040) */}
        {/* ============================================================ */}
        <div
          style={{
            position: "absolute",
            left: "1240px",
            top: "800px",
            width: "580px",
            opacity: node1Spring,
            transform: `scale(${interpolate(node1Spring, [0, 1], [0.85, 1])})`,
            zIndex: 10,
          }}
        >
          {/* Hand-drawn sketchy outer border container */}
          <div
            style={{
              position: "relative",
              padding: "40px",
              borderRadius: "28px",
              background: "rgba(35, 31, 32, 0.96)",
              border: "3px solid #FAF4D9",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6), inset 0 0 15px rgba(250, 244, 217, 0.05)",
            }}
          >
            {/* Top sketch tag */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 20px",
                borderRadius: "999px",
                backgroundColor: "rgba(239, 68, 68, 0.18)",
                border: "1.5px solid #EF4444",
                marginBottom: "20px",
              }}
            >
              <span style={{ fontSize: "26px", fontWeight: 900, color: "#EF4444" }}>
                CORE QUESTION
              </span>
            </div>

            {/* Headline */}
            <div
              style={{
                fontSize: "44px", // >= 24px
                fontWeight: 900,
                color: "#FAF4D9",
                lineHeight: 1.2,
                marginBottom: "18px",
                letterSpacing: "-0.02em",
              }}
            >
              If software is free, who actually makes money?
            </div>

            {/* Script excerpt / factual concept */}
            <div
              style={{
                fontSize: "26px", // >= 24px
                color: "rgba(250, 244, 217, 0.8)",
                lineHeight: 1.45,
                marginBottom: "28px",
              }}
            >
              Making software isn't free—even when downloading it is. Developers need time, hardware, and sustainable infrastructure.
            </div>

            {/* Sub-branch pill chips (Excalidraw style) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 22px",
                  borderRadius: "16px",
                  background: "rgba(250, 244, 217, 0.06)",
                  border: "1.5px dashed rgba(250, 244, 217, 0.3)",
                }}
              >
                <span style={{ fontSize: "26px", fontWeight: 800, color: "#1677FF" }}>
                  01. Paid Convenience
                </span>
                <span style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.9)" }}>
                  Hosting & Cloud APIs
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 22px",
                  borderRadius: "16px",
                  background: "rgba(250, 244, 217, 0.06)",
                  border: "1.5px dashed rgba(250, 244, 217, 0.3)",
                }}
              >
                <span style={{ fontSize: "26px", fontWeight: 800, color: "#10B981" }}>
                  02. Enterprise Tier
                </span>
                <span style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.9)" }}>
                  Security & Compliance
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* NODE 2: The Dark Browser Window (Real GitHub Suite UI)       */}
        {/* Position: Center around (2440, 980)                          */}
        {/* ============================================================ */}
        <div
          style={{
            position: "absolute",
            left: "2080px",
            top: "720px",
            width: "740px",
            opacity: node2Spring,
            transform: `scale(${interpolate(node2Spring, [0, 1], [0.9, 1])})`,
            zIndex: 10,
          }}
        >
          {/* Dark Browser Frame (Kaisplain signature element) */}
          <div
            style={{
              borderRadius: "24px",
              background: "#191718",
              border: "2px solid rgba(22, 119, 255, 0.4)",
              boxShadow: "0 30px 80px rgba(0, 0, 0, 0.7), 0 0 20px rgba(22, 119, 255, 0.2)",
              overflow: "hidden",
            }}
          >
            {/* Browser Address Bar Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "18px 24px",
                background: "#141213",
                borderBottom: "1px solid rgba(250, 244, 217, 0.12)",
                gap: "18px",
              }}
            >
              {/* Traffic Light Dots */}
              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#EF4444" }} />
                <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#F59E0B" }} />
                <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "#10B981" }} />
              </div>

              {/* URL Address Pill */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 20px",
                  borderRadius: "12px",
                  background: "rgba(35, 31, 32, 0.9)",
                  border: "1px solid rgba(250, 244, 217, 0.15)",
                }}
              >
                <span style={{ fontSize: "26px", color: "#FAF4D9", fontFamily: "monospace" }}>
                  github.com/artcraft/suite
                </span>
                <span
                  style={{
                    fontSize: "26px",
                    fontWeight: 800,
                    color: "#10B981",
                    background: "rgba(16, 185, 129, 0.15)",
                    padding: "2px 10px",
                    borderRadius: "6px",
                  }}
                >
                  STABLE v2.4
                </span>
              </div>
            </div>

            {/* Browser Body / Repo Showcase */}
            <div style={{ padding: "36px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <div style={{ fontSize: "38px", fontWeight: 900, color: "#FAF4D9" }}>
                    ArtCraft Creative Suite
                  </div>
                  <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.65)", marginTop: "4px" }}>
                    Open-source replacement for Photoshop, Premiere & After Effects
                  </div>
                </div>

                {/* Stars Counter Pill */}
                <div
                  style={{
                    padding: "14px 22px",
                    borderRadius: "16px",
                    background: "rgba(245, 158, 11, 0.15)",
                    border: "1.5px solid #F59E0B",
                    textAlign: "right",
                  }}
                >
                  <div style={{ fontSize: "36px", fontWeight: 900, color: "#F59E0B" }}>
                    ★ 52,180
                  </div>
                  <div style={{ fontSize: "26px", fontWeight: 700, color: "#FAF4D9" }}>
                    GITHUB STARS
                  </div>
                </div>
              </div>

              {/* Wireframe Mockup Area */}
              <div
                style={{
                  height: "170px",
                  borderRadius: "16px",
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(250, 244, 217, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    padding: "18px 24px",
                    borderRadius: "12px",
                    background: "rgba(22, 119, 255, 0.12)",
                    border: "1px solid #1677FF",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "#1677FF" }}>
                    ArtCraft Video
                  </div>
                  <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.7)" }}>
                    Replaces Premiere Pro
                  </div>
                </div>

                <div
                  style={{
                    padding: "18px 24px",
                    borderRadius: "12px",
                    background: "rgba(16, 185, 129, 0.12)",
                    border: "1px solid #10B981",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "#10B981" }}>
                    ArtCraft Canvas
                  </div>
                  <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.7)" }}>
                    Replaces Photoshop
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* NODE 3: Hardware & Local Compute Shift (Vector Illustration) */}
        {/* Position: Center around (1920, 1550)                          */}
        {/* ============================================================ */}
        <div
          style={{
            position: "absolute",
            left: "1580px",
            top: "1350px",
            width: "820px",
            opacity: node3Spring,
            transform: `scale(${interpolate(node3Spring, [0, 1], [0.9, 1])})`,
            zIndex: 10,
          }}
        >
          {/* Hardware Vector Card */}
          <div
            style={{
              padding: "40px",
              borderRadius: "32px",
              background: "rgba(28, 25, 26, 0.98)",
              border: "2px solid rgba(245, 158, 11, 0.5)",
              boxShadow: "0 35px 90px rgba(0, 0, 0, 0.8)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "28px",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "6px 18px",
                    borderRadius: "999px",
                    background: "rgba(245, 158, 11, 0.15)",
                    border: "1px solid #F59E0B",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ fontSize: "26px", fontWeight: 800, color: "#F59E0B" }}>
                    INFRASTRUCTURE MONETIZATION
                  </span>
                </div>
                <div style={{ fontSize: "40px", fontWeight: 900, color: "#FAF4D9" }}>
                  The Shift Toward Local Hardware
                </div>
              </div>

              {/* Blinking Power Status */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: "#10B981",
                    boxShadow: `0 0 ${10 + ledGlow * 12}px #10B981`,
                  }}
                />
                <span style={{ fontSize: "26px", fontWeight: 700, color: "#10B981" }}>
                  LOCAL COMPUTE
                </span>
              </div>
            </div>

            {/* Vector Mac Mini / Workstation Illustration (Direct Kaisplain inspiration) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "36px",
                padding: "24px",
                borderRadius: "20px",
                background: "rgba(0, 0, 0, 0.45)",
                border: "1px solid rgba(250, 244, 217, 0.12)",
                marginBottom: "28px",
              }}
            >
              {/* Minimalist Aluminum Hardware Body */}
              <div
                style={{
                  width: "220px",
                  height: "90px",
                  borderRadius: "18px",
                  background: "linear-gradient(180deg, #3A3537 0%, #252223 100%)",
                  border: "2px solid #554F52",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                }}
              >
                {/* Hardware glowing perimeter line (cyan/amber) */}
                <div
                  style={{
                    position: "absolute",
                    inset: "2px",
                    borderRadius: "14px",
                    border: "1.5px solid rgba(22, 119, 255, 0.6)",
                    pointerEvents: "none",
                  }}
                />
                {/* Front White LED Power Indicator */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "24px",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#FAF4D9",
                    boxShadow: "0 0 8px #FAF4D9",
                  }}
                />
                <span style={{ fontSize: "28px", fontWeight: 800, color: "#FAF4D9" }}>
                  M4 PRO • 48GB
                </span>
              </div>

              {/* Hardware Value Proposition */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.75)", lineHeight: 1.4 }}>
                  "If software is free to download, value shifts to the hardware, local memory, and chips needed to execute it."
                </div>
              </div>
            </div>

            {/* Telemetry Scale / Price Ticks (Kaisplain signature price slider) */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 28px",
                borderRadius: "18px",
                background: "rgba(250, 244, 217, 0.05)",
                border: "1px solid rgba(250, 244, 217, 0.15)",
              }}
            >
              <div>
                <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.6)" }}>
                  Monthly Cloud SaaS Rent
                </div>
                <div style={{ fontSize: "38px", fontWeight: 900, color: "#EF4444" }}>
                  $50 - $120 / mo
                </div>
              </div>

              <div style={{ fontSize: "36px", color: "rgba(250, 244, 217, 0.4)" }}>
                ➔
              </div>

              <div>
                <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.6)" }}>
                  On-Device Local Execution
                </div>
                <div style={{ fontSize: "38px", fontWeight: 900, color: "#10B981" }}>
                  $0 / mo Subscription
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
