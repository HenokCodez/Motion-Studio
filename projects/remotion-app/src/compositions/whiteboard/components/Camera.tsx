import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export interface CameraWaypoint {
  frame: number;
  x: number;
  y: number;
  zoom: number;
}

export interface CameraProps {
  waypoints: CameraWaypoint[];
  children: React.ReactNode;
}

export const Camera: React.FC<CameraProps> = ({ waypoints, children }) => {
  const frame = useCurrentFrame();

  // Find surrounding waypoints
  let prevW = waypoints[0];
  let nextW = waypoints[0];

  for (let i = 0; i < waypoints.length; i++) {
    if (frame >= waypoints[i].frame) {
      prevW = waypoints[i];
      nextW = waypoints[Math.min(i + 1, waypoints.length - 1)];
    } else {
      break;
    }
  }

  // Snappy transition: 14 frames transition window with easeOutExpo
  const transDur = 14;
  const startF = nextW.frame;
  const progress = interpolate(frame, [startF, startF + transDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Snappy easeOutExpo (cubic-bezier(0.16, 1, 0.3, 1))
  const easeOut = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const eased = easeOut(progress);

  // Interpolate between prev and next waypoint
  const currentX = prevW.x + (nextW.x - prevW.x) * eased;
  const currentY = prevW.y + (nextW.y - prevW.y) * eased;
  const currentZ = prevW.zoom + (nextW.zoom - prevW.zoom) * eased;

  // Subtle continuous push (1.00 -> 1.02 over the beat)
  const subtlePush = 1 + (frame % 60) * 0.0003;

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        transformOrigin: "960px 540px",
        transform: `scale(${currentZ * subtlePush}) translate(${currentX}px, ${currentY}px)`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};
