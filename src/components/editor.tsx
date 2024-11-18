"use client";

import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import type React from "react";
import { useEffect, useState } from "react";
import { Alert } from "./alert";
import { CustomButton } from "./button";
import { Card } from "./card";
import { ColorPicker } from "./color-picker";
import { Grid } from "./grid";
import { CustomInput } from "./input";
import { CustomSelect } from "./select";

interface ColorItem {
  id: string;
  value: string;
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
  const [grid, setGrid] = useState<string[][]>([]);
  const [alertTitle, setAlertTitle] = useState("Error");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    setGridSize(getCanvasGridSize());
    setAvailableGridSizes(getCustomGridSizes());
  }, []);

  useEffect(() => {
    setGrid(
      Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill("#FFFFFF"))
    );
  }, [gridSize]);

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

  const handleClear = (): void => {
    setGrid(
      Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill("#FFFFFF"))
    );
  };

  const handleCellClick = (rowIndex: number, colIndex: number): void => {
    const newGrid = grid.map((row, i) =>
      i === rowIndex
        ? [...row.slice(0, colIndex), selectedColor, ...row.slice(colIndex + 1)]
        : row
    );
    setGrid(newGrid);
  };

  const handleMouseDown = (rowIndex: number, colIndex: number): void => {
    setIsDrawing(true);
    handleCellClick(rowIndex, colIndex);
  };

  const handleMouseEnter = (rowIndex: number, colIndex: number): void => {
    if (isDrawing) handleCellClick(rowIndex, colIndex);
  };

  const handleMouseUp = (): void => setIsDrawing(false);

  const handleColorSelect = (color: string): void => {
    const newColor: ColorItem = {
      id: `color-${colors.length + 1}`,
      value: color
    };
    setColors((prevColors) => [...prevColors, newColor]);
    setSelectedColor(color);
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
        </div>
        <div className="min-w-0 flex-1">
          <Grid
            gridSize={gridSize}
            grid={grid}
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
