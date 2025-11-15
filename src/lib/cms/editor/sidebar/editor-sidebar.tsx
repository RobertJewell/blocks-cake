"use client";

import { Separator } from "~/components/ui/separator";
import { Sidebar, SidebarContent, SidebarHeader } from "~/components/ui/sidebar";
import { useEditorStore } from "~/lib/cms/stores/editor-store";
import { FormRenderer } from "../form-renderer";

export function EditorSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const selectedId = useEditorStore((s) => s.selectedBlockId);
  const page = useEditorStore((s) => s.page);
  const updateBlock = useEditorStore((s) => s.updateBlock);

  const block = page?.blocks.find((b) => b.id === selectedId);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <h2 className="text-sm font-semibold">Block Editor</h2>
      </SidebarHeader>

      <Separator />

      <SidebarContent className="overflow-y-auto px-1 py-4">
        {!block ? (
          <p className="text-muted-foreground text-sm">
            Select a block to edit its settings.
          </p>
        ) : (
          <FormRenderer
            key={block?.id}
            block={block}
            onChange={(patch) => updateBlock(block.id, block.type, patch)}
          />
        )}
      </SidebarContent>
    </Sidebar>
  );
}
