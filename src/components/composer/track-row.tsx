import type { StepValue, Track } from "@/types";

type Props = {
  track: Track;
  stepsCount: number;
  playingStep: number;
  onChangeStep: (trackId: string, stepIdx: number, value: StepValue) => void;
};

const clsFor = (v: StepValue) => {
  if (v === 1) return "step level-1";
  if (v === 2) return "step level-2";
  if (v === 3) return "step level-3";
  if (v === 4) return "step level-4";
  return "step";
};

export const TrackRow = ({
  track,
  stepsCount,
  playingStep,
  onChangeStep
}: Props) => (
  <div className="track-row">
    <div className="info">
      <span>{track.name}</span>
      <small>
        {track.instrument === "noise"
          ? "Noise"
          : track.instrument === "square"
            ? "Square"
            : "Triangle"}{" "}
        • Vol {Math.round(track.volume * 100)}%
      </small>
    </div>
    <div className="steps">
      {Array.from({ length: stepsCount }).map((_, i) => {
        const v = track.steps[i];
        const playing = i === playingStep;

        return (
          <button
            key={`${track.id}-${i}`}
            type="button"
            className={`${clsFor(v)}${playing ? " playing" : ""}`}
            onClick={() => {
              const max = track.instrument === "noise" ? 1 : 4;
              const next = ((v + 1) % (max + 1)) as StepValue;
              onChangeStep(track.id, i, next);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              onChangeStep(track.id, i, 0);
            }}
            aria-label={`Step ${i + 1}`}
          >
            {v === 0 ? "" : v}
          </button>
        );
      })}
    </div>
  </div>
);
