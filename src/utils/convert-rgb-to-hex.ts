export const convertRGBToHex = (
  red: number,
  green: number,
  blue: number,
  alpha?: number
): string => {
  const hex = `#${[red, green, blue]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
  return alpha !== undefined
    ? `${hex}${Math.round(alpha * 255)
        .toString(16)
        .padStart(2, "0")}`
    : hex;
};
