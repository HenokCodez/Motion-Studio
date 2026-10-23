import React from "react";
import { AbsoluteFill, Video, staticFile } from "remotion";
import { FootagePlaceholder } from "./FootagePlaceholder";
import { AnimatedMap } from "./AnimatedMap";
import { BrowserFrame } from "./BrowserFrame";
import {
  TitleHook,
  CalloutCard,
  ComparisonGrid,
  LogoIntro,
  EndingCard,
} from "../../templates";
import {
  VantaBackground,
  VantaTitleHook,
  VantaKineticList,
  VantaBenchmarkCard,
  VantaTerminalWindow,
  VantaComparisonSplit,
  VantaIncidentTimeline,
  VantaAsymmetricSplit,
  VantaBrollOverlay,
  VantaChapterCard,
  VantaSpatialCallout,
  VantaHighlightBrowser,
  Grid3DFloor,
  LogoCard,
  ImagePreviewCard,
} from "../vantabrief";



export interface SceneSpec {
  id: string;
  type:
    | "title-hook"
    | "callout-card"
    | "comparison"
    | "animated-map"
    | "screenshot"
    | "talking-head"
    | "b-roll"
    | "footage-placeholder"
    | "logo-intro"
    | "ending-card"
    | string;
  startFrame: number;
  endFrame: number;
  durationInFrames: number;
  narration?: string;
  title?: string;
  subtitle?: string;
  mediaPath?: string;
  mediaAvailable?: boolean;
  actionPrompt?: string;
  instruction?: string;
  targetPath?: string;
  url?: string;
  statNumber?: number;
  statSuffix?: string;
  statPrefix?: string;
  statLabel?: string;
  leftItems?: string[];
  rightItems?: string[];
  highlightText?: string;
  highlightStartFrame?: number;
  itemsWithTiming?: Array<{ text: string; tag?: string; isAccent?: boolean; enterFrame?: number }>;
  svgName?: string;
  imageName?: string;
  badgeText?: string;
  theme?: Record<string, unknown>;
}

export interface ChannelStyleConfig {
  name?: string;
  tagline?: string;
  palette?: {
    background?: string;
    surface?: string;
    primary?: string;
    secondary?: string;
    accent?: string;
    glow?: string;
    text_primary?: string;
    text_muted?: string;
    border?: string;
  };
  typography?: {
    heading_font?: string;
    body_font?: string;
    mono_font?: string;
  };
  style?: {
    captions?: {
      active_color?: string;
      inactive_color?: string;
    };
  };
}

export interface DynamicSceneProps {
  scene: SceneSpec;
  channelStyle?: ChannelStyleConfig;
}

