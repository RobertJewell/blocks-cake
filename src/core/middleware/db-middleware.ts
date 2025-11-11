import { createMiddleware } from "@tanstack/react-start";
import { getDB } from "../db/drizzle";
import { env } from "cloudflare:workers";

export const drizzleMiddleware = createMiddleware({
  type: "function",
}).server(async ({ context, next }) => {
  const db = getDB(env.blocks_cake_db);
  return await next({ context: { ...context, db } });
});
