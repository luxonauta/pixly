export type InstrumentType = "square" | "triangle" | "noise";

export type StepValue = 0 | 1 | 2 | 3 | 4;

export type Track = {
  id: string;
  name: string;
  instrument: InstrumentType;
  octave: number;
  volume: number;
  steps: StepValue[];
};

export type Pattern = {
  tracks: Track[];
  steps: number;
  palette: number[];
  rootMidi: number;
};

export type TransportState = {
  bpm: number;
  isPlaying: boolean;
  step: number;
};

export interface ColorItem {
  id: string;
  value: string;
}

export interface HSV {
  hue: number;
  saturation: number;
  value: number;
  alpha: number;
}

export interface Layer {
  id: string;
  grid: string[][];
  visible: boolean;
}

export interface Project {
  name: string;
  colors: ColorItem[];
  gridSize: number;
  layers: Layer[];
  version: string;
}

export interface EditorState {
  layers: Layer[];
  activeLayerId: string;
}

export interface Command {
  execute: () => void;
  undo: () => void;
}
