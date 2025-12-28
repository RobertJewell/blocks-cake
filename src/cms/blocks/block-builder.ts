import { z } from "zod";
import React from "react";
import { HydratedBlockProps } from "./shared/assets/asset-type-helpers";
import { Asset, assetSchema } from "./shared/assets/asset-schema";

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

// Update this in block-builder.ts
export type FieldGroup = {
  label: string;
  fields: Record<string, FieldDefinition<any>>;
};

// Use a simple array type
export type BlockConfigSchema = FieldGroup[];

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
export function createSchema<T extends BlockConfigSchema>(config: T) {
  const zodShape: any = {};

  config.forEach((group) => {
    Object.entries(group.fields).forEach(([key, field]) => {
      zodShape[key] = field.schema;
    });
  });

  // Return type casting remains the same to keep your props flat
  return z.object(zodShape) as z.ZodObject<{
    [K in keyof FlattenGroups<T>]: FlattenGroups<T>[K] extends FieldDefinition<
      infer U
    >
      ? z.ZodType<FieldTypeMap[U] | undefined>
      : never;
  }>;
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type FlattenGroups<T extends BlockConfigSchema> =
  UnionToIntersection<T[number]["fields"]> extends infer O
    ? { [K in keyof O]: O[K] }
    : never;

export type BlockConfig<T extends BlockConfigSchema> = {
  name: string;
  category: string;
  fields: T;
  skeleton: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<HydratedBlockProps<FlattenGroups<T>>>;
  defaultValues: z.infer<ReturnType<typeof createSchema<T>>>;
};

export function defineBlock<T extends BlockConfigSchema>(
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
  fields: BlockConfigSchema; // Updated to use the array structure
  component: React.ComponentType<any>;
  schema: z.ZodObject<any>;
};
