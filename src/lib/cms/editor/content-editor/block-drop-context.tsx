import { BlockType } from "@/lib/cms/blocks/block-registry.types";
import { useEditorStore } from "@/lib/cms/stores/editor-store";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import { BlockPreview } from "./blocks/block-preview";

export function BlockDropContext({ children }: { children: ReactNode }) {
  const addBlock = useEditorStore((s) => s.addBlock);

  // Track the active item to render in the Overlay
  const [activeType, setActiveType] = useState<BlockType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "sidebar-block") {
      setActiveType(event.active.data.current.blockType as BlockType);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveType(null); // Clear overlay
    const { active, over } = event;

    if (!over) return;

    if (
      active.data.current?.type === "sidebar-block" &&
      over.data.current?.type === "insert-after"
    ) {
      const newBlockType = active.data.current.blockType;
      const insertAfterId = over.data.current.blockId;

      if (newBlockType && insertAfterId) {
        addBlock(newBlockType, insertAfterId);
      }
    }
  }

  // Define drop animation to make it disappear smoothly or snap
  const dropAnimation = {
    duration: 250,
    easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}

      {/* The DragOverlay renders into a Portal by default (attached to document.body).
        This breaks it out of the Sidebar's overflow:hidden constraints.
      */}
      {typeof document !== "undefined" &&
        createPortal(
          <DragOverlay
            key="addblock"
            dropAnimation={dropAnimation}
            className="cursor-grabbing"
          >
            {activeType ? (
              // We force a specific width because in the sidebar it might be constrained,
              // but when dragging we want it to look like a solid card.
              <div className="w-[287px] rotate-1 rounded-lg shadow-2xl cursor-grabbing opacity-90">
                <BlockPreview type={activeType} />
              </div>
            ) : null}
          </DragOverlay>,
          document.body,
        )}
    </DndContext>
  );
}
