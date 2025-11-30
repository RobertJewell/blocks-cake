import z from "zod";

export const assetSchema = z.object({
  id: z.string(),
  filename: z.string().optional(),
  url: z.string().optional(),
  alt: z.string().nullable().optional(),
  blurhash: z.string().nullable().optional(),
  width: z.number().default(0),
  height: z.number().default(0),
});

export type Asset = z.infer<typeof assetSchema>;
