import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { TOKENS } from "../../design-system/tokens";

// 1. EmojiPop: Big graphic emoji popping with overshoot and wobble
export const EmojiPop: React.FC<{
  emoji: string;
  size?: number;
  triggerFrame?: number;
  rotation?: number;
  style?: React.CSSProperties;
}> = ({ emoji, size = 120, triggerFrame = 0, rotation = -6, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const animSpring = spring({
    frame: Math.max(0, frame - triggerFrame),
    fps,
    config: TOKENS.animation.springs.punchy,
  });

  const floatY = Math.sin(frame * 0.1) * 8;
  const scale = interpolate(animSpring, [0, 1], [0.1, 1]);
  const rot = interpolate(animSpring, [0, 1], [rotation * 3, rotation]);

  return (
    <div
      style={{
        display: "inline-block",
        fontSize: size,
        lineHeight: 1,
        transform: `scale(${scale}) rotate(${rot}deg) translateY(${floatY}px)`,
        transformOrigin: "center center",
        filter: "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.6))",
        zIndex: 25,
        ...style,
      }}
    >
      {emoji}
    </div>
  );
};

// 2. Hand-drawn Arrow
export const HandDrawnArrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  triggerFrame?: number;
}> = ({ x1, y1, x2, y2, color = TOKENS.colors.accentYellow, triggerFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drawSpring = spring({
    frame: Math.max(0, frame - triggerFrame),
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 200 },
  });

  const progress = interpolate(drawSpring, [0, 1], [0, 1]);

  return (
    <svg
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 30 }}
    >
      <defs>
        <marker
          id={`arrow-${color.replace("#", "")}`}
          markerWidth="12"
          markerHeight="9"
          refX="10"
          refY="4.5"
          orient="auto"
        >
          <polygon points="0 0, 12 4.5, 0 9" fill={color} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="800"
        strokeDashoffset={interpolate(progress, [0, 1], [800, 0])}
        markerEnd={`url(#arrow-${color.replace("#", "")})`}
      />
    </svg>
  );
};

// 3. Hand-drawn Circle
export const HandDrawnCircle: React.FC<{
  width: number;
  height: number;
  color?: string;
  triggerFrame?: number;
  style?: React.CSSProperties;
}> = ({ width, height, color = TOKENS.colors.accentPink, triggerFrame = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drawSpring = spring({
    frame: Math.max(0, frame - triggerFrame),
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 190 },
  });

  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        pointerEvents: "none",
        zIndex: 30,
        ...style,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
        <path
          d="M 50 8 C 85 8, 95 35, 92 65 C 88 92, 45 96, 20 88 C 6 80, 5 35, 25 15 C 35 6, 65 4, 78 12"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="400"
          strokeDashoffset={interpolate(drawSpring, [0, 1], [400, 0])}
        />
      </svg>
    </div>
  );
};

// 4. Strikethrough Slash
export const Strikethrough: React.FC<{
  width: number;
  color?: string;
  triggerFrame?: number;
  style?: React.CSSProperties;
}> = ({ width, color = TOKENS.colors.accentPink, triggerFrame = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drawSpring = spring({
    frame: Math.max(0, frame - triggerFrame),
    fps,
    config: { damping: 12, mass: 0.4, stiffness: 240 },
  });

  return (
    <div
      style={{
        position: "absolute",
        width,
        height: 8,
        backgroundColor: color,
        transformOrigin: "left center",
        transform: `scaleX(${interpolate(drawSpring, [0, 1], [0, 1])}) rotate(-5deg)`,
        borderRadius: 4,
        boxShadow: `0 0 12px ${color}`,
        zIndex: 35,
        ...style,
      }}
    />
  );
};

// 5. Shake Wrapper (high energy camera shake on emphasis words)
export const Shake: React.FC<{
  children: React.ReactNode;
  triggerFrame?: number;
  intensity?: number;
  duration?: number;
}> = ({ children, triggerFrame = 0, intensity = 1.0, duration = 12 }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - triggerFrame;

  let x = 0;
  let y = 0;
  let rot = 0;

  if (localFrame >= 0 && localFrame < duration) {
    const decay = 1 - localFrame / duration;
    x = Math.sin(localFrame * 3.5) * 14 * intensity * decay;
    y = Math.cos(localFrame * 4.2) * 10 * intensity * decay;
    rot = Math.sin(localFrame * 2.8) * 2.5 * intensity * decay;
  }

  return (
    <div
      style={{
        transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
        display: "inline-block",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};

// 6. ZoomPunch Wrapper (sudden punch zoom on hit)
export const ZoomPunch: React.FC<{
  children: React.ReactNode;
  triggerFrame?: number;
  scaleAmount?: number;
  duration?: number;
}> = ({ children, triggerFrame = 0, scaleAmount = 1.25, duration = 8 }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - triggerFrame;

  let scale = 1.0;
  if (localFrame >= 0 && localFrame < duration) {
    const progress = localFrame / duration;
    // Fast spike up then return
    scale = interpolate(progress, [0, 0.25, 1], [1.0, scaleAmount, 1.0]);
  }

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        display: "inline-block",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};
