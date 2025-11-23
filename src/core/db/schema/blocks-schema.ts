import { Block } from "@/lib/cms/blocks/block-registry.types";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const blocks = sqliteTable("blocks", {
  id: text("id").primaryKey(),
  type: text("type").$type<Block["type"]>().notNull(),
  data: text("data", { mode: "json" }).$type<Block["data"]>().notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$onUpdate(() => new Date())
    .default(sql`(unixepoch())`),
});
