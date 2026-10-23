import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface MapWaypoint {
  name: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  info?: string;
}

export interface AnimatedMapTheme {
  background: string;
  surface: string;
  routeColor: string;
  glowColor: string;
  accentColor: string;
  textPrimary: string;
  textMuted: string;
  fontFamily: string;
}

export interface AnimatedMapProps {
  title?: string;
  subtitle?: string;
  waypoints?: MapWaypoint[];
  theme?: Partial<AnimatedMapTheme>;
}

const DEFAULT_WAYPOINTS: MapWaypoint[] = [
  { name: "Alpha Hub", x: 25, y: 65, info: "Origin Node" },
  { name: "Beta Gateway", x: 48, y: 45, info: "Transit Relay" },
  { name: "Gamma Terminal", x: 75, y: 30, info: "Destination" },
];

export const AnimatedMap: React.FC<AnimatedMapProps> = ({
  title = "Network Corridor",
  subtitle = "Dynamic Geographic Pipeline",
  waypoints = DEFAULT_WAYPOINTS,
  theme = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Resolved channel theme tokens (default to modern tech dark)
  const bg = theme.background || "#070A12";
  const surface = theme.surface || "#0F172A";
  const routeColor = theme.routeColor || "#3B82F6";
  const glowColor = theme.glowColor || "rgba(59, 130, 246, 0.4)";
  const accent = theme.accentColor || "#10B981";
  const textPrimary = theme.textPrimary || "#F8FAFC";
  const textMuted = theme.textMuted || "#94A3B8";
  const fontFamily = theme.fontFamily || "'Inter', sans-serif";

  // Spring entrances
  const entrance = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const mapOpacity = interpolate(entrance, [0, 1], [0, 1]);
  const mapScale = interpolate(entrance, [0, 1], [0.94, 1]);

  // Route drawing progress (frames 15 to 70)
  const drawProgress = interpolate(frame, [15, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Calculate SVG polyline points
  const pointsString = waypoints.map((w) => `${w.x * 10},${w.y * 6}`).join(" ");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
        color: textPrimary,
      }}
    >
      {/* Background Cartographic Grid Lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.15,
          backgroundImage: `
            linear-gradient(to right, ${routeColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${routeColor} 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Main Map Visual Container */}
      <div
        style={{
          width: "1400px",
          height: "800px",
          borderRadius: "28px",
          backgroundColor: surface,
          border: `1px solid rgba(255, 255, 255, 0.1)`,
          boxShadow: `0 30px 80px -20px rgba(0, 0, 0, 0.8), 0 0 50px ${glowColor}`,
          padding: "44px 52px",
          display: "flex",
          flexDirection: "column",
          opacity: mapOpacity,
          transform: `scale(${mapScale})`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Header Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 10 }}>
          <div>
            <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.15em", color: accent, fontWeight: 700, marginBottom: "6px" }}>
              GEOGRAPHIC ROUTE OVERVIEW
            </div>
            <h1 style={{ fontSize: "36px", fontWeight: 800, margin: 0, color: textPrimary }}>
              {title}
            </h1>
            <p style={{ fontSize: "16px", color: textMuted, margin: "4px 0 0 0" }}>
              {subtitle}
            </p>
          </div>

          <div
            style={{
              padding: "10px 18px",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              fontSize: "14px",
              fontWeight: 600,
              color: textPrimary,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: accent }} />
            <span>ACTIVE WAYPOINTS: {waypoints.length}</span>
          </div>
        </div>

        {/* Interactive Vector Canvas Area */}
        <div style={{ flex: 1, position: "relative", marginTop: "20px" }}>
          <svg
            viewBox="0 0 1000 600"
            style={{ width: "100%", height: "100%", overflow: "visible" }}
          >
            {/* Background Glow Path */}
            <polyline
              points={pointsString}
              fill="none"
              stroke={glowColor}
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.6}
            />

            {/* Dotted Guideline */}
            <polyline
              points={pointsString}
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="2"
              strokeDasharray="6 6"
            />

            {/* Animated Solid Route Line */}
            <polyline
              points={pointsString}
              fill="none"
              stroke={routeColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2000"
              strokeDashoffset={2000 * (1 - drawProgress)}
            />

            {/* Animated Waypoint Markers */}
            {waypoints.map((wp, i) => {
              const markerAppearFrame = 20 + i * 18;
              const markerSpring = spring({
                frame: frame - markerAppearFrame,
                fps,
                config: { damping: 10, mass: 0.5 },
              });
              const markerScale = interpolate(markerSpring, [0, 1], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

              const cx = wp.x * 10;
              const cy = wp.y * 6;

              return (
                <g key={i} transform={`translate(${cx}, ${cy}) scale(${markerScale})`}>
                  {/* Outer Pulsing Ring */}
                  <circle r="18" fill={glowColor} opacity={0.3} />
                  {/* Pin Circle */}
                  <circle r="9" fill={surface} stroke={accent} strokeWidth="3" />
                  <circle r="4" fill={accent} />

                  {/* Waypoint Label Box */}
                  <foreignObject x="-90" y="16" width="180" height="70">
                    <div
                      style={{
                        backgroundColor: "rgba(10, 15, 25, 0.85)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "8px",
                        padding: "6px 10px",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "12px", fontWeight: 700, color: textPrimary, whiteSpace: "nowrap" }}>
                        {wp.name}
                      </div>
                      {wp.info && (
                        <div style={{ fontSize: "10px", color: textMuted, marginTop: "2px" }}>
                          {wp.info}
                        </div>
                      )}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
