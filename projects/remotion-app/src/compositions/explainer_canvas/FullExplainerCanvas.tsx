import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface FullExplainerCanvasProps {
  channelName?: string;
  audioPath?: string;
}

export const FullExplainerCanvas: React.FC<FullExplainerCanvasProps> = ({
  channelName = "VantaBrief",
  audioPath = "audio/003/audio.mp3",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // -------------------------------------------------------------
  // Timeline Milestones (based on Whisper transcription timestamps)
  // Total duration: 264.86s = 7946 frames @ 30fps
  // Ch 1 (0.0s - 45.6s): frames 0 - 1368 (2026 Shift & ArtCraft)
  // Ch 2 (45.6s - 90.4s): frames 1368 - 2712 (SaaS Toll vs Open Stack)
  // Ch 3 (90.4s - 137.8s): frames 2712 - 4134 (Open Weights & Local AI)
  // Ch 4 (137.8s - 191.2s): frames 4134 - 5736 (4 Monetization Blueprints)
  // Ch 5 (191.2s - 227.6s): frames 5736 - 6828 (Hardware & Compute Shift)
  // Ch 6 (227.6s - 264.8s): frames 6828 - 7946 (The New Paradigm & Outro)
  // -------------------------------------------------------------

  // Smooth camera interpolation across the 6 narrative spatial regions
  // Inverted translations so positive camera target shifts canvas properly
  const cameraSchedule = [
    { f: 0, x: 650, y: 350, z: 1.15 },
    { f: 600, x: 200, y: 350, z: 1.12 },
    { f: 1300, x: 200, y: 350, z: 1.12 },
    { f: 1420, x: -750, y: 350, z: 1.15 }, // Pan to Ch 2
    { f: 2650, x: -750, y: 350, z: 1.15 },
    { f: 2780, x: -1150, y: -250, z: 1.12 }, // Pan to Ch 3
    { f: 4050, x: -1150, y: -250, z: 1.12 },
    { f: 4180, x: 0, y: -450, z: 1.08 }, // Pan to Ch 4 (Center Mindmap)
    { f: 5650, x: 0, y: -450, z: 1.08 },
    { f: 5780, x: 750, y: -800, z: 1.1 }, // Pan to Ch 5 (Hardware Node)
    { f: 6750, x: 750, y: -800, z: 1.1 },
    { f: 6900, x: 0, y: -200, z: 0.58 }, // Pull back to Master Canvas View
    { f: 7946, x: 0, y: -200, z: 0.56 },
  ];

  const camFrames = cameraSchedule.map((c) => c.f);
  const camXs = cameraSchedule.map((c) => c.x);
  const camYs = cameraSchedule.map((c) => c.y);
  const camZs = cameraSchedule.map((c) => c.z);

  const targetX = interpolate(frame, camFrames, camXs, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const targetY = interpolate(frame, camFrames, camYs, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const targetZoom = interpolate(frame, camFrames, camZs, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Continuous subtle living canvas breathing (Rule 2)
  const subtleCanvasFloatX = Math.sin(frame / 26) * 3;
  const subtleCanvasFloatY = Math.cos(frame / 22) * 3;

  // Active Chapter Label
  let chapterTitle = "01 / THE 2026 SHIFT";
  let chapterPillColor = "#1677FF";
  if (frame >= 1368 && frame < 2712) {
    chapterTitle = "02 / SAAS TOLL VS OPEN STACK";
    chapterPillColor = "#F59E0B";
  } else if (frame >= 2712 && frame < 4134) {
    chapterTitle = "03 / OPEN WEIGHTS REVOLUTION";
    chapterPillColor = "#10B981";
  } else if (frame >= 4134 && frame < 5736) {
    chapterTitle = "04 / 4 MONETIZATION BLUEPRINTS";
    chapterPillColor = "#1677FF";
  } else if (frame >= 5736 && frame < 6828) {
    chapterTitle = "05 / HARDWARE COMPUTE SHIFT";
    chapterPillColor = "#F59E0B";
  } else if (frame >= 6828) {
    chapterTitle = "06 / THE NEW PARADIGM";
    chapterPillColor = "#10B981";
  }

  // Progressive SVG arrow draw animations
  const arrow1Draw = interpolate(frame, [450, 520], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrow2Draw = interpolate(frame, [1100, 1180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrow3Draw = interpolate(frame, [1368, 1440], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrow4Draw = interpolate(frame, [2700, 2780], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrow5Draw = interpolate(frame, [4120, 4200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrow6Draw = interpolate(frame, [5720, 5800], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // LED and pulse dynamics
  const ledPulse = 0.5 + Math.sin(frame / 8) * 0.5;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#231F20", // VantaBrief Charcoal Brand Canvas
        overflow: "hidden",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* 1. Voiceover Audio Track (Clean, untouched single audio source) */}
      <Audio src={staticFile(audioPath)} />

      {/* 2. Infinite Technical Grid Texture */}
      <div
        style={{
          position: "absolute",
          inset: "-1500px",
          backgroundImage: `
            radial-gradient(circle, rgba(250, 244, 217, 0.08) 1.5px, transparent 1.5px)
          `,
          backgroundSize: "52px 52px",
          pointerEvents: "none",
          transform: `translate(${targetX * 0.15}px, ${targetY * 0.15}px)`,
        }}
      />

      {/* 3. Top Channel Status HUD */}
      <div
        style={{
          position: "absolute",
          top: "36px",
          left: "48px",
          right: "48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 60,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "14px",
            padding: "10px 24px",
            borderRadius: "999px",
            background: "rgba(35, 31, 32, 0.88)",
            border: "1px solid rgba(250, 244, 217, 0.15)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: chapterPillColor,
              boxShadow: `0 0 12px ${chapterPillColor}`,
            }}
          />
          <span
            style={{
              fontSize: "26px", // >= 24px Rule
              fontWeight: 900,
              color: "#FAF4D9",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {channelName} • TECHNICAL EXPLAINER CANVAS
          </span>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "14px",
            padding: "10px 24px",
            borderRadius: "999px",
            background: "rgba(35, 31, 32, 0.88)",
            border: "1px solid rgba(250, 244, 217, 0.15)",
            backdropFilter: "blur(14px)",
          }}
        >
          <span style={{ fontSize: "26px", fontWeight: 700, color: "rgba(250, 244, 217, 0.7)" }}>
            CHAPTER:
          </span>
          <span style={{ fontSize: "26px", fontWeight: 900, color: chapterPillColor }}>
            {chapterTitle}
          </span>
        </div>
      </div>

      {/* 4. The Infinite Spatial Whiteboard Plane */}
      <div
        style={{
          position: "absolute",
          width: "5000px",
          height: "4000px",
          left: "-1500px",
          top: "-1500px",
          transformOrigin: "2500px 2000px",
          transform: `translate(${targetX + subtleCanvasFloatX}px, ${
            targetY + subtleCanvasFloatY
          }px) scale(${targetZoom})`,
          transition: "transform 0.04s linear",
        }}
      >
        {/* ============================================================ */}
        {/* SVG CONNECTOR NETWORK (Continuous Bezier Vector Arrows)       */}
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
            <marker id="arrow-blue" markerWidth="14" markerHeight="14" refX="10" refY="7" orient="auto">
              <polygon points="0 0, 14 7, 0 14" fill="#1677FF" />
            </marker>
            <marker id="arrow-amber" markerWidth="14" markerHeight="14" refX="10" refY="7" orient="auto">
              <polygon points="0 0, 14 7, 0 14" fill="#F59E0B" />
            </marker>
            <marker id="arrow-green" markerWidth="14" markerHeight="14" refX="10" refY="7" orient="auto">
              <polygon points="0 0, 14 7, 0 14" fill="#10B981" />
            </marker>
          </defs>

          {/* Arrow 1: Node 1A (2026 Shift) -> Node 1B (Browser Frame) */}
          <path
            d="M 2150 1650 C 2240 1650, 2270 1620, 2350 1620"
            fill="none"
            stroke="#1677FF"
            strokeWidth="4"
            strokeDasharray="300"
            strokeDashoffset={300 * (1 - arrow1Draw)}
            strokeLinecap="round"
            markerEnd={arrow1Draw > 0.95 ? "url(#arrow-blue)" : undefined}
          />

          {/* Arrow 2: Node 1B -> Node 1C (Core Question) */}
          <path
            d="M 2850 1650 C 2950 1650, 2980 1780, 3050 1780"
            fill="none"
            stroke="#EF4444"
            strokeWidth="4"
            strokeDasharray="400"
            strokeDashoffset={400 * (1 - arrow2Draw)}
            strokeLinecap="round"
          />

          {/* Arrow 3: Ch 1 (Top Left) -> Ch 2 (Top Right) */}
          <path
            d="M 2850 1520 C 3100 1420, 3250 1480, 3450 1550"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="5"
            strokeDasharray="750"
            strokeDashoffset={750 * (1 - arrow3Draw)}
            strokeLinecap="round"
            markerEnd={arrow3Draw > 0.95 ? "url(#arrow-amber)" : undefined}
          />

          {/* Arrow 4: Ch 2 -> Ch 3 (Model Weights Revolution) */}
          <path
            d="M 3750 1900 C 3850 2050, 3850 2200, 3750 2320"
            fill="none"
            stroke="#10B981"
            strokeWidth="5"
            strokeDasharray="600"
            strokeDashoffset={600 * (1 - arrow4Draw)}
            strokeLinecap="round"
            markerEnd={arrow4Draw > 0.95 ? "url(#arrow-green)" : undefined}
          />

          {/* Arrow 5: Ch 3 -> Ch 4 (4 Monetization Blueprints) */}
          <path
            d="M 3300 2450 C 2950 2550, 2800 2480, 2550 2480"
            fill="none"
            stroke="#1677FF"
            strokeWidth="5"
            strokeDasharray="850"
            strokeDashoffset={850 * (1 - arrow5Draw)}
            strokeLinecap="round"
            markerEnd={arrow5Draw > 0.95 ? "url(#arrow-blue)" : undefined}
          />

          {/* Arrow 6: Ch 4 -> Ch 5 (Hardware Shift) */}
          <path
            d="M 2150 2700 C 1950 2800, 1850 2880, 1750 2950"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="5"
            strokeDasharray="700"
            strokeDashoffset={700 * (1 - arrow6Draw)}
            strokeLinecap="round"
            markerEnd={arrow6Draw > 0.95 ? "url(#arrow-amber)" : undefined}
          />
        </svg>

        {/* ============================================================ */}
        {/* CHAPTER 1: THE 2026 SHIFT (Position: ~1800-2800, 1400-1900)  */}
        {/* ============================================================ */}
        {/* Node 1A: 2026 Shift Card */}
        <div
          style={{
            position: "absolute",
            left: "1550px",
            top: "1450px",
            width: "560px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: "40px",
              borderRadius: "28px",
              background: "rgba(35, 31, 32, 0.96)",
              border: "3px solid #FAF4D9",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "6px 18px",
                borderRadius: "999px",
                background: "rgba(22, 119, 255, 0.15)",
                border: "1.5px solid #1677FF",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "26px", fontWeight: 800, color: "#1677FF" }}>
                THE 2026 REALITY
              </span>
            </div>
            <div style={{ fontSize: "42px", fontWeight: 900, color: "#FAF4D9", lineHeight: 1.2, marginBottom: "16px" }}>
              Zero Subscriptions Required
            </div>
            <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.8)", lineHeight: 1.45, marginBottom: "24px" }}>
              In 2026, you can edit video, design graphics, generate images, clone voices, and run AI locally without monthly rent.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {["✓ Video & Audio Editing", "✓ Vector & 3D Design", "✓ Open AI Models Locally"].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "#10B981",
                    background: "rgba(16, 185, 129, 0.08)",
                    padding: "10px 18px",
                    borderRadius: "12px",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Node 1B: Dark Browser Window (ArtCraft Suite) */}
        <div
          style={{
            position: "absolute",
            left: "2350px",
            top: "1400px",
            width: "680px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              borderRadius: "24px",
              background: "#191718",
              border: "2px solid rgba(22, 119, 255, 0.4)",
              boxShadow: "0 30px 80px rgba(0, 0, 0, 0.7)",
              overflow: "hidden",
            }}
          >
            {/* Browser URL Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "16px 22px",
                background: "#141213",
                borderBottom: "1px solid rgba(250, 244, 217, 0.12)",
                gap: "14px",
              }}
            >
              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#EF4444" }} />
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#F59E0B" }} />
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10B981" }} />
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "6px 16px",
                  borderRadius: "10px",
                  background: "rgba(35, 31, 32, 0.9)",
                  border: "1px solid rgba(250, 244, 217, 0.15)",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "26px", color: "#FAF4D9", fontFamily: "monospace" }}>
                  github.com/artcraft/suite
                </span>
                <span style={{ fontSize: "26px", fontWeight: 800, color: "#10B981" }}>
                  OPEN SUITE
                </span>
              </div>
            </div>

            <div style={{ padding: "32px" }}>
              <div style={{ fontSize: "36px", fontWeight: 900, color: "#FAF4D9", marginBottom: "8px" }}>
                ArtCraft Creative Suite
              </div>
              <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.7)", marginBottom: "20px" }}>
                Open-source solo project recreating Photoshop, Premiere Pro & After Effects with AI assistance.
              </div>
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1, padding: "16px", borderRadius: "14px", background: "rgba(22, 119, 255, 0.12)", border: "1px solid #1677FF" }}>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "#1677FF" }}>Photoshop</div>
                  <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.7)" }}>➔ ArtCraft Canvas</div>
                </div>
                <div style={{ flex: 1, padding: "16px", borderRadius: "14px", background: "rgba(16, 185, 129, 0.12)", border: "1px solid #10B981" }}>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "#10B981" }}>Premiere Pro</div>
                  <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.7)" }}>➔ ArtCraft Video</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Node 1C: Central Question Card */}
        <div
          style={{
            position: "absolute",
            left: "2950px",
            top: "1720px",
            width: "500px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: "36px",
              borderRadius: "24px",
              background: "rgba(239, 68, 68, 0.12)",
              border: "2px solid #EF4444",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
            }}
          >
            <div style={{ fontSize: "26px", fontWeight: 900, color: "#EF4444", marginBottom: "8px" }}>
              THE PARADOX
            </div>
            <div style={{ fontSize: "36px", fontWeight: 900, color: "#FAF4D9", lineHeight: 1.25 }}>
              If software is free, who actually makes money?
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CHAPTER 2: SAAS TOLL VS OPEN STACK (Position: ~3400-4200)     */}
        {/* ============================================================ */}
        <div
          style={{
            position: "absolute",
            left: "3450px",
            top: "1400px",
            width: "720px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: "40px",
              borderRadius: "32px",
              background: "rgba(35, 31, 32, 0.96)",
              border: "2px solid rgba(245, 158, 11, 0.4)",
              boxShadow: "0 30px 80px rgba(0, 0, 0, 0.7)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "6px 18px",
                borderRadius: "999px",
                background: "rgba(245, 158, 11, 0.15)",
                border: "1.5px solid #F59E0B",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "26px", fontWeight: 800, color: "#F59E0B" }}>
                THE 90% THRESHOLD
              </span>
            </div>

            <div style={{ fontSize: "40px", fontWeight: 900, color: "#FAF4D9", marginBottom: "16px" }}>
              The Software Toll Becomes Nonsense
            </div>
            <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.75)", lineHeight: 1.45, marginBottom: "26px" }}>
              "If an open-source alternative does 90% of what you need, paying hundreds of dollars a year for the original becomes nonsense."
            </div>

            {/* Comparison Rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 20px", borderRadius: "14px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                <span style={{ fontSize: "26px", color: "#FAF4D9" }}>Adobe Creative Cloud</span>
                <span style={{ fontSize: "28px", fontWeight: 800, color: "#EF4444" }}>$600+ / yr Toll</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 20px", borderRadius: "14px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                <span style={{ fontSize: "26px", color: "#FAF4D9" }}>DaVinci + Blender + FOSS</span>
                <span style={{ fontSize: "28px", fontWeight: 800, color: "#10B981" }}>$0 / yr Permanent</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CHAPTER 3: OPEN WEIGHTS REVOLUTION (Position: ~3500-4300, 2200)*/}
        {/* ============================================================ */}
        <div
          style={{
            position: "absolute",
            left: "3500px",
            top: "2200px",
            width: "750px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: "40px",
              borderRadius: "32px",
              background: "rgba(28, 25, 26, 0.98)",
              border: "2px solid rgba(16, 185, 129, 0.4)",
              boxShadow: "0 35px 85px rgba(0, 0, 0, 0.75)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "6px 18px",
                borderRadius: "999px",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1.5px solid #10B981",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "26px", fontWeight: 800, color: "#10B981" }}>
                MODELS ON-DEVICE
              </span>
            </div>

            <div style={{ fontSize: "40px", fontWeight: 900, color: "#FAF4D9", marginBottom: "16px" }}>
              Software Is Only Half the Story
            </div>
            <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.75)", lineHeight: 1.45, marginBottom: "26px" }}>
              Open weights now cover every creative domain. Run high-quality models privately without sending data to cloud APIs.
            </div>

            {/* Terminal CLI window */}
            <div style={{ borderRadius: "18px", background: "#121011", border: "1px solid rgba(250, 244, 217, 0.15)", padding: "20px" }}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#EF4444" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#F59E0B" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10B981" }} />
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "26px", color: "#10B981", lineHeight: 1.5 }}>
                $ ollama run llama3:70b-instruct --vram 48GB<br />
                ✓ Kokoro TTS: 82M Speech Model [LOADED]<br />
                ✓ Krea Open Weights: Diffusion Pipeline [ACTIVE]
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CHAPTER 4: 4 MONETIZATION BLUEPRINTS (Position: Center ~2200, 2300)*/}
        {/* ============================================================ */}
        <div
          style={{
            position: "absolute",
            left: "2150px",
            top: "2350px",
            width: "820px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: "44px",
              borderRadius: "36px",
              background: "rgba(35, 31, 32, 0.98)",
              border: "3px solid #1677FF",
              boxShadow: "0 40px 100px rgba(0, 0, 0, 0.85)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 20px",
                borderRadius: "999px",
                background: "rgba(22, 119, 255, 0.15)",
                border: "1.5px solid #1677FF",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "26px", fontWeight: 800, color: "#1677FF" }}>
                SUSTAINABLE ARCHITECTURE
              </span>
            </div>

            <div style={{ fontSize: "42px", fontWeight: 900, color: "#FAF4D9", marginBottom: "12px" }}>
              The 4 Open Source Business Models
            </div>
            <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.7)", marginBottom: "28px" }}>
              How companies thrive without charging for the basic code:
            </div>

            {/* 4 Quadrants */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ padding: "20px", borderRadius: "18px", background: "rgba(22, 119, 255, 0.08)", border: "1.5px solid rgba(22, 119, 255, 0.3)" }}>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#1677FF", marginBottom: "4px" }}>
                  1. Paid Convenience
                </div>
                <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.75)" }}>
                  Managed hosting, automatic updates, and cloud sync APIs.
                </div>
              </div>

              <div style={{ padding: "20px", borderRadius: "18px", background: "rgba(16, 185, 129, 0.08)", border: "1.5px solid rgba(16, 185, 129, 0.3)" }}>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#10B981", marginBottom: "4px" }}>
                  2. Enterprise Tier
                </div>
                <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.75)" }}>
                  SSO, compliance security, audit trails, and 24/7 SLA.
                </div>
              </div>

              <div style={{ padding: "20px", borderRadius: "18px", background: "rgba(245, 158, 11, 0.08)", border: "1.5px solid rgba(245, 158, 11, 0.3)" }}>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#F59E0B", marginBottom: "4px" }}>
                  3. Services & Consulting
                </div>
                <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.75)" }}>
                  Custom integrations, pipeline architecture, and training.
                </div>
              </div>

              <div style={{ padding: "20px", borderRadius: "18px", background: "rgba(239, 68, 68, 0.08)", border: "1.5px solid rgba(239, 68, 68, 0.3)" }}>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#EF4444", marginBottom: "4px" }}>
                  4. Capital & Grants
                </div>
                <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.75)" }}>
                  Foundation funding, corporate sponsorships, and donations.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CHAPTER 5: HARDWARE & COMPUTE SHIFT (Position: ~1400, 2900)   */}
        {/* ============================================================ */}
        <div
          style={{
            position: "absolute",
            left: "1400px",
            top: "2850px",
            width: "800px",
            zIndex: 10,
          }}
        >
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
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "6px 18px",
                borderRadius: "999px",
                background: "rgba(245, 158, 11, 0.15)",
                border: "1px solid #F59E0B",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "26px", fontWeight: 800, color: "#F59E0B" }}>
                CAPITAL REALLOCATION
              </span>
            </div>

            <div style={{ fontSize: "40px", fontWeight: 900, color: "#FAF4D9", marginBottom: "16px" }}>
              Value Migrates to Chips & VRAM
            </div>
            <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.75)", lineHeight: 1.45, marginBottom: "26px" }}>
              "If software becomes easier to reproduce, the advantage shifts toward the hardware, computing power, and devices needed to run it."
            </div>

            {/* Aluminum Hardware Vector Illustration */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "30px",
                padding: "24px",
                borderRadius: "20px",
                background: "rgba(0, 0, 0, 0.45)",
                border: "1px solid rgba(250, 244, 217, 0.12)",
              }}
            >
              <div
                style={{
                  width: "200px",
                  height: "85px",
                  borderRadius: "16px",
                  background: "linear-gradient(180deg, #3A3537 0%, #252223 100%)",
                  border: "2px solid #554F52",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: "14px",
                    left: "20px",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#10B981",
                    boxShadow: `0 0 ${10 + ledPulse * 10}px #10B981`,
                  }}
                />
                <span style={{ fontSize: "28px", fontWeight: 800, color: "#FAF4D9" }}>
                  RTX / M4 PRO
                </span>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#10B981", marginBottom: "4px" }}>
                  $0 / Month Software Rent
                </div>
                <div style={{ fontSize: "26px", color: "rgba(250, 244, 217, 0.7)" }}>
                  Invest in permanent compute rather than endless monthly subscriptions.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CHAPTER 6: THE FINAL PARADIGM (Overview Stamp)                */}
        {/* ============================================================ */}
        <div
          style={{
            position: "absolute",
            left: "2250px",
            top: "3300px",
            width: "800px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: "44px",
              borderRadius: "36px",
              background: "rgba(35, 31, 32, 0.98)",
              border: "3px solid #10B981",
              boxShadow: "0 40px 100px rgba(0, 0, 0, 0.9)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "26px", fontWeight: 800, color: "#10B981", letterSpacing: "0.08em", marginBottom: "12px" }}>
              THE NEW PARADIGM
            </div>
            <div style={{ fontSize: "44px", fontWeight: 900, color: "#FAF4D9", lineHeight: 1.25, marginBottom: "18px" }}>
              "Paying for software becomes a choice rather than a requirement."
            </div>
            <div style={{ fontSize: "28px", color: "rgba(250, 244, 217, 0.8)", marginBottom: "24px" }}>
              Subscribe to VantaBrief • Let me know what you think in the comments.
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
