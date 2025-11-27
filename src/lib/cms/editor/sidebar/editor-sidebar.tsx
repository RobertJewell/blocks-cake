import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useAnimationMode } from "../../hooks/useAnimationMode";
import { useEditorStore } from "../../stores/editor-store";
import { BlockEditor } from "../content-editor/block-editor";

export function EditorSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const setSelected = useEditorStore((s) => s.setSelected);
  const page = useEditorStore((s) => s.page);
  const mode = useEditorStore((s) => s.mode);

  // Use the hook to determine animation direction
  const animationMode = useAnimationMode(selectedId);

  const currentBlock = page?.blocks.find((b) => b.id === selectedId);

  return (
    <Sidebar className="max-h-screen font-editor" {...props}>
      {/* Pass mode to AnimatePresence.
        It will be accessible to direct motion children via context,
        but we also pass it explicitly to BlockEditor for clarity.
      */}

      <SidebarHeader className="flex px-2 h-14 flex-row justify-between center z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        {mode === "edit" && currentBlock ? (
          <motion.div
            key="header-detail"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex w-full items-center gap-2"
          >
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => setSelected("")}
              className="p-2 mx-0 transition-colors"
              aria-label="Back to list"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-3 items-center">
              <h3 className="font-medium capitalize">
                {currentBlock.type} Block
              </h3>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="header-list"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="flex justify-between w-full items-center gap-2"
          >
            <h2 className="font-medium px-2">Editor</h2>
          </motion.div>
        )}
      </SidebarHeader>

      <Separator />

      <SidebarContent className="overflow-hidden py-4">
        <ScrollArea className="h-full px-2 max-h-full relative">
          {mode === "edit" && <BlockEditor mode={animationMode} />}
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
