import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Block } from "@/lib/cms/blocks/block-registry.types";
import { useEditorStore } from "@/lib/cms/stores/editor-store";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ResetIcon } from "@radix-ui/react-icons";
import { BlockPreview } from "./block-preview";

interface BlockItemProps {
  block: Block;
  onSelect: () => void;
}

export const BlockItem = ({ block, onSelect }: BlockItemProps) => {
  const resetBlock = useEditorStore((s) => s.resetBlock);
  const deleteBlock = useEditorStore((s) => s.deleteBlock);
  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const setSelected = useEditorStore((s) => s.setSelected);
  const editedBlocks = useEditorStore((s) => s.editedBlocks);

  const hasChanges = editedBlocks.has(block.id);
  const isSelected = selectedId === block.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    position: "relative" as const,
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onSelect}
      className={cn(
        "group relative outline-none touch-none", // Add margin if needed
        isDragging ? "cursor-grabbing" : "cursor-grab",
      )}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <BlockPreview
            type={block.type}
            isActive={isSelected}
            isDragging={isDragging}
          />
        </ContextMenuTrigger>

        <ContextMenuContent className="w-52">
          <ContextMenuItem
            inset
            disabled={!hasChanges}
            onClick={(e) => {
              e.stopPropagation();
              if (isSelected) setSelected(undefined);
              resetBlock(block.id);
            }}
          >
            Reset
            <ContextMenuShortcut>
              <ResetIcon className="size-3" />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem
            inset
            onClick={(e) => {
              e.stopPropagation();
              if (isSelected) setSelected(undefined);
              deleteBlock(block.id);
            }}
          >
            Delete
            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};
