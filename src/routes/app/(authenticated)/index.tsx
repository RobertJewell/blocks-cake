import { getPages } from "@/cms/lib/core/functions";
import { Button } from "@/cms/ui/button";
import { PageCard } from "@/cms/ui/dashboard/page-card";
import { IconPlus } from "@tabler/icons-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/app/(authenticated)/")({
  component: RouteComponent,
  loader: async () => {
    const pages = await getPages();
    return pages;
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const initialPages = Route.useLoaderData();
  const [pages, setPages] = useState(initialPages);
  const r2BaseUrl =
    import.meta.env.VITE_CLOUDFLARE_R2_BASE_URL ||
    "https://pub-39814712f705425ebdcd406e6d0a9361.r2.dev";

  const handlePageDeleted = (deletedSlug: string) => {
    setPages((prev) => prev.filter((p) => p.slug !== deletedSlug));
  };

  return (
    <div className="p-6 flex flex-col font-editor gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Pages</h1>
          <Button onClick={() => navigate({ to: "/app/create" })}>
            <IconPlus /> New Page
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pages.map((page) => (
            <PageCard
              key={page.id}
              slug={page.slug}
              title={page.title}
              status={page.status}
              screenshot={page.screenshots?.[0]}
              r2BaseUrl={r2BaseUrl}
              onDelete={() => handlePageDeleted(page.slug)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
