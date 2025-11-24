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

import { motion, Variants } from "motion/react";
import { useEffect, useRef } from "react";
import { FormRenderer } from "../form-renderer";
import { BlockItem } from "./block-item";

type AnimationMode = "push" | "pop" | "fade";

const editorVariants: Variants = {
  enter: (mode: AnimationMode) => {
    if (mode === "fade") {
      return { opacity: 0, scale: 0.98, x: 0, filter: "blur(4px)" };
    }
    // Push: Enter from Right (50). Pop: Enter from Left (-50)
    return {
      x: mode === "push" ? 50 : -50,
      opacity: 0,
      filter: "blur(4px)",
    };
  },
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 },
    },
  },
  exit: (mode: AnimationMode) => {
    if (mode === "fade") {
      return { opacity: 0, scale: 0.98, x: 0, filter: "blur(4px)" };
    }
    // Push: Exit to Left (-50). Pop: Exit to Right (50)
    return {
      x: mode === "push" ? -50 : 50,
      opacity: 0,
      filter: "blur(4px)",
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    };
  },
};

export const BlockEditor = () => {
  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const setSelected = useEditorStore((s) => s.setSelected);
  const page = useEditorStore((s) => s.page);
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const reorderBlocks = useEditorStore((s) => s.reorderBlocks);

  const currentBlock = page?.blocks.find((b) => b.id === selectedId);

  // --- Simplified Animation State ---
  const prevIdRef = useRef<string | null>(null);

  // Default to "push" (List -> Edit)
  let mode: AnimationMode = "push";

  const isEditMode = !!selectedId;
  const wasEditMode = !!prevIdRef.current;

  if (isEditMode && !wasEditMode) {
    mode = "push";
  } else if (!isEditMode && wasEditMode) {
    mode = "pop";
  } else if (isEditMode && wasEditMode && selectedId !== prevIdRef.current) {
    mode = "fade";
  }

  // Update history for next render
  useEffect(() => {
    prevIdRef.current = selectedId ?? null;
  }, [selectedId]);

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
        // --- View 1: Edit Mode (Form) ---
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
        // --- View 2: List Mode (Sortable) ---
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
