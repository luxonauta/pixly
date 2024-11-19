export const parseColor = (color: string) => {
  if (color.startsWith("#")) {
    const red = Number.parseInt(color.slice(1, 3), 16);
    const green = Number.parseInt(color.slice(3, 5), 16);
    const blue = Number.parseInt(color.slice(5, 7), 16);
    return { r: red, g: green, b: blue, a: 1 };
  }

  const rgbaMatch = color.match(
    /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/
  );

  if (rgbaMatch) {
    return {
      r: Number.parseInt(rgbaMatch[1]),
      g: Number.parseInt(rgbaMatch[2]),
      b: Number.parseInt(rgbaMatch[3]),
      a: rgbaMatch[4] ? Number.parseFloat(rgbaMatch[4]) : 1
    };
  }

  console.error("Invalid color format:", color);
  return null;
};
