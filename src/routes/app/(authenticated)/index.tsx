import { getPages } from "@/cms/lib/core/functions";
import { PageCard } from "@/cms/ui/dashboard/page-card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/(authenticated)/")({
  component: RouteComponent,
  loader: async () => {
    const pages = await getPages();
    return pages;
  },
});

function RouteComponent() {
  const pages = Route.useLoaderData();
  const r2BaseUrl =
    import.meta.env.VITE_CLOUDFLARE_R2_BASE_URL ||
    "https://pub-39814712f705425ebdcd406e6d0a9361.r2.dev";

  return (
    <div className="p-6 flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Pages</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pages.map((page) => (
            <PageCard
              key={page.id}
              slug={page.slug}
              title={page.title}
              status={page.status}
              screenshot={page.screenshots?.[0]}
              r2BaseUrl={r2BaseUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
