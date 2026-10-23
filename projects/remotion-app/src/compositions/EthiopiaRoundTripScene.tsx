import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";
import { getLength, getPointAtLength, getTangentAtLength } from "@remotion/paths";
import mapData from "../assets/ethiopiaMapData.json";
import { VehicleOnRoute } from "../components/byd/VehicleOnRoute";
import { MapMarker } from "../components/byd/MapMarker";
import { AnimatedCounter } from "../components/byd/AnimatedCounter";
import { ProgressBar } from "../components/byd/ProgressBar";
import { fontFamily, COLORS } from "../components/byd/fonts";

export const EthiopiaRoundTripScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Total length of the road route SVG path
  const routeLength = useMemo(() => {
    return getLength(mapData.routeSvg);
  }, []);

  const safeTangent = (dist: number) => {
    const tan = getTangentAtLength(mapData.routeSvg, dist);
    return tan ?? { x: 0, y: -1 };
  };

  const safePoint = (dist: number) => {
    const pt = getPointAtLength(mapData.routeSvg, dist);
    return pt ?? { x: mapData.addisPt[0], y: mapData.addisPt[1] };
  };

  // -------------------------------------------------------------
  // Timeline Breakdown (150 frames = 5.0 seconds at 30 FPS)
  // -------------------------------------------------------------
  // 0:00 - 0:00.7 (Frames 0 - 21):   Establish map, Addis Ababa marker pulses
  // 0:00.7 - 0:02.0 (Frames 21 - 60): Vehicle travels north to Bahir Dar (0 -> 482 km)
  // 0:02.0 - 0:02.6 (Frames 60 - 78): Arrival at Bahir Dar, destination pulse, 482 km
  // 0:02.6 - 0:04.0 (Frames 78 - 120): Vehicle returns to Addis Ababa (482 -> 964 km)
  // 0:04.0 - 0:05.0 (Frames 120 - 150): Final payoff, complete route, 964 km ROUND TRIP & 2,100 km range

  // 1. Scene Entrance Fade
  const sceneOpacity = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Outbound Progress (0 -> 1 along path from Addis to Bahir Dar)
  const outboundProgress = interpolate(frame, [21, 60], [0, 1], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 3. Return Progress (1 -> 0 along path from Bahir Dar back to Addis)
  const returnProgress = interpolate(frame, [78, 120], [1, 0], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isReturning = frame >= 78;
  const hasReturned = frame >= 120;

  // Current vehicle distance along path
  let currentPathDist = 0;
  let vehicleAngle = -90;

  if (frame < 21) {
    // Parked at Addis Ababa
    currentPathDist = 0;
    const tan = safeTangent(1);
    vehicleAngle = Math.atan2(tan.y, tan.x) * (180 / Math.PI);
  } else if (frame < 60) {
    // Traveling outbound to Bahir Dar
    currentPathDist = outboundProgress * routeLength;
    const sampleDist = Math.max(1, Math.min(routeLength - 1, currentPathDist));
    const tan = safeTangent(sampleDist);
    vehicleAngle = Math.atan2(tan.y, tan.x) * (180 / Math.PI);
  } else if (frame < 78) {
    // Arrived at Bahir Dar & turning around
    currentPathDist = routeLength;
    const tan = safeTangent(routeLength - 1);
    const arrivalAngle = Math.atan2(tan.y, tan.x) * (180 / Math.PI); // ~ -90 deg
    const turnT = interpolate(frame, [64, 76], [0, 1], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    vehicleAngle = arrivalAngle + turnT * 180;
  } else if (frame < 120) {
    // Traveling return leg back to Addis Ababa
    currentPathDist = returnProgress * routeLength;
    const sampleDist = Math.max(1, Math.min(routeLength - 1, currentPathDist));
    const tan = safeTangent(sampleDist);
    // Facing opposite direction along path
    vehicleAngle = Math.atan2(-tan.y, -tan.x) * (180 / Math.PI);
  } else {
    // Returned to Addis Ababa
    currentPathDist = 0;
    const tan = safeTangent(1);
    vehicleAngle = Math.atan2(-tan.y, -tan.x) * (180 / Math.PI);
  }

  // Exact vehicle position
  const vehiclePos = safePoint(currentPathDist);

  // 4. Distance Counter Logic
  let displayKm = 0;
  let distancePhaseLabel = "ONE WAY";

  if (frame < 21) {
    displayKm = 0;
    distancePhaseLabel = "ONE WAY";
  } else if (frame < 60) {
    displayKm = interpolate(frame, [21, 60], [0, 482], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    distancePhaseLabel = "ONE WAY";
  } else if (frame < 78) {
    displayKm = 482;
    distancePhaseLabel = "ONE WAY";
  } else if (frame < 120) {
    displayKm = interpolate(frame, [78, 120], [482, 964], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    distancePhaseLabel = "ROUND TRIP";
  } else {
    displayKm = 964;
    distancePhaseLabel = "ROUND TRIP";
  }

  // 5. Dynamic Camera Framing
  // Zooms smoothly and tracks route, then eases out slightly at 0:04-0:05 to reveal the full journey
  const cameraZoom = interpolate(
    frame,
    [0, 25, 60, 78, 115, 135],
    [1.4, 1.45, 1.5, 1.5, 1.35, 1.18],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const cameraTargetX = interpolate(
    frame,
    [0, 25, 60, 78, 115, 135],
    [589, 580, 500, 500, 560, 620],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const cameraTargetY = interpolate(
    frame,
    [0, 25, 60, 78, 115, 135],
    [545, 520, 360, 360, 500, 470],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Markers
  const addisPulse = (frame % 30) / 30;
  const bahirDarPulse = frame >= 60 ? ((frame - 60) % 30) / 30 : 0;
  const showBahirDarMarker = frame >= 24;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#06080B",
        opacity: sceneOpacity,
        overflow: "hidden",
        fontFamily,
      }}
    >
      {/* ======================================================== */}
      {/* MAP VIEWPORT & CAMERA CONTAINER                          */}
      {/* ======================================================== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `${cameraTargetX}px ${cameraTargetY}px`,
          transform: `scale(${cameraZoom})`,
          transition: "none",
        }}
      >
        {/* SVG Topographic Base Map */}
        <svg
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            {/* Ethiopia landmass fill gradient */}
            <linearGradient id="ethiopiaLandGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#18241D" />
              <stop offset="50%" stopColor="#1B2B21" />
              <stop offset="100%" stopColor="#141E18" />
            </linearGradient>

            {/* Lake water gradient */}
            <linearGradient id="lakeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B3045" />
              <stop offset="100%" stopColor="#061D2B" />
            </linearGradient>

            {/* Route glow filter */}
            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Ocean/Neighboring region tone */}
          <rect width="1920" height="1080" fill="#0A0D12" />

          {/* Subtle Geographic Latitude / Longitude Grid */}
          <g opacity={0.12} stroke="#FFFFFF" strokeWidth="0.8">
            {/* Latitude parallels */}
            <line x1="0" y1="200" x2="1920" y2="200" strokeDasharray="4 4" />
            <line x1="0" y1="380" x2="1920" y2="380" strokeDasharray="4 4" />
            <line x1="0" y1="560" x2="1920" y2="560" strokeDasharray="4 4" />
            <line x1="0" y1="740" x2="1920" y2="740" strokeDasharray="4 4" />

            {/* Longitude meridians */}
            <line x1="400" y1="0" x2="400" y2="1080" strokeDasharray="4 4" />
            <line x1="600" y1="0" x2="600" y2="1080" strokeDasharray="4 4" />
            <line x1="800" y1="0" x2="800" y2="1080" strokeDasharray="4 4" />
            <line x1="1000" y1="0" x2="1000" y2="1080" strokeDasharray="4 4" />
          </g>

          {/* Ethiopia Country Boundary Fill */}
          <path
            d={mapData.etBorderSvg}
            fill="url(#ethiopiaLandGrad)"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="1.5"
            style={{ filter: "drop-shadow(0 0 40px rgba(0, 0, 0, 0.9))" }}
          />

          {/* Secondary Ethiopian Regional Road Network (subtle gray tracks) */}
          <g opacity={0.25} stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1">
            {/* Addis to Hawassa / South */}
            <path d="M 589 545 Q 610 620 630 680" strokeDasharray="3 3" />
            {/* Addis to Dire Dawa / East */}
            <path d="M 589 545 Q 700 530 820 510" strokeDasharray="3 3" />
            {/* Addis to Jimma / Southwest */}
            <path d="M 589 545 Q 520 580 470 610" strokeDasharray="3 3" />
            {/* Bahir Dar to Gondar / North */}
            <path d="M 490 356 Q 485 300 488 270" strokeDasharray="3 3" />
          </g>

          {/* Water Bodies */}
          {/* Lake Tana at Bahir Dar */}
          <path
            d={mapData.tanaSvg}
            fill="url(#lakeGrad)"
            stroke="#00D2FF"
            strokeWidth="1.2"
            opacity={0.85}
          />
          {/* Southern Lakes (Abaya & Chamo) */}
          <path
            d={mapData.abayaSvg}
            fill="url(#lakeGrad)"
            stroke="rgba(0, 210, 255, 0.4)"
            strokeWidth="0.8"
            opacity={0.7}
          />
          {mapData.chamoSvg && (
            <path
              d={mapData.chamoSvg}
              fill="url(#lakeGrad)"
              stroke="rgba(0, 210, 255, 0.4)"
              strokeWidth="0.8"
              opacity={0.7}
            />
          )}

          {/* ======================================================== */}
          {/* HIGHWAY 3 ROUTE RENDERING                                */}
          {/* ======================================================== */}
          {/* 1. Base Highway Track */}
          <path
            d={mapData.routeSvg}
            stroke="rgba(255, 255, 255, 0.18)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 2. Outbound Journey Route (reveals progressively 0 -> 482 km) */}
          <path
            d={mapData.routeSvg}
            stroke="#00D2FF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={routeLength}
            strokeDashoffset={routeLength * (1 - outboundProgress)}
            filter="url(#routeGlow)"
          />

          {/* 3. Return Journey Route (reveals return path with second brighter highlight) */}
          {isReturning && (
            <path
              d={mapData.routeSvg}
              stroke="#FF2D55"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={routeLength}
              strokeDashoffset={routeLength * (1 - (1 - returnProgress))}
              filter="url(#routeGlow)"
              opacity={0.9}
            />
          )}

          {/* When completed: full round trip highlighted dual stroke */}
          {hasReturned && (
            <path
              d={mapData.routeSvg}
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              strokeLinecap="round"
              opacity={0.7}
            />
          )}
        </svg>

        {/* ======================================================== */}
        {/* MAP MARKERS                                              */}
        {/* ======================================================== */}
        {/* Addis Ababa (Origin & Destination) */}
        <MapMarker
          x={mapData.addisPt[0]}
          y={mapData.addisPt[1]}
          label="ADDIS ABABA"
          subLabel={hasReturned ? "ROUND TRIP COMPLETED" : "ORIGIN // 0 KM"}
          badge={hasReturned ? "FINISH" : "START"}
          color="#00D2FF"
          pulsePhase={addisPulse}
          isPulsing={true}
          align="right"
        />

        {/* Bahir Dar (Destination on Lake Tana) */}
        {showBahirDarMarker && (
          <MapMarker
            x={mapData.bahirDarPt[0]}
            y={mapData.bahirDarPt[1]}
            label="BAHIR DAR"
            subLabel="LAKE TANA SHORE"
            badge="482 km"
            color="#FF3B30"
            pulsePhase={bahirDarPulse}
            isPulsing={frame >= 58}
            align="left"
          />
        )}

        {/* Lake Tana Label on Map */}
        <div
          style={{
            position: "absolute",
            left: mapData.bahirDarPt[0] + 16,
            top: mapData.bahirDarPt[1] - 80,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.16em",
            color: "rgba(0, 210, 255, 0.75)",
            textTransform: "uppercase",
            pointerEvents: "none",
          }}
        >
          LAKE TANA
        </div>

        {/* Top-Down BYD Sedan Vehicle */}
        <VehicleOnRoute
          x={vehiclePos.x}
          y={vehiclePos.y}
          angle={vehicleAngle}
          scale={0.9}
          showLightBeams={true}
        />
      </div>

      {/* ======================================================== */}
      {/* CINEMATIC VIGNETTE & CORNER OVERLAYS                      */}
      {/* ======================================================== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(4, 6, 9, 0.75) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Top Left Navigation Header Badge */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 48,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          zIndex: 30,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 14px",
            borderRadius: 8,
            backgroundColor: "rgba(12, 16, 24, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: isReturning ? "#FF3B30" : "#00D2FF",
              boxShadow: isReturning ? "0 0 10px #FF3B30" : "0 0 10px #00D2FF",
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: "#FFFFFF",
              textTransform: "uppercase",
            }}
          >
            BYD QIN PLUS DM-i // NAVIGATION TEST
          </span>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "rgba(255, 255, 255, 0.45)",
            letterSpacing: "0.06em",
            paddingLeft: 4,
          }}
        >
          ETHIOPIAN HIGHWAY NETWORK (A3 CORRIDOR)
        </span>
      </div>

      {/* ======================================================== */}
      {/* RIGHT HUD METRICS PANEL                                  */}
      {/* ======================================================== */}
      <div
        style={{
          position: "absolute",
          top: 36,
          right: 48,
          width: 440,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          zIndex: 30,
        }}
      >
        {/* Main Distance Card */}
        <div
          style={{
            padding: "24px 28px",
            borderRadius: 20,
            backgroundColor: "rgba(12, 16, 24, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(16px)",
          }}
        >
          {/* Card Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: isReturning ? "#FF3B30" : "#00D2FF",
                textTransform: "uppercase",
              }}
            >
              ACCUMULATED DISTANCE
            </span>
            <div
              style={{
                padding: "3px 8px",
                borderRadius: 4,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                fontSize: 10,
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.7)",
                letterSpacing: "0.06em",
              }}
            >
              GPS TRACKED
            </div>
          </div>

          {/* Live Animated Distance Counter */}
          <AnimatedCounter
            value={displayKm}
            unit="km"
            size={68}
            color="#FFFFFF"
            glowColor={
              hasReturned
                ? "rgba(0, 210, 255, 0.35)"
                : undefined
            }
            fontWeight={800}
          />

          {/* Subtitle Label */}
          <div
            style={{
              marginTop: 6,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: isReturning ? "#FF3B30" : "#00D2FF",
              textTransform: "uppercase",
            }}
          >
            {distancePhaseLabel}
          </div>

          {/* Route Segment Breakdown */}
          <div
            style={{
              marginTop: 16,
              paddingTop: 14,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.45)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                ONE-WAY ROUTE
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF" }}>
                482 km
              </span>
            </div>

            <div style={{ color: "rgba(255, 255, 255, 0.25)" }}>⇄</div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.45)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                ROUND-TRIP TOTAL
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF" }}>
                964 km
              </span>
            </div>
          </div>
        </div>

        {/* Claimed Combined Range Payoff Card */}
        <div
          style={{
            padding: "20px 24px",
            borderRadius: 18,
            backgroundColor: "rgba(14, 18, 28, 0.88)",
            border: `1px solid ${hasReturned ? "rgba(0, 210, 255, 0.4)" : "rgba(255, 255, 255, 0.08)"}`,
            boxShadow: hasReturned
              ? "0 12px 35px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 210, 255, 0.15)"
              : "0 10px 25px rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "#FFFFFF",
                textTransform: "uppercase",
              }}
            >
              COMBINED RANGE CAPABILITY
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#E60012",
                letterSpacing: "0.06em",
              }}
            >
              DM-i HYBRID
            </span>
          </div>

          {/* Secondary Range Value: 2,100 km claimed combined range */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
              }}
            >
              2,100
            </span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              km
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: COLORS.electricBlue,
                letterSpacing: "0.04em",
                marginLeft: 4,
              }}
            >
              claimed combined range
            </span>
          </div>

          {/* Comparison Progress Bar: 964 km vs 2,100 km */}
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 10,
                color: "rgba(255, 255, 255, 0.5)",
                marginBottom: 6,
              }}
            >
              <span>Round Trip (964 km)</span>
              <span>Total Capacity (2,100 km)</span>
            </div>
            <ProgressBar
              progress={964 / 2100}
              height={6}
              gradientStart="#00D2FF"
              gradientEnd="#E60012"
              glowColor="rgba(0, 210, 255, 0.4)"
            />

            {/* Range Buffer Surplus */}
            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "4px 8px",
                borderRadius: 4,
                backgroundColor: "rgba(0, 210, 255, 0.08)",
                border: "1px solid rgba(0, 210, 255, 0.2)",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                Estimated Surplus Buffer
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: COLORS.electricBlue,
                }}
              >
                +1,136 km Remaining
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 10,
              color: "rgba(255, 255, 255, 0.4)",
              letterSpacing: "0.02em",
            }}
          >
            Claimed maximum range; varies by version and test conditions.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
