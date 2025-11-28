import { registry } from "@/lib/cms/blocks/block-registry";
import { BlockType } from "@/lib/cms/blocks/block-registry.types";
import { cn } from "@/lib/utils";
import React from "react";

interface BlockPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  type: BlockType;
  isActive?: boolean;
  isDragging?: boolean;
}

export function BlockPreview({
  type,
  isActive,
  isDragging,
  className,
  ...props
}: BlockPreviewProps) {
  const def = registry[type];
  const Skeleton = def?.skeleton;

  return (
    <div
      className={cn(
        // Base Layout
        "relative w-full overflow-hidden rounded-lg border transition-all duration-200",
        // Colors & Backgrounds
        "bg-background hover:border-primary/50",
        // State: Dragging
        isDragging &&
          "scale-[1.02] shadow-2xl ring-2 ring-primary/20 bg-card z-50",
        // State: Active/Selected
        isActive && "ring-2 ring-primary border-primary",
        className,
      )}
      {...props}
    >
      {/* Label Badge */}
      <div className="absolute left-0 top-0 z-20 flex w-full justify-center pointer-events-none">
        <span
          className={cn(
            "rounded-b-md border border-t-0 bg-gray-50/90 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-gray-500 backdrop-blur-sm select-none",
            isActive && "bg-primary/10 text-primary border-primary/20",
          )}
        >
          {def?.name || type}
        </span>
      </div>

      {/* Skeleton Area */}
      <div className="pointer-events-none select-none">
        {Skeleton ? (
          <Skeleton />
        ) : (
          <div className="flex h-24 w-full items-center justify-center bg-muted text-xs text-muted-foreground">
            No Preview
          </div>
        )}
      </div>
    </div>
  );
}
