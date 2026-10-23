import React, { useMemo, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

// Load Montserrat with ExtraBold (800) and Medium (500)
const { fontFamily } = loadFont("normal", {
  weights: ["500", "800"],
  subsets: ["latin"],
});

// ==================== EDITABLE DATA ====================
export const CONFIG = {
  colors: {
    background: "#0A0A0C",
    radialGlow: "#E8505B",
    buttonGradStart: "#FF7A84",
    buttonGradEnd: "#E04652",
    buttonGlow: "#E8505B",
    ringStroke: "rgba(255, 255, 255, 0.9)",
    pillGradStart: "#FFFFFF",
    pillGradEnd: "#D9D9DC",
    pillTextColor: "#2A2A2E",
    iconTileGradStart: "#F2636E",
    iconTileGradEnd: "#D94550",
    subtitleColor: "#FF9AA2",
  },
  rings: {
    radii: [260, 400, 540],
    speeds: [18, -12, 8], // deg/s
    startAngles: [200, 330, 110], // deg
  },
  title: {
    main: "HENA VANTA",
    sub: "Learn AI & everything in between",
    y: 960,
  },
  pills: [
    {
      id: "ai-tools",
      text: "AI Tools",
      icon: "robot" as const,
      ringIndex: 0,
      angle: -20, // deg (right of button, left edge touches ring)
      startSecond: 2.4,
    },
    {
      id: "automation",
      text: "Automation",
      icon: "workflow" as const,
      ringIndex: 1,
      angle: 55, // deg (lower right, left edge touches ring)
      startSecond: 3.4,
    },
    {
      id: "tech-skills",
      text: "Tech Skills",
      icon: "code" as const,
      ringIndex: 2,
      angle: 125, // deg (lower left, right edge touches ring)
      startSecond: 4.4,
    },
  ],
};

// Inline SVG Line Icons (stroke 4px, white, no external library)
const RenderIcon: React.FC<{ type: "robot" | "workflow" | "code" }> = ({
  type,
}) => {
  if (type === "robot") {
    return (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Antenna */}
        <line x1="24" y1="4" x2="24" y2="10" />
        <circle cx="24" cy="4" r="1.5" fill="#FFFFFF" />
        {/* Head */}
        <rect x="9" y="10" width="30" height="26" rx="6" />
        {/* Eyes */}
        <circle cx="18" cy="21" r="2.5" fill="#FFFFFF" />
        <circle cx="30" cy="21" r="2.5" fill="#FFFFFF" />
        {/* Mouth */}
        <line x1="17" y1="29" x2="31" y2="29" />
        {/* Ears */}
        <line x1="6" y1="21" x2="9" y2="21" />
        <line x1="39" y1="21" x2="42" y2="21" />
      </svg>
    );
  }

  if (type === "workflow") {
    return (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Gear / automation nodes */}
        <circle cx="16" cy="16" r="6" />
        <circle cx="32" cy="16" r="6" />
        <circle cx="24" cy="34" r="6" />
        <path d="M 22 16 L 26 16" />
        <path d="M 19 21 L 22 29" />
        <path d="M 29 21 L 26 29" />
      </svg>
    );
  }

  // Code brackets < / >
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 17 14 L 8 24 L 17 34" />
      <path d="M 31 14 L 40 24 L 31 34" />
      <line x1="27" y1="12" x2="21" y2="36" />
    </svg>
  );
};

