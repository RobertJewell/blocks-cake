import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/(authenticated)")({
  component: Outlet,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/app/login" });
    }
  },
});
