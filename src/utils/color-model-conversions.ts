export const convertHsvToRgb = (
  hue: number,
  saturation: number,
  value: number
) => {
  const normalizedSaturation = saturation / 100;
  const normalizedValue = value / 100;

  const sector = Math.floor(hue * 6);
  const fractionalSector = hue * 6 - sector;

  const secondaryValue = normalizedValue * (1 - normalizedSaturation);
  const intermediateValue1 =
    normalizedValue * (1 - fractionalSector * normalizedSaturation);
  const intermediateValue2 =
    normalizedValue * (1 - (1 - fractionalSector) * normalizedSaturation);

  const rgbComponents = calculateRgbComponents(
    sector,
    normalizedValue,
    secondaryValue,
    intermediateValue1,
    intermediateValue2
  );

  return {
    red: Math.round(rgbComponents.red * 255),
    green: Math.round(rgbComponents.green * 255),
    blue: Math.round(rgbComponents.blue * 255)
  };
};

const calculateRgbComponents = (
  sector: number,
  primaryValue: number,
  secondaryValue: number,
  intermediateValue1: number,
  intermediateValue2: number
) => {
  let red = 0;
  let green = 0;
  let blue = 0;

  switch (sector % 6) {
    case 0:
      red = primaryValue;
      green = intermediateValue2;
      blue = secondaryValue;
      break;
    case 1:
      red = intermediateValue1;
      green = primaryValue;
      blue = secondaryValue;
      break;
    case 2:
      red = secondaryValue;
      green = primaryValue;
      blue = intermediateValue2;
      break;
    case 3:
      red = secondaryValue;
      green = intermediateValue1;
      blue = primaryValue;
      break;
    case 4:
      red = intermediateValue2;
      green = secondaryValue;
      blue = primaryValue;
      break;
    case 5:
      red = primaryValue;
      green = secondaryValue;
      blue = intermediateValue1;
      break;
  }

  return { red, green, blue };
};

export const convertRgbToHsv = (
  red: number,
  green: number,
  blue: number
): { hue: number; saturation: number; value: number } => {
  const normalizedRed = red / 255;
  const normalizedGreen = green / 255;
  const normalizedBlue = blue / 255;

  const maximumValue = Math.max(normalizedRed, normalizedGreen, normalizedBlue);
  const minimumValue = Math.min(normalizedRed, normalizedGreen, normalizedBlue);
  const valueRange = maximumValue - minimumValue;

  const hue = calculateHue(
    normalizedRed,
    normalizedGreen,
    normalizedBlue,
    maximumValue,
    valueRange
  );

  const saturation = maximumValue === 0 ? 0 : valueRange / maximumValue;
  const value = maximumValue;

  return {
    hue: hue * 360,
    saturation: saturation * 100,
    value: value * 100
  };
};

const calculateHue = (
  red: number,
  green: number,
  blue: number,
  maximumValue: number,
  valueRange: number
): number => {
  let hue = 0;

  if (maximumValue !== valueRange) {
    switch (maximumValue) {
      case red:
        hue = (green - blue) / valueRange + (green < blue ? 6 : 0);
        break;
      case green:
        hue = (blue - red) / valueRange + 2;
        break;
      case blue:
        hue = (red - green) / valueRange + 4;
        break;
    }
    hue /= 6;
  }

  return hue;
};

export const convertHexToRgb = (
  hexColor: string
): { red: number; green: number; blue: number } | null => {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);

  return match
    ? {
        red: Number.parseInt(match[1], 16),
        green: Number.parseInt(match[2], 16),
        blue: Number.parseInt(match[3], 16)
      }
    : null;
};

export const convertRgbToHex = (
  red: number,
  green: number,
  blue: number
): string => {
  const formatToHex = (value: number) => {
    const hexValue = Math.round(value).toString(16);
    return hexValue.length === 1 ? `0${hexValue}` : hexValue;
  };

  return `#${formatToHex(red)}${formatToHex(green)}${formatToHex(blue)}`;
};
