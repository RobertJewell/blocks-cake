import { DashboardLayout, GlobalView, PagesView } from "@/cms/dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/(authenticated)/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardLayout>
      {(view) => {
        switch (view) {
          case "pages":
            return <PagesView />;
          case "globals":
            return <GlobalView />;
          default:
            return <PagesView />;
        }
      }}
    </DashboardLayout>
  );
}
