import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { TOKENS } from "../../design-system/tokens";
import { Camera, CameraMode } from "../../components/fireship/Camera";
import { FireshipBackground } from "../../components/fireship/FireshipBackground";
import { PlaceholderFrame } from "../../templates/common/PlaceholderFrame";

// Import 23 validated editorial scene components
import {
  Scene001_DesktopWorkflow,
  Scene002_QualityMacro,
  Scene003_ArtCraftAdobe,
  Scene004_DevLeverage,
  Scene005_CategoryParadox,
  Scene006_MonopolyTax,
  Scene007_TitansProduction,
  Scene008_BuildYourOwn,
  Scene009_WorkflowCoverage,
  Scene010_OligopolyCracks,
  Scene011_KreaKokoro,
  Scene012_LocalSovereignty,
  Scene013_VantaBriefBrand,
  Scene014_EconomicReality,
  Scene015A_PaidConvenience,
  Scene015B_EnterpriseSupport,
  Scene015C_ProfessionalServices,
  Scene015D_FoundationSponsorship,
  Scene016_MicroTools,
  Scene017_NuanceLicensing,
  Scene018A_ValueStack,
  Scene018B_MoatErosion,
  Scene019_VerdictOutro,
} from "./scenes";

// Import verified scenes timeline data (23 purpose-built scenes)
import scenesData from "../../assets/scenes.json";

export interface SceneSpec {
  id: string;
  title: string;
  act: string;
  start_sec: number;
  end_sec: number;
  duration_sec: number;
  start_frame: number;
  end_frame: number;
  duration_frames: number;
  visual_type: string;
  takeaway: string;
  primary_visual: string;
  visual_evolution?: string;
  assets_needed: string[];
  asset_status?: string;
  fact_verification: string;
  transition_to_next?: string;
  spoken_text: string;
  paragraph_indices: number[];
  word_count: number;
}

const scenes = scenesData as SceneSpec[];

// Camera movement cycle (smooth, cinematic, gentle, never shaky)
const CAMERA_CYCLE: CameraMode[] = [
  "pushIn",
  "driftLeft",
  "pullOut",
  "driftRight",
  "breathing",
];

// 6 Verified Placeholder Slots for User Footage (Post-Export)
const PLACEHOLDER_SLOTS = [
  {
    slotId: "slot-001",
    from: 420,
    durationInFrames: 96,
    type: "VIDEO" as const,
    whatToShow: "B-roll demonstration of Artcraft",
    searchTerms: ["developer coding at workstation", "data center servers"],
    durationInSeconds: 3.2,
    timecode: "00:14",
    spokenLine: "Take ArtCraft, for example. It's an open-source project...",
  },
  {
    slotId: "slot-002",
    from: 540,
    durationInFrames: 64,
    type: "SCREEN RECORDING" as const,
    whatToShow: "Graphic design software canvas layout and tools",
    searchTerms: ["photoshop interface layers", "design canvas demo"],
    durationInSeconds: 2.13,
    timecode: "00:18",
    spokenLine: "major Adobe applications, including Photoshop...",
  },
  {
    slotId: "slot-003",
    from: 600,
    durationInFrames: 40,
    type: "VIDEO" as const,
    whatToShow: "B-roll demonstration of Premiere Pro",
    searchTerms: ["developer coding at workstation", "data center servers"],
    durationInSeconds: 1.33,
    timecode: "00:20",
    spokenLine: "Premiere Pro, and After Effects...",
  },
  {
    slotId: "slot-004",
    from: 1740,
    durationInFrames: 95,
    type: "SCREEN RECORDING" as const,
    whatToShow: "Video editor timeline editing demo (DaVinci Resolve / ArtCraft UI)",
    searchTerms: ["davinci resolve timeline editing", "video editor UI"],
    durationInSeconds: 3.17,
    timecode: "00:58",
    spokenLine: "But today, you can use tools like DaVinci Resolve...",
  },
  {
    slotId: "slot-005",
    from: 2190,
    durationInFrames: 104,
    type: "VIDEO" as const,
    whatToShow: "B-roll demonstration of Artcraft",
    searchTerms: ["developer coding at workstation", "data center servers"],
    durationInSeconds: 3.47,
    timecode: "01:13",
    spokenLine: "Projects like ArtCraft are using AI-assisted development...",
  },
  {
    slotId: "slot-006",
    from: 3570,
    durationInFrames: 54,
    type: "SCREEN RECORDING" as const,
    whatToShow: "Terminal / Ollama CLI running local open weights offline",
    searchTerms: ["ollama run llama3", "local llm terminal"],
    durationInSeconds: 1.8,
    timecode: "01:59",
    spokenLine: "You can download a model, run it locally...",
  },
];

