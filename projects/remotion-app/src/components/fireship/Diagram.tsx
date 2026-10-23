import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { TOKENS } from "../../design-system/tokens";

export interface DiagramNode {
  id: string;
  label: string;
  sub?: string;
  x: number; // percentage (0-100) or pixel
  y: number; // percentage (0-100) or pixel
  triggerFrame: number;
  color?: string;
}

export interface DiagramArrow {
  fromId: string;
  toId: string;
  label?: string;
  triggerFrame: number;
  curve?: "straight" | "arcUp" | "arcDown";
}

export type DiagramInAnimation = "stepDraw" | "zoomPop";
export type DiagramOutAnimation = "scaleDown" | "slideDown" | "fadeOut";

interface DiagramProps {
  nodes: DiagramNode[];
  arrows: DiagramArrow[];
  inAnimation?: DiagramInAnimation;
  outAnimation?: DiagramOutAnimation;
  inDuration?: number;
  outDuration?: number;
  durationInFrames: number;
  style?: React.CSSProperties;
}

export const Diagram: React.FC<DiagramProps> = ({
  nodes,
  arrows,
  inAnimation = "stepDraw",
  outAnimation = "scaleDown",
  inDuration = 10,
  outDuration = 6,
  durationInFrames,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exitStartFrame = durationInFrames - outDuration;
  const isExiting = frame >= exitStartFrame;
  const exitProgress = isExiting
    ? Math.min(1, Math.max(0, (frame - exitStartFrame) / outDuration))
    : 0;

  let exitTransform = "";
  let exitOpacity = 1;

  if (isExiting) {
    switch (outAnimation) {
      case "scaleDown":
        exitTransform = `scale(${interpolate(exitProgress, [0, 1], [1, 0.4])})`;
        exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
        break;
      case "slideDown":
        exitTransform = `translateY(${interpolate(exitProgress, [0, 1], [0, 200])}px)`;
        exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
        break;
      case "fadeOut":
        exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
        break;
    }
  }

  // Lookup node coordinates
  const nodeMap = new Map<string, DiagramNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  return (
    <div
      style={{
        position: "relative",
        width: 1500,
        height: 750,
        margin: "0 auto",
        transform: exitTransform,
        opacity: exitOpacity,
        zIndex: 10,
        ...style,
      }}
    >
      {/* SVG canvas for animated connecting arrows */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1500 750"
        fill="none"
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <defs>
          <marker
            id="arrowhead-yellow"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={TOKENS.colors.accentYellow} />
          </marker>
          <marker
            id="arrowhead-blue"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={TOKENS.colors.accentBlue} />
          </marker>
        </defs>

        {arrows.map((arr, idx) => {
          const fromNode = nodeMap.get(arr.fromId);
          const toNode = nodeMap.get(arr.toId);
          if (!fromNode || !toNode) return null;

          const arrowSpring = spring({
            frame: Math.max(0, frame - arr.triggerFrame),
            fps,
            config: { damping: 14, mass: 0.5, stiffness: 180 },
          });

          const drawProgress = interpolate(arrowSpring, [0, 1], [0, 1]);

          const x1 = (fromNode.x / 100) * 1500;
          const y1 = (fromNode.y / 100) * 750;
          const x2 = (toNode.x / 100) * 1500;
          const y2 = (toNode.y / 100) * 750;

          // Midpoint for curve
          const midX = (x1 + x2) / 2;
          const midY =
            arr.curve === "arcUp"
              ? Math.min(y1, y2) - 80
              : arr.curve === "arcDown"
              ? Math.max(y1, y2) + 80
              : (y1 + y2) / 2;

          const pathD = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;

          return (
            <g key={idx}>
              <path
                d={pathD}
                stroke={TOKENS.colors.accentYellow}
                strokeWidth="4"
                strokeDasharray="1000"
                strokeDashoffset={interpolate(drawProgress, [0, 1], [1000, 0])}
                strokeLinecap="round"
                markerEnd="url(#arrowhead-yellow)"
              />
              {arr.label && drawProgress > 0.6 && (
                <text
                  x={midX}
                  y={midY - 14}
                  fill={TOKENS.colors.accentYellow}
                  fontFamily={TOKENS.typography.handwritten}
                  fontSize="24"
                  textAnchor="middle"
                >
                  {arr.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => {
        const nodeSpring = spring({
          frame: Math.max(0, frame - node.triggerFrame),
          fps,
          config: TOKENS.animation.springs.popIn,
        });

        const scale = interpolate(nodeSpring, [0, 1], [0.2, 1]);
        const opacity = interpolate(nodeSpring, [0, 0.4, 1], [0, 0.8, 1]);
        const nodeColor = node.color ?? TOKENS.colors.accentBlue;

        return (
          <div
            key={node.id}
            style={{
              position: "absolute",
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity,
              backgroundColor: TOKENS.colors.surfaceDark,
              border: `3px solid ${nodeColor}`,
              borderRadius: 20,
              padding: "18px 36px",
              boxShadow: `0 15px 40px rgba(0, 0, 0, 0.7), 0 0 25px ${nodeColor}44`,
              textAlign: "center",
              minWidth: 220,
              zIndex: 5,
            }}
          >
            <div
              style={{
                fontFamily: TOKENS.typography.headline,
                fontSize: 32,
                color: TOKENS.colors.text,
                letterSpacing: 0.5,
              }}
            >
              {node.label}
            </div>
            {node.sub && (
              <div
                style={{
                  fontFamily: TOKENS.typography.body,
                  fontSize: 18,
                  color: "rgba(255, 255, 255, 0.7)",
                  marginTop: 4,
                }}
              >
                {node.sub}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
