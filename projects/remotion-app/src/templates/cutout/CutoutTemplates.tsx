import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate, Img, staticFile } from "remotion";
import { TOKENS } from "../../design-system/tokens";
import { Cutout } from "../../components/fireship/Cutout";

// 10. Cutout Slam Keyword
export const CutoutSlamKeyword: React.FC<{
  src: string;
  keyword: string;
  label?: string;
  durationInFrames: number;
  position?: "left" | "right";
}> = ({ src, keyword, label, durationInFrames, position = "left" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slamSpring = spring({ frame: Math.max(0, frame - 2), fps, config: TOKENS.motion.springs.punchy });
  const scale = interpolate(slamSpring, [0, 1], [2.2, 1]);

  return (
    <div style={{ display: "flex", flexDirection: position === "left" ? "row" : "row-reverse", alignItems: "center", justifyContent: "center", gap: 70, width: "100%", maxWidth: 1600, margin: "0 auto" }}>
      <Cutout src={src} label={label} width={480} durationInFrames={durationInFrames} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 130, color: TOKENS.colors.textPrimary, textTransform: "uppercase", transform: `scale(${scale})`, transformOrigin: "center left", lineHeight: 1.0 }}>
          {keyword}
        </div>
      </div>
    </div>
  );
};

// 11. Cutout Stacked Emoji
export const CutoutStackedEmoji: React.FC<{
  src: string;
  emojis: string[];
  durationInFrames: number;
}> = ({ src, emojis, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 80 }}>
      <Cutout src={src} width={450} durationInFrames={durationInFrames} />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {emojis.map((em, idx) => {
          const s = spring({ frame: Math.max(0, frame - idx * 4), fps, config: TOKENS.motion.springs.popIn });
          return (
            <div key={idx} style={{ fontSize: 80, transform: `scale(${interpolate(s, [0, 1], [0.1, 1])})`, filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.6))" }}>
              {em}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 12. Cutout Vintage Handwritten
export const CutoutVintageHandwritten: React.FC<{
  src: string;
  handwrittenLine: string;
  capsPunchline: string;
  durationInFrames: number;
}> = ({ src, handwrittenLine, capsPunchline, durationInFrames }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 60 }}>
      <Cutout src={src} width={460} durationInFrames={durationInFrames} />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontFamily: TOKENS.typography.handwritten, fontSize: 56, color: TOKENS.colors.accentYellow }}>
          {handwrittenLine}
        </div>
        <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 110, color: TOKENS.colors.textPrimary, textTransform: "uppercase" }}>
          {capsPunchline}
        </div>
      </div>
    </div>
  );
};

