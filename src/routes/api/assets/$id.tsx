import { assets } from "@/cms/core/db/schema";
import { drizzleMiddleware } from "@/cms/core/middleware/db";
import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/assets/$id")({
  server: {
    middleware: [drizzleMiddleware],
    handlers: {
      GET: async ({ params, context }) => {
        const { id } = params;

        const asset = await context.db.query.assets.findFirst({
          where: eq(assets.id, id),
        });

        if (!asset) {
          return new Response("Not found", { status: 404 });
        }

        return new Response(JSON.stringify(asset), {
          headers: {
            "Content-Type": "application/json",
          },
          status: 200,
        });
      },
    },
  },
});
