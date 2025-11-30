import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/components/ui/utils/cn";
import { Block } from "@/lib/cms/blocks/block-registry.types";
import { useEditorStore } from "@/lib/cms/stores/editor-store";
import { ResetIcon } from "@radix-ui/react-icons";
import { forwardRef } from "react";
import { BlockPreview } from "./block-preview";

export interface BlockItemProps extends React.HTMLAttributes<HTMLDivElement> {
  block: Block;
  onSelect?: () => void;
}

export const BlockItem = forwardRef<HTMLDivElement, BlockItemProps>(
  ({ block, onSelect, style, className, ...props }, ref) => {
    const resetBlock = useEditorStore((s) => s.resetBlock);
    const deleteBlock = useEditorStore((s) => s.deleteBlock);
    const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
    const setSelected = useEditorStore((s) => s.setSelected);
    const editedBlocks = useEditorStore((s) => s.editedBlocks);

    const hasChanges = editedBlocks.has(block.id);

    return (
      <div
        ref={ref}
        style={style}
        onClick={onSelect}
        {...props}
        className={cn(
          "group relative outline-none touch-none my-1",
          "border-none! hover:border-none!",
          className,
        )}
      >
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={cn(
                "bg-background rounded-md ",
                "border-none! hover:border-none!",
              )}
            >
              <BlockPreview type={block.type} />
            </div>
          </ContextMenuTrigger>

          <ContextMenuContent className="w-52">
            <ContextMenuItem
              inset
              disabled={!hasChanges}
              onClick={(e) => {
                e.stopPropagation();
                if (selectedBlockId === block.id && setSelected)
                  setSelected(undefined);
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
                if (selectedBlockId === block.id && setSelected)
                  setSelected(undefined);
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
  },
);

BlockItem.displayName = "BlockItem";
