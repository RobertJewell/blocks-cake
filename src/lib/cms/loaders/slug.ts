import { DrizzleDB } from "@/core/db/drizzle";
import { pageBlocks, blocks } from "@/core/db/schema";
import { eq } from "drizzle-orm";

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

  // 3. Transform into front-end PageData format
  const blocksData = rows.map((row) => ({
    id: row.block.id,
    type: row.block.type,
    props: row.block.data.props, // includes props or other fields inside data JSON
  }));

  const result = {
    blocks: blocksData,
  };

  console.log(result);

  return result;
}
