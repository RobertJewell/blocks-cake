import { authRequestMiddleware } from "@/core/middleware/auth/auth-request-middleware";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    middleware: [authRequestMiddleware],
    handlers: {
      GET: ({ request, context }) => {
        return context.auth.handler(request);
      },
      POST: ({ request, context }) => {
        return context.auth.handler(request);
      },
    },
  },
});
