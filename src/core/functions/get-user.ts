import { createServerFn } from "@tanstack/react-start";

import { getRequest } from "@tanstack/react-start/server";
import { authFunctionMiddleware } from "../middleware/auth/auth-function-middleware";

export const getUser = createServerFn()
  .middleware([authFunctionMiddleware])
  .handler(async ({ context }) => {
    const request = getRequest();
    const session = await context.auth.api.getSession({
      headers: request.headers,
    });
    if (!session) throw new Error("Not authenticated");

    return session.user;
  });
