import { z } from "zod";
import { assetSchema } from "./shared/assets/asset-schema";
import {
  BlockConfig,
  BlockConfigFields,
  FieldDefinition,
  FieldTypeMap,
  RepeaterFieldDefinition,
} from "./block-registry.types";

export const fields = {
  text: (
    label: string,
    options?: { min?: number; optional?: boolean; group?: string },
  ): FieldDefinition<"text"> => {
    return {
      type: "text",
      label,
      schema: applyOptions(z.string(), options),
      defaultValue: "",
      group: options?.group || "Content",
    };
  },

  textArea: (
    label: string,
    options?: { min?: number; optional?: boolean; group?: string },
  ): FieldDefinition<"textArea"> => {
    return {
      type: "textArea",
      label,
      schema: applyOptions(z.string(), options),
      defaultValue: "",
      group: options?.group || "Content",
    };
  },

  switch: (
    label: string,
    options?: { optional?: boolean; group?: string },
  ): FieldDefinition<"switch"> => {
    return {
      type: "switch",
      label,
      schema: applyOptions(z.boolean(), options),
      defaultValue: false,
      group: options?.group || "Content",
    };
  },

  image: (
    label: string,
    options?: { max?: number; optional?: boolean; group?: string },
  ): FieldDefinition<"image"> => {
    return {
      type: "image",
      label,
      schema: applyOptions(z.array(assetSchema), options),
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

  repeater: <T extends BlockConfigFields>(
    label: string,
    options: { fields: T; max?: number; optional?: boolean; group?: string },
  ) =>
    ({
      type: "repeater" as const,
      label,
      fields: options.fields,
      max: options.max,
      schema: z.array(z.any()),
      defaultValue: [],
      group: options?.group || "Content",
    }) as RepeaterFieldDefinition<T>,
};

const applyOptions = <T extends z.ZodTypeAny>(
  schema: T,
  options?: { min?: number; max?: number; optional?: boolean },
) => {
  if (schema instanceof z.ZodString) {
    let s = schema;
    if (options?.min !== undefined) s = s.min(options.min);
    if (options?.max !== undefined) s = s.max(options.max);
    return options?.optional ? s.optional() : s;
  }

  if (schema instanceof z.ZodArray) {
    let s = schema;
    if (options?.min !== undefined) s = s.min(options.min);
    if (options?.max !== undefined) s = s.max(options.max);
    return options?.optional ? s.optional() : s;
  }

  return options?.optional ? schema.optional() : schema;
};

export function createSchema<T extends BlockConfigFields>(fields: T) {
  const zodShape: Record<string, z.ZodTypeAny> = {};
  Object.entries(fields).forEach(([key, field]) => {
    zodShape[key] = (field as FieldDefinition<keyof FieldTypeMap>).schema;
  });
  return z.object(zodShape) as any;
}

export function defineBlock<T extends BlockConfigFields>(
  config: BlockConfig<T>,
) {
  return {
    ...config,
    schema: createSchema(config.fields),
  };
}
