import { getPages } from "@/core/functions/pages/get-pages";
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
    <div className="p-4">
      <h2 className="text-xl">Available pages</h2>
      <ul className="flex flex-col pt-3 gap-3">
        {pages.map((page) => (
          <li>
            <Link to="/app/edit/$" params={{ _splat: page.slug }}>
              {page.title} - {page.status}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
