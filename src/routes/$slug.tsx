import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$slug")({
  // loader: async ({ params }) => {
  //   const data = await loadPageData(params.slug);
  //   if (!data) throw notFound();
  //   return data;
  // },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/$slug"!</div>;
}
