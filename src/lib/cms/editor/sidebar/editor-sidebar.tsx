import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { blurUpVariants } from "../../blocks/shared/animations";
import { useEditorStore } from "../../stores/editor-store";
import { BlockEditor } from "../content-editor/block-editor";
import { BlockReorderList } from "./block-reorder-list";

export function EditorSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const setSelected = useEditorStore((s) => s.setSelected);
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);

  return (
    <Sidebar className="pl-2" {...props}>
      <SidebarHeader className="flex flex-row justify-between pr-0 items-baseline z-10">
        <h2 className="text-sm font-semibold">Block Editor</h2>
        <Button
          size={"icon"}
          variant={"ghost"}
          className="h-8 w-8"
          onClick={() => {
            setMode("view");
            setSelected(undefined);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        <div className="h-full relative overflow-y-auto px-1  py-4">
          <AnimatePresence mode="popLayout">
            {}
            {mode === "edit" && <BlockEditor />}
            {mode === "edit-layout" && (
              <motion.div
                key="layout"
                variants={blurUpVariants}
                initial="hidden"
                animate="visible"
                custom={{ y: -10, blur: 8, duration: 0.2, exitDuration: 0.1 }}
                exit="hidden"
                className="flex flex-col items-center justify-center text-center space-y-2"
              >
                <BlockReorderList />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
