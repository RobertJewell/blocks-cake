import { useEditorStore } from "@/cms/stores/editor-store";
import { cn } from "@/components/ui/utils/cn";
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
import { motion } from "motion/react"; // or "framer-motion"
import { useState } from "react";
import { createPortal } from "react-dom";
import { BlockItem, SortableBlockItem } from ".";
import { useBlockListScrollSync } from "./use-block-list-scroll-sync";

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: { opacity: "0.4" },
    },
  }),
};

export const BlockList = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const setSelected = useEditorStore((s) => s.setSelected);
  const page = useEditorStore((s) => s.page);
  const reorderBlocks = useEditorStore((s) => s.reorderBlocks);
  const inViewBlocks = useEditorStore((s) => s.inViewBlocks);

  const { scrollContainerRef, onMouseEnter, onMouseLeave } =
    useBlockListScrollSync({
      blocks: page?.blocks,
      inViewBlocks,
      isDragging: !!activeId,
    });

  const activeBlock = page?.blocks.find((b) => b.id === activeId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
    // scrollToId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !page) return;
    const oldIndex = page.blocks.findIndex((b) => b.id === active.id);
    const newIndex = page.blocks.findIndex((b) => b.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      // TODO - we can do this, but we need to add a disabled prop to useBlockListScrollSync so they don't fight during dragging
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
        <div
          ref={scrollContainerRef}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="flex flex-col -ml-2 pb-12 pl-3 relative overflow-y-auto max-h-full"
        >
          {page?.blocks.map((block) => {
            const isVisible = !!inViewBlocks[block.id];

            return (
              <div
                key={block.id}
                id={`sidebar-item-${block.id}`}
                className="relative group mb-2 scroll-my-6"
              >
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    scaleY: isVisible ? 1 : 0.7,
                    filter: isVisible ? `blur(0px)` : `blur(2px)`,
                  }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "absolute -left-3 top-1 bottom-1 w-1.5 rounded-full bg-primary/25 origin-center",
                  )}
                />

                <SortableBlockItem
                  block={block}
                  isSelected={block.id === selectedId}
                  onSelect={() => setSelected(block.id)}
                />
              </div>
            );
          })}
        </div>
      </SortableContext>

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
