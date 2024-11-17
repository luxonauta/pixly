import { convertHsvToRgb } from "./convert-hsv-to-rgb";

export const getFormattedColorWithAlpha = (
  hue: number,
  saturation: number,
  value: number,
  alpha: number
): string => {
  const rgb = convertHsvToRgb(hue / 360, saturation, value);
  return `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${alpha / 100})`;
};

export const getFormattedSolidColor = (
  hue: number,
  saturation: number,
  value: number
): string => {
  const rgb = convertHsvToRgb(hue / 360, saturation, value);
  return `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
};
