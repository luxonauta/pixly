import { ArrowDownTrayIcon, PhotoIcon } from "@heroicons/react/20/solid";
import type { ColorItem, Layer, Project } from "@/types";
import { CustomButton } from "./button";
import { Card } from "./card";

interface ExportManagerProps {
  layers: Layer[];
  gridSize: number;
  colors: ColorItem[];
}

export const ExportManager: React.FC<ExportManagerProps> = ({
  layers,
  gridSize,
  colors
}) => {
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
          if (color !== "#FFFFFF") {
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
    }

    const link = document.createElement("a");
    link.download = `pixel-art-${new Date().toISOString().split("T")[0]}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const saveProject = () => {
    const projectData: Project = {
      layers,
      gridSize,
      colors,
      version: "1.0.0"
    };

    const blob = new Blob([JSON.stringify(projectData)], {
      type: "application/json"
    });
    const link = document.createElement("a");

    link.download = `pixel-project-${new Date().toISOString().split("T")[0]}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Card
      title="Export"
      description="Save your work as an image or save the project to continue editing later (soon)."
    >
      <div className="mt-2 flex flex-wrap gap-2">
        <CustomButton
          icon={<PhotoIcon className="h-3.5 w-3.5" strokeWidth={3} />}
          label="Export as PNG"
          type="button"
          onClick={saveAsImage}
        />
        <CustomButton
          icon={<ArrowDownTrayIcon className="h-3.5 w-3.5" strokeWidth={3} />}
          label="Save project"
          type="button"
          onClick={saveProject}
          className="flex-1"
        />
      </div>
    </Card>
  );
};
