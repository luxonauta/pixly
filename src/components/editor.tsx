"use client";

import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import type React from "react";
import { useEffect, useState } from "react";
import { mergeColorStack } from "@/utils/color-stack";
import { Alert } from "./alert";
import { CustomButton } from "./button";
import { Card } from "./card";
import { ColorPicker } from "./color-picker";
import { Grid } from "./grid";
import { CustomInput } from "./input";
import { LayerManager } from "./layer-manager";
import { CustomSelect } from "./select";

interface ColorItem {
  id: string;
  value: string;
}

interface Layer {
  id: string;
  visible: boolean;
  grid: string[][];
}

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

  const handleLayerAdd = () => {
    const newLayer: Layer = {
      id: `layer-${layers.length + 1}`,
      visible: true,
      grid: Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill("#FFFFFF"))
    };
    setLayers([...layers, newLayer]);
    setActiveLayerId(newLayer.id);
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
    setIsDrawing(true);
    handleCellClick(rowIndex, colIndex);
  };

  const handleMouseEnter = (rowIndex: number, colIndex: number): void => {
    if (isDrawing) handleCellClick(rowIndex, colIndex);
  };

  const handleMouseUp = (): void => setIsDrawing(false);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setLayers((currentLayers) =>
      currentLayers.map((layer) =>
        layer.id === activeLayerId
          ? {
              ...layer,
              grid: layer.grid.map((row, i) =>
                i === rowIndex
                  ? [
                      ...row.slice(0, colIndex),
                      selectedColor,
                      ...row.slice(colIndex + 1)
                    ]
                  : row
              )
            }
          : layer
      )
    );
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
    setLayers((currentLayers) =>
      currentLayers.map((layer) => ({
        ...layer,
        grid: Array(gridSize)
          .fill(null)
          .map(() => Array(gridSize).fill("#FFFFFF"))
      }))
    );
  };

  return (
    <>
      <div className="flex w-full flex-col gap-3 md:flex-row">
        <div className="flex w-80 max-w-full flex-col gap-2">
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
        </div>
        <div className="min-w-0 flex-1">
          <Grid
            gridSize={gridSize}
            grid={getMergedGrid()}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseUp={handleMouseUp}
          />
        </div>
      </div>
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
