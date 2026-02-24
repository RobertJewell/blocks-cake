import { registry } from "@/cms/blocks/block-registry";
import NavigationFloatingSimple from "@/cms/blocks/navigation/navigation-floating-simple/navigation-floating-simple";
import { fetchGlobal, getPageBySlug } from "@/cms/lib/core/functions";
import { useSiteShortcuts } from "@/cms/lib/hooks/useShortcuts";
import { DefaultCatchBoundary } from "@/components/default-catch-boundary";
import { NotFound } from "@/components/not-found";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  ssr: true,
  loader: async () => {
    const slug = "index";

    const [page, navigation] = await Promise.all([
      getPageBySlug({ data: slug }),
      fetchGlobal({ data: { key: "system-navigation" } }),
    ]);

    if (!page) throw notFound();
    return { page, navigation };
  },
  component: RouteComponent,

  notFoundComponent: () => <NotFound />,
  errorComponent: DefaultCatchBoundary,
});

function RouteComponent() {
  const { page, navigation } = Route.useLoaderData();
  useSiteShortcuts();

  return (
    <div className="bg-white">
      {navigation?.type === "system-navigation" && (
        <NavigationFloatingSimple
          logo={navigation.value.logo || []}
          menuItems={navigation.value.menuItems || []}
          ctaHref={navigation.value.ctaHref}
          ctaText={navigation.value.ctaText}
        />
      )}
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
