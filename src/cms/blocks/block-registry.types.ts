import { z } from "zod";
import { InferSelectModel } from "drizzle-orm";
import { pages } from "../core/db/schema";
import { Asset } from "./shared/assets/asset-schema";
import { HydratedBlockProps } from "./shared/assets/asset-type-helpers";
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

// --- --- --- --- --- ---
//  Block Types
// --- --- --- --- --- ---

export type BlockConfigFields = Record<
  string,
  FieldDefinition<keyof FieldTypeMap>
>;

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
