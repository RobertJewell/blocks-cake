import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ResetIcon } from "@radix-ui/react-icons";
import { Pencil } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { blurUpVariants } from "../../blocks/shared/animations";
import { useEditorStore } from "../../stores/editor-store";
import { ToolbarButton } from "./toolbar-button";

export function BlockEditButton({ blockId }: { blockId: string }) {
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const setSelected = useEditorStore((s) => s.setSelected);
  const page = useEditorStore((s) => s.page);
  const editedBlocks = useEditorStore((s) => s.editedBlocks);
  const resetEditedBlocks = useEditorStore((s) => s.resetEditedBlocks);
  const { setOpen } = useSidebar();

  // const savePageMutation = useSavePage();

  const isEdit = mode === "edit";
  const hasChanges = editedBlocks.has(blockId);

  return (
    <motion.div
      layout
      initial={false}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "bg-background absolute bottom-6 mx-auto right-6 z-50 flex items-center gap-1 overflow-hidden rounded-full border p-1 shadow-lg",
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={blockId}
          layout="position"
          variants={blurUpVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          custom={{ y: 5, duration: 0.2 }}
        >
          <ToolbarButton
            id={blockId}
            onClick={() => {
              setSelected(blockId);
              setOpen(true);
            }}
          >
            <Pencil className="size-4" />
            Edit
          </ToolbarButton>
        </motion.div>

        {hasChanges && page && (
          <motion.div
            key={blockId + "reset"}
            layout="position"
            variants={blurUpVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            custom={{ y: 5, duration: 0.2 }}
          >
            <ToolbarButton
              id={blockId + "reset"}
              onClick={() => {
                // savePageMutation.mutate(
                //   { slug: _splat!, data: page, status: "published" },
                //   {
                //     onSuccess: () => {
                //       resetEditedBlocks();
                //     },
                //   },
                // );
                console.log(blockId);
              }}
            >
              <ResetIcon className="size-4" />
              {/*{savePageMutation.isPending ? "Saving…" : "Save"}*/}
            </ToolbarButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
