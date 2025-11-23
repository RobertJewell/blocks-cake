import { useSidebar } from "@/components/ui/sidebar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/app/(authenticated)/edit/$";
import { Pencil, Save } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { blurUpVariants } from "../../blocks/shared/animations";
import { useSavePage } from "../../hooks/useSavePage";
import { useEditorStore } from "../../stores/editor-store";
import { ToolbarButton } from "./toolbar-button";

export function EditorToolbar() {
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);

  const page = useEditorStore((s) => s.page);
  const initialPage = useEditorStore((s) => s.initialPage);
  const setInitialPage = useEditorStore((s) => s.setInitialPage);

  const setSelected = useEditorStore((s) => s.setSelected);
  const editedBlocks = useEditorStore((s) => s.editedBlocks);
  const resetEditedBlocks = useEditorStore((s) => s.resetEditedBlocks);

  const { _splat } = Route.useParams();
  const { setOpen } = useSidebar();
  const savePageMutation = useSavePage();

  //block order
  const currentOrder = page?.blocks.map((b) => b.id).join("|") ?? "";
  const initialOrder = initialPage?.blocks.map((b) => b.id).join("|") ?? "";
  const hasReordered = currentOrder !== initialOrder;

  const showSave = editedBlocks.size > 0 || hasReordered;

  return (
    <motion.div
      layout
      initial={false}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "bg-background/70 backdrop-blur-xs fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center  overflow-hidden rounded-full border p-1.5 shadow-lg",
      )}
      // set explictily to stop weird warping on resize
      style={{ height: 46, borderRadius: 23 }}
    >
      {/* Mode Toggle Group */}
      <motion.div layoutId={"edit"} layout="position">
        <ToggleGroup
          type="single"
          value={mode}
          variant={"link"}
          onValueChange={(val: typeof mode | "") => {
            if (!val) {
              setMode("view");
              setOpen(false);
              setSelected(undefined);
              return;
            }
            const newMode = val;
            setMode(newMode);
            setOpen(true);
          }}
          className="gap-1"
        >
          <ToggleGroupItem
            value="edit"
            variant={"link"}
            aria-label="Edit Content"
            className={cn(
              "p-0 rounded-full transition-colors",
              mode === "edit" && "",
            )}
            style={{ width: 32, height: 32 }}
          >
            <Pencil className="h-4 w-4" />
          </ToggleGroupItem>
          {/*<ToggleGroupItem
            value="edit-layout"
            aria-label="Edit Layout"
            className="h-8 w-8 p-0 rounded"
            style={{ width: 32, height: 32 }}
          >
            <Layers className="h-4 w-4" />
          </ToggleGroupItem>*/}
        </ToggleGroup>
      </motion.div>

      {/* Save Button (Conditional) */}
      <AnimatePresence mode="popLayout" initial={false}>
        {showSave && page && (
          <motion.div
            key="save"
            layout="position"
            variants={blurUpVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            custom={{ x: 10, duration: 0.2 }}
            className="ml-1  border-l"
          >
            <ToolbarButton
              id="save"
              onClick={() => {
                savePageMutation.mutate(
                  { slug: _splat!, data: page, status: "published" },
                  {
                    onSuccess: () => {
                      resetEditedBlocks();
                      setInitialPage(page);
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
