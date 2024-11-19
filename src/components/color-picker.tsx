import { MenuItem } from "@headlessui/react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HSV } from "@/types";
import {
  formatColorWithAlpha,
  formatSolidColor
} from "@/utils/color-conversion";
import { convertHsvToRgb } from "@/utils/convert-hsv-to-rgb";
import { CustomButton } from "./button";
import { DropdownMenu } from "./dropdown-menu";

interface ColorPickerProps {
  trigger: React.ReactNode;
  onColorSelect: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  trigger,
  onColorSelect
}) => {
  const [selectedColor, setSelectedColor] = useState<HSV>({
    hue: 0,
    saturation: 100,
    value: 100,
    alpha: 100
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isHueDragging, setIsHueDragging] = useState(false);
  const [isAlphaDragging, setIsAlphaDragging] = useState(false);

  const pickerRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const alphaRef = useRef<HTMLDivElement>(null);

  const handlePickerMouseDown = (e: React.MouseEvent) => {
    if (!pickerRef.current) return;
    setIsDragging(true);
    const rect = pickerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setSelectedColor((prev) => ({
      ...prev,
      saturation: Math.round(x * 100),
      value: Math.round((1 - y) * 100)
    }));
  };

  const handlePickerMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !pickerRef.current) return;
      const rect = pickerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      setSelectedColor((prev) => ({
        ...prev,
        saturation: Math.round(x * 100),
        value: Math.round((1 - y) * 100)
      }));
    },
    [isDragging]
  );

  const handleHueMouseDown = (e: React.MouseEvent) => {
    if (!hueRef.current) return;
    setIsHueDragging(true);
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setSelectedColor((prev) => ({
      ...prev,
      hue: Math.round(x * 360)
    }));
  };

  const handleHueMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isHueDragging || !hueRef.current) return;
      const rect = hueRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setSelectedColor((prev) => ({
        ...prev,
        hue: Math.round(x * 360)
      }));
    },
    [isHueDragging]
  );

  const handleAlphaMouseDown = (e: React.MouseEvent) => {
    if (!alphaRef.current) return;
    setIsAlphaDragging(true);
    const rect = alphaRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setSelectedColor((prev) => ({
      ...prev,
      alpha: Math.round(x * 100)
    }));
  };

  const handleAlphaMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isAlphaDragging || !alphaRef.current) return;
      const rect = alphaRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setSelectedColor((prev) => ({
        ...prev,
        alpha: Math.round(x * 100)
      }));
    },
    [isAlphaDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsHueDragging(false);
    setIsAlphaDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handlePickerMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handlePickerMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handlePickerMouseMove, handleMouseUp]);

  useEffect(() => {
    if (isHueDragging) {
      window.addEventListener("mousemove", handleHueMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleHueMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isHueDragging, handleHueMouseMove, handleMouseUp]);

  useEffect(() => {
    if (isAlphaDragging) {
      window.addEventListener("mousemove", handleAlphaMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleAlphaMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isAlphaDragging, handleAlphaMouseMove, handleMouseUp]);

  const baseColor = convertHsvToRgb(selectedColor.hue / 360, 100, 100);
  const baseColorString = `rgb(${baseColor.red}, ${baseColor.green}, ${baseColor.blue})`;

  return (
    <DropdownMenu trigger={trigger}>
      <div className="flex w-48 flex-col gap-2">
        <div
          ref={pickerRef}
          className="relative h-48 w-full cursor-crosshair rounded"
          style={{
            backgroundColor: baseColorString,
            backgroundImage:
              "linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)"
          }}
          onMouseDown={handlePickerMouseDown}
        >
          <div
            className="absolute h-4 w-4 -translate-x-2 -translate-y-2 rounded-full border-2 border-white"
            style={{
              left: `${selectedColor.saturation}%`,
              top: `${100 - selectedColor.value}%`,
              backgroundColor: formatColorWithAlpha(
                selectedColor.hue,
                selectedColor.saturation,
                selectedColor.value,
                selectedColor.alpha
              )
            }}
          />
        </div>
        <div className="mt-2 flex w-full items-stretch gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <div
              ref={hueRef}
              className="relative h-3 cursor-pointer rounded-full bg-[#EBEBE6]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)"
              }}
              onMouseDown={handleHueMouseDown}
            >
              <div
                className="absolute top-1/2 h-4 w-4 -translate-x-2 -translate-y-1/2 rounded-full border-2 border-white"
                style={{
                  left: `${(selectedColor.hue / 360) * 100}%`,
                  backgroundColor: baseColorString
                }}
              />
            </div>
            <div
              ref={alphaRef}
              className="relative h-3 cursor-pointer rounded-full bg-[#EBEBE6]"
              style={{
                backgroundImage: `linear-gradient(to right, transparent, ${formatSolidColor(
                  selectedColor.hue,
                  selectedColor.saturation,
                  selectedColor.value
                )})`
              }}
              onMouseDown={handleAlphaMouseDown}
            >
              <div
                className="absolute top-1/2 h-4 w-4 -translate-x-2 -translate-y-1/2 rounded-full border-2 border-white"
                style={{
                  left: `${selectedColor.alpha}%`,
                  backgroundColor: formatColorWithAlpha(
                    selectedColor.hue,
                    selectedColor.saturation,
                    selectedColor.value,
                    selectedColor.alpha
                  )
                }}
              />
            </div>
          </div>
          <div
            className="h-10 w-10 rounded"
            style={{
              backgroundColor: formatColorWithAlpha(
                selectedColor.hue,
                selectedColor.saturation,
                selectedColor.value,
                selectedColor.alpha
              )
            }}
          />
        </div>
        <MenuItem>
          <CustomButton
            label="Add color"
            type="button"
            onClick={() =>
              onColorSelect(
                formatColorWithAlpha(
                  selectedColor.hue,
                  selectedColor.saturation,
                  selectedColor.value,
                  selectedColor.alpha
                )
              )
            }
            className="mt-1 w-full justify-center"
          />
        </MenuItem>
      </div>
    </DropdownMenu>
  );
};
