import { screenshots } from "@/cms/lib/core/db/schema";
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
    // Doing this via api as using the worker binding means manually doing teh playwright bits
    // Cloudlfares api handles that for us
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
    const storagePath = `screenshots/${pageId}.png`;

    // Store in R2 (overwrites existing)
    await env.blocks_cakes_assets.put(storagePath, screenshotBuffer, {
      httpMetadata: { contentType: "image/png" },
    });

    // Upsert screenshot record in DB (pageId is primary key)
    await db
      .insert(screenshots)
      .values({
        pageId,
        status: "completed",
        storagePath,
        width: SCREENSHOT_WIDTH,
        height: SCREENSHOT_HEIGHT,
      })
      .onConflictDoUpdate({
        target: screenshots.pageId,
        set: {
          status: "completed",
          storagePath,
          width: SCREENSHOT_WIDTH,
          height: SCREENSHOT_HEIGHT,
          updatedAt: new Date(),
        },
      });

    return { success: true, storagePath };
  } catch (err) {
    console.error(`❌ Screenshot failed for ${pageId}:`, err);

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
