"use client";

import {
  BeakerIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon
} from "@heroicons/react/20/solid";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { DrawCommand } from "@/commands/draw-command";
import { CommandHistory } from "@/commands/history";
import { useCommands } from "@/hooks/use-commands";
import type { ColorItem, Layer } from "@/types";
import { cn } from "@/utils/cn";
import { mergeColorStack } from "@/utils/color-stack";
import { deepCloneGrid } from "@/utils/deep-clone";
import { Alert } from "./alert";
import { BucketTool } from "./bucket-tool";
import { CustomButton } from "./button";
import { Card } from "./card";
import { ColorPicker } from "./color-picker";
import { ExportManager } from "./export-manager";
import { Grid } from "./grid";
import { CustomInput } from "./input";
import { LayerManager } from "./layer-manager";
import { CustomSelect } from "./select";
import { ShortcutIndicator } from "./shortcut-indicator";

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
        .map(() => Array(gridSize).fill("#FFFFFF"))
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
        .map(() => Array(gridSize).fill("#FFFFFF"))
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
    )
      return;

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
    if (!isDrawing || !activeLayerId) return;

    const activeLayer = layers.find((layer) => layer.id === activeLayerId);
    if (
      !activeLayer ||
      rowIndex < 0 ||
      rowIndex >= gridSize ||
      colIndex < 0 ||
      colIndex >= gridSize
    )
      return;

    const newGrid = deepCloneGrid(activeLayer.grid);
    newGrid[rowIndex][colIndex] = selectedColor;

    setLayers((currentLayers) =>
      currentLayers.map((layer) =>
        layer.id === activeLayerId ? { ...layer, grid: newGrid } : layer
      )
    );
  };

  const handleMouseUp = (): void => {
    if (!isDrawing || !previousGrid || !activeLayerId) return;

    const activeLayer = layers.find((layer) => layer.id === activeLayerId);
    if (!activeLayer) return;

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
    )
      return;

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

          if (cellColor && cellColor !== "#FFFFFF") {
            colorStacks[row][col].push(cellColor);
          }
        }
      }
    }

    return colorStacks.map((row) =>
      row.map((stack) => {
        if (!stack.length) return "#FFFFFF";
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
      .map(() => Array(gridSize).fill("#FFFFFF"));

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
      <div className="flex w-full flex-col items-stretch gap-3 md:max-h-[42rem] md:flex-row">
        <div className="relative w-80 max-w-full shrink-0 overflow-y-auto">
          <div className="flex h-max w-full flex-col gap-2">
            <Card
              title="Canvas size"
              description="Select a predefined canvas size or define a custom size to suit your needs."
            >
              <CustomSelect
                label="Canvas size"
                options={availableGridSizes.map((size) => ({
                  value: size,
                  label: `${size}x${size}`
                }))}
                value={gridSize.toString()}
                className="mt-2"
                onChange={(value) => handleGridSizeChange(Number(value))}
              />
              <CustomInput
                type="number"
                label="Custom size"
                value={customGridSize}
                onChange={(e) => setCustomGridSize(e.target.value)}
                placeholder="Custom size (8-64)"
              />
              <div className="relative mt-2 flex gap-2">
                <CustomButton
                  icon={<PlusIcon className="h-3.5 w-3.5" strokeWidth={3} />}
                  label="Apply custom size"
                  type="button"
                  onClick={handleCustomGridSizeChange}
                />
                <CustomButton
                  icon={<TrashIcon className="h-3.5 w-3.5" strokeWidth={3} />}
                  label="Reset canvas"
                  type="button"
                  onClick={handleClear}
                  className="flex-1"
                />
              </div>
            </Card>
            <Card
              title="Tools"
              description="Choose between brush or bucket fill tool"
            >
              <div className="mt-3 flex gap-2">
                <CustomButton
                  icon={<PencilIcon className="h-3.5 w-3.5" strokeWidth={3} />}
                  label="Brush"
                  type="button"
                  onClick={() => setActiveTool("brush")}
                  className={cn(
                    "flex-1",
                    activeTool === "brush" &&
                      "bg-black text-white hover:bg-black/90"
                  )}
                />
                <CustomButton
                  icon={<BeakerIcon className="h-3.5 w-3.5" strokeWidth={3} />}
                  label="Bucket"
                  type="button"
                  onClick={() => setActiveTool("bucket")}
                  className={cn(
                    "flex-1",
                    activeTool === "bucket" &&
                      "bg-black text-white hover:bg-black/90"
                  )}
                />
              </div>
            </Card>
            <Card
              title="Color palette"
              description="Choose a color from the palette or add a custom color to personalize your drawing."
            >
              <div className="mt-3 flex flex-wrap gap-2.5">
                {colors.map((color) => (
                  <label key={color.id} className="relative">
                    <input
                      type="radio"
                      name="colorPicker"
                      value={color.value}
                      checked={selectedColor === color.value}
                      onChange={() => setSelectedColor(color.value)}
                      className="absolute h-0 w-0 opacity-0"
                    />
                    <span
                      style={{ backgroundColor: color.value }}
                      className={`block h-8 w-8 cursor-pointer rounded-md border border-transparent shadow-sm transition-transform hover:scale-105 focus:outline-none active:scale-100 ${
                        selectedColor === color.value &&
                        "border-black/20 ring-2 ring-[#171717] ring-offset-2 ring-offset-white/90"
                      }`}
                    />
                  </label>
                ))}
                <ColorPicker
                  trigger={
                    <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-transparent bg-white shadow-sm transition-transform hover:scale-105 focus:outline-none active:scale-100">
                      <PlusIcon className="h-3.5 w-3.5" strokeWidth={3} />
                    </div>
                  }
                  onColorSelect={handleColorSelect}
                />
              </div>
            </Card>
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
        </div>
        <div className="min-w-0 flex-1">
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
      </div>
      <ShortcutIndicator />
      {alertMessage && (
        <Alert
          title={alertTitle}
          message={alertMessage}
          isOpen={!!alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </>
  );
};
