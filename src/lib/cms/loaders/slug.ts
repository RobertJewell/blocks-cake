import { DrizzleDB } from "@/core/db/drizzle";
import { PageData } from "../blocks/block-registry.types";

export async function loadPageData(
  db: DrizzleDB,
  options: { slug: string; requirePublished: boolean },
) {
  const row = await db.query.pages.findFirst({
    where: (p, { eq }) => eq(p.slug, options.slug),
  });

  if (!row || (options.requirePublished && row.status !== "published")) {
    return null;
  }

  const data = row.data;
  return data && Array.isArray(data.blocks) ? (data as PageData) : null;
}
