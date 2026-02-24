import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { eq, and } from "drizzle-orm";

import { drizzleMiddleware } from "@/cms/lib/core/middleware/db";
import { authRequestMiddleware } from "@/cms/lib/core/middleware/auth";
import { scopes, globals } from "@/cms/lib/core/db/schema";

const saveGlobalSchema = z.object({
  key: z.string().min(1, "Key is required"),
  type: z.enum([
    "string",
    "number",
    "json",
    "system-navigation",
    "system-theme",
  ]),
  value: z.unknown(),
  scope: z.string().default("global"),
});

export const saveGlobal = createServerFn({ method: "POST" })
  .middleware([drizzleMiddleware, authRequestMiddleware])
  .inputValidator((data) => saveGlobalSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { db, request, auth } = context;

    // Auth check
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const { key, type, value, scope: scopeName } = data;

    // Get or create scope
    const scope = await db
      .select()
      .from(scopes)
      .where(eq(scopes.name, scopeName))
      .limit(1);

    let scopeId = scope[0]?.id;

    if (!scopeId) {
      const newScope = await db
        .insert(scopes)
        .values({
          id: crypto.randomUUID(),
          name: scopeName,
        })
        .returning();

      scopeId = newScope[0].id;
    }

    // Check if global exists
    const existing = await db
      .select()
      .from(globals)
      .where(and(eq(globals.key, key), eq(globals.scopeId, scopeId)))
      .limit(1);

    if (existing.length > 0) {
      // Update existing
      await db
        .update(globals)
        .set({
          type,
          value,
        })
        .where(eq(globals.id, existing[0].id));

      return { success: true, id: existing[0].id, action: "updated" };
    } else {
      // Create new
      const newGlobal = await db
        .insert(globals)
        .values({
          id: crypto.randomUUID(),
          key,
          scopeId,
          type,
          value,
        })
        .returning();

      return { success: true, id: newGlobal[0].id, action: "created" };
    }
  });
