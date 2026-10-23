import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  VantaBackground,
  VantaFontStyles,
  VantaTitleHook,
  VantaKineticList,
  VantaBenchmarkCard,
  VantaTerminalWindow,
  VantaComparisonSplit,
  VantaIncidentTimeline,
  VantaAsymmetricSplit,
  VantaBrollOverlay,
  VantaChapterCard,
} from "../components/vantabrief";

export const VantaBriefShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#231F20" }}>
      <VantaFontStyles />

      {/* Scene 1: High-Impact Hook (Frames 0 - 75, 2.5s) */}
      <Sequence from={0} durationInFrames={75}>
        <VantaBackground showGrid={false} />
        <VantaTitleHook
          tag="AI BREAKDOWN // EPISODE 001"
          headline="THE OPEN-SOURCE"
          highlightWord="BREAKTHROUGH"
          subtitle="How local models are outperforming billion-dollar cloud APIs"
        />
      </Sequence>

      {/* Scene 2: Staggered Kinetic List (Frames 75 - 150, 2.5s) */}
      <Sequence from={75} durationInFrames={75}>
        <VantaBackground showGrid={false} />
        <VantaKineticList
          sectionTitle="// ARCHITECTURE ADVANTAGES"
          items={[
            { text: "RAPID LOCAL EXECUTION", tag: "SPEED", isAccent: false },
            { text: "DETERMINISTIC LATENCY", tag: "SUB-10MS", isAccent: false },
            { text: "100% PRIVATE SECURITY", tag: "ZERO LEAKS", isAccent: true },
          ]}
        />
      </Sequence>

      {/* Scene 3: Benchmark Accuracy Gauge (Frames 150 - 225, 2.5s) */}
      <Sequence from={150} durationInFrames={75}>
        <VantaBackground showGrid={true} />
        <VantaBenchmarkCard
          tag="HARDWARE EVALUATION // RTX A2000"
          title="PARALLEL INFERENCE SPEED"
          description="Rebuilt from low-level C++ tensors with direct CUDA kernel mapping and zero VRAM spills."
          metricValue={99.8}
          metricSuffix="%"
          metricLabel="ACCURACY"
        />
      </Sequence>

      {/* Scene 4: Developer Terminal Window (Frames 225 - 300, 2.5s) */}
      <Sequence from={225} durationInFrames={75}>
        <VantaBackground showGrid={false} />
        <VantaTerminalWindow
          sessionName="vanta-terminal // session_01"
          command="$ studio deploy --engine=local-fast"
          headline="AUTOMATED PIPELINE READY"
          description="Loaded local Whisper models, voice alignment cues, and deterministic visual tracks."
          badges={[
            { text: "VRAM: 3.8/4.0 GB", isAccent: true },
            { text: "STATUS: ACTIVE", isAccent: false },
          ]}
        />
      </Sequence>

      {/* Scene 5: Side-by-Side Comparison Split (Frames 300 - 375, 2.5s) */}
      <Sequence from={300} durationInFrames={75}>
        <VantaBackground showGrid={false} />
        <VantaComparisonSplit
          sectionTitle="HEAD-TO-HEAD ARCHITECTURE"
          left={{
            tag: "CLOUD PROPRIETARY",
            title: "Closed Cloud APIs",
            subtitle: "High recurring fees and data telemetry",
            points: [
              "Pay-per-token API metering",
              "Telemetry & rate limiting",
              "External network dependency",
              "Vendor lock-in",
            ],
            isWinner: false,
          }}
          right={{
            tag: "OPEN SOURCE",
            title: "Local Weights Engine",
            subtitle: "Full control on your own GPU hardware",
            points: [
              "Zero recurring token fees",
              "100% private data security",
              "Deterministic offline speed",
              "Unlimited custom weights",
            ],
            isWinner: true,
          }}
        />
      </Sequence>

      {/* Scene 6: Incident Timeline Scrubber (Frames 375 - 450, 2.5s) */}
      <Sequence from={375} durationInFrames={75}>
        <VantaBackground showGrid={true} />
        <VantaIncidentTimeline
          timelineTime="06:00 UTC"
          sourceBadge="SECURITY AUDIT"
          headline="LEGACY ACCESS INCIDENT"
          reportContent="Third party API credentials were exposed during decommissioning. Offline local pipelines prevent this vulnerability entirely."
        />
      </Sequence>

      {/* Scene 7: Asymmetric Split Layout (Frames 450 - 525, 2.5s) - Inspired by Ref 50 */}
      <Sequence from={450} durationInFrames={75}>
        <VantaBackground showGrid={false} />
        <VantaAsymmetricSplit
          leftLines={["BUT", "DEVELOPERS", "WHO ACTUALLY", "BUILD IN", "PRODUCTION"]}
          accentLines={["IMMEDIATELY", "RUN INTO", "LIMITATIONS"]}
        />
      </Sequence>

      {/* Scene 8: Massive Translucent B-Roll Overlay (Frames 525 - 600, 2.5s) - Inspired by Ref 47 & 51 */}
      <Sequence from={525} durationInFrames={75}>
        <VantaBrollOverlay
          leadIn="BUT IN REALITY"
          bigText="WE GOTTA TRY FIRST"
        />
      </Sequence>

      {/* Scene 9: High-Energy Chapter Transition (Frames 600 - 675, 2.5s) - Inspired by Ref 46 */}
      <Sequence from={600} durationInFrames={75}>
        <VantaChapterCard
          partNumber="PART 02 :"
          title="START BEFORE YOU'RE READY"
          isAccentBg={true}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
