import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageData } from "../../blocks/block-registry.types";

async function savePage(
  slug: string,
  data: PageData,
  status: string = "draft",
) {
  // This matches the server-side Zod schema: { blocks: [], status: "" }
  const payload = { ...data, status };

  const res = await fetch(`/api/pages/${slug}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to save page");
  }

  return res.json() as Promise<{ ok: boolean; page?: PageData }>;
}

export function useSavePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      slug,
      data,
      status,
    }: {
      slug: string;
      data: PageData;
      status?: string;
    }) => savePage(slug, data, status),
    onSuccess: (res, variables) => {
      // Update the cache immediately if the server returns the fresh page
      if (res.page) {
        queryClient.setQueryData(["page", variables.slug], res.page);
      }

      // Also invalidate to ensure we are perfectly synced
      queryClient.invalidateQueries({ queryKey: ["page", variables.slug] });
    },
  });
}
