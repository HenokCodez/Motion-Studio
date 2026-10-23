import React from "react";
import { Composition, Folder } from "remotion";
import { MyComposition } from "./Composition";
import { ContentWorkflow } from "./compositions/ContentWorkflow";
import { HenaVantaOrbit } from "./compositions/HenaVantaOrbit";
import {
  TitleHook,
  CalloutCard,
  ComparisonGrid,
  LiquidBackground,
  LogoIntro,
  EndingCard,
} from "./templates";
import { BatteryRangeScene } from "./compositions/BatteryRangeScene";
import { EthiopiaRoundTripScene } from "./compositions/EthiopiaRoundTripScene";
import { BydQinPlusShowcase } from "./compositions/BydQinPlusShowcase";
import { AnimatedMap } from "./components/global/AnimatedMap";
import { FootagePlaceholder } from "./components/global/FootagePlaceholder";
import { VantaBriefPreview } from "./compositions/VantaBriefPreview";
import { VantaBriefShowcase } from "./compositions/VantaBriefShowcase";
import { Episode003OpenSource } from "./compositions/episodes/Episode003OpenSource";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* VantaBrief Master Production Showcase */}
      <Composition
        id="VantaBrief-Showcase"
        component={VantaBriefShowcase}
        durationInFrames={675}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* VantaBrief Brand Preview Composition */}
      <Composition
        id="VantaBrief-Preview"
        component={VantaBriefPreview}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />


      {/* BYD Qin Plus DM-i Automotive Showcase */}

      {/* Existing User Compositions */}
      <MyComposition />

      {/* Production Motion Templates */}

      {/* Multi-Channel Automated Full Video Composition */}

      {/* Global Animated Map under VantaBrief Style */}

      {/* Global Animated Map under HanaVanta Style */}

      {/* Global Replaceable Footage Placeholder */}
      <Folder name="old">
        <Composition
          id="Global-FootagePlaceholder"
          component={FootagePlaceholder as any}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            id: "camera-take-01",
            instruction: "RECORD: Talking-head introduction on camera",
            actionPrompt: "Welcome to VantaBrief. Today we analyze the automated production system.",
            targetPath: "assets/video/host_intro.mp4",
            orientation: "landscape",
            accentColor: "#EF4444",
          }}
        />
        <Composition
          id="Global-AnimatedMap-HanaVanta"
          component={AnimatedMap}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: "HanaVanta Historical Trade Route",
            subtitle: "Documentary exploration of the Great Rift Corridor",
            theme: {
              background: "#0C0D10",
              surface: "#18181B",
              routeColor: "#F59E0B",
              glowColor: "rgba(245, 158, 11, 0.4)",
              accentColor: "#E11D48",
              textPrimary: "#F5F5F4",
              textMuted: "#A1A1AA",
              fontFamily: "'Playfair Display', serif",
            },
          }}
        />
        <Composition
          id="Global-AnimatedMap-VantaBrief"
          component={AnimatedMap}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: "VantaBrief Infrastructure Pipeline",
            subtitle: "Automated distributed deployment corridor",
            theme: {
              background: "#070A12",
              surface: "#0F172A",
              routeColor: "#3B82F6",
              glowColor: "rgba(59, 130, 246, 0.4)",
              accentColor: "#10B981",
              textPrimary: "#F8FAFC",
              textMuted: "#94A3B8",
              fontFamily: "'Inter', sans-serif",
            },
          }}
        />
        <Composition
          id="Template-EndingCard"
          component={EndingCard}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ChannelVideo"
          component={Episode003OpenSource}
          durationInFrames={8036}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-LogoIntro"
          component={LogoIntro}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-ComparisonGrid"
          component={ComparisonGrid}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-CalloutCard"
          component={CalloutCard}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-TitleHook"
          component={TitleHook}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Template-LiquidBackground"
          component={LiquidBackground}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ContentWorkflow"
          component={ContentWorkflow}
          durationInFrames={360}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="HenaVantaOrbit"
          component={HenaVantaOrbit}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="BydQinPlusShowcase"
          component={BydQinPlusShowcase}
          durationInFrames={450}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="EthiopiaRoundTripScene"
          component={EthiopiaRoundTripScene}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="BatteryRangeScene"
          component={BatteryRangeScene}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Folder name="Vanta-Brief">
        <Composition
          id="VantaBrief-Episode-003"
          component={Episode003OpenSource}
          durationInFrames={8036}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ debug: false }}
        />
        <Composition
          id="VantaBrief-Episode-003-Debug"
          component={Episode003OpenSource}
          durationInFrames={8036}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ debug: true }}
        />
        <Folder name="Video-1" />
        <Folder name="Templates" />
      </Folder>
    </>
  );
};
