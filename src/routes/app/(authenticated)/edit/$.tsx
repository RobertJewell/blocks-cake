import { DefaultCatchBoundary } from "@/components/default-catch-boundary";
import { NotFound } from "@/components/not-found";
import { getPageBySlug } from "@/core/functions/pages/get-page-by-slug";
import { PageData } from "@/lib/cms/blocks/block-registry.types";
import { EditorPageRenderer } from "@/lib/cms/editor/editor-page/editor-page-renderer";

import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/app/(authenticated)/edit/$")({
  loader: async ({ context, params }): Promise<PageData> => {
    const page = await getPageBySlug({ data: params._splat || "index" });
    if (!page) throw notFound();
    context.editorStore.getState().setPage(page);
    return page;
  },
  component: () => {
    const data = Route.useLoaderData();
    return <EditorPageRenderer initialPage={data} />;
  },
  notFoundComponent: () => <NotFound />,
  errorComponent: DefaultCatchBoundary,
});
