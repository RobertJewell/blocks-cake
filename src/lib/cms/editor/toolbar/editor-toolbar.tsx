import { Eye, Pencil, Save } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useSidebar } from "~/components/ui/sidebar";
import { useSavePage } from "~/lib/cms/hooks/useSavePage";
import { useEditorStore } from "~/lib/cms/stores/editor-store";
import { cn } from "~/lib/utils";
import { Route } from "~/routes/(authenticated)/edit/$slug";
import { blurUpVariants } from "../../blocks/shared/animations";
import { ToolbarButton } from "./toolbar-button";

export function EditorToolbar() {
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const page = useEditorStore((s) => s.page);
  const editedBlocks = useEditorStore((s) => s.editedBlocks);
  const resetEditedBlocks = useEditorStore((s) => s.resetEditedBlocks);
  const { setOpen } = useSidebar();

  console.log(editedBlocks);

  const { slug } = Route.useParams(); // ✅ get slug from route
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
            {isEdit ? <Eye className="size-4" /> : <Pencil className="size-4" />}
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
                  { slug, data: page, status: "published" },
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
