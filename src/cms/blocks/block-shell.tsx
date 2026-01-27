import { cn } from "@/cms/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { BlockPickerDialog } from "../editor/content-editor/add-blocks";
import { useEditorStore } from "../stores/editor-store";
import { Block } from "./block-registry.types";

type Props = {
  block: Block;
  children: React.ReactNode;
};

export function BlockShell({ block, children }: Props) {
  const ref = useRef(null);
  const mode = useEditorStore((s) => s.mode);
  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const setSelected = useEditorStore((s) => s.setSelected);
  const addBlock = useEditorStore((s) => s.addBlock);
  const setBlockInView = useEditorStore((s) => s.setBlockInView);
  const [open, setOpen] = useState(false);
  const isEdit = mode === "edit";
  const isInView = useInView(ref, {
    margin: "-120px 0px -120px 0px",
  });

  useEffect(() => {
    setBlockInView(block.id, isInView);
  }, [isInView]);

  const { setNodeRef, isOver } = useDroppable({
    id: `drop-after-${block.id}`,

    data: {
      type: "insert-after",
      blockId: block.id,
    },

    disabled: mode !== "add",
  });

  return (
    <div
      ref={ref}
      id={block.id}
      onClick={(e) => {
        if (!isEdit) return;
        e.stopPropagation();
        setSelected(block.id);
      }}
      className={cn(
        "relative font-editor z-20 transition-all duration-200",
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
            className="overflow-hidden px-2 font-editor"
          >
            <BlockPickerDialog
              open={open}
              setOpen={setOpen}
              onSelect={(type) => addBlock(type, block.id)}
            />
            <div
              ref={setNodeRef}
              className={cn(
                "w-full group h-32 cursor-pointer rounded-xl text-muted-foreground border-2 backdrop-blur-xs bg-muted border-muted-foreground/50 border-dashed hover:scale-99 flex items-center justify-center transition-all",
                isOver && "scale-98",
              )}
              onClick={() => setOpen(true)}
            >
              <span
                className={cn(
                  "flex text-sm gap-2 items-center font-medium transition-colors",
                )}
              >
                <Plus className="size-5" />
                {isOver ? "Drop to add block" : "Insert Block"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
