import { assets } from "@/cms/core/db/schema";
import z from "zod";

const imageVariantSchema = z.object({
  key: z.string(),
  width: z.number(),
  height: z.number(),
  size: z.number(),
});

export const assetVariantsSchema = z.object({
  sm: imageVariantSchema.optional(),
  md: imageVariantSchema.optional(),
  lg: imageVariantSchema.optional(),
  xl: imageVariantSchema.optional(),
  original: imageVariantSchema,
});

export const assetSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  filename: z.string(),
  mimeType: z.string(),
  isOptimized: z.boolean(),
  variants: assetVariantsSchema.nullable(),
  blurhash: z.string().nullable(),
  altText: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
});

export type Asset = typeof assets.$inferSelect;
export const ImageVariantSizes = ["sm", "md", "lg", "xl", "original"] as const;
export type ImageVariantSize = (typeof ImageVariantSizes)[number];
