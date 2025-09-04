import type { ColorItem, Layer, Project } from "@/types";

interface ExportManagerProps {
  layers: Layer[];
  gridSize: number;
  colors: ColorItem[];
}

export const ExportManager = ({
  layers,
  gridSize,
  colors
}: ExportManagerProps) => {
  const saveAsImage = () => {
    const canvas = document.createElement("canvas");
    const pixelSize = 1024 / gridSize;
    canvas.width = gridSize * pixelSize;
    canvas.height = gridSize * pixelSize;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    for (const layer of layers) {
      if (!layer.visible) continue;

      for (let rowIndex = 0; rowIndex < layer.grid.length; rowIndex++) {
        const row = layer.grid[rowIndex];

        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          const color = row[colIndex];
          if (!color || color === "transparent") continue;

          ctx.fillStyle = color;
          ctx.fillRect(
            colIndex * pixelSize,
            rowIndex * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      }
    }

    const link = document.createElement("a");

    link.download = `edyt-art-${new Date().toISOString().split("T")[0]}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const saveProject = () => {
    const projectData: Project = {
      name: "Edyt Project",
      colors,
      gridSize,
      layers,
      version: "1.0.0"
    };

    const blob = new Blob([JSON.stringify(projectData)], {
      type: "application/json"
    });
    const link = document.createElement("a");

    link.download = `edyt-project-${new Date().toISOString().split("T")[0]}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div>
      <h3 className="sr-only">Export</h3>
      <div>
        <button type="button" onClick={saveAsImage}>
          Export as PNG
        </button>
        <button type="button" onClick={saveProject}>
          Save project
        </button>
      </div>
    </div>
  );
};
