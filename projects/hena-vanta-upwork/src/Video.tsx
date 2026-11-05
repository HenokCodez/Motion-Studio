import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background } from "./Background";
import { SceneView } from "./SceneView";
import { sfxGain } from "./audio";
import { timeToFrame } from "./theme";
import type { Timeline } from "./types";

export const HenaVanta: React.FC<{ timeline: Timeline; qaMode?: "bgOnly"; mode?: "preview" | "overlay" }> = ({ timeline, qaMode, mode = "preview" }) => {
  const { meta, scenes } = timeline;
  const fps = meta.fps;
  return (
    <AbsoluteFill>
      {mode === "overlay" ? null : <Background file={meta.background} isVideo={meta.backgroundIsVideo} durationSec={meta.backgroundDurationSec} fps={fps} />}
      {qaMode === "bgOnly" ? null : scenes.map((s) => {
        const from = timeToFrame(s.startSec, fps);
        const dur = Math.max(1, timeToFrame(s.endSec, fps) - from);
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            <SceneView scene={s} meta={meta} mode={mode} />
          </Sequence>
        );
      })}
      {/* Voiceover (pre-normalised stem), no music anywhere */}
      {qaMode === "bgOnly" || mode === "overlay" ? null : <Audio src={staticFile(meta.voiceover)} />}
      {qaMode === "bgOnly" || mode === "overlay" ? null : scenes.flatMap((s) =>
        (s.sfx ?? []).map((c, i) => (
          <Sequence key={`${s.id}-sfx${i}`} from={timeToFrame(c.atSec, fps)} name={`sfx-${s.id}-${i}`}>
            <Audio src={staticFile(`sfx/${c.file}`)} volume={sfxGain(c.category)} />
          </Sequence>
        ))
      )}
    </AbsoluteFill>
  );
};
