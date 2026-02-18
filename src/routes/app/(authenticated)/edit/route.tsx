import { HydratedBlockProps } from "@/cms/blocks/block-registry.types";
import NavigationFloatingSimple from "@/cms/blocks/navigation/navigation-floating-simple/navigation-floating-simple";
import { navigationFloatingSimpleConfig } from "@/cms/blocks/navigation/navigation-floating-simple/navigation-floating-simple-config";
import { EditorLayout } from "@/cms/editor/editor-page/editor-layout";
import { EditorSidebar } from "@/cms/editor/sidebar/editor-sidebar";
import { EditorToolbar } from "@/cms/editor/toolbar/editor-toolbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app/(authenticated)/edit")({
  component: Layout,
});

const menuData = [
  { text: "Torty", href: "/torty" },
  { text: "Babeczki", href: "/babeczki" },
  {
    text: "Słodkości",
    subMenuItems: [
      { text: "Makaroniki", href: "/slodkosci/makaroniki" },
      { text: "Desery w słoiczkach", href: "/slodkosci/desery" },
    ],
  },
  { text: "Słodki Stół", href: "/slodki-stul" },
  { text: "Galeria", href: "/galeria" },
] satisfies HydratedBlockProps<
  typeof navigationFloatingSimpleConfig
>["menuItems"];

const ctaData = {
  text: "Złóż zamówienie",
  href: "/zamowienie",
};

function Layout() {
  return (
    <EditorLayout sidebar={<EditorSidebar />} toolbar={<EditorToolbar />}>
      <NavigationFloatingSimple
        logo={[]}
        menuItems={menuData}
        ctaHref={ctaData.href}
        ctaText={ctaData.text}
      />
      <Outlet />
    </EditorLayout>
  );
}
