import type { RGBColor } from "@/types/rgb-color";

export const convertHexToRGB = (hex: string): RGBColor | null => {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(
    hex
  );
  return match
    ? {
        red: Number.parseInt(match[1], 16),
        green: Number.parseInt(match[2], 16),
        blue: Number.parseInt(match[3], 16),
        alpha: match[4] ? Number.parseInt(match[4], 16) / 255 : 1
      }
    : null;
};
