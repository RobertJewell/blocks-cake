import { screenshots } from "@/cms/lib/core/db/schema";
import { eq } from "drizzle-orm";
import { getDB } from "@/cms/lib/core/db/drizzle";

const SCREENSHOT_WIDTH = 1280;
const SCREENSHOT_HEIGHT = 720;

export async function processScreenshot(
  pageId: string,
  pageUrl: string,
  env: Env,
) {
  const db = getDB(env.database);

  try {
    // Call Cloudflare Browser Rendering API
    const browserRenderingUrl = `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/browser-rendering/screenshot`;

    const response = await fetch(browserRenderingUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CLOUDFLARE_BROWSER_RENDERING_TOKEN}`,
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
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `Browser Rendering API failed: ${response.status} ${error}`,
      );
    }

    const screenshotBuffer = await response.arrayBuffer();

    // Use timestamp in filename to bypass browser cache
    const timestamp = Date.now();
    const newStoragePath = `screenshots/${pageId}/${timestamp}.png`;

    // Store in R2
    await env.blocks_cakes_assets.put(newStoragePath, screenshotBuffer, {
      httpMetadata: { contentType: "image/png" },
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
      })
      .onConflictDoUpdate({
        target: screenshots.pageId,
        set: {
          status: "completed",
          storagePath: newStoragePath,
          width: SCREENSHOT_WIDTH,
          height: SCREENSHOT_HEIGHT,
          updatedAt: new Date(),
        },
      });

    // Delete old screenshot from R2 if it exists
    if (oldScreenshot?.storagePath) {
      try {
        await env.blocks_cakes_assets.delete(oldScreenshot.storagePath);
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
