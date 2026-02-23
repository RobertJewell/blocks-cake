import { CreatePageDialog } from "@/cms/dashboard/pages/create-page-dialog";
import { PageCard } from "@/cms/dashboard/pages/page-card";
import { getPages } from "@/cms/lib/core/functions";
import { Button } from "@/cms/ui/button";

import { IconPlus } from "@tabler/icons-react";
import { queryOptions, useQuery } from "@tanstack/react-query";

export function PagesView() {
  const { data: pages = [] } = useQuery(
    queryOptions({
      queryKey: ["pages"],
      queryFn: () => getPages(),
    }),
  );

  return (
    <div className="p-6 flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Pages</h1>
          <CreatePageDialog>
            <Button>
              <IconPlus /> New Page
            </Button>
          </CreatePageDialog>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pages.map((page) => (
            <PageCard
              key={page.id}
              slug={page.slug}
              title={page.title}
              status={page.status}
              screenshot={page.screenshots?.[0]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
