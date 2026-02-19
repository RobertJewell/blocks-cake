import { createFileRoute } from "@tanstack/react-router";
import { drizzleMiddleware } from "@/cms/lib/core/middleware/db";
import { authRequestMiddleware } from "@/cms/lib/core/middleware/auth";
import { pages } from "@/cms/lib/core/db/schema";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/pages/create")({
  server: {
    middleware: [drizzleMiddleware, authRequestMiddleware],
    handlers: {
      POST: async ({ request, context }) => {
        const { db, auth } = context;

        // Auth check
        const session = await auth.api.getSession(request);
        if (!session?.user) {
          return new Response(
            JSON.stringify({ message: "Unauthorized" }),
            { status: 401, headers: { "Content-Type": "application/json" } },
          );
        }

        // Parse body
        const body = (await request.json()) as {
          title: string;
          slug: string;
          status: "draft" | "published";
        };

        // Validate
        if (!body.title || !body.slug) {
          return new Response(
            JSON.stringify({ message: "Title and slug are required" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        // Check if slug already exists
        const existing = await db.query.pages.findFirst({
          where: (fields, { eq }) => eq(fields.slug, body.slug),
          columns: { id: true },
        });

        if (existing) {
          return new Response(
            JSON.stringify({ message: `Slug "${body.slug}" already exists` }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        // Create page
        const pageId = `p_${body.slug}`;

        await db.insert(pages).values({
          id: pageId,
          slug: body.slug,
          title: body.title,
          status: body.status,
        });

        return json({ id: pageId, slug: body.slug });
      },
    },
  },
});
