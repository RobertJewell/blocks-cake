import { useIsMobile } from "@/hooks/use-mobile";
import { DesktopEditorLayout } from "@/lib/cms/editor/edit-page/edit-layout";
import { EditorSidebar } from "@/lib/cms/editor/sidebar/editor-sidebar";
import { EditorToolbar } from "@/lib/cms/editor/toolbar/editor-toolbar";
import { useEditorStore } from "@/lib/cms/stores/editor-store";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app/(authenticated)/edit")({
  component: EditLayout,
});

function EditLayout() {
  const mode = useEditorStore((s) => s.mode);
  const isMobile = useIsMobile();
  const isSidebarOpen = mode !== "view" && !isMobile;

  return (
    // <BlockDropContext>
    <DesktopEditorLayout
      isOpen={isSidebarOpen}
      sidebar={<EditorSidebar />}
      toolbar={<EditorToolbar />}
    >
      <Outlet />
    </DesktopEditorLayout>
    // </BlockDropContext>
  );
}
