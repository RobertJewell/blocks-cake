import { DefaultCatchBoundary } from "@/components/default-catch-boundary";
import { NotFound } from "@/components/not-found";
import { getPageBySlug } from "@/core/functions/pages/get-page-by-slug";
import { registry } from "@/lib/cms/blocks/block-registry";
import { useSiteShortcuts } from "@/lib/cms/hooks/useShortcuts";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  ssr: true,
  loader: async () => {
    try {
      const page = await getPageBySlug({ data: "index" });

      if (!page) {
        console.log(`[Slug Route: index] - Page not found in DB"`);
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

      console.error(`[Slug Route: index] error:`, err);
      throw err;
    }
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

// export const Route = createFileRoute("/")({
//   component: LandingPage,
// });

// function LandingPage() {
//   return (
//     <div className="min-h-screen bg-background">
//       <NavigationBar />
//       <main>
//         <HeroSection />
//         <MiddlewareDemo />
//       </main>
//       <Footer />
//     </div>
//   );
// }
