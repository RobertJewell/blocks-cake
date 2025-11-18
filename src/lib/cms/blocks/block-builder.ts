import { z } from "zod";
import React from "react";

export type FieldTypeMap = {
  text: string;
  richtext: string;
  image: string; // todo - update this
  url: string;
};

export type FieldType = keyof FieldTypeMap;

type FieldDefinition<K extends FieldType> = {
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

  image: (label: string): FieldDefinition<"image"> => ({
    type: "image",
    label,
    schema: z.url().optional().or(z.literal("")),
    defaultValue: "",
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
    schema: z.url(),
    defaultValue: "",
  }),
};

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
  type: string;
  fields: T;
  component: React.ComponentType<
    z.infer<z.ZodObject<{ [K in keyof T]: T[K]["schema"] }>>
  >;
};

export function defineBlock<T extends Record<string, FieldDefinition<any>>>(
  config: BlockConfig<T>,
) {
  return {
    ...config,
    schema: createSchema(config.fields),
  };
}
