import { createFileRoute } from "@tanstack/react-router";
import { loadPageData } from "@/lib/cms/loaders/slug";
import { isValidSlugPath } from "@/lib/utils";
import { drizzleMiddleware } from "@/core/middleware/db-middleware";
import { PageData } from "@/lib/cms/blocks/block-registry.types";
import { eq } from "drizzle-orm";
import { json } from "@tanstack/react-start";
import { pages } from "@/core/db/schema";
import { authRequestMiddleware } from "@/core/middleware/auth/auth-request-middleware";

export const Route = createFileRoute("/api/pages/$/slug")({
  server: {
    middleware: [drizzleMiddleware, authRequestMiddleware],
    handlers: {
      GET: async ({ params, context }) => {
        const slug = params._splat;
        if (!slug || !isValidSlugPath(slug)) {
          return new Response("Not Found", { status: 404 });
        }

        const data = await loadPageData(context.db, {
          slug,
          requirePublished: false,
        });

        console.log({ data });

        if (!data) {
          return new Response("Not Found", { status: 404 });
        }

        return Response.json(data);
      },
      POST: async ({ request, params, context }) => {
        const { auth, db } = context;

        const session = await auth.api.getSession(request);
        if (!session?.user) {
          return new Response("Unauthorized", { status: 401 });
        }

        // 2. Validate `_splat`
        const slug = params._splat;
        if (!slug || typeof slug !== "string") {
          return new Response("Missing slug", { status: 400 });
        }
        const body = (await request.json()) as {
          data: PageData;
          status?: string;
        };

        await db
          .update(pages)
          .set({
            data: body.data,
            status: body.status ?? "draft",
            updatedAt: new Date(),
          })
          .where(eq(pages.slug, params._splat!));

        return json({ ok: true });
      },
    },
  },
});
