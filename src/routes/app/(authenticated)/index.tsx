import { navigationFloatingSimpleConfig } from "@/cms/blocks/navigation/navigation-floating-simple/navigation-floating-simple-config";
import { getPages } from "@/cms/lib/core/functions";
import { FormRenderer } from "@/cms/editor/renderers";
import { Badge } from "@/cms/ui/badge";
import { Button } from "@/cms/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/app/(authenticated)/")({
  component: RouteComponent,
  loader: async () => {
    const pages = await getPages();
    return pages;
  },
});

function RouteComponent() {
  const pages = Route.useLoaderData();

  return (
    <div className="p-4 flex gap-6">
      <div className="flex flex-col border-2 rounded-md border-border p-4 max-w-sm w-full gap-4">
        <h2 className="font-bold">Available pages</h2>
        <ul className="flex flex-col gap-3">
          {pages.map((page) => (
            <li>
              <Link
                to="/app/edit/$"
                className="flex text-sm justify-between items-center"
                params={{ _splat: page.slug }}
              >
                <span>{page.title}</span>
                <Badge
                  variant={page.status === "published" ? "success" : "warning"}
                >
                  {page.status}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="max-w-sm w-full">
        <FormRenderer
          fields={navigationFloatingSimpleConfig}
          defaultValues={{
            logo: [],
            ctaText: "Book Now",
            menuItems: [],
          }}
          onSubmit={(data) => console.log(data)}
          onChange={(patch) => console.log(patch)}
        >
          <Button type="submit">Save</Button>
        </FormRenderer>
      </div>
    </div>
  );
}
