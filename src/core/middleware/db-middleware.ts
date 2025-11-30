import { createMiddleware } from "@tanstack/react-start";
import { getDB } from "../db/drizzle";
import { env } from "cloudflare:workers";

export const drizzleMiddleware = createMiddleware().server(
  async ({ context, next }) => {
    const db = getDB(env.database);
    return await next({ context: { ...context, db } });
  },
);
