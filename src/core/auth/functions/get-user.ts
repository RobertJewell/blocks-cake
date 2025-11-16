import { authFunctionMiddleware } from "@/core/middleware/auth/auth-function-middleware";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export const getUser = createServerFn({ method: "GET" })
  .middleware([authFunctionMiddleware])
  .handler(async ({ context }) => {
    const session = await context.auth.api.getSession({
      headers: getRequest().headers,
    });

    return session?.user || null;
  });
