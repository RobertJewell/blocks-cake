import z from "zod";
import { BlockConfigFields, FieldDefinition } from "../../block-builder";
import { Asset } from "./asset-schema";

type RuntimeValue<T extends FieldDefinition<any>> = T["type"] extends
  | "image"
  | "gallery"
  ? Asset[]
  : z.infer<T["schema"]>;

export type HydratedBlockProps<T extends BlockConfigFields> = {
  [K in keyof T]: RuntimeValue<T[K]>;
};
