import { useIsMobile } from "@/cms/hooks/use-is-mobile";
import { useEditorStore } from "@/cms/stores/editor-store";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, Variants } from "motion/react";
import { ReactNode } from "react";
import { BlockDropContext } from "../content-editor/add-blocks";

// Configuration
const SIDEBAR_WIDTH = 320;
const GAP = 12;

const windowVariants: Variants = {
  expanded: {
    top: GAP,
    left: SIDEBAR_WIDTH + GAP / 2,
    right: GAP,
    bottom: GAP,
    borderRadius: 12,
    transition: { type: "spring", bounce: 0, duration: 0.3 },
  },
  collapsed: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 0,
    transition: { type: "spring", bounce: 0, duration: 0.2 },
  },
};

/**
 * Reusable Desktop Layout Wrapper
 * Handles the "Underlay" sidebar and "Overlay" content window animations.
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
  const isMobile = useIsMobile();
  const isSidebarOpen = mode !== "view" && !isMobile;
  const isMobileEditPanelOpen = mode === "edit" && isMobile;

  return (
    <BlockDropContext>
      <Dialog open={isMobileEditPanelOpen} modal>
        <DialogContent className="max-w-none transition-none! w-screen h-screen rounded-none border-none p-0 flex flex-col bg-background focus:outline-none sm:max-w-none!">
          <DialogTitle className="sr-only">Edit Page</DialogTitle>
          {sidebar}
          <div className="w-full absolute bottom-0 h-6 pointer-events-none bg-linear-to-t from-background "></div>
        </DialogContent>
      </Dialog>

      <div className="relative bg-sidebar h-svh w-full sm:overflow-hidden border-border">
        {/* LAYER 0: The Underlay (Sidebar) */}
        <div
          className="h-full border-r border-transparent"
          style={{ width: SIDEBAR_WIDTH }}
        >
          <div className="h-full w-full overflow-hidden">{sidebar}</div>
        </div>

        {/* LAYER 1: The Overlay (Content Window) */}
        <motion.div
          className="absolute z-10 flex shadow-md flex-col sm:overflow-hidden"
          initial="collapsed"
          animate={isSidebarOpen ? "expanded" : "collapsed"}
          variants={windowVariants}
        >
          {toolbar}

          {/* Scrollable Content */}
          <div className="flex-1 min-h-0 sm:overflow-hidden bg-white">
            {/*<div className="h-full block sm:hidden">{children}</div>*/}
            <ScrollArea className="h-full">{children}</ScrollArea>
          </div>
        </motion.div>
      </div>
    </BlockDropContext>
  );
};
