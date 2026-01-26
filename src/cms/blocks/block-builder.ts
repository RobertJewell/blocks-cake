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
  group?: string;
};

export type BlockConfigFields = Record<string, FieldDefinition<any>>;

const applyOptions = <T extends z.ZodTypeAny>(
  schema: T,
  options?: { optional?: boolean },
) => {
  return options?.optional ? schema.optional() : schema;
};

export const fields = {
  text: (
    label: string,
    options?: { min?: number; optional?: boolean; group?: string },
  ): FieldDefinition<"text"> => {
    let schema = z.string();
    if (options?.min) schema = schema.min(options.min);

    return {
      type: "text",
      label,
      schema: applyOptions(schema, options),
      defaultValue: "",
      group: options?.group || "Content",
    };
  },

  image: (
    label: string,
    options?: { max?: number; optional?: boolean; group?: string },
  ): FieldDefinition<"image"> => {
    let schema = z.array(assetSchema);
    if (options?.max) schema = schema.max(options.max);

    return {
      type: "image",
      label,
      schema: applyOptions(schema, options),
      defaultValue: [],
      group: options?.group || "Content",
    };
  },

  richtext: (
    label: string,
    options?: { optional?: boolean; group?: string },
  ): FieldDefinition<"richtext"> => ({
    type: "richtext",
    label,
    schema: applyOptions(z.string(), options),
    defaultValue: "",
    group: options?.group || "Content",
  }),
};

export function createSchema<T extends BlockConfigFields>(fields: T) {
  const zodShape: any = {};
  Object.entries(fields).forEach(([key, field]) => {
    zodShape[key] = field.schema;
  });
  return z.object(zodShape) as any;
}

export type BlockConfig<T extends BlockConfigFields> = {
  name: string;
  category: string;
  fields: T;
  tabs?: string[];
  skeleton: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<HydratedBlockProps<T>>;
  defaultValues: HydratedBlockProps<T>;
};

export function defineBlock<T extends BlockConfigFields>(
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
  fields: BlockConfigFields;
  component: React.ComponentType<any>;
  schema: z.ZodObject<any>;
};
