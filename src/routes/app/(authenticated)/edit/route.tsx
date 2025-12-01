import { EditorLayout } from "@/cms/editor/editor-page/editor-layout";
import { EditorSidebar } from "@/cms/editor/sidebar/editor-sidebar";
import { EditorToolbar } from "@/cms/editor/toolbar/editor-toolbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app/(authenticated)/edit")({
  component: Layout,
});

function Layout() {
  return (
    <EditorLayout sidebar={<EditorSidebar />} toolbar={<EditorToolbar />}>
      <Outlet />
    </EditorLayout>
  );
}
