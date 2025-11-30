import { z } from "zod";
import React from "react";

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

export type FieldTypeMap = {
  text: string;
  richtext: string;
  image: Asset[];
  url: string;
};

export type FieldType = keyof FieldTypeMap;

export type FieldDefinition<K extends FieldType> = {
  type: K;
  label: string;
  schema: z.ZodType<FieldTypeMap[K] | undefined>;
  defaultValue?: FieldTypeMap[K];
};

export const fields = {
  text: (
    label: string,
    options?: { min?: number },
  ): FieldDefinition<"text"> => ({
    type: "text",
    label,
    schema: options?.min ? z.string().min(options.min) : z.string(),
    defaultValue: "",
  }),

  image: (
    label: string,
    options?: { max?: number },
  ): FieldDefinition<"image"> => ({
    type: "image",
    label,
    schema: options?.max
      ? z.array(assetSchema).max(options?.max)
      : z.array(assetSchema),
    defaultValue: [],
  }),

  richtext: (label: string): FieldDefinition<"richtext"> => ({
    type: "richtext",
    label,
    schema: z.string(),
    defaultValue: "",
  }),

  url: (label: string): FieldDefinition<"url"> => ({
    type: "url",
    label,
    schema: z.url().optional().or(z.literal("")),
    defaultValue: "",
  }),
};

// Converts a map of FieldDefinitions into a Zod Object Schema
export function createSchema<T extends Record<string, FieldDefinition<any>>>(
  fields: T,
) {
  const zodShape: any = {};
  Object.keys(fields).forEach((key) => {
    zodShape[key] = fields[key].schema;
  });
  return z.object(zodShape) as z.ZodObject<{
    [K in keyof T]: T[K]["schema"];
  }>;
}

export type BlockConfig<T extends Record<string, FieldDefinition<any>>> = {
  name: string;
  category: string;
  fields: T;
  skeleton: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<HydratedBlockProps<T>>;
  defaultValues: z.infer<z.ZodObject<{ [K in keyof T]: T[K]["schema"] }>>;
};

type RuntimeValue<T extends FieldDefinition<any>> = T["type"] extends
  | "image"
  | "gallery"
  ? Asset[]
  : z.infer<T["schema"]>;

export type HydratedBlockProps<T extends Record<string, FieldDefinition<any>>> =
  { [K in keyof T]: RuntimeValue<T[K]> };

export function defineBlock<T extends Record<string, FieldDefinition<any>>>(
  config: BlockConfig<T>,
) {
  return {
    ...config,
    schema: createSchema(config.fields),
  };
}

export type BlockDefinitionResult = {
  name: string;
  category?: string;
  fields: Record<string, FieldDefinition<any>>;
  component: React.ComponentType<any>;
  schema: z.ZodObject<any>;
};
