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
  // const { user } = Route.useRouteContext();
  const pages = Route.useLoaderData();

  // if (user) {
  //   return (
  //     <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
  //       <UserConfirmationCard user={user} />
  //     </div>
  //   );
  // }
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