export const DynamicScene: React.FC<DynamicSceneProps> = ({ scene, channelStyle = {} }) => {
  const palette = channelStyle?.palette || {};
  const accent = palette.primary || "#3B82F6";

  switch (scene.type) {
    case "footage-placeholder":
      return (
        <FootagePlaceholder
          id={scene.id}
          instruction={scene.instruction || scene.title || "Record on-screen demonstration"}
          actionPrompt={scene.actionPrompt || scene.narration}
          targetPath={scene.targetPath || scene.mediaPath || `assets/video/${scene.id}.mp4`}
          mediaAvailable={scene.mediaAvailable}
          accentColor={palette.accent || "#EF4444"}
        />
      );

    case "screenshot":
    case "ui-mockup":
      return (
        <AbsoluteFill
          style={{
            backgroundColor: palette.background || "#070A12",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          <BrowserFrame
            url={scene.url || "https://studio.local"}
            imageSrc={scene.mediaPath}
            title={scene.title || "Interface Capture"}
            accentColor={accent}
          />
        </AbsoluteFill>
      );

    case "animated-map":
      return (
        <AnimatedMap
          title={scene.title || "Network Route"}
          subtitle={scene.subtitle || scene.narration}
          theme={{
            background: palette.background,
            surface: palette.surface,
            routeColor: palette.primary,
            glowColor: palette.glow,
            accentColor: palette.accent,
            textPrimary: palette.text_primary,
            textMuted: palette.text_muted,
            fontFamily: channelStyle?.typography?.heading_font ? `'${channelStyle.typography.heading_font}', sans-serif` : undefined,
          }}
        />
      );

    case "vanta-title-hook":
      return (
        <AbsoluteFill>
          <VantaBackground showGrid={false} />
          <VantaTitleHook
            tag={channelStyle?.name || "AI BREAKDOWN"}
            headline={scene.title || "THE OPEN-SOURCE"}
            highlightWord={scene.subtitle || "BREAKTHROUGH"}
            subtitle={scene.narration || "Actionable intelligence without the noise"}
          />
        </AbsoluteFill>
      );

    case "title-hook":
      if (channelStyle?.name === "VantaBrief") {
        return (
          <AbsoluteFill>
            <VantaBackground showGrid={false} />
            <VantaTitleHook
              tag="VANTA BRIEF"
              headline={scene.title || "TECHNICAL BREAKDOWN"}
              highlightWord={scene.subtitle || "ENGINEERING"}
              subtitle={scene.narration}
            />
          </AbsoluteFill>
        );
      }
      return (
        <TitleHook
          title={scene.title || "The Future of Video Production"}
          subtitle={scene.subtitle || scene.narration || "Built with Remotion & Antigravity"}
          tag={channelStyle?.name || "STUDIO BRIEF"}
          accentColor={accent}
        />
      );

    case "vanta-kinetic-list":
    case "kinetic-list":
      return (
        <AbsoluteFill>
          <VantaBackground showGrid={false} />
          <VantaKineticList
            sectionTitle={scene.title || "// KEY ADVANTAGES"}
            items={
              scene.itemsWithTiming && scene.itemsWithTiming.length > 0
                ? scene.itemsWithTiming
                : scene.leftItems && scene.leftItems.length > 0
                ? scene.leftItems.map((item, i) => ({
                    text: item,
                    tag: `0${i + 1}`,
                    isAccent: i === scene.leftItems!.length - 1,
                  }))
                : [
                    { text: "RAPID EXECUTION", tag: "SPEED", isAccent: false },
                    { text: "LOCAL AI RUNTIME", tag: "ZERO API", isAccent: false },
                    { text: "100% PRIVATE DATA", tag: "SECURITY", isAccent: true },
                  ]
            }
          />
        </AbsoluteFill>
      );

    case "vanta-benchmark":
      return (
        <AbsoluteFill>
          <VantaBackground showGrid={true} />
          <VantaBenchmarkCard
            tag={scene.subtitle || "BENCHMARK EVALUATION // HARDWARE"}
            title={scene.title || "PERFORMANCE BENCHMARK"}
            description={scene.narration}
            metricValue={scene.statNumber || 99.8}
            metricSuffix={scene.statSuffix || "%"}
            metricLabel="ACCURACY"
          />
        </AbsoluteFill>
      );

    case "callout-card":
      if (channelStyle?.name === "VantaBrief") {
        return (
          <AbsoluteFill>
            <VantaBackground showGrid={true} />
            <VantaBenchmarkCard
              tag="KEY METRIC // BENCHMARK"
              title={scene.title || "PERFORMANCE BENCHMARK"}
              description={scene.subtitle || scene.narration}
              metricValue={scene.statNumber || 94}
              metricSuffix={scene.statSuffix || "%"}
              metricLabel="IMPROVEMENT"
            />
          </AbsoluteFill>
        );
      }
      return (
        <CalloutCard
          numberTarget={scene.statNumber || 94}
          numberSuffix={scene.statSuffix || "%"}
          numberPrefix={scene.statPrefix || ""}
          title={scene.title || "Key Metric"}
          description={scene.subtitle || scene.narration || "Measured improvement across production."}
          accentColor={palette.accent || "#10B981"}
        />
      );

    case "vanta-terminal":
    case "terminal":
      return (
        <AbsoluteFill>
          <VantaBackground showGrid={false} />
          <VantaTerminalWindow
            sessionName={scene.subtitle || "vanta-terminal // session_01"}
            command={scene.actionPrompt || "$ studio deploy --engine=local-fast"}
            headline={scene.title || "AUTOMATED PIPELINE READY"}
            description={scene.narration}
          />
        </AbsoluteFill>
      );

    case "vanta-comparison":
      return (
        <AbsoluteFill>
          <VantaBackground showGrid={false} />
          <VantaComparisonSplit
            sectionTitle={scene.title || "HEAD-TO-HEAD BREAKDOWN"}
            left={{
              tag: "PROPRIETARY",
              title: "Closed Cloud API",
              subtitle: "High recurring token costs",
              points: scene.leftItems || ["API metering", "Network dependency", "Telemetry"],
              isWinner: false,
            }}
            right={{
              tag: "OPEN SOURCE",
              title: "Local Weights",
              subtitle: "Full control on your hardware",
              points: scene.rightItems || ["Zero token cost", "100% private data", "Instant speed"],
              isWinner: true,
            }}
          />
        </AbsoluteFill>
      );

    case "comparison":
      if (channelStyle?.name === "VantaBrief") {
        return (
          <AbsoluteFill>
            <VantaBackground showGrid={false} />
            <VantaComparisonSplit
              sectionTitle={scene.title || "HEAD-TO-HEAD BREAKDOWN"}
              left={{
                tag: "PROPRIETARY",
                title: "Closed Cloud API",
                subtitle: "High recurring token costs",
                points: scene.leftItems || ["API metering", "Network latency", "Telemetry"],
                isWinner: false,
              }}
              right={{
                tag: "OPEN SOURCE",
                title: "Local Weights",
                subtitle: "Full control on your hardware",
                points: scene.rightItems || ["Zero token cost", "100% private data", "Instant speed"],
                isWinner: true,
              }}
            />
          </AbsoluteFill>
        );
      }
      return (
        <ComparisonGrid
          leftTitle="The Manual Way"
          rightTitle="The Motion Studio Way"
        />
      );

    case "vanta-timeline":
    case "incident-timeline":
      return (
        <AbsoluteFill>
          <VantaBackground showGrid={true} />
          <VantaIncidentTimeline
            timelineTime={scene.actionPrompt || "06:00 UTC"}
            sourceBadge={scene.subtitle || "INCIDENT TIMELINE"}
            headline={scene.title || "SECURITY EVENT"}
            reportContent={scene.narration}
          />
        </AbsoluteFill>
      );

    case "vanta-asymmetric-split":
    case "asymmetric-split":
      return (
        <AbsoluteFill>
          <VantaBackground showGrid={false} />
          <VantaAsymmetricSplit
            leftLines={scene.leftItems || ["BUT", "DEVELOPERS", "WHO ACTUALLY", "BUILD IN", "PRODUCTION"]}
            accentLines={scene.rightItems || ["IMMEDIATELY", "RUN INTO", "LIMITATIONS"]}
            imageSrc={scene.mediaPath}
          />
        </AbsoluteFill>
      );

    case "vanta-broll-overlay":
    case "broll-overlay":
      return (
        <VantaBrollOverlay
          leadIn={scene.subtitle || "BUT IN REALITY"}
          bigText={scene.title || "WE GOTTA TRY FIRST"}
          imageSrc={scene.mediaPath}
        />
      );

    case "vanta-chapter-card":
    case "chapter-card":
      return (
        <VantaChapterCard
          partNumber={scene.subtitle || "PART 01 :"}
          title={scene.title || "START BEFORE YOU'RE READY"}
          isAccentBg={true}
        />
      );

    case "vanta-spatial-callout":
    case "spatial-callout":
      return (
        <AbsoluteFill>
          <VantaBackground showGrid={false} />
          <VantaSpatialCallout
            leftLabel={
              scene.leftItems && scene.leftItems.length >= 2
                ? { line1: scene.leftItems[0], line2: scene.leftItems[1] }
                : { line1: "INDUSTRY", line2: "STANDARD" }
            }
            centerTopLabel={{ line1: scene.title || "LOCAL", line2: scene.subtitle || "PIPELINE" }}
            rightLabel={
              scene.rightItems && scene.rightItems.length >= 2
                ? { line1: scene.rightItems[0], line2: scene.rightItems[1] }
                : { line1: "ZERO CLOUD", line2: "DEPENDENCY" }
            }
          />
        </AbsoluteFill>
      );



    case "vanta-highlight-browser":
    case "highlight-browser":
      return (
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <VantaBackground showGrid={true} />
          <Grid3DFloor opacity={0.25} />
          <VantaHighlightBrowser
            url={scene.url || "github.com/vanta-brief/intelligence"}
            text={scene.title || "Key finding"}
            highlightText={scene.highlightText || scene.subtitle || "BREAKTHROUGH"}
            statNumber={scene.statNumber ? `${scene.statNumber}${scene.statSuffix || ""}` : undefined}
            statLabel={scene.statLabel}
            highlightStartFrame={scene.highlightStartFrame || 15}
          />
        </AbsoluteFill>
      );

    case "vanta-image-card":
    case "image-card":
      return (
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <VantaBackground showGrid={true} />
          <Grid3DFloor opacity={0.3} />
          <ImagePreviewCard
            imageName={scene.imageName || scene.mediaPath || "hardware_chip.jpg"}
            title={scene.title}
            badge={scene.badgeText || scene.subtitle}
          />
        </AbsoluteFill>
      );

    case "vanta-logo-card":
    case "logo-card":
      return (
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <VantaBackground showGrid={false} />
          <LogoCard
            svgName={scene.svgName || "python.svg"}
            title={scene.title || "Technology"}
            subtitle={scene.subtitle}
            badgeText={scene.badgeText}
            direction="zoom"
          />
        </AbsoluteFill>
      );

    case "talking-head":
    case "b-roll":
    case "video":
      if (scene.mediaPath && scene.mediaAvailable) {
        return (
          <AbsoluteFill style={{ backgroundColor: "#000" }}>
            <Video
              src={staticFile(scene.mediaPath)}
              style={{ width: "100%", height: "100%" }}
            />
          </AbsoluteFill>
        );
      }
      // If video file is not provided yet, fallback to FootagePlaceholder!
      return (
        <FootagePlaceholder
          id={scene.id}
          instruction={scene.instruction || `Record footage: ${scene.title || scene.id}`}
          actionPrompt={scene.actionPrompt || scene.narration}
          targetPath={scene.targetPath || scene.mediaPath || `assets/video/${scene.id}.mp4`}
          mediaAvailable={false}
          sceneLabel="TALKING HEAD / FOOTAGE NEEDED"
          accentColor="#F59E0B"
        />
      );

    case "logo-intro":
      return (
        <LogoIntro
          brandName={channelStyle?.name || scene.title || "MOTION STUDIO"}
          tagline={channelStyle?.tagline || scene.subtitle || "AI Video Engineering"}
          accentColor={accent}
        />
      );

    case "ending-card":
      return (
        <EndingCard
          callToAction={scene.title || "Subscribe for More"}
          website={scene.url || "motion-studio.local"}
          accentColor={accent}
        />
      );

    default:
      return (
        <AbsoluteFill
          style={{
            backgroundColor: palette.background || "#070A12",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontFamily: "'Inter', sans-serif",
            fontSize: "32px",
            fontWeight: 700,
          }}
        >
          {scene.title || scene.id}
        </AbsoluteFill>
      );
  }
};
