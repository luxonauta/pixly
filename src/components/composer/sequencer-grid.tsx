import type { Pattern, StepValue, Track } from "@/types";

import { TrackRow } from "./track-row";

type Props = {
  pattern: Pattern;
  playingStep: number;
  onChangeStep: (trackId: string, stepIdx: number, value: StepValue) => void;
};

export const SequencerGrid = ({
  pattern,
  playingStep,
  onChangeStep
}: Props) => (
  <div className="sequencer-grid">
    {pattern.tracks.map((t: Track) => (
      <TrackRow
        key={t.id}
        track={t}
        stepsCount={pattern.steps}
        playingStep={playingStep}
        onChangeStep={onChangeStep}
      />
    ))}
  </div>
);
