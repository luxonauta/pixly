"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

import { DrawCommand } from "@/commands/draw-command";
import { CommandHistory } from "@/commands/history";
import { useCommands } from "@/hooks/use-commands";
import type { ColorItem, Layer } from "@/types";
import { mergeColorStack } from "@/utils/color-stack";
import { deepCloneGrid } from "@/utils/deep-clone";

import { Dialog } from "../shared/dialog";
import { ShortcutIndicator } from "../shared/shortcut-indicator";
import { BucketTool } from "./bucket-tool";
import { ColorPicker } from "./color-picker";
import { ExportManager } from "./export-manager";
import { Grid } from "./grid";
import { LayerManager } from "./layer-manager";

const initialColors: ColorItem[] = [
  { id: "color-1", value: "#000000" },
  { id: "color-2", value: "#FFFFFF" },
  { id: "color-3", value: "#0090FF" },
  { id: "color-4", value: "#AD7F58" },
  { id: "color-5", value: "#30A46C" },
  { id: "color-6", value: "#E5484D" },
  { id: "color-7", value: "#8E4EC6" },
  { id: "color-8", value: "#FFFF57" }
];

const getCustomGridSizes = (): string[] => {
  if (typeof window === "undefined") return ["8", "16", "32"];
  const savedSizes = localStorage.getItem("customGridSizes");

  return savedSizes
    ? JSON.parse(savedSizes).sort(
        (a: string, b: string) => Number(a) - Number(b)
      )
    : ["8", "16", "32"];
};

const saveCustomGridSize = (size: number): void => {
  if (typeof window === "undefined") return;
  const sizes = getCustomGridSizes();

  if (!sizes.includes(size.toString())) {
    const updatedSizes = [...sizes, size.toString()].sort(
      (a, b) => Number(a) - Number(b)
    );
    localStorage.setItem("customGridSizes", JSON.stringify(updatedSizes));
  }
};

const getCanvasGridSize = (): number => {
  if (typeof window === "undefined") return 16;
  const savedGridSize = localStorage.getItem("customGridSize");
  return savedGridSize ? Number(savedGridSize) : 16;
};

const saveCanvasGridSize = (size: number): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("customGridSize", size.toString());
};

