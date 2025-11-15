import { FieldTypeMap, Registry } from "./block-registry";

/**
 * Definition of a single field: type from FieldTypeMap + label for UI
 */
export type FieldDef<T extends keyof FieldTypeMap> = {
  type: T;
  label: string;
};

/**
 * Maps a prop value type to the correct field type key(s).
 * Example: string -> "text" | "richtext", string[] -> "image".
 */
type FieldTypeForValue<V> = {
  [K in keyof FieldTypeMap]: V extends FieldTypeMap[K] ? K : never;
}[keyof FieldTypeMap];

/**
 * Given component props, generate the required fields object.
 * Enforces that each prop has a matching field and type.
 */
export type FieldsFromProps<P> = {
  [K in keyof P]-?: FieldDef<FieldTypeForValue<P[K]>>;
};

/**
 * Utility to forbid extra keys in object literals.
 * Ensures fields object matches props exactly (no extras).
 */
type Exact<Expected, Actual extends Expected> = Expected &
  Record<Exclude<keyof Actual, keyof Expected>, never>;

/**
 * Factory for creating strongly typed registry entries.
 * Guarantees fields align with component props and no extras are allowed.
 */
export function defineEntry<P>(
  Component: React.ComponentType<P>,
  fields: Exact<FieldsFromProps<P>, FieldsFromProps<P>>,
) {
  return { Component, fields };
}

/**
 * Block structure: typed by the registry entry.
 */
export type BlockOf<K extends keyof Registry> = {
  id: string;
  type: K;
  props: React.ComponentProps<Registry[K]["Component"]>;
};

/**
 * Union of all possible blocks.
 */
export type Block = { [K in keyof Registry]: BlockOf<K> }[keyof Registry];

/**
 * Page data = list of blocks.
 */
export type PageData = { blocks: Block[] };

/**
 * Extract props for a given block type.
 */
export type PropsOf<T extends Block["type"]> = Extract<Block, { type: T }>["props"];

/**
 * Extract fields for a given registry entry.
 */
export type FieldsOf<T extends keyof Registry> = Registry[T]["fields"];
