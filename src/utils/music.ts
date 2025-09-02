const noteToSemitone: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11
};

export const midiToFreq = (m: number) => 440 * 2 ** ((m - 69) / 12);

export const noteOctToMidi = (note: string, octave: number) => {
  const n = noteToSemitone[note];
  return 12 * (octave + 1) + n;
};

export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export const defaultPalette = () => [0, 2, 4, 7];

export const rootOptions = [
  { label: "C3", midi: noteOctToMidi("C", 3) },
  { label: "D3", midi: noteOctToMidi("D", 3) },
  { label: "E3", midi: noteOctToMidi("E", 3) },
  { label: "F3", midi: noteOctToMidi("F", 3) },
  { label: "G3", midi: noteOctToMidi("G", 3) },
  { label: "A3", midi: noteOctToMidi("A", 3) },
  { label: "B3", midi: noteOctToMidi("B", 3) },
  { label: "C4", midi: noteOctToMidi("C", 4) },
  { label: "D4", midi: noteOctToMidi("D", 4) },
  { label: "E4", midi: noteOctToMidi("E", 4) },
  { label: "F4", midi: noteOctToMidi("F", 4) },
  { label: "G4", midi: noteOctToMidi("G", 4) },
  { label: "A4", midi: noteOctToMidi("A", 4) },
  { label: "B4", midi: noteOctToMidi("B", 4) }
];

export const labelForMidi = (midi: number) => {
  const names = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B"
  ];
  const name = names[midi % 12];
  const oct = Math.floor(midi / 12) - 1;

  return `${name}${oct}`;
};

export const generateDefaultPattern = (): import("@/types").Pattern => {
  return {
    steps: 16,
    palette: defaultPalette(),
    rootMidi: noteOctToMidi("C", 4),
    tracks: [
      {
        id: "t1",
        name: "Lead",
        instrument: "square",
        octave: 0,
        volume: 0.8,
        steps: Array(16).fill(0)
      },
      {
        id: "t2",
        name: "Bass",
        instrument: "triangle",
        octave: -12,
        volume: 0.8,
        steps: Array(16).fill(0)
      },
      {
        id: "t3",
        name: "Arp",
        instrument: "square",
        octave: -12,
        volume: 0.7,
        steps: Array(16).fill(0)
      },
      {
        id: "t4",
        name: "Noise",
        instrument: "noise",
        octave: 0,
        volume: 0.5,
        steps: Array(16).fill(0)
      }
    ]
  };
};

export const resolveMidiFor = (
  rootMidi: number,
  palette: number[],
  trackOctave: number,
  step: import("@/types").StepValue
) => {
  if (step === 0) return null;

  const idx = step - 1;
  const semi = palette[idx] ?? palette[0] ?? 0;

  return rootMidi + semi + trackOctave;
};
