import { z } from "zod";
import { InferSelectModel } from "drizzle-orm";
import { pages } from "../core/db/schema";
import { Asset } from "./shared/assets/asset-schema";
import { registry } from "./block-registry";

// --- --- --- --- --- ---
// Registry export type
// --- --- --- --- --- ---

export type Registry = typeof registry;

// --- --- --- --- --- ---
// Field types
// --- --- --- --- --- ---

/**
 * Base map for non-recursive fields.
 * This acts as the source of truth for primitive field values.
 */
export type BaseFieldMap = {
  text: string;
  textArea: string;
  richtext: string;
  url: string;
  switch: boolean;
  image: Asset[];
};

/**
 * Enhanced FieldTypeMap that describes a repeater as a recursive
 * collection of any valid field value.
 */
export type FieldTypeMap = BaseFieldMap & {
  repeater: Array<Record<string, BaseFieldMap[keyof BaseFieldMap] | any[]>>;
};

export type FieldType = keyof FieldTypeMap;

/**
 * Generic definition for primitive fields.
 */
export type FieldDefinition<K extends keyof BaseFieldMap> = {
  type: K;
  label: string;
  schema: z.ZodType<BaseFieldMap[K] | undefined>;
  defaultValue?: BaseFieldMap[K];
  group?: string;
};

/**
 * Definition for Repeaters.
 * T defaults to BlockConfigFields to allow recursion while keeping
 * the specific field keys intact for the RuntimeValue resolver.
 */
export type RepeaterFieldDefinition<
  T extends BlockConfigFields = BlockConfigFields,
> = {
  type: "repeater";
  label: string;
  fields: T;
  schema: z.ZodType<unknown>;
  defaultValue?: Array<Record<string, unknown>>;
  max?: number;
  min?: number;
  group?: string;
};

/**
 * Discriminated union of all possible field definitions.
 * This prevents type widening and allows for proper narrowing in components.
 */
export type AnyFieldDefinition =
  | { [K in keyof BaseFieldMap]: FieldDefinition<K> }[keyof BaseFieldMap]
  | RepeaterFieldDefinition<any>;

// --- --- --- --- --- ---
// Block Types
// --- --- --- --- --- ---

export type BlockConfigFields = Record<string, AnyFieldDefinition>;

export type BlockConfig<T extends BlockConfigFields> = {
  name: string;
  category: string;
  fields: T;
  tabs?: string[];
  skeleton: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<HydratedBlockProps<T>>;
  defaultValues: HydratedBlockProps<T>;
};

export type BlockDefinitionResult = {
  name: string;
  category?: string;
  fields: BlockConfigFields;
  component: React.ComponentType<any>;
  schema: z.ZodObject<any>;
};

export type BlockType = keyof Registry;

export type Block = {
  [K in BlockType]: {
    id: string;
    type: K;
    data: z.infer<Registry[K]["schema"]>;
  };
}[BlockType];

// --- --- --- --- --- ---
// Assets Types / helpers
// --- --- --- --- --- ---

/**
 * Recursive Type Resolver.
 * 1. If T is a Repeater, it maps over the fields F and resolves them recursively.
 * 2. If T is a Primitive, it looks up the value in BaseFieldMap.
 */
type RuntimeValue<T extends AnyFieldDefinition> =
  T extends RepeaterFieldDefinition<infer F>
    ? { [K in keyof F]: RuntimeValue<F[K]> }[]
    : T extends { type: infer K }
      ? K extends keyof BaseFieldMap
        ? BaseFieldMap[K]
        : never
      : never;

export type HydratedBlockProps<T extends BlockConfigFields> = {
  [K in keyof T]: RuntimeValue<T[K]>;
};

// --- --- --- --- --- ---
// Page Types
// --- --- --- --- --- ---

export type Status = "draft" | "published";

export interface PageData extends InferSelectModel<typeof pages> {
  blocks: Block[];
}

// --- --- --- --- --- ---
// Block Type Helpers
// --- --- --- --- --- ---

export type PropsOf<T extends Block["type"]> = Extract<
  Block,
  { type: T }
>["data"];

/**
 * Helper to narrow AnyFieldDefinition to RepeaterFieldDefinition.
 */
export function isRepeaterDef(
  def: AnyFieldDefinition,
): def is RepeaterFieldDefinition<BlockConfigFields> {
  return def.type === "repeater";
}
