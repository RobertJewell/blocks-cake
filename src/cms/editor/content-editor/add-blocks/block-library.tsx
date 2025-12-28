import { BlockType } from "@/cms/blocks/block-registry.types";
import { AnimationMode, editorVariants } from "@/cms/blocks/shared/animations";
import { useBlockCategories } from "@/cms/blocks/shared/hooks/use-block-categories";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/components/ui/utils/cn";
import { useDraggable } from "@dnd-kit/core";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { BlockPreview } from "../shared/block-preview";

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
      className="flex flex-col w-full px-2 min-h-full "
    >
      {/* Search Header */}
      <div className="sticky flex flex-col top-0 z-10">
        <div className="bg-sidebar py-2">
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
        </div>

        <div className="h-4 w-full bg-linear-to-b from-sidebar"></div>
      </div>
      {/*<SkeletonThumbnailWrapper
        className="bg-white border rounded-md border-border"
        targetWidth={120}
      >
        <SimpleCardSkeleton />
      </SkeletonThumbnailWrapper>*/}

      {/* List */}
      <div className="flex-1 overflow-y-auto pb-4">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-muted-foreground">
            <p>No blocks found</p>
          </div>
        ) : (
          <div className="space-y-6">
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

import { ReactNode } from "react";

// The original dimensions of your SimpleCardSkeleton (based on Tailwind classes)
// max-w-64 = 16rem = 256px
// h-48     = 12rem = 192px
const BASE_WIDTH = 256;
const BASE_HEIGHT = 192;

interface SkeletonThumbnailProps {
  children: ReactNode;
  targetWidth: number; // The width you want the thumbnail to be (in pixels)
  className?: string;
}

export const SkeletonThumbnailWrapper = ({
  children,
  targetWidth,
  className,
}: SkeletonThumbnailProps) => {
  // Calculate the scale factor (e.g., if target is 100px, scale is ~0.39)
  const scale = targetWidth / BASE_WIDTH;

  // Calculate the new height to reserve space in the DOM
  const targetHeight = BASE_HEIGHT * scale;

  return (
    <div
      className={className}
      style={{
        width: targetWidth,
        height: targetHeight,
        position: "relative",
        // overflow-hidden prevents any visual artifacts from spilling out
        overflow: "hidden",
      }}
    >
      <div
        style={{
          // Force the inner container to be the skeleton's original full size
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          // Apply the scaling
          transform: `scale(${scale})`,
          // Anchor the scaling to the top-left corner so it fits the box
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
};
