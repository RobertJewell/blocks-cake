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
          <CommandInput placeholder="Type a command or search..." />
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

export function SidebarBlockPreview({ type }: { type: BlockType }) {
  const def = registry[type];
  const Skeleton = def?.skeleton;

  return (
    <div className="border relative rounded-lg overflow-hidden bg-background shadow-sm hover:border-primary/50 hover:shadow-md transition-all group w-full">
      <div className="absolute top-0 left-0 w-full z-20 flex justify-center pointer-events-none">
        <span className="text-[0.5rem] uppercase tracking-wider font-bold bg-gray-100/90 px-3 py-1 rounded-b-md border border-t-0 text-gray-500 select-none">
          {type}
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
  );
}
