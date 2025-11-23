import { z } from "zod";
import { registry } from "./block-registry";
import { InferSelectModel } from "drizzle-orm";
import { pages } from "@/core/db/schema";

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

export type Status = "draft" | "published";

export interface PageData extends InferSelectModel<typeof pages> {
  blocks: Block[];
}
