import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { BlockType } from "@/lib/cms/blocks/block-registry.types";
import {
  AnimationMode,
  editorVariants,
} from "@/lib/cms/blocks/shared/animations";
import { useBlockCategories } from "@/lib/cms/hooks/blocks/use-block-categories";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { BlockPreview } from "./block-preview";

interface BlockEditorProps {
  mode: AnimationMode;
}

export function BlockLibrary({ mode }: BlockEditorProps) {
  const [query, setQuery] = useState("");
  const groups = useBlockCategories(query);

  return (
    <motion.div
      key="list-mode"
      custom={mode}
      variants={editorVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="flex flex-col gap-2 w-full px-2 min-h-full pb-20"
    >
      {/* Search Header */}
      <div className="sticky flex flex-col gap-4 top-0 z-10 ">
        <InputGroup className="bg-background">
          <InputGroupInput
            type="text"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blocks..."
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        <Separator />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto  pb-4">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-muted-foreground">
            <p>No blocks found</p>
          </div>
        ) : (
          <div className="space-y-6 pt-4">
            {groups.map((group) => (
              <div key={group.category}>
                <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                  {group.category}
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {group.items.map((block) => (
                    <DraggableBlockItem key={block.type} type={block.type} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function DraggableBlockItem({ type }: { type: BlockType }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-new-${type}`,
    data: { type: "sidebar-block", blockType: type },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "cursor-grab active:cursor-grabbing touch-none transition-opacity",
        isDragging ? "opacity-20" : "opacity-100",
      )}
    >
      <BlockPreview type={type} />
    </div>
  );
}
