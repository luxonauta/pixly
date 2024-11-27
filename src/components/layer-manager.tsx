import {
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  TrashIcon
} from "@heroicons/react/20/solid";
import React from "react";
import type { Layer } from "@/types";
import { cn } from "@/utils/cn";
import { CustomButton } from "./button";
import { Card } from "./card";

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

const LayerItem: React.FC<LayerItemProps> = ({
  isActive,
  isFirst,
  isLast,
  layer,
  onClick,
  onDelete,
  onMoveDown,
  onMoveUp,
  onVisibilityToggle
}) => {
  return (
    <div
      className={cn(
        "relative flex items-center gap-3 overflow-hidden rounded-md border border-black/10 p-2 font-medium transition-colors duration-200 focus-within:border-black/20 hover:border-black/20",
        isActive ? "bg-white/60" : "bg-white/20"
      )}
    >
      <div className="flex">
        <button
          type="button"
          className={cn(
            "rounded-full p-0.5 transition-colors duration-200 hover:bg-black/5",
            {
              "cursor-not-allowed opacity-30": isFirst
            }
          )}
          onClick={onMoveUp}
          disabled={isFirst}
        >
          <ChevronUpIcon className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          className={cn(
            "rounded-full p-0.5 transition-colors duration-200 hover:bg-black/5",
            {
              "cursor-not-allowed opacity-30": isLast
            }
          )}
          onClick={onMoveDown}
          disabled={isLast}
        >
          <ChevronDownIcon className="h-3.5 w-3.5" />
        </button>
      </div>
      <button
        type="button"
        className="flex-1 text-left font-semibold"
        onClick={onClick}
      >
        Layer {Number.parseInt(layer.id.split("-")[1])}
      </button>
      <button
        type="button"
        onClick={onVisibilityToggle}
        className="opacity-75 transition-opacity duration-200 hover:opacity-100 focus:opacity-100 active:opacity-100"
      >
        {layer.visible ? (
          <EyeIcon className="h-3.5 w-3.5" />
        ) : (
          <EyeSlashIcon className="h-3.5 w-3.5" />
        )}
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="opacity-75 transition-opacity duration-200 hover:opacity-100 focus:opacity-100 active:opacity-100"
      >
        <TrashIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

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
    <Card
      title="Layers"
      description="Manage your drawing layers. Use arrows to reorder, toggle visibility, or select a layer to edit."
    >
      <div className="relative mt-2 p-px">
        <div
          className={cn(
            "pointer-events-none absolute bottom-0 left-0 right-0 h-10 rounded-md bg-gradient-to-t from-black/10 to-transparent",
            layers.length > 3 ? "opacity-100" : "opacity-0",
            "transition-opacity duration-200"
          )}
          aria-hidden="true"
        />
        <div
          ref={scrollContainerRef}
          className="max-h-[calc(2.75rem*3)] overflow-y-auto rounded-md focus-within:overscroll-contain hover:overscroll-contain"
        >
          <div className="flex flex-col gap-1">
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
        </div>
      </div>
      <CustomButton
        icon={<PlusIcon className="h-3.5 w-3.5" strokeWidth={3} />}
        label="Add layer"
        type="button"
        onClick={handleAddLayer}
        className="mt-2 self-end"
      />
    </Card>
  );
};
