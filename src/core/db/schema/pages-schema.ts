import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { blocks } from "./blocks-schema";
import { Status } from "@/lib/cms/blocks/block-registry.types";

export const pages = sqliteTable(
  "pages",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    status: text("status").notNull().$type<Status>().default("draft"),

    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [uniqueIndex("pages_slug_unique").on(table.slug)],
);

export const pageBlocks = sqliteTable(
  "page_blocks",
  {
    pageId: text("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),

    blockId: text("block_id")
      .notNull()
      .references(() => blocks.id, { onDelete: "cascade" }),

    order: integer("order").notNull(),
  },
  (table) => [
    // Composite PK: PRIMARY KEY(page_id, block_id)
    uniqueIndex("page_blocks_pk").on(table.pageId, table.blockId),

    // Helpful indexes for performance
    index("page_blocks_page_idx").on(table.pageId),
    index("page_blocks_order_idx").on(table.order),
  ],
);
