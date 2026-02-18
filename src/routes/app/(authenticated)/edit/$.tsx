import { PageData } from "@/cms/blocks/block-registry.types";
import { getPageBySlug } from "@/cms/lib/core/functions";
import { EditorPageRenderer } from "@/cms/editor/editor-page/editor-page-renderer";
import { DefaultCatchBoundary } from "@/components/default-catch-boundary";
import { NotFound } from "@/components/not-found";
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
