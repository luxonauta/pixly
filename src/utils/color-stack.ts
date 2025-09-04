import { blendColors } from "./color-blend";

export const mergeColorStack = (colorStack: string[]): string => {
  const stack = colorStack.filter((c) => c && c !== "transparent");

  if (stack.length === 0) return "transparent";
  if (stack.length === 1) return stack[0];

  return stack.reduce((bottom, top) => blendColors(top, bottom));
};
