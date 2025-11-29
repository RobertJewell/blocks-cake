import { Block } from "@/lib/cms/blocks/block-registry.types";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BlockItem } from "./editible-block-item";

interface SortableBlockItemProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
}

export function SortableBlockItem({ block, onSelect }: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.2 : 1, // Dim the placeholder in the list
  };

  return (
    <BlockItem
      ref={setNodeRef}
      style={style}
      block={block}
      onSelect={onSelect}
      className={cn(
        isDragging && "z-50 cursor-grabbing",
        !isDragging && "cursor-grab",
      )}
      {...attributes}
      {...listeners}
    />
  );
}
