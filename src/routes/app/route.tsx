import { authQueryOptions } from "@/cms/lib/core/auth/queries";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: Outlet,
  beforeLoad: async ({ context }) => {
    try {
      const user = await context.queryClient.ensureQueryData({
        ...authQueryOptions(),
        revalidateIfStale: true,
      });

      return { user };
    } catch (err) {
      return { user: null };
    }
  },
});
