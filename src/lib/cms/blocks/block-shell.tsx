import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { useEditorStore } from "../stores/editor-store";
import { Block } from "./block-registry.types";

type Props = {
  block: Block;
  children: React.ReactNode;
};

export function BlockShell({ block, children }: Props) {
  const mode = useEditorStore((s) => s.mode);
  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const setSelected = useEditorStore((s) => s.setSelected);
  const isEdit = mode === "edit";

  // We only enable the hook if we are in 'add' mode to save resources
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-after-${block.id}`, // Unique ID for the drop zone
    data: {
      type: "insert-after",
      blockId: block.id, // We pass this so onDragEnd knows WHERE to insert
    },
    disabled: mode !== "add",
  });

  return (
    <div
      id={block.id}
      onClick={(e) => {
        if (!isEdit) return;
        e.stopPropagation();
        setSelected(block.id);
      }}
      className={cn(
        "group relative font-editor z-20 transition-all duration-200",
        isEdit && selectedId !== block.id ? "cursor-pointer" : "",
      )}
    >
      {children}

      {/* Drop Zone */}
      <AnimatePresence>
        {mode === "add" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden px-2"
          >
            <div
              ref={setNodeRef}
              className={cn(
                "w-full h-32 rounded-xl text-muted-foreground border-2 bg-muted border-muted-foreground border-dashed flex items-center justify-center transition-all",
                isOver
                  ? "border-primary shadow-sm scale-[1.02]"
                  : "border-muted-foreground/50 ",
              )}
            >
              <span
                className={cn(
                  "flex text-sm gap-2 items-center font-medium transition-colors",
                )}
              >
                <Plus className="size-5" />
                {isOver ? "Drop to Add Block" : "Insert Block"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
