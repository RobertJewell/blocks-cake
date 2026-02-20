import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { pages } from "./pages-schema";

export type ScreenshotStatus = "pending" | "completed" | "failed";

export const screenshots = sqliteTable(
  "screenshots",
  {
    pageId: text("page_id")
      .primaryKey()
      .references(() => pages.id, { onDelete: "cascade" }),

    // Storage reference in R2
    storagePath: text("storage_path"),

    // Screenshot metadata
    width: integer("width").default(640),
    height: integer("height").default(480),

    // Processing status
    status: text("status")
      .$type<ScreenshotStatus>()
      .default("pending")
      .notNull(),
    errorMessage: text("error_message"),

    // Blurhash for preview
    blurhash: text("blurhash"),

    // Row Metadata
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("screenshots_status_idx").on(table.status)],
);

export const screenshotsRelations = relations(screenshots, ({ one }) => ({
  page: one(pages, {
    fields: [screenshots.pageId],
    references: [pages.id],
  }),
}));
