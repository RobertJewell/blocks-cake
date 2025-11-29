import { DesktopEditorLayout } from "@/lib/cms/editor/edit-page/edit-layout";
import { EditorSidebar } from "@/lib/cms/editor/sidebar/editor-sidebar";
import { EditorToolbar } from "@/lib/cms/editor/toolbar/editor-toolbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app/(authenticated)/edit")({
  component: EditLayout,
});

function EditLayout() {
  return (
    <DesktopEditorLayout
      sidebar={<EditorSidebar />}
      toolbar={<EditorToolbar />}
    >
      <Outlet />
    </DesktopEditorLayout>
  );
}
