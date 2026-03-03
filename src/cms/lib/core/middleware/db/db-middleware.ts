import { createMiddleware } from "@tanstack/react-start";
import { getDB } from "../../db/drizzle";

export const drizzleMiddleware = createMiddleware().server(
  async ({ context, next }) => {
    const db = getDB(context.database);
    return await next({ context: { ...context, db } });
  },
);
