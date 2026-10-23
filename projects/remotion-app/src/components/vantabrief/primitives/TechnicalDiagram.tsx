import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { TOKENS } from "../../../design-system/tokens";

export interface DiagramNode {
  id: string;
  label: string;
  sublabel?: string;
  status?: "pending" | "active" | "complete" | "highlight";
  accentColor?: string;
}

export interface TechnicalDiagramProps {
  title?: string;
  nodes: DiagramNode[];
  mode?: "pipeline" | "comparison" | "hierarchy";
  staggerFrames?: number;
  width?: number;
  style?: React.CSSProperties;
}

export const TechnicalDiagram: React.FC<TechnicalDiagramProps> = ({
  title,
  nodes,
  mode = "pipeline",
  staggerFrames = 8,
  width = 1200,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width,
        maxWidth: "92%",
        margin: "0 auto",
        ...style,
      }}
    >
      {/* Optional Diagram Title / Scope */}
      {title && (
        <div
          style={{
            fontFamily: TOKENS.typography.code,
            fontSize: 20,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: TOKENS.colors.primary,
            marginBottom: 36,
            borderBottom: `1px solid ${TOKENS.colors.borderSubtle}`,
            paddingBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ color: TOKENS.colors.accentYellow }}>●</span>
          {title}
        </div>
      )}

      {/* Nodes Container */}
      <div
        style={{
          display: "flex",
          flexDirection: mode === "comparison" ? "row" : "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
          position: "relative",
          width: "100%",
        }}
      >
        {nodes.map((node, idx) => {
          const nodeDelay = idx * staggerFrames;
          const nodeFrame = Math.max(0, frame - nodeDelay);

          const spr = spring({
            frame: nodeFrame,
            fps,
            config: TOKENS.motion.springs.card,
          });

          const scale = interpolate(spr, [0, 1], [0.85, 1]);
          const translateY = interpolate(spr, [0, 1], [25, 0]);
          const opacity = interpolate(spr, [0, 0.4, 1], [0, 0.9, 1]);

          const nodeColor =
            node.accentColor ||
            (node.status === "active"
              ? TOKENS.colors.primary
              : node.status === "highlight"
              ? TOKENS.colors.accentYellow
              : node.status === "complete"
              ? TOKENS.colors.accentGreen
              : TOKENS.colors.textPrimary);

          return (
            <React.Fragment key={node.id}>
              {/* Connector line between nodes */}
              {idx > 0 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    backgroundColor: TOKENS.colors.borderSubtle,
                    position: "relative",
                    overflow: "hidden",
                    minWidth: 40,
                  }}
                >
                  {/* Moving signal pulse along connector */}
                  <div
                    style={{
                      position: "absolute",
                      top: -1,
                      left: `${((frame * 2 + idx * 30) % 100)}%`,
                      width: 24,
                      height: 4,
                      backgroundColor: TOKENS.colors.primary,
                      borderRadius: 2,
                      boxShadow: `0 0 10px ${TOKENS.colors.primary}`,
                    }}
                  />
                </div>
              )}

              {/* Node Card */}
              <div
                style={{
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  opacity,
                  backgroundColor: TOKENS.colors.surfaceElevated,
                  borderRadius: 14,
                  padding: "24px 32px",
                  border: `2px solid ${node.status === "active" || node.status === "highlight" ? nodeColor : TOKENS.colors.borderSubtle}`,
                  boxShadow: `0 16px 40px ${TOKENS.colors.stickerShadow}, 0 0 24px ${nodeColor}22`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: 200,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: TOKENS.typography.code,
                    fontSize: 14,
                    color: TOKENS.colors.textMuted,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  Step 0{idx + 1}
                </div>
                <div
                  style={{
                    fontFamily: TOKENS.typography.displayHeadline,
                    fontSize: 28,
                    fontWeight: 800,
                    color: nodeColor,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {node.label}
                </div>
                {node.sublabel && (
                  <div
                    style={{
                      marginTop: 8,
                      fontFamily: TOKENS.typography.body,
                      fontSize: 16,
                      color: TOKENS.colors.textMuted,
                    }}
                  >
                    {node.sublabel}
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
