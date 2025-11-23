import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { registry } from "../../blocks/block-registry";
import { Block } from "../../blocks/block-registry.types";

interface BlockItemProps {
  block: Block;
  onSelect: () => void;
}
export const BlockItem = ({ block, onSelect }: BlockItemProps) => {
  const def = registry[block.type as keyof typeof registry];
  const Skeleton = def?.skeleton;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    position: "relative" as const,
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onSelect}
      className={cn(
        "group relative outline-none touch-none",
        isDragging ? "cursor-grabbing z-50" : "cursor-grab",
      )}
    >
      <div
        className={cn(
          "bg-muted w-full relative overflow-hidden border rounded-lg transition-all duration-200",
          isDragging
            ? "shadow-2xl ring-2 ring-primary/20 bg-card scale-[1.02]"
            : "hover:border-primary/50 bg-background",
        )}
      >
        <div className="absolute top-0 left-0 w-full z-20 flex justify-center pointer-events-none">
          <span className="text-[0.5rem] uppercase tracking-wider font-bold bg-gray-100/90 px-3 py-1 rounded-b-md border border-t-0 text-gray-500 select-none">
            {block.type}
          </span>
        </div>

        <div className="pointer-events-none select-none">
          {Skeleton ? (
            <Skeleton />
          ) : (
            <div className="h-24 w-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
              No Preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
