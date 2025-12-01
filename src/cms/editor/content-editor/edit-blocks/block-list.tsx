import { useEditorStore } from "@/cms/stores/editor-store";
import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
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
import { useState } from "react";
import { createPortal } from "react-dom";
import { BlockItem, SortableBlockItem } from ".";

// Standard dnd-kit drop animation (fades opacity, scale matches)
const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

export const BlockList = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const setSelected = useEditorStore((s) => s.setSelected);
  const page = useEditorStore((s) => s.page);
  const reorderBlocks = useEditorStore((s) => s.reorderBlocks);

  // We find the block object to render inside the overlay
  const activeBlock = page?.blocks.find((b) => b.id === activeId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

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
    setActiveId(null);

    if (over && active.id !== over.id && page) {
      const oldIndex = page.blocks.findIndex((b) => b.id === active.id);
      const newIndex = page.blocks.findIndex((b) => b.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderBlocks(arrayMove(page.blocks, oldIndex, newIndex));
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext
        items={page?.blocks.map((b) => b.id) || []}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col pb-20 gap-2">
          {page?.blocks.map((block) => (
            <SortableBlockItem
              key={block.id}
              block={block}
              isSelected={block.id === selectedId}
              onSelect={() => setSelected(block.id)}
            />
          ))}
        </div>
      </SortableContext>

      {/* PORTAL IS NECESSARY because 'DesktopEditorLayout' has overflow:hidden.
         Without this, the item will get cut off at the edge of the sidebar.
      */}
      {typeof document !== "undefined" &&
        createPortal(
          <DragOverlay dropAnimation={dropAnimationConfig}>
            {activeBlock ? <BlockItem block={activeBlock} /> : null}
          </DragOverlay>,
          document.body,
        )}
    </DndContext>
  );
};
