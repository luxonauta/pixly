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

const isInBounds = (point: Point, gridSize: number): boolean => {
  return (
    point.row >= 0 &&
    point.row < gridSize &&
    point.col >= 0 &&
    point.col < gridSize
  );
};

const floodFill = (
  grid: string[][],
  start: Point,
  targetColor: string,
  replacementColor: string
): string[][] => {
  if (targetColor === replacementColor) return grid;

  if (grid[start.row][start.col] !== targetColor) return grid;

  const result = grid.map((row) => [...row]);
  const stack: Point[] = [start];

  const directions = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 }
  ];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;

    if (result[current.row][current.col] !== targetColor) continue;
    result[current.row][current.col] = replacementColor;

    for (const dir of directions) {
      const next: Point = {
        row: current.row + dir.row,
        col: current.col + dir.col
      };

      if (
        isInBounds(next, grid.length) &&
        result[next.row][next.col] === targetColor
      ) {
        stack.push(next);
      }
    }
  }

  return result;
};

export const BucketTool: React.FC<BucketToolProps> = ({
  grid,
  selectedColor,
  gridSize,
  onFill
}) => {
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const targetColor = grid[rowIndex][colIndex];
    const newGrid = floodFill(
      grid,
      { row: rowIndex, col: colIndex },
      targetColor,
      selectedColor
    );
    onFill(newGrid);
  };

  return (
    <div className="art-grid">
      <div
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cellColor, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}-${cellColor}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleCellClick(rowIndex, colIndex);
                }
              }}
              className="cell"
              style={{
                backgroundColor: cellColor
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};
