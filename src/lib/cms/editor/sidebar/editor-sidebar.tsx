import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { registry } from "../../blocks/block-registry";
import { blurUpVariants } from "../../blocks/shared/animations";
import { useEditorStore } from "../../stores/editor-store";
import { FormRenderer } from "../form-renderer";
import { BlockReorderList } from "./block-reorder-list";

export function EditorSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const page = useEditorStore((s) => s.page);
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const setSelected = useEditorStore((s) => s.setSelected);
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);

  // Safe lookup
  const block = page?.blocks.find((b) => b.id === selectedId);

  const { setOpen } = useSidebar();

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
            setOpen(false);
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
            {mode === "edit" &&
              (!block ? (
                <motion.div
                  key="empty-state"
                  variants={blurUpVariants}
                  initial="hidden"
                  animate="visible"
                  custom={{ y: -10, blur: 8, duration: 0.2, exitDuration: 0.1 }}
                  exit="hidden"
                  className="flex flex-col items-center justify-center text-center space-y-2"
                >
                  {page?.blocks.map((block) => {
                    const def = registry[block.type as keyof typeof registry];
                    const Skeleton = def?.skeleton;
                    return (
                      <div
                        className={cn(
                          "bg-muted w-full relative overflow-hidden border rounded-lg transition-all duration-200",
                          "hover:border-primary/50 bg-background",
                        )}
                      >
                        {/* Block Label  */}
                        <div className="absolute top-0 left-0 w-full z-20 flex justify-center pointer-events-none">
                          <span className="text-[0.5rem] uppercase tracking-wider font-bold bg-gray-100/90 px-3 py-1 rounded-b-md border border-t-0 text-gray-500 select-none">
                            {block.type}
                          </span>
                        </div>

                        {/* Skeleton */}
                        <div className="pointer-events-none ">
                          {Skeleton ? (
                            <Skeleton />
                          ) : (
                            <div className="h-24 w-full bg-muted" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key={block.id}
                  variants={blurUpVariants}
                  custom={{ y: -10, blur: 8, duration: 0.2, exitDuration: 0.1 }}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <div className="space-y-1 mb-6">
                    <h3 className="text-lg font-medium capitalize">
                      {block.type} Block
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      ID: {block.id}
                    </p>
                  </div>

                  <FormRenderer
                    block={block}
                    onChange={(patch) =>
                      updateBlock(block.id, block.type, patch)
                    }
                  />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
