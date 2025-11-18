import React from "react";
import { Registry } from "./block-registry";

// 1. Extract the Props shape from the Component
export type PropsOf<T extends keyof Registry> = React.ComponentProps<
  Registry[T]["component"]
>;

// 2. Define the Block Shape
// CHANGE: We renamed 'props' to 'data' to match the DB schema
export type BlockOf<K extends keyof Registry> = {
  id: string;
  type: K;
  data: PropsOf<K>;
};

// 3. Union of all possible blocks
export type Block = { [K in keyof Registry]: BlockOf<K> }[keyof Registry];

// 4. Page Data
export type PageData = {
  title?: string;
  status?: string;
  blocks: Block[];
};
