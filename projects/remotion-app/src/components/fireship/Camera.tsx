import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export type CameraMode =
  | "pushIn"
  | "pullOut"
  | "driftLeft"
  | "driftRight"
  | "shake"
  | "breathing";

interface CameraProps {
  children: React.ReactNode;
  durationInFrames: number;
  mode?: CameraMode;
  intensity?: number;
  zoomRange?: [number, number];
  panRange?: [number, number];
  className?: string;
  style?: React.CSSProperties;
}

export const Camera: React.FC<CameraProps> = ({
  children,
  durationInFrames,
  mode = "pushIn",
  intensity = 1.0,
  zoomRange = [1.0, 1.07],
  panRange = [0, 24],
  style,
}) => {
  const frame = useCurrentFrame();

  let scale = 1.0;
  let translateX = 0;
  let translateY = 0;
  let rotate = 0;

  const progress = Math.min(1, Math.max(0, frame / Math.max(1, durationInFrames)));

  switch (mode) {
    case "pushIn":
      scale = interpolate(progress, [0, 1], zoomRange, {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      translateY = interpolate(progress, [0, 1], [0, -panRange[1] * 0.4 * intensity]);
      break;

    case "pullOut":
      scale = interpolate(progress, [0, 1], [zoomRange[1], zoomRange[0]], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      translateY = interpolate(progress, [0, 1], [-panRange[1] * 0.4 * intensity, 0]);
      break;

    case "driftLeft":
      scale = interpolate(progress, [0, 1], [1.02, 1.06]);
      translateX = interpolate(progress, [0, 1], [panRange[0], -panRange[1] * intensity]);
      break;

    case "driftRight":
      scale = interpolate(progress, [0, 1], [1.02, 1.06]);
      translateX = interpolate(progress, [0, 1], [-panRange[0], panRange[1] * intensity]);
      break;

    case "shake": {
      // Deterministic high-energy camera shake (for impact moments)
      const shakeDecay = Math.max(0, 1 - frame / 15);
      translateX = Math.sin(frame * 1.8) * 12 * intensity * shakeDecay;
      translateY = Math.cos(frame * 2.2) * 8 * intensity * shakeDecay;
      rotate = Math.sin(frame * 1.4) * 1.2 * intensity * shakeDecay;
      scale = 1.0 + 0.04 * intensity;
      break;
    }

    case "breathing": {
      // Organic subtle breathing motion
      const t = frame * 0.05;
      scale = 1.02 + Math.sin(t) * 0.02 * intensity;
      translateX = Math.cos(t * 0.8) * 8 * intensity;
      translateY = Math.sin(t * 0.6) * 6 * intensity;
      break;
    }
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transform: `scale(${scale}) translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`,
        transformOrigin: "center center",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
