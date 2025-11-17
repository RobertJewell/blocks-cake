import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

import { EditorSidebar } from "@/lib/cms/editor/sidebar/editor-sidebar";
import { EditorToolbar } from "@/lib/cms/editor/toolbar/editor-toolbar";

export const Route = createFileRoute("/app/(authenticated)/edit")({
  component: EditLayout,
});

function EditLayout() {
  return (
    <SidebarProvider>
      <EditorSidebar />
      <SidebarInset>
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Floating header pill */}

          <EditorToolbar />

          <ScrollArea className="max-h-[calc(100vh-1rem)] flex-1">
            <Outlet />
          </ScrollArea>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
