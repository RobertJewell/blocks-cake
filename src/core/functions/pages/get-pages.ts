import { createServerFn } from "@tanstack/react-start";
import { drizzleMiddleware } from "@/core/middleware/db/db-middleware";
import { pages } from "@/core/db/schema";

export const getPages = createServerFn({ method: "GET" })
  .middleware([drizzleMiddleware])
  // .inputValidator((slug: string) => slug)

  .handler(async ({ context }) => {
    const { db } = context;

    const data = await db.select().from(pages).all();

    return data;
  });
