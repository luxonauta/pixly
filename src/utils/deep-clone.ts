export const deepCloneGrid = (grid: string[][]): string[][] => {
  return grid.map((row) => [...row]);
};
