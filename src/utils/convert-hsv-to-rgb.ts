export const convertHsvToRgb = (
  hue: number,
  saturation: number,
  value: number
) => {
  const normalizedSaturation = saturation / 100;
  const normalizedValue = value / 100;

  const sector = Math.floor(hue * 6);
  const fractionalSector = hue * 6 - sector;

  const p = normalizedValue * (1 - normalizedSaturation);
  const q = normalizedValue * (1 - fractionalSector * normalizedSaturation);
  const t =
    normalizedValue * (1 - (1 - fractionalSector) * normalizedSaturation);

  let red = 0;
  let green = 0;
  let blue = 0;

  switch (sector % 6) {
    case 0:
      red = normalizedValue;
      green = t;
      blue = p;
      break;
    case 1:
      red = q;
      green = normalizedValue;
      blue = p;
      break;
    case 2:
      red = p;
      green = value;
      blue = t;
      break;
    case 3:
      red = p;
      green = q;
      blue = normalizedValue;
      break;
    case 4:
      red = t;
      green = p;
      blue = value;
      break;
    case 5:
      red = value;
      green = p;
      blue = q;
      break;
  }

  return {
    red: Math.round(red * 255),
    green: Math.round(green * 255),
    blue: Math.round(blue * 255)
  };
};
