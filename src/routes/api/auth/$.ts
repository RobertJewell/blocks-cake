import { authRequestMiddleware } from "@/cms/core/middleware/auth";
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
