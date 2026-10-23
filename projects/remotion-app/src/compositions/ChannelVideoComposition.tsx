import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { DynamicScene, SceneSpec, ChannelStyleConfig } from "../components/global/DynamicScene";
import { LiquidBackground } from "../templates/LiquidBackground";
import { KineticCaptions } from "../templates/KineticCaptions";

export interface ChannelVideoProps {
  channelId?: string;
  channelStyle?: ChannelStyleConfig;
  scenes?: SceneSpec[];
  audioTrack?: string; // e.g. "audio/voice/narration.wav"
  bgMusicTrack?: string; // e.g. "audio/music/ambient.mp3"
  bgMusicVolume?: number;
  captions?: Array<{
    text: string;
    start: number;
    end: number;
  }>;
  showCaptions?: boolean;
  enableLiquidBackground?: boolean;
}

const DEFAULT_SCENES: SceneSpec[] = [
  {
    id: "scene-1-hook",
    type: "title-hook",
    startFrame: 0,
    endFrame: 90,
    durationInFrames: 90,
    title: "VantaBrief: Next-Gen Video Production",
    subtitle: "AI-Assisted Multi-Channel Architecture",
  },
  {
    id: "scene-2-map",
    type: "animated-map",
    startFrame: 90,
    endFrame: 180,
    durationInFrames: 90,
    title: "Global Production Nodes",
    subtitle: "Coordinating multi-channel pipelines across automated clusters",
  },
  {
    id: "scene-3-placeholder",
    type: "footage-placeholder",
    startFrame: 180,
    endFrame: 270,
    durationInFrames: 90,
    title: "Host Camera Delivery",
    instruction: "RECORD: Talking-head introduction addressing audience and explaining workflow.",
    actionPrompt: "In this breakdown, we examine the four cooperating layers of our motion studio.",
    targetPath: "assets/video/host_intro.mp4",
  },
  {
    id: "scene-4-stats",
    type: "callout-card",
    startFrame: 270,
    endFrame: 360,
    durationInFrames: 90,
    statNumber: 94,
    statSuffix: "%",
    title: "Turnaround Time Slashed",
    subtitle: "From script to multi-channel render in minutes.",
  },
  {
    id: "scene-5-ending",
    type: "ending-card",
    startFrame: 360,
    endFrame: 450,
    durationInFrames: 90,
    title: "Subscribe to VantaBrief",
    url: "vantabrief.tech",
  },
];

export const ChannelVideoComposition: React.FC<ChannelVideoProps> = ({
  channelId = "VantaBrief",
  channelStyle = {
    name: "VantaBrief",
    palette: {
      background: "#070A12",
      surface: "#0F172A",
      primary: "#3B82F6",
      secondary: "#8B5CF6",
      accent: "#10B981",
      glow: "rgba(59, 130, 246, 0.3)",
      text_primary: "#F8FAFC",
      text_muted: "#94A3B8",
    },
  },
  scenes = DEFAULT_SCENES,
  audioTrack,
  bgMusicTrack,
  bgMusicVolume = 0.1,
  captions,
  showCaptions,
  enableLiquidBackground = false,
}) => {
  const captionsEnabled = showCaptions ?? (channelStyle as any)?.style?.captions?.enabled ?? false;

  return (
    <AbsoluteFill
      data-channel={channelId}
      style={{ backgroundColor: channelStyle?.palette?.background || "#070A12" }}
    >
      {/* Optional Ambient Background Layer */}
      {enableLiquidBackground && <LiquidBackground />}

      {/* Voiceover Narration Audio Track */}
      {audioTrack && (
        <Audio
          src={audioTrack.startsWith("http") || audioTrack.startsWith("/") ? audioTrack : staticFile(audioTrack)}
        />
      )}

      {/* Background Music Track */}
      {bgMusicTrack && (
        <Audio
          src={bgMusicTrack.startsWith("http") || bgMusicTrack.startsWith("/") ? bgMusicTrack : staticFile(bgMusicTrack)}
          volume={bgMusicVolume}
        />
      )}

      {/* Sequenced Scenes */}
      {scenes.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.durationInFrames}
        >
          <DynamicScene scene={scene} channelStyle={channelStyle} />
        </Sequence>
      ))}

      {/* Synchronized Captions Overlay (Opt-in) */}
      {captionsEnabled && captions && captions.length > 0 && (
        <KineticCaptions
          words={captions as any}
          highlightColor={channelStyle?.style?.captions?.active_color || "#FACC15"}
          textColor={channelStyle?.palette?.text_primary || "#F8FAFC"}
        />
      )}
    </AbsoluteFill>
  );
};
