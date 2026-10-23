import React from "react";
import { fontFamily, COLORS } from "./fonts";

interface CockpitFrameProps {
  children: React.ReactNode;
  burgundyGlowOpacity?: number; // 0 to 1
  lightSweepProgress?: number; // -0.5 to 1.5, position of light sweep
  panelTranslateY?: number;
  panelOpacity?: number;
  blueAccentActive?: boolean;
}

export const CockpitFrame: React.FC<CockpitFrameProps> = ({
  children,
  burgundyGlowOpacity = 0.6,
  lightSweepProgress = -1,
  panelTranslateY = 0,
  panelOpacity = 1,
  blueAccentActive = false,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        backgroundColor: COLORS.bgDark,
        overflow: "hidden",
        fontFamily,
      }}
    >
      {/* Subtle Background Radial Burgundy Glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 1400,
          height: 850,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(160, 16, 40, 0.32) 0%, rgba(90, 8, 20, 0.16) 45%, rgba(0, 0, 0, 0) 75%)",
          filter: "blur(60px)",
          opacity: burgundyGlowOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Automotive Cockpit Fine Grid Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          backgroundPosition: "center center",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />

      {/* Floating Center Automotive Dashboard Panel */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, calc(-50% + ${panelTranslateY}px))`,
          width: 1260,
          height: 720,
          borderRadius: 24,
          backgroundColor: COLORS.cockpitGlass,
          border: `1px solid ${blueAccentActive ? "rgba(0, 210, 255, 0.5)" : COLORS.cockpitBorder}`,
          boxShadow: blueAccentActive
            ? "0 30px 80px rgba(0, 0, 0, 0.75), 0 0 40px rgba(0, 210, 255, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)"
            : "0 30px 80px rgba(0, 0, 0, 0.75), 0 0 35px rgba(180, 16, 40, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
          opacity: panelOpacity,
          backdropFilter: "blur(20px)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Rim Highlight */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 60,
            right: 60,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4) 50%, transparent)",
            pointerEvents: "none",
          }}
        />

        {/* Dashboard Top Telemetry Bar */}
        <div
          style={{
            height: 58,
            padding: "0 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            backgroundColor: "rgba(10, 12, 18, 0.4)",
          }}
        >
          {/* Left: BYD Brand & Model Tag */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: "0.15em",
                color: "#FFFFFF",
                textTransform: "uppercase",
              }}
            >
              BYD QIN PLUS
            </span>
            <div
              style={{
                padding: "2px 8px",
                borderRadius: 4,
                backgroundColor: "rgba(230, 0, 18, 0.2)",
                border: "1px solid rgba(230, 0, 18, 0.4)",
                color: "#FF4D5E",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              DM-i SUPER HYBRID
            </div>
          </div>

          {/* Right: Powertrain Telemetry Status */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: blueAccentActive ? "#00D2FF" : "#30D158",
                  boxShadow: blueAccentActive ? "0 0 8px #00D2FF" : "0 0 8px #30D158",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.7)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                POWERTRAIN ACTIVE
              </span>
            </div>
            <div
              style={{
                color: "rgba(255, 255, 255, 0.35)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.04em",
              }}
            >
              EFFICIENCY MATRIX
            </div>
          </div>
        </div>

        {/* Interior Workspace */}
        <div
          style={{
            position: "relative",
            flex: 1,
            padding: "36px 44px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}

          {/* Red Light Sweep Transition Layer */}
          {lightSweepProgress >= -0.2 && lightSweepProgress <= 1.2 && (
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${lightSweepProgress * 100}%`,
                width: 220,
                transform: "translateX(-50%) skewX(-20deg)",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(230, 0, 18, 0.25) 50%, rgba(255, 255, 255, 0.4) 52%, rgba(230, 0, 18, 0.25) 54%, transparent 100%)",
                filter: "blur(12px)",
                pointerEvents: "none",
                mixBlendMode: "screen",
              }}
            />
          )}
        </div>

        {/* Automotive HUD Corner Brackets */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 14,
            width: 16,
            height: 16,
            borderLeft: "2px solid rgba(255, 255, 255, 0.2)",
            borderBottom: "2px solid rgba(255, 255, 255, 0.2)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 12,
            right: 14,
            width: 16,
            height: 16,
            borderRight: "2px solid rgba(255, 255, 255, 0.2)",
            borderBottom: "2px solid rgba(255, 255, 255, 0.2)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Subtle Bottom Cockpit Reflection */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 180,
          background:
            "linear-gradient(to top, rgba(7, 8, 11, 0.95) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
