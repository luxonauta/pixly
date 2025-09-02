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

interface ColorPickerProps {
  onColorSelect: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ onColorSelect }) => {
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

  const [isPanelOpen, setIsPanelOpen] = useState(false);

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
      ref: React.RefObject<HTMLDivElement | null>,
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
    <>
      <div className={isPanelOpen ? "dropdown-menu open" : "dropdown-menu"}>
        <button
          type="button"
          onClick={() => {
            setIsPanelOpen(!isPanelOpen);
          }}
          className="trigger"
        >
          +
        </button>
        <div className="panel">
          <div
            ref={pickerRef}
            onMouseDown={handlePickerMouseDown}
            className="color-area"
            style={{
              backgroundColor: baseColorString,
              backgroundImage:
                "linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)"
            }}
          >
            <div
              className="picker-indicator"
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
          <div className="sliders-wrapper">
            <div className="sliders">
              <div
                ref={hueRef}
                className="slide"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)"
                }}
                onMouseDown={() => setIsHueDragging(true)}
              >
                <div
                  className="picker-indicator"
                  style={{
                    left: `${(selectedColor.hue / 360) * 100}%`,
                    backgroundColor: baseColorString
                  }}
                />
              </div>
              <div
                ref={alphaRef}
                className="slide"
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
                  className="picker-indicator"
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
              className="preview"
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
          <div className="color-input">
            <input
              type="text"
              value={hexValue}
              onChange={handleHexInput}
              placeholder="#000000"
              maxLength={7}
            />
            <button
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
            >
              Add color
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
