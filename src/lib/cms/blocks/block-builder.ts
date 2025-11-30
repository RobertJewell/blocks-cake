import { z } from "zod";
import React from "react";
import {
  Asset,
  assetSchema,
} from "@/lib/cms/blocks/shared/assets/asset-schema";
import { HydratedBlockProps } from "./shared/assets/asset-type-helpers";

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

const applyOptions = <T extends z.ZodTypeAny>(
  schema: T,
  options?: { optional?: boolean },
) => {
  return options?.optional ? schema.optional() : schema;
};

export const fields = {
  text: (
    label: string,
    options?: { min?: number; optional?: boolean },
  ): FieldDefinition<"text"> => {
    let schema = z.string();
    if (options?.min) schema = schema.min(options.min);

    return {
      type: "text",
      label,
      schema: applyOptions(schema, options),
      defaultValue: "",
    };
  },

  image: (
    label: string,
    options?: { max?: number; optional?: boolean },
  ): FieldDefinition<"image"> => {
    let schema = z.array(assetSchema);
    if (options?.max) schema = schema.max(options.max);

    return {
      type: "image",
      label,
      schema: applyOptions(schema, options),
      defaultValue: [],
    };
  },

  richtext: (
    label: string,
    options?: { optional?: boolean },
  ): FieldDefinition<"richtext"> => ({
    type: "richtext",
    label,
    schema: applyOptions(z.string(), options),
    defaultValue: "",
  }),

  // url: (
  //   label: string,
  //   options?: { optional?: boolean },
  // ): FieldDefinition<"url"> => ({
  //   type: "url",
  //   label,
  //   // By default, we allow empty strings for URLs to be 'optional' in usage,
  //   // but the 'optional' flag will strictly allow undefined.
  //   schema: applyOptions(z.string().optional().or(z.literal("")), options),
  //   defaultValue: "",
  // }),
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
