import { createMiddleware } from "@tanstack/react-start";
import { createAuthInstance } from "./auth";

export const authRequestMiddleware = createMiddleware().server(
  async ({ request, context, next }) => {
    const auth = createAuthInstance();

    return next({
      context: {
        ...context,
        auth,
        request,
      },
    });
  },
);
