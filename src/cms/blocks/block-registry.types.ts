import { z } from "zod";
import { InferSelectModel } from "drizzle-orm";
import { pages } from "../core/db/schema";
import { Asset } from "./shared/assets/asset-schema";
import { registry } from "./block-registry";

// --- --- --- --- --- ---
// Registry export type
// --- --- --- --- --- ---
//
export type Registry = typeof registry;

// --- --- --- --- --- ---
// Field types
// --- --- --- --- --- ---

export type FieldTypeMap = {
  text: string;
  textArea: string;
  richtext: string;
  url: string;
  switch: boolean;
  image: Asset[];
  repeater: any[];
};

export type FieldType = keyof FieldTypeMap;

export type FieldDefinition<K extends FieldType> = {
  type: K;
  label: string;
  // TODO (low priority) - Work out how to remove this "| undefined" as it makes all the keys optional
  // There is likely a way to persist an "as const" across these types so removing this doesn't make all the other types unhappy
  schema: z.ZodType<FieldTypeMap[K] | undefined>;
  defaultValue?: FieldTypeMap[K];
  group?: string;
};

export type RepeaterFieldDefinition<T extends BlockConfigFields = any> = {
  type: "repeater";
  label: string;
  fields: T;
  schema: z.ZodType<any>;
  defaultValue?: any[];
  max?: number;
  min?: number;
  group?: string;
};
export type AnyFieldDefinition =
  | FieldDefinition<Exclude<FieldType, "repeater">>
  | RepeaterFieldDefinition<any>;

// --- --- --- --- --- ---
//  Block Types
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
//
// Images are stored as references, but at RuntimeValue we're hydrating them to a full asset object.

type RuntimeValue<T extends AnyFieldDefinition> =
  T extends RepeaterFieldDefinition<infer F>
    ? { [K in keyof F]: RuntimeValue<F[K]> }[] // 1. Recurse into the specific fields F
    : T["type"] extends keyof FieldTypeMap
      ? T["type"] extends "image" // 2. Handle special assets
        ? Asset[]
        : z.infer<T["schema"]> // 3. Fallback to Zod inference for primitives
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
