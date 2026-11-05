import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { JourneyView } from "./Journey";
import { ListView, StackView, type Ctx } from "./Stack";
import { StepsView } from "./Steps";
import { COLORS, MOTION, timeToFrame } from "./theme";
import type { Scene, Timeline } from "./types";

export const SceneView: React.FC<{ scene: Scene; meta: Timeline["meta"]; mode?: "preview" | "overlay" }> = ({ scene, meta, mode = "preview" }) => {
  const frame = useCurrentFrame();
  const dark = meta.textMode === "dark";
  const c: Ctx = { W: meta.width, H: meta.height, fps: meta.fps, frame, mode, col: dark ? COLORS.textOnDark : COLORS.text, red: dark ? COLORS.redOnDark : COLORS.red, gray: dark ? COLORS.grayOnDark : COLORS.gray };
  let opacity = 1;
  if (scene.exit === "fadeOut") { const total = timeToFrame(scene.endSec - scene.startSec, meta.fps); opacity = interpolate(frame, [total - timeToFrame(MOTION.sceneFadeOutSec, meta.fps), total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); }
  const body = scene.layout === "STACK" ? <StackView scene={scene} c={c} /> : scene.layout === "LIST" ? <ListView scene={scene} c={c} /> : scene.layout === "STEPS" ? <StepsView scene={scene} c={c} /> : scene.layout === "JOURNEY" ? <JourneyView scene={scene} events={meta.journey?.events ?? []} title={meta.journey?.title} c={c} /> : null;
  return <div data-scene={scene.id} data-layout={scene.layout} data-beat={scene.beat} style={{ position: "absolute", inset: 0, opacity }}>{body}</div>;
};
