import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { pages } from "@/cms/lib/core/db/schema";
import { drizzleMiddleware } from "@/cms/lib/core/middleware/db";
import { authRequestMiddleware } from "@/cms/lib/core/middleware/auth";

const createPageSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9_-]+$/,
      "Slug can only contain lowercase letters, numbers, hyphens, and underscores",
    ),
  status: z.enum(["draft", "published"]),
});

export const createPage = createServerFn({ method: "POST" })
  .middleware([drizzleMiddleware, authRequestMiddleware])
  .inputValidator((data) => createPageSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { db, request, auth } = context;

    // Auth check
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // Check if slug already exists
    const existing = await db.query.pages.findFirst({
      where: (fields, { eq }) => eq(fields.slug, data.slug),
      columns: { id: true },
    });

    if (existing) {
      throw new Error(`Slug "${data.slug}" already exists`);
    }

    // Create page
    const pageId = `p_${data.slug}`;

    await db.insert(pages).values({
      id: pageId,
      slug: data.slug,
      title: data.title,
      status: data.status,
    });

    return { id: pageId, slug: data.slug };
  });
