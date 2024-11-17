interface EditorGridProps {
  gridSize: number;
  grid: string[][];
  onMouseDown: (rowIndex: number, colIndex: number) => void;
  onMouseEnter: (rowIndex: number, colIndex: number) => void;
  onMouseUp: () => void;
}

export const Grid: React.FC<EditorGridProps> = ({
  gridSize,
  grid,
  onMouseDown,
  onMouseEnter,
  onMouseUp
}) => {
  return (
    <div className="aspect-square w-full">
      <div
        className="grid h-full w-full gap-px overflow-hidden rounded-lg border border-black/10 bg-[#DFDFDA]"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
        }}
        onMouseLeave={onMouseUp}
      >
        {grid.map((row, rowIndex) =>
          row.map((cellColor, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}-${cellColor}`}
              className="aspect-square w-full cursor-pointer transition-colors duration-150 hover:opacity-90"
              style={{
                backgroundColor: cellColor
              }}
              onMouseDown={() => onMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => onMouseEnter(rowIndex, colIndex)}
              onMouseUp={onMouseUp}
            />
          ))
        )}
      </div>
    </div>
  );
};
