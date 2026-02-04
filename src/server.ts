// DO NOT DELETE THIS FILE!!!
// This file is a good smoke test to make sure the custom server entry is working
import handler from "@tanstack/react-start/server-entry";
import { processImageOptimisation } from "@/cms/lib/data-ops/assets/optimise-images.server";

console.log("[server-entry]: using custom server entry in 'src/server.ts'");

export default {
  fetch: handler.fetch,
  async queue(
    batch: MessageBatch<{ keys: string[] }>,
    env: Env,
    ctx: ExecutionContext,
  ) {
    for (const message of batch.messages) {
      const { keys } = message.body;

      // Use ctx.waitUntil so the worker stays alive until all processing is done
      // but can still move on to the next message in the batch
      ctx.waitUntil(
        Promise.all(
          keys.map(async (key) => {
            try {
              await processImageOptimisation(key, env);
            } catch (err) {
              console.error(`❌ Optimization failed for ${key}:`, err);
              // We don't retry the whole batch if just one file fails,
              // but you could message.retry() if you prefer total atomicity.
            }
          }),
        ),
      );

      message.ack();
    }
  },
};
