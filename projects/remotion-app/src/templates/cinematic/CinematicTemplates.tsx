import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate, Img, staticFile } from "remotion";
import { TOKENS } from "../../design-system/tokens";

// 1. Cinematic Single Word
export const CinematicSingleWord: React.FC<{
  word: string;
  durationInFrames: number;
  accentColor?: string;
  scale?: number;
}> = ({ word, durationInFrames, accentColor = TOKENS.colors.textPrimary, scale = 1.0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inSpring = spring({ frame, fps, config: TOKENS.motion.springs.punchy });
  const pushProgress = frame / durationInFrames;
  const zoom = interpolate(pushProgress, [0, 1], [1.0, 1.06]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        transform: `scale(${interpolate(inSpring, [0, 1], [0.4, 1]) * zoom * scale})`,
        opacity: interpolate(inSpring, [0, 0.4, 1], [0, 0.8, 1]),
      }}
    >
      <span
        style={{
          fontFamily: TOKENS.typography.displayHeadline,
          fontSize: TOKENS.typography.sizes.headlineLarge,
          color: accentColor,
          textTransform: "uppercase",
          letterSpacing: "-2px",
          textShadow: `0 0 50px ${TOKENS.colors.glow}`,
        }}
      >
        {word}
      </span>
    </div>
  );
};

// 2. Cinematic Solid Chapter Card
export const CinematicChapterSolid: React.FC<{
  number: string;
  title: string;
  durationInFrames: number;
  position?: "left" | "center" | "right";
}> = ({ number, title, durationInFrames, position = "left" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inSpring = spring({ frame, fps, config: TOKENS.motion.springs.hook });
  const push = interpolate(frame / durationInFrames, [0, 1], [1.0, 1.05]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: position === "left" ? "flex-start" : position === "right" ? "flex-end" : "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: 1500,
        margin: "0 auto",
        padding: "0 60px",
        transform: `scale(${push}) translateY(${interpolate(inSpring, [0, 1], [80, 0])}px)`,
        opacity: interpolate(inSpring, [0, 1], [0, 1]),
      }}
    >
      <div
        style={{
          fontFamily: TOKENS.typography.code,
          fontSize: 36,
          color: TOKENS.colors.primary,
          letterSpacing: 4,
          fontWeight: 700,
        }}
      >
        CHAPTER {number}
      </div>
      <div
        style={{
          fontFamily: TOKENS.typography.displayHeadline,
          fontSize: TOKENS.typography.sizes.headline,
          color: TOKENS.colors.textPrimary,
          textTransform: "uppercase",
          lineHeight: 1.05,
          marginTop: 12,
        }}
      >
        {title}
      </div>
    </div>
  );
};

// 3. Cinematic Full-Bleed Headline with Typewriter Caption
export const CinematicFullbleedHeadline: React.FC<{
  bgWord: string;
  typewriterText: string;
  durationInFrames: number;
}> = ({ bgWord, typewriterText, durationInFrames }) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame / durationInFrames, [0, 1], [1.0, 1.08]);
  // Typewriter revealed length
  const charCount = Math.min(typewriterText.length, Math.floor(frame * 1.5));

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${push})`,
      }}
    >
      {/* 20% opacity giant background word */}
      <div
        style={{
          position: "absolute",
          fontFamily: TOKENS.typography.displayHeadline,
          fontSize: 260,
          color: TOKENS.colors.textPrimary,
          opacity: 0.12,
          textTransform: "uppercase",
          letterSpacing: "-4px",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        {bgWord}
      </div>
      {/* Typewriter foreground phrase */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          fontFamily: TOKENS.typography.code,
          fontSize: 48,
          color: TOKENS.colors.accentYellow,
          backgroundColor: TOKENS.colors.surface,
          border: `1px solid ${TOKENS.colors.borderSubtle}`,
          padding: "16px 36px",
          borderRadius: 12,
          boxShadow: `0 20px 40px ${TOKENS.colors.stickerShadow}`,
        }}
      >
        {typewriterText.slice(0, charCount)}
        <span style={{ opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0 }}>_</span>
      </div>
    </div>
  );
};

// 4. Cinematic B&W Subject Labels
export const CinematicBWSubjectLabels: React.FC<{
  imageSrc: string;
  labels: { text: string; x: number; y: number; triggerFrame: number }[];
  durationInFrames: number;
}> = ({ imageSrc, labels, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const push = interpolate(frame / durationInFrames, [0, 1], [1.0, 1.05]);

  return (
    <div
      style={{
        position: "relative",
        width: 1280,
        height: 640,
        margin: "0 auto",
        borderRadius: 24,
        overflow: "hidden",
        border: `1px solid ${TOKENS.colors.borderSubtle}`,
        transform: `scale(${push})`,
      }}
    >
      <Img
        src={imageSrc.startsWith("http") ? imageSrc : staticFile(imageSrc)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "grayscale(100%) contrast(1.1) brightness(0.85)",
        }}
      />
      {labels.map((l, i) => {
        const s = spring({ frame: Math.max(0, frame - l.triggerFrame), fps, config: TOKENS.motion.springs.popIn });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${l.x}%`,
              top: `${l.y}%`,
              transform: `translate(-50%, -50%) scale(${interpolate(s, [0, 1], [0.2, 1])})`,
              opacity: interpolate(s, [0, 1], [0, 1]),
              backgroundColor: TOKENS.colors.surfaceElevated,
              border: `2px solid ${TOKENS.colors.primary}`,
              color: TOKENS.colors.textPrimary,
              padding: "8px 18px",
              borderRadius: 20,
              fontFamily: TOKENS.typography.code,
              fontSize: 22,
              fontWeight: 700,
              boxShadow: `0 10px 25px ${TOKENS.colors.stickerShadow}`,
            }}
          >
            {l.text}
          </div>
        );
      })}
    </div>
  );
};

