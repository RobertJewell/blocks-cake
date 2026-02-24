import NavigationFloatingSimple from "@/cms/blocks/navigation/navigation-floating-simple/navigation-floating-simple";
import { EditorLayout } from "@/cms/editor/editor-page/editor-layout";
import { EditorSidebar } from "@/cms/editor/sidebar/editor-sidebar";
import { EditorToolbar } from "@/cms/editor/toolbar/editor-toolbar";
import { fetchGlobal } from "@/cms/lib/core/functions/globals";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";

const globalsQueryOptions = () =>
  queryOptions({
    queryKey: ["navigation-global"],
    queryFn: () => fetchGlobal({ data: { key: "system-navigation" } }),
  });

export const Route = createFileRoute("/app/(authenticated)/edit")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(globalsQueryOptions());
  },
  component: Layout,
});

// const menuData = [
//   { text: "Torty", href: "/torty" },
//   { text: "Babeczki", href: "/babeczki" },
//   {
//     text: "Słodkości",
//     subMenuItems: [
//       { text: "Makaroniki", href: "/slodkosci/makaroniki" },
//       { text: "Desery w słoiczkach", href: "/slodkosci/desery" },
//     ],
//   },
//   { text: "Słodki Stół", href: "/slodki-stul" },
//   { text: "Galeria", href: "/galeria" },
// ] satisfies HydratedBlockProps<
//   typeof navigationFloatingSimpleConfig
// >["menuItems"];

// const ctaData = {
//   text: "Złóż zamówienie",
//   href: "/zamowienie",
// };

function Layout() {
  const { data: navigation } = useSuspenseQuery(globalsQueryOptions());

  return (
    <EditorLayout sidebar={<EditorSidebar />} toolbar={<EditorToolbar />}>
      {navigation?.type === "system-navigation" && (
        <NavigationFloatingSimple
          logo={[]}
          menuItems={navigation?.value.menuItems || []}
          ctaHref={navigation?.value.ctaHref}
          ctaText={navigation?.value.ctaText}
        />
      )}
      <Outlet />
    </EditorLayout>
  );
}
