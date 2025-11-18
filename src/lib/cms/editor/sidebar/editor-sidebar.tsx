import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useEditorStore } from "../../stores/editor-store";
import { FormRenderer } from "../form-renderer";

export function EditorSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const page = useEditorStore((s) => s.page);
  const updateBlock = useEditorStore((s) => s.updateBlock);

  const block = page?.blocks.find((b) => b.id === selectedId);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <h2 className="text-sm font-semibold">Block Editor</h2>
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        <motion.div
          layout
          initial={false}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn("overflow-y-auto px-1 py-4")}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {!block ? (
              <p className="text-muted-foreground text-sm">
                Select a block to edit its settings.
              </p>
            ) : (
              <FormRenderer
                key={block?.id}
                block={block}
                onChange={(patch) => updateBlock(block.id, block.type, patch)}
                onSubmit={(blockData) => {
                  console.log(blockData);
                }}
              >
                <SidebarFooter>
                  <Button type="submit">Save</Button>
                </SidebarFooter>
              </FormRenderer>
            )}
          </AnimatePresence>
        </motion.div>
      </SidebarContent>
    </Sidebar>
  );
}
