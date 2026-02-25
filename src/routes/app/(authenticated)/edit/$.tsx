import { PageData } from "@/cms/blocks/block-registry.types";
import { EditorPageRenderer } from "@/cms/editor/editor-page/editor-page-renderer";
import {
  getAllGlobals,
  getPageBySlug,
  GlobalRecord,
} from "@/cms/lib/core/functions";
import { DefaultCatchBoundary } from "@/components/default-catch-boundary";
import { NotFound } from "@/components/not-found";
import { createFileRoute, notFound } from "@tanstack/react-router";

interface LoaderData {
  page: PageData;
  globals: GlobalRecord[];
}

export const Route = createFileRoute("/app/(authenticated)/edit/$")({
  loader: async ({ context, params }): Promise<LoaderData> => {
    // Fetch page and globals in parallel
    const [page, globals] = await Promise.all([
      getPageBySlug({ data: params._splat || "index" }),
      getAllGlobals({ data: { scope: "global" } }),
    ]);

    if (!page) throw notFound();

    context.editorStore.getState().setPage(page);
    return { page, globals };
  },
  component: () => {
    const data = Route.useLoaderData();
    return <EditorPageRenderer initialPage={data.page} />;
  },
  notFoundComponent: () => <NotFound />,
  errorComponent: DefaultCatchBoundary,
});
