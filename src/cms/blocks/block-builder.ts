import { z } from "zod";
import { assetSchema } from "./shared/assets/asset-schema";
import {
  BlockConfig,
  BlockConfigFields,
  FieldDefinition,
} from "./block-registry.types";

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

const applyOptions = <T extends z.ZodTypeAny>(
  schema: T,
  options?: { optional?: boolean },
) => {
  return options?.optional ? schema.optional() : schema;
};

export function createSchema<T extends BlockConfigFields>(fields: T) {
  const zodShape: any = {};
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
