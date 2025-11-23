import { DefaultCatchBoundary } from "@/components/default-catch-boundary";
import { NotFound } from "@/components/not-found";
import { getPageBySlug } from "@/core/functions/pages/get-page-by-slug";
import { registry } from "@/lib/cms/blocks/block-registry";
import { isValidSlugPath } from "@/lib/utils";

import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/$")({
  ssr: true,
  loader: async ({ params }) => {
    const slug = params._splat || "index";

    if (
      !isValidSlugPath(slug) ||
      slug.startsWith("app") ||
      slug.startsWith("api")
    ) {
      throw notFound();
    }
    const page = await getPageBySlug({ data: params._splat || "index" });
    if (!page) throw notFound();
    return page;
  },
  component: RouteComponent,
  notFoundComponent: () => <NotFound />,
  errorComponent: DefaultCatchBoundary,
});

function RouteComponent() {
  const page = Route.useLoaderData();

  return (
    <div className="bg-white">
      {page.blocks.map((block) => {
        const def = registry[block.type];
        if (!def) {
          return (
            <div key={block.id} className="text-red-600">
              Unknown block type: {block.type}
            </div>
          );
        }

        const Component = def.component as React.ComponentType<
          typeof block.data
        >;
        return <Component key={block.id} {...block.data} />;
      })}
    </div>
  );
}
