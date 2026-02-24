import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { globals } from "./globals-schema";

export const scopes = sqliteTable("scopes", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const scopesRelations = relations(scopes, ({ many }) => ({
  globals: many(globals),
}));
