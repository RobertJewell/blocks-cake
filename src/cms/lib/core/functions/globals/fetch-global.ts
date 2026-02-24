import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { drizzleMiddleware } from "@/cms/lib/core/middleware/db";
import { authRequestMiddleware } from "@/cms/lib/core/middleware/auth";
import { scopes, globals } from "@/cms/lib/core/db/schema";
import { NavigationProps } from "@/cms/blocks/navigation/navigation-floating-simple/navigation-floating-simple";

const fetchGlobalSchema = z.object({
  key: z.string().min(1, "Key is required"),
  scope: z.string().default("global"),
});

interface GlobalBase {
  id: string;
  key: string;
  scopeId: string;
}

// Explicit types for each global variant
export interface SystemNavigationGlobal extends GlobalBase {
  type: "system-navigation";
  value: NavigationProps;
}

export interface SystemThemeGlobal extends GlobalBase {
  type: "system-theme";
  value: Record<string, any>;
}

export interface JsonGlobal extends GlobalBase {
  type: "json";
  value: Record<string, any>;
}

export interface StringGlobal extends GlobalBase {
  type: "string";
  value: string;
}

export interface NumberGlobal extends GlobalBase {
  type: "number";
  value: number;
}

// Discriminated union of all global types
export type GlobalRecord =
  | SystemNavigationGlobal
  | SystemThemeGlobal
  | JsonGlobal
  | StringGlobal
  | NumberGlobal;

export const fetchGlobal = createServerFn({ method: "GET" })
  .middleware([drizzleMiddleware])
  .inputValidator((data) => fetchGlobalSchema.parse(data))
  .handler(async ({ data, context }): Promise<GlobalRecord | null> => {
    const { db } = context;

    const { key, scope: scopeName } = data;

    // Get all globals with this key (uses index on key)
    const allGlobals = await db
      .select()
      .from(globals)
      .where(eq(globals.key, key));

    if (allGlobals.length === 0) {
      return null;
    }

    // Get all scopes to find the one we need
    const allScopes = await db.select().from(scopes);
    const scope = allScopes.find((s) => s.name === scopeName);

    if (!scope) {
      return null;
    }

    // Filter to find the global for this scope
    const global = allGlobals.find((g) => g.scopeId === scope.id);

    if (!global) {
      return null;
    }

    // Return the whole global object with proper typing based on type field
    return global as GlobalRecord;
  });
