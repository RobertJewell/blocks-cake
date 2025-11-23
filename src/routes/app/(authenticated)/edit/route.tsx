import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { EditorSidebar } from "@/lib/cms/editor/sidebar/editor-sidebar";
import { EditorToolbar } from "@/lib/cms/editor/toolbar/editor-toolbar";
import { useEditorStore } from "@/lib/cms/stores/editor-store";
import { cn } from "@/lib/utils";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { motion, Variants } from "motion/react";

export const Route = createFileRoute("/app/(authenticated)/edit")({
  component: EditLayout,
});

// 1. Outer Container: Handles Horizontal Squeeze
const containerVariants: Variants = {
  expanded: {
    paddingLeft: 0, // px-2
    paddingRight: 8, // px-2
    transition: { type: "spring", bounce: 0, duration: 0.3 },
  },
  collapsed: {
    paddingLeft: 0,
    paddingRight: 0,
    transition: { type: "spring", bounce: 0, duration: 0.3 },
  },
};

// 2. Inner Window: Handles Vertical Squeeze + Radius
const windowVariants: Variants = {
  expanded: {
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 8,
    transition: { type: "spring", bounce: 0, duration: 0.3 },
  },
  collapsed: {
    borderRadius: 0,
    marginTop: 0,
    marginBottom: 0,
    transition: { type: "spring", bounce: 0, duration: 0.3 },
  },
};

function EditLayout() {
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const isMobile = useIsMobile();

  return (
    <SidebarProvider
      className="bg-sidebar"
      open={mode !== "view"}
      onOpenChange={(open) => {
        if (!open) {
          setMode("view");
        }
      }}
    >
      <EditorSidebar />

      <SidebarInset className="h-svh overflow-hidden bg-sidebar">
        <motion.div
          className={cn("flex min-h-0 flex-1 flex-col")}
          initial="collapsed"
          animate={mode !== "view" && !isMobile ? "expanded" : "collapsed"}
          variants={containerVariants}
        >
          <EditorToolbar />

          {/* The Window Frame */}
          <motion.div
            className="flex flex-1 flex-col overflow-hidden bg-background shadow-sm border-border"
            variants={windowVariants}
          >
            <ScrollArea className="flex-1 bg-white h-full">
              <Outlet />
            </ScrollArea>
          </motion.div>
        </motion.div>
      </SidebarInset>
    </SidebarProvider>
  );
}
