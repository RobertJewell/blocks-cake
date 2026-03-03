import { createFileRoute } from "@tanstack/react-router";
import {
  handleRequest,
  RejectUpload,
  route,
  type Router,
} from "@better-upload/server";
import { cloudflare } from "@better-upload/server/clients";
import { uuidv7 } from "uuidv7";
import { drizzleMiddleware } from "@/cms/lib/core/middleware/db";
import { assets } from "@/cms/lib/core/db/schema";
import { authRequestMiddleware } from "@/cms/lib/core/middleware/auth/auth-request-middleware";

export const Route = createFileRoute("/api/assets/upload")({
  server: {
    middleware: [drizzleMiddleware, authRequestMiddleware],
    handlers: {
      POST: async ({ request, context }) => {
        const router: Router = {
          client: cloudflare({
            accountId: context.processing.cloudflareAccountId,
            accessKeyId: context.storage.accessKeyId,
            secretAccessKey: context.storage.secretAccessKey,
          }),
          bucketName: "blocks-cakes-assets",
          routes: {
            images: route({
              fileTypes: ["image/*"],
              multipleFiles: true,
              maxFiles: 4,

              onBeforeUpload: async ({ req, files }) => {
                // Auth Check
                const session = await context.auth.api.getSession({
                  headers: req.headers,
                });
                if (!session) throw new RejectUpload("Unauthorized");

                //  Prepare Mapping
                // Map filename -> UUIDv7
                const fileIdMap = new Map<string, string>();

                const newAssets = files.map((file) => {
                  // Generate standard time-sortable UUID
                  const id = uuidv7();
                  fileIdMap.set(file.name.toLowerCase(), id);
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

                // Batch Insert
                if (newAssets.length > 0) {
                  await context.db.insert(assets).values(newAssets);
                }

                // Return Key Configuration
                return {
                  generateObjectInfo: ({ file }) => {
                    const id = fileIdMap.get(file.name.toLowerCase());
                    if (!id) throw new Error("ID generation mismatch");

                    return {
                      key: id,
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
