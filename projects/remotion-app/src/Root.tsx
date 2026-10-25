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
import { Ep003Test } from "./compositions/episodes/Ep003Test";
import { UserBoardCoverFlow } from "./compositions/user_board/UserBoardCoverFlow";
import { UserBoardProgressCard } from "./compositions/user_board/UserBoardProgressCard";
import { UserBoardTrioCards } from "./compositions/user_board/UserBoardTrioCards";
import { UserBoardTimelineRuler } from "./compositions/user_board/UserBoardTimelineRuler";
import { UserBoardActivityRings } from "./compositions/user_board/UserBoardActivityRings";
import { KaisplainCanvas } from "./compositions/explainer_canvas/KaisplainCanvas";
import { FullExplainerCanvas } from "./compositions/explainer_canvas/FullExplainerCanvas";
import { WhiteboardExplainer } from "./compositions/whiteboard/WhiteboardExplainer";
import { Explainer as WhiteboardKitExplainer } from "../workflow2-whiteboard/remotion/Video";
// @ts-ignore
import whiteboardKitPlan from "../workflow2-whiteboard/plan.json";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Workflow 2: Whiteboard Kit Explainer */}
      <Composition
        id="Workflow2-WhiteboardKit"
        component={WhiteboardKitExplainer}
        durationInFrames={(whiteboardKitPlan as any)?.meta?.totalFrames || 1410}
        fps={(whiteboardKitPlan as any)?.meta?.fps || 30}
        width={(whiteboardKitPlan as any)?.meta?.width || 1920}
        height={(whiteboardKitPlan as any)?.meta?.height || 1080}
        defaultProps={{
          plan: whiteboardKitPlan,
        }}
        calculateMetadata={({ props }) => {
          const p = (props as any)?.plan || whiteboardKitPlan;
          return {
            durationInFrames: p?.meta?.totalFrames || 1410,
            fps: p?.meta?.fps || 30,
            width: p?.meta?.width || 1920,
            height: p?.meta?.height || 1080,
            props: {
              plan: p,
            },
          };
        }}
      />

      {/* Hand-Drawn Whiteboard Explainer (7946 frames = 264.86s @ 30fps) */}
      <Composition
        id="WhiteboardExplainer"
        component={WhiteboardExplainer}
        durationInFrames={7946}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Workflow 2: Full 4.4-Minute Technical Explainer Canvas (7946 frames = 264.86s @ 30fps) */}
      <Composition
        id="Workflow2-FullExplainerCanvas"
        component={FullExplainerCanvas}
        durationInFrames={7946}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          channelName: "VantaBrief",
          audioPath: "audio/003/audio.mp3",
        }}
      />

      {/* Workflow 2: Infinite Whiteboard Explainer Canvas Prototype (300 frames = 10s @ 30fps) */}
      <Composition
        id="Workflow2-ExplainerCanvas"
        component={KaisplainCanvas}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          channelName: "VantaBrief",
        }}
      />

      {/* User Curated Pinterest Board Compositions (7.5s Duration = 225 frames) */}
      <Composition
        id="UserBoard-CoverFlow"
        component={UserBoardCoverFlow}
        durationInFrames={225}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="UserBoard-ProgressCard"
        component={UserBoardProgressCard}
        durationInFrames={225}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="UserBoard-TrioCards"
        component={UserBoardTrioCards}
        durationInFrames={225}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="UserBoard-TimelineRuler"
        component={UserBoardTimelineRuler}
        durationInFrames={225}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="UserBoard-ActivityRings"
        component={UserBoardActivityRings}
        durationInFrames={225}
        fps={30}
        width={1920}
        height={1080}
      />


      {/* POC Automated Premiere Test Compositions (Transparent Overlays) */}
      <Composition
        id="POC-TitleHook"
        component={TitleHook}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "In 2026, Everything Changes",
          subtitle: "Edit, create, and build without paying a single subscription",
          tag: "VANTA BRIEF INTEL",
          accentColor: "#1677FF",
        }}
      />
      <Composition
        id="POC-CalloutCard"
        component={CalloutCard}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "ArtCraft & Open Source",
          description: "Replacing Photoshop, Premiere Pro, and After Effects with open code.",
          numberTarget: 100,
          numberPrefix: "$",
          numberSuffix: " Saved",
          accentColor: "#10B981",
        }}
      />
      <Composition
        id="POC-ComparisonGrid"
        component={ComparisonGrid}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          leftTitle: "Paid Subscriptions",
          leftPoints: [
            "Monthly fee for Photoshop",
            "Monthly fee for Premiere Pro",
            "Vendor lock-in & perpetual rent",
          ],
          rightTitle: "Open Alternatives",
          rightPoints: [
            "DaVinci Resolve & ArtCraft",
            "Blender 3D & LibreOffice",
            "Local AI on your own computer",
          ],
        }}
      />

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
        {/* Isolated Test Composition: Approved Hybrid Section 142.52s-187.86s */}
        <Composition
          id="Ep003Test"
          component={Ep003Test}
          durationInFrames={1360}
          fps={30}
          width={1920}
          height={1080}
        />
        <Folder name="Video-1" />
        <Folder name="Templates" />
      </Folder>
    </>
  );
};
