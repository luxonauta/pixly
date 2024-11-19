import { MenuItem } from "@headlessui/react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  formatColorWithAlpha,
  formatSolidColor
} from "@/utils/color-conversion";
import {
  convertHexToRgb,
  convertHsvToRgb,
  convertRgbToHex,
  convertRgbToHsv
} from "@/utils/color-model-conversions";
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
  const [selectedColor, setSelectedColor] = useState({
    hue: 0,
    saturation: 100,
    value: 100,
    alpha: 100
  });

  const [hexValue, setHexValue] = useState("#FF0000");
  const [isDragging, setIsDragging] = useState(false);
  const [isHueDragging, setIsHueDragging] = useState(false);
  const [isAlphaDragging, setIsAlphaDragging] = useState(false);

  const pickerRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const alphaRef = useRef<HTMLDivElement>(null);

  const updateHexValue = useCallback(() => {
    const rgb = convertHsvToRgb(
      selectedColor.hue,
      selectedColor.saturation,
      selectedColor.value
    );
    setHexValue(convertRgbToHex(rgb.red, rgb.green, rgb.blue));
  }, [selectedColor]);

  useEffect(() => {
    updateHexValue();
  }, [updateHexValue]);

  const handleHexInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = event.target.value.toUpperCase();
    setHexValue(newHex);

    if (/^#[0-9A-F]{6}$/i.test(newHex)) {
      const rgb = convertHexToRgb(newHex);
      if (rgb) {
        const hsv = convertRgbToHsv(rgb.red, rgb.green, rgb.blue);
        setSelectedColor((prev) => ({
          ...prev,
          hue: Math.round(hsv.hue),
          saturation: Math.round(hsv.saturation),
          value: Math.round(hsv.value)
        }));
      }
    }
  };

  const calculateColorFromMouse = useCallback(
    (
      event: MouseEvent | React.MouseEvent,
      ref: React.RefObject<HTMLDivElement>,
      callback: (x: number, y: number) => void
    ) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = Math.max(
        0,
        Math.min(1, (event.clientX - rect.left) / rect.width)
      );
      const y = Math.max(
        0,
        Math.min(1, (event.clientY - rect.top) / rect.height)
      );
      callback(x, y);
    },
    []
  );

  const handlePickerMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    calculateColorFromMouse(event, pickerRef, (x, y) => {
      setSelectedColor((prev) => ({
        ...prev,
        saturation: Math.round(x * 100),
        value: Math.round((1 - y) * 100)
      }));
    });
  };

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isDragging) {
        calculateColorFromMouse(event, pickerRef, (x, y) => {
          setSelectedColor((prev) => ({
            ...prev,
            saturation: Math.round(x * 100),
            value: Math.round((1 - y) * 100)
          }));
        });
      } else if (isHueDragging) {
        calculateColorFromMouse(event, hueRef, (x) => {
          setSelectedColor((prev) => ({
            ...prev,
            hue: Math.round(x * 360)
          }));
        });
      } else if (isAlphaDragging) {
        calculateColorFromMouse(event, alphaRef, (x) => {
          setSelectedColor((prev) => ({
            ...prev,
            alpha: Math.round(x * 100)
          }));
        });
      }
    },
    [isDragging, isHueDragging, isAlphaDragging, calculateColorFromMouse]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsHueDragging(false);
    setIsAlphaDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging || isHueDragging || isAlphaDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [
    isDragging,
    isHueDragging,
    isAlphaDragging,
    handleMouseMove,
    handleMouseUp
  ]);

  const baseColor = convertHsvToRgb(selectedColor.hue, 100, 100);
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
              onMouseDown={() => setIsHueDragging(true)}
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
              onMouseDown={() => setIsAlphaDragging(true)}
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
        <input
          type="text"
          value={hexValue}
          onChange={handleHexInput}
          className="w-full rounded border border-black/10 bg-white/40 px-2 py-1 font-medium uppercase"
          placeholder="#000000"
          maxLength={7}
        />
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
