import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import z from "zod";
import { authFunctionMiddleware } from "@/cms/lib/core/middleware/auth/auth-function-middleware";
import { env } from "cloudflare:workers";

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

    await env.blocks_optimise_image.send({
      keys: data.keys,
      timestamp: Date.now(),
    });

    return {
      success: true,
      count: data.keys.length,
    };
  });
