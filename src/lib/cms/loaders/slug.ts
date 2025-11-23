import { DrizzleDB } from "@/core/db/drizzle";
import { pageBlocks, blocks } from "@/core/db/schema";
import { eq } from "drizzle-orm";
import { Block } from "../blocks/block-registry.types";

export async function loadPageData(
  db: DrizzleDB,
  options: { slug: string; requirePublished: boolean },
) {
  // 1. Load page metadata
  const page = await db.query.pages.findFirst({
    where: (p, { eq }) => eq(p.slug, options.slug),
  });

  if (!page || (options.requirePublished && page.status !== "published")) {
    return null;
  }

  // 2. Load blocks for this page, ordered
  const rows = await db
    .select({
      blockId: pageBlocks.blockId,
      order: pageBlocks.order,
      block: {
        id: blocks.id,
        type: blocks.type,
        data: blocks.data,
      },
    })
    .from(pageBlocks)
    .innerJoin(blocks, eq(pageBlocks.blockId, blocks.id))
    .where(eq(pageBlocks.pageId, page.id))
    .orderBy(pageBlocks.order);

  const blocksData = rows.map((row) => row.block);

  const pageWithBlocks = {
    ...page,
    blocks: blocksData as Block[],
  };

  return pageWithBlocks;
}
