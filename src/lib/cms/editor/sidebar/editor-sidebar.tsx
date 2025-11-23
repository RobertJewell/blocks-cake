import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useEditorStore } from "../../stores/editor-store";
import { BlockEditor } from "../content-editor/block-editor";

export function EditorSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const setSelected = useEditorStore((s) => s.setSelected);
  const mode = useEditorStore((s) => s.mode);
  const page = useEditorStore((s) => s.page);

  const currentBlock = page?.blocks.find((b) => b.id === selectedId);

  return (
    <Sidebar className=" max-h-screen" {...props}>
      <SidebarHeader className="flex px-2 h-14 flex-row justify-between  center z-10">
        {currentBlock ? (
          <div className="flex w-full items-center gap-2">
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
              <h3 className=" font-medium capitalize">
                {currentBlock.type} Block
              </h3>
            </div>
          </div>
        ) : (
          <div className="flex justify-between w-full items-center gap-2 ">
            <h2 className="font-medium px-2">Editor</h2>
            {/*<Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => {
                setMode("view");
                setSelected(undefined);
              }}
            >
              <X className="h-4 w-4" />
            </Button>*/}
          </div>
        )}
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        <AnimatePresence mode="popLayout">
          <ScrollArea className="h-full px-2 max-h-full relative overflow-y-auto ">
            {mode === "edit" && <BlockEditor />}
          </ScrollArea>
        </AnimatePresence>
      </SidebarContent>
    </Sidebar>
  );
}
