import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { EditorSidebar } from "@/lib/cms/editor/sidebar/editor-sidebar";
import { EditorToolbar } from "@/lib/cms/editor/toolbar/editor-toolbar";
import { cn } from "@/lib/utils";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { motion, Variants } from "motion/react";
import { useState } from "react";

export const Route = createFileRoute("/app/(authenticated)/edit")({
  component: EditLayout,
});

// 1. Outer Container: Handles Horizontal Squeeze
const containerVariants: Variants = {
  expanded: {
    paddingLeft: 8, // px-2
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
    borderRadius: 12, // rounded-xl
    // Instead of calc(), we simply add margin.
    // If parent is 100vh, adding 8px top/bottom margin MAKES the height calc(100vh - 16px)
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
  const [open, setOpen] = useState(false);

  return (
    <SidebarProvider className="bg-sidebar" open={open} onOpenChange={setOpen}>
      <EditorSidebar />

      {/* h-svh and overflow-hidden are CRITICAL here to lock the viewport */}
      <SidebarInset className="h-svh overflow-hidden bg-sidebar">
        <motion.div
          className={cn("flex min-h-0 flex-1 flex-col")}
          initial="collapsed"
          animate={open ? "expanded" : "collapsed"}
          variants={containerVariants}
        >
          <EditorToolbar />

          {/* The Window Frame */}
          <motion.div
            className="flex flex-1 flex-col overflow-hidden bg-background shadow-sm border-border"
            variants={windowVariants}
            // No style prop needed! The variant handles the height via margin.
          >
            <ScrollArea className="flex-1 h-full">
              <Outlet />
            </ScrollArea>
          </motion.div>
        </motion.div>
      </SidebarInset>
    </SidebarProvider>
  );
}
