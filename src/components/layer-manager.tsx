import type { DragEndEvent } from "@dnd-kit/core";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  TrashIcon
} from "@heroicons/react/20/solid";
import type React from "react";
import { CustomButton } from "./button";
import { Card } from "./card";

interface Layer {
  id: string;
  visible: boolean;
  grid: string[][];
}

interface LayerManagerProps {
  layers: Layer[];
  activeLayerId: string;
  onLayerAdd: () => void;
  onLayerDelete: (id: string) => void;
  onLayerVisibilityToggle: (id: string) => void;
  onLayerReorder: (oldIndex: number, newIndex: number) => void;
  onActiveLayerChange: (id: string) => void;
}

interface SortableLayerItemProps {
  layer: Layer;
  isActive: boolean;
  onVisibilityToggle: () => void;
  onDelete: () => void;
  onClick: () => void;
}

const SortableLayerItem: React.FC<SortableLayerItemProps> = ({
  layer,
  isActive,
  onVisibilityToggle,
  onDelete,
  onClick
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: layer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-md border p-2 ${
        isActive
          ? "border-black/20 bg-white"
          : "border-transparent bg-[#EBEBE6]"
      }`}
    >
      <button
        type="button"
        className="cursor-grab touch-none"
        {...attributes}
        {...listeners}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-black/60"
        >
          <title>Drag handle</title>
          <path
            d="M5.5 4.625C6.12132 4.625 6.625 4.12132 6.625 3.5C6.625 2.87868 6.12132 2.375 5.5 2.375C4.87868 2.375 4.375 2.87868 4.375 3.5C4.375 4.12132 4.87868 4.625 5.5 4.625ZM9.5 4.625C10.1213 4.625 10.625 4.12132 10.625 3.5C10.625 2.87868 10.1213 2.375 9.5 2.375C8.87868 2.375 8.375 2.87868 8.375 3.5C8.375 4.12132 8.87868 4.625 9.5 4.625ZM10.625 7.5C10.625 8.12132 10.1213 8.625 9.5 8.625C8.87868 8.625 8.375 8.12132 8.375 7.5C8.375 6.87868 8.87868 6.375 9.5 6.375C10.1213 6.375 10.625 6.87868 10.625 7.5ZM5.5 8.625C6.12132 8.625 6.625 8.12132 6.625 7.5C6.625 6.87868 6.12132 6.375 5.5 6.375C4.87868 6.375 4.375 6.87868 4.375 7.5C4.375 8.12132 4.87868 8.625 5.5 8.625ZM10.625 11.5C10.625 12.1213 10.1213 12.625 9.5 12.625C8.87868 12.625 8.375 12.1213 8.375 11.5C8.375 10.8787 8.87868 10.375 9.5 10.375C10.1213 10.375 10.625 10.8787 10.625 11.5ZM5.5 12.625C6.12132 12.625 6.625 12.1213 6.625 11.5C6.625 10.8787 6.12132 10.375 5.5 10.375C4.87868 10.375 4.375 10.8787 4.375 11.5C4.375 12.1213 4.87868 12.625 5.5 12.625Z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <button type="button" className="flex-1 text-left" onClick={onClick}>
        Layer {Number.parseInt(layer.id.split("-")[1])}
      </button>
      <button
        type="button"
        className="text-black/60 hover:text-black"
        onClick={onVisibilityToggle}
      >
        {layer.visible ? (
          <EyeIcon className="h-4 w-4" />
        ) : (
          <EyeSlashIcon className="h-4 w-4" />
        )}
      </button>
      <button
        type="button"
        className="text-black/60 hover:text-black"
        onClick={onDelete}
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export const LayerManager: React.FC<LayerManagerProps> = ({
  layers,
  activeLayerId,
  onLayerAdd,
  onLayerDelete,
  onLayerVisibilityToggle,
  onLayerReorder,
  onActiveLayerChange
}) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = layers.findIndex((layer) => layer.id === active.id);
      const newIndex = layers.findIndex((layer) => layer.id === over.id);
      onLayerReorder(oldIndex, newIndex);
    }
  };

  return (
    <Card
      title="Layers"
      description="Manage your drawing layers. Drag to reorder, toggle visibility, or select a layer to edit."
    >
      <div className="mt-3 flex flex-col gap-2">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={layers}
            strategy={verticalListSortingStrategy}
          >
            {layers.map((layer) => (
              <SortableLayerItem
                key={layer.id}
                layer={layer}
                isActive={layer.id === activeLayerId}
                onVisibilityToggle={() => onLayerVisibilityToggle(layer.id)}
                onDelete={() => onLayerDelete(layer.id)}
                onClick={() => onActiveLayerChange(layer.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
        <CustomButton
          icon={<PlusIcon className="h-3.5 w-3.5" strokeWidth={3} />}
          label="Add layer"
          type="button"
          onClick={onLayerAdd}
          className="mt-2"
        />
      </div>
    </Card>
  );
};
