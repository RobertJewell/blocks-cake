import { z } from "zod";
import React, { ReactNode } from "react";

export type FieldTypeMap = {
  text: string;
  richtext: string;
  image: string;
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

export type BlockDefinitionResult = {
  name: string;
  category?: string;
  fields: Record<string, FieldDefinition<any>>;
  component: React.ComponentType<any>;
  schema: z.ZodObject<any>;
};
