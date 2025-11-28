import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, Variants } from "motion/react";
import { ReactNode } from "react";

// Configuration
const SIDEBAR_WIDTH = 280;
const GAP = 12;

const windowVariants: Variants = {
  expanded: {
    top: GAP,
    left: SIDEBAR_WIDTH + GAP,
    right: GAP,
    bottom: GAP,
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    transition: { type: "spring", bounce: 0, duration: 0.3 },
  },
  collapsed: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 0,
    boxShadow: "0 0 0 0 rgba(0,0,0,0)",
    transition: { type: "spring", bounce: 0, duration: 0.3 },
  },
};

/**
 * Reusable Desktop Layout Wrapper
 * Handles the "Underlay" sidebar and "Overlay" content window animations.
 */
export const DesktopEditorLayout = ({
  isOpen,
  sidebar,
  toolbar,
  children,
}: {
  isOpen: boolean;
  sidebar: ReactNode;
  toolbar: ReactNode;
  children: ReactNode;
}) => {
  return (
    <div className="relative h-svh w-full overflow-hidden bg-sidebar border-border">
      {/* LAYER 0: The Underlay (Sidebar) */}
      <div
        className="absolute left-0 top-0 h-full border-r border-transparent"
        style={{ width: SIDEBAR_WIDTH }}
      >
        <div className="h-full w-full overflow-hidden">{sidebar}</div>
      </div>

      {/* LAYER 1: The Overlay (Content Window) */}
      <motion.div
        className="absolute z-10 flex flex-col overflow-hidden bg-background border border-border shadow-sm"
        initial="collapsed"
        animate={isOpen ? "expanded" : "collapsed"}
        variants={windowVariants}
      >
        {/* Header */}
        {toolbar}

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-hidden bg-white">
          <ScrollArea className="h-full">{children}</ScrollArea>
        </div>
      </motion.div>
    </div>
  );
};
