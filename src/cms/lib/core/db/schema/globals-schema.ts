import { sqliteTable, text, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { scopes } from "./scopes-schema";

export type GlobalValueType =
  | "string"
  | "number"
  | "json"
  | "system-navigation"
  | "system-theme";

export const globals = sqliteTable(
  "globals",
  {
    id: text("id").primaryKey(),
    key: text("key").notNull(),
    scopeId: text("scope_id")
      .notNull()
      .references(() => scopes.id, { onDelete: "cascade" }),
    type: text("type").notNull().$type<GlobalValueType>(),
    value: text("value", { mode: "json" }).notNull(),
  },
  (table) => [
    // Primary index on key for fast lookup of all items with matching key
    index("globals_key_idx").on(table.key),
    // Secondary index on scope for lookups by scope
    index("globals_scope_idx").on(table.scopeId),
  ],
);

export const globalsRelations = relations(globals, ({ one }) => ({
  scope: one(scopes, {
    fields: [globals.scopeId],
    references: [scopes.id],
  }),
}));
