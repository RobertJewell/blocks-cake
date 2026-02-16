import { z } from "zod";
import { assetSchema } from "./shared/assets/asset-schema";
import {
  BlockConfig,
  BlockConfigFields,
  FieldDefinition,
  RepeaterFieldDefinition,
} from "./block-registry.types";

/**
 * Field builders for creating block configurations.
 *
 * This is kinda hideous, but it allows the optional properties to be typed correctly in our hydratedProps helper.
 * The issue seems to be that there's no amount of 'as const' we can do that will make the optional boolean survive being passed through in an object.
 * That's fine for min/max stuff as that doens't exist on types anyway, just validation.
 *
 * Last time I had this problem the answer was a builder pattern, but that won't work here.
 * Instead we can add an explicit optional key to our FieldDefinition.
 * It's not great, but these should almost never change, and it makes the stuff that will change (block definitions) much nicer.
 *
 *
 * The `optional` property enables our RuntimeValue type to check
 * `T extends { optional: true }` and make fields optional in the inferred types.
 */
export const fields = {
  text: <Options extends { min?: number; optional?: boolean; group?: string }>(
    label: string,
    options?: Options,
  ) => {
    const baseSchema = applyConstraints(z.string(), options);
    return {
      type: "text" as const,
      label,
      optional: options?.optional,
      schema: options?.optional ? baseSchema.optional() : baseSchema,
      defaultValue: "",
      group: options?.group || "Content",
    } as FieldDefinition<"text"> & Pick<Options, "optional">;
  },

  textArea: <
    Options extends { min?: number; optional?: boolean; group?: string },
  >(
    label: string,
    options?: Options,
  ) => {
    const baseSchema = applyConstraints(z.string(), options);
    return {
      type: "textArea" as const,
      label,
      optional: options?.optional,
      schema: options?.optional ? baseSchema.optional() : baseSchema,
      defaultValue: "",
      group: options?.group || "Content",
    } as FieldDefinition<"textArea"> & Pick<Options, "optional">;
  },

  switch: <Options extends { optional?: boolean; group?: string }>(
    label: string,
    options?: Options,
  ) => {
    const baseSchema = z.boolean();
    return {
      type: "switch" as const,
      label,
      optional: options?.optional,
      schema: options?.optional ? baseSchema.optional() : baseSchema,
      defaultValue: false,
      group: options?.group || "Content",
    } as FieldDefinition<"switch"> & Pick<Options, "optional">;
  },

  image: <Options extends { max?: number; optional?: boolean; group?: string }>(
    label: string,
    options?: Options,
  ) => {
    const baseSchema = applyConstraints(z.array(assetSchema), options);
    return {
      type: "image" as const,
      label,
      optional: options?.optional,
      schema: options?.optional ? baseSchema.optional() : baseSchema,
      defaultValue: [],
      group: options?.group || "Content",
    } as FieldDefinition<"image"> & Pick<Options, "optional">;
  },

  richtext: <Options extends { optional?: boolean; group?: string }>(
    label: string,
    options?: Options,
  ) => {
    const baseSchema = z.string();
    return {
      type: "richtext" as const,
      label,
      optional: options?.optional,
      schema: options?.optional ? baseSchema.optional() : baseSchema,
      defaultValue: "",
      group: options?.group || "Content",
    } as FieldDefinition<"richtext"> & Pick<Options, "optional">;
  },

  repeater: <
    T extends BlockConfigFields,
    Options extends {
      fields: T;
      max?: number;
      optional?: boolean;
      group?: string;
    },
  >(
    label: string,
    options: Options,
  ) => {
    const baseSchema = applyConstraints(z.array(z.any()), options);
    return {
      type: "repeater" as const,
      label,
      fields: options.fields,
      max: options.max,
      optional: options.optional,
      schema: options?.optional ? baseSchema.optional() : baseSchema,
      defaultValue: [],
      group: options?.group || "Content",
    } as RepeaterFieldDefinition<Options["fields"]> & Pick<Options, "optional">;
  },
};

/**
 * Applies min/max constraints to Zod schemas.
 */
const applyConstraints = <T extends z.ZodTypeAny>(
  schema: T,
  options?: { min?: number; max?: number },
) => {
  if (schema instanceof z.ZodString) {
    let s = schema;
    if (options?.min !== undefined) s = s.min(options.min);
    if (options?.max !== undefined) s = s.max(options.max);
    return s;
  }

  if (schema instanceof z.ZodArray) {
    let s = schema;
    if (options?.min !== undefined) s = s.min(options.min);
    if (options?.max !== undefined) s = s.max(options.max);
    return s;
  }

  return schema;
};

export function createSchema<T extends BlockConfigFields>(fields: T) {
  const zodShape: Record<string, z.ZodTypeAny> = {};
  Object.entries(fields).forEach(([key, field]) => {
    zodShape[key] = field.schema;
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
