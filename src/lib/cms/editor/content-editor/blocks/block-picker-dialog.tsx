import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { registry } from "@/lib/cms/blocks/block-registry";
import { BlockType } from "@/lib/cms/blocks/block-registry.types";

interface BlockPickerDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect: (type: BlockType) => void;
}

export function BlockPickerDialog({
  open,
  setOpen,
  onSelect,
}: BlockPickerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-2 py-3 font-editor sm:max-w-[425px]">
        <DialogTitle className="sr-only">Block Library</DialogTitle>
        <DialogDescription className="sr-only">
          A filterable list of blicks that can be added to the page
        </DialogDescription>
        <Command className="w-full px-0">
          <CommandInput autoFocus={false} placeholder="Search blocks..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Blocks">
              {Object.entries(registry).map(([key, value]) => (
                <CommandItem
                  onSelect={() => onSelect(key as BlockType)}
                  key={key}
                >
                  <span>{value.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
