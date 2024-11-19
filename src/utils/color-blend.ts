import { parseColor } from "./color-parse";

const blendColorChannel = (
  foregroundChannel: number,
  backgroundChannel: number,
  alpha: number
): number => {
  return Math.round(
    foregroundChannel * alpha + backgroundChannel * (1 - alpha)
  );
};

export const blendColors = (topColor: string, bottomColor: string): string => {
  const foreground = parseColor(topColor);
  const background = parseColor(bottomColor);

  if (!foreground || !background) {
    console.warn("Invalid color inputs. Returning top color.");
    return topColor;
  }

  const blendedRed = blendColorChannel(
    foreground.r,
    background.r,
    foreground.a
  );

  const blendedGreen = blendColorChannel(
    foreground.g,
    background.g,
    foreground.a
  );

  const blendedBlue = blendColorChannel(
    foreground.b,
    background.b,
    foreground.a
  );

  return `rgb(${blendedRed}, ${blendedGreen}, ${blendedBlue})`;
};