// 13. Cutout Floating Logo Cluster
export const CutoutFloatingLogoCluster: React.FC<{
  logos: string[];
  headline: string;
  durationInFrames: number;
}> = ({ logos, headline, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ position: "relative", width: "100%", height: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {logos.map((l, i) => {
        const s = spring({ frame: Math.max(0, frame - i * 3), fps, config: TOKENS.motion.springs.popIn });
        const driftX = Math.sin(frame * 0.05 + i) * 16;
        const driftY = Math.cos(frame * 0.04 + i) * 14;
        const xPos = (i - (logos.length - 1) / 2) * 240;

        return (
          <div key={i} style={{ position: "absolute", left: `calc(50% + ${xPos}px)`, transform: `translate(-50%, -50%) scale(${interpolate(s, [0, 1], [0.2, 1])}) translate(${driftX}px, ${driftY}px)` }}>
            <div style={{ width: 150, height: 150, backgroundColor: TOKENS.colors.surface, borderRadius: 24, border: `2px solid ${TOKENS.colors.borderSubtle}`, display: "flex", alignItems: "center", justifyContent: "center", padding: 18, boxShadow: `0 20px 40px ${TOKENS.colors.stickerShadow}` }}>
              <Img src={l.startsWith("http") ? l : staticFile(l)} style={{ width: "80%", height: "80%", objectFit: "contain" }} />
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", bottom: 20, textAlign: "center" }}>
        <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 80, color: TOKENS.colors.textPrimary }}>
          {headline}
        </div>
      </div>
    </div>
  );
};

// 14. Cutout Meme Diagram Interrupt
export const CutoutMemeDiagramInterrupt: React.FC<{
  memeSrc: string;
  punchWord: string;
  durationInFrames: number;
}> = ({ memeSrc, punchWord, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: TOKENS.motion.springs.punchy });
  const shake = frame < 6 ? Math.sin(frame * 3) * 10 : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${interpolate(s, [0, 1], [0.2, 1])}) translateX(${shake}px)` }}>
      <div style={{ border: `4px solid ${TOKENS.colors.textPrimary}`, borderRadius: 16, overflow: "hidden", boxShadow: `0 25px 60px ${TOKENS.colors.stickerShadow}` }}>
        <Img src={memeSrc.startsWith("http") ? memeSrc : staticFile(memeSrc)} style={{ width: 620, height: "auto", display: "block" }} />
      </div>
      <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 90, color: TOKENS.colors.accentRed, marginTop: 18, textTransform: "uppercase" }}>
        {punchWord}
      </div>
    </div>
  );
};

// 15. Cutout Film Word Overlay
export const CutoutFilmWordOverlay: React.FC<{
  videoSrc?: string;
  overlayWord: string;
  durationInFrames: number;
}> = ({ overlayWord, durationInFrames }) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame / durationInFrames, [0, 1], [1.0, 1.08]);

  return (
    <div style={{ position: "relative", width: 1400, height: 600, margin: "0 auto", borderRadius: 20, overflow: "hidden", border: `2px solid ${TOKENS.colors.borderSubtle}` }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: TOKENS.colors.surface, transform: `scale(${push})` }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 140, color: TOKENS.colors.textPrimary, textTransform: "uppercase", letterSpacing: 4 }}>
          {overlayWord}
        </div>
      </div>
    </div>
  );
};

// 16. Cutout Photo Top/Bottom Text
export const CutoutPhotoTopBottom: React.FC<{
  src: string;
  topText: string;
  bottomText: string;
  durationInFrames: number;
}> = ({ src, topText, bottomText, durationInFrames }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 56, color: TOKENS.colors.textPrimary, textTransform: "uppercase" }}>
        {topText}
      </div>
      <Cutout src={src} width={420} durationInFrames={durationInFrames} />
      <div style={{ fontFamily: TOKENS.typography.code, fontSize: 32, color: TOKENS.colors.accentYellow }}>
        {bottomText}
      </div>
    </div>
  );
};

// 17. Cutout Emoji + Bold Phrase
export const CutoutEmojiBoldPhrase: React.FC<{
  emoji: string;
  boldPhrase: string;
  durationInFrames: number;
}> = ({ emoji, boldPhrase, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: TOKENS.motion.springs.popIn });

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40, transform: `scale(${interpolate(s, [0, 1], [0.3, 1])})` }}>
      <div style={{ fontSize: 130 }}>{emoji}</div>
      <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 100, color: TOKENS.colors.textPrimary, maxWidth: 800, lineHeight: 1.05 }}>
        {boldPhrase}
      </div>
    </div>
  );
};

// 18. Cutout Duo Faceoff
export const CutoutDuoFaceoff: React.FC<{
  leftSrc: string;
  leftLabel: string;
  rightSrc: string;
  rightLabel: string;
  vsText?: string;
  durationInFrames: number;
}> = ({ leftSrc, leftLabel, rightSrc, rightLabel, vsText = "VS", durationInFrames }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 60, width: "100%", maxWidth: 1600, margin: "0 auto" }}>
      <Cutout src={leftSrc} label={leftLabel} width={380} durationInFrames={durationInFrames} inAnimation="slideFromLeft" />
      <div style={{ fontFamily: TOKENS.typography.displayHeadline, fontSize: 72, color: TOKENS.colors.accentRed }}>
        {vsText}
      </div>
      <Cutout src={rightSrc} label={rightLabel} width={380} durationInFrames={durationInFrames} inAnimation="slideFromRight" />
    </div>
  );
};
