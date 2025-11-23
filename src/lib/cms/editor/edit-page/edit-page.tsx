import { registry } from "@/lib/cms/blocks/block-registry";
import { PageData } from "@/lib/cms/blocks/block-registry.types";
import { BlockShell } from "@/lib/cms/blocks/block-shell";
import { useEditorStore } from "@/lib/cms/stores/editor-store";
import { motion } from "motion/react";

export function EditPage({ initialPage }: { initialPage: PageData }) {
  const setPage = useEditorStore((s) => s.setPage);
  const setInitialPage = useEditorStore((s) => s.setInitialPage);
  const page = useEditorStore((s) => s.page);

  if (!page || page.id !== initialPage.id) {
    setInitialPage(initialPage);
    setPage(initialPage);
    return null;
  }

  const displayPage = page || initialPage;

  return (
    <div className="relative">
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
