import React from "react";
import { fontFamily } from "./fonts";

interface HybridIconProps {
  electricActive?: boolean;
  gasolineActive?: boolean;
  size?: number;
  showLabels?: boolean;
}

export const HybridIcon: React.FC<HybridIconProps> = ({
  electricActive = false,
  gasolineActive = false,
  size = 54,
  showLabels = true,
}) => {
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        fontFamily,
      }}
    >
      {/* Icon Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 18px",
          borderRadius: 14,
          backgroundColor: "rgba(18, 22, 32, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow:
            electricActive || gasolineActive
              ? "0 8px 24px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 210, 255, 0.15)"
              : "0 4px 16px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Electric Node */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            opacity: electricActive ? 1 : 0.35,
            transition: "none",
          }}
        >
          <svg width={size * 0.65} height={size * 0.55} viewBox="0 0 32 26" fill="none">
            {/* Battery outline */}
            <rect
              x="1"
              y="2"
              width="26"
              height="22"
              rx="4"
              stroke={electricActive ? "#00D2FF" : "rgba(255, 255, 255, 0.5)"}
              strokeWidth="2"
              fill={electricActive ? "rgba(0, 210, 255, 0.15)" : "none"}
            />
            {/* Terminal */}
            <path
              d="M 27 9 Q 29 9 29 11 L 29 15 Q 29 17 27 17 Z"
              fill={electricActive ? "#00D2FF" : "rgba(255, 255, 255, 0.5)"}
            />
            {/* Lightning bolt */}
            <path
              d="M 14 5 L 9 14 L 14 14 L 12 21 L 19 12 L 14 12 Z"
              fill={electricActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)"}
              filter={electricActive ? "drop-shadow(0 0 6px #00D2FF)" : "none"}
            />
          </svg>
        </div>

        {/* Fusion Plus Sign / Link */}
        <div
          style={{
            color: "rgba(255, 255, 255, 0.45)",
            fontSize: 16,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          +
        </div>

        {/* Gasoline Fuel Pump Node */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            opacity: gasolineActive ? 1 : 0.35,
            transition: "none",
          }}
        >
          <svg width={size * 0.65} height={size * 0.55} viewBox="0 0 32 26" fill="none">
            {/* Fuel Pump Body */}
            <rect
              x="2"
              y="3"
              width="16"
              height="21"
              rx="3"
              stroke={gasolineActive ? "#FF9500" : "rgba(255, 255, 255, 0.5)"}
              strokeWidth="2"
              fill={gasolineActive ? "rgba(255, 149, 0, 0.15)" : "none"}
            />
            {/* Meter Window */}
            <rect
              x="5"
              y="6"
              width="10"
              height="6"
              rx="1.5"
              fill={gasolineActive ? "#FF9500" : "rgba(255, 255, 255, 0.25)"}
              opacity={0.7}
            />
            {/* Hose & Nozzle */}
            <path
              d="M 18 8 Q 23 8 23 13 L 23 19 Q 25 19 26 17 L 27 13 L 24 13"
              stroke={gasolineActive ? "#FF9500" : "rgba(255, 255, 255, 0.5)"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              filter={gasolineActive ? "drop-shadow(0 0 6px #FF9500)" : "none"}
            />
          </svg>
        </div>
      </div>

      {/* Sequential Indicator Badges */}
      {showLabels && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* Electric Indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: electricActive ? "#00D2FF" : "rgba(255, 255, 255, 0.3)",
              textTransform: "uppercase",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: electricActive ? "#00D2FF" : "rgba(255, 255, 255, 0.2)",
                boxShadow: electricActive ? "0 0 8px #00D2FF" : "none",
              }}
            />
            Electric
          </div>

          <div
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}
          />

          {/* Gasoline Indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: gasolineActive ? "#FF9500" : "rgba(255, 255, 255, 0.3)",
              textTransform: "uppercase",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: gasolineActive ? "#FF9500" : "rgba(255, 255, 255, 0.2)",
                boxShadow: gasolineActive ? "0 0 8px #FF9500" : "none",
              }}
            />
            Gasoline
          </div>
        </div>
      )}
    </div>
  );
};
