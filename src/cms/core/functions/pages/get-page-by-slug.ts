import { loadPageData } from "@/cms/lib/data-ops/slug";
import { isValidSlugPath } from "@/cms/lib/helpers/slugs";
import { createServerFn } from "@tanstack/react-start";
import { drizzleMiddleware } from "../../middleware/db/db-middleware";

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
