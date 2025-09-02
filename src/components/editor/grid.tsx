interface EditorGridProps {
  grid: string[][];
  gridSize: number;
  onMouseDown: (rowIndex: number, colIndex: number) => void;
  onMouseEnter: (rowIndex: number, colIndex: number) => void;
  onMouseUp: () => void;
}

export const Grid = ({
  grid,
  gridSize,
  onMouseDown,
  onMouseEnter,
  onMouseUp
}: EditorGridProps) => (
  <div className="art-grid">
    <div
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
      }}
      onMouseLeave={onMouseUp}
    >
      {grid.map((row, rowIndex) =>
        row.map((cellColor, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}-${cellColor}`}
            onMouseDown={() => onMouseDown(rowIndex, colIndex)}
            onMouseEnter={() => onMouseEnter(rowIndex, colIndex)}
            onMouseUp={onMouseUp}
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
