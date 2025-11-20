import { registry } from "@/lib/cms/blocks/block-registry";
import { PageData } from "@/lib/cms/blocks/block-registry.types";
import { BlockShell } from "@/lib/cms/blocks/block-shell";
import { useEditorStore } from "@/lib/cms/stores/editor-store";
import { isValidSlugPath } from "@/lib/utils";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";

export const Route = createFileRoute("/app/(authenticated)/edit/$/slug")({
  loader: async ({ params, context }) => {
    const slug = params._splat;

    if (!slug || !isValidSlugPath(slug)) throw notFound();

    const res = await fetch(`/api/pages/${slug}`, {
      credentials: "same-origin",
    });
    if (!res.ok) throw notFound();
    const page = (await res.json()) as PageData;
    console.log(page.blocks);

    context.editorStore.getState().setPage(page);

    return page;
  },
  component: EditPage,
});

function EditPage() {
  const initialPage = Route.useLoaderData();
  const setPage = useEditorStore((s) => s.setPage);
  const setInitialPage = useEditorStore((s) => s.setInitialPage);
  const page = useEditorStore((s) => s.page);
  const mode = useEditorStore((s) => s.mode);

  if (!page) {
    setInitialPage(initialPage);
    setPage(initialPage);
    return null;
  }

  return (
    <div className="relative">
      {page.blocks.map((b) => {
        const def = registry[b.type];
        if (!def) {
          return (
            <div key={b.id} className="text-red-600">
              Unknown block type: {b.type}
            </div>
          );
        }
        const Component = def.component as React.ComponentType<typeof b.data>;
        return (
          <motion.div
            layout="position"
            key={b.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} // Added exit animation for when blocks are removed
            transition={{ type: "spring", stiffness: 500, damping: 50 }} // Smoother transitions
            whileDrag={
              mode === "edit-layout"
                ? { filter: "blur(5px)", scale: 0.98 }
                : undefined
            }
            // whileTap={{ filter: "blur(5px)", scale: 0.98 }}
            className="relative z-0"
          >
            <BlockShell key={b.id} block={b}>
              <Component {...b.data} />
            </BlockShell>
          </motion.div>
        );
      })}
    </div>
  );
}
