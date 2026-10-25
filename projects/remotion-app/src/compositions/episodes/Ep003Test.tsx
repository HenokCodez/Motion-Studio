import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

// Official VantaBrief Palette (Single Source of Truth)
const C = {
  bg: "#231F20",           // Charcoal Base Canvas
  bgSubtle: "#2C2728",     // Subtle Secondary
  surface: "#181516",      // Deep Dark Card Surface
  surfaceElevated: "#221E1F",
  cream: "#FAF4D9",        // Warm Cream Primary Text
  creamMuted: "rgba(250, 244, 217, 0.70)",
  blue: "#1677FF",         // Electric Blue (Tech Accent)
  amber: "#F59E0B",        // Amber (Emphasis / Metric / Warning)
  crimson: "#EF4444",      // Crimson (Negative State / Strike)
  emerald: "#10B981",      // Emerald (Positive State / Success)
  border: "rgba(250, 244, 217, 0.18)",
  borderActive: "rgba(22, 119, 255, 0.8)",
};

const FONT_DISPLAY = "'Panton Rust Black Base', 'Inter', system-ui, sans-serif";
const FONT_BODY = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export const Ep003Test: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle breathing background texture
  const gridOpacity = interpolate(frame % 120, [0, 60, 120], [0.04, 0.07, 0.04]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        fontFamily: FONT_BODY,
        color: C.cream,
        overflow: "hidden",
      }}
    >
      {/* Untouched Voiceover Audio: Start from 142.50s (frame 4275 of audio.mp3) */}
      <Audio src={staticFile("audio/voice/audio.mp3")} startFrom={4275} />

      {/* Subtle Technical Canvas Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(250, 244, 217, ${gridOpacity}) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(250, 244, 217, ${gridOpacity}) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }}
      />

      {/* ========================================================
          SHOT 1: Style 1 (Kinetic Typography)
          Narration: "Because here's the thing: making software isn't free, even when downloading it is."
          Frames: 0 – 114 (Exit wipe left 108–114)
          ======================================================== */}
      {frame >= 0 && frame <= 116 && (
        <Shot1 frame={frame} />
      )}

      {/* ========================================================
          SHOT 2: Style 5 (Technical Motion Graphics: Full-Frame Diagram)
          Narration: "Developers still need time, hardware, and money to maintain their projects."
          Frames: 110 – 243 (Entrance 110–116, Build 138–183, Hold 183–243 [>=2s full hold], Collapse 226–243)
          ======================================================== */}
      {frame >= 110 && frame <= 245 && (
        <Shot2 frame={frame} />
      )}

      {/* ========================================================
          SHOT 3: Style 1 (Kinetic Typography: Full-Frame Stack)
          Narration: "And successful open-source businesses have figured out how to make money without charging everyone for the basic software."
          Frames: 226 – 383 (Entrance 226–238, Hold through 376, Directional wipe 376–383)
          ======================================================== */}
      {frame >= 226 && frame <= 385 && (
        <Shot3 frame={frame} />
      )}

      {/* ========================================================
          SHOT 4: Style 2 (Real Evidence / Screen-Led: Cropped & Readable Free/Pro)
          Narration: "The first model is paid convenience. Take an open-source project and let people use it for free. Then charge for hosting, cloud access, automatic updates, or the infrastructure needed to run it."
          Frames: 383 – 660 (Crop zoom to Free + Pro cards, filling 70%+ of frame)
          ======================================================== */}
      {frame >= 383 && frame <= 662 && (
        <Shot4 frame={frame} />
      )}

      {/* ========================================================
          SHOT 5: Style 5 (Technical Motion Graphics: Enriched Enterprise Diagram)
          Narration: "The second is enterprise features and support. A regular user might be happy with the free version. But a company managing thousands of employees may need advanced security, access controls, compliance tools, and someone to call when something breaks."
          Frames: 658 – 1010 (Build complete 948, Hold through 1010 [>=2.0s hold with all 4 nodes], Vertical slide 1005–1012)
          ======================================================== */}
      {frame >= 658 && frame <= 1012 && (
        <Shot5 frame={frame} />
      )}

      {/* ========================================================
          SHOT 6: Style 4 (Graphic Symbols / Icon-Led Beats: Selling Services)
          Narration: "The third is selling services. Companies can build open-source software and then charge for installation, customization, consulting, and maintenance."
          Frames: 1005 – 1205 (Starts at 176.2s, 4 cards activate on their word, hold until 182.68s)
          ======================================================== */}
      {frame >= 1005 && frame <= 1206 && (
        <Shot6 frame={frame} />
      )}

      {/* ========================================================
          SHOT 7: Style 2 (Real Evidence / Screen-Led: Blender Corporate Tiers)
          Narration: "And some projects survive through sponsorships, donations, or funding from companies that depend on them."
          Frames: 1204 – 1360 (Starts strictly at 182.68s, readable tiers, framed dark canvas)
          ======================================================== */}
      {frame >= 1204 && (
        <Shot7 frame={frame} />
      )}
    </AbsoluteFill>
  );
};

