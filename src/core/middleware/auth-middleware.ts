import { createMiddleware } from "@tanstack/react-start";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDB } from "@/core/db/drizzle";
import { env } from "cloudflare:workers";

export const authMiddleware = createMiddleware({
  type: "function",
}).server(async ({ context, next }) => {
  // Create drizzle per-request
  const db = getDB(env.blocks_cake_db);

  // Create better-auth instance per-request
  const auth = betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
  });

  return next({
    context: {
      ...context,
      db,
      auth,
    },
  });
});
