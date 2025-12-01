import { eq, inArray, sql } from "drizzle-orm";
import { json } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { drizzleMiddleware } from "@/cms/core/middleware/db";
import { authRequestMiddleware } from "@/cms/core/middleware/auth";
import { pages, blocks, pageBlocks, assetUsages } from "@/cms/core/db/schema";
import { processBlocksForSave } from "@/cms/lib/data-ops/save-helpers";
import { loadPageData } from "@/cms/lib/data-ops/slug";
import { isValidSlugPath } from "@/cms/lib/helpers/slugs";

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

        // 1. Auth & Validation
        const session = await auth.api.getSession(request);
        if (!session?.user)
          return new Response("Unauthorized", { status: 401 });
        if (!slug || !isValidSlugPath(slug))
          return new Response("Invalid slug", { status: 400 });

        // 2. Parse Body
        const body = (await request.json()) as {
          title?: string;
          status?: "draft" | "published";
          blocks: any[];
        };

        // 3. Find Page ID
        const existingPage = await db.query.pages.findFirst({
          where: eq(pages.slug, slug),
          columns: { id: true },
        });

        if (!existingPage) {
          return new Response("Page not found", { status: 404 });
        }

        // 4. Process Blocks (Dehydrate & Validate)
        // This helper handles all the logic we moved out
        const { validBlocks, usageRecords, blockIdsToDeleteUsagesFor } =
          processBlocksForSave(body.blocks);

        // 5. Prepare Database Batch
        const batchStatements: any[] = [];

        // A. Update Page Metadata
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

        // B. Upsert Blocks
        if (validBlocks.length > 0) {
          batchStatements.push(
            db
              .insert(blocks)
              .values(validBlocks)
              .onConflictDoUpdate({
                target: blocks.id,
                set: {
                  data: sql`excluded.data`,
                  updatedAt: sql`excluded.updated_at`,
                },
              }),
          );
        }

        // C. Clean up Old Links
        // 1. Unlink blocks from this page
        batchStatements.push(
          db.delete(pageBlocks).where(eq(pageBlocks.pageId, existingPage.id)),
        );

        // 2. Clear old asset usages for the blocks we are touching
        if (blockIdsToDeleteUsagesFor.length > 0) {
          batchStatements.push(
            db
              .delete(assetUsages)
              .where(inArray(assetUsages.blockId, blockIdsToDeleteUsagesFor)),
          );
        }

        // D. Insert New Page Links (Restore Order)
        if (validBlocks.length > 0) {
          const newLinks = validBlocks.map((b, index) => ({
            pageId: existingPage.id,
            blockId: b.id,
            order: index,
          }));

          batchStatements.push(db.insert(pageBlocks).values(newLinks));
        }

        // E. Insert New Asset Usages
        if (usageRecords.length > 0) {
          batchStatements.push(db.insert(assetUsages).values(usageRecords));
        }

        // 6. Execute Transaction
        if (batchStatements.length > 0) {
          await db.batch(batchStatements as [any, ...any[]]);
        }

        return json({ ok: true });
      },
    },
  },
});