// =========================================================================
// SHOT 1: Kinetic Typography (Full-Frame Split Layout)
// =========================================================================
const Shot1: React.FC<{ frame: number }> = ({ frame }) => {
  const enterProgress = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const punchProgress = interpolate(frame, [48, 56], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const payoffProgress = interpolate(frame, [80, 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const exitSlide = interpolate(frame, [108, 114], [0, -1920], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        transform: `translateX(${exitSlide}px)`,
        padding: "0 80px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1680,
          display: "flex",
          flexDirection: "column",
          gap: 36,
        }}
      >
        {/* Top Headline: MAKING SOFTWARE at 140px */}
        <div
          style={{
            fontSize: 140,
            fontWeight: 900,
            fontFamily: FONT_DISPLAY,
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            color: C.cream,
            opacity: enterProgress,
            transform: `translateY(${(1 - enterProgress) * 30}px)`,
          }}
        >
          MAKING SOFTWARE
        </div>

        {/* Punch: ISN'T FREE at 160px Crimson */}
        <div
          style={{
            fontSize: 160,
            fontWeight: 900,
            fontFamily: FONT_DISPLAY,
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            color: C.crimson,
            opacity: punchProgress,
            transform: `translateY(${(1 - punchProgress) * 30}px)`,
            display: "flex",
            alignItems: "center",
            gap: 32,
          }}
        >
          <span>ISN'T FREE</span>
          {punchProgress > 0.5 && (
            <div
              style={{
                height: 12,
                flex: 1,
                backgroundColor: C.crimson,
                borderRadius: 6,
              }}
            />
          )}
        </div>

        {/* Contrast Payoff: DOWNLOADING IT IS: $0 (FREE) at 104px */}
        <div
          style={{
            marginTop: 20,
            opacity: payoffProgress,
            transform: `translateY(${(1 - payoffProgress) * 30}px)`,
            display: "flex",
            alignItems: "center",
            padding: "28px 48px",
            backgroundColor: C.surface,
            border: `4px solid ${C.emerald}`,
            borderRadius: 20,
            boxShadow: `0 16px 40px rgba(0,0,0,0.7), 0 0 35px rgba(16, 185, 129, 0.25)`,
          }}
        >
          <span
            style={{
              fontSize: 104,
              fontWeight: 900,
              fontFamily: FONT_DISPLAY,
              color: C.emerald,
              lineHeight: 1.05,
            }}
          >
            DOWNLOADING IT IS: $0 (FREE)
          </span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// SHOT 2: Technical Motion Graphics (Full-Frame Scaled Diagram: Time, Hardware, Money -> Maintain)
// =========================================================================
const Shot2: React.FC<{ frame: number }> = ({ frame }) => {
  const enterSlide = interpolate(frame, [110, 116], [1920, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const timeProgress = interpolate(frame, [136, 144], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const hwProgress = interpolate(frame, [150, 158], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const moneyProgress = interpolate(frame, [165, 173], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const targetProgress = interpolate(frame, [180, 188], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Hold from frame 188 to 243 (55 frames = 1.83s, plus overlap into f 243)
  const exitScale = interpolate(frame, [226, 243], [1, 0.88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const exitOpacity = interpolate(frame, [226, 243], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        transform: `translateX(${enterSlide}px) scale(${exitScale})`,
        opacity: exitOpacity,
        padding: "0 60px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1680,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* Section Header: 64px, NO tiny mono text */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            fontFamily: FONT_DISPLAY,
            color: C.amber,
            alignSelf: "flex-start",
          }}
        >
          REALITY OF MAINTENANCE
        </div>

        {/* 3 Massive Scaled Input Nodes (TIME / HARDWARE / MONEY) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 36,
            width: "100%",
          }}
        >
          {/* Card 1: TIME (84px label, 80px SVG icon) */}
          <div
            style={{
              backgroundColor: C.surface,
              border: `4px solid ${timeProgress > 0 ? C.amber : C.border}`,
              borderRadius: 24,
              padding: "44px 36px",
              height: 320,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              opacity: timeProgress,
              transform: `translateY(${(1 - timeProgress) * 25}px)`,
              boxShadow: timeProgress > 0.5 ? `0 0 40px rgba(245, 158, 11, 0.25)` : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 44, fontWeight: 900, fontFamily: FONT_DISPLAY, color: C.amber }}>01</span>
              <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2.8">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div style={{ fontSize: 84, fontWeight: 900, fontFamily: FONT_DISPLAY, color: C.cream, lineHeight: 1.0 }}>
              TIME
            </div>
          </div>

          {/* Card 2: HARDWARE (84px label, 80px SVG icon) */}
          <div
            style={{
              backgroundColor: C.surface,
              border: `4px solid ${hwProgress > 0 ? C.blue : C.border}`,
              borderRadius: 24,
              padding: "44px 36px",
              height: 320,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              opacity: hwProgress,
              transform: `translateY(${(1 - hwProgress) * 25}px)`,
              boxShadow: hwProgress > 0.5 ? `0 0 40px rgba(22, 119, 255, 0.25)` : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 44, fontWeight: 900, fontFamily: FONT_DISPLAY, color: C.blue }}>02</span>
              <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2.8">
                <rect x="2" y="2" width="20" height="8" rx="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" />
                <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="4" />
                <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="4" />
              </svg>
            </div>
            <div style={{ fontSize: 84, fontWeight: 900, fontFamily: FONT_DISPLAY, color: C.cream, lineHeight: 1.0 }}>
              HARDWARE
            </div>
          </div>

          {/* Card 3: MONEY (84px label, 80px SVG icon) */}
          <div
            style={{
              backgroundColor: C.surface,
              border: `4px solid ${moneyProgress > 0 ? C.emerald : C.border}`,
              borderRadius: 24,
              padding: "44px 36px",
              height: 320,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              opacity: moneyProgress,
              transform: `translateY(${(1 - moneyProgress) * 25}px)`,
              boxShadow: moneyProgress > 0.5 ? `0 0 40px rgba(16, 185, 129, 0.25)` : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 44, fontWeight: 900, fontFamily: FONT_DISPLAY, color: C.emerald }}>03</span>
              <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke={C.emerald} strokeWidth="2.8">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div style={{ fontSize: 84, fontWeight: 900, fontFamily: FONT_DISPLAY, color: C.cream, lineHeight: 1.0 }}>
              MONEY
            </div>
          </div>
        </div>

        {/* Large Prominent Directed Connectors */}
        <div style={{ display: "flex", justifyContent: "center", gap: 420, width: "100%", margin: "-8px 0" }}>
          {[0, 1, 2].map((idx) => (
            <svg key={idx} width="50" height="60" viewBox="0 0 50 60">
              <line
                x1="25"
                y1="0"
                x2="25"
                y2="46"
                stroke={targetProgress > 0 ? C.cream : C.border}
                strokeWidth="6"
                strokeDasharray="8 6"
              />
              <polygon
                points="12,44 25,60 38,44"
                fill={targetProgress > 0 ? C.cream : C.border}
              />
            </svg>
          ))}
        </div>

        {/* Large Destination Target Node: MAINTAIN THEIR PROJECTS */}
        <div
          style={{
            width: "100%",
            backgroundColor: C.surfaceElevated,
            border: `4px solid ${targetProgress > 0 ? C.cream : C.border}`,
            borderRadius: 24,
            padding: "36px 56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: targetProgress,
            transform: `translateY(${(1 - targetProgress) * 20}px)`,
            boxShadow: targetProgress > 0.5 ? "0 20px 50px rgba(0,0,0,0.8)" : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: C.emerald,
                boxShadow: `0 0 20px ${C.emerald}`,
              }}
            />
            <span
              style={{
                fontSize: 84,
                fontWeight: 900,
                fontFamily: FONT_DISPLAY,
                color: C.cream,
                lineHeight: 1.05,
              }}
            >
              MAINTAIN THEIR PROJECTS
            </span>
          </div>
          <span
            style={{
              fontSize: 56,
              fontWeight: 900,
              fontFamily: FONT_DISPLAY,
              color: C.emerald,
              padding: "10px 28px",
              border: `3px solid ${C.emerald}`,
              borderRadius: 12,
              backgroundColor: C.surface,
            }}
          >
            ACTIVE LIFELINE
          </span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// SHOT 3: Kinetic Typography (Full-Frame Scaled Layout)
// =========================================================================
const Shot3: React.FC<{ frame: number }> = ({ frame }) => {
  const enterProgress = interpolate(frame, [226, 238], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const l1Progress = interpolate(frame, [246, 256], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const l2Progress = interpolate(frame, [288, 298], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const l3Progress = interpolate(frame, [316, 326], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const exitSlide = interpolate(frame, [376, 383], [0, -1920], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        transform: `translateX(${exitSlide}px)`,
        opacity: enterProgress,
        padding: "0 80px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1680,
          display: "flex",
          flexDirection: "column",
          gap: 36,
        }}
      >
        {/* Line 1: OPEN SOURCE BUSINESSES at 110px */}
        <div
          style={{
            fontSize: 110,
            fontWeight: 900,
            fontFamily: FONT_DISPLAY,
            lineHeight: 1.0,
            color: C.cream,
            opacity: l1Progress,
            transform: `translateY(${(1 - l1Progress) * 30}px)`,
          }}
        >
          OPEN SOURCE BUSINESSES
        </div>

        {/* Line 2: FIGURED OUT HOW TO MAKE MONEY at 144px */}
        <div
          style={{
            fontSize: 144,
            fontWeight: 900,
            fontFamily: FONT_DISPLAY,
            lineHeight: 1.0,
            color: C.emerald,
            opacity: l2Progress,
            transform: `translateY(${(1 - l2Progress) * 30}px)`,
          }}
        >
          FIGURED OUT HOW TO MAKE MONEY
        </div>

        {/* Line 3: WITHOUT CHARGING EVERYONE FOR THE BASIC SOFTWARE at 72px */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            fontFamily: FONT_DISPLAY,
            color: C.amber,
            opacity: l3Progress,
            transform: `translateY(${(1 - l3Progress) * 30}px)`,
            lineHeight: 1.25,
            borderLeft: `8px solid ${C.amber}`,
            backgroundColor: C.surface,
            padding: "24px 36px",
            borderRadius: "0 16px 16px 0",
            boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
          }}
        >
          WITHOUT CHARGING EVERYONE FOR THE BASIC SOFTWARE
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// SHOT 4: Style 2 (Real Evidence / Screen-Led: Cropped & Readable Free/Pro)
// =========================================================================
const Shot4: React.FC<{ frame: number }> = ({ frame }) => {
  const enterSlide = interpolate(frame, [383, 391], [1920, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Slow subtle push-in across 9.1 seconds hold
  const zoomScale = interpolate(frame, [391, 520, 658], [1.0, 1.06, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Highlight Box 1: "USE IT FOR FREE" (f 488 - 535) -> locked around Free card
  const freeHighlight = interpolate(frame, [488, 498], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Highlight Box 2: "PAID CONVENIENCE / HOSTING" (f 536 - 658) -> locked around Pro card
  const proHighlight = interpolate(frame, [536, 546], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Hard cut exit at f 658
  const exitOpacity = frame >= 658 ? 0 : 1;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        transform: `translateX(${enterSlide}px)`,
        opacity: exitOpacity,
        paddingTop: 48,
        paddingLeft: 60,
        paddingRight: 60,
      }}
    >
      {/* Top Header: Safe margins, NO clipping, NO text under 56px */}
      <div
        style={{
          width: 1680,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span
            style={{
              fontSize: 64,
              fontWeight: 900,
              fontFamily: FONT_DISPLAY,
              color: C.amber,
              lineHeight: 1.0,
            }}
          >
            MODEL 01: PAID CONVENIENCE
          </span>
          <span
            style={{
              fontSize: 56,
              fontWeight: 800,
              fontFamily: FONT_DISPLAY,
              backgroundColor: C.surface,
              border: `3px solid ${C.blue}`,
              color: C.cream,
              padding: "6px 24px",
              borderRadius: 12,
            }}
          >
            EXAMPLE: SUPABASE
          </span>
        </div>
      </div>

      {/* Real Cropped Screenshot Window: Fills 75%+ of frame */}
      <div
        style={{
          width: 1680,
          height: 860,
          backgroundColor: C.surface,
          border: `4px solid ${C.border}`,
          borderRadius: 24,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 28px 70px rgba(0,0,0,0.9)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Scaled/Cropped Image Container */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transform: `scale(${zoomScale})`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Img
            src={staticFile("images/supabase_free_pro_crop.png")}
            style={{
              height: "100%",
              width: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />

          {/* Locked Highlight 1: Pointing at real Free tier */}
          {freeHighlight > 0 && frame < 535 && (
            <div
              style={{
                position: "absolute",
                left: "22%",
                top: "3%",
                width: "27%",
                height: "94%",
                border: `6px solid ${C.emerald}`,
                borderRadius: 24,
                boxShadow: `0 0 45px rgba(16, 185, 129, 0.65)`,
                pointerEvents: "none",
                opacity: freeHighlight,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  backgroundColor: C.emerald,
                  color: C.bg,
                  fontSize: 56,
                  fontWeight: 900,
                  fontFamily: FONT_DISPLAY,
                  padding: "8px 24px",
                  borderRadius: 10,
                  whiteSpace: "nowrap",
                }}
              >
                FREE TO USE ($0)
              </div>
            </div>
          )}

          {/* Locked Highlight 2: Pointing at real Pro hosting & cloud tier */}
          {proHighlight > 0 && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "1%",
                width: "28%",
                height: "98%",
                border: `6px solid ${C.blue}`,
                borderRadius: 24,
                boxShadow: `0 0 50px rgba(22, 119, 255, 0.75)`,
                pointerEvents: "none",
                opacity: proHighlight,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  backgroundColor: C.blue,
                  color: C.cream,
                  fontSize: 56,
                  fontWeight: 900,
                  fontFamily: FONT_DISPLAY,
                  padding: "8px 24px",
                  borderRadius: 10,
                  whiteSpace: "nowrap",
                }}
              >
                PAID HOSTING ($25)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// SHOT 5: Style 5 (Technical Motion Graphics: Full-Frame Enterprise Architecture)
// =========================================================================
const Shot5: React.FC<{ frame: number }> = ({ frame }) => {
  const enterProgress = interpolate(frame, [660, 668], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const freeCardProgress = interpolate(frame, [721, 730], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const entCardProgress = interpolate(frame, [788, 796], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // 4 Enterprise Nodes:
  // 1. ADVANCED SECURITY (f 858)
  const n1 = interpolate(frame, [856, 864], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // 2. ACCESS CONTROLS (f 894)
  const n2 = interpolate(frame, [892, 900], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // 3. COMPLIANCE TOOLS (f 922)
  const n3 = interpolate(frame, [920, 928], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // 4. SOMEONE TO CALL WHEN SOMETHING BREAKS (f 946)
  const n4 = interpolate(frame, [944, 950], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // All 4 nodes are fully built by frame 950 and hold through frame 1010 (60 frames = 2.0s hold!)
  const exitSlideY = interpolate(frame, [1005, 1012], [0, -1080], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        transform: `translateY(${exitSlideY}px)`,
        opacity: enterProgress,
        paddingTop: 48,
        paddingLeft: 60,
        paddingRight: 60,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1680,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Header: 64px, safe top margin */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            fontFamily: FONT_DISPLAY,
            color: C.blue,
            lineHeight: 1.0,
          }}
        >
          MODEL 02: ENTERPRISE SUPPORT
        </div>

        {/* Massive Split Architecture: 520px left, 1120px right */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "520px 1fr",
            gap: 36,
            alignItems: "stretch",
            height: 780,
          }}
        >
          {/* Left Column: Enlarged REGULAR USER -> FREE VERSION Container */}
          <div
            style={{
              backgroundColor: C.surface,
              border: `4px solid ${freeCardProgress > 0 ? C.border : "transparent"}`,
              borderRadius: 24,
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              opacity: freeCardProgress,
              transform: `translateX(${(1 - freeCardProgress) * -30}px)`,
              boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  fontFamily: FONT_DISPLAY,
                  color: C.creamMuted,
                  marginBottom: 16,
                }}
              >
                CLIENT TIER 01
              </div>
              <div
                style={{
                  fontSize: 76,
                  fontWeight: 900,
                  fontFamily: FONT_DISPLAY,
                  color: C.cream,
                  lineHeight: 1.05,
                  marginBottom: 28,
                }}
              >
                REGULAR USER
              </div>

              {/* Big Geometric User Community Icon */}
              <div style={{ margin: "24px 0" }}>
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke={C.emerald} strokeWidth="2.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>

            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                fontFamily: FONT_DISPLAY,
                color: C.emerald,
                padding: "20px 32px",
                backgroundColor: C.surfaceElevated,
                border: `3px solid ${C.emerald}`,
                borderRadius: 16,
                textAlign: "center",
              }}
            >
              FREE VERSION
            </div>
          </div>

          {/* Right Column: COMPANY WITH THOUSANDS OF EMPLOYEES */}
          <div
            style={{
              backgroundColor: C.surfaceElevated,
              border: `4px solid ${entCardProgress > 0 ? C.amber : C.border}`,
              borderRadius: 24,
              padding: "36px 44px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              opacity: entCardProgress,
              transform: `translateX(${(1 - entCardProgress) * 30}px)`,
              boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            }}
          >
            {/* Header: 64px exact narration term */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontSize: 64,
                  fontWeight: 900,
                  fontFamily: FONT_DISPLAY,
                  color: C.amber,
                }}
              >
                COMPANY WITH THOUSANDS OF EMPLOYEES
              </span>
            </div>

            {/* 4 Vertically Stacked Nodes (ALL 4 VISIBLE IN FINAL STATE, 64px labels, NO tiny text) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Node 1: ADVANCED SECURITY */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  padding: "16px 28px",
                  backgroundColor: C.surface,
                  border: `3px solid ${n1 > 0 ? C.blue : C.border}`,
                  borderRadius: 16,
                  opacity: n1,
                  transform: `translateX(${(1 - n1) * 20}px)`,
                }}
              >
                <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: C.blue }} />
                <span style={{ fontSize: 64, fontWeight: 900, fontFamily: FONT_DISPLAY, color: C.cream }}>
                  ADVANCED SECURITY
                </span>
              </div>

              {/* Node 2: ACCESS CONTROLS */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  padding: "16px 28px",
                  backgroundColor: C.surface,
                  border: `3px solid ${n2 > 0 ? C.blue : C.border}`,
                  borderRadius: 16,
                  opacity: n2,
                  transform: `translateX(${(1 - n2) * 20}px)`,
                }}
              >
                <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: C.blue }} />
                <span style={{ fontSize: 64, fontWeight: 900, fontFamily: FONT_DISPLAY, color: C.cream }}>
                  ACCESS CONTROLS
                </span>
              </div>

              {/* Node 3: COMPLIANCE TOOLS */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  padding: "16px 28px",
                  backgroundColor: C.surface,
                  border: `3px solid ${n3 > 0 ? C.blue : C.border}`,
                  borderRadius: 16,
                  opacity: n3,
                  transform: `translateX(${(1 - n3) * 20}px)`,
                }}
              >
                <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: C.blue }} />
                <span style={{ fontSize: 64, fontWeight: 900, fontFamily: FONT_DISPLAY, color: C.cream }}>
                  COMPLIANCE TOOLS
                </span>
              </div>

              {/* Node 4: SOMEONE TO CALL WHEN SOMETHING BREAKS */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  padding: "16px 28px",
                  backgroundColor: C.surface,
                  border: `3px solid ${n4 > 0 ? C.amber : C.border}`,
                  borderRadius: 16,
                  opacity: n4,
                  transform: `translateX(${(1 - n4) * 20}px)`,
                  boxShadow: n4 > 0.5 ? `0 0 30px rgba(245, 158, 11, 0.3)` : "none",
                }}
              >
                <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: C.amber }} />
                <span style={{ fontSize: 58, fontWeight: 900, fontFamily: FONT_DISPLAY, color: C.amber, lineHeight: 1.1 }}>
                  SOMEONE TO CALL WHEN SOMETHING BREAKS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// SHOT 6: Style 4 (Graphic Symbols / Icon-Led Beats: Selling Services)
// =========================================================================
const Shot6: React.FC<{ frame: number }> = ({ frame }) => {
  // Starts on "selling services" (176.2s = frame 1010)
  const enterSlideY = interpolate(frame, [1005, 1014], [1080, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Base 2x2 framework established at frame 1020
  const frameworkProgress = interpolate(frame, [1014, 1024], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // 4 Services activate on spoken words:
  // 1. INSTALLATION (f 1111)
  const s1 = interpolate(frame, [1108, 1116], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // 2. CUSTOMIZATION (f 1135)
  const s2 = interpolate(frame, [1132, 1140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // 3. CONSULTING (f 1166)
  const s3 = interpolate(frame, [1163, 1171], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // 4. MAINTENANCE (f 1181)
  const s4 = interpolate(frame, [1178, 1184], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Holds fully built from frame 1184 through frame 1204 (until 182.68s)
  // Shot 7 does NOT start before frame 1204!
  const exitScale = interpolate(frame, [1203, 1208], [1, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const exitOpacity = interpolate(frame, [1203, 1208], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        transform: `translateY(${enterSlideY}px) scale(${exitScale})`,
        opacity: exitOpacity,
        paddingTop: 48,
        paddingLeft: 60,
        paddingRight: 60,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1680,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* Header: 84px, Subtitle: 56px */}
        <div>
          <div
            style={{
              fontSize: 84,
              fontWeight: 900,
              fontFamily: FONT_DISPLAY,
              color: C.cream,
              lineHeight: 1.0,
            }}
          >
            MODEL 03: SELLING SERVICES
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              fontFamily: FONT_DISPLAY,
              color: C.blue,
              marginTop: 14,
            }}
          >
            BUILD OPEN-SOURCE → CHARGE FOR SERVICES
          </div>
        </div>

        {/* 2x2 Massive Scaled Grid: 780px x 290px each, 72px node labels */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            width: "100%",
            opacity: frameworkProgress,
          }}
        >
          {/* Card 1: INSTALLATION (72px, Amber) */}
          <div
            style={{
              backgroundColor: C.surface,
              border: `4px solid ${s1 > 0 ? C.amber : C.border}`,
              borderRadius: 20,
              padding: "44px 48px",
              display: "flex",
              alignItems: "center",
              gap: 36,
              opacity: s1 > 0 ? 1 : 0.45,
              transform: s1 > 0 ? "scale(1.02)" : "scale(1.0)",
              boxShadow: s1 > 0.5 ? `0 0 35px rgba(245, 158, 11, 0.3)` : "none",
            }}
          >
            <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke={s1 > 0 ? C.amber : C.creamMuted} strokeWidth="2.8">
              <path d="M4 17l6-6-6-6" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            <div style={{ fontSize: 72, fontWeight: 900, fontFamily: FONT_DISPLAY, color: s1 > 0 ? C.cream : C.creamMuted }}>
              INSTALLATION
            </div>
          </div>

          {/* Card 2: CUSTOMIZATION (72px, Electric Blue) */}
          <div
            style={{
              backgroundColor: C.surface,
              border: `4px solid ${s2 > 0 ? C.blue : C.border}`,
              borderRadius: 20,
              padding: "44px 48px",
              display: "flex",
              alignItems: "center",
              gap: 36,
              opacity: s2 > 0 ? 1 : 0.45,
              transform: s2 > 0 ? "scale(1.02)" : "scale(1.0)",
              boxShadow: s2 > 0.5 ? `0 0 35px rgba(22, 119, 255, 0.3)` : "none",
            }}
          >
            <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke={s2 > 0 ? C.blue : C.creamMuted} strokeWidth="2.8">
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <circle cx="4" cy="12" r="2" />
              <circle cx="12" cy="10" r="2" />
              <circle cx="20" cy="14" r="2" />
            </svg>
            <div style={{ fontSize: 72, fontWeight: 900, fontFamily: FONT_DISPLAY, color: s2 > 0 ? C.cream : C.creamMuted }}>
              CUSTOMIZATION
            </div>
          </div>

          {/* Card 3: CONSULTING (72px, Emerald) */}
          <div
            style={{
              backgroundColor: C.surface,
              border: `4px solid ${s3 > 0 ? C.emerald : C.border}`,
              borderRadius: 20,
              padding: "44px 48px",
              display: "flex",
              alignItems: "center",
              gap: 36,
              opacity: s3 > 0 ? 1 : 0.45,
              transform: s3 > 0 ? "scale(1.02)" : "scale(1.0)",
              boxShadow: s3 > 0.5 ? `0 0 35px rgba(16, 185, 129, 0.3)` : "none",
            }}
          >
            <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke={s3 > 0 ? C.emerald : C.creamMuted} strokeWidth="2.8">
              <rect x="2" y="3" width="7" height="7" />
              <rect x="15" y="3" width="7" height="7" />
              <rect x="9" y="14" width="7" height="7" />
              <path d="M5.5 10v2a2 2 0 0 0 2 2h2" />
              <path d="M18.5 10v2a2 2 0 0 1-2 2h-2" />
            </svg>
            <div style={{ fontSize: 72, fontWeight: 900, fontFamily: FONT_DISPLAY, color: s3 > 0 ? C.cream : C.creamMuted }}>
              CONSULTING
            </div>
          </div>

          {/* Card 4: MAINTENANCE (72px, Cream) */}
          <div
            style={{
              backgroundColor: C.surface,
              border: `4px solid ${s4 > 0 ? C.cream : C.border}`,
              borderRadius: 20,
              padding: "44px 48px",
              display: "flex",
              alignItems: "center",
              gap: 36,
              opacity: s4 > 0 ? 1 : 0.45,
              transform: s4 > 0 ? "scale(1.02)" : "scale(1.0)",
              boxShadow: s4 > 0.5 ? `0 0 35px rgba(250, 244, 217, 0.3)` : "none",
            }}
          >
            <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke={s4 > 0 ? C.cream : C.creamMuted} strokeWidth="2.8">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <div style={{ fontSize: 72, fontWeight: 900, fontFamily: FONT_DISPLAY, color: s4 > 0 ? C.cream : C.creamMuted }}>
              MAINTENANCE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// SHOT 7: Style 2 (Real Evidence / Screen-Led: Blender Foundation Corporate Memberships)
// =========================================================================
const Shot7: React.FC<{ frame: number }> = ({ frame }) => {
  // Starts strictly at 182.68s = frame 1204
  const enterScale = interpolate(frame, [1204, 1214], [0.94, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const enterOpacity = interpolate(frame, [1204, 1214], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Slow subtle push-in across 5.1s
  const zoom = interpolate(frame, [1214, 1360], [1.0, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Anchor 'FUNDING FROM COMPANIES THAT DEPEND ON THEM' (f 1297)
  const highlightProgress = interpolate(frame, [1294, 1304], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        transform: `scale(${enterScale})`,
        opacity: enterOpacity,
        paddingTop: 48,
        paddingLeft: 60,
        paddingRight: 60,
      }}
    >
      {/* Evidence Top Context Bar: 64px header, 56px badge */}
      <div
        style={{
          width: 1680,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span
            style={{
              fontSize: 64,
              fontWeight: 900,
              fontFamily: FONT_DISPLAY,
              color: C.emerald,
              lineHeight: 1.0,
            }}
          >
            MODEL 04: SPONSORSHIPS & FUNDING
          </span>
          <span
            style={{
              fontSize: 56,
              fontWeight: 800,
              fontFamily: FONT_DISPLAY,
              backgroundColor: C.surface,
              border: `3px solid ${C.emerald}`,
              color: C.cream,
              padding: "6px 24px",
              borderRadius: 12,
            }}
          >
            EXAMPLE: BLENDER FUND
          </span>
        </div>
      </div>

      {/* Real Cropped Screenshot Window Framed with Dark Margins */}
      <div
        style={{
          width: 1680,
          height: 840,
          backgroundColor: C.surface,
          border: `4px solid ${C.border}`,
          borderRadius: 24,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 28px 70px rgba(0,0,0,0.9)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Scaled/Cropped Table Container */}
        <div
          style={{
            position: "relative",
            width: "92%",
            height: "92%",
            transform: `scale(${zoom})`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Img
            src={staticFile("images/blender_tiers_crop.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
              borderRadius: 16,
            }}
          />
        </div>

        {/* Real Evidence Highlight on Patron / Corporate Members at 56px */}
        {highlightProgress > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: 36,
              left: 80,
              right: 80,
              backgroundColor: "rgba(24, 21, 22, 0.96)",
              border: `4px solid ${C.emerald}`,
              borderRadius: 20,
              padding: "24px 44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: highlightProgress,
              transform: `translateY(${(1 - highlightProgress) * 20}px)`,
              boxShadow: "0 16px 50px rgba(0,0,0,0.85)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: C.emerald,
                  boxShadow: `0 0 20px ${C.emerald}`,
                }}
              />
              <span
                style={{
                  fontSize: 56,
                  fontWeight: 900,
                  fontFamily: FONT_DISPLAY,
                  color: C.cream,
                }}
              >
                FUNDED BY DEPENDENT ENTERPRISES
              </span>
            </div>

            <span
              style={{
                fontSize: 56,
                fontWeight: 900,
                fontFamily: FONT_DISPLAY,
                color: C.emerald,
              }}
            >
              REAL CORPORATE TIERS
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
