import { z } from "zod";
import { registry } from "./block-registry";

export type Registry = typeof registry;

export type BlockType = keyof Registry;

export type Block = {
  [K in BlockType]: {
    id: string;
    type: K;
    data: z.infer<Registry[K]["schema"]>;
  };
}[BlockType];

export type PropsOf<T extends Block["type"]> = Extract<
  Block,
  { type: T }
>["data"];

export type PageData = {
  id: string;
  slug: string;
  title: string;
  blocks: Block[];
  status: "draft" | "published";
};
