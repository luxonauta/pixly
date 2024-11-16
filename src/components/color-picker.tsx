import { XMarkIcon } from "@heroicons/react/20/solid";
import type React from "react";
import { useState } from "react";
import type { RGBColor } from "@/types/rgb-color";
import { convertHexToRGB } from "@/utils/convert-hex-to-rgb";
import { convertRGBToHex } from "@/utils/convert-rgb-to-hex";

interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onColorSelect: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  isOpen,
  onClose,
  onColorSelect
}) => {
  const [rgbColor, setRgbColor] = useState<RGBColor>({
    red: 0,
    green: 0,
    blue: 0,
    alpha: 1
  });

  const [hexColor, setHexColor] = useState<string>("#000000FF");

  const updateRGBColor = (channel: keyof RGBColor, value: string) => {
    const updatedColor = {
      ...rgbColor,
      [channel]:
        channel === "alpha"
          ? Number.parseFloat(value)
          : Number.parseInt(value, 10)
    };
    setRgbColor(updatedColor);
    setHexColor(
      convertRGBToHex(
        updatedColor.red,
        updatedColor.green,
        updatedColor.blue,
        updatedColor.alpha
      )
    );
  };

  const updateHexColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = event.target.value;
    setHexColor(newHex);
    const rgbFromHex = convertHexToRGB(newHex);
    if (rgbFromHex) {
      setRgbColor(rgbFromHex);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-96 rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">Color Picker</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 transition-colors hover:bg-gray-100"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 p-4">
          {["red", "green", "blue", "alpha"].map((channel) => (
            <div key={channel} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {channel.toUpperCase()}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max={channel === "alpha" ? "1" : "255"}
                  step={channel === "alpha" ? "0.01" : "1"}
                  value={rgbColor[channel as keyof RGBColor].toString()}
                  onChange={(e) =>
                    updateRGBColor(channel as keyof RGBColor, e.target.value)
                  }
                  className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200"
                />
                <input
                  type="number"
                  min="0"
                  max={channel === "alpha" ? "1" : "255"}
                  step={channel === "alpha" ? "0.01" : "1"}
                  value={rgbColor[channel as keyof RGBColor].toString()}
                  onChange={(e) =>
                    updateRGBColor(channel as keyof RGBColor, e.target.value)
                  }
                  className="w-16 rounded-md border px-2 py-1 text-sm"
                />
              </div>
            </div>
          ))}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Hexadecimal
            </label>
            <input
              type="text"
              value={hexColor}
              onChange={updateHexColor}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
          <div
            className="h-24 rounded-md border"
            style={{
              backgroundColor: `rgba(${rgbColor.red}, ${rgbColor.green}, ${rgbColor.blue}, ${rgbColor.alpha})`
            }}
          />
          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onColorSelect(hexColor)}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
