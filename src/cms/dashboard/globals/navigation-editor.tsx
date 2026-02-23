import { navigationFloatingSimpleConfig } from "@/cms/blocks/navigation/navigation-floating-simple/navigation-floating-simple-config";
import { FormRenderer } from "@/cms/editor/renderers";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

interface NavigationEditorProps extends ComponentProps<"div"> {}

export function NavigationEditor({ className }: NavigationEditorProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <h3 className="font-semibold">Navigation</h3>
      <FormRenderer fields={navigationFloatingSimpleConfig} />
    </div>
  );
}
