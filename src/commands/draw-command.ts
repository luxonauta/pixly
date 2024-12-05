import type { Command, Layer } from "@/types";

export class DrawCommand implements Command {
  private previousGrid: string[][];
  private newGrid: string[][];
  private layerId: string;
  private setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;

  constructor(
    layerId: string,
    previousGrid: string[][],
    newGrid: string[][],
    setLayers: React.Dispatch<React.SetStateAction<Layer[]>>
  ) {
    this.layerId = layerId;
    this.previousGrid = previousGrid;
    this.newGrid = newGrid;
    this.setLayers = setLayers;
  }

  execute(): void {
    this.setLayers((currentLayers) =>
      currentLayers.map((layer) =>
        layer.id === this.layerId ? { ...layer, grid: this.newGrid } : layer
      )
    );
  }

  undo(): void {
    this.setLayers((currentLayers) =>
      currentLayers.map((layer) =>
        layer.id === this.layerId
          ? { ...layer, grid: this.previousGrid }
          : layer
      )
    );
  }
}
