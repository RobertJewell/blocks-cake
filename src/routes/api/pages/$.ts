import { drizzleMiddleware } from "@/core/middleware/db-middleware";
import { authRequestMiddleware } from "@/core/middleware/auth/auth-request-middleware";
import { pages, blocks, pageBlocks } from "@/core/db/schema";
import { eq, sql } from "drizzle-orm";
import { json } from "@tanstack/react-start";
import { isValidSlugPath } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { loadPageData } from "@/lib/cms/loaders/slug";
import { PageData, Block } from "@/lib/cms/blocks/block-registry.types";
import { registry } from "@/lib/cms/blocks/block-registry";

type UpdatePagePayload = PageData;

export const Route = createFileRoute("/api/pages/$")({
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

        if (!data) {
          return new Response("Not Found", { status: 404 });
        }

        return Response.json(data);
      },

      POST: async ({ request, params, context }) => {
        const { auth, db } = context;
        const slug = params._splat;

        // Auth & Validation
        const session = await auth.api.getSession(request);
        if (!session?.user)
          return new Response("Unauthorized", { status: 401 });
        if (!slug || !isValidSlugPath(slug))
          return new Response("Invalid slug", { status: 400 });

        const body = (await request.json()) as UpdatePagePayload;

        // PRE-FETCH: We need the Page ID
        const existingPage = await db.query.pages.findFirst({
          where: eq(pages.slug, slug),
          columns: { id: true },
        });

        if (!existingPage) {
          return new Response("Page not found", { status: 404 });
        }

        // PREPARE BATCH
        const batchStatements: any[] = [];

        // Update Page Metadata
        batchStatements.push(
          db
            .update(pages)
            .set({
              title: body.title,
              status: body.status ?? "draft",
              updatedAt: new Date(),
            })
            .where(eq(pages.id, existingPage.id)),
        );

        // Upsert Blocks (With Zod Validation)
        if (body.blocks.length > 0) {
          const blockValues = body.blocks.map((b) => {
            // 1. Get the definition for this block type
            const blockDef = registry[b.type];

            if (!blockDef) {
              throw new Error(`Unknown block type: ${b.type}`);
            }

            // Validate the data payload using the block's Zod schema
            // This ensures 'b.data' matches exactly what the block expects
            const parseResult = blockDef.schema.safeParse(b.data);

            if (!parseResult.success) {
              console.error(
                `Validation failed for block ${b.id} (${b.type}):`,
                parseResult.error,
              );
              throw new Error(`Invalid data for block type: ${b.type}`);
            }

            return {
              id: b.id,
              type: b.type,
              // Safe Cast: We successfully parsed it, so we know it's valid.
              // We cast to 'unknown' then 'Block' to satisfy Drizzle's union type.
              data: parseResult.data as unknown as Block["data"],
              updatedAt: new Date(),
            };
          });

          batchStatements.push(
            db
              .insert(blocks)
              .values(blockValues)
              .onConflictDoUpdate({
                target: blocks.id,
                set: {
                  data: sql`excluded.data`,
                  updatedAt: sql`excluded.updated_at`,
                },
              }),
          );
        }

        // C. "Nuke" old links
        batchStatements.push(
          db.delete(pageBlocks).where(eq(pageBlocks.pageId, existingPage.id)),
        );

        // D. Insert new links
        if (body.blocks.length > 0) {
          const newLinks = body.blocks.map((b, index) => ({
            pageId: existingPage.id,
            blockId: b.id,
            order: index,
          }));

          batchStatements.push(db.insert(pageBlocks).values(newLinks));
        }

        // 4. EXECUTE
        if (batchStatements.length > 0) {
          await db.batch(batchStatements as [any, ...any[]]);
        }

        return json({ ok: true });
      },
    },
  },
});
