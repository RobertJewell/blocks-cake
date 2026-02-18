import { useAnimationMode } from "@/cms/lib/hooks/use-animation-mode";
import { useEditorStore } from "@/cms/lib/stores/editor-store";
import { Button } from "@/cms/ui/button";
import { Separator } from "@/cms/ui/separator";
import {
  SidebarContent,
  SidebarHeader as SidebarHeaderBase,
} from "@/cms/ui/sidebar";
import { IconArrowLeft, IconX } from "@tabler/icons-react";
import { motion } from "motion/react";
import { BlockLibrary } from "../content-editor/add-blocks";
import { BlockEditor } from "../content-editor/edit-blocks";

const SidebarHeader = () => {
  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const setSelected = useEditorStore((s) => s.setSelected);
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const page = useEditorStore((s) => s.page);
  const currentBlock = page?.blocks.find((b) => b.id === selectedId);

  return (
    <SidebarHeaderBase className="flex h-14 shrink-0 flex-row items-center justify-between px-2 z-10">
      {mode === "edit" && currentBlock ? (
        <motion.div
          key="header-detail"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="flex w-full items-center justify-between gap-2"
        >
          <div className="flex w-full items-center gap-2">
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => setSelected("")}
              className="mx-0 p-2 transition-colors"
              aria-label="Back to list"
            >
              <IconArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <h3 className="font-medium capitalize">
                {currentBlock.type} Block
              </h3>
            </div>
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
        </motion.div>
      )}
      <Button size={"icon"} variant={"ghost"} onClick={() => setMode("view")}>
        <IconX />
      </Button>
    </SidebarHeaderBase>
  );
};

export function EditorSidebar() {
  const mode = useEditorStore((s) => s.mode);
  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const animationMode = useAnimationMode(selectedId);

  return (
    <>
      <SidebarHeader />

      <Separator className="shrink-0" />

      <SidebarContent className="font-editor">
        <div className="px-2 pb-12">
          {mode === "edit" && <BlockEditor mode={animationMode} />}
          {mode === "add" && <BlockLibrary mode={animationMode} />}
        </div>
      </SidebarContent>
    </>
  );
}
