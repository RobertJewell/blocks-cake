import { useEditorStore } from "@/cms/lib/stores/editor-store";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/cms/ui/sidebar";
import { ReactNode, useEffect } from "react";
import { BlockDropContext } from "../content-editor/add-blocks";

/**
 * Editor Layout with Sidebar
 * Uses default shadcn baseui Sidebar component with natural page scrolling.
 */
export const EditorLayout = ({
  sidebar,
  toolbar,
  children,
}: {
  sidebar: ReactNode;
  toolbar: ReactNode;
  children: ReactNode;
}) => {
  const mode = useEditorStore((s) => s.mode);
  const isSidebarOpen = mode !== "view";

  return (
    <BlockDropContext>
      <SidebarProvider defaultOpen={false}>
        <EditorLayoutInner
          sidebar={sidebar}
          toolbar={toolbar}
          isSidebarOpen={isSidebarOpen}
        >
          {children}
        </EditorLayoutInner>
      </SidebarProvider>
    </BlockDropContext>
  );
};

function EditorLayoutInner({
  sidebar,
  toolbar,
  children,
  isSidebarOpen,
}: {
  sidebar: ReactNode;
  toolbar: ReactNode;
  children: ReactNode;
  isSidebarOpen: boolean;
}) {
  const { setOpen } = useSidebar();

  // Sync sidebar state with editor mode
  useEffect(() => {
    setOpen(isSidebarOpen);
  }, [isSidebarOpen, setOpen]);

  return (
    <>
      <Sidebar collapsible="offcanvas" side="left">
        {sidebar}
      </Sidebar>
      <SidebarInset>
        {toolbar}
        <main>{children}</main>
      </SidebarInset>
    </>
  );
}
