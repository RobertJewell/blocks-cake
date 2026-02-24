import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { drizzleMiddleware } from "@/cms/lib/core/middleware/db";
import { authRequestMiddleware } from "@/cms/lib/core/middleware/auth";
import { scopes, globals } from "@/cms/lib/core/db/schema";
import { GlobalRecord } from "./fetch-global";

const getAllGlobalsSchema = z.object({
  scope: z.string().default("global"),
});

export const getAllGlobals = createServerFn({ method: "GET" })
  .middleware([drizzleMiddleware, authRequestMiddleware])
  .inputValidator((data) => getAllGlobalsSchema.parse(data))
  .handler(async ({ data, context }): Promise<GlobalRecord[]> => {
    const { db, request, auth } = context;

    // Auth check
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const { scope: scopeName } = data;

    // Get scope
    const scope = await db
      .select()
      .from(scopes)
      .where(eq(scopes.name, scopeName));

    if (!scope[0]) {
      // Scope doesn't exist, return empty array
      return [];
    }

    // Get all globals for this scope
    const allGlobals = await db
      .select()
      .from(globals)
      .where(eq(globals.scopeId, scope[0].id));

    return allGlobals as GlobalRecord[];
  });
