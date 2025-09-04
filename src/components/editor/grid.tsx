import React, { memo } from "react";

interface EditorGridProps {
  grid: string[][];
  gridSize: number;
  onMouseDown: (rowIndex: number, colIndex: number) => void;
  onMouseEnter: (rowIndex: number, colIndex: number) => void;
  onMouseUp: () => void;
}

export const Grid = memo(function Grid({
  grid,
  gridSize,
  onMouseDown,
  onMouseEnter,
  onMouseUp
}: EditorGridProps) {
  return (
    <div className="art-grid">
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cellColor, colIndex) => (
            <button
              key={`cell-${rowIndex * gridSize + colIndex}`}
              type="button"
              onMouseDown={() => onMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => onMouseEnter(rowIndex, colIndex)}
              onMouseUp={onMouseUp}
              className="cell"
              style={{ backgroundColor: cellColor }}
              aria-label={`Cell ${rowIndex + 1}, ${colIndex + 1}`}
            />
          ))
        )}
      </div>
    </div>
  );
});
