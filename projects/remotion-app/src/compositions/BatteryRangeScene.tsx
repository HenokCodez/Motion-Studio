import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";
import { CockpitFrame } from "../components/byd/CockpitFrame";
import { AnimatedCounter } from "../components/byd/AnimatedCounter";
import { ProgressBar } from "../components/byd/ProgressBar";
import { BatteryIcon } from "../components/byd/BatteryIcon";
import { HybridIcon } from "../components/byd/HybridIcon";
import { fontFamily, COLORS } from "../components/byd/fonts";

export const BatteryRangeScene: React.FC = () => {
  const frame = useCurrentFrame();

  // -------------------------------------------------------------
  // Phase 1: 0:00 - 0:01 (Frames 0 - 30) - Establish Interface
  // -------------------------------------------------------------
  const overallOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const panelTranslateY = interpolate(frame, [0, 28], [24, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const burgundyGlow = interpolate(frame, [0, 35], [0, 0.85], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const blueAccent = frame >= 12 && frame <= 34;

  // -------------------------------------------------------------
  // Phase 2: 0:01 - 0:04 (Frames 30 - 120) - Electric-Only Range
  // -------------------------------------------------------------
  // Electric counter animates 0 -> 55, reaching 55 by frame 84 (~2.8s)
  const electricValue = interpolate(frame, [30, 84], [0, 55], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Battery charge level fills 0 -> 1 in sync with electric range
  const batteryCharge = interpolate(frame, [30, 84], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Progress bar for electric range fills in sync
  const electricProgress = interpolate(frame, [30, 84], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Electric card entry opacity and position
  const electricEntranceOpacity = interpolate(frame, [22, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // -------------------------------------------------------------
  // Phase 3: 0:04 - 0:05 (Frames 120 - 150) - Transition & Red Light Sweep
  // -------------------------------------------------------------
  // Red light sweep travels across dashboard from frame 118 to 146
  const lightSweep = interpolate(frame, [118, 146], [-0.2, 1.2], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Electric section scales down slightly and moves from center to upper position during transition
  const electricTranslateY = interpolate(frame, [120, 145], [140, 0], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const electricSectionScale = interpolate(frame, [120, 145], [1, 0.88], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Divider line appears during transition
  const dividerOpacity = interpolate(frame, [126, 148], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Combined section enters from right / fades in
  const combinedOpacity = interpolate(frame, [135, 155], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const combinedTranslateX = interpolate(frame, [135, 155], [25, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // -------------------------------------------------------------
  // Phase 4: 0:05 - 0:08 (Frames 150 - 240) - Combined Driving Range (0 -> 2,100 km)
  // -------------------------------------------------------------
  // Counter animates smoothly from 0 to 2,100 by frame 236 (~7.87s), settling precisely
  const combinedValue = interpolate(frame, [150, 236], [0, 2100], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Combined progress bar fills as counter increases
  const combinedProgress = interpolate(frame, [150, 236], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sequential indicators: electric illuminates at frame 160, gasoline at frame 185
  const isElectricActive = frame >= 160;
  const isGasolineActive = frame >= 185;

  // -------------------------------------------------------------
  // Phase 5: 0:08 - 0:10 (Frames 240 - 300) - Final Hold & Outro
  // -------------------------------------------------------------
  // Final subtle glow on progress bar
  const finalGlow = interpolate(frame, [236, 260], [0.4, 0.85], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Smooth exit transition at very end (frames 288-300)
  const exitOpacity = interpolate(frame, [288, 300], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: overallOpacity * exitOpacity }}>
      <CockpitFrame
        burgundyGlowOpacity={burgundyGlow}
        lightSweepProgress={lightSweep}
        panelTranslateY={panelTranslateY}
        blueAccentActive={blueAccent}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            fontFamily,
          }}
        >
          {/* ======================================================== */}
          {/* UPPER SECTION: Electric-Only Range (55 km)               */}
          {/* ======================================================== */}
          <div
            style={{
              position: "relative",
              opacity: electricEntranceOpacity,
              transform: `translateY(${electricTranslateY}px) scale(${electricSectionScale})`,
              transformOrigin: "top left",
              padding: "16px 20px",
              borderRadius: 16,
              backgroundColor:
                frame >= 135
                  ? "rgba(18, 22, 32, 0.45)"
                  : "transparent",
              border:
                frame >= 135
                  ? "1px solid rgba(255, 255, 255, 0.06)"
                  : "1px solid transparent",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 36,
              }}
            >
              {/* Battery Icon */}
              <div style={{ flexShrink: 0 }}>
                <BatteryIcon
                  chargeLevel={batteryCharge}
                  size={58}
                  accentColor={COLORS.electricBlue}
                  glowColor={COLORS.electricBlueGlow}
                />
              </div>

              {/* Counter and Labels */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
                  <AnimatedCounter
                    value={electricValue}
                    unit="km"
                    size={frame >= 135 ? 64 : 76}
                    color="#FFFFFF"
                    glowColor="rgba(0, 210, 255, 0.3)"
                  />
                  {frame >= 135 && (
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 6,
                        backgroundColor: "rgba(0, 210, 255, 0.15)",
                        border: "1px solid rgba(0, 210, 255, 0.35)",
                        color: COLORS.electricBlue,
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      55 km Electric
                    </span>
                  )}
                </div>

                {/* Primary Metric Label */}
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    color: COLORS.electricBlue,
                    textTransform: "uppercase",
                  }}
                >
                  ELECTRIC-ONLY RANGE
                </div>

                {/* Supporting Qualification */}
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 13,
                    fontWeight: 400,
                    color: "rgba(255, 255, 255, 0.55)",
                    letterSpacing: "0.02em",
                  }}
                >
                  Up to 55 km, depending on version
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: 14, maxWidth: 520 }}>
                  <ProgressBar
                    progress={electricProgress}
                    height={5}
                    gradientStart="#00D2FF"
                    gradientEnd="#0072FF"
                    glowColor="rgba(0, 210, 255, 0.4)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CENTER DIVIDER LINE                                      */}
          {/* ======================================================== */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 1,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 20%, rgba(255, 255, 255, 0.15) 80%, transparent 100%)",
              opacity: dividerOpacity,
              margin: "8px 0",
            }}
          />

          {/* ======================================================== */}
          {/* LOWER HERO SECTION: Combined Driving Range (2,100 km)     */}
          {/* ======================================================== */}
          <div
            style={{
              position: "relative",
              opacity: combinedOpacity,
              transform: `translateX(${combinedTranslateX}px)`,
              padding: "16px 20px",
              borderRadius: 18,
              backgroundColor: "rgba(20, 24, 34, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 40,
              }}
            >
              {/* Minimalist Hybrid Power Icon with Sequential Indicators */}
              <div style={{ flexShrink: 0 }}>
                <HybridIcon
                  electricActive={isElectricActive}
                  gasolineActive={isGasolineActive}
                  size={58}
                />
              </div>

              {/* Headline Counter and Labels */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                  }}
                >
                  <AnimatedCounter
                    value={combinedValue}
                    unit="km"
                    size={88}
                    color="#FFFFFF"
                    glowColor={
                      frame >= 230
                        ? `rgba(230, 0, 18, ${finalGlow * 0.4})`
                        : undefined
                    }
                    fontWeight={800}
                  />

                  {/* Dual Energy Badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 14px",
                      borderRadius: 20,
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: COLORS.bydRed,
                        boxShadow: `0 0 10px ${COLORS.bydRed}`,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: "#FFFFFF",
                        textTransform: "uppercase",
                      }}
                    >
                      DUAL POWER ARCHITECTURE
                    </span>
                  </div>
                </div>

                {/* Primary Metric Label */}
                <div
                  style={{
                    marginTop: 2,
                    fontSize: 16,
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                    color: "#FFFFFF",
                    textTransform: "uppercase",
                  }}
                >
                  TOTAL COMBINED DRIVING RANGE
                </div>

                {/* Subtitle */}
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 14,
                    fontWeight: 500,
                    color: "rgba(255, 255, 255, 0.7)",
                    letterSpacing: "0.04em",
                  }}
                >
                  Electric + gasoline
                </div>

                {/* Combined Progress Bar */}
                <div style={{ marginTop: 14 }}>
                  <ProgressBar
                    progress={combinedProgress}
                    height={7}
                    gradientStart="#00D2FF"
                    gradientEnd="#E60012"
                    glowColor={
                      frame >= 230
                        ? "rgba(230, 0, 18, 0.6)"
                        : "rgba(0, 210, 255, 0.4)"
                    }
                    ticks={10}
                  />
                </div>

                {/* Bottom Legal Qualification */}
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 11,
                    fontWeight: 400,
                    color: "rgba(255, 255, 255, 0.42)",
                    letterSpacing: "0.02em",
                  }}
                >
                  Claimed maximum range; varies by version and test conditions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </CockpitFrame>
    </AbsoluteFill>
  );
};
