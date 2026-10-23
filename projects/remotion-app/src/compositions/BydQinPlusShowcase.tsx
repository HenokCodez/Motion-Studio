import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { BatteryRangeScene } from "./BatteryRangeScene";
import { EthiopiaRoundTripScene } from "./EthiopiaRoundTripScene";

export const BydQinPlusShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#07080B" }}>
      {/* Scene 1: Battery Technology & Driving Range (10s / 300 frames) */}
      <Sequence from={0} durationInFrames={300} name="Scene 1: Battery & Range">
        <BatteryRangeScene />
      </Sequence>

      {/* Scene 2: Addis Ababa to Bahir Dar and Back (5s / 150 frames) */}
      <Sequence from={300} durationInFrames={150} name="Scene 2: Ethiopia Round Trip">
        <EthiopiaRoundTripScene />
      </Sequence>
    </AbsoluteFill>
  );
};
