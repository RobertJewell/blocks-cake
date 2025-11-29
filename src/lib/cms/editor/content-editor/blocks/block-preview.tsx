import { registry } from "@/lib/cms/blocks/block-registry";
import { BlockType } from "@/lib/cms/blocks/block-registry.types";
import { cn } from "@/lib/utils";
import React from "react";

interface BlockPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  type: BlockType;
}

export function BlockPreview({ type, className, ...props }: BlockPreviewProps) {
  const def = registry[type];
  const Skeleton = def?.skeleton;

  return (
    <div
      className={cn(
        // Base Layout
        "relative w-full overflow-hidden rounded-lg border transition-none  duration-200",
        // Colors & Backgrounds
        "bg-background hover:border-primary/50",

        className,
      )}
      {...props}
    >
      {/* Label Badge - TODO this pops in for some blocks only after the animation finishes */}
      <div className="absolute left-0 top-0 flex w-full justify-center pointer-events-none">
        <span
          className={cn(
            "rounded-b-md border bg-muted border-t-0 px-2 py-0.5 text-xs font-mono capitalize text-foreground select-none",
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
