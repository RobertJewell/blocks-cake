// DO NOT DELETE THIS FILE!!!
// This file is a good smoke test to make sure the custom server entry is working
import handler from "@tanstack/react-start/server-entry";
import { processImageOptimisation } from "@/cms/lib/data-ops/assets/optimise-images.server";
import { processScreenshot } from "@/cms/lib/data-ops/assets/process-screenshot.server";

console.log("[server-entry]: using custom server entry in 'src/server.ts'");

export default {
  fetch: handler.fetch,
  async queue(
    batch:
      | MessageBatch<{ keys: string[] }>
      | MessageBatch<{
          pageId: string;
          pageUrl: string;
          timestamp: number;
        }>,
    env: Env,
    ctx: ExecutionContext,
  ) {
    for (const message of batch.messages) {
      const body = message.body as any;

      // Image optimization queue
      if ("keys" in body) {
        const { keys } = body;
        ctx.waitUntil(
          Promise.all(
            keys.map(async (key: string) => {
              try {
                await processImageOptimisation(key, env);
              } catch (err) {
                console.error("Optimization failed for " + key + ":", err);
              }
            }),
          ),
        );
      }
      // Screenshot queue
      else if ("pageId" in body && "pageUrl" in body) {
        const { pageId, pageUrl } = body;
        ctx.waitUntil(
          (async () => {
            try {
              await processScreenshot(pageId, pageUrl, env);
            } catch (err) {
              console.error("Screenshot failed for " + pageId + ":", err);
            }
          })(),
        );
      }

      message.ack();
    }
  },
};
