import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/ui/sidebar";
import { ArrowLeft, X } from "lucide-react";
import { motion } from "motion/react";
import { useAnimationMode } from "../../hooks/use-animation-mode";
import { useEditorStore } from "../../stores/editor-store";
import { BlockEditor } from "../content-editor/block-editor";
import { BlockLibrary } from "../content-editor/blocks/block-library";

const SidebarHeader = () => {
  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const setSelected = useEditorStore((s) => s.setSelected);
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const page = useEditorStore((s) => s.page);
  const currentBlock = page?.blocks.find((b) => b.id === selectedId);

  return (
    <div className="flex h-14 shrink-0 flex-row items-center justify-between px-2 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
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
            className="mx-0 p-2 transition-colors"
            aria-label="Back to list"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
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
          className="flex w-full items-center justify-between gap-2"
        >
          <h2 className="px-2 font-medium">Editor</h2>
          <Button
            size={"icon"}
            variant={"link"}
            onClick={() => setMode("view")}
          >
            <X />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export function EditorSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const mode = useEditorStore((s) => s.mode);
  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const animationMode = useAnimationMode(selectedId);

  return (
    <div className="flex h-full w-full flex-col font-editor" {...props}>
      <SidebarHeader />

      <Separator className="shrink-0" />

      <ScrollArea className="flex-1 min-h-0">
        <div className="px-2 py-4 pb-20">
          {mode === "edit" && <BlockEditor mode={animationMode} />}
          {mode === "add" && <BlockLibrary mode={animationMode} />}
        </div>
      </ScrollArea>
    </div>
  );
}