// 5. Cinematic Framed Clip with Text Columns
export const CinematicFramedColumns: React.FC<{
  imageSrc: string;
  leftHeadline: string;
  rightAccentText: string;
  durationInFrames: number;
}> = ({ imageSrc, leftHeadline, rightAccentText, durationInFrames }) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame / durationInFrames, [0, 1], [1.0, 1.05]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        width: 1600,
        margin: "0 auto",
        transform: `scale(${push})`,
      }}
    >
      <div style={{ flex: 1, textAlign: "right" }}>
        <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 56, color: TOKENS.colors.textPrimary, lineHeight: 1.1 }}>
          {leftHeadline}
        </div>
      </div>
      <div style={{ width: 680, height: 420, borderRadius: 20, overflow: "hidden", border: `2px solid ${TOKENS.colors.borderSubtle}` }}>
        <Img src={imageSrc.startsWith("http") ? imageSrc : staticFile(imageSrc)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ flex: 1, textAlign: "left" }}>
        <div style={{ fontFamily: TOKENS.typography.handwritten, fontSize: 48, color: TOKENS.colors.primary }}>
          {rightAccentText}
        </div>
      </div>
    </div>
  );
};

// 6. Cinematic Tinted Overlay
export const CinematicTintedOverlay: React.FC<{
  imageSrc: string;
  title: string;
  accentWord: string;
  durationInFrames: number;
}> = ({ imageSrc, title, accentWord, durationInFrames }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame / durationInFrames, [0, 1], [1.0, 1.06]);

  return (
    <div style={{ position: "relative", width: 1400, height: 600, margin: "0 auto", borderRadius: 20, overflow: "hidden" }}>
      <Img src={imageSrc.startsWith("http") ? imageSrc : staticFile(imageSrc)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, filter: "brightness(0.35) saturate(1.2)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 72, color: TOKENS.colors.textPrimary, textAlign: "center" }}>
          {title}{" "}
          <span style={{ color: TOKENS.colors.accentYellow, fontFamily: TOKENS.typography.handwritten }}>{accentWord}</span>
        </div>
      </div>
    </div>
  );
};

// 7. Cinematic Tilted Polaroid
export const CinematicTiltedPolaroid: React.FC<{
  imageSrc: string;
  caption: string;
  tiltAngle?: number;
  durationInFrames: number;
}> = ({ imageSrc, caption, tiltAngle = -5, durationInFrames }) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame / durationInFrames, [0, 1], [1.0, 1.05]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${push}) rotate(${tiltAngle}deg)` }}>
      <div style={{ backgroundColor: TOKENS.colors.surfaceElevated, border: `3px solid ${TOKENS.colors.borderSubtle}`, padding: "18px 18px 40px 18px", borderRadius: 12, boxShadow: `0 30px 60px ${TOKENS.colors.stickerShadow}` }}>
        <Img src={imageSrc.startsWith("http") ? imageSrc : staticFile(imageSrc)} style={{ width: 480, height: 360, objectFit: "cover", borderRadius: 6 }} />
        <div style={{ fontFamily: TOKENS.typography.code, fontSize: 24, color: TOKENS.colors.textPrimary, marginTop: 18, textAlign: "center" }}>
          {caption}
        </div>
      </div>
    </div>
  );
};

// 8. Cinematic Split Focus (50/50 Editorial)
export const CinematicSplitFocus: React.FC<{
  imageSrc: string;
  statement: string;
  durationInFrames: number;
}> = ({ imageSrc, statement, durationInFrames }) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame / durationInFrames, [0, 1], [1.0, 1.04]);

  return (
    <div style={{ display: "flex", width: 1600, height: 600, margin: "0 auto", borderRadius: 24, overflow: "hidden", border: `1px solid ${TOKENS.colors.borderSubtle}` }}>
      <div style={{ flex: 1, backgroundColor: TOKENS.colors.surface, display: "flex", alignItems: "center", padding: 60 }}>
        <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 64, color: TOKENS.colors.textPrimary, lineHeight: 1.15 }}>
          {statement}
        </div>
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Img src={imageSrc.startsWith("http") ? imageSrc : staticFile(imageSrc)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${push})` }} />
      </div>
    </div>
  );
};

// 9. Cinematic Letterbox Scope
export const CinematicLetterboxScope: React.FC<{
  imageSrc: string;
  headline: string;
  durationInFrames: number;
}> = ({ imageSrc, headline, durationInFrames }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame / durationInFrames, [0, 1], [1.0, 1.06]);

  return (
    <div style={{ position: "relative", width: 1920, height: 640, overflow: "hidden", margin: "auto" }}>
      <Img src={imageSrc.startsWith("http") ? imageSrc : staticFile(imageSrc)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, filter: "brightness(0.65)" }} />
      <div style={{ position: "absolute", bottom: 40, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 68, color: TOKENS.colors.textPrimary, textTransform: "uppercase" }}>
          {headline}
        </div>
      </div>
    </div>
  );
};
