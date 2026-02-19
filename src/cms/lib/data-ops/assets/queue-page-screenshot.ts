import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import z from "zod";
import { authFunctionMiddleware } from "@/cms/lib/core/middleware/auth/auth-function-middleware";
import { env } from "cloudflare:workers";

export const queuePageScreenshot = createServerFn()
  .middleware([authFunctionMiddleware])
  .inputValidator(
    z.object({
      pageId: z.string(),
      screenshotId: z.string(),
      pageUrl: z.url(),
    }),
  )
  .handler(async ({ context, data }) => {
    const request = getRequest();
    const session = await context.auth.api.getSession({
      headers: request.headers,
    });
    if (!session) throw new Error("Not authenticated");

    await env.blocks_capture_screenshot.send({
      pageId: data.pageId,
      screenshotId: data.screenshotId,
      pageUrl: data.pageUrl,
      timestamp: Date.now(),
    });

    return {
      success: true,
      screenshotId: data.screenshotId,
    };
  });
