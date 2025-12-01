import { assets } from "@/cms/core/db/schema";
import z from "zod";

const imageVariantSchema = z.object({
  key: z.string(),
  width: z.number(),
  height: z.number(),
  size: z.number(),
});

export const assetVariants = z.object({
  sm: imageVariantSchema.optional(),
  md: imageVariantSchema.optional(),
  lg: imageVariantSchema.optional(),
  xl: imageVariantSchema.optional(),
});

export const assetSchema = z.object({
  id: z.string(),
  filename: z.string().optional(),
  variants: assetVariants,
  alt: z.string().nullable().optional(),
  blurhash: z.string().nullable().optional(),
  width: z.number().default(0),
  height: z.number().default(0),
});

export type Asset = typeof assets.$inferSelect;
export const ImageVariantSizes = ["sm", "md", "lg", "xl", "original"] as const;
export type ImageVariantSize = (typeof ImageVariantSizes)[number];
