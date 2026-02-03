import { registry } from "@/cms/blocks/block-registry";
import { getPageBySlug } from "@/cms/core/functions";
import { isValidSlugPath } from "@/cms/lib/helpers/slugs";
import { useSiteShortcuts } from "@/cms/lib/hooks/useShortcuts";
import { DefaultCatchBoundary } from "@/components/default-catch-boundary";
import { NotFound } from "@/components/not-found";

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
  useSiteShortcuts();

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
