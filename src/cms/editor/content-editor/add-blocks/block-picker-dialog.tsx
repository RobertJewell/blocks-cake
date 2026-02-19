import { registry } from "@/cms/blocks/block-registry";
import { BlockType } from "@/cms/blocks/block-registry.types";
import {
  Command,
  CommandDialog,
  CommandDialogPopup,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/cms/ui/command";
import { useDraggable } from "@dnd-kit/core";

interface BlockPickerDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect: (type: BlockType) => void;
}

const registryItems = Object.entries(registry).map(([key, value]) => ({
  label: value.name,
  value: key,
}));

function DraggablePickerItem({
  value,
  label,
  onClick,
}: {
  value: BlockType;
  label: string;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `picker-new-${value}`,
    data: { type: "sidebar-block", blockType: value },
  });

  return (
    <CommandItem
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      value={value}
      className={isDragging ? "opacity-50" : ""}
    >
      {label}
    </CommandItem>
  );
}

export function BlockPickerDialog({
  open,
  setOpen,
  onSelect,
}: BlockPickerDialogProps) {
  const handleSelect = (blockType: BlockType) => {
    onSelect(blockType);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandDialogPopup>
        <Command items={registryItems}>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandList>
            {(item) => (
              <DraggablePickerItem
                key={item.value}
                value={item.value}
                label={item.label}
                onClick={() => handleSelect(item.value)}
              />
            )}
          </CommandList>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  );
}
