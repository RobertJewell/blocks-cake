import { getDb } from "~/lib/db";
import { PageData } from "../blocks/block-registry.types";

export async function loadPageData(slug: string, requirePublished = true) {
  const db = await getDb();
  const row = await db.query.pages.findFirst({
    where: (p, { eq }) => eq(p.slug, slug),
  });

  if (!row || (requirePublished && row.status !== "published")) {
    return null;
  }

  const data = row.data;
  return data && Array.isArray(data.blocks) ? (data as PageData) : null;
}
