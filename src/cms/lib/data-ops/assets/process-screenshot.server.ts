import { screenshots } from "@/cms/lib/core/db/schema";
import { eq } from "drizzle-orm";
import { getDB } from "@/cms/lib/core/db/drizzle";
import { encode } from "blurhash";
import type { CMSContext } from "@/cms/lib/core/context";

const SCREENSHOT_WIDTH = 1280;
const SCREENSHOT_HEIGHT = 720;

const toStream = (buffer: ArrayBuffer) => new Response(buffer).body!;

export async function processScreenshot(
  pageId: string,
  pageUrl: string,
  context: CMSContext,
) {
  const db = getDB(context.database);

  try {
    // Call Cloudflare Browser Rendering API
    const browserRenderingUrl = `https://api.cloudflare.com/client/v4/accounts/${context.processing.cloudflareAccountId}/browser-rendering/screenshot`;

    const response = await fetch(browserRenderingUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${context.processing.browserRenderingToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: pageUrl,
        screenshotOptions: {
          fullPage: false,
        },
        viewport: {
          width: SCREENSHOT_WIDTH,
          height: SCREENSHOT_HEIGHT,
        },
        gotoOptions: {
          waitUntil: "networkidle0",
          timeout: 45000,
        },
        // we can't guarentee when an animation finishes, so this fires them all immediately, in theory...
        addStyleTag: [
          {
            content: `
              * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
              }
            `,
          },
        ],
        addScriptTag: [
          {
            content: `window.SCREENSHOT_MODE = true;`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `Browser Rendering API failed: ${response.status} ${error}`,
      );
    }

    const screenshotBuffer = await response.arrayBuffer();

    // Convert PNG to WebP for better compression
    const transform = await context.processing.images.input(toStream(screenshotBuffer))
      .transform({ fit: "cover" })
      .output({ format: "image/webp", quality: 80 });

    const res = transform.response();
    const webpBuffer = await res.arrayBuffer();

    // Generate blurhash
    let blurhash: string | null = null;
    try {
      const bhWidth = 32;
      const bhHeight = 32;

      const bhTransform = await context.processing.images.input(toStream(screenshotBuffer))
        .transform({ width: bhWidth, height: bhHeight, fit: "cover" })
        .output({ format: "rgba" });

      const bhRes = bhTransform.response();
      const pixels = new Uint8ClampedArray(await bhRes.arrayBuffer());
      blurhash = encode(pixels, bhWidth, bhHeight, 4, 4);
    } catch (err) {
      console.warn("Blurhash generation skipped:", err);
    }

    // Use timestamp in filename to bypass browser cache
    const timestamp = Date.now();
    const newStoragePath = `screenshots/${pageId}/${timestamp}.webp`;

    // Store optimized WebP in R2
    await context.storage.bucket.put(newStoragePath, webpBuffer, {
      httpMetadata: { contentType: "image/webp" },
    });

    // Get the old screenshot path (if exists) to delete it
    const oldScreenshot = await db.query.screenshots.findFirst({
      where: eq(screenshots.pageId, pageId),
      columns: { storagePath: true },
    });

    // Upsert screenshot record in DB (pageId is primary key)
    await db
      .insert(screenshots)
      .values({
        pageId,
        status: "completed",
        storagePath: newStoragePath,
        width: SCREENSHOT_WIDTH,
        height: SCREENSHOT_HEIGHT,
        blurhash,
      })
      .onConflictDoUpdate({
        target: screenshots.pageId,
        set: {
          status: "completed",
          storagePath: newStoragePath,
          width: SCREENSHOT_WIDTH,
          height: SCREENSHOT_HEIGHT,
          blurhash,
          updatedAt: new Date(),
        },
      });

    // Delete old screenshot from R2 if it exists
    if (oldScreenshot?.storagePath) {
      try {
        await context.storage.bucket.delete(oldScreenshot.storagePath);
      } catch (err) {
        console.error("Failed to delete old screenshot:", err);
      }
    }

    return { success: true, storagePath: newStoragePath };
  } catch (err) {
    console.error("Screenshot failed for " + pageId + ":", err);

    const errorMessage = err instanceof Error ? err.message : String(err);

    // Upsert screenshot record with error
    await db
      .insert(screenshots)
      .values({
        pageId,
        status: "failed",
        errorMessage,
      })
      .onConflictDoUpdate({
        target: screenshots.pageId,
        set: {
          status: "failed",
          errorMessage,
          updatedAt: new Date(),
        },
      });

    throw err;
  }
}
