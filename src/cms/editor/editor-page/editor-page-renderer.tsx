import { registry } from "@/cms/blocks/block-registry";
import { BlockType, PageData } from "@/cms/blocks/block-registry.types";
import { BlockShell } from "@/cms/blocks/block-shell";
import { useEditorStore } from "@/cms/lib/stores/editor-store";
import { Button } from "@/cms/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { BlockPickerDialog } from "../content-editor/add-blocks";

export function EditorPageRenderer({ initialPage }: { initialPage: PageData }) {
  const setPage = useEditorStore((s) => s.setPage);
  const setInitialPage = useEditorStore((s) => s.setInitialPage);
  const page = useEditorStore((s) => s.page);
  const addBlock = useEditorStore((s) => s.addBlock);
  const [isBlockPickerOpen, setIsBlockPickerOpen] = useState(false);

  // Sync initialPage to store after mount
  useEffect(() => {
    setInitialPage(initialPage);
    setPage(initialPage);
  }, [initialPage.id]);

  const displayPage = page || initialPage;

  const handleAddBlock = (blockType: BlockType) => {
    addBlock(blockType);
    setIsBlockPickerOpen(false);
  };

  const isEmpty = displayPage.blocks.length === 0;

  return (
    <div className="relative pb-12">
      <BlockPickerDialog
        open={isBlockPickerOpen}
        setOpen={setIsBlockPickerOpen}
        onSelect={handleAddBlock}
      />

      {isEmpty ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Start building</h2>
              <p className="text-muted-foreground mb-6">
                Add your first block to get started
              </p>
            </div>
            <Button onClick={() => setIsBlockPickerOpen(true)} size="lg">
              <IconPlus className="w-4 h-4" />
              Add Block
            </Button>
          </div>
        </div>
      ) : (
        displayPage.blocks.map((b) => {
          const def = registry[b.type];
          if (!def) return null;
          const Component = def.component as React.ComponentType<typeof b.data>;

          return (
            <motion.div
              key={b.id}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <BlockShell block={b}>
                <Component {...b.data} />
              </BlockShell>
            </motion.div>
          );
        })
      )}
    </div>
  );
}
