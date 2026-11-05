import React from "react";
import { Composition } from "remotion";
import { HenaVanta } from "./Video";
import timelineJson from "./timeline.json";
import type { Timeline } from "./types";

const timeline = timelineJson as unknown as Timeline;

export const Root: React.FC = () => (
  <Composition
    id="HenaVanta"
    component={HenaVanta}
    defaultProps={{ timeline }}
    durationInFrames={Math.max(1, Math.round(timeline.meta.durationSec * timeline.meta.fps))}
    fps={timeline.meta.fps}
    width={timeline.meta.width}
    height={timeline.meta.height}
  />
);
