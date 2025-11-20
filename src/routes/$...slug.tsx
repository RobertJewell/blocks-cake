import { DefaultCatchBoundary } from "@/components/default-catch-boundary";
import { NotFound } from "@/components/not-found";
import { getPageBySlug } from "@/core/functions/pages/get-page-by-slug";
import { registry } from "@/lib/cms/blocks/block-registry";
import { Block } from "@/lib/cms/blocks/block-registry.types";
import { isValidSlugPath } from "@/lib/utils";

import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/$/slug")({
  ssr: true,
  loader: async ({ params }) => {
    const slug = params._splat;

    if (!slug || !isValidSlugPath(slug) || slug.startsWith("/edit")) {
      throw notFound();
    }

    try {
      const page = await getPageBySlug({ data: slug });

      if (!page) {
        console.log(`[Slug Route: ${slug}] - Page not found in DB"`);
        throw notFound();
      }

      return page;
    } catch (err) {
      if (
        err instanceof Response ||
        (err as any).status === 404 ||
        (err as any).isNotFound
      ) {
        throw err;
      }

      console.error(`[Slug Route: ${slug}] error:`, err);
      throw err;
    }
  },
  component: RouteComponent,

  notFoundComponent: () => <NotFound />,
  errorComponent: DefaultCatchBoundary,
});

function RouteComponent() {
  const page = Route.useLoaderData();

  return (
    <div>
      {page.blocks.map((b) => {
        const def = registry[b.type];
        if (!def) {
          return (
            <div key={b.id} className="text-red-600">
              Unknown block type: {b.type}
            </div>
          );
        }
        const Component =
          def.component as unknown as React.ComponentType<Block>;
        return <Component key={b.id} {...b.data} />;
      })}
    </div>
  );
}
