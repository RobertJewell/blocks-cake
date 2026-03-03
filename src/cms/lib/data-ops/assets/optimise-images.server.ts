import { assets } from "@/cms/lib/core/db/schema";
import { eq } from "drizzle-orm";
import { getDB } from "@/cms/lib/core/db/drizzle";
import { encode } from "blurhash";
import type { CMSContext } from "@/cms/lib/core/context";

// Configuration & Constants
export const IMAGE_RESOLUTIONS = {
  sm: 320,
  md: 768,
  lg: 1280,
  xl: 1920,
} as const;

export type ImageSizeKey = keyof typeof IMAGE_RESOLUTIONS;

// Pure/Functional Helpers
const toStream = (buffer: ArrayBuffer) => new Response(buffer).body!;

const getInfo = async (context: CMSContext, buffer: ArrayBuffer) => {
  const info = await context.processing.images.info(toStream(buffer));
  return {
    width: "width" in info ? info.width : 0,
    height: "height" in info ? info.height : 0,
  };
};

// Main Optimization Pipeline
export async function processImageOptimisation(key: string, context: CMSContext) {
  const db = getDB(context.database);

  // Fetch source
  const object = await context.storage.bucket.get(key);
  if (!object) throw new Error(`Object not found in R2: ${key}`);

  const imageBuffer = await object.arrayBuffer();

  // Generate Responsive Variants
  const generateVariants = async () => {
    const originalDim = await getInfo(context, imageBuffer);

    const variantEntries = await Promise.all(
      Object.entries(IMAGE_RESOLUTIONS).map(async ([size, width]) => {
        const variantKey = `${key}_${size.toUpperCase()}`;

        const transform = await context.processing.images.input(toStream(imageBuffer))
          .transform({ width, fit: "scale-down" })
          .output({ format: "image/webp", quality: 80 });

        const res = transform.response();
        const buffer = await res.arrayBuffer();
        const dim = await getInfo(context, buffer);

        await context.storage.bucket.put(variantKey, buffer, {
          httpMetadata: { contentType: "image/webp" },
        });

        return [size, { key: variantKey, ...dim, size: buffer.byteLength }];
      }),
    );

    return {
      original: { key, ...originalDim, size: object.size },
      ...Object.fromEntries(variantEntries),
    };
  };

  // AI Alt Text (LLaVA 1.5 7B)
  const generateAltText = async () => {
    console.log("🚀 Running AI Alt Text...");
    try {
      const output = await context.processing.ai.run("@cf/llava-hf/llava-1.5-7b-hf", {
        image: [...new Uint8Array(imageBuffer)],
        prompt: "Describe this image in one concise sentence for alt text.",
        max_tokens: 128,
      });

      // LLaVA output: { description: string }
      return (output as any).description || null;
    } catch (err) {
      console.error("❌ AI Alt Text failed:", err);
      return null;
    }
  };

  // Blurhash
  const generateBlurhash = async () => {
    console.log("🚀 Generating Blurhash...");
    try {
      const bhWidth = 32;
      const bhHeight = 32;

      const transform = await context.processing.images.input(toStream(imageBuffer))
        .transform({ width: bhWidth, height: bhHeight, fit: "cover" })
        .output({ format: "rgba" });

      const res = transform.response();
      const pixels = new Uint8ClampedArray(await res.arrayBuffer());

      return encode(pixels, bhWidth, bhHeight, 4, 4);
    } catch (err) {
      console.warn(
        "⚠️ Blurhash skipped (Requires --remote or production):",
        err,
      );
      return null;
    }
  };

  // Orchestrate and Sink to DB

  const [variants, altText, blurhash] = await Promise.all([
    generateVariants(),
    generateAltText(),
    generateBlurhash(),
  ]);

  return await db
    .update(assets)
    .set({
      isOptimized: true,
      variants,
      altText,
      blurhash,
      updatedAt: new Date(),
    })
    .where(eq(assets.id, key));
}
