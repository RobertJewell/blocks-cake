import { useMutation, useQueryClient } from "@tanstack/react-query";

import { PageData } from "../blocks/block-registry";

async function savePage(slug: string, data: PageData, status: string = "draft") {
  const res = await fetch(`/api/pages/${slug}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data, status }),
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
      // optional: update cache for this page immediately
      if (res.page) {
        queryClient.setQueryData(["page", variables.slug], res.page);
      }
    },
  });
}
