import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { registry } from "../../blocks/block-registry";
import { blurUpVariants } from "../../blocks/shared/animations";
import { useEditorStore } from "../../stores/editor-store";
import { FormRenderer } from "../form-renderer";

export const BlockEditor = () => {
  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const setSelected = useEditorStore((s) => s.setSelected);
  const page = useEditorStore((s) => s.page);
  const updateBlock = useEditorStore((s) => s.updateBlock);

  const currentBlock = page?.blocks.find((b) => b.id === selectedId);

  if (!currentBlock) {
    return (
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
              onClick={() => setSelected(block.id)}
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
    );
  }

  return (
    <motion.div
      key={currentBlock.id}
      variants={blurUpVariants}
      custom={{ y: -10, blur: 8, duration: 0.2, exitDuration: 0.1 }}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <div className="space-y-1 mb-6">
        <h3 className="text-lg font-medium capitalize">
          {currentBlock.type} Block
        </h3>
        <p className="text-xs text-muted-foreground font-mono">
          ID: {currentBlock.id}
        </p>
      </div>

      <FormRenderer
        block={currentBlock}
        onChange={(patch) =>
          updateBlock(currentBlock.id, currentBlock!.type, patch)
        }
      />
    </motion.div>
  );
};
