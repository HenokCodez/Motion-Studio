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
import { Camera, CameraWaypoint } from "./components/Camera";
import { SketchBox } from "./components/SketchBox";
import { SketchArrow } from "./components/SketchArrow";
import { Marker } from "./components/Marker";
import { Mascot } from "./components/Mascot";
import { Logo } from "./components/Logo";
import { Shot } from "./components/Shot";
import { Terminal } from "./components/Terminal";
import { CountUp } from "./components/CountUp";

export const WhiteboardExplainer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // -------------------------------------------------------------------------
  // Snappy Camera Waypoints (moves every beat change: 12-18 frames easeOutExpo)
  // -------------------------------------------------------------------------
  const waypoints: CameraWaypoint[] = [
    // Cluster 1: The 2026 Shift
    { frame: 0, x: 520, y: 320, zoom: 1.35 },
    { frame: 120, x: 420, y: 320, zoom: 1.3 },
    { frame: 450, x: 220, y: 280, zoom: 1.45 }, // Zoom in on ArtCraft
    { frame: 680, x: 80, y: 240, zoom: 1.4 },   // Photoshop & Premiere
    { frame: 950, x: 140, y: 220, zoom: 1.35 },
    { frame: 1200, x: -80, y: 180, zoom: 1.5 },  // "Who makes money?" query
    // Cluster 2: The Software Toll vs FOSS
    { frame: 1380, x: -550, y: 340, zoom: 1.3 },
    { frame: 1750, x: -680, y: 320, zoom: 1.4 },  // DaVinci & Blender screenshots
    { frame: 2200, x: -750, y: 260, zoom: 1.5 },  // 90% threshold punch-in
    // Cluster 3: Open Weights & Models
    { frame: 2712, x: -920, y: -220, zoom: 1.35 },
    { frame: 3100, x: -1050, y: -260, zoom: 1.5 }, // Kokoro & Krea punch-in
    { frame: 3600, x: -980, y: -200, zoom: 1.4 },  // Terminal command
    // Cluster 4: The 4 Monetization Blueprints
    { frame: 4134, x: -120, y: -450, zoom: 1.2 },
    { frame: 4650, x: 180, y: -420, zoom: 1.35 },  // Enterprise & Services
    { frame: 5200, x: -80, y: -460, zoom: 1.25 },  // Capital & Grants
    // Cluster 5: Hardware & VRAM Migration
    { frame: 5736, x: 620, y: -780, zoom: 1.35 },
    { frame: 6200, x: 540, y: -820, zoom: 1.5 },   // Hardware vector & price scale
    // Cluster 6: Master Whiteboard Overview
    { frame: 6828, x: 0, y: -160, zoom: 0.62 },    // Pull back to entire canvas
    { frame: 7400, x: 0, y: -160, zoom: 0.60 },
  ];

  // Mascot pose choreography based on narrative beats
  let mascotPose: "idle" | "pointing" | "thinking" | "shrugging" | "celebrating" = "idle";
  let mascotX = 680;
  let mascotY = 480;

  if (frame < 120) {
    mascotPose = "pointing";
    mascotX = 480;
    mascotY = 460;
  } else if (frame < 450) {
    mascotPose = "thinking";
    mascotX = 540;
    mascotY = 480;
  } else if (frame < 750) {
    mascotPose = "pointing";
    mascotX = 780;
    mascotY = 520;
  } else if (frame < 1200) {
    mascotPose = "pointing";
    mascotX = 920;
    mascotY = 460;
  } else if (frame < 1380) {
    mascotPose = "shrugging"; // "Who's actually making money?"
    mascotX = 1120;
    mascotY = 580;
  } else if (frame < 2200) {
    mascotPose = "celebrating"; // Blender & DaVinci Hollywood quality
    mascotX = 1840;
    mascotY = 480;
  } else if (frame < 2712) {
    mascotPose = "pointing"; // 90% threshold
    mascotX = 2050;
    mascotY = 520;
  } else if (frame < 3600) {
    mascotPose = "pointing"; // Kokoro & Krea
    mascotX = 2280;
    mascotY = 1120;
  } else if (frame < 4134) {
    mascotPose = "thinking";
    mascotX = 2380;
    mascotY = 1180;
  } else if (frame < 5736) {
    mascotPose = "pointing"; // 4 business models
    mascotX = 1420;
    mascotY = 1350;
  } else if (frame < 6828) {
    mascotPose = "pointing"; // Hardware shift
    mascotX = 720;
    mascotY = 1850;
  } else {
    mascotPose = "celebrating"; // Final thesis
    mascotX = 1380;
    mascotY = 1250;
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#111111", // Strict near-black canvas
        overflow: "hidden",
      }}
    >
      {/* 1. Global Font Styles (Self-hosted Virgil handwriting + Inter + JetBrains Mono) */}
      <style>{`
        @font-face {
          font-family: 'Virgil';
          src: url('/fonts/virgil.woff2') format('woff2');
          font-weight: normal;
          font-style: normal;
        }
      `}</style>

      {/* 2. Audio Voiceover Track */}
      <Audio src={staticFile("audio/003/audio.mp3")} />

      {/* 3. Very faint technical dot grid (dots ~#1c1c1c, ~32px spacing) */}
      <div
        style={{
          position: "absolute",
          inset: "-2000px",
          backgroundImage: `
            radial-gradient(circle, #1C1C1C 1.5px, transparent 1.5px)
          `,
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      {/* 4. Snappy Camera Rig */}
      <Camera waypoints={waypoints}>
        {/* ============================================================ */}
        {/* SVG CONNECTOR ARROW LAYER (Draws with stroke-dashoffset)     */}
        {/* ============================================================ */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "4500px",
            height: "3500px",
            pointerEvents: "none",
            zIndex: 15,
          }}
        >
          {/* Arrow 1: 2026 Wordmark -> ArtCraft Card */}
          {frame >= 350 && (
            <SketchArrow
              startFrame={350}
              d="M 520 420 C 620 420, 680 380, 760 380"
              headX={760}
              headY={380}
              angleDeg={0}
              length={300}
              important={true}
            />
          )}

          {/* Arrow 2: ArtCraft -> Photoshop/Premiere fork */}
          {frame >= 600 && (
            <>
              <SketchArrow
                startFrame={600}
                d="M 1080 340 C 1140 310, 1180 270, 1240 260"
                headX={1240}
                headY={260}
                angleDeg={-10}
                length={220}
                important={false}
              />
              <SketchArrow
                startFrame={620}
                d="M 1080 390 C 1140 410, 1180 440, 1240 450"
                headX={1240}
                headY={450}
                angleDeg={10}
                length={220}
                important={false}
              />
            </>
          )}

          {/* Arrow 3: Ch 1 -> Ch 2 (SaaS Toll Stack) */}
          {frame >= 1340 && (
            <SketchArrow
              startFrame={1340}
              d="M 1080 520 C 1250 590, 1420 540, 1560 480"
              headX={1560}
              headY={480}
              angleDeg={-25}
              length={550}
              important={true}
            />
          )}

          {/* Arrow 4: Ch 2 -> Ch 3 (Model Weights Revolution) */}
          {frame >= 2680 && (
            <SketchArrow
              startFrame={2680}
              d="M 1880 720 C 1980 850, 1980 980, 1880 1100"
              headX={1880}
              headY={1100}
              angleDeg={125}
              length={480}
              important={true}
            />
          )}

          {/* Arrow 5: Ch 3 -> Ch 4 (4 Monetization Blueprints) */}
          {frame >= 4100 && (
            <SketchArrow
              startFrame={4100}
              d="M 1520 1250 C 1350 1350, 1280 1320, 1150 1320"
              headX={1150}
              headY={1320}
              angleDeg={180}
              length={450}
              important={true}
            />
          )}

          {/* Arrow 6: Ch 4 -> Ch 5 (Hardware & Chips Shift) */}
          {frame >= 5700 && (
            <SketchArrow
              startFrame={5700}
              d="M 950 1520 C 820 1620, 750 1680, 640 1740"
              headX={640}
              headY={1740}
              angleDeg={150}
              length={420}
              important={true}
            />
          )}
        </svg>

        {/* ============================================================ */}
        {/* CLUSTER 1: THE 2026 SHIFT (Position: ~200 - 1300, 200 - 650) */}
        {/* ============================================================ */}

        {/* Title Wordmark: "2026" (140px) */}
        <div
          style={{
            position: "absolute",
            left: "140px",
            top: "220px",
            zIndex: 20,
          }}
        >
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: "130px", // 120-180px per spec
              color: "#EDEDED",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            <Marker startFrame={10} color="#FF6B35">
              2026
            </Marker>
          </div>
          <div
            style={{
              fontFamily: "'Virgil', sans-serif",
              fontSize: "46px", // Min 40px
              color: "#BDBDBD",
              marginTop: "16px",
            }}
          >
            The Zero-Subscription Shift
          </div>
        </div>

        {/* Capabilities Card */}
        {frame >= 80 && (
          <SketchBox
            startFrame={80}
            x={140}
            y={420}
            width={400}
            height={220}
            title="Full Local Stack"
            subtitle="Video • 3D • Code • Local AI"
            important={false}
          />
        )}

        {/* ArtCraft Suite Screenshot Card */}
        {frame >= 400 && (
          <div style={{ position: "absolute", left: "760px", top: "240px", zIndex: 22 }}>
            <Shot
              startFrame={400}
              src="screenshots/artcraft_repo.png"
              x={0}
              y={0}
              width={340}
              height={220}
              caption="ArtCraft / FOSS Suite"
              highlightLineY={80}
            />
            {/* Real GitHub Logo */}
            <Logo startFrame={420} name="logos/github.svg" x={240} y={-30} size={70} />
          </div>
        )}

        {/* Proprietary Target Nodes (Photoshop, Premiere, After Effects) */}
        {frame >= 620 && (
          <div style={{ position: "absolute", left: "1240px", top: "180px", zIndex: 20 }}>
            {/* Photoshop Target */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <Logo startFrame={620} name="logos/photoshop.svg" x={0} y={0} size={76} />
              <div style={{ fontFamily: "'Virgil', sans-serif", fontSize: "42px", color: "#EDEDED", marginLeft: "90px" }}>
                Photoshop
              </div>
            </div>

            {/* Premiere Target */}
            {frame >= 680 && (
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <Logo startFrame={680} name="logos/premiere.svg" x={0} y={80} size={76} />
                <div style={{ fontFamily: "'Virgil', sans-serif", fontSize: "42px", color: "#EDEDED", marginLeft: "90px", marginTop: "80px" }}>
                  Premiere Pro
                </div>
              </div>
            )}

            {/* After Effects Target */}
            {frame >= 740 && (
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <Logo startFrame={740} name="logos/aftereffects.svg" x={0} y={160} size={76} />
                <div style={{ fontFamily: "'Virgil', sans-serif", fontSize: "42px", color: "#EDEDED", marginLeft: "90px", marginTop: "160px" }}>
                  After Effects
                </div>
              </div>
            )}
          </div>
        )}

        {/* Central Question Card: "Who makes money?" */}
        {frame >= 1150 && (
          <SketchBox
            startFrame={1150}
            x={920}
            y={520}
            width={480}
            height={180}
            title="Who Makes Money?"
            subtitle="If the software is free to download..."
            important={true} // Rust-brown fill + orange stroke
            isActive={frame >= 1150 && frame < 1380}
          />
        )}

        {/* ============================================================ */}
        {/* CLUSTER 2: SAAS TOLL VS FOSS (Position: ~1550 - 2400)         */}
        {/* ============================================================ */}

        {/* Adobe Toll Card ($600+/yr) */}
        {frame >= 1400 && (
          <SketchBox
            startFrame={1400}
            x={1560}
            y={240}
            width={440}
            height={200}
            title="The Software Toll"
            subtitle="Mandatory monthly subscriptions"
            important={false}
          >
            <div style={{ marginTop: "10px" }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "44px", fontWeight: 900, color: "#FF6B35" }}>
                $600+ / yr
              </span>
            </div>
          </SketchBox>
        )}

        {/* Free Stack: DaVinci + Blender Screenshots */}
        {frame >= 1650 && (
          <div style={{ position: "absolute", left: "2060px", top: "200px", zIndex: 22 }}>
            <Shot
              startFrame={1650}
              src="screenshots/davinci_ui.png"
              x={0}
              y={0}
              width={340}
              height={200}
              caption="DaVinci Resolve"
            />
            <Logo startFrame={1660} name="logos/davinci.svg" x={260} y={-24} size={68} />

            {frame >= 1800 && (
              <>
                <Shot
                  startFrame={1800}
                  src="screenshots/blender_ui.png"
                  x={0}
                  y={230}
                  width={340}
                  height={200}
                  caption="Blender 3D"
                />
                <Logo startFrame={1810} name="logos/blender.svg" x={260} y={206} size={68} />
              </>
            )}
          </div>
        )}

        {/* 90% Threshold Stat Card */}
        {frame >= 2150 && (
          <SketchBox
            startFrame={2150}
            x={1560}
            y={480}
            width={460}
            height={220}
            important={true}
            isActive={frame >= 2150 && frame < 2700}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <CountUp startFrame={2160} from={0} to={90} suffix="%" fontSize={100} color="#FF6B35" />
              <span style={{ fontFamily: "'Virgil', sans-serif", fontSize: "42px", color: "#EDEDED" }}>
                Utility Reached
              </span>
            </div>
            <div style={{ fontFamily: "'Virgil', sans-serif", fontSize: "36px", color: "#BDBDBD", marginTop: "6px" }}>
              Paying for subscriptions becomes <Marker startFrame={2220}>nonsense</Marker>.
            </div>
          </SketchBox>
        )}

        {/* ============================================================ */}
        {/* CLUSTER 3: OPEN WEIGHTS REVOLUTION (Position: ~1800 - 2500, Y: 1000) */}
        {/* ============================================================ */}

        {/* Open Models Hub */}
        {frame >= 2750 && (
          <SketchBox
            startFrame={2750}
            x={1840}
            y={980}
            width={480}
            height={200}
            title="Open Weights Era"
            subtitle="Speech • Diffusion • Vision • LLMs"
            important={false}
          />
        )}

        {/* Kokoro & Krea Real Screenshots */}
        {frame >= 3050 && (
          <div style={{ position: "absolute", left: "2380px", top: "940px", zIndex: 22 }}>
            <Shot
              startFrame={3050}
              src="screenshots/kokoro_repo.png"
              x={0}
              y={0}
              width={340}
              height={200}
              caption="Kokoro TTS (Open)"
            />
            {frame >= 3250 && (
              <Shot
                startFrame={3250}
                src="screenshots/krea_ai.png"
                x={0}
                y={230}
                width={340}
                height={200}
                caption="Krea AI Models"
              />
            )}
          </div>
        )}

        {/* Terminal Window with Local Execution Command */}
        {frame >= 3550 && (
          <Terminal
            startFrame={3550}
            x={1840}
            y={1220}
            width={500}
            command="ollama run kokoro"
            outputLines={[
              "✓ 82M Speech Model [LOADED]",
              "✓ 100% On-Device execution",
            ]}
          />
        )}

        {/* ============================================================ */}
        {/* CLUSTER 4: 4 MONETIZATION BLUEPRINTS (Center: ~600 - 1400, Y: 1300) */}
        {/* ============================================================ */}

        {/* Center Title */}
        {frame >= 4150 && (
          <div style={{ position: "absolute", left: "700px", top: "1180px", zIndex: 20 }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "56px", color: "#EDEDED" }}>
              How FOSS Makes Money
            </div>
            <div style={{ fontFamily: "'Virgil', sans-serif", fontSize: "40px", color: "#FF6B35" }}>
              4 Sustainable Architecture Blueprints
            </div>
          </div>
        )}

        {/* Quadrant 1: Paid Convenience */}
        {frame >= 4300 && (
          <SketchBox
            startFrame={4300}
            x={640}
            y={1280}
            width={380}
            height={180}
            title="1. Convenience"
            subtitle="Cloud hosting & sync APIs"
            important={frame >= 4300 && frame < 4600}
          />
        )}

        {/* Quadrant 2: Enterprise Tier */}
        {frame >= 4600 && (
          <SketchBox
            startFrame={4600}
            x={1060}
            y={1280}
            width={380}
            height={180}
            title="2. Enterprise Tier"
            subtitle="SSO, security, audit & SLA"
            important={frame >= 4600 && frame < 4900}
          />
        )}

        {/* Quadrant 3: Services & Consulting */}
        {frame >= 4900 && (
          <SketchBox
            startFrame={4900}
            x={640}
            y={1490}
            width={380}
            height={180}
            title="3. Services"
            subtitle="Custom integrations & pipelines"
            important={frame >= 4900 && frame < 5200}
          />
        )}

        {/* Quadrant 4: Capital & Grants */}
        {frame >= 5200 && (
          <SketchBox
            startFrame={5200}
            x={1060}
            y={1490}
            width={380}
            height={180}
            title="4. Grants & Backers"
            subtitle="Foundation & corporate funding"
            important={frame >= 5200 && frame < 5600}
          />
        )}

        {/* ============================================================ */}
        {/* CLUSTER 5: HARDWARE & VRAM MIGRATION (Position: ~100 - 800, Y: 1750) */}
        {/* ============================================================ */}

        {frame >= 5750 && (
          <SketchBox
            startFrame={5750}
            x={180}
            y={1750}
            width={520}
            height={240}
            title="Value Shifts to Hardware"
            subtitle="Code reproduction cost approaches $0"
            important={true}
            isActive={frame >= 5750 && frame < 6700}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "14px" }}>
              <Logo startFrame={5800} name="logos/apple.svg" x={0} y={0} size={64} />
              <Logo startFrame={5820} name="logos/nvidia.svg" x={80} y={0} size={64} />
              <div style={{ marginLeft: "160px", fontFamily: "'Inter', sans-serif", fontSize: "36px", fontWeight: 800, color: "#EDEDED" }}>
                VRAM & Chips
              </div>
            </div>
          </SketchBox>
        )}

        {/* Hardware Value Comparison Card */}
        {frame >= 6100 && (
          <SketchBox
            startFrame={6100}
            x={740}
            y={1750}
            width={440}
            height={240}
            title="Permanent Asset"
            subtitle="Own the compute, free the software"
            important={false}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "10px" }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "38px", fontWeight: 900, color: "#FF6B35" }}>
                $0 / mo SaaS Rent
              </div>
              <div style={{ fontFamily: "'Virgil', sans-serif", fontSize: "34px", color: "#BDBDBD" }}>
                100% on-device autonomy
              </div>
            </div>
          </SketchBox>
        )}

        {/* ============================================================ */}
        {/* CLUSTER 6: MASTER OVERVIEW & VERDICT (Center ~700, Y: 850)    */}
        {/* ============================================================ */}

        {frame >= 6850 && (
          <SketchBox
            startFrame={6850}
            x={700}
            y={780}
            width={680}
            height={260}
            title="Software Becomes a Choice"
            subtitle="Rather than a mandatory requirement."
            important={true}
            isActive={true}
          >
            <div style={{ fontFamily: "'Virgil', sans-serif", fontSize: "40px", color: "#EDEDED", marginTop: "14px" }}>
              <Marker startFrame={6950}>Subscribe to VantaBrief</Marker> • Thoughts in comments
            </div>
          </SketchBox>
        )}

        {/* Mascot Character (Sticker Style, dynamically posing next to active beats) */}
        <Mascot pose={mascotPose} x={mascotX} y={mascotY} />
      </Camera>
    </AbsoluteFill>
  );
};
