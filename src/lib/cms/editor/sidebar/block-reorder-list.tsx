import { registry } from "@/lib/cms/blocks/block-registry";
import { Block } from "@/lib/cms/blocks/block-registry.types";
import { cn } from "@/lib/utils";
import { useEditorStore } from "../../stores/editor-store";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function BlockReorderList() {
  const page = useEditorStore((s) => s.page);
  const reorderBlocks = useEditorStore((s) => s.reorderBlocks);

  // We add a small "activationConstraint" (distance: 5px)
  // This ensures simple clicks (to select a block) don't trigger a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    // Safety checks
    if (!over || active.id === over.id || !page) return;

    // Find indices
    const oldIndex = page.blocks.findIndex((b) => b.id === active.id);
    const newIndex = page.blocks.findIndex((b) => b.id === over.id);

    // Only update if they are different
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      // ⚡️ SWAP IMMEDIATELY IN THE STORE
      reorderBlocks(arrayMove(page.blocks, oldIndex, newIndex));
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id && page) {
      const oldIndex = page.blocks.findIndex((b) => b.id === active.id);
      const newIndex = page.blocks.findIndex((b) => b.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderBlocks(arrayMove(page.blocks, oldIndex, newIndex));
      }
    }
  }

  if (!page) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      modifiers={[restrictToVerticalAxis]} // 🔒 Lock to Y axis
    >
      <div className="flex flex-col gap-4 w-full px-2 min-h-full">
        <SortableContext
          items={page.blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {page.blocks.map((block) => (
            <BlockItem key={block.id} block={block} />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
}

function BlockItem({ block }: { block: Block }) {
  const def = registry[block.type as keyof typeof registry];
  const Skeleton = def?.skeleton;

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
    touchAction: "none", // 📱 Vital for mobile drag
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative outline-none",
        isDragging ? "cursor-grabbing" : "cursor-grab",
      )}
    >
      <div
        className={cn(
          "bg-muted relative overflow-hidden border rounded-lg transition-all duration-200",
          isDragging
            ? "shadow-2xl ring-2 ring-primary/20 scale-[1.02]  bg-white"
            : "hover:border-primary/50 bg-background",
        )}
      >
        {/* Block Label  */}
        <div className="absolute top-0 left-0 w-full z-20 flex justify-center pointer-events-none">
          <span className="text-[0.5rem] uppercase tracking-wider font-bold bg-gray-100/90 px-3 py-1 rounded-b-md border border-t-0 text-gray-500 select-none">
            {block.type}
          </span>
        </div>

        {/* Skeleton */}
        <div className="pointer-events-none ">
          {Skeleton ? <Skeleton /> : <div className="h-24 w-full bg-muted" />}
        </div>
      </div>
    </div>
  );
}
