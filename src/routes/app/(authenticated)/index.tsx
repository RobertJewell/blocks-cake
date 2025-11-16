import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/(authenticated)/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useRouteContext();
  console.log(user);
  // if (session) {
  //   return (
  //     <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
  //       <UserConfirmationCard session={session} />
  //     </div>
  //   );
  // }
  return <div>Hello "/app/"!</div>;
}
