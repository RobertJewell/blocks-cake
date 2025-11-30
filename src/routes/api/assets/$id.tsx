import { assets } from "@/core/db/schema";
import { drizzleMiddleware } from "@/core/middleware/db-middleware";
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

        // Helper to construct the full URL
        const baseUrl = "https://pub-39814712f705425ebdcd406e6d0a9361.r2.dev";

        // Use the variant key if available, otherwise fallback
        // The ? operator handles null/undefined safely
        const key = asset.variants?.original?.key || asset.filename;
        const publicUrl = `${baseUrl}/${key}`;

        const responseData = {
          ...asset,
          publicUrl,
        };

        return new Response(JSON.stringify(responseData), {
          headers: {
            "Content-Type": "application/json",
          },
          status: 200,
        });
      },
    },
  },
});