export const Editor: React.FC = () => {
  const [customGridSize, setCustomGridSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [colors, setColors] = useState<ColorItem[]>(initialColors);
  const [isDrawing, setIsDrawing] = useState(false);
  const [gridSize, setGridSize] = useState(16);
  const [availableGridSizes, setAvailableGridSizes] = useState<string[]>([]);
  const [alertTitle, setAlertTitle] = useState("Error");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string>("");
  const [activeTool, setActiveTool] = useState<"brush" | "bucket">("brush");

  const [previousGrid, setPreviousGrid] = useState<string[][] | null>(null);
  const commandHistory = useRef(new CommandHistory());
  useCommands(commandHistory.current);

  useEffect(() => {
    setGridSize(getCanvasGridSize());
    setAvailableGridSizes(getCustomGridSizes());
  }, []);

  useEffect(() => {
    const initialLayer: Layer = {
      id: "layer-1",
      visible: true,
      grid: Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill("#222"))
    };
    setLayers([initialLayer]);
    setActiveLayerId(initialLayer.id);
  }, [gridSize]);

  const handleLayerAdd = (scrollContainer: HTMLDivElement | null) => {
    const newLayer: Layer = {
      id: `layer-${layers.length + 1}`,
      visible: true,
      grid: Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill("#222"))
    };

    setLayers([...layers, newLayer]);
    setActiveLayerId(newLayer.id);

    setTimeout(() => {
      if (scrollContainer) {
        const scrollHeight = scrollContainer.scrollHeight;
        scrollContainer.scrollTo({
          top: scrollHeight,
          behavior: "smooth"
        });
      }
    }, 0);
  };

  const handleLayerDelete = (id: string) => {
    if (layers.length === 1) {
      setAlertTitle("Cannot delete layer");
      setAlertMessage("You must have at least one layer.");
      return;
    }

    const newLayers = layers.filter((layer) => layer.id !== id);
    setLayers(newLayers);

    if (activeLayerId === id) setActiveLayerId(newLayers[0].id);
  };

  const handleLayerVisibilityToggle = (id: string) => {
    setLayers((currentLayers) =>
      currentLayers.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const handleLayerReorder = (oldIndex: number, newIndex: number) => {
    const newLayers = [...layers];
    const [movedLayer] = newLayers.splice(oldIndex, 1);
    newLayers.splice(newIndex, 0, movedLayer);
    setLayers(newLayers);
  };

  const handleGridSizeChange = (size: number): void => {
    saveCanvasGridSize(size);
    setGridSize(size);
  };

  const handleCustomGridSizeChange = (): void => {
    const size = Number.parseInt(customGridSize, 10);
    if (Number.isNaN(size) || size < 8 || size > 64) {
      setAlertTitle("Invalid size input");
      setAlertMessage("Please enter a valid size between 8 and 64.");
      return;
    }

    if (availableGridSizes.includes(size.toString())) {
      setAlertTitle("Duplicate grid size");
      setAlertMessage(`The canvas size ${size}x${size} already exists.`);
      return;
    }

    saveCustomGridSize(size);
    setAvailableGridSizes(
      [...availableGridSizes, size.toString()].sort(
        (a, b) => Number(a) - Number(b)
      )
    );
    handleGridSizeChange(size);
    setCustomGridSize("");
  };

  const handleMouseDown = (rowIndex: number, colIndex: number): void => {
    const activeLayer = layers.find((layer) => layer.id === activeLayerId);

    if (
      !activeLayer ||
      rowIndex < 0 ||
      rowIndex >= gridSize ||
      colIndex < 0 ||
      colIndex >= gridSize
    ) {
      return;
    }

    setPreviousGrid(deepCloneGrid(activeLayer.grid));
    setIsDrawing(true);

    const newGrid = deepCloneGrid(activeLayer.grid);
    newGrid[rowIndex][colIndex] = selectedColor;

    setLayers((currentLayers) =>
      currentLayers.map((layer) =>
        layer.id === activeLayerId ? { ...layer, grid: newGrid } : layer
      )
    );
  };

  const handleMouseEnter = (rowIndex: number, colIndex: number): void => {
    if (!isDrawing || !activeLayerId) {
      return;
    }

    const activeLayer = layers.find((layer) => layer.id === activeLayerId);

    if (
      !activeLayer ||
      rowIndex < 0 ||
      rowIndex >= gridSize ||
      colIndex < 0 ||
      colIndex >= gridSize
    ) {
      return;
    }

    const newGrid = deepCloneGrid(activeLayer.grid);
    newGrid[rowIndex][colIndex] = selectedColor;

    setLayers((currentLayers) =>
      currentLayers.map((layer) =>
        layer.id === activeLayerId ? { ...layer, grid: newGrid } : layer
      )
    );
  };

  const handleMouseUp = (): void => {
    if (!isDrawing || !previousGrid || !activeLayerId) {
      return;
    }

    const activeLayer = layers.find((layer) => layer.id === activeLayerId);
    if (!activeLayer) {
      return;
    }

    const drawCommand = new DrawCommand(
      activeLayerId,
      previousGrid,
      deepCloneGrid(activeLayer.grid),
      setLayers
    );

    commandHistory.current.execute(drawCommand);
    setPreviousGrid(null);
    setIsDrawing(false);
  };

  const handleBucketFill = (newGrid: string[][]) => {
    const activeLayer = layers.find((layer) => layer.id === activeLayerId);

    if (
      !activeLayer ||
      !newGrid ||
      newGrid.length !== gridSize ||
      newGrid.some((row) => row.length !== gridSize)
    ) {
      return;
    }

    const previousGrid = deepCloneGrid(activeLayer.grid);

    const fillCommand = new DrawCommand(
      activeLayerId,
      previousGrid,
      newGrid,
      setLayers
    );

    commandHistory.current.execute(fillCommand);
  };

  const getMergedGrid = (): string[][] => {
    const colorStacks: string[][][] = Array(gridSize)
      .fill(null)
      .map(() =>
        Array(gridSize)
          .fill(null)
          .map(() => [])
      );

    for (const layer of layers) {
      if (!layer.visible || !layer.grid) continue;

      for (let row = 0; row < gridSize; row++) {
        if (!layer.grid[row]) continue;

        for (let col = 0; col < gridSize; col++) {
          const cellColor = layer.grid[row]?.[col];

          if (cellColor && cellColor !== "#222") {
            colorStacks[row][col].push(cellColor);
          }
        }
      }
    }

    return colorStacks.map((row) =>
      row.map((stack) => {
        if (!stack.length) return "#222";
        if (stack.length === 1) return stack[0];

        return mergeColorStack(stack);
      })
    );
  };

  const handleColorSelect = (color: string): void => {
    const newColor: ColorItem = {
      id: `color-${colors.length + 1}`,
      value: color
    };
    setColors((prevColors) => [...prevColors, newColor]);
    setSelectedColor(color);
  };

  const handleClear = (): void => {
    const activeLayer = layers.find((layer) => layer.id === activeLayerId);
    if (!activeLayer) return;

    const previousGrid = deepCloneGrid(activeLayer.grid);
    const newGrid = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill("#222"));

    const clearCommand = new DrawCommand(
      activeLayerId,
      previousGrid,
      newGrid,
      setLayers
    );

    commandHistory.current.execute(clearCommand);
  };

  return (
    <>
      <section id="editor" className="container">
        <div className="header">
          <h2>Edyt</h2>
          <p>Simple pixel-art tool for creating sprites.</p>
        </div>
        <div className="wrapper">
          <div className="toolbar">
            <div>
              <div>
                <label htmlFor="canvas-size-select" className="sr-only">
                  Canvas Size
                </label>
                <select
                  id="canvas-size-select"
                  value={gridSize.toString()}
                  onChange={(e) => handleGridSizeChange(Number(e.target.value))}
                >
                  {availableGridSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}x{size}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="custom-canvas-size" className="sr-only">
                  Custom size
                </label>
                <input
                  id="custom-canvas-size"
                  type="number"
                  value={customGridSize}
                  onChange={(e) => setCustomGridSize(e.target.value)}
                  placeholder="Custom size (8-64)"
                />
              </div>
              <div>
                <button type="button" onClick={handleCustomGridSizeChange}>
                  Apply custom size
                </button>
                <button type="button" onClick={handleClear}>
                  Clear canvas
                </button>
              </div>
            </div>
            <div>
              <div>
                <button type="button" onClick={() => setActiveTool("brush")}>
                  Brush
                </button>
                <button type="button" onClick={() => setActiveTool("bucket")}>
                  Bucket
                </button>
              </div>
              <div className="palette">
                {colors.map((color) => (
                  <label key={color.id}>
                    <input
                      type="radio"
                      name="colorPicker"
                      value={color.value}
                      checked={selectedColor === color.value}
                      onChange={() => setSelectedColor(color.value)}
                    />
                    <span style={{ backgroundColor: color.value }} />
                  </label>
                ))}
                <ColorPicker onColorSelect={handleColorSelect} />
              </div>
            </div>
            <LayerManager
              layers={layers}
              activeLayerId={activeLayerId}
              onLayerAdd={handleLayerAdd}
              onLayerDelete={handleLayerDelete}
              onLayerVisibilityToggle={handleLayerVisibilityToggle}
              onLayerReorder={handleLayerReorder}
              onActiveLayerChange={setActiveLayerId}
            />
            <ExportManager
              layers={layers}
              gridSize={gridSize}
              colors={colors}
            />
          </div>
          {activeTool === "brush" ? (
            <Grid
              gridSize={gridSize}
              grid={getMergedGrid()}
              onMouseDown={handleMouseDown}
              onMouseEnter={handleMouseEnter}
              onMouseUp={handleMouseUp}
            />
          ) : (
            <BucketTool
              grid={
                layers[layers.findIndex((l) => l.id === activeLayerId)].grid
              }
              selectedColor={selectedColor}
              gridSize={gridSize}
              onFill={handleBucketFill}
            />
          )}
        </div>
      </section>
      <ShortcutIndicator />
      {alertMessage && (
        <Dialog
          title={alertTitle}
          message={alertMessage}
          isOpen={!!alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </>
  );
};
