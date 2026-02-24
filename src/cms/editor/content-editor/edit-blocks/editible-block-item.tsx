import { registry } from "@/cms/blocks/block-registry";
import { Block } from "@/cms/blocks/block-registry.types";
import { useEditorStore } from "@/cms/lib/stores/editor-store";
import { cn } from "@/cms/lib/utils";
import { Button } from "@/cms/ui/button";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@/cms/ui/menu";
import { IconDots, IconRefresh, IconTrash } from "@tabler/icons-react";
import { forwardRef } from "react";
import { BlockPreview } from "../shared/block-preview";

export interface BlockItemProps extends React.HTMLAttributes<HTMLDivElement> {
  block: Block;
  onSelect?: () => void;
}

/**
 * Strips HTML tags, collapses whitespace, and truncates to a max length.
 */
const formatBlockTitle = (input: unknown, maxLength: number = 80): string => {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .replace(/<[^>]*>/g, " ") // Replace HTML tags with a space
    .replace(/\s+/g, " ") // Collapse multiple spaces/newlines into one
    .trim() // Clean up edges
    .substring(0, maxLength); // Truncate
};

export const BlockItem = forwardRef<HTMLDivElement, BlockItemProps>(
  ({ block, onSelect, style, className, ...props }, ref) => {
    const resetBlock = useEditorStore((s) => s.resetBlock);
    const deleteBlock = useEditorStore((s) => s.deleteBlock);
    const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
    const setSelected = useEditorStore((s) => s.setSelected);
    const editedBlocks = useEditorStore((s) => s.editedBlocks);

    const hasChanges = editedBlocks.has(block.id);

    const titleSample =
      block.data[registry[block.type].nameKey as string] || "";
    const title = formatBlockTitle(titleSample);

    return (
      <div
        ref={ref}
        style={style}
        onClick={onSelect}
        {...props}
        className={cn(
          "group relative outline-none touch-none",
          "border-none! hover:border-none!",
          className,
        )}
      >
        <div
          className={cn(
            "bg-background rounded-md relative",
            "border-none! hover:border-none!",
          )}
        >
          <BlockPreview type={block.type} title={title} />

          {/* Menu Button - appears on hover */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Menu>
              <MenuTrigger
                render={() => (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white border-gray-200 shadow-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconDots className="h-4 w-4" />
                  </Button>
                )}
              ></MenuTrigger>

              <MenuPopup className="w-48">
                <MenuItem
                  disabled={!hasChanges}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedBlockId === block.id && setSelected)
                      setSelected(undefined);
                    resetBlock(block.id);
                  }}
                >
                  <IconRefresh className="mr-2 h-4 w-4" />
                  Reset
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedBlockId === block.id && setSelected)
                      setSelected(undefined);
                    deleteBlock(block.id);
                  }}
                >
                  <IconTrash className="mr-2 h-4 w-4" />
                  Delete
                </MenuItem>
              </MenuPopup>
            </Menu>
          </div>
        </div>
      </div>
    );
  },
);

BlockItem.displayName = "BlockItem";
