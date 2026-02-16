import { AnimationMode, editorVariants } from "@/cms/blocks/shared/animations";
import { useEditorStore } from "@/cms/stores/editor-store";
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
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { motion } from "motion/react";
import { BlockList } from ".";
import { BlockFormRenderer } from "../../renderers";

interface BlockEditorProps {
  mode: AnimationMode;
}

export const BlockEditor = ({ mode }: BlockEditorProps) => {
  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const page = useEditorStore((s) => s.page);
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const reorderBlocks = useEditorStore((s) => s.reorderBlocks);

  const currentBlock = page?.blocks.find((b) => b.id === selectedId);

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
          key={currentBlock.id}
          custom={mode}
          variants={editorVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="h-full flex flex-col py-4"
        >
          <BlockFormRenderer
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
          className="flex flex-col gap-2 w-full p-2 min-h-full"
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            modifiers={[restrictToVerticalAxis]}
          >
            <BlockList />
          </DndContext>
        </motion.div>
      )}
    </>
  );
};
