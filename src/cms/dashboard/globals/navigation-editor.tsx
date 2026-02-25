import { navigationFloatingSimpleConfig } from "@/cms/blocks/navigation/navigation-config";
import { FormRenderer } from "@/cms/editor/renderers";
import { fetchGlobal, saveGlobal } from "@/cms/lib/core/functions/globals";
import { Button } from "@/cms/ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ComponentProps } from "react";
import { toast } from "sonner";

interface NavigationEditorProps extends ComponentProps<"div"> {}

export function NavigationEditor({ className }: NavigationEditorProps) {
  const queryClient = useQueryClient();

  // Fetch navigation global
  const { data: navigationData } = useQuery({
    queryKey: ["navigation-global"],
    queryFn: () => fetchGlobal({ data: { key: "system-navigation" } }),
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return saveGlobal({
        data: {
          key: "system-navigation",
          type: "system-navigation",
          value: data,
          scope: "global",
        },
      });
    },
    onSuccess: () => {
      // Invalidate the navigation query to refresh the cache
      queryClient.invalidateQueries({ queryKey: ["navigation-global"] });
      toast.success("Navigation saved successfully");
    },
    onError: (error) => {
      toast.error(`Failed to save navigation: ${error.message}`);
    },
  });

  if (!navigationData) return null;

  if (navigationData && navigationData.type === "system-navigation")
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        <h3 className="font-semibold">Navigation</h3>
        <FormRenderer
          fields={navigationFloatingSimpleConfig}
          onSubmit={(data) => mutation.mutate(data)}
          defaultValues={navigationData?.value}
        >
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </FormRenderer>
      </div>
    );
}
