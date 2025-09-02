import React from "react";

import type { Layer } from "@/types";

interface LayerManagerProps {
  activeLayerId: string;
  layers: Layer[];
  onActiveLayerChange: (id: string) => void;
  onLayerAdd: (scrollContainer: HTMLDivElement | null) => void;
  onLayerDelete: (id: string) => void;
  onLayerReorder: (oldIndex: number, newIndex: number) => void;
  onLayerVisibilityToggle: (id: string) => void;
}

interface LayerItemProps {
  isActive: boolean;
  isFirst: boolean;
  isLast: boolean;
  layer: Layer;
  onClick: () => void;
  onDelete: () => void;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onVisibilityToggle: () => void;
}

const LayerItem = ({
  isActive,
  isFirst,
  isLast,
  layer,
  onClick,
  onDelete,
  onMoveDown,
  onMoveUp,
  onVisibilityToggle
}: LayerItemProps) => (
  <div className={`item${isActive ? " active" : ""}`}>
    <div className="move-buttons">
      <button type="button" onClick={onMoveUp} disabled={isFirst}>
        ▲
      </button>
      <button type="button" onClick={onMoveDown} disabled={isLast}>
        ▼
      </button>
    </div>
    <button type="button" onClick={onClick} className="label">
      Layer {Number.parseInt(layer.id.split("-")[1])}
    </button>
    <button
      type="button"
      onClick={onVisibilityToggle}
      className="visibility-toggle"
    >
      {layer.visible ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="11px"
          height="11px"
        >
          <title className="sr-only">Visible</title>
          <path
            fill="currentColor"
            d="M0 0h2v2H0V0Zm2 2h2v2H2V2Zm18 0h2v2h-2V2Zm2-2h2v2h-2V0ZM2 20h2v2H2v-2Zm-2 2h2v2H0v-2Zm20-2h2v2h-2v-2Zm2 2h2v2h-2v-2ZM8 17h8v2H8v-2Zm8-2h4v2h-4v-2Zm-8 0H4v2h4v-2Zm8-8h4v2h-4V7ZM8 7H4v2h4V7Zm12 2h2v2h-2V9ZM4 9H2v2h2V9Zm18 2h2v2h-2v-2ZM2 11H0v2h2v-2Zm18 2h2v2h-2v-2ZM4 13H2v2h2v-2Zm4-8h8v2H8V5Zm2 5h4v4h-4v-4Z"
          />
        </svg>
      ) : (
        <svg
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="11px"
          height="11px"
        >
          <title className="sr-only">Hidden</title>
          <path
            d="M8 6h8v2H8V6zm-4 4V8h4v2H4zm-2 2v-2h2v2H2zm0 2v-2H0v2h2zm2 2H2v-2h2v2zm4 2H4v-2h4v2zm8 0v2H8v-2h8zm4-2v2h-4v-2h4zm2-2v2h-2v-2h2zm0-2h2v2h-2v-2zm-2-2h2v2h-2v-2zm0 0V8h-4v2h4zM9 10h2v2H9v-2zm4 2h-2v2H9v2h2v-2h2v2h2v-2h-2v-2zm0 0v-2h2v2h-2z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
    <button type="button" onClick={onDelete} className="delete-button">
      <svg
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="11px"
        height="11px"
      >
        <title className="sr-only">Delete</title>
        <path
          d="M2 3h20v18H2V3zm18 16V7H4v12h16zM9 10h2v2H9v-2zm4 2h-2v2H9v2h2v-2h2v2h2v-2h-2v-2zm0 0v-2h2v2h-2z"
          fill="currentColor"
        />
      </svg>
    </button>
  </div>
);

export const LayerManager: React.FC<LayerManagerProps> = ({
  activeLayerId,
  layers,
  onActiveLayerChange,
  onLayerAdd,
  onLayerDelete,
  onLayerReorder,
  onLayerVisibilityToggle
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      onLayerReorder(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < layers.length - 1) {
      onLayerReorder(index, index + 1);
    }
  };

  const handleAddLayer = () => {
    onLayerAdd(scrollContainerRef.current);
  };

  return (
    <div>
      <h3 className="sr-only">Layers</h3>
      <div>
        <div ref={scrollContainerRef} className="layer-list">
          {layers.map((layer, index) => (
            <LayerItem
              key={layer.id}
              layer={layer}
              isActive={layer.id === activeLayerId}
              isFirst={index === 0}
              isLast={index === layers.length - 1}
              onVisibilityToggle={() => onLayerVisibilityToggle(layer.id)}
              onDelete={() => onLayerDelete(layer.id)}
              onClick={() => onActiveLayerChange(layer.id)}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
            />
          ))}
        </div>
        <button type="button" onClick={handleAddLayer}>
          Add layer
        </button>
      </div>
    </div>
  );
};
