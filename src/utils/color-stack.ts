import { blendColors } from "./color-blend";

export const mergeColorStack = (colorStack: string[]): string => {
  if (colorStack.length === 0) {
    console.info("Empty color stack. Returning white as default.");
    return "#FFFFFF";
  }

  if (colorStack.length === 1) {
    return colorStack[0];
  }

  return colorStack.reduce((bottomColor, topColor) => {
    const blendedColor = blendColors(topColor, bottomColor);
    return blendedColor;
  });
};
