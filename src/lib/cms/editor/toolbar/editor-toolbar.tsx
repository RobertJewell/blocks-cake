import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import { Route } from "@/routes/app/(authenticated)/edit/$...slug";
import { Eye, Pencil, Save } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { blurUpVariants } from "../../blocks/shared/animations";
import { useSavePage } from "../../hooks/useSavePage";
import { useEditorStore } from "../../stores/editor-store";
import { ToolbarButton } from "./toolbar-button";

export function EditorToolbar() {
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const page = useEditorStore((s) => s.page);
  const editedBlocks = useEditorStore((s) => s.editedBlocks);
  const resetEditedBlocks = useEditorStore((s) => s.resetEditedBlocks);
  const { setOpen } = useSidebar();

  const { _splat } = Route.useParams();
  const savePageMutation = useSavePage();

  const isEdit = mode === "edit";
  const showSave = editedBlocks.size > 0;

  return (
    <motion.div
      layout
      initial={false}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "bg-background fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 overflow-hidden rounded-full border p-1 shadow-lg",
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key="mode"
          layout="position"
          variants={blurUpVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          custom={{ y: 5, duration: 0.2 }}
        >
          <ToolbarButton
            id="mode"
            onClick={() => {
              setOpen(!isEdit);
              setMode(isEdit ? "view" : "edit");
            }}
          >
            {isEdit ? (
              <Eye className="size-4" />
            ) : (
              <Pencil className="size-4" />
            )}
            {isEdit ? "View" : "Edit"}
          </ToolbarButton>
        </motion.div>

        {showSave && page && (
          <motion.div
            key="save"
            layout="position"
            variants={blurUpVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            custom={{ y: 5, duration: 0.2 }}
          >
            <ToolbarButton
              id="save"
              onClick={() => {
                savePageMutation.mutate(
                  { slug: _splat!, data: page, status: "published" },
                  {
                    onSuccess: () => {
                      resetEditedBlocks();
                    },
                  },
                );
              }}
            >
              <Save className="size-4" />
              {savePageMutation.isPending ? "Saving…" : "Save"}
            </ToolbarButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
