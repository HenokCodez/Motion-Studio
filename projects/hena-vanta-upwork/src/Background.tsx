import React from "react";
import { Img, Loop, OffthreadVideo, staticFile } from "remotion";

/** Background is always muted. Videos loop seamlessly via <Loop> (OffthreadVideo has no `loop` prop). */
export const Background: React.FC<{ file: string; isVideo: boolean; durationSec?: number; fps: number }> = ({ file, isVideo, durationSec, fps }) => (
  <div style={{ position: "absolute", inset: 0, background: "#000" }}>
    {isVideo ? (
      <Loop durationInFrames={Math.max(1, Math.floor((durationSec ?? 10) * fps))}>
        <OffthreadVideo src={staticFile(file)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Loop>
    ) : (
      <Img src={staticFile(file)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    )}
  </div>
);
