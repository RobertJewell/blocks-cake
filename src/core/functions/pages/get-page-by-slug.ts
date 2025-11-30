import { createServerFn } from "@tanstack/react-start";
import { drizzleMiddleware } from "@/core/middleware/db/db-middleware";
import { loadPageData } from "@/lib/cms/data-ops/slug";
import { isValidSlugPath } from "@/lib/cms/utils/slugs";

export const getPageBySlug = createServerFn({ method: "GET" })
  .middleware([drizzleMiddleware])
  .inputValidator((slug: string) => slug)

  .handler(async ({ data: slug, context }) => {
    const { db } = context;

    if (!slug || !isValidSlugPath(slug)) {
      return null;
    }

    const data = await loadPageData(db, {
      slug,
      requirePublished: false,
    });

    return data;
  });
