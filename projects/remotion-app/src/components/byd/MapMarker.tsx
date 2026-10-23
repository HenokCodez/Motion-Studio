import React from "react";
import { fontFamily } from "./fonts";

interface MapMarkerProps {
  x: number;
  y: number;
  label: string;
  subLabel?: string;
  badge?: string;
  color?: string;
  pulsePhase?: number; // 0 to 1 cyclic pulse
  isPulsing?: boolean;
  align?: "left" | "right" | "top" | "bottom";
  opacity?: number;
}

export const MapMarker: React.FC<MapMarkerProps> = ({
  x,
  y,
  label,
  subLabel,
  badge,
  color = "#FFFFFF",
  pulsePhase = 0,
  isPulsing = true,
  align = "right",
  opacity = 1,
}) => {
  // Label positioning relative to pin
  let labelStyle: React.CSSProperties = {
    position: "absolute",
    left: 20,
    top: -14,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  };

  if (align === "left") {
    labelStyle = {
      position: "absolute",
      right: 20,
      top: -14,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
    };
  } else if (align === "bottom") {
    labelStyle = {
      position: "absolute",
      left: 0,
      top: 18,
      transform: "translateX(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    };
  }

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        pointerEvents: "none",
        zIndex: 15,
        fontFamily,
      }}
    >
      {/* Expanding Concentric Pulse Waves */}
      {isPulsing && (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              transform: `translate(-50%, -50%) scale(${1 + pulsePhase * 2.2})`,
              width: 24,
              height: 24,
              borderRadius: "50%",
              border: `1.5px solid ${color}`,
              opacity: (1 - pulsePhase) * 0.7,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              transform: `translate(-50%, -50%) scale(${1 + ((pulsePhase + 0.5) % 1) * 2.2})`,
              width: 24,
              height: 24,
              borderRadius: "50%",
              border: `1px solid ${color}`,
              opacity: (1 - ((pulsePhase + 0.5) % 1)) * 0.45,
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* Center Core Pin Dot */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: "translate(-50%, -50%)",
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: color,
          boxShadow: `0 0 12px ${color}, 0 0 24px ${color}`,
          border: "2px solid #FFFFFF",
          zIndex: 2,
        }}
      />

      {/* Automotive City Label Tag */}
      <div style={labelStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 10px",
            borderRadius: 6,
            backgroundColor: "rgba(10, 14, 22, 0.88)",
            border: `1px solid ${color}66`,
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.55)",
            backdropFilter: "blur(8px)",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: color,
              boxShadow: `0 0 6px ${color}`,
            }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: "#FFFFFF",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
          {badge && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color,
                letterSpacing: "0.04em",
                padding: "1px 6px",
                borderRadius: 4,
                backgroundColor: `${color}22`,
              }}
            >
              {badge}
            </span>
          )}
        </div>

        {subLabel && (
          <span
            style={{
              marginTop: 3,
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.65)",
              letterSpacing: "0.04em",
              paddingLeft: align === "right" ? 4 : 0,
              paddingRight: align === "left" ? 4 : 0,
              textShadow: "0 2px 6px rgba(0,0,0,0.8)",
            }}
          >
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
};
