import { convertHsvToRgb } from "./color-model-conversions";

export const formatColorWithAlpha = (
  hue: number,
  saturation: number,
  value: number,
  alphaPercentage: number
): string => {
  const rgb = convertHsvToRgb(hue / 360, saturation, value);
  const alpha = alphaPercentage / 100;
  return `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${alpha})`;
};

export const formatSolidColor = (
  hue: number,
  saturation: number,
  value: number
): string => {
  const rgb = convertHsvToRgb(hue / 360, saturation, value);
  return `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
};
