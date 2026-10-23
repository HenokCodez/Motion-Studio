import React from "react";

interface VehicleOnRouteProps {
  x: number;
  y: number;
  angle: number; // in degrees
  scale?: number;
  showLightBeams?: boolean;
}

export const VehicleOnRoute: React.FC<VehicleOnRouteProps> = ({
  x,
  y,
  angle,
  scale = 1,
  showLightBeams = true,
}) => {
  // Vehicle dimensions: length 46px, width 20px
  const length = 46;
  const width = 20;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${angle}deg) scale(${scale})`,
        transformOrigin: "center center",
        width: length + 60, // extra space for forward headlight beams
        height: width + 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      <svg
        width={length + 60}
        height={width + 24}
        viewBox={`0 0 ${length + 60} ${width + 24}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {/* Forward Headlight Cones / Beams (facing right in local coordinate system) */}
        {showLightBeams && (
          <g opacity={0.65}>
            {/* Left headlight beam */}
            <path
              d={`M ${length + 10} ${12 - 4} L ${length + 55} ${12 - 16} L ${length + 55} ${12 - 1} Z`}
              fill="url(#headlightGrad)"
            />
            {/* Right headlight beam */}
            <path
              d={`M ${length + 10} ${12 + 4} L ${length + 55} ${12 + 1} L ${length + 55} ${12 + 16} Z`}
              fill="url(#headlightGrad)"
            />
          </g>
        )}

        <defs>
          <linearGradient id="headlightGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.75" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Body gradient */}
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E6EBF2" />
            <stop offset="50%" stopColor="#F5F8FA" />
            <stop offset="100%" stopColor="#CCD3DD" />
          </linearGradient>

          {/* Glass Roof gradient */}
          <linearGradient id="roofGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0F131A" />
            <stop offset="50%" stopColor="#1E2533" />
            <stop offset="100%" stopColor="#0F131A" />
          </linearGradient>
        </defs>

        {/* Vehicle Body Base (centered offset: x = 12, y = 2) */}
        <g transform="translate(10, 2)">
          {/* Ground drop shadow */}
          <rect
            x="3"
            y="3"
            width={length - 2}
            height={width - 2}
            rx="6"
            fill="rgba(0, 0, 0, 0.65)"
            filter="blur(3px)"
          />

          {/* 4 Wheels/Tires */}
          <rect x="7" y="0" width="8" height="3" rx="1.5" fill="#15171C" />
          <rect x="7" y={width - 3} width="8" height="3" rx="1.5" fill="#15171C" />
          <rect x={length - 15} y="0" width="8" height="3" rx="1.5" fill="#15171C" />
          <rect x={length - 15} y={width - 3} width="8" height="3" rx="1.5" fill="#15171C" />

          {/* Side Mirrors */}
          <path d="M 28 0.5 Q 31 0.5 31 -2 L 27 -2 Z" fill="#CCD3DD" />
          <path d="M 28 19.5 Q 31 19.5 31 22 L 27 22 Z" fill="#CCD3DD" />

          {/* Main Car Silhouette Body */}
          <path
            d={`
              M 7 2
              L ${length - 9} 2
              Q ${length - 3} 2 ${length} 5
              Q ${length + 2} 10 ${length} 15
              Q ${length - 3} 18 ${length - 9} 18
              L 7 18
              Q 2 18 1 15
              Q 0 10 1 5
              Q 2 2 7 2
              Z
            `}
            fill="url(#bodyGrad)"
            stroke="rgba(0, 0, 0, 0.25)"
            strokeWidth="0.8"
          />

          {/* Front Hood Character Creases */}
          <path
            d={`M ${length - 14} 5 L ${length - 3} 6`}
            stroke="rgba(0, 0, 0, 0.15)"
            strokeWidth="0.8"
          />
          <path
            d={`M ${length - 14} 15 L ${length - 3} 14`}
            stroke="rgba(0, 0, 0, 0.15)"
            strokeWidth="0.8"
          />

          {/* Front Windshield */}
          <path
            d={`M 26 4 L ${length - 14} 5 Q ${length - 12} 10 ${length - 14} 15 L 26 16 Z`}
            fill="url(#roofGrad)"
          />

          {/* Panoramic Glass Roof */}
          <rect x="14" y="4.5" width="12" height="11" rx="1" fill="url(#roofGrad)" />

          {/* Rear Windshield */}
          <path
            d="M 7 5 L 14 4.5 L 14 15.5 L 7 15 Z"
            fill="url(#roofGrad)"
          />

          {/* BYD Dragon Face Front LED Light Strip */}
          <path
            d={`M ${length - 1} 6 Q ${length + 1} 10 ${length - 1} 14`}
            stroke="#00D2FF"
            strokeWidth="2"
            strokeLinecap="round"
            filter="drop-shadow(0 0 4px #00D2FF)"
          />

          {/* Full-width Rear Red Continuous LED Taillight Bar */}
          <path
            d="M 1 6 Q 0 10 1 14"
            stroke="#E60012"
            strokeWidth="2"
            strokeLinecap="round"
            filter="drop-shadow(0 0 5px #E60012)"
          />
        </g>
      </svg>
    </div>
  );
};
