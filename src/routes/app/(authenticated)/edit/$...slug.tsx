import { registry } from "@/lib/cms/blocks/block-registry";
import { PageData } from "@/lib/cms/blocks/block-registry.types";
import { BlockShell } from "@/lib/cms/blocks/block-shell";
import { useEditorStore } from "@/lib/cms/stores/editor-store";
import { isValidSlugPath } from "@/lib/utils";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/app/(authenticated)/edit/$/slug")({
  loader: async ({ params, context }) => {
    const slug = params._splat;

    if (!slug || !isValidSlugPath(slug)) throw notFound();

    const res = await fetch(`/api/pages/${slug}`, {
      credentials: "same-origin",
    });

    if (!res.ok) throw notFound();

    const page = (await res.json()) as PageData;

    console.log(page);

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
        const Component = def.Component as React.ComponentType<typeof b.props>;
        return (
          <BlockShell key={b.id} block={b}>
            <Component {...b.props} />
          </BlockShell>
        );
      })}
    </div>
  );
}
