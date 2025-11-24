import { useEditorStore } from "@/lib/cms/stores/editor-store";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { BlockItem } from "./block-item";
import { EditorHeader } from "./editor-header";

export function BlockListView() {
  const page = useEditorStore((s) => s.page);
  const setMode = useEditorStore((s) => s.setMode);
  const setSelected = useEditorStore((s) => s.setSelected);
  const reorderBlocks = useEditorStore((s) => s.reorderBlocks);

  // --- DnD Sensors ---
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !page) return;
    const oldIndex = page.blocks.findIndex((b) => b.id === active.id);
    const newIndex = page.blocks.findIndex((b) => b.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
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

  return (
    <div className="flex flex-col h-full">
      <EditorHeader
        title="Page Blocks"
        actions={
          <button
            onClick={() => setMode("add")}
            className="p-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-2 pb-20 space-y-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={page?.blocks.map((b) => b.id) || []}
            strategy={verticalListSortingStrategy}
          >
            {page?.blocks.map((block) => (
              <BlockItem
                key={block.id}
                block={block}
                onSelect={() => {
                  setSelected(block.id);
                  setMode("edit");
                }}
              />
            ))}

            {(!page?.blocks || page.blocks.length === 0) && (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm border-2 border-dashed rounded-xl m-2">
                <p>No blocks yet</p>
                <button
                  onClick={() => setMode("add")}
                  className="text-primary hover:underline mt-1"
                >
                  Add your first block
                </button>
              </div>
            )}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
