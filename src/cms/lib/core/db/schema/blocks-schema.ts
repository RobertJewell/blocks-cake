import { Block } from "@/cms/blocks/block-registry.types";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { pageBlocks } from "./pages-schema";
import { assetUsages } from "./assets-schema";

export const blocks = sqliteTable("blocks", {
  id: text("id").primaryKey(),
  type: text("type").$type<Block["type"]>().notNull(),
  data: text("data", { mode: "json" }).$type<Block["data"]>().notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$onUpdate(() => new Date())
    .default(sql`(unixepoch())`),
});

export const blocksRelations = relations(blocks, ({ many }) => ({
  // The block is used on many pages
  pages: many(pageBlocks),

  // The block uses many assets
  usages: many(assetUsages),
}));
