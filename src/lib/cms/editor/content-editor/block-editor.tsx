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

import { motion } from "motion/react";
import { AnimationMode, editorVariants } from "../../blocks/shared/animations";
import { FormRenderer } from "../form-renderer";
import { BlockItem } from "./block-item";

interface BlockEditorProps {
  mode: AnimationMode;
}

export const BlockEditor = ({ mode }: BlockEditorProps) => {
  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const setSelected = useEditorStore((s) => s.setSelected);
  const page = useEditorStore((s) => s.page);
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const reorderBlocks = useEditorStore((s) => s.reorderBlocks);

  const currentBlock = page?.blocks.find((b) => b.id === selectedId);

  // --- DnD Sensors ---
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
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
    <>
      {currentBlock ? (
        // Form Editor
        <motion.div
          key={currentBlock.id} // Keying by ID ensures fade triggers on block switch
          custom={mode}
          variants={editorVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="h-full flex flex-col"
        >
          <FormRenderer
            key={currentBlock.id}
            block={currentBlock}
            onChange={(patch) =>
              updateBlock(currentBlock.id, currentBlock.type, patch)
            }
          />
        </motion.div>
      ) : (
        // Block view
        <motion.div
          key="list-mode"
          custom={mode}
          variants={editorVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="flex flex-col gap-4 w-full px-2 min-h-full pb-20"
        >
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
                  onSelect={() => setSelected(block.id)}
                />
              ))}

              {(!page?.blocks || page.blocks.length === 0) && (
                <div className="text-center text-muted-foreground py-10">
                  No blocks yet. Click "+" to add one.
                </div>
              )}
            </SortableContext>
          </DndContext>
        </motion.div>
      )}
    </>
  );
};
