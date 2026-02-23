import { createServerFn } from "@tanstack/react-start";
import { drizzleFunctionMiddleware } from "@/cms/lib/core/middleware/db/drizzle-function-middleware";
import { assets } from "@/cms/lib/core/db/schema";
import { eq } from "drizzle-orm";
import z from "zod";

export const getAssetById = createServerFn({ method: "GET" })
  .middleware([drizzleFunctionMiddleware])
  .inputValidator(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ context, data }) => {
    const asset = await context.db.query.assets.findFirst({
      where: eq(assets.id, data.id),
    });

    if (!asset) {
      throw new Error("Asset not found");
    }

    return asset;
  });
