import { createMiddleware } from "@tanstack/react-start";
import { getDB } from "../../db/drizzle";

export const drizzleFunctionMiddleware = createMiddleware({
  type: "function",
}).server(async ({ context, next }) => {
  const db = getDB(context.database);
  return next({
    context: {
      ...context,
      db,
    },
  });
});
