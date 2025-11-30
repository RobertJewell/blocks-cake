import { createFileRoute } from "@tanstack/react-router";
import {
  handleRequest,
  RejectUpload,
  route,
  type Router,
} from "@better-upload/server";
import { cloudflare } from "@better-upload/server/clients";
import { authRequestMiddleware } from "@/core/middleware/auth/auth-request-middleware";
import { env } from "cloudflare:workers";

export const Route = createFileRoute("/api/upload")({
  server: {
    middleware: [authRequestMiddleware],
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
              onBeforeUpload: async ({ req, files, clientMetadata }) => {
                // auth check
                const session = await context.auth.api.getSession({
                  headers: req.headers,
                });
                if (!session) throw new RejectUpload("Unauthorized");
              },
              fileTypes: ["image/*"],
              multipleFiles: true,
              maxFiles: 4,
            }),
          },
        };

        return handleRequest(request, router);
      },
    },
  },
});
