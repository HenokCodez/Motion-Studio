import React, { useMemo } from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import { loadFont } from "@remotion/google-fonts/Montserrat";

// Load Montserrat with ExtraBold (800) and Medium (500)
const { fontFamily } = loadFont("normal", {
  weights: ["500", "800"],
  subsets: ["latin"],
});

// Edit timeline labels easily here:
export const LABELS = ["subscribe", "to", "the", "channel", "for", "more"];

interface NodeData {
  label: string;
  index: number;
  x: number;
  y: number;
}

export const ContentWorkflow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Geometry configuration
  const startPoint = useMemo(() => ({ x: 960, y: 170 }), []);
  const leftX = 640;
  const rightX = 1280;
  const startY = 360;
  const spacingY = 340;

  // Nodes alternating left and right of center
  const nodes: NodeData[] = useMemo(() => {
    return LABELS.map((label, index) => ({
      label,
      index,
      x: index % 2 === 0 ? leftX : rightX,
      y: startY + index * spacingY,
    }));
  }, [leftX, rightX, startY, spacingY]);

  const lastNode = nodes[nodes.length - 1];
  const endPoint = useMemo(
    () => ({ x: 960, y: (lastNode ? lastNode.y : startY) + 240 }),
    [lastNode, startY]
  );

  // Build the complete smooth S-curve SVG path
  const fullPathD = useMemo(() => {
    let d = `M ${startPoint.x} ${startPoint.y}`;
    let prev = startPoint;

    for (const node of nodes) {
      const midY = (prev.y + node.y) / 2;
      d += ` C ${prev.x} ${midY}, ${node.x} ${midY}, ${node.x} ${node.y}`;
      prev = node;
    }

    const finalMidY = (prev.y + endPoint.y) / 2;
    d += ` C ${prev.x} ${finalMidY}, ${endPoint.x} ${finalMidY}, ${endPoint.x} ${endPoint.y}`;
    return d;
  }, [startPoint, nodes, endPoint]);

  // Total path length
  const totalLength = useMemo(() => getLength(fullPathD), [fullPathD]);

  // Compute fractional position along the path for each node
  const nodeFractions = useMemo(() => {
    return nodes.map((_, index) => {
      let subD = `M ${startPoint.x} ${startPoint.y}`;
      let p = startPoint;
      for (let j = 0; j <= index; j++) {
        const nj = nodes[j];
        const midY = (p.y + nj.y) / 2;
        subD += ` C ${p.x} ${midY}, ${nj.x} ${midY}, ${nj.x} ${nj.y}`;
        p = nj;
      }
      return getLength(subD) / totalLength;
    });
  }, [nodes, startPoint, totalLength]);

  // Timing: Title starts at 0, line draws from frame 20 to 300, hold until 360
  const LINE_START_FRAME = 20;
  const LINE_END_FRAME = 300;

  // Exact arrival frame for each node along the eased progress
  const arrivalFrames = useMemo(() => {
    return nodeFractions.map((fraction) => {
      for (let f = LINE_START_FRAME; f <= LINE_END_FRAME; f++) {
        const prog = interpolate(
          f,
          [LINE_START_FRAME, LINE_END_FRAME],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.28, 0.1, 0.28, 1),
          }
        );
        if (prog >= fraction) {
          return f;
        }
      }
      return LINE_END_FRAME;
    });
  }, [nodeFractions]);

  // Progressive line drawing progress
  const lineProgress = interpolate(
    frame,
    [LINE_START_FRAME, LINE_END_FRAME],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.28, 0.1, 0.28, 1),
    }
  );

  // Evolve SVG path
  const evolution = useMemo(() => {
    return evolvePath(lineProgress, fullPathD);
  }, [lineProgress, fullPathD]);

  // Current drawing head position
  const headPoint = useMemo(() => {
    if (lineProgress <= 0 || lineProgress >= 1) {
      return null;
    }
    return getPointAtLength(fullPathD, lineProgress * totalLength);
  }, [lineProgress, fullPathD, totalLength]);

  // Camera scroll tracking: follows the timeline downwards smoothly
  // Keep active nodes framed nicely; settles with a solid hold
  const totalContentHeight = endPoint.y + 120;
  const maxScrollY = Math.max(0, totalContentHeight - height + 40);

  const cameraY = interpolate(
    frame,
    [50, LINE_END_FRAME],
    [0, maxScrollY],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.28, 0.1, 0.28, 1),
    }
  );

  // Title entrance: fades and slides in during the first second (0 to 30 frames)
  const titleOpacity = interpolate(frame, [0, 24], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleTranslateY = interpolate(frame, [0, 28], [-32, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        backgroundColor: "#141414",
        overflow: "hidden",
        fontFamily,
      }}
    >
      {/* BACKGROUND: Near-black (#141414) with soft violet glows rising from bottom corners */}
      <div
        style={{
          position: "absolute",
          left: -150,
          bottom: -150,
          width: 900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(106, 47, 192, 0.3) 0%, rgba(106, 47, 192, 0.12) 42%, rgba(106, 47, 192, 0) 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -150,
          bottom: -150,
          width: 900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(106, 47, 192, 0.3) 0%, rgba(106, 47, 192, 0.12) 42%, rgba(106, 47, 192, 0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Camera Scrolling Container for the timeline and pills */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: totalContentHeight,
          transform: `translateY(-${cameraY}px)`,
          willChange: "transform",
        }}
      >
        {/* SVG S-Curve Timeline Line */}
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: totalContentHeight,
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          <defs>
            <filter
              id="violet-line-glow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ambient soft glow beneath the path */}
          <path
            d={fullPathD}
            fill="none"
            stroke="#6a2fc0"
            strokeWidth={9}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.4}
            strokeDasharray={evolution.strokeDasharray}
            strokeDashoffset={evolution.strokeDashoffset}
            filter="url(#violet-line-glow)"
          />

          {/* Core thin violet line (#5b4bd6, ~3px) */}
          <path
            d={fullPathD}
            fill="none"
            stroke="#5b4bd6"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={evolution.strokeDasharray}
            strokeDashoffset={evolution.strokeDashoffset}
          />

          {/* Glowing particle at the leading tip of the line */}
          {headPoint && (
            <g transform={`translate(${headPoint.x}, ${headPoint.y})`}>
              <circle
                r={10}
                fill="#6a2fc0"
                opacity={0.65}
                filter="url(#violet-line-glow)"
              />
              <circle r={5} fill="#d4c5f9" opacity={0.95} />
              <circle r={2.5} fill="#ffffff" />
            </g>
          )}

          {/* Terminal accent dot at the line end */}
          {lineProgress >= 0.999 && (
            <g transform={`translate(${endPoint.x}, ${endPoint.y})`}>
              <circle r={8} fill="#6a2fc0" opacity={0.5} />
              <circle r={4} fill="#d4c5f9" />
            </g>
          )}
        </svg>

        {/* Pill-Shaped Nodes */}
        {nodes.map((node) => {
          const arrivalFrame = arrivalFrames[node.index];
          const framesSinceArrival = frame - arrivalFrame;
          const isArrived = framesSinceArrival >= 0;

          // Pop in with spring (slight overshoot)
          const popSpring = spring({
            frame: Math.max(0, framesSinceArrival),
            fps,
            config: {
              damping: 11,
              mass: 0.55,
              stiffness: 110,
              overshootClamping: false,
            },
          });

          // Blurs on arrival and sharpens to 0 as it settles
          const blur = interpolate(framesSinceArrival, [0, 10], [16, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const scale = isArrived
            ? interpolate(popSpring, [0, 1], [0.3, 1])
            : 0;

          // Smooth fade out as nodes scroll up towards the header area
          const screenY = node.y - cameraY;
          const topExitOpacity = interpolate(screenY, [120, 220], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const opacity = isArrived
            ? interpolate(framesSinceArrival, [0, 4], [0, 1], {
                extrapolateRight: "clamp",
              }) * topExitOpacity
            : 0;

          if (!isArrived && opacity <= 0) {
            return null;
          }

          return (
            <div
              key={node.index}
              style={{
                position: "absolute",
                left: node.x,
                top: node.y,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity,
                filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
                borderRadius: 9999,
                background:
                  "linear-gradient(90deg, #2a1050 0%, #6a2fc0 100%)",
                border: "2px solid #d4c5f9",
                boxShadow:
                  "0 0 24px rgba(106, 47, 192, 0.6), 0 8px 30px rgba(0, 0, 0, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.35)",
                padding: "16px 42px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
                zIndex: 10,
              }}
            >
              {/* Subtle top inner highlight */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 14,
                  right: 14,
                  height: "46%",
                  borderRadius: "9999px 9999px 0 0",
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 100%)",
                  pointerEvents: "none",
                }}
              />
              <span
                style={{
                  position: "relative",
                  fontFamily,
                  fontWeight: 500,
                  fontSize: 27,
                  color: "#ffffff",
                  textTransform: "lowercase",
                  letterSpacing: "0.02em",
                  lineHeight: 1,
                }}
              >
                {node.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Top subtle vignette behind header to ensure clean contrast when timeline scrolls underneath */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 140,
          background:
            "linear-gradient(to bottom, rgba(20, 20, 20, 0.9) 0%, rgba(20, 20, 20, 0.5) 60%, rgba(20, 20, 20, 0) 100%)",
          pointerEvents: "none",
          zIndex: 18,
        }}
      />

      {/* TITLE: "CONTENT WORKFLOW" at the top center, Montserrat ExtraBold, layered white glow */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleTranslateY}px)`,
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily,
            fontWeight: 800,
            fontSize: 46,
            letterSpacing: "0.16em",
            color: "#ffffff",
            textTransform: "uppercase",
            textShadow:
              "0 0 10px rgba(255, 255, 255, 0.8), 0 0 25px rgba(255, 255, 255, 0.45), 0 0 50px rgba(106, 47, 192, 0.5)",
          }}
        >
          CONTENT WORKFLOW
        </h1>
      </div>
    </div>
  );
};
