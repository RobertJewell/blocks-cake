import { createMiddleware } from "@tanstack/react-start";
import { createAuthInstance } from "./auth";

export const authFunctionMiddleware = createMiddleware({
  type: "function",
}).server(async ({ context, next }) => {
  const auth = createAuthInstance();

  return next({
    context: {
      ...context,
      auth,
    },
  });
});
