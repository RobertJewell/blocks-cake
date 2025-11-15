import * as React from "react";
import { cn } from "../../utils";
import { useEditorStore } from "../stores/editor-store";
import { Block } from "./block-registry.types";

type Props = {
  block: Block;
  children: React.ReactNode;
};

export function BlockShell({ block, children }: Props) {
  const mode = useEditorStore((s) => s.mode);
  // const selectedId = useEditorStore((s) => s.selectedBlockId);
  const setSelected = useEditorStore((s) => s.setSelected);

  const isEdit = mode === "edit";
  // const isSelected = selectedId === block.id;

  return (
    <div
      onClick={(e) => {
        if (!isEdit) return;
        e.stopPropagation();
        setSelected(block.id);
      }}
      className={cn(
        "group relative z-20",
        isEdit ? "cursor-pointer" : "",
        // isEdit && isSelected ? "outline-pink-500" : "outline-transparent",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-20 rounded-xl bg-pink-500 opacity-0 transition-opacity",
          isEdit && "group-hover:opacity-30",
        )}
      ></div>
      {children}
    </div>
  );
}
