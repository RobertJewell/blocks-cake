import { registry } from "@/lib/cms/blocks/block-registry";
import { BlockType } from "@/lib/cms/blocks/block-registry.types";
import { useEditorStore } from "@/lib/cms/stores/editor-store";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";

export function BlockLibraryView() {
  const setMode = useEditorStore((s) => s.setMode);

  return (
    <div className="h-full flex flex-col">
      {/*<EditorHeader
        title="Add Block"
        subtitle="Drag a block to insert it"
        onBack={() => setMode("view")}
      />*/}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.keys(registry).map((type) => (
          <DraggableBlockItem key={type} type={type as BlockType} />
        ))}
      </div>
    </div>
  );
}

export function DraggableBlockItem({ type }: { type: BlockType }) {
  const { attributes, listeners, setNodeRef, isDragging, transform } =
    useDraggable({
      id: `sidebar-new-${type}`,
      data: {
        type: "sidebar-block",
        blockType: type,
      },
    });

  // We only apply opacity to the original item.
  // We do NOT apply transform here, because the Overlay will handle the movement visuals.
  // If you apply transform here too, the item in the list will move, which looks weird.

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "cursor-grab active:cursor-grabbing touch-none",
        isDragging ? "opacity-20" : "opacity-100",
      )}
    >
      <SidebarBlockPreview type={type} />
    </div>
  );
}

// --- New Component: Pure Visuals ---

export function SidebarBlockPreview({ type }: { type: BlockType }) {
  const def = registry[type];
  const Skeleton = def?.skeleton;

  return (
    <div className="border relative rounded-lg overflow-hidden bg-background shadow-sm hover:border-primary/50 hover:shadow-md transition-all group w-full">
      <div className="absolute top-0 left-0 w-full z-20 flex justify-center pointer-events-none">
        <span className="text-[0.5rem] uppercase tracking-wider font-bold bg-gray-100/90 px-3 py-1 rounded-b-md border border-t-0 text-gray-500 select-none">
          {type}
        </span>
      </div>

      <div className="pointer-events-none select-none">
        {Skeleton ? (
          <Skeleton />
        ) : (
          <div className="h-24 w-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
            No Preview
          </div>
        )}
      </div>
    </div>
  );
}
