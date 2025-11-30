import { relations, sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  primaryKey,
  index,
} from "drizzle-orm/sqlite-core";
import { blocks } from "./blocks-schema";

export type ImageVariant = {
  key: string;
  width: number;
  height: number;
  size: number;
};

export type AssetVariants = {
  sm?: ImageVariant;
  md?: ImageVariant;
  lg?: ImageVariant;
  xl?: ImageVariant;
  original: ImageVariant;
};

export const assets = sqliteTable("assets", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),

  // Everything after here relies on our queue (which I haven't made yet)
  // When the queue worker finishes successfully, set this to true (1).
  isOptimized: integer("is_optimized", { mode: "boolean" })
    .default(false)
    .notNull(),

  // Stores all generated sizes + original path
  variants: text("variants", { mode: "json" }).$type<AssetVariants>(),
  blurhash: text("blurhash"),

  // Image Metadata
  altText: text("alt_text"), // We'll just always use ML for this, no one writes them
  tags: text("tags", { mode: "json" }).$type<string[]>(), // ["outdoor", "cake", "blue"]

  // Row Metadata
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const assetUsages = sqliteTable(
  "asset_usages",
  {
    assetId: text("asset_id")
      .notNull()
      .references(() => assets.id, { onDelete: "cascade" }),

    blockId: text("block_id")
      .notNull()
      .references(() => blocks.id, { onDelete: "cascade" }),

    field: text("field").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.assetId, t.blockId, t.field] }),
    index("idx_asset_usages_block").on(t.blockId),
  ],
);

// --- RELATIONS ---

export const assetsRelations = relations(assets, ({ many }) => ({
  usages: many(assetUsages),
}));

export const assetUsagesRelations = relations(assetUsages, ({ one }) => ({
  asset: one(assets, {
    fields: [assetUsages.assetId],
    references: [assets.id],
  }),
  block: one(blocks, {
    fields: [assetUsages.blockId],
    references: [blocks.id],
  }),
}));