export const HenaVantaOrbit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const [logoFailed, setLogoFailed] = useState(false);

  const centerX = width / 2; // 960
  const centerY = height / 2; // 540

  // 1. TIMING & ENTRANCES
  // Background grid & glow entrance: 0.0 - 0.8s (frames 0 to 24)
  const bgEntrance = interpolate(frame, [0, 24], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Background grid drift: 10px per second diagonally
  const gridDrift = ((frame / fps) * 10) % 80;

  // Pulsing soft radial glow behind center button (4s cycle, opacity 0.20 to 0.30)
  const pulseAngle = (frame / fps) * ((2 * Math.PI) / 4);
  const glowOpacity =
    interpolate(Math.sin(pulseAngle), [-1, 1], [0.2, 0.3], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * bgEntrance;

  // Center button scale: 0.4 - 1.2s (frames 12 to 36) with spring (slight overshoot)
  const buttonSpring = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: {
      damping: 11,
      mass: 0.6,
      stiffness: 120,
      overshootClamping: false,
    },
  });
  const buttonScale = frame >= 12 ? buttonSpring : 0;

  // Logo / text fade in at 0.8s (frame 24)
  const logoOpacity = interpolate(frame, [24, 36], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Orbit rings draw in one by one (1.0 - 2.4s, frames 30 to 72, 0.3s = 9 frames stagger)
  const ringStarts = [30, 39, 48]; // frames
  const ringDrawDurations = [20, 22, 24]; // frames

  // Camera push-in towards "Tech Skills" pill: 6.5s - 8.5s (frames 195 to 255)
  // Zoom scale 1 to 2.2, translate so the pill ends up centered-left
  // Hold from 8.5s - 10.0s (frames 255 to 300)
  const camProgress = interpolate(frame, [195, 255], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const cameraScale = interpolate(camProgress, [0, 1], [1, 2.2]);

  // Target coordinates for Tech Skills pill:
  // Outer ring R=540, angle 125 deg
  const techAngleRad = (125 * Math.PI) / 180;
  const techRingX = centerX + CONFIG.rings.radii[2] * Math.cos(techAngleRad);
  const techRingY = centerY + CONFIG.rings.radii[2] * Math.sin(techAngleRad);
  // Tech Skills right edge touches (techRingX, techRingY), width is approx 410px
  const techPillCenterX = techRingX - 205;
  const techPillCenterY = techRingY;

  // We want techPillCenter to land comfortably framed at center-left in screen coordinates
  const targetScreenX = 580;
  const targetScreenY = 540;
  const maxCamTranslateX = targetScreenX - techPillCenterX * 2.2;
  const maxCamTranslateY = targetScreenY - techPillCenterY * 2.2;

  const cameraTranslateX = interpolate(
    camProgress,
    [0, 1],
    [0, maxCamTranslateX]
  );
  const cameraTranslateY = interpolate(
    camProgress,
    [0, 1],
    [0, maxCamTranslateY]
  );

  // Title entrance: 5.2 - 6.0s (frames 156 to 180), subtitle 0.2s later (frame 162)
  // Title fades out during camera zoom (frames 195 to 215)
  const titleZoomFade = interpolate(frame, [195, 215], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleMainOpacity =
    interpolate(frame, [156, 178], [0, 1], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    }) * titleZoomFade;
  const titleMainRise = interpolate(frame, [156, 180], [25, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const titleSubOpacity =
    interpolate(frame, [162, 184], [0, 1], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    }) * titleZoomFade;
  const titleSubRise = interpolate(frame, [162, 186], [25, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Calculate rings parameters
  const ringsData = useMemo(() => {
    return CONFIG.rings.radii.map((radius, i) => {
      const circ = 2 * Math.PI * radius;
      return { radius, circ, index: i };
    });
  }, []);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: CONFIG.colors.background,
        overflow: "hidden",
        fontFamily,
      }}
    >
      {/* 1. BACKGROUND GRID (Square grid lines, 80px, 1px, 6% opacity, drifting diagonally) */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: bgEntrance,
          pointerEvents: "none",
        }}
      >
        <defs>
          <pattern
            id="grid-drift"
            x={gridDrift}
            y={gridDrift}
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-drift)" />
      </svg>

      {/* 2. SOFT RADIAL RED GLOW BEHIND CENTER BUTTON */}
      <div
        style={{
          position: "absolute",
          left: centerX - 700,
          top: centerY - 700,
          width: 1400,
          height: 1400,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(232, 80, 91, ${glowOpacity}) 0%, rgba(232, 80, 91, ${glowOpacity * 0.4}) 45%, rgba(232, 80, 91, 0) 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* 3. MAIN CAMERA CONTAINER (transforms scale 1 to 2.2 and translates toward Tech Skills pill) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 1080,
          transformOrigin: "0px 0px",
          transform: `translate(${cameraTranslateX}px, ${cameraTranslateY}px) scale(${cameraScale})`,
          willChange: "transform",
        }}
      >
        {/* ORBIT RINGS & TRAVELING DOTS SVG LAYER */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: 1920,
            height: 1080,
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          <defs>
            <filter
              id="dot-glow"
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
            >
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Render 3 Concentric Orbit Rings */}
          {ringsData.map(({ radius, circ, index }) => {
            const startF = ringStarts[index];
            const durF = ringDrawDurations[index];
            const drawProgress = interpolate(
              frame,
              [startF, startF + durF],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }
            );

            const dashoffset = circ * (1 - drawProgress);

            // Orbit traveling dot
            const speed = CONFIG.rings.speeds[index];
            const startDeg = CONFIG.rings.startAngles[index];
            const currentDeg = startDeg + speed * (frame / fps);
            const currentRad = (currentDeg * Math.PI) / 180;
            const dotX = centerX + radius * Math.cos(currentRad);
            const dotY = centerY + radius * Math.sin(currentRad);

            // Dot fades in as each ring finishes drawing
            const dotOpacity = interpolate(
              frame,
              [startF + durF - 6, startF + durF + 2],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

            return (
              <g key={`ring-${index}`}>
                {/* Concentric Circle Line */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={radius}
                  fill="none"
                  stroke={CONFIG.colors.ringStroke}
                  strokeWidth="2.5"
                  strokeDasharray={`${circ} ${circ}`}
                  strokeDashoffset={dashoffset}
                  transform={`rotate(-90 ${centerX} ${centerY})`}
                />

                {/* Traveling Glowing White Dot (22px diameter) */}
                {dotOpacity > 0 && (
                  <g
                    transform={`translate(${dotX}, ${dotY})`}
                    opacity={dotOpacity}
                  >
                    {/* Ambient white halo */}
                    <circle
                      r="14"
                      fill="rgba(255, 255, 255, 0.55)"
                      filter="url(#dot-glow)"
                    />
                    {/* Core crisp white dot */}
                    <circle r="11" fill="#FFFFFF" />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* 4. CENTER BUTTON: Glossy 3D Puffy Circle (300px diameter) */}
        <div
          style={{
            position: "absolute",
            left: centerX - 150,
            top: centerY - 150,
            width: 300,
            height: 300,
            borderRadius: "50%",
            transform: `scale(${buttonScale})`,
            transformOrigin: "center center",
            background: `linear-gradient(135deg, ${CONFIG.colors.buttonGradStart} 0%, ${CONFIG.colors.buttonGradEnd} 100%)`,
            boxShadow: `
              inset 7px 7px 18px rgba(255, 255, 255, 0.45),
              inset -7px -7px 20px rgba(170, 30, 40, 0.55),
              0 0 60px ${CONFIG.colors.buttonGlow},
              0 20px 45px rgba(0, 0, 0, 0.6)
            `,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          {/* Top-Left Glossy Specular Highlight Sheen */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 32% 24%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 52%)",
              pointerEvents: "none",
            }}
          />

          {/* Logo inside: staticFile("logo.png") 150px wide, or fallback white text "HV" */}
          <div
            style={{
              opacity: logoOpacity,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!logoFailed ? (
              <Img
                src={staticFile("logo.png")}
                onError={() => setLogoFailed(true)}
                style={{
                  width: 150,
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            ) : null}

            {logoFailed && (
              <span
                style={{
                  fontFamily,
                  fontWeight: 800,
                  fontSize: 110,
                  color: "#FFFFFF",
                  letterSpacing: "0.02em",
                  lineHeight: 1,
                  userSelect: "none",
                  filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))",
                }}
              >
                HV
              </span>
            )}
          </div>
        </div>

        {/* 5. LABEL PILLS (3, positioned tangent to each ring) */}
        {CONFIG.pills.map((pill) => {
          const ringRadius = CONFIG.rings.radii[pill.ringIndex];
          const angleRad = (pill.angle * Math.PI) / 180;
          const touchX = centerX + ringRadius * Math.cos(angleRad);
          const touchY = centerY + ringRadius * Math.sin(angleRad);

          // Pop-in animation timing:
          const startFrame = Math.round(pill.startSecond * fps);
          const framesSinceStart = frame - startFrame;
          const isStarted = framesSinceStart >= 0;

          // Snappy spring with slight overshoot
          const pillSpring = spring({
            frame: Math.max(0, framesSinceStart),
            fps,
            config: {
              damping: 12,
              mass: 0.5,
              stiffness: 140,
              overshootClamping: false,
            },
          });

          const scale = isStarted
            ? interpolate(pillSpring, [0, 1], [0.7, 1])
            : 0;
          const opacity = isStarted
            ? interpolate(framesSinceStart, [0, 6], [0, 1], {
                extrapolateRight: "clamp",
              })
            : 0;

          // Icon tile tiny rotate-in (-10 deg to 0)
          const iconRotation = interpolate(pillSpring, [0, 1], [-10, 0]);

          if (!isStarted && opacity <= 0) {
            return null;
          }

          // Alignment rule: left or right edge touches the ring line
          // For pills on the right side of center (angle -20 deg, 55 deg): left edge touches ring -> translate(0%, -50%)
          // For pills on the left side of center (angle 125 deg): right edge touches ring -> translate(-100%, -50%)
          const isLeftSide = pill.angle > 90 && pill.angle < 270;
          const translateAlignment = isLeftSide
            ? "translate(-100%, -50%)"
            : "translate(0%, -50%)";

          return (
            <div
              key={pill.id}
              style={{
                position: "absolute",
                left: touchX,
                top: touchY,
                transform: `${translateAlignment} scale(${scale})`,
                transformOrigin: isLeftSide ? "right center" : "left center",
                opacity,
                height: 100,
                borderRadius: 14,
                background: `linear-gradient(90deg, ${CONFIG.colors.pillGradStart} 0%, ${CONFIG.colors.pillGradEnd} 100%)`,
                boxShadow:
                  "0 14px 34px rgba(0, 0, 0, 0.45), 0 4px 10px rgba(0, 0, 0, 0.25)",
                display: "inline-flex",
                alignItems: "center",
                padding: "6px 42px 6px 6px",
                zIndex: 15,
                whiteSpace: "nowrap",
              }}
            >
              {/* Coral Rounded-Square Icon Tile (88x88, radius 12) */}
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${CONFIG.colors.iconTileGradStart} 0%, ${CONFIG.colors.iconTileGradEnd} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 28,
                  transform: `rotate(${iconRotation}deg)`,
                  boxShadow:
                    "inset 0 1px 2px rgba(255, 255, 255, 0.4), 0 4px 10px rgba(0, 0, 0, 0.2)",
                  flexShrink: 0,
                }}
              >
                <RenderIcon type={pill.icon} />
              </div>

              {/* Pill Text in Montserrat ExtraBold 46px */}
              <span
                style={{
                  fontFamily,
                  fontWeight: 800,
                  fontSize: 46,
                  color: CONFIG.colors.pillTextColor,
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                }}
              >
                {pill.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* 6. FAINT VIGNETTE DARKENING EDGES */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, transparent 45%, rgba(0, 0, 0, 0.65) 100%)",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />

      {/* 7. TITLE (lower area of the screen, centered, y = 960px) */}
      <div
        style={{
          position: "absolute",
          top: CONFIG.title.y - 25,
          left: 0,
          width: 1920,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 25,
          pointerEvents: "none",
        }}
      >
        {/* Main Title: "HENA VANTA" in Montserrat ExtraBold 64px, letter-spacing 0.2em */}
        <h1
          style={{
            margin: 0,
            fontFamily,
            fontWeight: 800,
            fontSize: 64,
            letterSpacing: "0.2em",
            color: "#FFFFFF",
            opacity: titleMainOpacity,
            transform: `translateY(${titleMainRise}px)`,
            textShadow:
              "0 4px 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(232, 80, 91, 0.3)",
          }}
        >
          {CONFIG.title.main}
        </h1>

        {/* Subtitle: "Learn AI & everything in between" in Montserrat Medium 30px, #FF9AA2 */}
        <p
          style={{
            margin: "12px 0 0 0",
            fontFamily,
            fontWeight: 500,
            fontSize: 30,
            letterSpacing: "0.02em",
            color: CONFIG.colors.subtitleColor,
            opacity: titleSubOpacity,
            transform: `translateY(${titleSubRise}px)`,
            textShadow: "0 2px 12px rgba(0, 0, 0, 0.8)",
          }}
        >
          {CONFIG.title.sub}
        </p>
      </div>
    </AbsoluteFill>
  );
};
