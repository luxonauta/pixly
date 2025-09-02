type Props = {
  bpm: number;
  isPlaying: boolean;
  onToggle: () => void;
  onBpm: (v: number) => void;
};

export const Transport = ({ bpm, isPlaying, onToggle, onBpm }: Props) => (
  <div className="transport">
    <button
      type="button"
      className={`btn ${isPlaying ? "danger" : "primary"}`}
      onClick={onToggle}
    >
      {isPlaying ? "Stop" : "Play"}
    </button>
    <label>
      <small>BPM</small>
      <input
        id="bpm-input"
        type="number"
        min={40}
        max={240}
        value={bpm}
        onChange={(e) => onBpm(Number(e.target.value))}
      />
    </label>
    <label>
      <small>Tempo</small>
      <input
        id="tempo-input"
        type="range"
        min={60}
        max={200}
        value={bpm}
        onChange={(e) => onBpm(Number(e.target.value))}
      />
    </label>
    <small>
      Space to Play/Stop <br />
      Right Click to Reset Step
    </small>
  </div>
);
