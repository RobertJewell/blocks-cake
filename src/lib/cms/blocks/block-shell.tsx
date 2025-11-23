import { cn } from "@/lib/utils";
import * as React from "react";
import { useEditorStore } from "../stores/editor-store";
import { Block } from "./block-registry.types";

type Props = {
  block: Block;
  children: React.ReactNode;
};

export function BlockShell({ block, children }: Props) {
  const mode = useEditorStore((s) => s.mode);
  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const setSelected = useEditorStore((s) => s.setSelected);
  const isEdit = mode === "edit";
  // const isSelected = selectedId === block.id;

  return (
    <div
      id={block.id}
      onClick={(e) => {
        if (!isEdit) return;
        e.stopPropagation();
        setSelected(block.id);
      }}
      className={cn(
        "group relative z-20",
        isEdit && selectedId !== block.id ? "cursor-pointer" : "",
      )}
    >
      {/*<BlockEditButton blockId={block.id} />*/}
      {/*overlay replaces by edit button per clock*/}
      {/*<div
        className={cn(
          "pointer-events-none absolute inset-0 z-20 rounded-xl bg-radial from-pink-400 from-30% to-pink-400/50 opacity-0 transition-opacity",
          isEdit && selectedId !== block.id && "group-hover:opacity-50",
        )}
      ></div>*/}
      {children}
    </div>
  );
}
