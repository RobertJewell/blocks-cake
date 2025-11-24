import { registry } from "@/lib/cms/blocks/block-registry";
import { PageData } from "@/lib/cms/blocks/block-registry.types";
import { BlockShell } from "@/lib/cms/blocks/block-shell";
import { useEditorStore } from "@/lib/cms/stores/editor-store";
import {
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { motion } from "motion/react";

export function EditPage({ initialPage }: { initialPage: PageData }) {
  const setPage = useEditorStore((s) => s.setPage);
  const setInitialPage = useEditorStore((s) => s.setInitialPage);
  const page = useEditorStore((s) => s.page);
  const addBlock = useEditorStore((s) => s.addBlock);

  // --- Sensors ---
  // We use a pointer sensor with an activation constraint to prevent
  // accidental drags when just clicking to select a block.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  // --- Drag Handler ---
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    // SCENARIO: Dropping a sidebar item (new block) onto a BlockShell (insert zone)
    // The active item comes from the Sidebar (we'll ensure it has data.type === 'sidebar-block')
    // The over item comes from BlockShell's useDroppable (data.type === 'insert-after')
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

  // --- Store Sync ---
  if (!page || page.id !== initialPage.id) {
    setInitialPage(initialPage);
    setPage(initialPage);
    return null;
  }

  const displayPage = page || initialPage;

  return (
    <div className="relative pb-32">
      {displayPage.blocks.map((b) => {
        const def = registry[b.type];
        if (!def) return null;
        const Component = def.component as React.ComponentType<typeof b.data>;

        return (
          <motion.div
            key={b.id}
            layout="position"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <BlockShell block={b}>
              <Component {...b.data} />
            </BlockShell>
          </motion.div>
        );
      })}
    </div>
  );
}
