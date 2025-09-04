import { Grid } from "./grid";

interface Point {
  row: number;
  col: number;
}

interface BucketToolProps {
  grid: string[][];
  selectedColor: string;
  gridSize: number;
  onFill: (newGrid: string[][]) => void;
}

const keyOf = (r: number, c: number) => `${r}-${c}`;

export const BucketTool = ({
  grid,
  selectedColor,
  gridSize,
  onFill
}: BucketToolProps) => {
  const fillAt = (row: number, col: number) => {
    const target = grid[row]?.[col];
    if (target === undefined || target === selectedColor) return;

    const newGrid = grid.map((r) => r.slice());
    const stack: Point[] = [{ row, col }];
    const seen = new Set<string>();

    while (stack.length) {
      const p = stack.pop() as Point;
      if (
        p.row < 0 ||
        p.row >= gridSize ||
        p.col < 0 ||
        p.col >= gridSize ||
        seen.has(keyOf(p.row, p.col))
      ) {
        continue;
      }

      if (newGrid[p.row][p.col] !== target) {
        continue;
      }

      newGrid[p.row][p.col] = selectedColor;
      seen.add(keyOf(p.row, p.col));

      stack.push({ row: p.row + 1, col: p.col });
      stack.push({ row: p.row - 1, col: p.col });
      stack.push({ row: p.row, col: p.col + 1 });
      stack.push({ row: p.row, col: p.col - 1 });
    }

    onFill(newGrid);
  };

  return (
    <Grid
      grid={grid}
      gridSize={gridSize}
      onMouseDown={fillAt}
      onMouseEnter={() => {}}
      onMouseUp={() => {}}
    />
  );
};
