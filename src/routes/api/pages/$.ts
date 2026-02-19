import { eq, inArray, sql } from "drizzle-orm";
import { json } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { drizzleMiddleware } from "@/cms/lib/core/middleware/db";
import { authRequestMiddleware } from "@/cms/lib/core/middleware/auth";
import {
  pages,
  blocks,
  pageBlocks,
  assetUsages,
} from "@/cms/lib/core/db/schema";
import { processBlocksForSave } from "@/cms/lib/data-ops/save-helpers";
import { loadPageData } from "@/cms/lib/data-ops/loadPageData";
import { isValidSlugPath } from "@/cms/lib/helpers/slugs";
import { env } from "cloudflare:workers";

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

        // Auth check
        const session = await auth.api.getSession(request);
        if (!session?.user)
          return new Response("Unauthorized", { status: 401 });
        if (!slug || !isValidSlugPath(slug))
          return new Response("Invalid slug", { status: 400 });

        const body = (await request.json()) as {
          title?: string;
          status?: "draft" | "published";
          blocks: any[];
        };

        // Grab Page ID
        const existingPage = await db.query.pages.findFirst({
          where: eq(pages.slug, slug),
          columns: { id: true },
        });

        if (!existingPage) {
          return new Response("Page not found", { status: 404 });
        }

        // Process Blocks (Dehydrate & Validate)
        const { validBlocks, usageRecords, blockIdsToDeleteUsagesFor } =
          processBlocksForSave(body.blocks);

        const batchStatements: any[] = [];

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

        // Clean up operations
        // Unlink blocks from this page
        batchStatements.push(
          db.delete(pageBlocks).where(eq(pageBlocks.pageId, existingPage.id)),
        );

        if (blockIdsToDeleteUsagesFor.length > 0) {
          batchStatements.push(
            db
              .delete(assetUsages)
              .where(inArray(assetUsages.blockId, blockIdsToDeleteUsagesFor)),
          );
        }

        if (validBlocks.length > 0) {
          const newLinks = validBlocks.map((b, index) => ({
            pageId: existingPage.id,
            blockId: b.id,
            order: index,
          }));

          batchStatements.push(db.insert(pageBlocks).values(newLinks));
        }

        if (usageRecords.length > 0) {
          batchStatements.push(db.insert(assetUsages).values(usageRecords));
        }

        if (batchStatements.length > 0) {
          await db.batch(batchStatements as [any, ...any[]]);
        }

        // Queue Screenshot Generation
        // Build the page URL for screenshot using env SITE_URL
        const pageslug = slug === "index" ? "" : `/${slug}`;
        const pageUrl = `${env.SITE_URL}/${pageslug}`;

        // Queue the screenshot processing (same screenshot per page, overwrites on updates)
        try {
          await env.blocks_capture_screenshot.send({
            pageId: existingPage.id,
            pageUrl,
            timestamp: Date.now(),
          });
          console.log(`Screenshot queued for page ${slug}`);
        } catch (err) {
          console.error(`Failed to queue screenshot for ${slug}:`, err);
          // Don't fail the page save if screenshot queueing fails
        }

        return json({ ok: true });
      },
    },
  },
});
