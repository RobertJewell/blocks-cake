import { registry } from "@/cms/blocks/block-registry";
import { PageData } from "@/cms/blocks/block-registry.types";
import { BlockShell } from "@/cms/blocks/block-shell";
import { useEditorStore } from "@/cms/lib/stores/editor-store";
import { motion } from "motion/react";

export function EditorPageRenderer({ initialPage }: { initialPage: PageData }) {
  const setPage = useEditorStore((s) => s.setPage);
  const setInitialPage = useEditorStore((s) => s.setInitialPage);
  const page = useEditorStore((s) => s.page);

  // --- Store Sync ---
  if (!page || page.id !== initialPage.id) {
    setInitialPage(initialPage);
    setPage(initialPage);
    return null;
  }

  const displayPage = page || initialPage;

  console.log(displayPage);

  return (
    <div className="relative pb-12">
      {displayPage.blocks.map((b) => {
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
      })}
    </div>
  );
}
