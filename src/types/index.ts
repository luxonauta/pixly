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
