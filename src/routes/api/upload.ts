import { createFileRoute } from "@tanstack/react-router";
import {
  handleRequest,
  RejectUpload,
  route,
  type Router,
} from "@better-upload/server";
import { cloudflare } from "@better-upload/server/clients";
import { env } from "cloudflare:workers";
import { uuidv7 } from "uuidv7";
import { drizzleMiddleware } from "@/cms/core/middleware/db";
import { authRequestMiddleware } from "@/cms/core/middleware/auth";
import { assets } from "@/cms/core/db/schema";

export const Route = createFileRoute("/api/upload")({
  server: {
    middleware: [drizzleMiddleware, authRequestMiddleware],
    handlers: {
      POST: async ({ request, context }) => {
        const router: Router = {
          client: cloudflare({
            accountId: env.CLOUDFLARE_ACCOUNT_ID,
            accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
            secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
          }),
          bucketName: "blocks-cakes-assets",
          routes: {
            images: route({
              fileTypes: ["image/*"],
              multipleFiles: true,
              maxFiles: 4,

              onBeforeUpload: async ({ req, files }) => {
                // 1. Auth Check
                const session = await context.auth.api.getSession({
                  headers: req.headers,
                });
                if (!session) throw new RejectUpload("Unauthorized");

                // 2. Prepare Mapping
                // Map filename -> UUIDv7
                const fileIdMap = new Map<string, string>();

                const newAssets = files.map((file) => {
                  // Generate standard time-sortable UUID
                  const id = uuidv7();

                  // Map it (lowercase to ensure consistency)
                  fileIdMap.set(file.name.toLowerCase(), id);

                  // The R2 Key is now EXACTLY the UUID.
                  // This is clean, short, and hides the original filename from the public URL.
                  const key = id;

                  return {
                    id: id,
                    filename: file.name,
                    mimeType: file.type,
                    size: file.size || 0,
                    isOptimized: false,
                    variants: {
                      original: {
                        key: key,
                        width: 0,
                        height: 0,
                        size: file.size || 0,
                      },
                    },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  };
                });

                // 3. Batch Insert
                if (newAssets.length > 0) {
                  await context.db.insert(assets).values(newAssets);
                }

                // 4. Return Key Configuration
                return {
                  generateObjectInfo: ({ file }) => {
                    const id = fileIdMap.get(file.name.toLowerCase());
                    if (!id) throw new Error("ID generation mismatch");

                    return {
                      key: id, // R2 Key = UUIDv7
                      metadata: {
                        dbId: id,
                        originalName: file.name,
                      },
                    };
                  },
                };
              },
            }),
          },
        };

        return handleRequest(request, router);
      },
    },
  },
});
