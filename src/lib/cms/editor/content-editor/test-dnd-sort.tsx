import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion } from "motion/react";
import { useState } from "react";

// --- Helper to create items ---
const createRange = (length: number) =>
  [...new Array(length)].map((_, index) => index + 1);

// --- Main Component ---
export function VerticalListTest() {
  const [items, setItems] = useState(() => createRange(10));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as number);
        const newIndex = items.indexOf(over.id as number);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="flex justify-center p-10 bg-slate-50 min-h-screen">
      <div className="w-full max-w-md flex flex-col gap-3">
        <h2 className="text-xl font-bold mb-4 text-slate-800">
          Vertical List Test (Flicker Free)
        </h2>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]} // Restrict to Y axis
        >
          <SortableContext
            items={items}
            strategy={verticalListSortingStrategy} // Use list strategy
          >
            {items.map((id) => (
              <SortableItem key={id} id={id} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

// --- The Sortable Item ---
interface ItemProps {
  id: UniqueIdentifier;
}

function SortableItem({ id }: ItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    transition: null, // 1. CRITICAL: Disable dnd-kit's CSS transition
  });

  return (
    <motion.div
      ref={setNodeRef}
      layoutId={String(id)} // 2. Helps Framer track the item across DOM changes
      className={`
        relative flex items-center justify-between p-4
        bg-white rounded-lg border border-slate-200 shadow-sm
        select-none touch-none
        ${isDragging ? "z-50 cursor-grabbing shadow-xl ring-2 ring-blue-500/20" : "cursor-grab hover:border-blue-300"}
      `}
      // 3. Drive the Transform via Motion's animate prop
      animate={
        transform
          ? {
              x: transform.x,
              y: transform.y,
              scale: isDragging ? 1.05 : 1,
              zIndex: isDragging ? 50 : 0,
            }
          : {
              x: 0,
              y: 0,
              scale: 1,
              zIndex: 0,
            }
      }
      // 4. Instant update on drag, smooth update on drop/sort
      transition={{
        duration: isDragging ? 0 : 0.25,
        ease: "easeInOut",
        scale: {
          duration: 0.25,
        },
        zIndex: {
          delay: isDragging ? 0 : 0.25,
        },
      }}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
          {id}
        </div>
        <span className="font-medium text-slate-700">Block Item {id}</span>
      </div>
      <div className="text-slate-300">:::</div>
    </motion.div>
  );
}
