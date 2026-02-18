// src/lib/auth.ts  (CLI-only file)
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/sqlite-proxy";

// This proxy never executes SQL — it's just enough for the CLI.
const db = drizzle(async (sql, params, method) => {
  console.warn(`[BetterAuth CLI] SQLite proxy received query`, {
    sql,
    params,
    method,
  });
  return {
    rows: [],
  };
});

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite" }),

  // Enable whatever features you want everything typed for:
  emailAndPassword: { enabled: true },
});