export const Episode003OpenSource: React.FC<{ debug?: boolean }> = ({ debug = false }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: TOKENS.colors.charcoal,
        fontFamily: TOKENS.typography.fontFamily.sans,
      }}
    >
      {/* ════════ RULE R1: UNTOUCHED VOICEOVER (STRICTLY ZERO ADDED AUDIO) ════════ */}
      <Audio src={staticFile("audio/003/audio.mp3")} volume={1.0} />

      {/* ════════ 23 PURPOSE-BUILT EDITORIAL SCENES ════════ */}
      {scenes.map((scene, idx) => {
        const nextScene = scenes[idx + 1];
        const sceneFrom = scene.start_frame;
        // Ensure perfect contiguous playback across all 8036 frames without black gaps
        const sceneDuration = (nextScene ? nextScene.start_frame : 8036) - sceneFrom;
        const cameraMode = CAMERA_CYCLE[idx % CAMERA_CYCLE.length];

        return (
          <Sequence
            key={scene.id}
            from={sceneFrom}
            durationInFrames={sceneDuration}
            name={`${scene.id} — ${scene.title}`}
          >
            <Camera mode={cameraMode} intensity={0.5} durationInFrames={sceneDuration}>
              <AbsoluteFill>
                {/* Background ambient texture */}
                <FireshipBackground showGrid={true} showStars={true} />

                {/* Render the purpose-built scene component */}
                {renderSceneComponent(scene.id, sceneDuration)}
              </AbsoluteFill>
            </Camera>
          </Sequence>
        );
      })}

      {/* ════════ 6 USER FOOTAGE PLACEHOLDER OVERLAYS ════════ */}
      {PLACEHOLDER_SLOTS.map((slot) => (
        <Sequence
          key={slot.slotId}
          from={slot.from}
          durationInFrames={slot.durationInFrames}
          name={`Footage Placeholder: ${slot.slotId}`}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 100,
            }}
          >
            <PlaceholderFrame
              slotId={slot.slotId}
              type={slot.type}
              whatToShow={slot.whatToShow}
              searchTerms={slot.searchTerms}
              durationInSeconds={slot.durationInSeconds}
              timecode={slot.timecode}
              spokenLine={slot.spokenLine}
              durationInFrames={slot.durationInFrames}
            />
          </div>
        </Sequence>
      ))}

      {/* ════════ OPTIONAL DEBUG HUD ════════ */}
      {debug && <DebugHUD currentFrame={frame} />}
    </AbsoluteFill>
  );
};

function renderSceneComponent(sceneId: string, durationInFrames: number): React.ReactNode {
  switch (sceneId) {
    case "scene-001":
      return <Scene001_DesktopWorkflow durationInFrames={durationInFrames} />;
    case "scene-002":
      return <Scene002_QualityMacro durationInFrames={durationInFrames} />;
    case "scene-003":
      return <Scene003_ArtCraftAdobe durationInFrames={durationInFrames} />;
    case "scene-004":
      return <Scene004_DevLeverage durationInFrames={durationInFrames} />;
    case "scene-005":
      return <Scene005_CategoryParadox durationInFrames={durationInFrames} />;
    case "scene-006":
      return <Scene006_MonopolyTax durationInFrames={durationInFrames} />;
    case "scene-007":
      return <Scene007_TitansProduction durationInFrames={durationInFrames} />;
    case "scene-008":
      return <Scene008_BuildYourOwn durationInFrames={durationInFrames} />;
    case "scene-009":
      return <Scene009_WorkflowCoverage durationInFrames={durationInFrames} />;
    case "scene-010":
      return <Scene010_OligopolyCracks durationInFrames={durationInFrames} />;
    case "scene-011":
      return <Scene011_KreaKokoro durationInFrames={durationInFrames} />;
    case "scene-012":
      return <Scene012_LocalSovereignty durationInFrames={durationInFrames} />;
    case "scene-013":
      return <Scene013_VantaBriefBrand durationInFrames={durationInFrames} />;
    case "scene-014":
      return <Scene014_EconomicReality durationInFrames={durationInFrames} />;
    case "scene-015a":
      return <Scene015A_PaidConvenience durationInFrames={durationInFrames} />;
    case "scene-015b":
      return <Scene015B_EnterpriseSupport durationInFrames={durationInFrames} />;
    case "scene-015c":
      return <Scene015C_ProfessionalServices durationInFrames={durationInFrames} />;
    case "scene-015d":
      return <Scene015D_FoundationSponsorship durationInFrames={durationInFrames} />;
    case "scene-016":
      return <Scene016_MicroTools durationInFrames={durationInFrames} />;
    case "scene-017":
      return <Scene017_NuanceLicensing durationInFrames={durationInFrames} />;
    case "scene-018a":
      return <Scene018A_ValueStack durationInFrames={durationInFrames} />;
    case "scene-018b":
      return <Scene018B_MoatErosion durationInFrames={durationInFrames} />;
    case "scene-019":
      return <Scene019_VerdictOutro durationInFrames={durationInFrames} />;
    default:
      return null;
  }
}

const DebugHUD: React.FC<{ currentFrame: number }> = ({ currentFrame }) => {
  const currentScene =
    scenes.find((s) => currentFrame >= s.start_frame && currentFrame < s.end_frame) ||
    scenes[scenes.length - 1];

  const currentSeconds = (currentFrame / 30).toFixed(1);

  return (
    <div
      style={{
        position: "absolute",
        top: 24,
        right: 24,
        background: "rgba(0,0,0,0.85)",
        border: `2px solid ${TOKENS.colors.accentYellow}`,
        borderRadius: 8,
        padding: "12px 18px",
        fontFamily: "monospace",
        color: TOKENS.colors.creamLight,
        fontSize: 13,
        lineHeight: 1.5,
        zIndex: 9999,
        pointerEvents: "none",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ color: TOKENS.colors.accentYellow, fontWeight: "bold" }}>
        VANTABRIEF DEBUG HUD
      </div>
      <div>
        Frame: {currentFrame} / 8036 ({currentSeconds}s)
      </div>
      <div>
        Scene: {currentScene?.id} ({currentScene?.title})
      </div>
      <div>
        Type: {currentScene?.visual_type}
      </div>
    </div>
  );
};
