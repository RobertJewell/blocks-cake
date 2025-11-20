import { registry } from "@/lib/cms/blocks/block-registry";
import { Block } from "@/lib/cms/blocks/block-registry.types";

import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";
import { Reorder, useDragControls } from "motion/react";
import { useEditorStore } from "../../stores/editor-store";

export function BlockReorderList() {
  const page = useEditorStore((s) => s.page);
  const reorderBlocks = useEditorStore((s) => s.reorderBlocks);

  if (!page) return null;

  return (
    <Reorder.Group
      axis="y"
      values={page.blocks}
      onReorder={reorderBlocks}
      className="flex flex-col gap-4 w-full bg-gray-50 p-4 min-h-full"
    >
      {page.blocks.map((block) => (
        <BlockItem key={block.id} block={block} />
      ))}
    </Reorder.Group>
  );
}

function BlockItem({ block }: { block: Block }) {
  const controls = useDragControls();

  // Safe lookup for the skeleton
  const def = registry[block.type as keyof typeof registry];
  const Skeleton = def?.skeleton;

  return (
    <Reorder.Item
      value={block}
      dragListener={false} // Disable dragging by default so we can click to select
      dragControls={controls}
      className="relative group"
      style={{ position: "relative" }} // Required for z-index to work during drag
    >
      <div
        className={cn(
          "bg-muted relative overflow-hidden border rounded-lg transition-all duration-200 hover:border-primary/50",
        )}
      >
        {/* Drag Handle & Type Badge Overlay */}
        <div className="absolute top-0 w-full z-20 flex justify-center pointer-events-none">
          <div
            // Enable drag controls on this specific element
            onPointerDown={(e) => controls.start(e)}
            className={cn(
              "flex items-center gap-2 bg-white px-4 py-1.5 rounded-b-lg shadow-sm border border-t-0 cursor-grab active:cursor-grabbing pointer-events-auto transition-colors",
            )}
          >
            {/* Drag Icon */}
            <GripVertical className="h-4 w-4 opacity-50" />
            <span className="text-xs font-semibold capitalize select-none">
              {block.type}
            </span>
          </div>
        </div>

        {/* Content Preview (Skeleton) */}
        <div className="pointer-events-none opacity-80 grayscale-[0.5] group-hover:grayscale-0 transition-all">
          {Skeleton ? <Skeleton /> : <div className="h-24 w-full bg-muted" />}
        </div>

        {/* ID Overlay (Optional debug) */}
        {/* <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground font-mono opacity-50">
            {block.id}
        </div> */}
      </div>
    </Reorder.Item>
  );
}
