import z from "zod";
import { Asset } from "./asset-schema";
import { BlockConfigFields, FieldDefinition } from "../../block-registry.types";

type RuntimeValue<T extends FieldDefinition<any>> = T["type"] extends
  | "image"
  | "gallery"
  ? Asset[]
  : z.infer<T["schema"]>;

export type HydratedBlockProps<T extends BlockConfigFields> = {
  [K in keyof T]: RuntimeValue<T[K]>;
};
