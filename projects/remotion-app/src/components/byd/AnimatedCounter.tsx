import React from "react";
import { fontFamily } from "./fonts";

interface AnimatedCounterProps {
  value: number;
  unit?: string;
  size?: number;
  color?: string;
  unitColor?: string;
  glowColor?: string;
  fontWeight?: number | string;
  subLabel?: string;
  style?: React.CSSProperties;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  unit = "km",
  size = 72,
  color = "#FFFFFF",
  unitColor = "rgba(255, 255, 255, 0.65)",
  glowColor,
  fontWeight = 700,
  subLabel,
  style,
}) => {
  // Guarantee exact integer representation
  const rounded = Math.round(value);
  const formatted = rounded.toLocaleString("en-US");

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        fontFamily,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: Math.max(8, Math.round(size * 0.16)),
          lineHeight: 1,
        }}
      >
        <span
          style={{
            fontSize: size,
            fontWeight,
            color,
            letterSpacing: "-0.03em",
            textShadow: glowColor
              ? `0 0 24px ${glowColor}, 0 0 48px ${glowColor}`
              : "0 2px 10px rgba(0, 0, 0, 0.4)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatted}
        </span>
        {unit && (
          <span
            style={{
              fontSize: Math.round(size * 0.45),
              fontWeight: 500,
              color: unitColor,
              letterSpacing: "0.02em",
              textTransform: "lowercase",
            }}
          >
            {unit}
          </span>
        )}
      </div>
      {subLabel && (
        <span
          style={{
            marginTop: 6,
            fontSize: Math.max(13, Math.round(size * 0.2)),
            fontWeight: 500,
            color: "rgba(255, 255, 255, 0.5)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {subLabel}
        </span>
      )}
    </div>
  );
};
