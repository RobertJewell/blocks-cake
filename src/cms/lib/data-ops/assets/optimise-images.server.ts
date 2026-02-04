import { assets } from "@/cms/core/db/schema";
import { eq } from "drizzle-orm";
import { getDB } from "@/cms/core/db/drizzle";
import { encode } from "blurhash";

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

const getInfo = async (env: Env, buffer: ArrayBuffer) => {
  const info = await env.IMAGES.info(toStream(buffer));
  return {
    width: "width" in info ? info.width : 0,
    height: "height" in info ? info.height : 0,
  };
};

// Main Optimization Pipeline
export async function processImageOptimisation(key: string, env: Env) {
  const db = getDB(env.database);

  // Fetch source
  const object = await env.blocks_cakes_assets.get(key);
  if (!object) throw new Error(`Object not found in R2: ${key}`);

  const imageBuffer = await object.arrayBuffer();

  // Generate Responsive Variants
  const generateVariants = async () => {
    const originalDim = await getInfo(env, imageBuffer);

    const variantEntries = await Promise.all(
      Object.entries(IMAGE_RESOLUTIONS).map(async ([size, width]) => {
        const variantKey = `${key}_${size.toUpperCase()}`;

        const transform = await env.IMAGES.input(toStream(imageBuffer))
          .transform({ width, fit: "scale-down" })
          .output({ format: "image/webp", quality: 80 });

        const res = transform.response();
        const buffer = await res.arrayBuffer();
        const dim = await getInfo(env, buffer);

        await env.blocks_cakes_assets.put(variantKey, buffer, {
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
      const output = await env.AI.run("@cf/llava-hf/llava-1.5-7b-hf", {
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

      const transform = await env.IMAGES.input(toStream(imageBuffer))
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
