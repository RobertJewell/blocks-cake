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

interface BlockPickerDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect: (type: BlockType) => void;
}

const registryItems = Object.entries(registry).map(([key, value]) => ({
  label: value.name,
  value: key,
}));

export function BlockPickerDialog({
  open,
  setOpen,
  onSelect,
}: BlockPickerDialogProps) {
  const handleSelect = (blockType: BlockType) => {
    console.log(blockType);
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
              <CommandItem
                onClick={() => handleSelect(item.value)}
                key={item.value}
                value={item.value}
              >
                {item.label}
              </CommandItem>
            )}
          </CommandList>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  );
}
