import { registry } from "@/lib/cms/blocks/block-registry";
import { PageData } from "@/lib/cms/blocks/block-registry.types";
import { isValidSlugPath } from "@/lib/utils";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/$/slug")({
  ssr: true,
  loader: async ({ params }) => {
    const slug = params._splat;
    if (!slug || !isValidSlugPath(slug) || slug.startsWith("/edit")) {
      throw notFound();
    }

    const res = await fetch(`/api/pages/${slug}`, {
      credentials: "same-origin",
    });

    if (!res.ok) throw notFound();

    const page = (await res.json()) as PageData;
    return page;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const page = Route.useLoaderData();
  console.log(page);

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
        const Component = def.Component as React.ComponentType<typeof b.props>;
        return <Component key={b.id} {...b.props} />;
      })}
    </div>
  );
  return <div>Hello "/$slug"!</div>;
}
