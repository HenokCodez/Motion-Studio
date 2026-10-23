import React from "react";
import {
  useCurrentFrame,
  spring,
  useVideoConfig,
  interpolate,
  OffthreadVideo,
  Img,
  staticFile,
} from "remotion";
import { TOKENS } from "../../design-system/tokens";
import userFootageManifest from "../../assets/user_footage_manifest.json";

export type PlaceholderMediaType =
  | "VIDEO"
  | "SCREEN RECORDING"
  | "IMAGE"
  | "MEME"
  | "PERSON"
  | "DIAGRAM";

export interface PlaceholderProps {
  slotId: string;
  type?: PlaceholderMediaType;
  whatToShow: string;
  searchTerms?: string[];
  durationInSeconds?: number;
  timecode?: string;
  spokenLine?: string;
  durationInFrames: number;
  sourceUrl?: string;
  productVersion?: string;
  inAnimation?: "springPop" | "slideUp" | "fade";
  outAnimation?: "scaleDown" | "slideDown" | "fade";
  aspectRatio?: "16:9" | "4:3" | "1:1";
  style?: React.CSSProperties;
}

export const PlaceholderFrame: React.FC<PlaceholderProps> = ({
  slotId,
  type = "SCREEN RECORDING",
  whatToShow,
  searchTerms = [],
  durationInSeconds,
  timecode,
  durationInFrames,
  sourceUrl,
  productVersion,
  inAnimation = "springPop",
  outAnimation = "scaleDown",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Check if user has dropped in a real media replacement in user-footage/
  // Verified safely via user_footage_manifest.json to prevent 404s
  const manifest = (userFootageManifest || {}) as Record<string, string>;
  const dropInRelPath = manifest[slotId];
  const userDropInFile = dropInRelPath ? staticFile(dropInRelPath) : null;
  const isVideo = dropInRelPath ? (dropInRelPath.endsWith(".mp4") || dropInRelPath.endsWith(".webm")) : false;

  // Entrance spring animation
  const inSpring = spring({
    frame,
    fps,
    config: TOKENS.motion.springs.popIn,
  });

  let enterTransform = "";
  let enterOpacity = 1;
  switch (inAnimation) {
    case "springPop":
      enterTransform = `scale(${interpolate(inSpring, [0, 1], [0.85, 1])})`;
      enterOpacity = interpolate(inSpring, [0, 0.4, 1], [0, 0.9, 1]);
      break;
    case "slideUp":
      enterTransform = `translateY(${interpolate(inSpring, [0, 1], [120, 0])}px)`;
      enterOpacity = interpolate(inSpring, [0, 1], [0, 1]);
      break;
    case "fade":
      enterOpacity = interpolate(inSpring, [0, 1], [0, 1]);
      break;
  }

  // Exit calculation
  const exitDuration = TOKENS.motion.outFrames;
  const exitStart = durationInFrames - exitDuration;
  const isExiting = frame >= exitStart;
  const exitProgress = isExiting
    ? Math.min(1, Math.max(0, (frame - exitStart) / exitDuration))
    : 0;

  let exitTransform = "";
  let exitOpacity = 1;
  if (isExiting) {
    switch (outAnimation) {
      case "scaleDown":
        exitTransform = `scale(${interpolate(exitProgress, [0, 1], [1, 0.7])})`;
        exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
        break;
      case "slideDown":
        exitTransform = `translateY(${interpolate(exitProgress, [0, 1], [0, 150])}px)`;
        exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
        break;
      case "fade":
        exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
        break;
    }
  }

  // Slow continuous push-in
  const pushInProgress = Math.min(1, Math.max(0, frame / Math.max(1, durationInFrames)));
  const cameraZoom = interpolate(pushInProgress, [0, 1], [1.0, 1.05]);

  const durationSec = durationInSeconds ?? durationInFrames / fps;

  return (
    <div
      style={{
        width: "60%",
        maxWidth: 1200,
        height: 580,
        margin: "0 auto",
        position: "relative",
        transform: `${enterTransform} ${exitTransform}`,
        opacity: enterOpacity * exitOpacity,
        transformOrigin: "center center",
        zIndex: 15,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 24,
          overflow: "hidden",
          border: `2px dashed ${TOKENS.colors.primary}`,
          backgroundColor: TOKENS.colors.surface,
          boxShadow: `0 24px 60px ${TOKENS.colors.stickerShadow}, 0 0 40px ${TOKENS.colors.glow}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          transform: `scale(${cameraZoom})`,
          transformOrigin: "center center",
        }}
      >
        {/* If user provided drop-in footage, display it automatically */}
        {userDropInFile ? (
          isVideo ? (
            <OffthreadVideo
              src={userDropInFile}
              muted // Rule R1: Video audio is always muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Img
              src={userDropInFile}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )
        ) : (
          /* High-Legibility VantaBrief Style Bible Placeholder Specification */
          <div
            style={{
              padding: "36px 44px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              maxWidth: 950,
            }}
          >
            {/* Centered Heading */}
            <div
              style={{
                fontFamily: TOKENS.typography.code,
                fontSize: 32,
                color: TOKENS.colors.accentRed,
                letterSpacing: 3,
                textTransform: "uppercase",
                fontWeight: 800,
                backgroundColor: "rgba(239, 68, 68, 0.12)",
                padding: "6px 20px",
                borderRadius: 8,
                border: `1px solid ${TOKENS.colors.accentRed}`,
              }}
            >
              FOOTAGE NEEDED
            </div>

            {/* MediaType Tag */}
            <div
              style={{
                fontFamily: TOKENS.typography.code,
                fontSize: 18,
                color: TOKENS.colors.primary,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              [{type}]
            </div>

            {/* Specific Description Line */}
            <div
              style={{
                fontFamily: TOKENS.typography.displayHeadline,
                fontSize: 38,
                color: TOKENS.colors.textPrimary,
                lineHeight: 1.25,
                letterSpacing: "-0.5px",
                marginTop: 4,
              }}
            >
              {whatToShow}
            </div>

            {/* Optional Source URL / Product Version */}
            {(sourceUrl || productVersion) && (
              <div
                style={{
                  fontFamily: TOKENS.typography.code,
                  fontSize: 18,
                  color: TOKENS.colors.accentGreen,
                }}
              >
                {productVersion ? `Target: ${productVersion}` : ""}
                {productVersion && sourceUrl ? " · " : ""}
                {sourceUrl ? `Source: ${sourceUrl}` : ""}
              </div>
            )}

            {/* Search Terms Line */}
            {searchTerms && searchTerms.length > 0 && (
              <div
                style={{
                  fontFamily: TOKENS.typography.code,
                  fontSize: 20,
                  color: TOKENS.colors.accentYellow,
                  letterSpacing: 0.5,
                }}
              >
                Search: {searchTerms.join(", ")}
              </div>
            )}

            {/* Metadata Line */}
            <div
              style={{
                fontFamily: TOKENS.typography.body,
                fontSize: 18,
                color: TOKENS.colors.textMuted,
                marginTop: 6,
              }}
            >
              Slot: #{slotId} · Length: {durationSec.toFixed(1)}s{timecode ? ` · Time: ${timecode}` : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
