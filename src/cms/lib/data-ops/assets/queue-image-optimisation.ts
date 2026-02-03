import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { authFunctionMiddleware } from "../../../core/middleware/auth";
import z from "zod";

export const queueImageOptimisation = createServerFn()
  .middleware([authFunctionMiddleware])
  .inputValidator(
    z.object({
      keys: z.array(z.string()),
    }),
  )
  .handler(async ({ context, data }) => {
    const request = getRequest();
    const session = await context.auth.api.getSession({
      headers: request.headers,
    });
    if (!session) throw new Error("Not authenticated");

    console.log(`Queueing ${data.keys.length} assets for optimization...`);

    data.keys.forEach((key) => {
      console.log("Adding to queue:", key);
    });

    return {
      success: true,
      count: data.keys.length,
    };
  });
