import { createMiddleware } from "@tanstack/react-start";
import { getDB } from "../../db/drizzle";
import { env } from "cloudflare:workers";

export const drizzleFunctionMiddleware = createMiddleware({
  type: "function",
}).server(async ({ context, next }) => {
  const db = getDB(env.database);
  return next({
    context: {
      ...context,
      db,
    },
  });
});
