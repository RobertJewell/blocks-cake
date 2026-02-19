import { createServerFn } from "@tanstack/react-start";
import { drizzleMiddleware } from "../../middleware/db";

export const getPages = createServerFn({ method: "GET" })
  .middleware([drizzleMiddleware])
  .handler(async ({ context }) => {
    const { db } = context;

    const data = await db.query.pages.findMany({
      with: {
        screenshots: true,
      },
    });

    return data;
  });
